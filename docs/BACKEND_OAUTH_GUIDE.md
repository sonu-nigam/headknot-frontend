# Backend Implementation Guide for Google OAuth

This guide provides backend developers with everything needed to implement the `/auth/google` endpoint for Google OAuth authentication.

## Overview

The frontend sends a Google access token to your backend. Your backend must:
1. Verify the token with Google
2. Get user information
3. Create or update the user in your database
4. Return your application's JWT tokens

## Endpoint Specification

### `POST /auth/google`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "accessToken": "ya29.a0AfH6SMBxxx..."
}
```

**Success Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "message": "Invalid or expired Google token"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Access token is required"
}
```

## Implementation Steps

### Step 1: Verify Google Token

Make a request to Google's userinfo endpoint to verify the token and get user data:

```javascript
async function verifyGoogleToken(accessToken) {
  const response = await fetch(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error('Invalid or expired Google token');
  }

  const userInfo = await response.json();
  
  return {
    googleId: userInfo.sub,           // Google user ID (unique)
    email: userInfo.email,            // User's email
    emailVerified: userInfo.email_verified,
    name: userInfo.name,              // Full name
    givenName: userInfo.given_name,   // First name
    familyName: userInfo.family_name, // Last name
    picture: userInfo.picture,        // Profile picture URL
    locale: userInfo.locale           // User's locale
  };
}
```

### Step 2: Find or Create User

```javascript
async function findOrCreateUser(googleUserInfo) {
  // Try to find user by Google ID first
  let user = await db.users.findOne({
    where: { googleId: googleUserInfo.googleId }
  });

  if (!user) {
    // Try to find by email (in case user signed up with email/password)
    user = await db.users.findOne({
      where: { email: googleUserInfo.email }
    });

    if (user) {
      // Link Google account to existing user
      user = await db.users.update(user.id, {
        googleId: googleUserInfo.googleId,
        profilePicture: googleUserInfo.picture,
        lastLoginAt: new Date()
      });
    } else {
      // Create new user
      user = await db.users.create({
        googleId: googleUserInfo.googleId,
        email: googleUserInfo.email,
        fullName: googleUserInfo.name,
        profilePicture: googleUserInfo.picture,
        emailVerified: googleUserInfo.emailVerified,
        lastLoginAt: new Date(),
        createdAt: new Date()
      });
    }
  } else {
    // Update last login time
    user = await db.users.update(user.id, {
      lastLoginAt: new Date()
    });
  }

  return user;
}
```

### Step 3: Generate JWT Tokens

```javascript
function generateTokens(user) {
  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      type: 'access'
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' } // Short-lived
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
      type: 'refresh'
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' } // Long-lived
  );

  return { accessToken, refreshToken };
}
```

### Step 4: Store Refresh Token (Optional but Recommended)

```javascript
async function storeRefreshToken(userId, refreshToken) {
  // Hash the refresh token before storing
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  
  await db.refreshTokens.create({
    userId: userId,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date()
  });
}
```

## Complete Implementation Examples

### Node.js + Express

```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/auth/google', async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        message: 'Access token is required'
      });
    }

    // Step 1: Verify Google token and get user info
    const googleResponse = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!googleResponse.ok) {
      return res.status(401).json({
        message: 'Invalid or expired Google token'
      });
    }

    const googleUser = await googleResponse.json();

    // Step 2: Find or create user
    let user = await db.users.findOne({
      where: { googleId: googleUser.sub }
    });

    if (!user) {
      user = await db.users.findOne({
        where: { email: googleUser.email }
      });

      if (user) {
        // Link Google account
        await db.users.update(user.id, {
          googleId: googleUser.sub,
          profilePicture: googleUser.picture
        });
      } else {
        // Create new user
        user = await db.users.create({
          googleId: googleUser.sub,
          email: googleUser.email,
          fullName: googleUser.name,
          profilePicture: googleUser.picture,
          emailVerified: googleUser.email_verified
        });
      }
    }

    // Update last login
    await db.users.update(user.id, {
      lastLoginAt: new Date()
    });

    // Step 3: Generate JWT tokens
    const tokens = {
      accessToken: jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      ),
      refreshToken: jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
      )
    };

    // Step 4: Store refresh token
    await db.refreshTokens.create({
      userId: user.id,
      token: await bcrypt.hash(tokens.refreshToken, 10),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // Step 5: Return tokens
    return res.json(tokens);

  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
});

module.exports = router;
```

### Python + FastAPI

