# Block Arena

Block Arena is a real-time multiplayer web application where authenticated users claim and release cells on a shared 20x20 grid. The product combines a React/Vite frontend with an Express/Socket.IO backend, MongoDB persistence, and Redis-backed rate limiting for production traffic control.

The project is structured as a split frontend/backend deployment:

- `client/` is a static SPA deployed to Vercel
- `server/` is a Node.js API + WebSocket service deployed to Railway
- MongoDB stores users and block ownership state
- Redis enforces per-user claim throttling in production

## Why This Project Exists

The app is intentionally small in feature scope but strong in interaction design and systems behavior. It demonstrates:

- authenticated real-time collaboration
- atomic ownership updates on shared state
- practical separation between REST and WebSocket responsibilities
- deployable production topology using common managed services

## Key Features

- User registration and login with JWT-based authentication
- Profile hydration on app load using persisted access tokens
- Required color selection before gameplay
- Real-time block claim and release updates across all connected clients
- Per-user ownership enforcement on release
- Redis-backed rate limiting for rapid claim spam protection
- Live activity feed for recent claim and release events
- Production-ready split deployment pattern for Vercel + Railway

## Architecture

### High-Level System Design

```text
Browser (React + Vite SPA)
  |-- REST: /api/auth, /api/users
  |-- WebSocket: Socket.IO events
  v
Express API + Socket.IO Server
  |-- Auth + validation
  |-- Block ownership service
  |-- Rate limiting
  v
MongoDB (users, blocks)     Redis (claim throttling)
```

### Request/Realtime Flow

1. A user registers or logs in through the REST API.
2. The server signs a JWT and returns a sanitized user payload.
3. The frontend stores the token in `localStorage` and hydrates the current user via `/api/auth/me`.
4. Once the user has selected a color, the client opens a Socket.IO connection with the token in the handshake.
5. The server authenticates the socket, loads the grid on `grid:init`, and emits `grid:data`.
6. When the user claims a block, the server:
   - authenticates the socket user
   - applies rate limiting
   - performs an atomic MongoDB update only if the block is still unowned
   - broadcasts the resulting `block:update` event to every client
7. When the owner releases a block, the server clears ownership and broadcasts the release event.

### Why REST and WebSockets Are Split

This split is deliberate:

- REST is used for identity and profile mutation because it is request/response oriented and easy to validate.
- WebSockets are used for grid state changes because all connected clients need to receive updates immediately.
- Keeping auth/profile flows out of the socket layer reduces complexity and keeps the event surface small.

## Tech Stack

### Frontend

- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4
- Socket.IO Client

### Backend

- Node.js 20
- Express 5
- Socket.IO
- MongoDB with Mongoose
- Redis with `ioredis`
- `rate-limiter-flexible`
- JWT with `jsonwebtoken`
- `bcryptjs` for password hashing

### Infrastructure

- Vercel for frontend hosting
- Railway for backend hosting
- MongoDB Atlas for primary persistence
- Upstash Redis or equivalent managed Redis for rate limiting

## Why This Particular Stack

### React + Vite

React is a pragmatic choice for a stateful interactive UI, and Vite keeps local iteration fast without adding framework-level complexity. This project does not need SSR, server components, or edge rendering, so a client-rendered SPA is the right tradeoff.

### Express + Socket.IO

The backend needs both conventional HTTP endpoints and bidirectional realtime communication. Express handles the REST surface cleanly, while Socket.IO simplifies connection management, reconnection behavior, and event-based broadcasting compared to hand-rolled WebSocket infrastructure.

### MongoDB

The domain model is simple:

- `User`
- `Block`

MongoDB is a good fit because block ownership updates are naturally document-oriented and the grid size is small. The code relies on MongoDB’s atomic `findOneAndUpdate` behavior to prevent double-claims.

### Redis

Rate limiting is one of the few cross-request coordination problems in this app. Redis is introduced only for that purpose. This keeps the primary data model in MongoDB while using the right tool for burst control.

## Folder Structure

