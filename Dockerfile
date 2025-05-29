#docker build . -t music-bot

# Use slim image for smaller footprint
FROM node:18.14.2-slim

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

# Run the app
CMD ["npm", "run", "build"]
CMD ["node", "dist/index.js"]
