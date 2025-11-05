# Headknot Web App

This is the main web application for Headknot, built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm 10.4.1 or higher

### Installation

From the root of the monorepo:

```bash
pnpm install
```

### Environment Setup

1. Copy the environment example file:
   ```bash
   cp apps/app/.env.example apps/app/.env
   ```

2. Configure your environment variables in `apps/app/.env`:
   ```env
   VITE_API_BASE=http://localhost:8080
   VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
   ```

### Google OAuth Setup

To enable Google OAuth login:

1. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized JavaScript origins: `http://localhost:5173`
   - Add authorized redirect URIs: `http://localhost:5173`
   - Copy the Client ID

2. **Add Client ID to .env**:
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```

3. **Backend Requirements**:
   Your backend must implement the `/auth/google` endpoint:
   - **Method**: POST
   - **Body**: `{ accessToken: string }`
   - **Response**: `{ accessToken: string, refreshToken: string }`

For detailed setup instructions, see [Google OAuth Setup Guide](../../docs/GOOGLE_OAUTH_SETUP.md).

### Development

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Building

Build the application for production:

```bash
pnpm build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── constants/        # Application constants
├── forms/           # Form components (Login, Signup, etc.)
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and libraries
├── pages/           # Page components (routes)
├── query/           # React Query hooks and queries
├── state/           # Global state management (Zustand)
├── validations/     # Form validation schemas (Zod)
├── App.tsx          # Main app component with routing
└── main.tsx         # Application entry point
```

## Features

- ✅ Traditional username/password authentication
- ✅ Google OAuth login/signup
- ✅ Protected routes with authentication
- ✅ Token-based authentication with automatic refresh
- ✅ Dark theme support
- ✅ Form validation with Zod
- ✅ React Query for data fetching and caching

## Authentication Flow

### Traditional Login
1. User enters username and password
2. Credentials sent to `/auth/login`
3. Backend returns access and refresh tokens
4. Tokens stored in localStorage
5. User redirected to dashboard

### Google OAuth Login
1. User clicks "Continue with Google"
2. Google OAuth popup opens
3. User authenticates and grants permissions
4. Google returns access token
5. Token sent to backend `/auth/google`
6. Backend validates token and returns app tokens
7. Tokens stored in localStorage
8. User redirected to dashboard

## API Client

The API client (`@workspace/api-client`) provides:
- Type-safe API calls using OpenAPI schema
- Automatic token injection
- Automatic token refresh on 401 errors
- Storage utilities for access/refresh tokens

## Troubleshooting

### Google OAuth not working
- Verify `VITE_GOOGLE_CLIENT_ID` is set in `.env`
- Restart dev server after changing environment variables
- Check Google Cloud Console for correct redirect URIs
- Ensure backend `/auth/google` endpoint is implemented

### Authentication errors
- Check browser localStorage for tokens
- Clear localStorage and try logging in again
- Verify backend is running on `http://localhost:8080`
- Check network tab for API request/response details

### Build errors
- Run `pnpm install` to ensure all dependencies are installed
- Clear cache: `rm -rf node_modules .turbo && pnpm install`
- Check TypeScript errors: `pnpm typecheck`

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zod Documentation](https://zod.dev/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
