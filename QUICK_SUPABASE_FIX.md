# ⚡ Quick Fix: Connect Supabase (2 Minutes)

## 🎯 Get Your Connection Strings

### From Supabase Dashboard:

1. **Go to:** https://supabase.com/dashboard
2. **Select:** Your AIRO 6.0 project
3. **Click:** Settings → Database
4. **Copy both:**

```bash
# Connection Pooling (Transaction mode)
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Direct Connection
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

---

## 🚀 Add to Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Select:** Your AIRO-6-0 project
3. **Click:** Settings → Environment Variables
4. **Add:**

```
DATABASE_URL = [paste pooling connection string]
DIRECT_URL = [paste direct connection string]
```

5. **Click:** Save
6. **Redeploy:** Vercel → Deployments → Redeploy

---

## 🗄️ Push Schema to Supabase

In your terminal:

```bash
cd airo-6.0

# Push tables to Supabase
npx prisma db push

# Should see: "Database is now in sync"
```

---

## 🌱 Seed Database

After Vercel finishes redeploying:

**Visit:** `https://your-app.vercel.app/api/seed`

Creates admin + events ✅

---

## ✅ Test

Visit these URLs (should work without 500 errors):

- `https://your-app.vercel.app/api/events` ✅
- `https://your-app.vercel.app/admin` ✅  
- `https://your-app.vercel.app/register` ✅

---

## 🎉 Done!

Your app is now using Supabase PostgreSQL!

**Detailed guide:** Read `SUPABASE_SETUP.md`

---

**Time:** 2-5 minutes  
**Difficulty:** Easy
