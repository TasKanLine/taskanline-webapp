# 🚀 Установка TasKanLine Client

Подробное руководство по установке и настройке проекта TasKanLine Client для разработки и развертывания.

## 📋 Предварительные требования

### Системные требования

- **Операционная система**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: Минимум 4GB (рекомендуется 8GB+)
- **Свободное место**: Минимум 2GB на диске

### Необходимое ПО

#### Node.js

- **Версия**: 22.20.0 или выше
- **Проверка установки**:
  ```bash
  node --version  # должно показать v22.20.0 или выше
  ```
- **Установка**:
  - [Официальный сайт Node.js](https://nodejs.org/)
  - Использовать [nvm](https://github.com/nvm-sh/nvm) для управления версиями:
    ```bash
    nvm install 22
    nvm use 22
    ```

#### Package Manager

Выберите один из следующих вариантов:

**npm (рекомендуется для совместимости)**:

```bash
npm --version  # должно показать 11.6.2 или выше
```

**Bun (для лучшей производительности)**:

```bash
# Установка Bun
curl -fsSL https://bun.sh/install | bash

# Проверка установки
bun --version
```

> 💡 **Совет**: Bun значительно быстрее установки зависимостей и сборки, но npm более универсален.

#### Git

- **Версия**: 2.20.0+
- **Проверка**:
  ```bash
  git --version
  ```

### Docker (опционально, для production развертывания)

- **Docker Desktop**: [Официальный сайт](https://www.docker.com/products/docker-desktop/)
- **Docker Engine** (Linux):
  ```bash
  docker --version
  docker-compose --version
  ```

## 🔧 Шаги установки

### 1. Клонирование репозитория

```bash
# HTTPS (если у вас есть доступ)
git clone https://github.com/your-org/TasKanLine.git

# SSH (для contributors)
git clone git@github.com:your-org/TasKanLine.git

# Переход в директорию проекта
cd TasKanLine/client
```

### 2. Проверка структуры проекта

Убедитесь, что вы в правильной директории:

```bash
ls -la
# Должны видеть файлы: package.json, angular.json, src/ и т.д.
```

### 3. Установка зависимостей

#### Вариант A: Используя npm (стандартный)

```bash
npm install
```

**Ожидаемый вывод** (сокращенно):

```
added 1542 packages, and audited 1543 packages in 2m

1543 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

#### Вариант B: Используя Bun (рекомендованный)

```bash
bun install
```

**Ожидаемый вывод**:

```
+ @angular/animations@21.1.0
+ @angular/common@21.1.0
+ @angular/compiler@21.1.0
...
Installed 1542 dependencies in 12s
```

> ⚠️ **Важно**: Если возникли ошибки при установке, попробуйте:
>
> ```bash
> # Очистка кэша и переустановка
> npm cache clean --force
> rm -rf node_modules package-lock.json
> npm install
> ```

### 4. Настройка окружения

#### Создание файла окружения

```bash
# Если есть шаблон
cp .env.example .env

# Если нет шаблона - создайте пустой файл
touch .env
```

#### Редактирование .env файла

```bash
nano .env  # или используйте ваш любимый редактор
```

**Пример содержимого .env**:

```env
# API Configuration
API_BASE_URL=http://localhost:8000/api
API_VERSION=v1

# App Configuration
APP_NAME=TasKanLine
APP_VERSION=1.0.0

# Feature Flags
ENABLE_DEBUG=true
ENABLE_ANALYTICS=false

# Authentication
TOKEN_STORAGE=sessionStorage  # или localStorage
REFRESH_TOKEN_ENABLED=true
```

### 5. Проверка установки

#### Проверка зависимостей

```bash
# Проверка версий ключевых пакетов
npm list @angular/core @ngrx/store tailwindcss

# Или через Bun
bun pm ls
```

#### Проверка TypeScript конфигурации

```bash
npx tsc --noEmit
```

**Ожидаемый результат**: никаких ошибок компиляции

#### Проверка ESLint конфигурации

```bash
npm run lint
```

## 🎯 Запуск приложения

### Development сервер

#### Запуск с npm

```bash
npm run s
```

#### Запуск с Bun

```bash
bun run s
```

**Ожидаемый вывод**:

```
Initial Chunk Files | Names         |  Raw Size
main.js             | main          | 150.45 kB
polyfills.js        | polyfills     |  85.12 kB
styles.css          | styles        |  42.18 kB

Application bundle generation complete. Initial Chunk Files | Names         |  Raw Size
main.js             | main          | 150.45 kB
polyfills.js        | polyfills     |  85.12 kB
styles.css          | styles        |  42.18 kB

Local:   http://localhost:4200/
```

### Доступ к приложению

Откройте браузер и перейдите на `http://localhost:4200`

**Проверка функциональности**:

- ✅ Главная страница загружается
- ✅ Форма входа доступна по `/login`
- ✅ Форма регистрации доступна по `/signup`
- ✅ Переключатель темы работает
- ✅ Нет ошибок в консоли браузера

## 🔧 Конфигурация IDE

### VS Code (рекомендуется)

#### Установка расширений

```bash
# Установите эти расширения через VS Code Marketplace:
- Angular Language Service
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer
- GitLens
```

#### Настройка workspace

Создайте `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "angular.enable-strict-mode-prompt": false,
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### WebStorm

#### Настройка

1. `File → Settings → Languages & Frameworks → TypeScript`
2. Включить `Angular` plugin
3. Настроить `ESLint` и `Prettier`
4. Включить `Tailwind CSS` plugin

## 🧪 Тестирование установки

### Запуск unit тестов

```bash
npm test
```

**Ожидаемый результат**:

```
✔ Src/app/app.component.ts
✔ Src/app/shared/ui/button/button.component.ts
...
Test Suites: 12 passed, 12 total
Tests:       24 passed, 24 total
Time:        3.456 s
```

### Production сборка

```bash
npm run build
```

**Проверка результатов**:

```bash
ls -la dist/client/
# Должны видеть скомпилированные файлы
```

## 🚨 Troubleshooting

### Частые проблемы и решения

#### 1. Ошибки при установке зависимостей

**Проблема**: `npm ERR! code ERESOLVE`

```bash
# Решение: Использовать --legacy-peer-deps
npm install --legacy-peer-deps

# Или обновить npm до последней версии
npm install -g npm@latest
```

#### 2. TypeScript ошибки

**Проблема**: `error TS2307: Cannot find module`

```bash
# Решение: Переустановить node_modules
rm -rf node_modules package-lock.json
npm install
```

#### 3. ESLint ошибки

**Проблема**: Линтинг не проходит

```bash
# Проверить правила
npm run lint -- --no-fix

# Автоисправление
npm run lint:fix
```

#### 4. TailwindCSS не работает

**Проблема**: Стили не применяются

```bash
# Проверить конфигурацию
cat tailwind.config.js

# Пересобрать проект
npm run build
```

#### 5. Порт уже занят

**Проблема**: `Port 4200 is already in use`

```bash
# Найти процесс
lsof -ti:4200

# Убить процесс
kill -9 $(lsof -ti:4200)

# Или использовать другой порт
ng serve --port 4300
```

### Проверка системы

#### Полный health-check скрипт

```bash
#!/bin/bash
echo "🔍 Проверка системы..."

# Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js не установлен"
fi

# npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm не установлен"
fi

# Git
if command -v git &> /dev/null; then
    echo "✅ Git: $(git --version)"
else
    echo "❌ Git не установлен"
fi

# Проверка проекта
if [ -f "package.json" ]; then
    echo "✅ package.json найден"
else
    echo "❌ package.json не найден"
fi

if [ -d "node_modules" ]; then
    echo "✅ node_modules существует"
else
    echo "❌ node_modules не найден"
fi

echo "🏁 Проверка завершена"
```

## 🎯 Следующие шаги

После успешной установки:

1. **Изучите архитектуру**: [Architecture Rules](./architecture/arch-rules.md)
2. **Посмотрите примеры использования**: [Usage Guide](./usage.md)
3. **Начните разработку**: [Contributing Guide](./contributing.md)

## 📞 Помощь

Если у вас возникли проблемы:

1. **Проверьте GitHub Issues** - возможно, проблема уже решена
2. **Создайте новый Issue** с подробным описанием проблемы
3. **Обратитесь к команде** в Slack/Discord

---

**Happy Coding!** 🎉

Теперь вы готовы к разработке TasKanLine Client!
