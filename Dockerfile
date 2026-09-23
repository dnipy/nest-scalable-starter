# -------------------------
# Stage 1: Build
# -------------------------
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

RUN npx prisma generate

RUN npm run build


# -------------------------
# Stage 2: Runner
# -------------------------
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev  \
 && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
# COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN addgroup -S nodejs \
 && adduser -S nestjs -G nodejs

RUN chown -R nestjs:nodejs /app

USER nestjs

# Default command is API (overridden in docker-compose)
CMD ["node", "dist/src/apps/api/main.js"]


# Labels
LABEL maintainer="Daniel Rahmani"
LABEL org.opencontainers.image.title="Nestapp Starter"
LABEL org.opencontainers.image.description="AI workflow showcase"