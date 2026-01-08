Ты — Senior Angular Developer.
Твоя задача: Реализовать страницу профиля пользователя (Profile) и адаптировать слой данных под реальный ответ бэкенда (FastAPI).

КОНТЕКСТ (BACKEND RESPONSES):
1. GET /api/v1/auth/me возвращает структуру:

```json
   {
     "message": "You are authorized",
     "user_data": { "id": 1, "email": "...", "username": "...", "first_name": "...", "last_name": "..." }
   }
```
2. POST /api/v1/auth/logout удаляет куку и возвращает message.

ЗАДАЧИ:
    1. ОБНОВИТЬ src/app/core/auth/models/auth-dto.model.ts:
        - Добавь интерфейс CheckAuthResponse, который содержит message: string и user_data: User.
    2. ОБНОВИТЬ src/app/core/auth/models/user.model.ts:
        - Добавь поля avatar?: string и phone_number?: string, так как они могут приходить в user_data.
    3. ОБНОВИТЬ src/app/core/auth/services/auth.service.ts:
        - Импортируй CheckAuthResponse.
        - В методе checkAuth() измени тип ответа на Observable<User>.
        - Добавь оператор map, чтобы извлекать response.user_data и возвращать именно объект пользователя.
        - Метод logout() оставь как есть (POST запрос).
    4. РЕАЛИЗОВАТЬ src/app/features/profile/profile.ts и шаблон:
        - Дизайн: Карточка по центру экрана (аналогично Login/Signup), используя Tailwind CSS.
        - Данные: Получай пользователя через store.selectSignal(selectUser).
        - Аватар (Initials):
            - Реализуй computed сигнал, который берет первую букву first_name и last_name (например, "John Doe" -> "JD").
            - Отобрази это в кружке (rounded-full) с фоновым цветом (например, bg-cyan-100 text-cyan-700). Размер кружка: w-20 h-20 (крупный).
        - Информация: Выведи Full Name (h2, bold), Username (@username, gray), Email.
        - Действия:
            - Добавь кнопку Logout. Используй компонент appButton (severity="danger").
            - При клике диспатчи AuthActions.logout().

    5. ПРОВЕРКА STORE:
        Убедись, что Effect logout$ в auth.effects.ts после успешного выхода перенаправляет на /login. (Код менять не надо, просто учитывай это при проектировании компонента).

ТРЕБОВАНИЯ К КОДУ:
    - Используй Standalone Components.
    - Используй Signals и Computed для вычислений (инициалы).
    - Используй Lucide Angular (иконка LogOut для кнопки).
    - Дизайн должен быть аккуратным, в стиле существующего UI (dark mode friendly).
