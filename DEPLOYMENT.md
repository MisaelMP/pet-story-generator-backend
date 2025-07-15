# Deployment Guide

## Backend Deployment (Heroku)

### Prerequisites
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Create a Heroku account

### Steps
1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd pet-story-generator-backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set OPENAI_API_KEY=your-openai-api-key
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-vercel-app.vercel.app
   heroku config:set XANO_BASE_URL=your-xano-url
   heroku config:set XANO_API_KEY=your-xano-key
   heroku config:set PIMS_BASE_URL=https://api.mybalto.com/api:D60OKSek
   heroku config:set PIMS_API_KEY=your-pims-key
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Verify Deployment**
   ```bash
   heroku logs --tail
   heroku open
   ```

## Frontend Deployment (Vercel)

### Prerequisites
1. Install [Vercel CLI](https://vercel.com/cli) (optional)
2. Create a Vercel account

### Method 1: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Import Project"
4. Select your GitHub repository
5. Configure build settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Set environment variables:
   - `VITE_BACKEND_PROXY_URL`: `https://your-heroku-app.herokuapp.com`
   - `VITE_NODE_ENV`: `production`
7. Click "Deploy"

### Method 2: Vercel CLI
1. **Install and Login**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   cd pet-story-generator-assignment
   vercel --prod
   ```

3. **Set Environment Variables** (via dashboard or CLI)
   ```bash
   vercel env add VITE_BACKEND_PROXY_URL
   vercel env add VITE_NODE_ENV
   ```

## Post-Deployment
1. Update `vercel.json` with your actual Heroku app URL
2. Update CORS settings in backend to include Vercel domain
3. Test the full application flow
4. Monitor logs for any issues

## Environment Variables Summary

### Backend (Heroku Config Vars)
- `OPENAI_API_KEY` (required)
- `NODE_ENV=production`
- `FRONTEND_URL` (your Vercel app URL)
- `XANO_BASE_URL` (optional)
- `XANO_API_KEY` (optional)
- `PIMS_BASE_URL` (optional)
- `PIMS_API_KEY` (optional)

### Frontend (Vercel Environment Variables)
- `VITE_BACKEND_PROXY_URL` (your Heroku app URL)
- `VITE_NODE_ENV=production`
