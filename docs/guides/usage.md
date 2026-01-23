# 💡 Использование TasKanLine Client

Практическое руководство по использованию TasKanLine Client - от базовых пользовательских сценариев до работы с компонентами и API.

## 👥 Основные пользовательские сценарии

### 🏠 Главная страница

При запуске приложения пользователь попадает на главную страницу (`/`), которая доступна всем посетителям.

#### Что доступно на главной:

- **Обзор приложения** - краткое описание возможностей
- **Навигация** - быстрые ссылки на основные разделы
- **Переключатель темы** - в header приложения
- **Ссылки на аутентификацию** - вход и регистрация

```typescript
// Пример навигации программно
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToHome() {
  this.router.navigate(['/']);
}
```

### 🔐 Аутентификация

#### Регистрация нового пользователя

**Route**: `/signup`

**Функциональность**:

- Валидация email и password в реальном времени
- Проверка совпадения паролей
- Обработка ошибок валидации с сервера
- Автоматический редирект после успешной регистрации

**Пример использования формы**:

```typescript
// В signup.component.ts
export class Signup {
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  onSubmit() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.store.dispatch(
        AuthActions.signup({
          request: { email, password },
        }),
      );
    }
  }
}
```

#### Вход в систему

**Route**: `/login`

**Особенности**:

- Форма с email и паролем
- Опция "Запомнить меня" (сохраняет флаг в localStorage)
- Показ/скрытие пароля
- Автоматическая подстановка сохраненных данных
- Обработка ошибок аутентификации

**Пример обработки ошибок**:

```typescript
getFieldError(fieldName: string): string | null {
  const error = this.error() as any;
  if (!error || !error.detail) return null;

  const fieldError = error.detail.find((e: ValidationError) =>
    e.loc.includes(fieldName)
  );
  return fieldError ? fieldError.msg : null;
}
```

### 👤 Профиль пользователя

**Route**: `/profile` (требует аутентификации)

**Функциональность**:

- Отображение данных пользователя
- Редактирование профиля
- Изменение пароля
- Выход из системы

**Защита маршрута**:

```typescript
// app.routes.ts
{
  path: 'profile',
  loadComponent: () => import('./features/profile/profile').then(m => m.Profile),
  canActivateChild: [authGuard]  // Требует аутентификации
}
```

### 📚 Справочная система

**Route**: `/reference` (требует аутентификации)

**Особенности**:

- Ленивая загрузка компонента
- Оптимизированная загрузка контента
- Адаптивный дизайн

## 🎨 Работа с темизацией

### Theme Service

Приложение поддерживает светлую и темную темы с автоматическим сохранением выбора.

**Пример использования**:

```typescript
import { ThemeService } from '@core/services/theme-service';

export class MyComponent {
  currentTheme = inject(ThemeService).currentTheme;

  toggleTheme() {
    inject(ThemeService).toggleTheme();
  }
}
```

### Автоматическая инициализация темы

Сервис автоматически:

- Проверяет сохраненную тему в `localStorage`
- Определяет системные предпочтения (`prefers-color-scheme: dark`)
- Применяет тему к `document.documentElement`

**CSS классы**:

- Темная тема: `html.dark`
- Светлая тема: `html` (без dark класса)

### TailwindCSS интеграция

```html
<!-- Пример использования в шаблоне -->
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <!-- Автоматическая адаптация под тему -->
</div>
```

## 🧩 Использование компонентов

### Button Component

Универсальный компонент кнопки с различными стилями и состояниями.

**Базовое использование**:

```html
<button appButton>Default Button</button>
```

**С иконкой**:

```html
<button appButton [icon]="Save" iconPos="left">Save</button>
```

**Различные стили**:

```html
<!-- Primary кнопка -->
<button appButton severity="primary">Primary</button>

<!-- Secondary кнопка -->
<button appButton severity="secondary">Secondary</button>

<!-- Outline вариант -->
<button appButton variant="outlined" severity="success">Success</button>

<!-- Text кнопка -->
<button appButton variant="text">Text Button</button>

<!-- Loading состояние -->
<button appButton [loading]="true">Loading...</button>
```

**Все доступные свойства**:

```typescript
interface ButtonProps {
  severity?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  variant?: 'basic' | 'outlined' | 'text' | 'raised' | 'link';
  rounded?: boolean;
  icon?: LucideIconData;
  iconPos?: 'left' | 'right';
  iconOnly?: boolean;
  loading?: boolean;
  disabled?: boolean;
  shadow?: boolean;
}
```

### Theme Switcher Component

Компонент для переключения темы.

**Использование**:

```html
<app-theme-switcher></app-theme-switcher>
```

**Автоматическая интеграция**:

- Отображает текущую тему
- Анимированное переключение
- Сохраняет выбор пользователя

## 🔄 State Management с NgRx

### Выборка данных из Store

```typescript
import { Store } from '@ngrx/store';
import { selectUser, selectIsLoading, selectError } from '@core/auth/store/auth.reducer';

export class MyComponent {
  user = this.store.selectSignal(selectUser);
  isLoading = this.store.selectSignal(selectIsLoading);
  error = this.store.selectSignal(selectError);

  constructor(private store: Store) {}
}
```

