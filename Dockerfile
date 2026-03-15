# Stage 1: Build
FROM node:20 AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# to remove in the real production
ENV DATABASE_URL="postgresql://imdad:4tkVVqnd6zMboHariTLWtKMJwOwj06rL@dpg-d28p386uk2gs73fka4rg-a.frankfurt-postgres.render.com/tikeodb"

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate
# to remove in the real production
RUN npx prisma migrate deploy


# Copy source code and build it
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Optional: copy Prisma files if your app uses migrations/seeding
COPY prisma ./prisma

CMD ["node", "dist/index.js"]