```python
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
import httpx
import jwt
from datetime import datetime, timedelta

router = APIRouter()

class GoogleAuthRequest(BaseModel):
    accessToken: str

class TokenResponse(BaseModel):
    accessToken: str
    refreshToken: str

@router.post("/auth/google", response_model=TokenResponse)
async def google_auth(request: GoogleAuthRequest):
    try:
        # Step 1: Verify Google token
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {request.accessToken}"}
            )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Google token"
            )
        
        google_user = response.json()
        
        # Step 2: Find or create user
        user = await db.users.find_one({"googleId": google_user["sub"]})
        
        if not user:
            user = await db.users.find_one({"email": google_user["email"]})
            
            if user:
                # Link Google account
                await db.users.update_one(
                    {"_id": user["_id"]},
                    {"$set": {
                        "googleId": google_user["sub"],
                        "profilePicture": google_user["picture"]
                    }}
                )
            else:
                # Create new user
                user = await db.users.insert_one({
                    "googleId": google_user["sub"],
                    "email": google_user["email"],
                    "fullName": google_user["name"],
                    "profilePicture": google_user["picture"],
                    "emailVerified": google_user.get("email_verified", False),
                    "createdAt": datetime.utcnow()
                })
        
        # Update last login
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"lastLoginAt": datetime.utcnow()}}
        )
        
        # Step 3: Generate JWT tokens
        access_token = jwt.encode(
            {
                "userId": str(user["_id"]),
                "email": user["email"],
                "exp": datetime.utcnow() + timedelta(minutes=15)
            },
            os.getenv("JWT_SECRET"),
            algorithm="HS256"
        )
        
        refresh_token = jwt.encode(
            {
                "userId": str(user["_id"]),
                "exp": datetime.utcnow() + timedelta(days=7)
            },
            os.getenv("JWT_REFRESH_SECRET"),
            algorithm="HS256"
        )
        
        # Step 4: Store refresh token
        await db.refresh_tokens.insert_one({
            "userId": user["_id"],
            "token": hash_token(refresh_token),
            "expiresAt": datetime.utcnow() + timedelta(days=7)
        })
        
        return TokenResponse(
            accessToken=access_token,
            refreshToken=refresh_token
        )
        
    except Exception as e:
        print(f"Google OAuth error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
```

### Go + Gin

```go
package handlers

import (
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
)

type GoogleAuthRequest struct {
    AccessToken string `json:"accessToken" binding:"required"`
}

type TokenResponse struct {
    AccessToken  string `json:"accessToken"`
    RefreshToken string `json:"refreshToken"`
}

type GoogleUserInfo struct {
    Sub           string `json:"sub"`
    Email         string `json:"email"`
    EmailVerified bool   `json:"email_verified"`
    Name          string `json:"name"`
    Picture       string `json:"picture"`
}

func GoogleAuth(c *gin.Context) {
    var req GoogleAuthRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{
            "message": "Access token is required",
        })
        return
    }

    // Step 1: Verify Google token
    httpReq, _ := http.NewRequest("GET", "https://www.googleapis.com/oauth2/v3/userinfo", nil)
    httpReq.Header.Set("Authorization", "Bearer "+req.AccessToken)
    
    client := &http.Client{}
    resp, err := client.Do(httpReq)
    if err != nil || resp.StatusCode != 200 {
        c.JSON(http.StatusUnauthorized, gin.H{
            "message": "Invalid or expired Google token",
        })
        return
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    var googleUser GoogleUserInfo
    json.Unmarshal(body, &googleUser)

    // Step 2: Find or create user
    user, err := db.FindUserByGoogleID(googleUser.Sub)
    if err != nil {
        user, err = db.FindUserByEmail(googleUser.Email)
        if err != nil {
            // Create new user
            user, err = db.CreateUser(&User{
                GoogleID:       googleUser.Sub,
                Email:          googleUser.Email,
                FullName:       googleUser.Name,
                ProfilePicture: googleUser.Picture,
                EmailVerified:  googleUser.EmailVerified,
                CreatedAt:      time.Now(),
            })
        } else {
            // Link Google account
            db.UpdateUser(user.ID, map[string]interface{}{
                "google_id":       googleUser.Sub,
                "profile_picture": googleUser.Picture,
            })
        }
    }

    // Update last login
    db.UpdateUser(user.ID, map[string]interface{}{
        "last_login_at": time.Now(),
    })

    // Step 3: Generate JWT tokens
    accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userId": user.ID,
        "email":  user.Email,
        "exp":    time.Now().Add(time.Minute * 15).Unix(),
    })
    accessTokenString, _ := accessToken.SignedString([]byte(os.Getenv("JWT_SECRET")))

    refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "userId": user.ID,
        "exp":    time.Now().Add(time.Hour * 24 * 7).Unix(),
    })
    refreshTokenString, _ := refreshToken.SignedString([]byte(os.Getenv("JWT_REFRESH_SECRET")))

    // Step 4: Store refresh token
    db.CreateRefreshToken(&RefreshToken{
        UserID:    user.ID,
        Token:     hashToken(refreshTokenString),
        ExpiresAt: time.Now().Add(time.Hour * 24 * 7),
    })

    c.JSON(http.StatusOK, TokenResponse{
        AccessToken:  accessTokenString,
        RefreshToken: refreshTokenString,
    })
}
```

