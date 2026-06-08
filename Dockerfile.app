# syntax=docker/dockerfile:1
#
# Railway service: APP  (app.headknot.com)
#
# Railway cannot target a stage inside a shared Dockerfile, so this file is
# self-contained: it builds the app and serves it as the final stage.
# Point the service at this file with the RAILWAY_DOCKERFILE_PATH variable:
#
#   RAILWAY_DOCKERFILE_PATH=Dockerfile.app

# ----- Build -----
FROM node:20-alpine AS builder

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile
RUN pnpm build:app

# ----- Serve -----
FROM nginx:alpine AS production

# Railway injects PORT at runtime; nginx renders the template through envsubst.
ENV PORT=8080
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html
COPY nginx/app.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
