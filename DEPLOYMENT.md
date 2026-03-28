# Block Arena - Deployment Guide

## Deployment Architecture
- **Frontend**: Deployed on Vercel
- **Backend**: Deployed on Railway
- **Database**: MongoDB Atlas (remote)

---

## Backend Deployment (Railway)

### Prerequisites
1. Railway account (https://railway.app)
2. MongoDB Atlas account with connection string
3. Backend repository on GitHub

### Step 1: Set Up MongoDB Atlas
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/block-arena`
4. Add your Railway IP to whitelist (or use 0.0.0.0/0 for development)

### Step 2: Deploy Backend on Railway
1. Go to [Railway Dashboard](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/block-arena
   CLIENT_URL=https://your-frontend-domain.vercel.app
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   JWT_SECRET=generate-a-strong-random-secret-here
   NODE_ENV=production
   ```
5. Railway will auto-detect the app and deploy via `npm start`
6. Your backend URL will be: `https://your-project.up.railway.app`

### Step 3: Get Railway Backend URL
- After deployment, Railway generates a public URL
- Copy this URL (e.g., `https://block-arena-prod.up.railway.app`)

---

## Frontend Deployment (Vercel)

### Prerequisites
1. Vercel account (https://vercel.com)
2. Frontend repository on GitHub

### Step 1: Update Environment Variables
Replace `https://your-railway-domain.up.railway.app` in `client/.env.production`:
```
VITE_API_URL=https://your-railway-domain.up.railway.app/api
VITE_SOCKET_URL=https://your-railway-domain.up.railway.app
```

### Step 2: Deploy on Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Set root directory: `client/`
5. Build command: `npm run build`
6. Output directory: `dist`
7. Environment variables (optional, can use .env.production):
   ```
   VITE_API_URL=https://your-railway-domain.up.railway.app/api
   VITE_SOCKET_URL=https://your-railway-domain.up.railway.app
   ```
8. Click "Deploy"

### Step 3: Get Vercel Frontend URL
- After deployment, Vercel generates a URL like `https://your-app.vercel.app`

---

## Post-Deployment Steps

### Update Backend CORS
After you have the Vercel frontend URL, update Railway environment variables:
```
CLIENT_URL=https://your-app.vercel.app
CORS_ORIGINS=https://your-app.vercel.app
```

### Update Frontend Socket URLs
If needed, update `client/.env.production` with your Railway backend URL.

### Test Connection
1. Visit your Vercel frontend URL
2. Login/Register a user
3. Try claiming a block
4. Check live feed updates (tests real-time connection)
5. Try unclaiming a block

---

## Environment Variables Checklist

### Backend (Railway)
- [ ] `MONGO_URI` - MongoDB connection string
- [ ] `CLIENT_URL` - Vercel frontend URL
- [ ] `CORS_ORIGINS` - Vercel frontend URL (comma-separated if multiple)
- [ ] `JWT_SECRET` - Strong random string (use `openssl rand -base64 32`)
- [ ] `NODE_ENV` - Set to `production`
- [ ] `PORT` - Optional (Railway assigns automatically)

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Railway backend API URL (with /api suffix)
- [ ] `VITE_SOCKET_URL` - Railway backend URL (without /api suffix)

---

## Monitoring & Debugging

### Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Check deployment history
- Environment variables management

### Vercel Dashboard
- View deployment logs
- Check build output
- Monitor analytics
- Manage environment variables

### Common Issues

**CORS Errors**
- Verify `CLIENT_URL` matches exactly your Vercel domain
- Check `CORS_ORIGINS` in Railway environment
- Ensure frontend is using correct `VITE_SOCKET_URL`

**Socket Connection Failed**
- Check `VITE_SOCKET_URL` points to correct Railway domain
- Use HTTPS (not HTTP) for production
- Check network tab in browser DevTools

**Database Connection Failed**
- Verify MongoDB Atlas connection string is correct
- Check IP whitelist includes Railway servers (0.0.0.0/0 or Railway's IP)
- Test connection string locally first

**JWT Errors**
- Ensure `JWT_SECRET` is set on Railway
- Use strong random string (not predictable)

---

## Additional Resources

- [Railway Docs](https://docs.railway.app)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Socket.IO CORS Guide](https://socket.io/docs/v4/handling-cors/)
REDIS_URL=redis://default:YOUR_UPSTASH_PASSWORD@YOUR_UPSTASH_HOST:PORT
```

### 3. Deploy to Render

#### Create Web Service:
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - **Name:** `block-arena-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm run dev` or `node src/server.js`
   - **Plan:** Free tier works

#### Add Environment Variables:
In Render dashboard → Environment:
```
PORT=5000
MONGO_URI=<your_mongodb_atlas_url>
CLIENT_URL=https://your-vercel-domain.vercel.app
JWT_SECRET=<long-random-secret>
REDIS_URL=<your_upstash_redis_url>
```

#### Deploy:
- Commit changes to GitHub
- Render auto-deploys on push

### 4. Deploy Frontend to Vercel

#### Create Vite environment file: `.env.production`
```
VITE_API_URL=https://your-render-api.onrender.com/api
VITE_SOCKET_URL=https://your-render-api.onrender.com
```

#### Deploy:
```bash
npm run build
# Deploy dist/ folder to Vercel via CLI or GitHub
```

## Rate Limiting Configuration

### Current Settings (Adjustable)

**File:** `server/src/utils/rate-limit.js`

```javascript
points: 5,           // 5 claims allowed
duration: 1,         // per 1 second
inMemoryBlockOnConsumed: 5,      // Cache hit for speed
inMemoryBlockDurationMs: 1000,   // Cache duration
keyPrefix: "block:claim:",       // Redis key pattern
```

### To Adjust:

```javascript
// More lenient: 10 claims per 2 seconds
points: 10,
duration: 2,

// Stricter: 3 claims per 1 second
points: 3,
duration: 1,
```

## Testing

### Local Development:

1. Install Redis locally (Docker recommended):
```bash
docker run -d -p 6379:6379 redis
```

2. Start backend:
```bash
npm run dev
```

3. Start frontend:
```bash
npm run dev
```

4. Test at `http://localhost:5173`

### Rate Limit Test:
- Rapidly click blocks
- After 5 clicks/sec, see: "Clicking too fast. Please slow down."

## Monitoring

### Check Redis Connection:
```bash
redis-cli -u $REDIS_URL ping
# Should return: PONG
```

### View Rate Limit Keys:
```bash
redis-cli -u $REDIS_URL KEYS "block:claim:*"
```

### Monitor Render Logs:
```bash
# Shows Redis connection status and rate limit activity
[Redis] Connected to rate limiter
[Rate Limiter] Blocked user abc123, 2 points remaining
```

## Troubleshooting

### "REDIS_URL not set"
- **Local:** Add `redis://localhost:6379` to `.env`
- **Production:** Add REDIS_URL to Render/Railway environment variables

### "Redis Connection Error"
- Check Upstash database is running
- Verify IP whitelist (Upstash → Settings)
- Ensure URL format: `redis://default:PASSWORD@HOST:PORT`

### Rate Limit Not Working
- Check Redis is connected (see logs)
- If Redis down, falls back to allowing all (development mode)
- Verify `REDIS_URL` is correct

### WebSocket Connection Issues
- `VITE_SOCKET_URL` must match backend URL
- Use absolute HTTPS URLs for production
- In Render, get your URL from dashboard

## Production Checklist

- [ ] Redis Upstash database created
- [ ] REDIS_URL added to Render/Railway environment
- [ ] JWT_SECRET set to strong random value
- [ ] DATABASE credentials (MongoDB, Redis) are production instances
- [ ] CLIENT_URL in backend matches Vercel frontend domain
- [ ] VITE_API_URL and VITE_SOCKET_URL in frontend match Render backend domain
- [ ] Backend deployed to Render/Railway
- [ ] Frontend deployed to Vercel
- [ ] Test auth flow (register, login, color selection)
- [ ] Test block claiming with multiple browser windows
- [ ] Rate limiter tested (rapid clicks should be throttled)

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | Yes | Free (up to limits) |
| Render | Yes | Free or $7-12/month |
| MongoDB Atlas | Yes | Free (512MB) |
| Upstash | Yes | Free (10K cmds/day) |
| **Total** | **Yes** | **Free-$15/month** |

All services offer free tiers suitable for this project!
