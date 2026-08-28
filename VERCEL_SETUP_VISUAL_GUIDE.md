# 🎯 Visual Guide: Setting Up Environment Variables in Vercel

This is a step-by-step visual guide with screenshots descriptions for adding environment variables to Vercel.

---

## 📍 Part 1: Access Your Project

### Step 1: Go to Vercel Dashboard
1. Open your browser and go to: **https://vercel.com/dashboard**
2. Log in with your account (GitHub, GitLab, or email)

### Step 2: Select Your Project
- You'll see a list of your projects
- Find and click on **"airo-6-0"** or **"AIRO-6.0"** (your project name)

---

## ⚙️ Part 2: Navigate to Environment Variables

### Step 3: Open Settings
- At the top of your project page, you'll see tabs: **Overview**, **Deployments**, **Analytics**, **Settings**
- Click on **"Settings"** tab

### Step 4: Go to Environment Variables Section
- On the left sidebar, you'll see options like:
  - General
  - Domains
  - **Environment Variables** ← Click this
  - Git
  - Functions
  - etc.

---

## ➕ Part 3: Add Environment Variables

You'll see a page that looks like this:

```
Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Environment variables are encrypted at rest and made available 
to your deployments.

[Search environment variables...]                    [Add New ▼]

─────────────────────────────────────────────────────────────
Key                              Value        Environments
─────────────────────────────────────────────────────────────
(empty or existing variables)
```

### Step 5: Click "Add New" Button

---

## 📝 Part 4: Add Each Variable

When you click "Add New", you'll see a form:

```
┌──────────────────────────────────────────────────────────┐
│ Add New Environment Variable                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Key (required)                                           │
│ ┌────────────────────────────────────────────────────┐  │
│ │ GOOGLE_SHEETS_PRIVATE_KEY                          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Value (required)                                 [Expand]│
│ ┌────────────────────────────────────────────────────┐  │
│ │ -----BEGIN PRIVATE KEY-----                        │  │
│ │ MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYw...         │  │
│ │ -----END PRIVATE KEY-----                          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Environments                                             │
│ ☑ Production                                             │
│ ☑ Preview                                                │
│ ☑ ☑ Development                                          │
│                                                          │
│ [Cancel]                                        [Save]   │
└──────────────────────────────────────────────────────────┘
```

---

## 📋 Complete List of Variables to Add

### Variable 1: AUTH_SECRET
```
Key:   AUTH_SECRET
Value: airo6_super_secret_jwt_key_2024_sairam_aids
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 2: JWT_SECRET
```
Key:   JWT_SECRET
Value: goDCZ4IJsmMQSPYMgC02LYneLR0dR206NwgSzRioJXk
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 3: ADMIN_EMAIL
```
Key:   ADMIN_EMAIL
Value: admin@airo.sairamengineering.edu
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 4: ADMIN_PASSWORD
```
Key:   ADMIN_PASSWORD
Value: King@2221
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 5: NEXTAUTH_URL (IMPORTANT!)
```
Key:   NEXTAUTH_URL
Value: https://YOUR-ACTUAL-DOMAIN.vercel.app
Environments: ✅ Production only
```
⚠️ **Replace** `YOUR-ACTUAL-DOMAIN` with your real Vercel domain!

Example:
- `https://airo-6-0.vercel.app`
- `https://airo-6-0-git-main-yourname.vercel.app`
- Or your custom domain if you set one up

**How to find your domain:**
1. Go to Settings → Domains
2. Copy your primary domain

### Variable 6: NEXT_PUBLIC_APP_URL (IMPORTANT!)
```
Key:   NEXT_PUBLIC_APP_URL
Value: https://YOUR-ACTUAL-DOMAIN.vercel.app
Environments: ✅ Production only
```
⚠️ Use the **same domain** as NEXTAUTH_URL

