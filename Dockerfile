# Stage 1: Build stage
FROM node:20-alpine AS builder

ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

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

# Stage 2: Production stage for App (app.headknot.com)
FROM nginx:alpine AS app-production
COPY --from=builder /app/apps/app/dist /usr/share/nginx/html
COPY nginx/app.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 3: Production stage for Website (headknot.com)
# Uncomment when apps/website exists
# FROM nginx:alpine AS website-production
# COPY --from=builder /app/apps/website/dist /usr/share/nginx/html
# COPY nginx/website.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
