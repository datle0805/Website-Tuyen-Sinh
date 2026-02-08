# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy source code and config
COPY . .

# Build TypeScript to JavaScript
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled files from builder
COPY --from=builder /app/dist ./dist

# Expose the backend port
EXPOSE 5000

# Set environment variables (can be overridden)
ENV PORT=5000
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
