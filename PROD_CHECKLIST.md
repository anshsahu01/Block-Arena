# Production Deployment Checklist

## Files Created/Updated for Deployment

### Backend Changes
- ✅ `server/package.json` - Added Node 20.x engine specification
- ✅ `server/.env.example` - Documented all required environment variables
- ✅ `server/Procfile` - Tells Railway how to start the app
- ✅ `server/railway.json` - Railway-specific deployment configuration

### Frontend Changes
- ✅ `client/.env.local` - Development environment (localhost:5001)
- ✅ `client/.env.production` - Production environment (Railway domain)
- ✅ `client/vite.config.js` - Already configured (no changes needed)

### Documentation
- ✅ `DEPLOYMENT.md` - Complete deployment guide with Railway & Vercel steps

---

## Railway Backend Deployment Checklist

### Before Deployment
- [ ] Ensure `server/package.json` has `"type": "module"` for ES modules
- [ ] Verify `server/Procfile` exists with `web: node src/server.js`
- [ ] Confirm all dependencies in `package.json` are listed
- [ ] Test locally: `npm start` works without errors

### Environment Variables to Set (Railway Dashboard)
```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/block-arena
CLIENT_URL = https://your-app.vercel.app
CORS_ORIGINS = https://your-app.vercel.app
JWT_SECRET = <generate-strong-random-string>
NODE_ENV = production
```

### After Deployment
- [ ] Get Railway backend URL (e.g., `https://block-arena-prod.up.railway.app`)
- [ ] Test health endpoint: `GET https://your-railway-url/health`
- [ ] Note down the backend URL for frontend configuration

---

## Vercel Frontend Deployment Checklist

### Before Deployment
- [ ] Run `npm run build` locally and verify `dist/` folder creates successfully
- [ ] Check `client/.env.production` has correct Railway backend URL
- [ ] Ensure GitHub repo is pushed with all changes

### Deployment Steps
- [ ] Connect GitHub repository to Vercel
- [ ] Set root directory: `client/`
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Add environment variables if needed (Vite reads from .env files automatically)
- [ ] Deploy!

### After Deployment
- [ ] Get Vercel frontend URL (e.g., `https://block-arena.vercel.app`)
- [ ] Update Railway `CLIENT_URL` and `CORS_ORIGINS` with Vercel frontend URL
- [ ] Test application:
  - [ ] Login/Register works
  - [ ] Grid loads correctly
  - [ ] Block claiming works
  - [ ] Block unclaiming works
  - [ ] Live feed updates in real-time
  - [ ] Logout works

---

## Key Environment Variables

| Variable | Backend | Frontend | Example |
|----------|---------|----------|---------|
| `VITE_API_URL` | ❌ | ✅ | `https://block-arena-prod.up.railway.app/api` |
| `VITE_SOCKET_URL` | ❌ | ✅ | `https://block-arena-prod.up.railway.app` |
| `MONGO_URI` | ✅ | ❌ | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `CLIENT_URL` | ✅ | ❌ | `https://block-arena.vercel.app` |
| `CORS_ORIGINS` | ✅ | ❌ | `https://block-arena.vercel.app` |
| `JWT_SECRET` | ✅ | ❌ | `<random-256-bit-string>` |
| `NODE_ENV` | ✅ | ❌ | `production` |

---

## Production URLs Pattern

```
Frontend: https://your-app.vercel.app
  ├── API calls to: https://your-backend.up.railway.app/api
  └── Socket.IO connects to: https://your-backend.up.railway.app

Backend: https://your-backend.up.railway.app
  ├── Accepts requests from: https://your-app.vercel.app
  ├── CORS enabled for: https://your-app.vercel.app
  └── MongoDB: mongodb+srv://...mongodb.net/block-arena
```

---

## Important Notes

1. **Environment Variables**: Never commit `.env` files. Use `.env.example` as template.
2. **HTTPS Required**: Socket.IO over HTTPS (wss://) requires proper SSL certificates. Railway and Vercel provide these automatically.
3. **Secrets Management**: Use platforms' secret/environment variable managers (not Git).
4. **Testing**: Always test thoroughly before marking as production-ready.
5. **Monitoring**: Set up logging to catch issues in production (Railway has integrated logging).

---

## If Something Goes Wrong

1. Check Railway logs: Dashboard → Your App → Logs
2. Check Vercel logs: Dashboard → Your Project → Deployments
3. Open browser DevTools → Network tab to see actual API calls
4. Check browser Console for JavaScript errors
5. Verify environment variables are set correctly
6. Test MongoDB connection string with MongoDB Compass locally
7. Ensure CORS headers are correct in responses
