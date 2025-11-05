# 🚀 Google OAuth Quick Start (5 Minutes)

Get Google OAuth login working in 5 minutes!

## Step 1: Install Dependencies (Already Done ✅)

```bash
# This is already installed
pnpm install
```

## Step 2: Get Google Client ID (2 minutes)

1. Go to **[Google Cloud Console](https://console.cloud.google.com/)**
2. Create a new project (or select existing)
3. Navigate to: **APIs & Services → Credentials**
4. Click: **Create Credentials → OAuth client ID**
5. Select: **Web application**
6. Add authorized JavaScript origins:
   - `http://localhost:5173`
7. Add authorized redirect URIs:
   - `http://localhost:5173`
8. Click **Create** and copy the **Client ID**

## Step 3: Configure Environment (1 minute)

```bash
# Copy the example file
cp apps/app/.env.example apps/app/.env

# Edit apps/app/.env and add your Client ID:
# VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
```

Or create the file manually:

```env
# apps/app/.env
VITE_API_BASE=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID.apps.googleusercontent.com
```

## Step 4: Start Dev Server (30 seconds)

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

## Step 5: Test It Out! (1 minute)

1. Open `http://localhost:5173/login`
2. Click **"Continue with Google"** button
3. Sign in with your Google account
4. Grant permissions

**Note**: Backend endpoint `/auth/google` must be implemented for full functionality. See below.

---

## ⚠️ Backend Required

The frontend is complete, but you need to implement the backend endpoint:

### Backend Endpoint Specification

```
POST /auth/google
```

**Request:**
```json
{
  "accessToken": "ya29.a0AfH6SMB..."
}
```

**Response:**
```json
{
  "accessToken": "your-jwt-access-token",
  "refreshToken": "your-jwt-refresh-token"
}
```

### Quick Backend Implementation Guide

See `docs/BACKEND_OAUTH_GUIDE.md` for complete implementation with code examples in:
- Node.js + Express
- Python + FastAPI
- Go + Gin

---

## 📚 Complete Documentation

- **Full Setup Guide**: `docs/GOOGLE_OAUTH_SETUP.md` (233 lines)
- **Backend Guide**: `docs/BACKEND_OAUTH_GUIDE.md` (738 lines)
- **Quick Reference**: `docs/OAUTH_QUICK_REFERENCE.md` (253 lines)
- **Flow Diagrams**: `docs/OAUTH_FLOW_DIAGRAM.md` (545 lines)
- **Integration Checklist**: `docs/OAUTH_INTEGRATION_CHECKLIST.md` (399 lines)

---

## 🐛 Troubleshooting

### "Error 400: redirect_uri_mismatch"
**Fix**: Make sure `http://localhost:5173` is added to authorized redirect URIs in Google Console

### "Google Client ID not found"
**Fix**: 
```bash
# Check if .env file exists
cat apps/app/.env

# Restart dev server after creating .env
pnpm dev
```

### "Error 403: access_denied"
**Fix**: Add test users in Google Console → OAuth consent screen

### Backend not responding
**Fix**: Make sure backend is running on `http://localhost:8080` and `/auth/google` endpoint is implemented

---

## ✅ What's Already Done

- ✅ Frontend integration complete
- ✅ Google OAuth button added to login page
- ✅ Google OAuth button added to signup page
- ✅ Token handling implemented
- ✅ Error handling implemented
- ✅ TypeScript types configured
- ✅ Full documentation written

## 🔧 What Needs to Be Done

- ⏳ Implement backend `/auth/google` endpoint
- ⏳ Update OpenAPI schema
- ⏳ Configure OAuth consent screen for production
- ⏳ Test end-to-end flow

---

## 🎯 Success Criteria

You'll know it's working when:
1. ✅ "Continue with Google" button appears on login page
2. ✅ Clicking button opens Google popup
3. ✅ After authentication, popup closes
4. ✅ User is redirected to dashboard (once backend is ready)

---

## 📞 Need Help?

Check the comprehensive guides:
- Questions about setup? → `docs/GOOGLE_OAUTH_SETUP.md`
- Backend implementation? → `docs/BACKEND_OAUTH_GUIDE.md`
- Quick reference? → `docs/OAUTH_QUICK_REFERENCE.md`
- Visual diagrams? → `docs/OAUTH_FLOW_DIAGRAM.md`

---

**Total Setup Time**: ~5 minutes
**Status**: Frontend Complete | Backend Pending
**Last Updated**: December 2024
