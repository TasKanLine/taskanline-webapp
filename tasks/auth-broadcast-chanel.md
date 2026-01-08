Ты — Senior Angular Developer.
Твоя задача: Реализовать синхронизацию ВХОДА (Login) между вкладками, расширив существующий механизм BroadcastChannel.

КОНТЕКСТ:
Ранее мы реализовали синхронизацию Logout через `BroadcastChannel`.
Теперь нужно сделать то же самое для Login. Если пользователь входит в одной вкладке, другие открытые вкладки (находящиеся на /login или /signup) должны автоматически авторизоваться и перенаправить пользователя в профиль.

ЗАДАЧИ:

1. РЕФАКТОРИНГ `src/app/core/auth/services/auth.service.ts`:
   - Переименуй поле `logoutChannel` в `authChannel` (так как теперь оно общего назначения).
   - Создай интерфейс для сообщений канала:
     ```typescript
     interface AuthMessage {
       type: 'login' | 'logout';
       payload?: User;
     }
     ```
   - Обнови метод `broadcastLogout()`: отправляет `{ type: 'logout' }`.
   - Добавь метод `broadcastLogin(user: User)`: отправляет `{ type: 'login', payload: user }`.
   - Обнови `messageSignal$` (или то, что слушает канал): теперь он должен возвращать `Observable<AuthMessage>`.

2. ОБНОВИТЬ `src/app/core/auth/store/auth.effects.ts`:
   - **Обнови `loginSuccess$`**: После успешного логина (и сохранения токена/куки) вызови `this.authService.broadcastLogin(user)`.
   - **Обнови `syncLogout$` (или переименуй в `syncAuth$`)**:
     - Теперь эффект должен слушать поток сообщений из сервиса.
     - Если `type === 'logout'` -> вернуть `AuthActions.logoutSuccess()`.
     - Если `type === 'login'` -> вернуть `AuthActions.loginSuccess({ user: message.payload })`.

ЛОГИКА РАБОТЫ:
1. Вкладка А: Ввод пароля -> API Login -> Success -> Broadcast 'login' -> Redirect to /profile.
2. Вкладка Б (открыта на /login): Получает сообщение 'login' -> Диспатчит LoginSuccess -> Store обновляется -> Redirect to /profile автоматически.

ТРЕБОВАНИЯ:
- Убедись, что при получении сообщения 'login' во второй вкладке мы используем пользователя из payload, чтобы не делать лишний API запрос, так как данные у нас уже есть.
