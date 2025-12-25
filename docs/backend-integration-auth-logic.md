Ты — Senior Angular Architect и эксперт по интеграции с Python (FastAPI).
Твоя задача: Реализовать полный слой аутентификации (Authentication Layer) для проекта "TasKanLine" (система управления проектами).

КОНТЕКСТ ПРОЕКТА:
- Framework: Angular 21 (Standalone Components).
- Backend: FastAPI (использует HttpOnly Cookies для JWT).
- State Management: NgRx (Signals based where possible).
- CSS: Tailwind CSS.
- Файловая структура: Core/Features архитектура.

ВХОДНЫЕ ДАННЫЕ (BACKEND API):
1. POST /api/v1/auth/signup
   - Body: { email, username, first_name, last_name, password }
   - Success (200): Возвращает JSON с полями пользователя.
   - Error (409): Email/Username занят.
   - Error (422): Ошибка валидации (массив detail).

2. POST /api/v1/auth/login
   - Body: { email, password }
   - Success (200): Возвращает User Object (id, email, username). Устанавливает HttpOnly Cookie "access_token".
   - Error (401/404): Неверные данные / Пользователь не найден.

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:

1. STATE MANAGEMENT (NgRx):
   - Создай Feature State `auth`.
   - Actions: Login, LoginSuccess, LoginFailure, Signup, SignupSuccess, SignupFailure, Logout, CheckAuth (восстановление сессии), LoadUser.
   - Effects: Обработка API запросов, перенаправление (Router), вывод Toast уведомлений.
   - Selectors: `selectUser`, `selectIsAuthenticated`, `selectAuthError`, `selectIsLoading`.

2. SERVICES & HTTP:
   - Создай `AuthService` в `src/app/core/auth/services/`.
   - ВАЖНО: Так как бэкенд использует Cookies, все запросы HttpClient должны иметь опцию `{ withCredentials: true }`. Не пытайся читать токен из кук вручную.
   - Базовый URL: `http://localhost:8000`. Используй environment (создай файл, если нет).

3. INTERCEPTORS (Functional):
   - `AuthInterceptor`: Добавляет `withCredentials: true` ко всем запросам api автоматически.
   - `ErrorInterceptor`: Глобальная обработка ошибок.
     - Если 401 (Unauthorized) -> Action Logout (очистка стейта) -> Redirect на /login.
     - Если 500/Network Error -> Показ глобального Toast уведомления.

4. GUARDS (Functional):
   - `authGuard`: Защищает приватные роуты (например, `/home`). Если нет юзера -> Redirect на `/login`.
   - `guestGuard`: Защищает публичные роуты (`/login`, `/signup`). Если юзер уже есть -> Redirect на `/home`.

5. UI КОМПОНЕНТЫ:
   - Обнови `src/app/features/login/login.ts` и `signup.ts`.
   - Используй Reactive Forms.
   - Свяжи компоненты с NgRx Store (dispatch actions, select signals).
   - Реализуй отображение ошибок валидации (422) конкретно под полями (email, password), если сервер возвращает детали.
   - Добавь индикатор сложности пароля (Password Strength) на фронтенде.
   - Добавь кнопку "Remember me" (влияет на то, сохраняем ли мы флаг "isLoggedIn" в localStorage для восстановления сессии при перезагрузке, хотя кука живет сама по себе).

6. ФАЙЛОВАЯ СТРУКТУРА:
   Реализуй файлы в следующих путях:
   - src/app/core/auth/store/ (actions, reducers, selectors, effects)
   - src/app/core/auth/services/auth.service.ts
   - src/app/core/auth/guards/
   - src/app/core/auth/interceptors/
   - src/app/core/auth/models/ (user.model.ts, auth-dto.model.ts)
   - src/app/core/services/toast.service.ts (простая реализация на базе Tailwind или обертка над библиотекой).

ИНСТРУКЦИИ ПО ГЕНЕРАЦИИ:
1. Сначала создай модели (Models) TypeScript.
2. Затем реализуй Service и Store (NgRx).
3. Затем Interceptors и Guards.
4. В конце покажи, как обновить Login/Signup компоненты и `app.config.ts` (подключение провайдеров store, http, interceptors).
5. Используй современный синтаксис Angular (Signals, inject(), functional interceptors/guards).

Начни с создания моделей данных.