### Variable 7: DATABASE_URL
```
Key:   DATABASE_URL
Value: postgresql://postgres.dereokcvthivmpryamhx:Hemanth2221@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 8: DIRECT_URL
```
Key:   DIRECT_URL
Value: postgresql://postgres:Hemanth2221@db.dereokcvthivmpryamhx.supabase.co:6543/postgres
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 9: GOOGLE_SHEETS_PRIVATE_KEY (SPECIAL HANDLING!)
```
Key:   GOOGLE_SHEETS_PRIVATE_KEY
Value: (Click "Expand" icon for multi-line mode, then paste:)

-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCmPym/CgxHdWJx
kK4hS67EqfKYqQFyHnc+XqrD7p+dPgbSwpdN+q1BB3fCFRjCTmcJXqLp2uHXLccG
QoZhOXRfLaihvjIMgjdt/x2cvTd75pkrjHkPKFpAclqMvpxZhHmbfyF6REy5Sx7p
u37mDfhql7gClrPHhZGFSgijI1VDkKtMAskx9/5muB12nUyPhUnGZzalCv9A96/5
Si8jSwTOQQcVGFbJ7L4+MvjKSgZaq/yINcfDh+ZTdXp4FlFZUSZTNAW6w6RwodWj
ld60lYEj7UO1Zp+LAdzCubxNcRKQ/xXl0/5dS7fbQ1vTiHNcZ+nnYxufyK3Txpnt
ClDrzl99AgMBAAECggEAHeSXJNURcqryjeGaUf3aGd5GMzmWezbrsaETmyIV/M/5
qZ2YV8r2qs4FNHaXKl8vK1HjQOIdAFRoqGE/aQ2L9Y5P929r7/BdN6/rGvMyHhsP
mTNL1FQo8FQvoIWotvb5Z+Ky+hl8Y0gU8anHbmX+MGqCCaMgBgUoLruqdG0myHxZ
bZs7fh5gAIMyrK54NWRNnrGN/PMREBan5NDsNO3eh9b8G/ZfYkrGCNNiXHPJa5a5
vNlWmRTUFNqoSBnWWyeKb4Lh6nQ6xRMSJfAgj5bZh+A0TaDDlY0wKfqBWMfpXYI0
YLpQB9u/i4vEXtGumEwWNEYvrtmzJ6kzZTCCVzuUWQKBgQDYkxrTwW0bOxb/8IZ1
i78Idf4Y9X1zSDy8buR63w4Cyq61S3gFlZEnBycS/F172NyFAnO3kuCtstypAMVI
yHO2zzNfYNz5XeoTnOMyn7MDLPcUOF5Q75550gzNHNOTL0fyy8ik7fFxKei3n1O1
Nh7Fr7CSyO8gD16SvyDmK2pqRQKBgQDEgqhyXb+wrlqk8qVZ5Lmr2onOdsgenZEK
db9Mayp5CkdKqGqMZgrYv5w0n06DYmOYW0feDZIYuivyJkdA0fO6Uh96RX/HaSkk
Gp+nJqbCccXO0hXlbH8mgCchM/dI5l2RA+zddrjLJd/VITZ3XNX/0RY+JtLRumJH
5bK59QNP2QKBgCFsQl2fojjrm5cQBZAqaubhXr93U07xPP5Pls8nkT/5C5FK/lDO
TkJZpjwV2k98njugrz8LWcU0rz0ds1SSKtlxjJoRlsidJ7yzH5T2dGfvDop+UH/p
Gunt8q/M3RH/3/imXmalmfc+4n1EB2UV3xXfET7154FpHc1D1c3vsVKJAoGAKtL2
doXroks8wbmHQ0HPHJ5xbacBEXrxAsCKQdMQ3HPa+XAeWB5cusN2/RjCeWtVnPw3
ezKl5fGcZhblbEDUxoPjDDhdEk3eg1mx9TE9Ih69JsctsmOkifVfkaLLfv2E4ndi
hRi8SLkmQEIOppB6qlcca8r2InJlvJlYC6JTaHECgYAkPYhE3WWogIKxdJfXFcXv
XkFEQoCHJEA3UIeE1X5cI7BYXgv2+XQjs53k+Kz6J6zi38rLC/nkKPsjWDU4u7un
7uqGTfCO4h88HLgS9L15v4aF6qfdvPClhTzs4m94oKaBE17eJheJMYGvGfMx4Sf+
jbTVG6yb3OZ0wc4GPghLsQ==
-----END PRIVATE KEY-----

Environments: ✅ Production ✅ Preview ✅ Development
```

**CRITICAL:**
1. Click the small **↗️ Expand** icon next to the value field
2. This opens multi-line mode
3. Paste the ENTIRE key including BEGIN/END lines
4. Ensure all line breaks are preserved
5. Do NOT add quotes or escape characters

