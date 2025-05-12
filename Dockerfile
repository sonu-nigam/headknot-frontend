# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source code
COPY . .

# Build the app
RUN npm run build

# Production image, copy all the files and run next
FROM node:18-alpine AS runner
WORKDIR /app

# Copy node_modules from the base stage
COPY --from=base /app/node_modules ./node_modules

# Copy .next directory from the base stage
COPY --from=base /app/.next ./.next

# Copy public directory from the base stage
COPY --from=base /app/public ./public

COPY --from=base /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Define the command to start the app
CMD ["npm", "start"]
