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

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install only production dependencies
RUN npm ci

# Define environment variables (use defaults only if needed)
#ENV clientId=977523393060560967
#ENV guildId=882155251313037332
#ENV NODE_ENV=production
#ENV uri=mongodb://host.docker.internal:27017/discord-music-app

# Copy the rest of the code
COPY . .

# Optional: Expose the app port if you're using Express
# EXPOSE 3000

RUN npm run build

# Run the app
CMD ["node", "dist/index.js"]
