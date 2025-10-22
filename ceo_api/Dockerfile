# ================================
# STAGE 1: Dependencies
# ================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências de produção
RUN npm ci && \
    npm cache clean --force

# ================================
# STAGE 2: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
ENV NODE_ENV=development
COPY package*.json ./

# Instala todas as dependências (incluindo dev)
RUN npm ci

# Copia código fonte
COPY . .

ENV ESLINT_NO_DEV_ERRORS=true
ENV API_URL=https://api-larevangelico.gestao.avfeirense.pt/api
ENV CORS_ORIGINS=http://72.60.187.213:3051,http://72.60.187.213:3052,https://admin-larevangelico.gestao.avfeirense.pt,http://admin-larevangelico.gestao.avfeirense.pt

# Build da aplicação
RUN npm run build

# ================================
# STAGE 3: Runner (Produção)
# ================================
FROM node:20-alpine AS runner

WORKDIR /app

# Instala dumb-init para proper signal handling
RUN apk add --no-cache dumb-init

# Cria user não-root
RUN addgroup -S nodejs && adduser -S nodeuser -G nodejs

# Copia dependências de produção do stage deps
COPY --from=deps --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copia artefactos de produção do builder
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./

# Cria diretório uploads e garante permissões
RUN mkdir -p /app/uploads && \
    chown -R nodeuser:nodejs /app && \
    chmod -R 755 /app/uploads

# Define variáveis de ambiente
ENV PORT=80

# Expõe porta (Caprover usa 80 internamente)
EXPOSE 80

# Muda para user não-root
USER nodeuser

# Usa dumb-init para proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]