# Google OAuth Authentication Flow Diagrams

## High-Level User Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         User Authentication                          │
└─────────────────────────────────────────────────────────────────────┘

┌──────────┐
│   User   │
│  Visits  │
│  /login  │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────────┐
│     Login Page Displayed            │
│  ┌───────────────────────────────┐  │
│  │  Username: ______________     │  │
│  │  Password: ______________     │  │
│  │  [Login Button]               │  │
│  │  ─────── OR ────────          │  │
│  │  [ Continue with Google ]  ◄──┼──┐
│  └───────────────────────────────┘  │  │
└─────────────────────────────────────┘  │
                                          │
                ┌─────────────────────────┘
                │ User clicks
                ▼
┌─────────────────────────────────────┐
│     Google OAuth Popup Opens        │
│  ┌───────────────────────────────┐  │
│  │  Sign in with Google          │  │
│  │  ──────────────────────       │  │
│  │  Email: user@gmail.com        │  │
│  │  [Continue]                   │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   User Grants Permissions           │
│  ┌───────────────────────────────┐  │
│  │  Headknot wants to:           │  │
│  │  ✓ View email address         │  │
│  │  ✓ View basic profile info    │  │
│  │  [Allow]  [Cancel]            │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Token Exchange & Login            │
└─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────┐
│   Redirected to Dashboard           │
└─────────────────────────────────────┘
```

## Detailed Technical Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│          │         │          │         │          │         │          │
│  Browser │         │ Frontend │         │  Backend │         │  Google  │
│          │         │   (App)  │         │   (API)  │         │   APIs   │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                    │                    │
     │ 1. Visit /login    │                    │                    │
     │───────────────────>│                    │                    │
     │                    │                    │                    │
     │ 2. Show login page │                    │                    │
     │<───────────────────│                    │                    │
     │                    │                    │                    │
     │ 3. Click Google    │                    │                    │
     │───────────────────>│                    │                    │
     │                    │                    │                    │
     │                    │ 4. Open OAuth popup│                    │
     │                    │────────────────────┼───────────────────>│
     │                    │                    │                    │
     │                    │      5. Show Google login screen         │
     │<───────────────────┼────────────────────┼────────────────────│
     │                    │                    │                    │
     │ 6. Enter credentials & grant permissions│                    │
     │────────────────────┼────────────────────┼───────────────────>│
     │                    │                    │                    │
     │                    │ 7. Return Google access token           │
     │<───────────────────┼────────────────────┼────────────────────│
     │                    │                    │                    │
     │                    │ 8. POST /auth/google                    │
     │                    │    {accessToken}   │                    │
     │                    │───────────────────>│                    │
     │                    │                    │                    │
     │                    │                    │ 9. Verify token    │
     │                    │                    │───────────────────>│
     │                    │                    │                    │
     │                    │                    │ 10. User info      │
     │                    │                    │<───────────────────│
     │                    │                    │                    │
     │                    │                    │ 11. Create/update  │
     │                    │                    │     user in DB     │
     │                    │                    │──┐                 │
     │                    │                    │  │                 │
     │                    │                    │<─┘                 │
     │                    │                    │                    │
     │                    │                    │ 12. Generate JWT   │
     │                    │                    │──┐                 │
     │                    │                    │  │                 │
     │                    │                    │<─┘                 │
     │                    │                    │                    │
     │                    │ 13. Return tokens  │                    │
     │                    │ {accessToken,      │                    │
     │                    │  refreshToken}     │                    │
     │                    │<───────────────────│                    │
     │                    │                    │                    │
     │                    │ 14. Store tokens   │                    │
     │                    │     in localStorage│                    │
     │                    │──┐                 │                    │
     │                    │  │                 │                    │
     │                    │<─┘                 │                    │
     │                    │                    │                    │
     │ 15. Redirect to /  │                    │                    │
     │<───────────────────│                    │                    │
     │                    │                    │                    │
     │ 16. GET /profile/me│                    │                    │
     │    (with auth token)                    │                    │
     │────────────────────┼───────────────────>│                    │
     │                    │                    │                    │
     │ 17. User data      │                    │                    │
     │<───────────────────┼────────────────────│                    │
     │                    │                    │                    │
     │ 18. Show dashboard │                    │                    │
     │<───────────────────│                    │                    │
     │                    │                    │                    │
```

## State Diagram

