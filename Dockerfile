FROM node:20-alpine AS base

# Install pnpm globally
RUN npm i -g pnpm

# Set working directory
WORKDIR /app

#Copy package.json and pnpm-lock.yaml to install dependencies first
COPY package.json pnpm-lock.yaml ./

#Install dependencies
RUN pnpm install

FROM base AS builder

# Pass the Pusher key from build-time arguments to environment variables 
# so it is accessible to Next.js during the client-side build process.
ARG NEXT_PUBLIC_PUSHER_KEY
ENV NEXT_PUBLIC_PUSHER_KEY=$NEXT_PUBLIC_PUSHER_KEY

# Copy the rest of the application files
COPY . .

# Generate Prisma client with Alpine-compatible binary
RUN pnpm prisma generate

# Build the application
RUN pnpm run build

FROM node:20-alpine AS runner

# Install pnpm in the runner stage
RUN npm i -g pnpm

# Set the working directory
WORKDIR /app

# Copy the necessary files from the builder stage for the standalone build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static .next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Change ownership of the files to the node user
RUN chown -R node:node /app

# Switch to the non-root user
USER node

# Add healthcheck for container monitoring
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD [ "node", "server.js" ]