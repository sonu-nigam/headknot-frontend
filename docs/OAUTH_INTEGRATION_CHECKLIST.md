# Google OAuth Integration Checklist

This checklist helps ensure proper implementation and deployment of Google OAuth authentication.

## 📋 Frontend Team Checklist

### Development Setup
- [x] Install `@react-oauth/google` package
- [x] Wrap app with `GoogleOAuthProvider` in `main.tsx`
- [x] Add Google OAuth button to `LoginForm.tsx`
- [x] Add Google OAuth button to `SignupForm.tsx`
- [x] Implement `googleAuth` helper in API client
- [x] Add `onGoogleLogin` handlers in Login/Signup pages
- [ ] Create `.env` file from `.env.example`
- [ ] Obtain Google Client ID from Google Cloud Console
- [ ] Add `VITE_GOOGLE_CLIENT_ID` to `.env` file
- [ ] Restart development server after env changes

### Google Cloud Console Setup
- [ ] Create or select Google Cloud project
- [ ] Navigate to "APIs & Services" > "Credentials"
- [ ] Create OAuth 2.0 Client ID
- [ ] Select "Web application" type
- [ ] Add authorized JavaScript origins:
  - [ ] `http://localhost:5173` (development)
  - [ ] `https://yourdomain.com` (production)
- [ ] Add authorized redirect URIs:
  - [ ] `http://localhost:5173` (development)
  - [ ] `https://yourdomain.com` (production)
- [ ] Configure OAuth consent screen:
  - [ ] Add app name
  - [ ] Add support email
  - [ ] Add developer contact
  - [ ] Add required scopes (email, profile, openid)
  - [ ] Add test users (if External type in development)
- [ ] Copy Client ID to `.env` file

### Testing
- [ ] Development server starts without errors
- [ ] No TypeScript errors
- [ ] Login page renders correctly
- [ ] Signup page renders correctly
- [ ] "Continue with Google" button is visible
- [ ] Clicking button opens Google OAuth popup
- [ ] Can authenticate with test Google account
- [ ] Google popup closes after authentication
- [ ] Frontend receives Google access token
- [ ] Token sent to backend `/auth/google` endpoint
- [ ] Backend response received (tokens or error)
- [ ] Tokens stored in localStorage on success
- [ ] User redirected to dashboard after success
- [ ] Can access protected routes after login
- [ ] Error messages displayed on failure
- [ ] Logout clears tokens properly

### Production Deployment
- [ ] Create production Google OAuth credentials
- [ ] Add production domain to authorized origins
- [ ] Add production domain to redirect URIs
- [ ] Set `VITE_GOOGLE_CLIENT_ID` in production environment
- [ ] Publish OAuth consent screen (remove testing mode)
- [ ] Test full flow in production environment
- [ ] Verify HTTPS is enabled
- [ ] Test with real user accounts
- [ ] Monitor error logs
- [ ] Set up analytics for OAuth events

---

## 🔧 Backend Team Checklist

### API Endpoint Implementation
- [ ] Create `POST /auth/google` endpoint
- [ ] Accept `{ accessToken: string }` in request body
- [ ] Validate request body (accessToken required)
- [ ] Implement Google token verification
- [ ] Call `https://www.googleapis.com/oauth2/v3/userinfo`
- [ ] Handle Google API errors (401, 403, 500)
- [ ] Parse Google user information
- [ ] Extract: `sub`, `email`, `name`, `picture`, `email_verified`

### Database Operations
- [ ] Check if user exists by Google ID
- [ ] If not, check if user exists by email
- [ ] If exists by email, link Google account to existing user
- [ ] If new user, create user record with Google data
- [ ] Update user's last login timestamp
- [ ] Handle database errors gracefully

### JWT Token Generation
- [ ] Generate access token (JWT)
- [ ] Set access token expiration (recommended: 15 minutes)
- [ ] Include user ID and email in access token payload
- [ ] Generate refresh token (JWT)
- [ ] Set refresh token expiration (recommended: 7 days)
- [ ] Include user ID in refresh token payload
- [ ] Use strong secrets from environment variables

### Refresh Token Management
- [ ] Hash refresh tokens before storing
- [ ] Store refresh token in database
- [ ] Link refresh token to user ID
- [ ] Store expiration timestamp
- [ ] Implement token revocation on logout
- [ ] Implement token rotation on refresh
- [ ] Clean up expired tokens periodically

### Response Handling
- [ ] Return `{ accessToken, refreshToken }` on success (200)
- [ ] Return error message on invalid token (401)
- [ ] Return error message on missing token (400)
- [ ] Return error message on server error (500)
- [ ] Include proper Content-Type headers
- [ ] Follow consistent error response format

