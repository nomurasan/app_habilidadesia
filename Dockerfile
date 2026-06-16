# --- MULTI-STAGE SECURE PRODUCTION DOCKERFILE ---

# Stage 1: Build Environment
FROM node:20-alpine AS builder

WORKDIR /app

# Enable npm caching and clean installs
COPY package*.json ./
RUN npm ci

# Copy application files and compile the React and Express assets
COPY . .
RUN npm run build

# Stage 2: Minimalist Production Environment
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only compiled outputs, configurations, and dependency definitions
COPY package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies for small footprint and security
RUN npm ci --only=production

# Run with non-privileged system user for security hardening
USER node

EXPOSE 3000

ENV PORT=3000
CMD ["node", "dist/server.cjs"]
