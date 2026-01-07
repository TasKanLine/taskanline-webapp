# Промпт: Реализация Auth Flow для TasKanLine

## Контекст проекта

Ты работаешь над системой управления проектами **TasKanLine** (аналог YouTrack, Monday.com, ClickUp). Проект использует:

- **Frontend**: Angular 21.0.5 (standalone components)
- **TypeScript**: 5.9.3
- **Styling**: TailwindCSS v4 + SCSS
- **Icons**: Lucide Angular
- **Fonts**: IBM Plex Sans (UI), IBM Plex Serif (заголовки)
- **Design System**: Flexoki цветовая палитра, акцентный цвет — **Teal**

## Структура проекта

```
src/app/
├── core/
│   ├── services/theme-service.ts (уже реализован)
│   └── auth/ (пусто, для будущей логики)
├── features/
│   ├── login/ (компонент создан, нужна верстка)
│   └── signup/ (компонент создан, нужна верстка)
└── shared/
    └── ui/
        ├── button/ (полностью готов, см. референс)
        └── theme-switcher/ (готов)
```

## Задача

Реализовать **верстку страниц авторизации** (Login и Sign Up) с использованием существующего компонента `button` из `shared/ui/button`. Логика и взаимодействие с бэкендом FastAPI будут добавлены позже.

---

## Требования к дизайну

### 1. Общая стилистика
- **Стиль**: минимализм + корпоративный
- **Цветовая палитра**: Flexoki
- **Акцентный цвет**: Teal (используй из Flexoki палитры)
- **Layout**: центрированная форма на полный экран
- **Темная тема**: уже реализована через `ThemeService`, используй CSS-переменные из `styles.scss`

### 2. Типографика
- **Заголовки**: IBM Plex Serif (font-weight: 600-700)
- **Основной текст**: IBM Plex Sans (font-weight: 400-500)
- **Размеры**: адаптивные (используй Tailwind утилиты)

### 3. Компоненты

#### Используй существующий Button компонент:
```typescript
// Доступные опции:
severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'help' | 'danger' | 'contrast'
variant: 'basic' | 'outlined' | 'text' | 'link' | 'raised' | 'raised-text'
size: 'small' | 'medium' | 'large'
rounded: boolean
loading: boolean
disabled: boolean
icon: LucideIcon (опционально)
iconPos: 'left' | 'right'
iconOnly: boolean
```

Пример использования:
```html
<button appButton severity="primary" [loading]="isLoading">Sign In</button>
```

---

## Спецификация форм

### Login Form (`src/app/features/login/`)

**Поля:**
1. **Email** (type="email", required, валидация формата)
2. **Password** (type="password", required, toggle показать/скрыть)

**Элементы UI:**
- Заголовок: "Welcome Back" (IBM Plex Serif, bold)
- Подзаголовок: "Sign in to continue to TasKanLine"
- Кнопка показа/скрытия пароля (Lucide icon: Eye/EyeOff)
- Submit кнопка: "Sign In" (severity="primary", loading state)
- Ссылка: "Don't have an account? Sign Up" (переход на `/signup`)
- Ссылка: "Forgot password?" (пока неактивна, но добавь placeholder)

**Валидация:**
- Real-time валидация при потере фокуса (onBlur)
- Показ ошибок под полями (красный текст, маленький шрифт)
- Блокировка submit при невалидных данных

---

### Sign Up Form (`src/app/features/signup/`)

**Поля:**
1. **Email** (type="email", required, валидация формата)
2. **Username** (type="text", required, min 3 символа)
3. **First Name** (type="text", required)
4. **Last Name** (type="text", required)
5. **Password** (type="password", required, min 8 символов, toggle показать/скрыть)

**Элементы UI:**
- Заголовок: "Create Account" (IBM Plex Serif, bold)
- Подзаголовок: "Join TasKanLine and manage your projects"
- Кнопка показа/скрытия пароля (Lucide icon: Eye/EyeOff)
- Submit кнопка: "Create Account" (severity="primary", loading state)
- Ссылка: "Already have an account? Sign In" (переход на `/login`)

**Валидация:**
- Real-time валидация при потере фокуса (onBlur)
- Email: формат email
- Username: минимум 3 символа, только буквы/цифры/_
- First Name / Last Name: не пустые
- Password: минимум 8 символов
- Показ ошибок под полями

---

## Технические требования

### 1. Angular Reactive Forms
Используй `ReactiveFormsModule` с `FormGroup`, `FormControl`, валидаторами:
```typescript
import { FormBuilder, Validators } from '@angular/forms';

loginForm = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});
```

### 2. Стилизация
- **Tailwind утилиты** для layout и spacing
- **SCSS файлы** для специфичных стилей компонента
- **CSS-переменные** из `styles.scss` для цветов:
  - `--bg-primary`, `--bg-secondary`
  - `--text-primary`
  - `--border-color`

### 3. Адаптивность
- Desktop: форма 400-450px ширина, центр экрана
- Mobile: padding 20px с боков, full-width
- Используй Tailwind breakpoints (sm:, md:, lg:)

### 4. Accessibility
- Все поля с `<label>` и `for` атрибутами
- `aria-label` для иконок
- `aria-invalid` для невалидных полей
- `role="alert"` для сообщений об ошибках

### 5. Состояния
- **Normal**: стандартное поле
- **Focus**: border accent цвет (Teal)
- **Error**: красная рамка + сообщение
- **Disabled**: opacity 0.5, cursor not-allowed
- **Loading**: кнопка с loading state (используй `[loading]="true"`)

