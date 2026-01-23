# 🧩 Компоненты TasKanLine Client

Подробный справочник всех компонентов, сервисов и утилит TasKanLine Client. Предназначен для разработчиков, которым нужно быстро понять назначение и использование каждого элемента системы.

---

## 📋 Оглавление

- [Core Services](#-core-services) - Глобальные сервисы приложения
- [Feature Components](#-feature-components) - Компоненты бизнес-фич
- [Shared UI Components](#-shared-ui-components) - Переиспользуемые UI компоненты
- [Guards & Interceptors](#-guards--interceptors) - Защита маршрутов и HTTP обработка
- [NgRx Store](#ngrx-store) - State management компоненты

---

## 🏛️ Core Services

### 🎨 ThemeService

**Путь:** `src/app/core/services/theme-service.ts`
**Тип:** Global Service
**Назначение:** Управление темами оформления (light/dark)

#### Ответственность

- Управление текущей темой приложения
- Автоматическое определение системных предпочтений
- Сохранение выбора темы в localStorage
- Применение CSS классов к document.documentElement

#### API

```typescript
export class ThemeService {
  currentTheme = signal<Theme>('light');

  toggleTheme(): void; // Переключение темы
  private initTheme(): void; // Инициализация темы
  private applyTheme(theme: Theme): void; // Применение темы
}
```

#### Использование

```typescript
// В компоненте
export class MyComponent {
  themeService = inject(ThemeService);

  currentTheme = this.themeService.currentTheme;

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}

// В шаблоне
<app-theme-switcher></app-theme-switcher>
```

#### Связанные компоненты

- `ThemeSwitcherComponent` - UI для переключения темы
- Любые компоненты, использующие темные классы

---

### 📢 ToastService

**Путь:** `src/app/core/services/toast.service.ts`
**Тип:** Global Service
**Назначение:** Управление временными уведомлениями

#### Ответственность

- Создание toast уведомлений
- Автоматическое удаление уведомлений
- Управление очередью уведомлений
- Поддержка различных типов (success, error, info, warning)

#### API

```typescript
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType, duration?: number): void;
  remove(id: string): void;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
```

#### Использование

```typescript
export class MyComponent {
  private toast = inject(ToastService);

  handleSuccess() {
    this.toast.success('Операция выполнена успешно!');
  }

  handleError(error: string) {
    this.toast.error(error, 5000); // 5 секунд
  }
}
```

#### Связанные компоненты

- `ToastComponent` - Отображение уведомлений
- Все feature компоненты для показа результатов операций

---

### 🔐 AuthService

**Путь:** `src/app/core/auth/services/auth.service.ts`
**Тип:** Core Auth Service
**Назначение:** Аутентификация и авторизация пользователей

#### Ответственность

- Выполнение HTTP запросов для аутентификации
- Управление сессиями пользователей
- Cross-tab коммуникация через BroadcastChannel
- Проверка текущего статуса аутентификации

#### API

```typescript
export class AuthService {
  // HTTP методы
  signup(data: SignupRequest): Observable<SignupResponse>;
  login(data: LoginRequest): Observable<User>;
  logout(): Observable<void>;
  checkAuth(): Observable<User>;

  // Cross-tab коммуникация
  broadcastLogin(user: User): void;
  broadcastLogout(): void;
  authMessage$: Observable<AuthMessage>;
}
```

#### Использование

```typescript
// Direct usage (обычно через NgRx Effects)
export class MyService {
  private auth = inject(AuthService);

  login(credentials: LoginRequest) {
    return this.auth.login(credentials);
  }
}
```

#### Связанные компоненты

- `AuthEffects` - NgRx effects для auth actions
- `AuthGuard` - Защита маршрутов
- `AuthInterceptor` - HTTP interceptor

---

## 🎯 Feature Components

### 🏠 Home Component

**Путь:** `src/app/features/home/home.ts`
**Тип:** Smart Component
**Назначение:** Главная страница приложения

#### Ответственность

- Приветствие пользователя
- Навигация по основным разделам
- Отображение основной информации о приложении
- Перенаправление аутентифицированных пользователей

#### Inputs/Outputs

Нет внешних inputs/outputs

#### Зависимости

- `Router` - для навигации
- `Store` - для проверки аутентификации

#### Пример использования

```typescript
// Автоматически используется в роутинге
{ path: '', component: Home }
```

#### Связанные компоненты

- `ThemeSwitcherComponent` - в header
- Auth Guards - для перенаправления

---

### 🔑 Login Component

**Путь:** `src/app/features/login/login.ts`
**Тип:** Smart Component
**Назначение:** Форма входа в систему

#### Ответственность

- Управление формой входа
- Валидация полей email/password
- Обработка ошибок валидации
- Интеграция с NgRx Store для аутентификации

#### Inputs/Outputs

Нет внешних inputs/outputs

#### Signals

```typescript
showPassword = signal<boolean>(false);
isLoading = this.store.selectSignal(selectIsLoading);
error = this.store.selectSignal(selectError);
```

#### Зависимости

- `FormBuilder` - для reactive form
- `Store` - для dispatch auth actions
- `Router` - для навигации после успешного входа

#### Пример использования

```html
<app-login></app-login>
```

#### Связанные компоненты

- `ButtonComponent` - для submit кнопки
- `ThemeSwitcherComponent` - в header
- `AuthGuard` - redirect logic

---

### 📝 Signup Component

**Путь:** `src/app/features/signup/signup.ts`
**Тип:** Smart Component
**Назначение:** Форма регистрации новых пользователей

#### Ответственность

- Управление формой регистрации
- Валидация всех полей включая password confirmation
- Отображение ошибок серверной валидации
- Редирект на login после успешной регистрации

#### Inputs/Outputs

Нет внешних inputs/outputs

#### Signals

```typescript
isLoading = this.store.selectSignal(selectIsLoading);
error = this.store.selectSignal(selectError);
```

#### Зависимости

- `FormBuilder` - для reactive form с complex validation
- `Store` - для dispatch signup actions
- `Router` - для навигации

#### Пример использования

```html
<app-signup></app-signup>
```

#### Связанные компоненты

- `ButtonComponent` - для submit кнопки
- `Login Component` - редирект после успеха

---

### 👤 Profile Component

**Путь:** `src/app/features/profile/profile.ts`
**Тип:** Smart Component
**Назначение:** Профиль и настройки пользователя

#### Ответственность

- Отображение информации о пользователе
- Редактирование профиля
- Изменение пароля
- Выход из системы

#### Inputs/Outputs

Нет внешних inputs/outputs

#### Зависимости

- `Store` - для получения данных пользователя
- `AuthService` - для logout операции
- `Router` - для навигации

#### Пример использования

```html
<app-profile></app-profile>
```

#### Связанные компоненты

- `ButtonComponent` - для действий
- `AuthGuard` - защита маршрута

---

## 🎨 Shared UI Components

### 🔘 Button Component

**Путь:** `src/app/shared/ui/button/button.ts`
**Тип:** Presentational Component
**Назначение:** Универсальная кнопка с множеством стилей

#### Ответственность

- Отображение кнопок с различными стилями
- Показ загрузочного состояния
- Поддержка иконок
- Accessibility (ARIA атрибуты)

#### Inputs/Outputs

```typescript
// Inputs
severity = input<ButtonSeverity>('primary');
size = input<ButtonSize>('medium');
variant = input<ButtonVariant>('basic');
rounded = input<boolean>(false);
icon = input<LucideIconData>();
iconPos = input<ButtonIconPos>('left');
iconOnly = input<boolean>(false);
loading = input<boolean>(false);
disabled = input<boolean>(false);
shadow = input<boolean>(false);
```

#### Signals

```typescript
isDisabled = computed(() => this.disabled() || this.loading());
computedClasses = computed(() => /* вычисление CSS классов */);
iconClass = computed(() => /* класс для иконки */);
```

#### Зависимости

- `LucideAngularModule` - для иконок

#### Пример использования

```html
<!-- Basic button -->
<button appButton>Click me</button>

<!-- With icon -->
<button appButton [icon]="Save" iconPos="left">Save</button>

<!-- Loading state -->
<button appButton [loading]="true">Loading...</button>

<!-- Different variants -->
<button appButton variant="outlined" severity="success">Success</button>
<button appButton variant="text">Text Button</button>
```

#### Связанные компоненты

- Используется во всех feature компонентах
- Lucide Icons для визуальных элементов

---

### 🌓 Theme Switcher Component

**Путь:** `src/app/shared/ui/theme-switcher/theme-switcher.ts`
**Тип:** Presentational Component
**Назначение:** Переключатель тем оформления

#### Ответственность

- Отображение текущей темы
- Переключение между темами
- Анимированные переходы
- Accessibility поддержка

#### Inputs/Outputs

Нет внешних inputs/outputs

#### Зависимости

- `ThemeService` - для управления темами
- `LucideAngularModule` - для иконок Sun/Moon

#### Пример использования

```html
<app-theme-switcher></app-theme-switcher>
```

#### Связанные компоненты

- `ThemeService` - бизнес-логика темизации
- Используется в header всех страниц

---

### 📢 Toast Component

**Путь:** `src/app/shared/ui/toast/toast.ts`
**Тип:** Presentational Component
**Назначение:** Отображение уведомлений

#### Ответственность

- Отображение toast уведомлений
- Анимированное появление/исчезновение
- Закрытие по клику или автоматически
- Поддержка различных типов

#### Inputs/Outputs

```typescript
@Input() toast: Toast;
@Output() close = new EventEmitter<string>();
```

#### Зависимости

- `ToastService` - для получения данных и управления

#### Пример использования

```html
<div *ngFor="let toast of toastService.toasts()">
  <app-toast [toast]="toast" (close)="toastService.remove(toast.id)"></app-toast>
</div>
```

#### Связанные компоненты

- `ToastService` - управление состоянием
- Используется глобально (обычно в app component)

---

## 📄 Layout Components

### 📐 Layout Structure

**Путь:** `src/app/layout/`
**Статус:** 🚧 В разработке

#### Планируемые компоненты:

- **MainLayout** - Основной layout с header/content/footer
- **DashboardLayout** - Layout для dashboard страниц
- **AuthLayout** - Layout для auth страниц (login/signup)

> 💡 **Примечание:** Layout компоненты еще не реализованы. В текущей версии каждый feature component управляет своим layout самостоятельно.

---

## 🎯 Error Page Components Details

### ❌ Not Found Component

**Путь:** `src/app/features/errors/not-found/not-found.ts`
**Route:** `**` (catch-all route)
**Назначение:** Страница 404 для несуществующих маршрутов

#### Ответственность
- Отображение user-friendly 404 сообщения
- Навигация обратно на главную
- Suggestions для популярных страниц

#### Использование
```typescript
// Автоматически отображается для любого неизвестного route
{ path: '**', loadComponent: () => import('./features/errors/not-found/not-found').then(m => m.NotFound) }
```

### 🚫 Forbidden Component

**Путь:** `src/app/features/errors/forbidden/forbidden.ts`
**Route:** `/error/403`
**Назначение:** Страница для ошибок доступа

#### Ответственность
- Отображение когда пользователь не имеет доступа
- Объяснение почему доступ запрещен
- Предложение действий (login, contact admin)

### 💥 Server Error Component

**Путь:** `src/app/features/errors/server-error/server-error.ts`
**Route:** `/error/500`
**Назначение:** Страница для server-side ошибок

#### Ответственность
- Отображение при 500 ошибках
- User-friendly сообщение об ошибке
- Retry button для повтора операции

---

## 🛡️ Guards & Interceptors

### 🔐 Auth Guard

**Путь:** `src/app/core/auth/guards/auth.guard.ts`
**Тип:** Route Guard
**Назначение:** Защита маршрутов, требующих аутентификации

#### Ответственность

- Проверка статуса аутентификации
- Редирект на login страницу если не авторизован
- Ожидание завершения проверки аутентификации

#### Использование

```typescript
// app.routes.ts
{
  path: 'profile',
  loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
  canActivateChild: [authGuard]
}
```

#### Зависимости

- `Store` - для проверки auth state
- `Router` - для редиректа

#### Связанные компоненты

- `Login Component` - цель редиректа
- `NgRx Auth Store` - источник данных

---

### 🚪 Guest Guard

**Путь:** `src/app/core/auth/guards/guest.guard.ts`
**Тип:** Route Guard
**Назначение:** Защита маршрутов только для неавторизованных пользователей

#### Ответственность

- Проверка что пользователь не авторизован
- Редирект на главную страницу если авторизован
- Предотвращение доступа к login/signup после входа

#### Использование

```typescript
{
  path: '',
  canActivateChild: [guestGuard],
  children: [
    { path: 'login', component: Login },
    { path: 'signup', component: Signup }
  ]
}
```

#### Зависимости

- `Store` - для проверки auth state
- `Router` - для редиректа

---

### 🕵️ Auth Interceptor

**Путь:** `src/app/core/auth/interceptors/auth.interceptor.ts`
**Тип:** HTTP Interceptor
**Назначение:** Автоматическая подстановка auth headers

#### Ответственность

- Добавление Authorization заголовков
- Управление withCredentials для cookies
- Обновление токенов (если требуется)

#### Использование

Автоматически применяется ко всем HTTP запросам через `app.config.ts`.

#### Зависимости

- AuthService для получения токенов

---

### ⚠️ Error Interceptor

**Путь:** `src/app/core/auth/interceptors/error.interceptor.ts`
**Тип:** HTTP Interceptor
**Назначение:** Централизованная обработка HTTP ошибок

#### Ответственность

- Обработка 401 ошибок (redirect на login)
- Обработка 403 ошибок (redirect на forbidden)
- Обработка 500 ошибок (redirect на error page)
- Пропагация validation ошибок в компоненты

#### Использование

Автоматически применяется ко всем HTTP запросам.

#### Зависимости

- `Router` - для редиректов
- `ToastService` - для уведомлений

---

## 🔄 NgRx Store

### 📥 Auth Actions

**Путь:** `src/app/core/auth/store/auth.actions.ts`
**Тип:** NgRx Actions
**Назначение:** Описание всех auth-related действий

#### Actions

```typescript
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: HttpErrorResponse }>(),

    Signup: props<{ request: SignupRequest }>(),
    'Signup Success': props<{ response: SignupResponse }>(),
    'Signup Failure': props<{ error: HttpErrorResponse }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),

    'Check Auth': emptyProps(),
    'Check Auth Success': props<{ user: User }>(),
    'Check Auth Failure': emptyProps(),
  },
});
```

---

### ⚙️ Auth Reducer

**Путь:** `src/app/core/auth/store/auth.reducer.ts`
**Тип:** NgRx Reducer
**Назначение:** Pure функции для обновления auth state

#### State Interface

```typescript
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: HttpErrorResponse | null;
  isAuthenticated: boolean;
}
```

#### Selectors

```typescript
export const selectUser = createSelector(selectAuthState, (state) => state.user);
export const selectIsLoading = createSelector(selectAuthState, (state) => state.isLoading);
export const selectError = createSelector(selectAuthState, (state) => state.error);
export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);
```

---

### 🎭 Auth Effects

**Путь:** `src/app/core/auth/store/auth.effects.ts`
**Тип:** NgRx Effects
**Назначение:** Обработка side effects для auth actions

#### Основные Effects

```typescript
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.login),
    exhaustMap(({ request }) =>
      this.authService.login(request).pipe(
        map((user) => AuthActions.loginSuccess({ user })),
        catchError((error) => of(AuthActions.loginFailure({ error })))
      )
    )
  )
);

signup$ = createEffect(() => /* signup logic */);
checkAuth$ = createEffect(() => /* auth check logic */);
logout$ = createEffect(() => /* logout logic */);
```

---

## 🧪 Testing Patterns

### Component Testing Example

```typescript
describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let fixture: ComponentFixture<ButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ButtonComponent],
    });
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should apply loading state correctly', () => {
    component.loading.set(true);
    fixture.detectChanges();

    expect(component.isDisabled()).toBe(true);
    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
});
```

---

## 🎯 Best Practices

### При создании нового компонента:

1. **Определить тип** - Smart или Presentational
2. **Следовать naming conventions**
3. **Использовать ChangeDetectionStrategy.OnPush**
4. **Добавить unit тесты**
5. **Обновить этот документ**

### При использовании существующих компонентов:

1. **Изучить API** - inputs, outputs, signals
2. **Проверить зависимости**
3. **Посмотреть примеры использования**
4. **Следовать accessibility guidelines**

---

## 📚 Дополнительные ресурсы

- [Architecture Rules](./arch-rules.md) - Строгие правила разработки
- [State Management](./state-management.md) - Детальное описание NgRx
- [Usage Guide](../usage.md) - Практические примеры использования
- [Installation](../installation.md) - Настройка окружения

---

**💡 Совет:** Этот документ обновляется при добавлении новых компонентов. Всегда проверяйте актуальность перед началом работы.
