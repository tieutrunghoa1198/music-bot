# =============== Stage 0: Test (fails fast if tests fail) ===============
FROM node:18.14.2-slim AS test
WORKDIR /app

# toolchain for node-gyp / opus (no browsers here)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 pkg-config libopus-dev ffmpeg \
 && rm -rf /var/lib/apt/lists/*

# install deps (cache on package-lock)
COPY package*.json ./
RUN npm ci

# copy source & run tests
COPY . .
RUN npm test


# ================== Stage 1: Build (your original) ======================
FROM node:18.14.2-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Optional: minify js files
RUN find dist -name "*.js" -exec npx terser --compress --mangle -o {} -- {} \;


# ============== Stage 2: Runtime image (your original) ==================
FROM node:18.14.2-slim

# Puppeteer/Chrome runtime deps only
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

ENV LOG_PATH=/var/log/music-bot/app.log
ENV LOG_DIR=/var/log/music-bot

RUN mkdir -p ${LOG_DIR}

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

RUN chown -R node:node ${LOG_DIR}

USER node

CMD ["node", "dist/index.js"]
