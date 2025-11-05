# Google OAuth Integration Setup Guide

This guide explains how to set up and use Google OAuth authentication in the Headknot application.

## Overview

The application now supports Google OAuth login/signup in addition to traditional username/password authentication. Users can click the "Continue with Google" button on the login or signup pages to authenticate using their Google account.

## Prerequisites

Before you can use Google OAuth, you need to:

1. Have a Google Cloud Platform (GCP) account
2. Create a project in Google Cloud Console
3. Configure OAuth consent screen
4. Create OAuth 2.0 credentials

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click "New Project"
4. Enter a project name (e.g., "Headknot Auth")
5. Click "Create"

## Step 2: Configure OAuth Consent Screen

1. In the Google Cloud Console, navigate to **APIs & Services** > **OAuth consent screen**
2. Select **External** user type (or Internal if using Google Workspace)
3. Click **Create**
4. Fill in the required information:
   - **App name**: Headknot
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
5. Click **Save and Continue**
6. On the Scopes page, click **Add or Remove Scopes**
7. Add the following scopes:
   - `openid`
   - `email`
   - `profile`
8. Click **Update** and then **Save and Continue**
9. Add test users if using External user type (during development)
10. Click **Save and Continue** and then **Back to Dashboard**

## Step 3: Create OAuth 2.0 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application** as the application type
4. Configure the OAuth client:
   - **Name**: Headknot Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:5173` (for development)
     - `https://yourdomain.com` (for production)
5. Click **Create**
6. Copy the **Client ID** (you'll need this for the next step)

## Step 4: Configure Environment Variables

1. Copy the `.env.example` file to `.env` in the `apps/app` directory:
   ```bash
   cp apps/app/.env.example apps/app/.env
   ```

2. Edit the `.env` file and add your Google Client ID:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   ```

3. Make sure your API base URL is also configured:
   ```env
   VITE_API_BASE=http://localhost:8080
   ```

## Step 5: Backend API Integration

Your backend API needs to implement the `/auth/google` endpoint that:

1. Accepts a Google access token
2. Verifies the token with Google's APIs
3. Retrieves user information from Google
4. Creates or updates the user in your database
5. Returns your application's access and refresh tokens

### Example Backend Implementation (Pseudocode)

```javascript
POST /auth/google
Body: { accessToken: string }

Handler:
1. Use the accessToken to fetch user info from Google:
   GET https://www.googleapis.com/oauth2/v3/userinfo
   Headers: { Authorization: `Bearer ${accessToken}` }

2. Extract user data:
   - email
   - name
   - picture
   - sub (Google user ID)

3. Find or create user in database:
   - Check if user exists by Google ID or email
   - If new user, create account
   - If existing user, update last login

4. Generate your app's JWT tokens:
   - accessToken (short-lived, e.g., 15 minutes)
   - refreshToken (long-lived, e.g., 7 days)

5. Return tokens:
   {
     "accessToken": "your-jwt-access-token",
     "refreshToken": "your-jwt-refresh-token"
   }
```

### Security Considerations

- **Always verify the Google access token** on your backend before trusting the user data
- **Never trust client-side token validation alone**
- Use HTTPS in production
- Implement rate limiting on the OAuth endpoint
- Store refresh tokens securely (encrypted in database)
- Implement token rotation for refresh tokens

## How It Works

### Frontend Flow

1. User clicks "Continue with Google" button
2. Google OAuth popup opens (handled by `@react-oauth/google`)
3. User authenticates with Google and grants permissions
4. Google returns an access token to the application
5. Application sends the Google access token to backend `/auth/google` endpoint
6. Backend validates token, creates/updates user, and returns app tokens
7. Application stores tokens in localStorage
8. User is redirected to the dashboard

### Code Structure

- **`apps/app/src/main.tsx`**: Wraps the app with `GoogleOAuthProvider`
- **`apps/app/src/forms/AuthForm/LoginForm.tsx`**: Login form with Google OAuth button
- **`apps/app/src/forms/AuthForm/SignupForm.tsx`**: Signup form with Google OAuth button
- **`apps/app/src/pages/Login.tsx`**: Login page with Google OAuth handler
- **`apps/app/src/pages/Signup.tsx`**: Signup page with Google OAuth handler
- **`packages/api-client/src/index.ts`**: API client with token management

## Testing

### Development Testing

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Navigate to `http://localhost:5173/login`

3. Click "Continue with Google"

4. Sign in with a test Google account

5. Verify that you're redirected to the dashboard

### Test Users

If using External OAuth consent screen type in development mode:
- Add test users in Google Cloud Console under OAuth consent screen
- Only these users will be able to authenticate during testing

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

- Ensure the redirect URI in your Google Cloud Console matches exactly with your application URL
- Check that you've added both the development and production URLs

### "Error 403: access_denied"

- Make sure your OAuth consent screen is properly configured
- Verify that the user is added as a test user (if in development mode)

### "Google Client ID not found"

- Verify that `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file
- Restart the development server after adding environment variables

### Token not being sent to backend

- Check browser console for errors
- Verify the `/auth/google` endpoint exists in your backend
- Check network tab to see the actual API request

### "Invalid Google token" from backend

- Ensure backend is correctly verifying the token with Google's API
- Check that the token hasn't expired (Google access tokens are short-lived)
- Verify network connectivity to Google's servers from your backend

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Identity Platform](https://developers.google.com/identity)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [Verify Google ID Tokens](https://developers.google.com/identity/sign-in/web/backend-auth)

## Production Checklist

Before deploying to production:

- [ ] Create production Google Cloud Project credentials
- [ ] Add production domain to Authorized JavaScript origins
- [ ] Add production domain to Authorized redirect URIs
- [ ] Set `VITE_GOOGLE_CLIENT_ID` environment variable in production
- [ ] Verify OAuth consent screen is published (not in testing mode)
- [ ] Implement proper error handling and user feedback
- [ ] Add analytics/logging for OAuth events
- [ ] Test the full authentication flow in production environment
- [ ] Implement proper session management
- [ ] Add rate limiting to prevent abuse
- [ ] Review and update privacy policy with Google authentication information

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Google Cloud Console logs
3. Check browser console for frontend errors
4. Review backend API logs for token verification issues
