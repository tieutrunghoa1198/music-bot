# Stage 1: Build (with full dev dependencies, all source files)
FROM node:18.14.2-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# minify built js
RUN npx terser dist/*.js --compress --mangle --output dist/ --keep-fnames

# Stage 2: Minimal runtime image
FROM node:18.14.2-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production   # only install production deps

# Only copy built code from builder
COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
