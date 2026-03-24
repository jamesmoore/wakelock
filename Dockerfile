FROM node:lts-alpine AS builder

WORKDIR /build

COPY package*.json ./
RUN npm ci

COPY tailwind.config.js ./
COPY src/ ./src/
RUN npm run build

FROM busybox:latest

# Create a non-root user to own the files and run our server
RUN adduser -D static
USER static
WORKDIR /home/static

# Copy the static website
# Use the .dockerignore file to control what ends up inside the image!
COPY --from=builder /build/src/ .

# Run BusyBox httpd
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD wget --spider -q http://localhost:80/ || exit 1

CMD ["busybox", "httpd", "-f", "-v", "-p", "80"]
