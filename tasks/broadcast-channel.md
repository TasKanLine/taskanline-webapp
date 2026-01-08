Ты — Senior Angular Architect.
Твоя задача: Реализовать синхронизацию выхода из системы (Logout) между вкладками браузера, используя `BroadcastChannel`.

КОНТЕКСТ:
У нас уже реализована NgRx аутентификация.
Сейчас, если пользователь выходит в одной вкладке, другие вкладки остаются "визуально" авторизованными до перезагрузки страницы.

ЗАДАЧИ:

1. ОБНОВИТЬ `src/app/core/auth/services/auth.service.ts`:
   - Объяви `private logoutChannel = new BroadcastChannel('auth_logout_channel');`
   - Реализуй метод `broadcastLogout()`, который отправляет сообщение (например, `this.logoutChannel.postMessage('logout')`).
   - Реализуй геттер или поле `logoutSignal$`, которое возвращает Observable, слушающий сообщения из канала (`fromEvent` или ручная подписка).
   - Не забудь закрывать канал в `ngOnDestroy` (хотя сервис `providedIn: root`, но для чистоты кода полезно знать).

2. ОБНОВИТЬ `src/app/core/auth/store/auth.effects.ts`:
   - **Измени `logout$`**: В цепочке pipe, после успешного выполнения API запроса (`this.authService.logout()`), вызови `this.authService.broadcastLogout()`. Используй оператор `tap`.
   - **Добавь `syncLogout$`**: Создай новый эффект, который слушает `this.authService.logoutSignal$`.
     - При получении сигнала он должен возвращать экшен `AuthActions.logoutSuccess()`.
     - Это позволит очистить стейт и сделать редирект в других вкладках без повторного вызова API.

ЛОГИКА РАБОТЫ:
1. Вкладка А: Пользователь жмет Logout -> API Call -> Success -> Broadcast Message -> Redirect to Login.
2. Вкладка Б: Получает Message -> Dispatch LogoutSuccess -> Clear State -> Redirect to Login.

ТРЕБОВАНИЯ:
- Используй RxJS операторы (`tap`, `map`, `filter`).
- Убедись, что нет бесконечных циклов (BroadcastChannel по умолчанию не отправляет сообщение вкладке-отправителю, так что это безопасно, но будь внимателен).
