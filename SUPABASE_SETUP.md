# 🔌 Connect Supabase to AIRO 6.0

## ✅ You Already Have Supabase Setup - Perfect!

Let's connect it to your project in 5 minutes.

---

## 📋 Step 1: Get Supabase Connection Strings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your AIRO 6.0 project
3. Click **Settings** (⚙️) in the left sidebar
4. Click **Database**
5. Scroll down to **Connection String** section

### You need TWO connection strings:

#### A. Connection Pooling String (for Vercel)
- Find: **"Connection Pooling"** section
- Mode: **Transaction** (recommended) or **Session**
- Copy the connection string
- Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres`

#### B. Direct Connection String (for migrations)
- Find: **"Connection string"** section  
- URI format
- Copy the connection string
- Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

---

## 📝 Step 2: Add to Vercel Environment Variables

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your **AIRO-6-0** project
3. Click **Settings** → **Environment Variables**
4. Add/Update these variables:

```bash
# Connection Pooling URL (for serverless functions)
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres

# Direct URL (for migrations)
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Admin Credentials
ADMIN_EMAIL=admin@airo6.com
ADMIN_PASSWORD=YourSecurePassword123!

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-secure-jwt-secret-min-32-characters

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Important:** 
- Replace `[PASSWORD]` with your actual database password
- Replace `[PROJECT-REF]` with your Supabase project reference
- Replace `[REGION]` with your Supabase region (e.g., `aws-0-us-east-1`)
- Make sure to add to **Production**, **Preview**, and **Development** environments

---

## 🔧 Step 3: Update Local Environment

Update your local `.env` file:

```bash
# Supabase Connection
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@[REGION].pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Admin Credentials
ADMIN_EMAIL="admin@airo6.com"
ADMIN_PASSWORD="Admin@AIRO6"

# JWT Secret
JWT_SECRET="airo6-jwt-secret-change-in-production"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🗄️ Step 4: Push Database Schema to Supabase

Now that everything is configured, push your schema to Supabase:

```bash
cd airo-6.0

# Generate Prisma Client
npx prisma generate

# Push schema to Supabase (creates all tables)
npx prisma db push

# You should see:
# ✔ Generated Prisma Client
# The database is now in sync with your Prisma schema
```

---

## 🌱 Step 5: Seed the Database

### Option A: Via API (After Vercel Redeploy)

After Vercel automatically redeploys (or manually trigger):

Visit: `https://your-app.vercel.app/api/seed`

This will create:
- Admin user (email: admin@airo6.com)
- All 6 events (Tech Auction, Tech Crime Scene, etc.)

### Option B: Via Command Line

```bash
# Make sure DATABASE_URL is in your .env
npm run seed
```

---

## ✅ Step 6: Verify Connection

### Test Locally:

```bash
# Start the dev server
npm run dev

# Visit http://localhost:3000
# Should load without errors
```

### Test on Vercel:

1. Wait for automatic redeployment (or trigger with `git push`)
2. Visit your Vercel URL
3. Check these endpoints:

```bash
# Should return events (not 500 error)
https://your-app.vercel.app/api/events

# Should show login page
https://your-app.vercel.app/admin

# Should show registration form
https://your-app.vercel.app/register
```

---

## 🚀 Step 7: Trigger Vercel Redeploy

The schema changes need to be deployed:

```bash
# Commit the Supabase configuration
git add .
git commit -m "Configure Supabase PostgreSQL database"
git push origin main

# Vercel will auto-deploy in ~2-3 minutes
```

---

## 🔍 Verify in Supabase

Check that tables were created:

1. Go to Supabase Dashboard
2. Click **Table Editor** in the left sidebar
3. You should see these tables:
   - `events`
   - `teams`
   - `participants`
   - `registrations`
   - `users`

---

## 🎯 Connection String Examples

