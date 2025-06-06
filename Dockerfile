#docker build . -t music-bot

# Use slim image for smaller footprint
FROM node:18.14.2-slim

# Puppeteer & Chrome dependencies
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

# Set working directory (make sure it's an absolute path)
WORKDIR /usr/src/app

# Only copy production package files
COPY package*.json ./
RUN npm ci --only=production

# Only copy built code, not the whole source
COPY dist ./dist

CMD ["node", "dist/index.js"]
