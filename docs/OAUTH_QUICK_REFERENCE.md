# Google OAuth Quick Reference Card

## 🚀 Quick Setup (5 minutes)

### 1. Get Google Client ID
```bash
# Go to: https://console.cloud.google.com/
# Create Project → APIs & Services → Credentials → Create OAuth Client ID
# Add: http://localhost:5173 to authorized origins and redirects
```

### 2. Configure Environment
```bash
# Copy example file
cp apps/app/.env.example apps/app/.env

# Edit apps/app/.env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

### 3. Run Application
```bash
pnpm dev
```

---

## 📋 Backend API Contract

### Endpoint: `POST /auth/google`

**Request:**
```json
{
  "accessToken": "ya29.a0AfH6SMB..."
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (401/400):**
```json
{
  "message": "Invalid or expired Google token"
}
```

---

## 🔑 Backend Implementation Steps

### 1. Verify Google Token
```javascript
// Call Google's userinfo endpoint
const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
  headers: { Authorization: `Bearer ${accessToken}` }
});

const userInfo = await response.json();
// Returns: { email, name, picture, sub }
```

### 2. Create/Update User
```javascript
// Check if user exists by email or Google ID
let user = await db.findUserByEmail(userInfo.email);

if (!user) {
  user = await db.createUser({
    email: userInfo.email,
    name: userInfo.name,
    googleId: userInfo.sub,
    profilePicture: userInfo.picture
  });
}
```

### 3. Generate JWT Tokens
```javascript
const accessToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### 4. Return Tokens
```javascript
return res.json({ accessToken, refreshToken });
```

---

## 🔍 Code Locations

| File | Purpose |
|------|---------|
| `apps/app/src/main.tsx` | GoogleOAuthProvider wrapper |
| `apps/app/src/pages/Login.tsx` | Google login handler |
| `apps/app/src/pages/Signup.tsx` | Google signup handler |
| `apps/app/src/forms/AuthForm/LoginForm.tsx` | Login form with Google button |
| `apps/app/src/forms/AuthForm/SignupForm.tsx` | Signup form with Google button |
| `packages/api-client/src/index.ts` | `googleAuth()` helper function |

---

## 🐛 Common Issues

### Issue: "Error 400: redirect_uri_mismatch"
**Fix:** Add exact URL to Google Console authorized redirect URIs

### Issue: "Error 403: access_denied"
**Fix:** Add test users in Google Console OAuth consent screen

### Issue: Google Client ID not found
**Fix:** 
```bash
# Check .env file exists
cat apps/app/.env

# Restart dev server
pnpm dev
```

### Issue: Backend returns 401
**Fix:** Verify Google token on backend before trusting

---

## ✅ Testing Checklist

- [ ] VITE_GOOGLE_CLIENT_ID set in .env
- [ ] Dev server restarted after .env changes
- [ ] Google Console has correct redirect URIs
- [ ] Backend /auth/google endpoint implemented
- [ ] Can click "Continue with Google" button
- [ ] Google popup opens successfully
- [ ] After auth, redirected to dashboard
- [ ] Tokens stored in localStorage
- [ ] Can access protected routes

---

## 🔒 Security Checklist

- [ ] Always verify Google token on backend
- [ ] Never trust client-side validation
- [ ] Use HTTPS in production
- [ ] Implement rate limiting
- [ ] Encrypt refresh tokens in database
- [ ] Rotate refresh tokens on use
- [ ] Log authentication events
- [ ] Validate token expiration
- [ ] Implement proper CORS

---

## 📦 Dependencies

```json
{
  "@react-oauth/google": "^0.12.1"
}
```

---

## 🌐 Environment Variables

### Development
```env
VITE_API_BASE=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

### Production
```env
VITE_API_BASE=https://api.yourdomain.com
VITE_GOOGLE_CLIENT_ID=production-xxx.apps.googleusercontent.com
```

---

## 📚 Documentation Links

- [Full Setup Guide](./GOOGLE_OAUTH_SETUP.md)
- [Implementation Summary](./OAUTH_IMPLEMENTATION_SUMMARY.md)
- [App README](../apps/app/README.md)
- [Google OAuth Docs](https://developers.google.com/identity/protocols/oauth2)

---

## 🎯 User Flow

```
User clicks "Continue with Google"
    ↓
Google popup opens
    ↓
User authenticates
    ↓
Google returns access token
    ↓
Frontend calls POST /auth/google
    ↓
Backend verifies token
    ↓
Backend returns app tokens
    ↓
Frontend stores tokens
    ↓
User redirected to dashboard
```

---

## 💡 Tips

1. **Use test users** during development with External OAuth type
2. **Publish consent screen** before going to production
3. **Add multiple redirect URIs** for different environments
4. **Keep Google tokens short-lived** - they expire quickly
5. **Log OAuth events** for debugging and analytics

---

## 🚨 Production Deployment

```bash
# 1. Create production Google OAuth credentials
# 2. Add production domain to authorized origins
# 3. Publish OAuth consent screen
# 4. Set VITE_GOOGLE_CLIENT_ID in production env
# 5. Deploy backend with /auth/google endpoint
# 6. Test full flow in production
# 7. Monitor logs for issues
```

---

**Need Help?** Check the full documentation in `docs/GOOGLE_OAUTH_SETUP.md`
