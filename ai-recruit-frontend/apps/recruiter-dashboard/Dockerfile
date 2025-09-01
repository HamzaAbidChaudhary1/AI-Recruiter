# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy workspace files
COPY pnpm-workspace.yaml .
COPY turbo.json .
COPY package.json .
COPY pnpm-lock.yaml .

# Copy packages
COPY packages ./packages

# Copy specific app
ARG APP_NAME=recruiter-dashboard
COPY apps/${APP_NAME} ./apps/${APP_NAME}

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm turbo build --filter=@ai-recruit/${APP_NAME}

# Production stage
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Set working directory
WORKDIR /app

# Copy built application
ARG APP_NAME=recruiter-dashboard
COPY --from=builder --chown=nodejs:nodejs /app/apps/${APP_NAME}/.output ./

# Set environment variables
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    NITRO_PORT=3000

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.mjs"]
