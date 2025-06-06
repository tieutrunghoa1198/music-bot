# Stage 1: Build (dev dependencies, no Chrome deps needed)
FROM node:18.14.2-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Optional: minify built JS if you want
RUN find dist -name "*.js" -exec npx terser --compress --mangle -o {} -- {} \;

# Stage 2: Runtime image (with Puppeteer & Chrome deps)
FROM node:18.14.2-slim

# Install only Puppeteer/Chrome dependencies for runtime
RUN apt update && apt install -y \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libgbm1 \
  libgtk-3-0 \
  libxshmfence1 \
  libglib2.0-0 \
  wget \
  --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
