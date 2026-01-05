# 🚀 OrderKhata - Live Deployment Guide

## Quick Deployment Options

### Option 1: Deploy to Render (Recommended - FREE)

#### Backend Deployment:
1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `orderkhata-api`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node backend/server.js`
     - Instance Type: `Free`

3. **Add Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://admin:user123!@cluster0.qynyeiq.mongodb.net/?appName=Cluster0
   JWT_SECRET=orderkhata_secret_key_2026_change_this
   NODE_ENV=production
   PORT=5000
   ```

4. **Copy Backend URL** (e.g., `https://orderkhata-api.onrender.com`)

#### Frontend Deployment:
1. **Update API URL**
   - In `client/src/utils/api.js`, change:
   ```javascript
   const BASE_URL = 'https://orderkhata-api.onrender.com/api';
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "Add New" → "Project"
   - Import your GitHub repo
   - Configure:
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `build`

3. **Done!** Your app is live at `https://your-app.vercel.app`

---

### Option 2: Deploy to Railway (Faster Setup)

1. **Go to https://railway.app**
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your OrderKhata repository
5. Add environment variables (same as above)
6. Railway will auto-deploy both backend and frontend

---

### Option 3: Manual Server Deployment (VPS/DigitalOcean)

If you have your own server:

```bash
# On your server (Ubuntu/Debian):
sudo apt update
sudo apt install nodejs npm nginx

# Clone your repo
git clone <your-repo-url>
cd OrderKhata

# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
cd client
npm run build
cd ..

# Install PM2 for process management
npm install -g pm2

# Start backend
pm2 start backend/server.js --name orderkhata-api

# Configure Nginx to serve frontend and proxy API
sudo nano /etc/nginx/sites-available/orderkhata

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/OrderKhata/client/build;
        try_files $uri /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/orderkhata /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Save PM2 process
pm2 save
pm2 startup
```

---

## 🎯 Quick Start (No Code Deployment)

### Using Vercel (Frontend) + Render (Backend):

**Step 1: Deploy Backend to Render**
```bash
# In your terminal:
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

Then follow Render instructions above.

**Step 2: Update Frontend API URL**
Update `client/src/utils/api.js` with your Render backend URL.

**Step 3: Deploy Frontend to Vercel**
```bash
cd client
npm run build
npx vercel deploy --prod
```

---

## 📱 SMS Integration (Optional)

To enable real SMS notifications:

### Using Twilio:
1. Sign up at https://www.twilio.com
2. Get Account SID, Auth Token, and Phone Number
3. Add to `.env`:
   ```
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

4. Install Twilio SDK:
   ```bash
   npm install twilio
   ```

5. Uncomment SMS code in `backend/routes/orders.js`

### Using MSG91 (India):
1. Sign up at https://msg91.com
2. Get API Key
3. Add to `.env`:
   ```
   MSG91_API_KEY=your_api_key
   MSG91_SENDER_ID=ORDKHTA
   ```

---

## 🔒 Security Checklist

Before going live:
- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable CORS only for your frontend domain
- [ ] Use HTTPS (Render/Vercel provide this automatically)
- [ ] Set NODE_ENV=production
- [ ] Add rate limiting (optional)
- [ ] Backup MongoDB Atlas database regularly

---

## 🌐 Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your domain (e.g., orderkhata.com)
3. Update DNS records as instructed

### For Render:
1. Go to Service Settings → Custom Domains
2. Add your domain
3. Update DNS CNAME record

---

## ✅ Post-Deployment Testing

1. Visit your live URL
2. Create test accounts (wholesaler + retailer)
3. Place test orders
4. Check console logs for SMS notifications
5. Verify database updates in MongoDB Atlas

---

## 🆘 Troubleshooting

**"Cannot connect to database"**
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud deployments)
- Verify MONGODB_URI in environment variables

**"CORS error"**
- Update CORS settings in `backend/server.js` to allow your frontend domain

**"Build failed"**
- Run `npm install` locally first
- Check Node.js version compatibility

---

## 📊 Monitor Your App

- **Render**: Built-in logs and metrics dashboard
- **Vercel**: Analytics and logs in project dashboard
- **MongoDB Atlas**: Database monitoring and performance metrics

---

**Your app is ready for production! 🎉**

Choose one deployment method above and follow the steps. The easiest is Render (backend) + Vercel (frontend).
