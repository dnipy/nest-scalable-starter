# -------------------------
# Stage 1: Build
# -------------------------

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Prisma generate needs a valid DATABASE_URL,
# but does not connect to the database.
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate Prisma Client before TypeScript compilation.
# The generated client is intentionally not committed to source.
RUN npx prisma generate

# Compile NestJS
RUN npm run build

# Nest/TypeScript does not automatically copy Prisma's
# generated native runtime files into dist.
# Copy the generated Prisma client into the compiled output.
RUN cp -r \
    /app/src/shared/infrastructure/database/prisma/client \
    /app/dist/src/shared/infrastructure/database/prisma/


# -------------------------
# Stage 2: Runner
# -------------------------

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force

# Application build + generated Prisma Client
COPY --from=builder /app/dist ./dist

# Prisma schema/migrations
COPY --from=builder /app/prisma ./prisma

# Run as non-root user
RUN addgroup -S nodejs \
    && adduser -S nestjs -G nodejs \
    && chown -R nestjs:nodejs /app

USER nestjs

# Default command is API (overridden in docker-compose)
CMD ["node", "dist/src/apps/api/main.js"]


# -------------------------
# Labels
# -------------------------

LABEL maintainer="Daniel Rahmani"
LABEL org.opencontainers.image.title="Nestapp Starter"
LABEL org.opencontainers.image.description="AI workflow showcase"