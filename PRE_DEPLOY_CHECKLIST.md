# ✅ Pre-Deployment Checklist for AIRO 6.0

## 🔒 Security Check

### Environment Variables
- [ ] `.env` is in `.gitignore` ✅
- [ ] `.env.example` exists and is committed ✅
- [ ] No sensitive data in `.env.example` ✅
- [ ] Strong password for `ADMIN_PASSWORD` (min 12 chars)
- [ ] Secure `JWT_SECRET` generated (min 32 chars)
- [ ] Database credentials are secure

### Code Security
- [ ] No API keys or secrets in code
- [ ] No console.log with sensitive data
- [ ] No hardcoded passwords
- [ ] No commented-out credentials

## 📁 Files Check

### Should Be Ignored (Not Committed)
- [ ] `.env` - ✅ (in .gitignore)
- [ ] `node_modules/` - ✅ (in .gitignore)
- [ ] `.next/` - ✅ (in .gitignore)
- [ ] `*.db` files - ✅ (in .gitignore)
- [ ] `.vercel/` - ✅ (in .gitignore)
- [ ] `*.log` files - ✅ (in .gitignore)

### Should Be Committed
- [x] `.env.example` - ✅
- [x] `.gitignore` - ✅
- [x] `package.json` - ✅
- [x] `package-lock.json` - ✅
- [x] `prisma/schema.prisma` - ✅
- [x] All source code files - ✅
- [x] Documentation files - ✅
- [x] `vercel.json` - ✅
- [x] `.vercelignore` - ✅

## 🗂️ Git Status

### Check Git Status
```bash
# Should show only files you want to commit
git status

# Should NOT show:
# - .env
# - node_modules/
# - .next/
# - *.db files
```

### Verify .gitignore is Working
```bash
# Check what's ignored
git check-ignore -v .env
git check-ignore -v node_modules
git check-ignore -v .next
git check-ignore -v prisma/dev.db

# All should show they're ignored
```

## 📦 Dependencies Check

### Verify package.json
- [ ] All dependencies listed
- [ ] No missing packages
- [ ] Versions are compatible
- [ ] Build script exists: `"build": "next build"`
- [ ] Start script exists: `"start": "next start"`

### Test Locally
```bash
# Install fresh dependencies
rm -rf node_modules package-lock.json
npm install

# Test build
npm run build

# Test production mode
npm start
```

## 🗄️ Database Preparation

### For Development (SQLite)
- [ ] `DATABASE_URL="file:./prisma/dev.db"`
- [ ] Prisma schema uses SQLite
- [ ] Database file in `.gitignore`

### For Production (PostgreSQL)
- [ ] Choose database provider (Vercel Postgres, Supabase, etc.)
- [ ] Update Prisma schema to PostgreSQL
- [ ] Get connection string ready
- [ ] Test database connection locally

```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

## 🔧 Configuration Files

### vercel.json
- [x] Created ✅
- [x] Correct build settings ✅
- [x] Security headers configured ✅
- [x] Environment variables referenced ✅

### .vercelignore
- [x] Created ✅
- [x] Excludes unnecessary files ✅
- [x] Database files excluded ✅

### prisma/schema.prisma
- [x] Exists ✅
- [ ] Provider set correctly (sqlite for dev, postgresql for prod)
- [ ] All models defined
- [ ] Relations configured

## 📝 Code Quality

### Build Check
```bash
# Should complete without errors
npm run build
```

### Linting (if configured)
```bash
# Should pass without errors
npm run lint
```

### TypeScript Check
```bash
# Should compile without errors
npx tsc --noEmit
```

## 🚀 Pre-Push Checklist

### Before Committing
- [ ] Remove all debug code
- [ ] Remove all console.logs (or use proper logging)
- [ ] Update documentation
- [ ] Test all features locally
- [ ] Check for TODO comments that need attention

### Git Commands
```bash
# Check status
git status

# Add files (verify list is correct)
git add .

# Check what will be committed
git diff --cached

# Commit with clear message
git commit -m "Prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

## 🌐 GitHub Repository

### Verify Repository
- [ ] Code is pushed to GitHub
- [ ] Repository is public (or Vercel has access)
- [ ] Latest commit shows on GitHub
- [ ] `.env` is NOT visible on GitHub ✅
- [ ] `.env.example` IS visible on GitHub ✅

### Check on GitHub
```
https://github.com/HEMANTH2208/AIRO-6.0
```

Verify:
- [ ] All files are there
- [ ] No .env file visible
- [ ] README is up to date

## 🎯 Vercel Preparation

### Vercel Account
- [ ] Account created at https://vercel.com
- [ ] GitHub connected to Vercel
- [ ] Can access Vercel dashboard

### Environment Variables Ready
Prepare these for Vercel:

```bash
DATABASE_URL=postgresql://your-db-url
ADMIN_EMAIL=admin@airo6.com
ADMIN_PASSWORD=YourSecurePassword123!
JWT_SECRET=generate-with-openssl-rand-base64-32
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## ✅ Final Verification

### All Checks Passed?
- [ ] Security check ✅
- [ ] Files check ✅
- [ ] Git status clean ✅
- [ ] Dependencies installed ✅
- [ ] Database prepared ✅
- [ ] Configuration files ready ✅
- [ ] Code quality verified ✅
- [ ] GitHub repository updated ✅
- [ ] Vercel account ready ✅

## 🚨 Common Issues to Avoid

### ❌ Don't Commit These:
- `.env` file
- `node_modules/` folder
- `.next/` folder
- Database files (*.db)
- Personal API keys
- Passwords or secrets

### ✅ Do Commit These:
- `.env.example` (template only)
- `.gitignore`
- All source code
- Configuration files
- Documentation
- `package.json` and `package-lock.json`

## 📊 What Should Git Show?

### Good Git Status:
```bash
On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean
```

### Or if you have changes:
```bash
On branch main
Changes to be committed:
  modified:   app/globals.css
  modified:   components/Navbar.tsx
  new file:   .env.example
  new file:   vercel.json
```

### Bad Git Status (FIX THESE):
```bash
# ❌ Should NOT see:
  modified:   .env                    # Remove from git!
  modified:   prisma/dev.db           # Remove from git!
  modified:   node_modules/something  # Should be ignored!
```

## 🔧 If .env Was Accidentally Committed

### Remove from Git History:
```bash
# Remove .env from git
git rm --cached .env

# Commit the removal
git commit -m "Remove .env from version control"

# Push changes
git push origin main

# Verify .env is in .gitignore
cat .gitignore | grep .env
```

## 🎉 Ready to Deploy!

If all checks pass, you're ready to deploy!

**Next Steps:**
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables
4. Click "Deploy"

**Or follow:**
- `QUICK_DEPLOY.md` for 5-minute deployment
- `DEPLOY_CHECKLIST.md` for detailed steps
- `DEPLOYMENT_GUIDE.md` for comprehensive guide

---

**Last Check Before Deploy:**
```bash
# Verify nothing sensitive is committed
git log --all --full-history -- .env

# Should show "fatal: ambiguous argument '.env'"
# If it shows commits, .env was committed (fix above)
```

---

✅ **All checks passed? You're ready to deploy to Vercel!** 🚀