### Security Implementation
- [ ] Always verify Google token server-side
- [ ] Never trust client-provided user data
- [ ] Implement rate limiting (e.g., 5 requests per 15 minutes)
- [ ] Use HTTPS in production
- [ ] Validate token expiration
- [ ] Implement CORS properly
- [ ] Hash refresh tokens in database
- [ ] Use environment variables for secrets
- [ ] Validate email format
- [ ] Sanitize user input

### Logging & Monitoring
- [ ] Log successful authentications
- [ ] Log failed authentication attempts
- [ ] Log Google API errors
- [ ] Log database errors
- [ ] Include timestamp in logs
- [ ] Include user ID in logs (if available)
- [ ] Include IP address in logs
- [ ] Set up alerts for high failure rates
- [ ] Monitor Google API response times
- [ ] Track new user signups via OAuth

### Database Schema
- [ ] Users table includes `google_id` column (nullable, unique)
- [ ] Users table includes `email` column (unique)
- [ ] Users table includes `full_name` column
- [ ] Users table includes `profile_picture` column
- [ ] Users table includes `email_verified` column
- [ ] Users table includes `last_login_at` column
- [ ] Users table has index on `google_id`
- [ ] Users table has index on `email`
- [ ] Refresh tokens table created
- [ ] Refresh tokens table has foreign key to users
- [ ] Refresh tokens table has index on `user_id`
- [ ] Refresh tokens table has index on `expires_at`

### Environment Variables
- [ ] `JWT_SECRET` configured
- [ ] `JWT_REFRESH_SECRET` configured
- [ ] `DATABASE_URL` configured
- [ ] `GOOGLE_CLIENT_ID` configured (optional, for additional verification)
- [ ] `GOOGLE_CLIENT_SECRET` configured (optional)
- [ ] Secrets are strong and random
- [ ] Secrets are different between environments
- [ ] Secrets are not committed to version control

### Testing
- [ ] Unit tests for token verification
- [ ] Unit tests for user creation
- [ ] Unit tests for user linking
- [ ] Unit tests for JWT generation
- [ ] Integration test for full auth flow
- [ ] Test with valid Google token
- [ ] Test with invalid Google token
- [ ] Test with expired Google token
- [ ] Test with missing accessToken field
- [ ] Test creating new user
- [ ] Test linking existing user
- [ ] Test duplicate Google ID handling
- [ ] Test database errors
- [ ] Test Google API errors
- [ ] Load test the endpoint

### Documentation
- [ ] Update API documentation (OpenAPI/Swagger)
- [ ] Document request/response formats
- [ ] Document error codes
- [ ] Document rate limits
- [ ] Add endpoint to API reference
- [ ] Update integration guide for frontend team
- [ ] Document environment variables
- [ ] Create runbook for troubleshooting

### Production Deployment
- [ ] Deploy to staging environment
- [ ] Test on staging with frontend
- [ ] Verify rate limiting works
- [ ] Verify logging works
- [ ] Verify monitoring/alerts work
- [ ] Deploy to production
- [ ] Smoke test in production
- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Set up on-call alerts

---

## 🔄 Integration Testing Checklist

### End-to-End Flow
- [ ] Frontend sends valid Google token
- [ ] Backend receives token
- [ ] Backend verifies token with Google
- [ ] Backend creates/updates user
- [ ] Backend generates JWT tokens
- [ ] Backend returns tokens to frontend
- [ ] Frontend stores tokens
- [ ] Frontend redirects user
- [ ] User can access protected routes
- [ ] Subsequent API calls include access token
- [ ] Access token is validated on protected endpoints
- [ ] Token refresh works when access token expires

### Error Scenarios
- [ ] Invalid Google token returns 401
- [ ] Expired Google token returns 401
- [ ] Missing accessToken field returns 400
- [ ] Malformed request returns 400
- [ ] Database error returns 500
- [ ] Google API timeout handled gracefully
- [ ] Frontend displays error messages
- [ ] User can retry after error
- [ ] Rate limit exceeded returns 429
- [ ] Proper error messages logged

### Edge Cases
- [ ] User exists with email, not Google ID (account linking)
- [ ] User exists with Google ID (returning user)
- [ ] New user signup via Google
- [ ] Multiple rapid authentication attempts
- [ ] Token refresh during active session
- [ ] Logout and re-authenticate
- [ ] Authenticate from multiple devices
- [ ] Network interruption during auth
- [ ] Browser blocks popup
- [ ] User cancels Google authentication

---

## 📊 OpenAPI Schema Update