### Диспатчинг действий

```typescript
// Login
this.store.dispatch(
  AuthActions.login({
    request: { email, password },
  }),
);

// Logout
this.store.dispatch(AuthActions.logout());

// Check auth status
this.store.dispatch(AuthActions.checkAuth());
```

## 🌐 Работа с API

### HTTP Interceptors

Приложение использует два основных интерсептора:

#### Auth Interceptor

Автоматически добавляет токен аутентификации к запросам:

```typescript
// Автоматическая подстановка заголовка
Authorization: `Bearer ${token}`;
```

#### Error Interceptor

Обрабатывает ошибки централизованно:

- 401: редирект на login
- 403: редирект на forbidden page
- 500: редирект на error page
- Валидационные ошибки: передает в компоненты

### Пример API вызова

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MyService {
  constructor(private http: HttpClient) {}

  getUserData() {
    return this.http.get<User>('/api/user/profile');
  }

  updateUser(data: Partial<User>) {
    return this.http.patch<User>('/api/user/profile', data);
  }
}
```

## 📱 Навигация и Routing

### Программная навигация

```typescript
import { Router } from '@angular/router';

export class MyComponent {
  constructor(private router: Router) {}

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateWithParams() {
    this.router.navigate(['/users', userId]);
  }

  navigateWithQueryParams() {
    this.router.navigate(['/search'], {
      queryParams: { q: 'search term' },
    });
  }
}
```

### Guards

#### Auth Guard

Защищает маршруты, требующие аутентификации:

```typescript
canActivate(): boolean {
  return this.authService.isAuthenticated();
}
```

#### Guest Guard

Ограничивает доступ для аутентифицированных пользователей:

```typescript
canActivate(): boolean {
  return !this.authService.isAuthenticated();
}
```

## 📢 Уведомления (Toast)

### Использование Toast Service

```typescript
import { ToastService } from '@core/services/toast.service';

export class MyComponent {
  constructor(private toastService: ToastService) {}

  showSuccess() {
    this.toastService.success('Операция выполнена успешно!');
  }

  showError() {
    this.toastService.error('Произошла ошибка');
  }

  showWarning() {
    this.toastService.warning('Внимание!');
  }

  showInfo() {
    this.toastService.info('Информационное сообщение');
  }
}
```

## 🛡️ Обработка ошибок

### Глобальная обработка

Приложение централизованно обрабатывает ошибки через:

1. **Error Interceptor** - перехватывает HTTP ошибки
2. **NgRx Effects** - обрабатывает ошибки в actions
3. **Error Pages** - специальные страницы для разных типов ошибок

**Страницы ошибок**:

- `/error/403` - Forbidden (доступ запрещен)
- `/error/500` - Server Error
- `/**` - Not Found (любой неизвестный маршрут)

### Локальная обработка ошибок

```typescript
export class MyComponent {
  error$ = new Subject<string>();

  handleError(message: string) {
    this.error$.next(message);
    this.toastService.error(message);
  }
}
```

## 🎯 Формы и валидация

### Reactive Forms

```typescript
export class MyFormComponent {
  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    age: [null, [Validators.min(18), Validators.max(120)]],
    terms: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    if (this.myForm.valid) {
      // Обработка формы
      console.log(this.myForm.value);
    } else {
      this.markFormAsTouched();
    }
  }

  private markFormAsTouched() {
    Object.values(this.myForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
```

### Валидация в шаблоне

```html
<form [formGroup]="myForm" (ngSubmit)="onSubmit()">
  <div>
    <input formControlName="name" type="text" />
    @if (myForm.get('name')?.invalid && myForm.get('name')?.touched) {
    <small class="error"> Имя обязательно (минимум 2 символа) </small>
    }
  </div>
</form>
```

## 🔄 Lifecycle и Best Practices

### OnInit и OnDestroy

```typescript
export class MyComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Инициализация
    this.loadInitialData();
  }

  ngOnDestroy() {
    // Cleanup
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Оптимизация производительности

```typescript
// Использование async pipe в шаблоне
data$ = this.store.select(selectData);

// В шаблоне
<div *ngIf="data$ | async as data">
  {{ data.title }}
</div>
```

## 🚀 Продвинутые сценарии

### Ленивая загрузка компонентов

```typescript
// app.routes.ts
{
  path: 'feature',
  loadComponent: () => import('./features/my-feature/my-feature').then(m => m.MyFeature)
}
```

### Интерцепторы для логирования

```typescript
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const start = Date.now();

    return next.handle(req).pipe(
      tap((event) => {
        if (event.type === HttpEventType.Response) {
          console.log(`Request took ${Date.now() - start}ms`);
        }
      }),
    );
  }
}
```

---

## 📞 Дополнительная помощь

Более подробную информацию можно найти в:

- [Architecture Guide](./architecture/architecture.md) - для понимания структуры
- [Components Guide](./architecture/components-guide.md) - для деталей о компонентах
- [State Management](./architecture/state-management.md) - для NgRx деталей