---

## UX детали

### Переходы между формами
В `app.routes.ts` уже настроен роутинг:
```typescript
{ path: 'login', component: Login },
{ path: 'signup', component: Signup },
```

Используй `routerLink`:
```html
<a routerLink="/signup" class="...">Don't have an account? Sign Up</a>
```

### Показать/скрыть пароль
Используй signal для toggle:
```typescript
showPassword = signal(false);

togglePasswordVisibility() {
  this.showPassword.update(v => !v);
}
```

```html
<input [type]="showPassword() ? 'text' : 'password'" />
<button (click)="togglePasswordVisibility()">
  <lucide-icon [name]="showPassword() ? EyeOff : Eye" />
</button>
```

### Валидация
Показывай ошибки только после:
1. Пользователь потерял фокус (blur)
2. Пользователь попытался submit

```typescript
isFieldInvalid(fieldName: string): boolean {
  const field = this.form.get(fieldName);
  return !!(field?.invalid && (field?.dirty || field?.touched));
}
```

---

## Структура файлов

Для каждого компонента (login/signup):

**login.ts / signup.ts:**
```typescript
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { ButtonDirective } from '@shared/ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, LucideAngularModule, ButtonDirective],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  // Реализация
}
```

**login.html / signup.html:**
- Полная HTML разметка формы
- Использование `appButton` директивы
- Валидационные сообщения

**login.scss / signup.scss:**
- Специфичные стили (если нужны)
- Используй Tailwind где возможно

---

## Пример структуры HTML (Login)

```html
<div class="min-h-screen flex items-center justify-center p-4 bg-[--bg-primary]">
  <div class="w-full max-w-md">
    <!-- Placeholder вместо логотипа -->
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold font-serif text-[--text-primary]">TasKanLine</h2>
    </div>

    <!-- Card с формой -->
    <div class="bg-[--bg-secondary] border border-[--border-color] rounded-lg p-8 shadow-sm">
      <h1 class="text-2xl font-bold font-serif mb-2">Welcome Back</h1>
      <p class="text-sm opacity-70 mb-6">Sign in to continue to TasKanLine</p>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Email field -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            [class.border-red-500]="isFieldInvalid('email')"
          />
          @if (isFieldInvalid('email')) {
            <p class="text-red-500 text-xs mt-1">Valid email is required</p>
          }
        </div>

        <!-- Password field with toggle -->
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium mb-2">Password</label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              formControlName="password"
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
            />
            <button
              type="button"
              (click)="togglePasswordVisibility()"
              class="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <lucide-icon [name]="showPassword() ? EyeOff : Eye" [size]="20" />
            </button>
          </div>
        </div>

        <!-- Submit button -->
        <button
          appButton
          severity="primary"
          type="submit"
          [disabled]="loginForm.invalid"
          [loading]="isLoading()"
          class="w-full"
        >
          Sign In
        </button>
      </form>

      <!-- Links -->
      <div class="mt-6 text-center text-sm">
        <a routerLink="/signup" class="text-teal-600 hover:underline">
          Don't have an account? Sign Up
        </a>
      </div>
    </div>
  </div>
</div>
```

---

## Цветовая палитра Flexoki (для справки)

**Teal (акцентный):**
- Light: `#4385be` (teal-600)
- Dark: `#3c99dc` (teal-500)

**Background:**
- Light: используй существующие `--bg-primary`, `--bg-secondary`
- Dark: те же переменные (уже настроены в `styles.scss`)

**Borders:**
- `--border-color` (уже настроен)

**Используй Tailwind утилиты с Flexoki цветами:**
```css
/* В tailwind.config.js можно добавить кастомные цвета, но пока используй стандартные teal */
focus:ring-teal-500
border-teal-600
text-teal-600
```

---

## Чек-лист выполнения

### Login компонент:
- [ ] Reactive Form с валидацией
- [ ] Email и Password поля
- [ ] Toggle показать/скрыть пароль
- [ ] Real-time валидация (onBlur)
- [ ] Submit кнопка с loading state
- [ ] Ссылка на Sign Up
- [ ] Placeholder "Forgot password?"
- [ ] Адаптивная верстка
- [ ] Accessibility атрибуты
- [ ] Использование `appButton` директивы

### Sign Up компонент:
- [ ] Reactive Form с валидацией
- [ ] Все 5 полей (Email, Username, First Name, Last Name, Password)
- [ ] Toggle показать/скрыть пароль
- [ ] Real-time валидация с правилами
- [ ] Submit кнопка с loading state
- [ ] Ссылка на Login
- [ ] Адаптивная верстка
- [ ] Accessibility атрибуты
- [ ] Использование `appButton` директивы

### Общее:
- [ ] Темная тема работает корректно
- [ ] Шрифты IBM Plex применены правильно
- [ ] Lucide иконки подключены
- [ ] Нет ошибок TypeScript
- [ ] Код соответствует Angular best practices

---

## Финальные инструкции

1. **Сгенерируй полный код** для обоих компонентов (TS, HTML, SCSS)
2. **Используй существующие компоненты** из проекта (button, theme-switcher)
3. **Следуй структуре проекта** и соглашениям по именованию
4. **Добавь комментарии** в сложных местах
5. **Не добавляй логику** взаимодействия с backend (это позже)
6. **Убедись**, что формы работают в standalone режиме