```text
.
|-- client/
|   |-- public/
|   |-- src/
|   |   |-- components/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- utils/
|   |   |-- App.jsx
|   |   |-- main.jsx
|   |-- .env.example
|   |-- vercel.json
|   |-- package.json
|
|-- server/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- scripts/
|   |   |-- services/
|   |   |-- sockets/
|   |   |-- utils/
|   |   |-- app.js
|   |   |-- server.js
|   |-- .env.example
|   |-- Procfile
|   |-- railway.json
|   |-- package.json
|
|-- DEPLOYMENT.md
|-- PROD_CHECKLIST.md
|-- README.md
```

## Frontend Design

### Frontend Runtime Responsibilities

- route users between landing, auth, color selection, and arena screens
- persist the access token client-side
- hydrate the current user on reload
- connect to the realtime channel only when the user is authenticated and has selected a color
- render the grid and recent event feed

### Frontend State Model

The frontend intentionally uses lightweight React primitives instead of a global state library:

- `useAuth` manages token lifecycle and user profile state
- `useGrid` manages grid data, socket listeners, status messages, and live feed data

This keeps the app easy to reason about and avoids unnecessary abstraction for a relatively contained state graph.

## Backend Design

### API Surface

REST endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/users/me/preferences`
- `GET /health`

Socket events:

- client to server
  - `grid:init`
  - `block:claim`
  - `block:release`
- server to client
  - `grid:data`
  - `block:update`
  - `block:failed`

### Data Models

#### User

- `username`
- `email`
- `passwordHash`
- `color`
- timestamps

#### Block

- `_id` formatted as `row-col`
- `ownerId`
- `color`
- `claimedAt`

### Grid Seeding Strategy

The grid is lazily initialized by `ensureGridSeeded()` on server startup flows that need it. If no blocks exist, the service creates the full 20x20 board.

This is intentionally simple and operationally convenient for a small application:

- no migration framework is required
- the app can recover an empty blocks collection automatically
- startup and claim flows do not depend on manual DB prep

## Key Engineering Decisions

### 1. Atomic Block Claims

Claiming a block is implemented as a conditional MongoDB update:

- only update if `ownerId` is currently `null`
- if the update succeeds, the claimant wins
- if it fails, the server returns `already_claimed`

This is the core concurrency guarantee in the app. It prevents two users from successfully claiming the same block even when they click at nearly the same time.

### 2. Ownership Enforcement on Release

Releases are only allowed when `existingBlock.ownerId === userId`. This keeps the write model simple and prevents griefing by non-owners.

### 3. Socket Authentication at Connection Time

Sockets are authenticated once via JWT handshake middleware, and a small user object is attached to `socket.user`. This avoids repeatedly querying auth state inside every event handler beyond the initial middleware boundary.

### 4. Redis Required in Production, Optional in Local Development

This is a pragmatic compromise:

- local development can run without Redis
- production refuses to silently operate without the intended protection layer

That decision is appropriate for a project where developer convenience matters but abuse resistance in production still matters.

### 5. Sanitized User Payloads

The backend consistently returns a sanitized user shape instead of raw model objects. This reduces accidental leakage of password hashes or Mongoose-specific fields.

## Tradeoffs

### Good Tradeoffs Chosen Here

- Simple deployment model over platform complexity
- Lightweight React hooks over adding Redux/Zustand prematurely
- MongoDB atomic document updates over introducing distributed locks
- Socket-driven realtime sync over expensive polling loops

### Current Tradeoffs and Limitations

- JWT is stored in `localStorage`, which is simple but weaker than secure HTTP-only cookies against XSS exposure.
- The app has no automated tests yet, so confidence relies on manual verification.
- The grid size is fixed to 20x20 and not yet tenantable or configurable.
- There is aggregation support for leaderboard-style features, but no API or UI currently exposes it.
- The backend keeps event semantics simple, but does not yet include structured observability, metrics, or tracing.
- Rate limit parameters are currently hardcoded in code, even though `.env.example` suggests configurable values.

## How to Run the Project Locally

### Prerequisites

- Node.js 20+
- npm
- MongoDB instance
- Redis instance if you want production-like rate limiting behavior

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd Block-Arena

cd server
npm install

cd ../client
npm install
```

### 2. Configure Environment Variables

