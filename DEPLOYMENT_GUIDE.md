# AIRO 6.0 - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your code pushed to GitHub

---

## Method 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to https://vercel.com and sign in
2. Click **"Add New Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repository: `HEMANTH2208/AIRO-6.0`
5. Click **"Import"**

### Step 3: Configure Project

Vercel will auto-detect Next.js. Configure these settings:

**Framework Preset:** Next.js (should be auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `npm run build` (auto-filled)

**Output Directory:** `.next` (auto-filled)

**Install Command:** `npm install` (auto-filled)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add:

```
DATABASE_URL=file:./prisma/dev.db
ADMIN_EMAIL=admin@airo6.com
ADMIN_PASSWORD=Admin@AIRO6
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

⚠️ **Important Notes:**
- For production, use a cloud database (PostgreSQL, MySQL, or MongoDB)
- SQLite (`file:./prisma/dev.db`) won't work on Vercel for production
- Change JWT_SECRET to a secure random string

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for deployment (usually 2-5 minutes)
3. Once done, you'll get a URL like: `https://airo-6-0.vercel.app`

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
cd airo-6.0
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No**
- Project name? **airo-6-0** (or your choice)
- Directory? **./` (current directory)
- Override settings? **No**

### Step 4: Add Environment Variables

```bash
vercel env add DATABASE_URL
vercel env add ADMIN_EMAIL
vercel env add ADMIN_PASSWORD
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL
```

### Step 5: Deploy to Production

```bash
vercel --prod
```

---

## 🗄️ Database Setup for Production

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Follow setup wizard
6. Vercel will automatically add `DATABASE_URL` to your environment variables

Then update your Prisma schema:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migrations:
```bash
npx prisma migrate deploy
```

### Option 2: Supabase (Free Tier Available)

1. Sign up at https://supabase.com
2. Create new project
3. Get your connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`
5. Add to Vercel environment variables

### Option 3: PlanetScale (MySQL)

1. Sign up at https://planetscale.com
2. Create database
3. Get connection string
4. Update Prisma schema to use MySQL
5. Add to Vercel environment variables

### Option 4: Railway

1. Sign up at https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

---

## 📝 Post-Deployment Checklist

### 1. Seed Database

After deploying, seed your database:

**Option A: Via API Route**
- Visit: `https://your-app.vercel.app/api/seed`
- This will create admin user and events

**Option B: Via Prisma Studio**
```bash
npx prisma studio
```
Manually add admin user and events

### 2. Test the Application

- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Events page displays all events
- [ ] Registration form works
- [ ] Admin login works
- [ ] QR codes generate properly

### 3. Update Configuration

Update `.env` in your local:
```env
NEXT_PUBLIC_APP_URL=https://your-actual-domain.vercel.app
```

### 4. Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration steps

---

## 🔧 Troubleshooting

### Build Fails

**Error: "Cannot find module '@prisma/client'"**

Solution: Make sure Prisma is in dependencies, not devDependencies:
```bash
npm install @prisma/client --save
```

**Error: "Database connection failed"**

Solution: 
1. Check DATABASE_URL is correct
2. Make sure database is accessible from Vercel
3. For PostgreSQL, use connection pooling URL

### Database Issues

**Error: "SQLite not supported on Vercel"**

Solution: Use PostgreSQL, MySQL, or MongoDB instead. Update schema:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Environment Variables Not Working

Solution:
1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Make sure variables are added to **Production**, **Preview**, and **Development**
4. Redeploy after adding variables

---

## 🎯 Production Best Practices

### 1. Secure Environment Variables

```env
# Use strong passwords
ADMIN_PASSWORD=SuperSecure!Password123

# Use random JWT secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-random-64-character-string-here

# Use production database URL
DATABASE_URL=postgresql://user:password@host:5432/database
```

### 2. Enable Analytics

In Vercel dashboard:
1. Go to Analytics tab
2. Enable Web Analytics
3. Monitor traffic and performance

### 3. Set Up Error Monitoring

Consider integrating:
- Sentry (error tracking)
- LogRocket (session replay)
- Vercel Analytics (built-in)

### 4. Configure Caching

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=1, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update features"
git push origin main
```

Vercel will:
1. Detect the push
2. Build the project
3. Run tests (if configured)
4. Deploy automatically

**Preview Deployments:**
- Every pull request gets a unique preview URL
- Test changes before merging to main

---

## 📊 Monitoring After Deployment

### Check Deployment Status

```bash
vercel ls
```

### View Logs

```bash
vercel logs [deployment-url]
```

### Production URL

Your app will be live at:
- Default: `https://airo-6-0.vercel.app`
- Custom: `https://yourdomain.com`

---

## 🆘 Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- GitHub Issues: https://github.com/HEMANTH2208/AIRO-6.0/issues

---

## 🎉 Success!

Your AIRO 6.0 website should now be live on Vercel!

**Next Steps:**
1. Share the URL with your team
2. Test all features thoroughly
3. Monitor analytics and logs
4. Set up custom domain (optional)
5. Configure email notifications (optional)

**Default URLs:**
- Frontend: `https://your-app.vercel.app`
- Admin Panel: `https://your-app.vercel.app/admin`
- API: `https://your-app.vercel.app/api`

---

*Last Updated: 2026-08-18*
