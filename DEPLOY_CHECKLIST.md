# 🚀 AIRO 6.0 - Quick Deployment Checklist

## Before Deployment

- [ ] All code committed to GitHub
- [ ] `.env` file NOT committed (should be in .gitignore)
- [ ] Dependencies are in `package.json`
- [ ] Build works locally: `npm run build`
- [ ] Vercel account created

## Step-by-Step Deployment

### 1️⃣ Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2️⃣ Go to Vercel
1. Visit: https://vercel.com/new
2. Click "Import Project"
3. Select: `HEMANTH2208/AIRO-6.0`
4. Click "Import"

### 3️⃣ Configure Settings

**Framework:** Next.js ✅ (auto-detected)

**Root Directory:** `./` ✅

**Build Command:** `npm run build` ✅

**Environment Variables:** Click "Add" for each:

```
DATABASE_URL = postgresql://your-db-url (or use Vercel Postgres)
ADMIN_EMAIL = admin@airo6.com
ADMIN_PASSWORD = YourSecurePassword123!
JWT_SECRET = (generate with: openssl rand -base64 32)
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### 4️⃣ Deploy
- Click "Deploy"
- Wait 2-5 minutes
- ✅ Done!

## After Deployment

### Immediate Tasks

- [ ] Visit your deployed URL
- [ ] Test homepage loads
- [ ] Test navigation
- [ ] Seed database: Visit `/api/seed`
- [ ] Test admin login
- [ ] Test registration form

### Database Setup (Choose One)

**Option A: Vercel Postgres (Recommended)**
1. In Vercel Dashboard → Storage
2. Create Postgres Database
3. Automatically adds DATABASE_URL
4. Run: `npx prisma migrate deploy`

**Option B: Supabase (Free)**
1. Create account: https://supabase.com
2. Create project
3. Copy connection string
4. Add to Vercel env vars

**Option C: PlanetScale (MySQL)**
1. Create account: https://planetscale.com
2. Create database
3. Update schema to MySQL
4. Add connection string

### Update Prisma for Production

If using PostgreSQL, update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Then run:
```bash
npx prisma generate
npx prisma db push
```

## Testing Checklist

### Frontend
- [ ] Home page displays correctly
- [ ] Events page shows all 6 events
- [ ] Individual event pages work
- [ ] About page loads
- [ ] Contact page loads
- [ ] Mobile responsive design works

### Registration
- [ ] Registration form loads
- [ ] Event selection works
- [ ] Team size validation works
- [ ] Form submission works
- [ ] QR code generates
- [ ] Success page displays

### Admin Panel
- [ ] Admin login page works
- [ ] Can login with credentials
- [ ] Dashboard displays stats
- [ ] Navigation works

### API Endpoints
- [ ] `/api/events` returns events
- [ ] `/api/register` accepts registrations
- [ ] `/api/admin/login` authenticates
- [ ] `/api/seed` creates initial data

## Common Issues & Solutions

### ❌ Build Failed
**Error:** Cannot find module
**Fix:** `npm install` then commit `package-lock.json`

### ❌ Database Error
**Error:** Cannot connect to database
**Fix:** Check DATABASE_URL is correct and accessible

### ❌ Environment Variables Not Working
**Fix:** 
1. Go to Vercel Dashboard
2. Settings → Environment Variables
3. Add to all environments (Production, Preview, Development)
4. Redeploy

### ❌ 500 Internal Server Error
**Fix:**
1. Check Vercel logs: `vercel logs`
2. Look for error messages
3. Fix code and redeploy

## Performance Optimization

- [ ] Enable Vercel Analytics
- [ ] Configure caching headers (done in vercel.json)
- [ ] Optimize images
- [ ] Enable compression

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Use HTTPS (automatic on Vercel)
- [ ] Enable security headers (done in vercel.json)
- [ ] Database credentials secured

## Custom Domain (Optional)

1. Go to Vercel Dashboard
2. Project → Settings → Domains
3. Add your domain
4. Update DNS records:
   - Type: A
   - Name: @
   - Value: 76.76.21.21 (Vercel IP)
5. Wait for DNS propagation (5-30 minutes)

## Continuous Deployment

✅ **Automatic:** Every push to `main` branch auto-deploys

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys!
```

## Monitoring

### Check Deployment Status
```bash
vercel ls
```

### View Logs
```bash
vercel logs
```

### Analytics
- Go to Vercel Dashboard
- Click "Analytics" tab
- Monitor traffic and performance

## 🎉 Success Criteria

✅ Website accessible at Vercel URL
✅ All pages load without errors
✅ Admin can login
✅ Users can register
✅ QR codes generate
✅ Database connected
✅ No console errors
✅ Mobile responsive

## URLs After Deployment

- **Frontend:** https://airo-6-0.vercel.app
- **Admin:** https://airo-6-0.vercel.app/admin
- **API:** https://airo-6-0.vercel.app/api
- **Seed:** https://airo-6-0.vercel.app/api/seed

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Discord: https://vercel.com/discord
- Project Issues: https://github.com/HEMANTH2208/AIRO-6.0/issues

---

**Estimated Time:** 15-30 minutes for first deployment

**Cost:** Free tier available (sufficient for most use cases)

✨ **Good luck with your deployment!**