Backend: create `server/.env`

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/block-arena
CLIENT_URL=http://localhost:5173
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
REDIS_URL=redis://localhost:6379
```

Frontend: create `client/.env.local`

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start the Backend

```bash
cd server
npm run dev
```

### 4. Start the Frontend

```bash
cd client
npm run dev
```

### 5. Open the App

Frontend:

```text
http://localhost:5173
```

Health check:

```text
http://localhost:5000/health
```

## Deployment

### Recommended Production Topology

- Frontend on Vercel
- Backend on Railway
- MongoDB Atlas for database
- Managed Redis for rate limiting

### Frontend Deployment Notes

- Set Vercel root directory to `client`
- Build command: `npm run build`
- Output directory: `dist`
- Configure:
  - `VITE_API_URL`
  - `VITE_SOCKET_URL`
- `client/vercel.json` includes SPA fallback routing so direct loads of `/auth` and `/arena` work correctly

### Backend Deployment Notes

Set these variables on Railway:

- `MONGO_URI`
- `CLIENT_URL`
- `CORS_ORIGINS`
- `JWT_SECRET`
- `NODE_ENV=production`
- `REDIS_URL`

### Deployment Order

1. Deploy backend first and obtain the public URL
2. Configure frontend environment variables using the backend URL
3. Deploy frontend
4. Update backend `CLIENT_URL` and `CORS_ORIGINS` to the final Vercel domain
5. Validate auth, grid sync, claim, release, and reconnect behavior

For step-by-step deployment instructions, see `DEPLOYMENT.md` and `PROD_CHECKLIST.md`.

## Scaling Considerations

The current implementation is appropriate for a small-to-medium real-time app, but scaling beyond that requires a few deliberate upgrades.

### What Already Scales Reasonably Well

- MongoDB conditional updates are sufficient for single-document ownership contention
- The grid state is compact
- Socket event payloads are small
- Redis-based throttling reduces abuse and burst pressure

### Where Scaling Pressure Will Appear

- A single Socket.IO server becomes a bottleneck under high concurrent connection counts
- Multi-instance socket deployments will require a shared adapter such as Redis Pub/Sub
- Broadcasting every block update to every client is simple, but wasteful at larger scale
- `localStorage` auth does not support stronger enterprise-style session controls
- Lack of caching and pagination is acceptable now, but would matter once leaderboards and histories grow

### Likely Next Scaling Steps

- add a Socket.IO Redis adapter for horizontal scaling
- partition or room-scope grid events if the board becomes larger or sharded
- move rate limiter settings to environment-driven configuration
- add observability: structured logs, metrics, error reporting, tracing
- introduce automated tests and CI before aggressive iteration

## Security Notes

- Passwords are hashed with `bcryptjs`
- JWTs expire after 1 day
- REST and socket entry points both require token validation
- CORS is explicitly allowlisted rather than left open

Current limitation:

- token storage is client-side in `localStorage`; for stronger production security, move to secure HTTP-only cookies with CSRF-aware flows

## Future Improvements

- leaderboard API and UI using the existing aggregation capability
- automated unit and integration tests
- end-to-end browser tests for auth and realtime flows
- optimistic UI with rollback behavior for faster perceived interaction
- reconnect awareness and replay/resync strategy after temporary socket disruption
- admin tooling for resetting or resizing the grid
- environment-configurable grid size
- stronger session management and refresh token flow
- activity history persistence instead of in-memory client feed only
- structured observability and alerting

## Code Review Summary

This README is based on the current implementation, not an aspirational design. The codebase is strongest in these areas:

- clear separation of frontend and backend concerns
- correct use of atomic updates for contested claims
- pragmatic use of Socket.IO for realtime synchronization
- deployment shape that matches the app’s actual needs

The main engineering gaps still open are:

- no automated tests
- no CI pipeline
- no public leaderboard endpoint despite service support
- security/session model can be improved beyond `localStorage`
- some deployment docs mention env-driven rate-limit settings that the current code does not yet consume

## Repository Notes

- Keep real `.env` files out of Git
- Commit `.env.example` files only
- If a real env file was previously tracked, remove it from Git history/index before pushing

## License

No license is currently declared in the repository. Add one before open-source distribution or public reuse.
