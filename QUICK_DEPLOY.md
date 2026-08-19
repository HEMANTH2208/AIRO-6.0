# ⚡ AIRO 6.0 - 5-Minute Deployment

## The Fastest Way to Deploy

### 1. Push to GitHub (1 min)
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

### 2. Import to Vercel (2 min)

**Go to:** https://vercel.com/new

1. Click **"Import Git Repository"**
2. Select **"HEMANTH2208/AIRO-6.0"**
3. Click **"Import"**

### 3. Add Environment Variables (2 min)

Click **"Environment Variables"** and paste:

```bash
DATABASE_URL=file:./prisma/dev.db
ADMIN_EMAIL=admin@airo6.com
ADMIN_PASSWORD=Admin@AIRO6
JWT_SECRET=airo6-secret-change-in-production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### 4. Deploy (Auto)

Click **"Deploy"** → Wait → Done! 🎉

**Your URL:** https://airo-6-0-[unique-id].vercel.app

---

## ⚠️ Important Post-Deploy

### A. Seed Database
Visit: `https://your-url.vercel.app/api/seed`

### B. Test Login
- Go to: `https://your-url.vercel.app/admin`
- Email: `admin@airo6.com`
- Password: `Admin@AIRO6`

---

## 🚨 For Production (Later)

1. **Use Real Database:** Replace SQLite with PostgreSQL
   - Vercel Postgres
   - Supabase
   - PlanetScale

2. **Change Secrets:**
   ```bash
   JWT_SECRET=run-this: openssl rand -base64 32
   ADMIN_PASSWORD=YourSecurePassword123!
   ```

3. **Update URL:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-actual-domain.com
   ```

---

## ✅ That's It!

Your AIRO 6.0 website is now live on the internet!

**Share it:** Copy your Vercel URL and share with your team

**Customize:** Add custom domain in Vercel settings (optional)

**Monitor:** Check Vercel Dashboard for analytics and logs

---

## 🆘 Quick Troubleshoot

**Site not loading?**
- Check Vercel deployment logs
- Verify all environment variables are added
- Try redeploying

**Database errors?**
- SQLite works for testing but not ideal for production
- Switch to PostgreSQL for production use

**Need help?**
- Read: `DEPLOYMENT_GUIDE.md` (detailed guide)
- Check: `DEPLOY_CHECKLIST.md` (step-by-step)

---

**Time Taken:** ~5 minutes
**Difficulty:** Easy
**Cost:** Free (Vercel free tier)

🚀 **Happy Deploying!**
