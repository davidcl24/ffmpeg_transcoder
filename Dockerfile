# ============================
# 1) BUILD
# ============================
FROM node:22.17.0-alpine AS build

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluye TypeScript)
RUN npm install

# Copiar todo el proyecto
COPY . .

# Compilar TypeScript -> JavaScript
RUN npm run build


# ============================
# 2) RUNTIME
# ============================
FROM node:22.17.0-alpine AS runtime

WORKDIR /app

# Instalar FFmpeg 
RUN apk update && apk add --no-cache ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copiar solo dependencias necesarias
COPY package*.json ./
RUN npm install --production

# Copiar el build final
COPY --from=build /app/dist ./dist

# Variables por defecto de Redis (puedes redefinirlas en Docker Compose)
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379

# Ejecutar el worker
CMD ["node", "dist/index.js"]