### Variable 10: GOOGLE_SHEETS_CLIENT_EMAIL
```
Key:   GOOGLE_SHEETS_CLIENT_EMAIL
Value: google-sheets-service@peak-freedom-506907-i0.iam.gserviceaccount.com
Environments: ✅ Production ✅ Preview ✅ Development
```

### Variable 11: GOOGLE_SHEETS_SPREADSHEET_ID
```
Key:   GOOGLE_SHEETS_SPREADSHEET_ID
Value: 1l-8qCMGwEtq_i0ItwqAPcR398MX_R6fRmT0appPe8LY
Environments: ✅ Production ✅ Preview ✅ Development
```

---

## 🔄 Part 5: Redeploy

After adding ALL variables:

### Option 1: Automatic (Recommended)
- Just push any commit to GitHub
- Vercel will auto-deploy with new environment variables

### Option 2: Manual Redeploy
1. Go to **"Deployments"** tab
2. Find the latest deployment
3. Click the **three dots (...)** menu
4. Click **"Redeploy"**
5. Confirm the redeploy

---

## ✅ Part 6: Verify Everything Works

### After Deployment Completes:

1. **Visit Your Live Site**
   - Go to your Vercel domain (e.g., `https://airo-6-0.vercel.app`)
   - Homepage should load with 3D car animation

2. **Test Admin Login**
   - Go to: `https://your-domain.vercel.app/admin/login`
   - Email: `admin@airo.sairamengineering.edu`
   - Password: `King@2221`
   - Should successfully log in

3. **Test Google Sheets**
   - Go to: `https://your-domain.vercel.app/admin/export`
   - Should NOT show "Configuration Required" warning
   - Click **"Sync All to Google Sheets"**
   - Should show success message with sheet link
   - Click link to verify data appears in Google Sheet

4. **Test Registration**
   - Try creating a test registration
   - Check if it saves to database
   - Verify QR code generation works

---

## 🐛 Common Issues & Fixes

### Issue 1: "NEXTAUTH_URL" error or authentication fails

**Cause:** Wrong domain in NEXTAUTH_URL

**Fix:**
1. Go to Vercel Settings → Domains
2. Copy your exact domain (e.g., `airo-6-0-abc123.vercel.app`)
3. Update `NEXTAUTH_URL` to `https://` + that domain
4. Update `NEXT_PUBLIC_APP_URL` to same value
5. Redeploy

### Issue 2: "Google Sheets not configured"

**Cause:** Environment variables missing or incorrect

**Fix:**
1. Check Settings → Environment Variables
2. Verify all 3 Google variables exist:
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
3. Verify they're checked for "Production"
4. Redeploy

### Issue 3: Private key format errors

**Cause:** Line breaks lost

**Fix:**
1. Delete `GOOGLE_SHEETS_PRIVATE_KEY`
2. Add it again
3. Click **Expand** icon for multi-line mode
4. Paste entire key with all line breaks
5. Save and redeploy

### Issue 4: Database connection errors

**Cause:** Wrong connection strings

**Fix:**
1. Go to your Supabase dashboard
2. Get correct connection strings
3. Update `DATABASE_URL` and `DIRECT_URL`
4. Redeploy

---

## 📱 Quick Reference: All 11 Variables

```
1.  AUTH_SECRET
2.  JWT_SECRET
3.  ADMIN_EMAIL
4.  ADMIN_PASSWORD
5.  NEXTAUTH_URL (⚠️ Replace with your domain!)
6.  NEXT_PUBLIC_APP_URL (⚠️ Replace with your domain!)
7.  DATABASE_URL
8.  DIRECT_URL
9.  GOOGLE_SHEETS_PRIVATE_KEY (⚠️ Use multi-line mode!)
10. GOOGLE_SHEETS_CLIENT_EMAIL
11. GOOGLE_SHEETS_SPREADSHEET_ID
```

All should be checked for: ✅ Production ✅ Preview ✅ Development

---

## 🎉 Success!

Once all variables are added and deployment succeeds:

- ✅ Live website at your Vercel domain
- ✅ Admin portal fully functional
- ✅ Google Sheets integration working
- ✅ 3D transformer animation with car rotation
- ✅ Registration system operational

**Enjoy your live AIRO 6.0 event website! 🚀**