### Schema Changes Needed
- [ ] Add `/auth/google` path to schema
- [ ] Define POST operation
- [ ] Define request body schema
- [ ] Define 200 success response
- [ ] Define 400 error response
- [ ] Define 401 error response
- [ ] Define 500 error response
- [ ] Add operation description
- [ ] Add operation tags
- [ ] Add request/response examples
- [ ] Regenerate TypeScript types
- [ ] Update API client to use typed endpoint
- [ ] Remove `googleAuth` helper function workaround
- [ ] Update imports in Login/Signup pages
- [ ] Run `pnpm build:schema`
- [ ] Verify no TypeScript errors
- [ ] Test with updated types

---

## 🔒 Security Audit Checklist

### Authentication Security
- [x] Frontend uses HTTPS in production
- [ ] Backend uses HTTPS in production
- [ ] Google tokens verified server-side only
- [ ] No sensitive data in client-side code
- [ ] JWT secrets are strong (32+ characters)
- [ ] JWT secrets are environment-specific
- [ ] Access tokens are short-lived (15 min max)
- [ ] Refresh tokens are hashed in database
- [ ] Tokens use secure signing algorithms (HS256 or RS256)
- [ ] Token expiration is validated
- [ ] Revoked tokens cannot be used

### Network Security
- [ ] CORS configured correctly
- [ ] Only allowed origins can make requests
- [ ] CSP headers configured
- [ ] Rate limiting implemented
- [ ] DDoS protection considered
- [ ] API endpoints behind firewall (if applicable)
- [ ] Logs don't contain sensitive data
- [ ] Logs don't contain tokens

### Data Privacy
- [ ] GDPR compliance considered
- [ ] User consent obtained
- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] User data encrypted at rest
- [ ] User data encrypted in transit
- [ ] Minimal data requested from Google
- [ ] User can delete their account
- [ ] User can revoke Google access

---

## 📈 Post-Launch Monitoring

### Metrics to Track
- [ ] OAuth login success rate
- [ ] OAuth login failure rate
- [ ] Average authentication time
- [ ] New user signups via Google
- [ ] Returning user logins via Google
- [ ] Token refresh rate
- [ ] Error rates by type
- [ ] Google API response times
- [ ] Database query performance
- [ ] Rate limit hits

### Alerts to Configure
- [ ] OAuth failure rate > 10%
- [ ] Google API errors > 5%
- [ ] Response time > 2 seconds
- [ ] Database connection failures
- [ ] Rate limit exceeded frequently
- [ ] JWT secret rotation needed
- [ ] Refresh token expiration errors
- [ ] High error rate (5xx responses)

---

## ✅ Final Verification

### Before Launch
- [ ] All frontend checklist items completed
- [ ] All backend checklist items completed
- [ ] Integration testing passed
- [ ] Security audit completed
- [ ] Documentation updated
- [ ] Team trained on troubleshooting
- [ ] Monitoring configured
- [ ] Rollback plan documented
- [ ] Support team notified
- [ ] Users notified of new feature

### Launch Day
- [ ] Deploy to production during low-traffic period
- [ ] Monitor error rates closely
- [ ] Monitor authentication success rates
- [ ] Check logs for unexpected errors
- [ ] Verify user feedback is positive
- [ ] Be ready for quick rollback if needed
- [ ] Document any issues encountered

### Post-Launch (First Week)
- [ ] Review authentication metrics
- [ ] Review error logs
- [ ] Collect user feedback
- [ ] Address any bugs found
- [ ] Optimize based on performance data
- [ ] Update documentation based on learnings
- [ ] Plan next iteration improvements

---

## 📚 Documentation References

- **Full Setup Guide**: `docs/GOOGLE_OAUTH_SETUP.md`
- **Backend Implementation**: `docs/BACKEND_OAUTH_GUIDE.md`
- **Quick Reference**: `docs/OAUTH_QUICK_REFERENCE.md`
- **Implementation Summary**: `docs/OAUTH_IMPLEMENTATION_SUMMARY.md`
- **App README**: `apps/app/README.md`

---

## 🆘 Troubleshooting Resources

If issues arise, check:
1. Browser console for frontend errors
2. Network tab for API request/response
3. Backend logs for server errors
4. Google Cloud Console for OAuth config
5. Environment variables are set correctly
6. Database connection is working
7. JWT secrets are configured
8. Google API is accessible from backend

For questions, refer to documentation or contact:
- Frontend Team: [frontend-team@example.com]
- Backend Team: [backend-team@example.com]
- DevOps Team: [devops-team@example.com]

---

**Last Updated**: [Date of implementation]
**Version**: 1.0.0
**Status**: Implementation Complete (Pending Backend)
