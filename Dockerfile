# Stage 1: Build stage
FROM node:20-alpine AS builder

# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps ./apps

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm build
# Stage 2: Production stage for App
FROM nginx:alpine AS app-production

COPY --from=builder /app/apps/app/dist /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    # API Proxy \
    location /api/ { \
        set $backend "https://api.headknot.app"; \
        proxy_pass $backend/; \
        proxy_http_version 1.1; \
        proxy_ssl_server_name on; \
        proxy_set_header Host api.headknot.app; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Production stage for "Website"
FROM nginx:alpine AS website-production
# Point this to wherever your website build output lives
COPY --from=builder /app/apps/website/dist /usr/share/nginx/html
RUN echo 'server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { try_files $uri $uri/ /index.html; } \
}' > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
