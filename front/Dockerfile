# syntax=docker/dockerfile:1.6

# Build the Angular Application
ARG NODE_VERSION=24.11.0-alpine
FROM node:${NODE_VERSION}

WORKDIR /app

# Copy package files for dependency installation
COPY front/package.json front/package-lock.json ./

# Install dependencies with cache mount
RUN --mount=type=cache,target=/root/.npm npm ci --legacy-peer-deps

# Copy source code
COPY front/ .

# Build Angular application
RUN npm run build

# Copy files to volume on container start
CMD ["sh", "-c", "rm -rf /output/* /output/.[!.]* 2>/dev/null || true; cp -r /app/dist/mdd-webui/browser/* /output/ && echo 'Files copied successfully' && tail -f /dev/null"] 
