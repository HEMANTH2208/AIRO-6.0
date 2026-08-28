# 🚀 AIRO 6.0 - Complete Deployment Checklist

Use this checklist to ensure your application is fully deployed and configured on Vercel.

---

## ✅ Pre-Deployment Checklist

### Local Setup ✓ COMPLETE
- [x] Google Sheets credentials added to `.env.local`
- [x] Local development server tested
- [x] All features working locally
- [x] Code committed and pushed to GitHub

---

## 📋 Vercel Deployment Steps

### Step 1: Access Vercel Dashboard
- [ ] Go to https://vercel.com/dashboard
- [ ] Log in with your account
- [ ] Locate your **AIRO-6.0** project

### Step 2: Add Environment Variables
Go to **Settings → Environment Variables** and add all 11 variables:

#### Authentication (4 variables)
- [ ] `AUTH_SECRET`
- [ ] `JWT_SECRET`
- [ ] `ADMIN_EMAIL`
- [ ] `ADMIN_PASSWORD`

#### App URLs (2 variables) - ⚠️ REPLACE WITH YOUR DOMAIN!
- [ ] `NEXTAUTH_URL` = `https://your-actual-domain.vercel.app`
- [ ] `NEXT_PUBLIC_APP_URL` = `https://your-actual-domain.vercel.app`

#### Database (2 variables)
- [ ] `DATABASE_URL`
- [ ] `DIRECT_URL`

#### Google Sheets (3 variables)
- [ ] `GOOGLE_SHEETS_PRIVATE_KEY` (use multi-line mode!)
- [ ] `GOOGLE_SHEETS_CLIENT_EMAIL`
- [ ] `GOOGLE_SHEETS_SPREADSHEET_ID`

**For detailed values, see:** `VERCEL_ENV_SETUP.md`
**For step-by-step instructions, see:** `VERCEL_SETUP_VISUAL_GUIDE.md`

### Step 3: Deploy
- [ ] Push code to GitHub (triggers auto-deploy)
  OR
- [ ] Manually redeploy from Vercel dashboard

### Step 4: Verify Deployment
- [ ] Check deployment status in Vercel (should show "Ready")
- [ ] Note your deployment URL

---

## 🧪 Post-Deployment Testing

### Test 1: Homepage
- [ ] Visit: `https://your-domain.vercel.app`
- [ ] ✅ Page loads without errors
- [ ] ✅ 3D transformer animation appears
- [ ] ✅ Car rotates 360° on first scroll (first 25%)
- [ ] ✅ Car transforms into robot on continued scroll
- [ ] ✅ No particle "rain" effects (removed)
- [ ] ✅ Navbar and footer visible
- [ ] ✅ All links working

### Test 2: Events Page
- [ ] Visit: `https://your-domain.vercel.app/events`
- [ ] ✅ All 6 events displayed:
  - Tech Auction (Optimus Prime)
  - Tech Crime Scene (Soundwave)
  - Agentic Paradox (Megatron)
  - Code Combat (Ironhide)
  - Paper Presentation (Ratchet)
  - Workshop (Wheeljack)
- [ ] ✅ Event details load correctly
- [ ] ✅ Icons display properly

### Test 3: Registration
- [ ] Visit: `https://your-domain.vercel.app/register`
- [ ] ✅ Registration form loads
- [ ] Create a test registration:
  - [ ] Select an event
  - [ ] Fill team information
  - [ ] Add team members
  - [ ] Submit
- [ ] ✅ Success page shows with QR code
- [ ] ✅ Download QR pass works

### Test 4: Admin Portal
- [ ] Visit: `https://your-domain.vercel.app/admin/login`
- [ ] Login with:
  - Email: `admin@airo.sairamengineering.edu`
  - Password: `King@2221`
- [ ] ✅ Login successful
- [ ] ✅ Dashboard loads with statistics

#### Admin Features Testing
- [ ] **Dashboard** - Shows event stats, recent registrations
- [ ] **Events** - Lists all 6 events
- [ ] **Registrations** - Shows all registrations
- [ ] **Squads** - Shows teams
- [ ] **Transformers** - Shows participants
- [ ] **QR Scanner** - QR verification page loads
- [ ] **Google Sheets** - Export page loads (see Test 5)

### Test 5: Google Sheets Integration ⭐ NEW FEATURE
- [ ] Visit: `https://your-domain.vercel.app/admin/export`
- [ ] ✅ Page shows "Google Sheets Integration" (not "Excel Export")
- [ ] ✅ NO "Configuration Required" warning appears
- [ ] Click **"Sync All to Google Sheets"**
- [ ] ✅ Shows success message with sheet link
- [ ] Click the Google Sheet link
- [ ] ✅ Opens your Google Sheet
- [ ] ✅ Data is formatted correctly with headers
- [ ] ✅ All registration data appears

