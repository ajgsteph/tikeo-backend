# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 2: Development
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3000
CMD ["npx", "nodemon", "src/index.ts"]

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma
COPY entrypoint.sh ./entrypoint.sh

RUN chmod +x entrypoint.sh
EXPOSE 3000

# Run migrations then start the server
CMD ["./entrypoint.sh"]