## Database Schema Suggestions

### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    profile_picture TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
```

### Refresh Tokens Table

```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);
```

## Security Best Practices

### 1. Always Verify the Token Server-Side

```javascript
// ❌ NEVER trust client-provided user data
app.post('/auth/google', (req, res) => {
  const { email, name } = req.body; // DON'T DO THIS
  // Create user with this data... // INSECURE!
});

// ✅ ALWAYS verify with Google
app.post('/auth/google', async (req, res) => {
  const { accessToken } = req.body;
  const googleUser = await verifyWithGoogle(accessToken); // SECURE
  // Now use googleUser data
});
```

### 2. Implement Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts, please try again later'
});

app.post('/auth/google', authLimiter, googleAuthHandler);
```

### 3. Hash Refresh Tokens

```javascript
const bcrypt = require('bcrypt');

// Before storing
const hashedToken = await bcrypt.hash(refreshToken, 10);
await db.refreshTokens.create({ token: hashedToken });

// When validating
const isValid = await bcrypt.compare(providedToken, storedHash);
```

### 4. Implement Token Rotation

```javascript
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  
  // Verify old token
  const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  
  // Generate new tokens
  const newAccessToken = generateAccessToken(decoded.userId);
  const newRefreshToken = generateRefreshToken(decoded.userId);
  
  // Revoke old refresh token
  await db.refreshTokens.update(
    { token: hashToken(refreshToken) },
    { revoked: true }
  );
  
  // Store new refresh token
  await db.refreshTokens.create({
    userId: decoded.userId,
    token: hashToken(newRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  
  res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
});
```

### 5. Log Authentication Events

```javascript
async function logAuthEvent(userId, event, metadata = {}) {
  await db.authLogs.create({
    userId,
    event, // 'google_login', 'google_signup', 'token_refresh'
    metadata: {
      ...metadata,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      timestamp: new Date()
    }
  });
}
```

## Testing

### Unit Test Example (Jest)

```javascript
describe('POST /auth/google', () => {
  it('should authenticate user with valid Google token', async () => {
    const mockGoogleToken = 'valid-google-token';
    const mockGoogleUser = {
      sub: '12345',
      email: 'test@example.com',
      name: 'Test User'
    };

    // Mock Google API response
    nock('https://www.googleapis.com')
      .get('/oauth2/v3/userinfo')
      .reply(200, mockGoogleUser);

    const response = await request(app)
      .post('/auth/google')
      .send({ accessToken: mockGoogleToken })
      .expect(200);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  it('should return 401 for invalid Google token', async () => {
    nock('https://www.googleapis.com')
      .get('/oauth2/v3/userinfo')
      .reply(401);

    await request(app)
      .post('/auth/google')
      .send({ accessToken: 'invalid-token' })
      .expect(401);
  });
});
```

## Environment Variables Required

```env
# JWT Configuration
JWT_SECRET=your-super-secret-key-for-access-tokens
JWT_REFRESH_SECRET=your-super-secret-key-for-refresh-tokens

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/headknot

# Optional: For additional verification
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Troubleshooting

### Issue: "Invalid token" from Google

**Cause:** Token has expired or is malformed
**Solution:** Google access tokens are short-lived. Ensure frontend sends fresh token.

### Issue: Duplicate user accounts

**Cause:** Not checking for existing users by email
**Solution:** Always check by both `googleId` and `email` before creating new user.

### Issue: JWT verification fails

**Cause:** Secret mismatch or token format
**Solution:** Ensure `JWT_SECRET` is consistent and tokens are properly formatted.

## Monitoring & Analytics

Consider tracking these metrics:

```javascript
// Track OAuth usage
analytics.track('google_auth_success', {
  userId: user.id,
  isNewUser: !existingUser,
  timestamp: new Date()
});

// Track failures
analytics.track('google_auth_failure', {
  error: error.message,
  timestamp: new Date()
});
```

## Next Steps

1. Implement the `/auth/google` endpoint
2. Update your OpenAPI/Swagger documentation
3. Test with the frontend application
4. Set up monitoring and logging
5. Implement rate limiting
6. Add to your CI/CD pipeline

## Support

For questions or issues:
- Frontend documentation: `docs/GOOGLE_OAUTH_SETUP.md`
- Quick reference: `docs/OAUTH_QUICK_REFERENCE.md`
- Implementation summary: `docs/OAUTH_IMPLEMENTATION_SUMMARY.md`
