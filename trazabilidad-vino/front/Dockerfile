# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS production
WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy built app from builder
COPY --from=builder /app/build ./build

# Set environment and expose port
ENV NODE_ENV=production
EXPOSE 3002

# Start the static file server
CMD ["serve", "-s", "build", "-l", "3002"]