```
                    ┌──────────────┐
                    │              │
                    │  Not Logged  │
                    │      In      │
                    │              │
                    └──────┬───────┘
                           │
         ┌─────────────────┴─────────────────┐
         │                                   │
         │ Click "Continue with Google"      │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│                 │                 │                 │
│  Google OAuth   │                 │  Traditional    │
│  Popup Opens    │                 │  Login Form     │
│                 │                 │                 │
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         │ User authenticates                │ Submit
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│                 │                 │                 │
│  Google Token   │                 │  POST /login    │
│    Received     │                 │                 │
│                 │                 │                 │
└────────┬────────┘                 └────────┬────────┘
         │                                   │
         │ POST /auth/google                 │
         │                                   │
         └─────────────────┬─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │                 │
                  │  Backend        │
                  │  Validates &    │
                  │  Returns Tokens │
                  │                 │
                  └────────┬────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
      ┌────────┐      ┌────────┐     ┌────────┐
      │Success │      │Invalid │     │ Error  │
      │        │      │ Token  │     │        │
      └───┬────┘      └───┬────┘     └───┬────┘
          │               │               │
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐   ┌──────────┐
    │ Store    │    │ Show     │   │ Show     │
    │ Tokens   │    │ Error    │   │ Error    │
    │          │    │ Message  │   │ Message  │
    └────┬─────┘    └────┬─────┘   └────┬─────┘
         │               │               │
         ▼               └───────┬───────┘
    ┌──────────┐                │
    │Redirect  │                │
    │   to     │                │
    │Dashboard │                │
    └────┬─────┘                │
         │                      │
         ▼                      ▼
    ┌──────────┐          ┌──────────┐
    │          │          │          │
    │ Logged   │          │   Stay   │
    │   In     │          │ on Login │
    │          │          │          │
    └──────────┘          └──────────┘
```

## Component Interaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                          main.tsx                                │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │           GoogleOAuthProvider                             │  │
│  │           (clientId from env)                             │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │         QueryClientProvider                         │  │  │
│  │  │  ┌───────────────────────────────────────────────┐  │  │  │
│  │  │  │            BrowserRouter                      │  │  │  │
│  │  │  │  ┌─────────────────────────────────────────┐  │  │  │  │
│  │  │  │  │           ThemeProvider                 │  │  │  │  │
│  │  │  │  │  ┌───────────────────────────────────┐  │  │  │  │  │
│  │  │  │  │  │             App                   │  │  │  │  │  │
│  │  │  │  │  │                                   │  │  │  │  │  │
│  │  │  │  │  │  Routes:                          │  │  │  │  │  │
│  │  │  │  │  │  - /login  → Login Page          │  │  │  │  │  │
│  │  │  │  │  │  - /signup → Signup Page         │  │  │  │  │  │
│  │  │  │  │  │  - /       → Dashboard (auth)    │  │  │  │  │  │
│  │  │  │  │  └───────────────────────────────────┘  │  │  │  │  │
│  │  │  │  └─────────────────────────────────────────┘  │  │  │  │
│  │  │  └───────────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

                            │
                            ▼

┌─────────────────────────────────────────────────────────────────┐
│                       Login.tsx                                  │
│                                                                  │
│  State:                                                          │
│  - login mutation (username/password)                           │
│  - googleLogin mutation (Google token)                          │
│                                                                  │
│  Handlers:                                                       │
│  - onSubmit(values) → POST /auth/login                          │
│  - handleGoogleLogin(token) → googleAuth(token)                 │
│                                                                  │
│  Renders: <LoginForm>                                           │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                     LoginForm.tsx                                │
│                                                                  │
│  State:                                                          │
│  - form (useForm with Zod validation)                           │
│  - googleLogin (useGoogleLogin hook)                            │
│                                                                  │
│  UI Elements:                                                    │
│  - Username input                                               │
│  - Password input                                               │
│  - Login button                                                 │
│  - [ Continue with Google ] button ◄── Triggers googleLogin     │
│                                                                  │
│  On Google Success:                                             │
│  - Calls props.onGoogleLogin(accessToken)                       │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  packages/api-client                             │
│                                                                  │
│  googleAuth(accessToken):                                       │
│  1. POST /auth/google                                           │
│  2. Body: { accessToken }                                       │
│  3. Returns: { accessToken, refreshToken }                      │
│                                                                  │
│  storage object:                                                │
│  - storage.access (get/set localStorage)                        │
│  - storage.refresh (get/set localStorage)                       │
│  - storage.clear() (remove both)                                │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling Flow

```
┌────────────────────────────────────────────────────────────┐
│            User clicks "Continue with Google"               │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Google Popup Opens   │
         └───────┬───────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌────────┐
│Success │  │User    │  │Error   │
│        │  │Cancels │  │        │
└───┬────┘  └───┬────┘  └───┬────┘
    │           │           │
    │           ▼           ▼
    │      ┌────────────────────┐
    │      │ onError callback   │
    │      │ Show error message │
    │      │ Stay on login page │
    │      └────────────────────┘
    │
    ▼
┌──────────────────────┐
│ Google Access Token  │
│ Received             │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ POST /auth/google    │
└────────┬─────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌────────┐
│Success │  │Error   │
│200 OK  │  │4xx/5xx │
└───┬────┘  └───┬────┘
    │           │
    ▼           ▼
┌────────┐  ┌─────────────────┐
│Store   │  │ onError callback│
│Tokens  │  │ console.error   │
│        │  │ Stay on login   │
└───┬────┘  └─────────────────┘
    │
    ▼
┌────────────────┐
│ window.location│
│ .href = next   │
└────────────────┘
    │
    ▼
┌────────────────┐
│ Dashboard      │
└────────────────┘
```

## Token Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    Token Lifecycle                           │
└─────────────────────────────────────────────────────────────┘

