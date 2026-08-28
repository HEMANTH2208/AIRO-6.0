# Vercel Environment Variables Setup Guide

This guide will help you add all required environment variables to your Vercel deployment.

## 🚀 Quick Steps

### Method 1: Via Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
   - Visit: https://vercel.com/dashboard
   - Select your project: **AIRO-6.0** or similar

2. Navigate to **Settings** → **Environment Variables**

3. Add each variable below:
   - Click **"Add New"** for each variable
   - Enter the **Key** (variable name)
   - Paste the **Value**
   - Select environments: **Production**, **Preview**, and **Development** (check all three)
   - Click **"Save"**

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables (run each command)
vercel env add GOOGLE_SHEETS_PRIVATE_KEY production
vercel env add GOOGLE_SHEETS_CLIENT_EMAIL production
vercel env add GOOGLE_SHEETS_SPREADSHEET_ID production

# Repeat for preview and development if needed
```

---

## 📋 Environment Variables to Add

### 1. Authentication & Security

#### `AUTH_SECRET`
```
airo6_super_secret_jwt_key_2024_sairam_aids
```
**Environments:** Production, Preview, Development

#### `JWT_SECRET`
```
goDCZ4IJsmMQSPYMgC02LYneLR0dR206NwgSzRioJXk
```
**Environments:** Production, Preview, Development

---

### 2. Admin Credentials

#### `ADMIN_EMAIL`
```
admin@airo.sairamengineering.edu
```
**Environments:** Production, Preview, Development

#### `ADMIN_PASSWORD`
```
King@2221
```
**Environments:** Production, Preview, Development
**Note:** Change this after first login in production!

---

### 3. App URL

#### `NEXTAUTH_URL` (Production)
```
https://your-app-name.vercel.app
```
**Environment:** Production Only
**Replace** `your-app-name.vercel.app` with your actual Vercel domain

#### `NEXT_PUBLIC_APP_URL` (Production)
```
https://your-app-name.vercel.app
```
**Environment:** Production Only
**Replace** `your-app-name.vercel.app` with your actual Vercel domain

---

### 4. Database (Supabase)

#### `DATABASE_URL`
```
postgresql://postgres.dereokcvthivmpryamhx:Hemanth2221@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```
**Environments:** Production, Preview, Development

#### `DIRECT_URL`
```
postgresql://postgres:Hemanth2221@db.dereokcvthivmpryamhx.supabase.co:6543/postgres
```
**Environments:** Production, Preview, Development

---

### 5. Google Sheets Integration

#### `GOOGLE_SHEETS_PRIVATE_KEY`
```
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
```
**Environments:** Production, Preview, Development

⚠️ **IMPORTANT:** 
- In Vercel, paste this as a **MULTI-LINE** value
- Keep all line breaks exactly as shown
- Do NOT add extra quotes or escape characters
- Vercel will handle the formatting automatically

#### `GOOGLE_SHEETS_CLIENT_EMAIL`
```
google-sheets-service@peak-freedom-506907-i0.iam.gserviceaccount.com
```
**Environments:** Production, Preview, Development

#### `GOOGLE_SHEETS_SPREADSHEET_ID`
```
1l-8qCMGwEtq_i0ItwqAPcR398MX_R6fRmT0appPe8LY
```
**Environments:** Production, Preview, Development

---

## 🎯 Step-by-Step Vercel Dashboard Setup

### Step 1: Access Environment Variables

1. Go to https://vercel.com/dashboard
2. Click on your **AIRO-6.0** project
3. Click **Settings** tab (top navigation)
4. Click **Environment Variables** (left sidebar)

### Step 2: Add Each Variable

For each variable listed above:

1. Click **"Add New"** button
2. **Key**: Enter the variable name (e.g., `GOOGLE_SHEETS_PRIVATE_KEY`)
3. **Value**: 
   - For single-line values: Paste directly
   - For multi-line (like private key): Click "Edit" to enable multi-line mode, then paste
4. **Environments**: Check all three boxes:
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
5. Click **"Save"**

### Step 3: Handle the Private Key Specially

For `GOOGLE_SHEETS_PRIVATE_KEY`:

1. Click **"Add New"**
2. Enter key name: `GOOGLE_SHEETS_PRIVATE_KEY`
3. In the value field, you'll see a small expand icon - click it for multi-line mode
4. Paste the ENTIRE private key including:
   ```
   -----BEGIN PRIVATE KEY-----
   [all the lines]
   -----END PRIVATE KEY-----
   ```
5. Make sure all line breaks are preserved
6. Select all three environments
7. Click **"Save"**

### Step 4: Update Production URLs

Make sure to replace placeholder URLs with your actual Vercel domain:

- `NEXTAUTH_URL`: `https://airo-6-0.vercel.app` (or your actual domain)
- `NEXT_PUBLIC_APP_URL`: `https://airo-6-0.vercel.app` (or your actual domain)

### Step 5: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab
2. Click on the **latest deployment**
3. Click **"Redeploy"** button
4. Or simply push a new commit to trigger automatic deployment

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] App loads at your Vercel URL
- [ ] Admin login works (`/admin/login`)
- [ ] Database connection successful (registrations page loads)
- [ ] Go to `/admin/export`
- [ ] Should NOT show "Google Sheets not configured" warning
- [ ] Click "Sync All to Google Sheets"
- [ ] Should get success message with sheet link
- [ ] Click link to verify data in Google Sheet

---

## 🔍 Troubleshooting

### "Google Sheets not configured" in production

**Cause:** Environment variables not set correctly

**Solution:**
1. Check Vercel dashboard → Settings → Environment Variables
2. Verify all three Google Sheets variables exist
3. Verify they're enabled for "Production" environment
4. Redeploy the application

### Private key format errors

**Cause:** Line breaks lost when pasting

**Solution:**
1. Delete the `GOOGLE_SHEETS_PRIVATE_KEY` variable in Vercel
2. Add it again using multi-line mode (expand icon)
3. Copy from your JSON file and paste directly
4. Ensure `-----BEGIN PRIVATE KEY-----` is on first line
5. Ensure `-----END PRIVATE KEY-----` is on last line

### Database connection errors

**Cause:** Database URLs might be wrong

**Solution:**
1. Verify `DATABASE_URL` matches your Supabase pooler URL
2. Verify `DIRECT_URL` matches your direct connection URL
3. Check Supabase dashboard for correct connection strings

---

## 🎉 Done!

Once all variables are added and deployment completes:

- Your app will be live at: `https://your-app.vercel.app`
- Google Sheets integration will work
- Admin portal fully functional
- 3D animations with car rotation live

**Next:** Test the admin export feature at `/admin/export` and sync your first data to Google Sheets!