#### Optional: Test Event-Specific Sync
- [ ] Select a specific event from dropdown
- [ ] Click **"Sync"**
- [ ] ✅ Creates separate sheet for that event only
- [ ] ✅ Data synced correctly

---

## 🔍 Troubleshooting Guide

### Issue: Can't find my Vercel domain
**Solution:**
1. Go to Vercel project → Settings → Domains
2. Your primary domain is listed at the top
3. Copy it exactly (e.g., `airo-6-0-git-main-username.vercel.app`)

### Issue: "NEXTAUTH_URL" error on login
**Solution:**
1. Verify `NEXTAUTH_URL` in Vercel Settings → Environment Variables
2. Must be `https://` + your exact domain
3. No trailing slash
4. Example: `https://airo-6-0.vercel.app` ✅
5. Wrong: `http://airo-6-0.vercel.app` ❌ (http, not https)
6. Wrong: `https://airo-6-0.vercel.app/` ❌ (trailing slash)
7. After fixing, redeploy

### Issue: "Google Sheets not configured" in production
**Solution:**
1. Check all 3 Google variables are added in Vercel
2. Verify they're enabled for "Production" environment
3. Verify private key has all line breaks intact
4. Redeploy after adding variables

### Issue: Private key format error
**Solution:**
1. In Vercel, delete `GOOGLE_SHEETS_PRIVATE_KEY`
2. Add it again
3. Click **Expand** icon for multi-line mode
4. Paste entire key from JSON file
5. Ensure BEGIN/END lines are present
6. Save and redeploy

### Issue: Database connection error
**Solution:**
1. Verify Supabase database is running
2. Check connection strings in Vercel match Supabase
3. Test connection from Supabase dashboard
4. Ensure IP allowlist includes `0.0.0.0/0` (all IPs) in Supabase

### Issue: 3D animation not showing
**Solution:**
1. Check browser console for errors
2. Try different browser (Chrome recommended)
3. Check if WebGL is supported
4. Verify deployment completed successfully

---

## 📊 Success Metrics

### Your deployment is successful if:
- ✅ Homepage loads with 3D animation
- ✅ Car rotates fully before transforming
- ✅ No particle rain effects
- ✅ All 6 events display correctly
- ✅ Registration works end-to-end
- ✅ Admin login successful
- ✅ Google Sheets sync works
- ✅ QR code generation works
- ✅ No console errors

---

## 🔒 Security Reminders

### After First Production Login:
- [ ] Change admin password from default
- [ ] Update `ADMIN_PASSWORD` in Vercel after changing
- [ ] Redeploy

### Regular Maintenance:
- [ ] Rotate service account keys periodically
- [ ] Monitor Google Cloud quotas
- [ ] Review Vercel analytics for unusual activity
- [ ] Backup Google Sheet data regularly

---

## 📚 Documentation Reference

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview and local setup |
| `GOOGLE_SHEETS_SETUP.md` | Google Sheets integration guide |
| `VERCEL_ENV_SETUP.md` | All environment variables with values |
| `VERCEL_SETUP_VISUAL_GUIDE.md` | Step-by-step visual Vercel setup |
| `DEPLOYMENT_CHECKLIST.md` | This file - complete deployment guide |

---

## 🎯 Quick Reference: Your Configuration

### Your Vercel Domain
```
https://______________.vercel.app
```
(Fill this in after deployment)

### Your Google Sheet
```
https://docs.google.com/spreadsheets/d/1l-8qCMGwEtq_i0ItwqAPcR398MX_R6fRmT0appPe8LY/edit
```

### Important URLs
- **Homepage:** `https://your-domain.vercel.app`
- **Events:** `https://your-domain.vercel.app/events`
- **Register:** `https://your-domain.vercel.app/register`
- **Admin Login:** `https://your-domain.vercel.app/admin/login`
- **Google Sheets Export:** `https://your-domain.vercel.app/admin/export`

### Admin Credentials
- **Email:** `admin@airo.sairamengineering.edu`
- **Password:** `King@2221` (change after first login!)

---

## 🎉 Congratulations!

Once all checkboxes are ✅, your AIRO 6.0 event website is:
- 🌐 Live on the internet
- 🔐 Secure with authentication
- 📊 Syncing to Google Sheets
- 🤖 Featuring stunning 3D transformer animations
- ✨ Ready for registrations

**Share your live link and start accepting registrations! 🚀**

---

## 📞 Need Help?

If you encounter issues:
1. Check the troubleshooting section above
2. Review the documentation files
3. Check Vercel deployment logs for errors
4. Verify all environment variables are correct
5. Test locally first to isolate production issues

**Event Details:**
- **Event:** AIRO 6.0 - National Level Symposium
- **Date:** 08.10.26 (Thursday)
- **Venue:** Sairam Engineering College, Chennai
- **Department:** AI & Data Science
- **Total Events:** 6
- **Entry:** FREE

**Good luck with your event! 🎊**
