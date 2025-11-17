# Backend Dockerfile - multi-stage build
FROM node:20-alpine AS builder
WORKDIR /app

# copy package files and install dependencies (inclui dev deps para build)
COPY package*.json tsconfig.json ./
RUN npm install -g pnpm && pnpm install

# copy source and build
COPY src ./src
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# copy production deps
COPY package*.json ./
RUN npm install -g pnpm && pnpm install --prod

# copy built files
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
## Removido bloco duplicado (não necessário para multi-stage build com pnpm)
