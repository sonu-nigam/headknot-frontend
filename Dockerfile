# syntax=docker/dockerfile:1
#
# Multi-stage build for the headknot monorepo.
#
#   builder           -> installs deps + builds both apps with turbo
#   app-production     -> nginx serving apps/app    (app.headknot.com)
#   website-production -> nginx serving apps/website (headknot.com)
#
# Local / Compose usage (these support --target):
#   docker build --target app-production     -t headknot-app .
#   docker build --target website-production -t headknot-website .
#
# Railway does NOT support selecting a stage with --target, so each service
# there uses its own self-contained file: Dockerfile.app / Dockerfile.website.

# ---------------------------------------------------------------------------
# Stage 1: Build both apps (shared)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS builder

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

# Copy manifests first so dependency install is cached independently of source
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build every app in the workspace
RUN pnpm build

# ---------------------------------------------------------------------------
# Stage 2: Production stage for App (app.headknot.com)
# ---------------------------------------------------------------------------
FROM nginx:alpine AS app-production

# nginx renders /etc/nginx/templates/*.template through envsubst at startup,
# substituting only env vars that are actually set (PORT, API_BACKEND_URL).
ENV PORT=8080
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html
COPY nginx/app.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# ---------------------------------------------------------------------------
# Stage 3: Production stage for Website (headknot.com)
# ---------------------------------------------------------------------------
FROM nginx:alpine AS website-production

ENV PORT=8080
COPY --from=builder /app/apps/website/dist /usr/share/nginx/html
COPY nginx/website.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
