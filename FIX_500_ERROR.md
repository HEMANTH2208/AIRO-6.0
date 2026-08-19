# 🔧 Fix 500 API Errors on Vercel

## ❌ Problem

You're getting these errors:
```
/api/events:1  Failed to load resource: 500
/api/participant/login:1  Failed to load resource: 500
```

## 🎯 Root Cause

SQLite database doesn't work on Vercel's serverless environment. Your app is trying to access `file:./prisma/dev.db` which doesn't exist on Vercel.

---

## ✅ Solution: Set Up Vercel Postgres (5 minutes)

### Step 1: Create Vercel Postgres Database

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your AIRO-6-0 project
3. Click **"Storage"** tab at the top
4. Click **"Create Database"**
5. Select **"Postgres"**
6. Click **"Continue"**
7. Database will be created automatically

### Step 2: Connect Database to Project

Vercel will automatically:
- Create the PostgreSQL database
- Add `DATABASE_URL` to your environment variables
- Link it to your project

**You don't need to do anything else!** ✅

### Step 3: Update Prisma Schema

Update your `prisma/schema.prisma` file:

**Change this:**
```prisma
datasource db {
  provider = "sqlite"
}
```

**To this:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Update Local Config

Update `prisma.config.ts`:

```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
```

### Step 5: Update Prisma Client

Update `lib/prisma.ts` to remove SQLite-specific code:

```typescript
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

### Step 6: Push Changes

```bash
# Generate Prisma Client
npx prisma generate

# Commit changes
git add prisma/schema.prisma lib/prisma.ts prisma.config.ts
git commit -m "Switch from SQLite to PostgreSQL for Vercel"
git push origin main
```

Vercel will automatically redeploy! ✅

### Step 7: Run Database Migration

After deployment completes:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Copy the `DATABASE_URL` value

Then run locally:

```bash
# Set the DATABASE_URL
export DATABASE_URL="your-vercel-postgres-url"

# Or on Windows
set DATABASE_URL=your-vercel-postgres-url

# Push schema to database
npx prisma db push
```

### Step 8: Seed the Database

Visit your deployed site:
```
https://your-app.vercel.app/api/seed
```

This will create:
- Admin user
- All 6 events

---

## ✅ Verification

After the changes:

1. Visit: `https://your-app.vercel.app/api/events`
   - Should return JSON with events ✅

2. Visit: `https://your-app.vercel.app/admin`
   - Should show login page ✅

3. Try logging in:
   - Email: `admin@airo6.com`
   - Password: `Admin@AIRO6`

4. Visit: `https://your-app.vercel.app/register`
   - Form should load ✅

---

## 🚀 Alternative: Quick Deploy with Postgres

If you want to start fresh:

### Using Vercel CLI:

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project
vercel link

# Add Postgres
vercel postgres create

# Deploy
vercel --prod
```

---

## 🗄️ Alternative Database Options

### Option 2: Supabase (Free)

1. Sign up: https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to Vercel environment variables as `DATABASE_URL`

Format:
```
postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
```

### Option 3: PlanetScale (MySQL)

1. Sign up: https://planetscale.com
2. Create database
3. Get connection string
4. Update Prisma schema:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
  relationMode = "prisma"
}
```

### Option 4: Railway

1. Sign up: https://railway.app
2. Create PostgreSQL database
3. Copy connection string
4. Add to Vercel

---

## 🔍 Check Vercel Logs

To see exact error:

1. Go to Vercel Dashboard
2. Click your deployment
3. Click **"Functions"** tab
4. Click on any failed function
5. View error logs

Or use CLI:
```bash
vercel logs
```

---

## ❌ Common Errors After Database Setup

### Error: "Cannot find module @prisma/client"

**Fix:**
```bash
npx prisma generate
git add .
git commit -m "Generate Prisma client"
git push
```

### Error: "P1001: Can't reach database"

**Fix:**
- Check DATABASE_URL is correct
- Ensure database accepts connections from Vercel
- Check if database is running

### Error: "Unknown datasource provider"

**Fix:**
- Make sure `provider` in schema.prisma matches your database
- Run `npx prisma generate` after changing

---

## 📝 Summary of Changes Needed

1. ✅ Create Vercel Postgres database (in dashboard)
2. ✅ Update `prisma/schema.prisma` (change provider to postgresql)
3. ✅ Update `lib/prisma.ts` (remove SQLite adapter code)
4. ✅ Commit and push changes
5. ✅ Run `npx prisma db push` (with Vercel DATABASE_URL)
6. ✅ Seed database: visit `/api/seed`

---

## ⚡ Quick Commands

```bash
# 1. Update Prisma schema
# (Edit prisma/schema.prisma - change to postgresql)

# 2. Generate client
npx prisma generate

# 3. Commit
git add .
git commit -m "Fix: Switch to PostgreSQL for production"
git push origin main

# 4. Wait for Vercel to deploy

# 5. Seed database
# Visit: https://your-app.vercel.app/api/seed
```

---

## 🆘 Still Not Working?

### Check Environment Variables:

1. Go to Vercel Dashboard
2. Project → Settings → Environment Variables
3. Verify these exist:
   - `DATABASE_URL` (should be from Vercel Postgres)
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL`

4. If missing, add them and redeploy

### Force Redeploy:

```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## ✅ After Fix

Your APIs should work:
- ✅ `/api/events` - Returns events list
- ✅ `/api/register` - Accepts registrations
- ✅ `/api/admin/login` - Admin authentication
- ✅ `/api/participant/login` - Participant login
- ✅ All pages load correctly

---

**Estimated Fix Time:** 5-10 minutes

**Difficulty:** Easy (mostly configuration)

🚀 **After this fix, your AIRO 6.0 will be fully functional!**
