# Frontend Dockerfile - Multi-stage for Next.js
FROM node:20-alpine AS builder
WORKDIR /app

# forward arguments
ENV NODE_ENV=production

# install deps
COPY package*.json jsconfig.json tsconfig.json ./
RUN npm install

# copy source and build
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia apenas arquivos necessários para produção
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
RUN npm install

EXPOSE 3001
CMD ["npm", "run", "start"]
## Removido bloco duplicado (não necessário para multi-stage build com pnpm)