### For Transaction Pooling (Recommended for Vercel):
```
postgresql://postgres.abcdefghijklmnop:MyP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

### For Direct Connection (For migrations):
```
postgresql://postgres:MyP@ssw0rd@db.abcdefghijklmnop.supabase.co:5432/postgres
```

### Connection String Breakdown:
```
postgresql://     <- Protocol
postgres          <- Username
[password]        <- Your database password
@aws-0-us-east-1  <- Region
pooler.supabase   <- Pooler (for serverless)
.com:5432         <- Port
/postgres         <- Database name
```

---

## 🔒 Security Notes

### Supabase Password:
- Use the password you created when setting up Supabase
- Find it in: Supabase → Settings → Database → Reset database password (if forgotten)

### Connection Pooling:
- **Transaction Mode**: Best for Vercel serverless functions ✅
- **Session Mode**: Use if you need longer connections
- Switch in: Supabase → Settings → Database → Connection Pooling

---

## 🐛 Troubleshooting

### Error: "Can't reach database server"

**Check:**
1. Is your Supabase project active?
2. Is the connection string correct?
3. Is the password correct?
4. Try resetting the database password in Supabase

**Fix:**
```bash
# Test connection
npx prisma db pull

# Should connect successfully
```

### Error: "SSL connection required"

**Fix:** Connection strings from Supabase already include SSL. Make sure you're using the exact string from Supabase.

### Error: "Too many connections"

**Fix:** Use the **pooler** connection string (Transaction mode), not the direct connection string for your app.

### Error: "Authentication failed"

**Fix:**
1. Go to Supabase → Settings → Database
2. Reset database password
3. Update in `.env` and Vercel environment variables
4. Redeploy

---

## 📊 Check Database in Supabase

### View Tables:
1. Supabase Dashboard → **Table Editor**
2. Select a table (e.g., `events`)
3. See all data

### Run SQL Queries:
1. Supabase Dashboard → **SQL Editor**
2. Run custom queries:

```sql
-- Check events
SELECT * FROM events;

-- Check users
SELECT * FROM users;

-- Check registrations
SELECT * FROM registrations;
```

---

## 🎨 Supabase Features You Can Use

Your Supabase includes:

- **Table Editor**: Visual database browser
- **SQL Editor**: Run custom queries
- **Authentication**: Built-in auth (optional)
- **Storage**: File uploads (optional)
- **Real-time**: Live data sync (optional)
- **Backups**: Automatic backups (paid plans)

---

## 📈 Monitor Your Database

### In Supabase:
1. Dashboard → **Reports**
2. See:
   - Active connections
   - Database size
   - Query performance
   - CPU usage

### Set Up Alerts:
1. Dashboard → **Settings** → **Alerts**
2. Configure notifications for:
   - High CPU usage
   - Connection limits
   - Storage limits

---

## ✅ Final Checklist

- [ ] Got Supabase connection strings (both DATABASE_URL and DIRECT_URL)
- [ ] Added to Vercel environment variables
- [ ] Updated local `.env` file
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Committed and pushed changes
- [ ] Vercel redeployed successfully
- [ ] Visited `/api/seed` to seed database
- [ ] Tested API endpoints (no 500 errors)
- [ ] Verified tables exist in Supabase
- [ ] Admin login works
- [ ] Registration form works

---

## 🎉 Success!

Your AIRO 6.0 is now connected to Supabase PostgreSQL!

### What You Have Now:

✅ Production database (Supabase)
✅ Automatic backups
✅ Scalable connection pooling
✅ Visual database browser
✅ SQL editor
✅ 500MB free storage
✅ 2GB free bandwidth

### Next Steps:

1. Seed your database: Visit `/api/seed`
2. Test admin login
3. Test registration
4. Share with your team!

---

## 📞 Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Prisma with Supabase: https://www.prisma.io/docs/guides/database/supabase

---

**Connection Time:** 5-10 minutes

**Status:** ✅ Ready to connect!

🚀 **Follow the steps above to connect your Supabase database!**
