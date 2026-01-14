# ==========================================
# Stage 1: Build (Используем Bun как ты и хотел)
# ==========================================
FROM oven/bun:1 AS builder

WORKDIR /app

# Сначала копируем только файлы зависимостей (для кэширования слоев Docker)
COPY package.json bun.lock ./

RUN bun pm cache clean

# Устанавливаем зависимости (frozen-lockfile гарантирует установку версий из bun.lock)
RUN bun install --frozen-lockfile

# Копируем исходный код
COPY . .

# Собираем проект
# Результат упадет в /app/dist/client/browser
RUN bun run build --configuration production

# ==========================================
# Stage 2: Serve (Чистый Nginx)
# ==========================================
FROM nginx:alpine

# Удаляем дефолтный конфиг Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Копируем наш конфиг
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем скомпилированную статику из Stage 1
# ВНИМАНИЕ: Проверь, что имя папки совпадает с angular.json ("outputPath")
# Судя по твоему пути проекта, имя проекта скорее всего 'tas-kan-line' (или 'client'?)
# Angular 17+ часто создает подпапку /browser.
COPY --from=builder /app/dist/client/browser /usr/share/nginx/html

# Порт, который слушает контейнер
EXPOSE 80

# Запуск Nginx
CMD ["nginx", "-g", "daemon off;"]
