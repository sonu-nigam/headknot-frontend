# Docker Setup Guide

This guide explains how to build and run the Headknot Web application using Docker.

## Prerequisites

- Docker installed on your system ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose (included with Docker Desktop)

## Quick Start

### Building the Image

Build the Docker image for production:

```bash
docker build -t headknot-web .
```

### Running the Container

Run the container using Docker:

```bash
docker run -p 3000:80 headknot-web
```

The application will be available at `http://localhost:3000`

## Using Docker Compose

### Production Mode

Build and run the production container:

```bash
docker-compose up --build
```

Run in detached mode (background):

```bash
docker-compose up -d
```

Stop the container:

```bash
docker-compose down
```

### Development Mode

Run the development server with hot reload:

```bash
docker-compose --profile dev up app-dev
```

This will:

- Mount your local code into the container
- Install dependencies automatically
- Start the Vite dev server with hot reload
- Make the app available at `http://localhost:5173`

## Configuration

### Environment Variables

You can pass environment variables to the container:

```bash
docker run -p 3000:80 \
  -e VITE_API_URL=https://api.example.com \
  headknot-web
```

Or using docker-compose, add them to the `environment` section in `docker-compose.yml`:

```yaml
environment:
    - VITE_API_URL=https://api.example.com
    - VITE_GOOGLE_CLIENT_ID=your-client-id
```

### Custom nginx Configuration

If you need custom nginx settings, create an `nginx.conf` file and uncomment the line in the Dockerfile:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://your-api-backend:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Connecting to Backend API

The default nginx configuration includes a proxy for `/api` requests pointing to `http://localhost:8080`.

To connect to a different backend:

1. Update the proxy_pass in the Dockerfile's nginx config
2. Or create a custom `nginx.conf` file
3. If your backend is running on the host machine, use `host.docker.internal`:

```nginx
location /api {
    proxy_pass http://host.docker.internal:8080;
}
```

## Multi-stage Build

The Dockerfile uses a multi-stage build:

1. **Builder stage**: Uses Node.js 20 Alpine to install dependencies and build the app
2. **Production stage**: Uses nginx Alpine to serve the static files

This results in a small, efficient production image (~50MB vs ~1GB).

## Troubleshooting

### Build fails with dependency errors

Clear Docker cache and rebuild:

```bash
docker build --no-cache -t headknot-web .
```

### Port already in use

Change the host port mapping:

```bash
docker run -p 8080:80 headknot-web
```

Or update the port in `docker-compose.yml`:

```yaml
ports:
    - '8080:80'
```

### Viewing logs

Docker:

```bash
docker logs <container-id>
```

Docker Compose:

```bash
docker-compose logs -f
```

### Accessing the container

```bash
docker exec -it <container-id> sh
```

Or with Docker Compose:

```bash
docker-compose exec app sh
```

## Advanced Usage

### Building for different environments

```bash
# Build with build arguments
docker build \
  --build-arg NODE_ENV=production \
  -t headknot-web:latest .
```

### Tagging and pushing to registry

```bash
# Tag the image
docker tag headknot-web:latest your-registry.com/headknot-web:v1.0.0

# Push to registry
docker push your-registry.com/headknot-web:v1.0.0
```

### Health checks

Add a health check to your docker-compose.yml:

```yaml
services:
    app:
        healthcheck:
            test:
                [
                    'CMD',
                    'wget',
                    '--quiet',
                    '--tries=1',
                    '--spider',
                    'http://localhost:80',
                ]
            interval: 30s
            timeout: 10s
            retries: 3
            start_period: 40s
```

## Best Practices

1. **Use specific tags**: Instead of `latest`, use version tags for production
2. **Environment variables**: Never hardcode secrets in the Dockerfile
3. **Volume mounts**: Use volumes for persistent data
4. **Resource limits**: Set memory and CPU limits in production
5. **Security**: Run containers as non-root user when possible

## Production Deployment

For production deployments, consider:

- Using orchestration platforms (Kubernetes, ECS, etc.)
- Implementing proper logging and monitoring
- Setting up health checks and auto-restart policies
- Using secrets management systems
- Implementing SSL/TLS termination
- Setting up proper resource limits

Example resource limits in docker-compose:

```yaml
services:
    app:
        deploy:
            resources:
                limits:
                    cpus: '0.5'
                    memory: 512M
                reservations:
                    cpus: '0.25'
                    memory: 256M
```