1. Login Success
   ┌──────────────────────────────────────┐
   │ Receive from Backend:                │
   │ - accessToken (JWT, 15 min TTL)      │
   │ - refreshToken (JWT, 7 day TTL)      │
   └────────────┬─────────────────────────┘
                │
                ▼
   ┌──────────────────────────────────────┐
   │ Store in localStorage:               │
   │ - accessToken                        │
   │ - refreshToken                       │
   └────────────┬─────────────────────────┘
                │
                ▼

2. Making API Requests
   ┌──────────────────────────────────────┐
   │ authMiddleware intercepts request    │
   │ Adds: Authorization: Bearer {token}  │
   └────────────┬─────────────────────────┘
                │
                ▼
   ┌──────────────────────────────────────┐
   │ Backend validates token              │
   └────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   ┌────────┐      ┌────────┐
   │Valid   │      │Invalid │
   │200 OK  │      │401     │
   └────────┘      └───┬────┘
                       │
                       ▼
   ┌──────────────────────────────────────┐
   │ authMiddleware onResponse            │
   │ Detects 401                          │
   └────────────┬─────────────────────────┘
                │
                ▼
   ┌──────────────────────────────────────┐
   │ POST /auth/refresh                   │
   │ Body: { refreshToken }               │
   └────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
   ┌────────┐      ┌────────┐
   │Success │      │Failed  │
   └───┬────┘      └───┬────┘
       │               │
       ▼               ▼
   ┌────────┐      ┌─────────────┐
   │Update  │      │Clear tokens │
   │Tokens  │      │Redirect to  │
   │Retry   │      │/login       │
   │Request │      └─────────────┘
   └────────┘

3. Logout
   ┌──────────────────────────────────────┐
   │ storage.clear()                      │
   │ - Remove accessToken                 │
   │ - Remove refreshToken                │
   └────────────┬─────────────────────────┘
                │
                ▼
   ┌──────────────────────────────────────┐
   │ Redirect to /login                   │
   └──────────────────────────────────────┘
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    Google User Data Flow                          │
└──────────────────────────────────────────────────────────────────┘

Google User Object:
┌─────────────────────────────────────┐
│ {                                   │
│   sub: "108123456789",              │ ◄─ Unique Google ID
│   email: "user@gmail.com",          │ ◄─ User's email
│   email_verified: true,             │ ◄─ Email verification status
│   name: "John Doe",                 │ ◄─ Full name
│   given_name: "John",               │ ◄─ First name
│   family_name: "Doe",               │ ◄─ Last name
│   picture: "https://...",           │ ◄─ Profile picture URL
│   locale: "en"                      │ ◄─ User's locale
│ }                                   │
└─────────────┬───────────────────────┘
              │
              ▼
Backend processes and creates:
┌─────────────────────────────────────┐
│ User Record in Database:            │
│ {                                   │
│   id: uuid(),                       │ ◄─ Generated by backend
│   googleId: "108123456789",         │ ◄─ From Google (unique)
│   email: "user@gmail.com",          │ ◄─ From Google
│   fullName: "John Doe",             │ ◄─ From Google
│   profilePicture: "https://...",    │ ◄─ From Google
│   emailVerified: true,              │ ◄─ From Google
│   lastLoginAt: new Date(),          │ ◄─ Generated by backend
│   createdAt: new Date(),            │ ◄─ Generated by backend
│ }                                   │
└─────────────┬───────────────────────┘
              │
              ▼
Backend generates JWT:
┌─────────────────────────────────────┐
│ Access Token:                       │
│ {                                   │
│   userId: user.id,                  │
│   email: user.email,                │
│   exp: Date.now() + 15min           │
│ }                                   │
│                                     │
│ Refresh Token:                      │
│ {                                   │
│   userId: user.id,                  │
│   exp: Date.now() + 7days           │
│ }                                   │
└─────────────┬───────────────────────┘
              │
              ▼
Frontend stores:
┌─────────────────────────────────────┐
│ localStorage:                       │
│ - accessToken: "eyJhbGc..."         │
│ - refreshToken: "eyJhbGc..."        │
└─────────────────────────────────────┘
```

## Multi-Account Scenario

```
Scenario: User has both Google and traditional accounts

Initial State:
┌──────────────────────────────────┐
│ User Table:                      │
│ ┌──────────────────────────────┐ │
│ │ id: 1                        │ │
│ │ email: user@gmail.com        │ │
│ │ username: user123            │ │
│ │ password: hashed_password    │ │
│ │ googleId: null               │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘

User logs in with Google:
┌──────────────────────────────────┐
│ Backend finds user by email      │
│ Updates: googleId = "108..."     │
└──────────────────────────────────┘
                │
                ▼
After Google Login:
┌──────────────────────────────────┐
│ User Table:                      │
│ ┌──────────────────────────────┐ │
│ │ id: 1                        │ │
│ │ email: user@gmail.com        │ │
│ │ username: user123            │ │
│ │ password: hashed_password    │ │
│ │ googleId: "108..."  ◄─ LINKED│ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘

Now user can login with:
✓ Username + Password
✓ Google OAuth
```
