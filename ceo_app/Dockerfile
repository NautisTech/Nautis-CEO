# ================================
# STAGE 1: Dependencies
# ================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# ================================
# STAGE 2: Builder
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala todas as dependências (incluindo dev)
RUN npm ci

# Copia código fonte
COPY . .

# Desabilita telemetria do Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV ESLINT_NO_DEV_ERRORS=true

# Build da aplicação
# IMPORTANTE: As variáveis NEXT_PUBLIC_* devem ser definidas no Caprover
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
COPY --from=builder --chown=nodeuser:nodejs /app/.next ./.next
COPY --from=builder --chown=nodeuser:nodejs /app/public ./public
COPY --from=builder --chown=nodeuser:nodejs /app/package*.json ./
COPY --from=builder --chown=nodeuser:nodejs /app/next.config.ts ./

# Cria diretório para cache e garante permissões
RUN mkdir -p /app/.next/cache && \
    chown -R nodeuser:nodejs /app && \
    chmod -R 755 /app/.next

# Define variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=80
ENV NEXT_TELEMETRY_DISABLED=1

# Expõe porta (Caprover usa 80 internamente)
EXPOSE 80

# Muda para user não-root
USER nodeuser

# Usa dumb-init para proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar a aplicação
CMD ["node_modules/.bin/next", "start", "-p", "80"]