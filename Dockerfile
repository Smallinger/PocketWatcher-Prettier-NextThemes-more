# Use Node.js as base image for building Next.js
FROM node:18-alpine AS nextjs-builder

WORKDIR /app

# Copy Next.js application files
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final image
FROM alpine:latest

# Install required packages
RUN apk add --no-cache \
    nodejs \
    npm \
    unzip \
    ca-certificates \
    supervisor

# Set PocketBase version
ARG PB_VERSION=0.23.7

# Download and install PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Copy Next.js build from builder
COPY --from=nextjs-builder /app/.next /app/.next
COPY --from=nextjs-builder /app/public /app/public
COPY --from=nextjs-builder /app/package*.json /app/
COPY --from=nextjs-builder /app/node_modules /app/node_modules

# Copy supervisor configuration
COPY supervisor.conf /etc/supervisor/conf.d/supervisor.conf

EXPOSE 3000 8090

# Start supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisor.conf"]