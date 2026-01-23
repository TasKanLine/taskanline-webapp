# 📐 Architectural Rules TasKanLine Client

**⚠️ КРИТИЧЕСКИ ВАЖНЫЙ ДОКУМЕНТ ДЛЯ AI АГЕНТОВ**

Эти правила являются основой архитектуры проекта и **не должны нарушаться** без обсуждения с командой. Все изменения должны соответствовать этим принципам.

---

## 1️⃣ Общие архитектурные принципы

### 🏗️ Standalone Components Architecture

- **ТОЛЬКО standalone components** - никаких NgModules
- Каждый компонент самодостаточен и декларирует свои зависимости
- Использование `imports: []` в компоненте для зависимостей

### 🔄 Signals-first подход

- **Приоритет Signals** над traditional subscriptions
- Используйте `signal()` для локального состояния
- Используйте `computed()` для вычисляемых значений
- Используйте `effect()` для side effects
- Для NgRx: `selectSignal()` вместо `select()`

### 🎯 Feature-based организация

- Структура по бизнес-фичам, а не по техническим типам
- Каждая фича - самодостаточный модуль
- Инкапсуляция логики внутри feature

---

## 2️⃣ Структура проекта (краткая)

```
src/app/
├── 📁 core/           # ЕДИНСТВЕННЫЙ источник глобальных сервисов
│   ├── auth/          # Аутентификация (guards, interceptors, services)
│   ├── services/      # Глобальные сервисы (toast, theme)
│   ├── models/        # Глобальные модели и типы
│   └── interceptors/  # HTTP interceptors
├── 📁 features/       # ИЗОЛИРОВАННЫЕ функциональные модули
│   ├── login/         # Фича входа
│   ├── signup/        # Фича регистрации
│   ├── home/          # Главная страница
│   ├── profile/       # Профиль пользователя
│   ├── reference/     # Справка
│   └── errors/        # Страницы ошибок
├── 📁 shared/         # ПЕРЕИСПОЛЬЗУЕМЫЕ компоненты
│   ├── ui/            # UI компоненты (button, toast)
│   ├── pipes/         # Custom pipes
│   ├── directives/    # Custom directives
│   └── utils/         # Утилиты и helper functions
├── 📁 layout/         # Layout компоненты
├── app.ts             # Root component
├── app.config.ts      # App configuration
└── app.routes.ts      # Роутинг приложения
```

---

## 3️⃣ 🚫 ЗАПРЕЩЕНО (NEVER DO)

### Категорически запрещено:

- ❌ **Использовать NgModules** - только standalone components
- ❌ **Non-null assertions (!)** - использовать optional chaining или null checks
- ❌ **Использовать var** - только const/let
- ❌ **Хранить токены в localStorage** - использовать sessionStorage или HttpOnly cookies
- ❌ **ChangeDetectionStrategy.Default** - только OnPush
- ❌ **any тип** - использовать строгую типизацию
- ❌ **Прямые DOM манипуляции** - использовать Angular абстракции
- ❌ **Смешивать бизнес-логику с UI** - разделение concern'ов
- ❌ **Жестко закодированные строки** - использовать константы
- ❌ **Подписки без отписки** - использовать takeUntil или async pipe

---

## 4️⃣ ✅ ОБЯЗАТЕЛЬНО (ALWAYS DO)

### Всегда выполнять:

- ✅ **Standalone components** с `standalone: true`
- ✅ **ChangeDetectionStrategy.OnPush** во всех компонентах
- ✅ **Signals для state management** (локального состояния)
- ✅ **inject() для Dependency Injection**
- ✅ **Абсолютные импорты** (`@core`, `@shared`, `@features`)
- ✅ **Unit тесты** для всех компонентов и сервисов
- ✅ **Строгая типизация** с TypeScript
- ✅ **Обработка ошибок** в observable streams
- ✅ **Очистка ресурсов** в ngOnDestroy
- ✅ **Консистентное именование**

---

## 5️⃣ 📝 Правила именования

### Файлы:

```typescript
// ✅ Правильно
login.component.ts      # kebab-case для файлов
button.component.ts
auth.service.ts
user.model.ts

// ❌ Неправильно
LoginComponent.ts
ButtonComponent.ts
AuthService.ts
UserModel.ts
```

### Компоненты:

```typescript
// ✅ Правильно
export class LoginComponent {} // PascalCase
export class ButtonComponent {}

// ❌ Неправильно
export class loginComponent {}
export class button_component {}
```

### Селекторы:

```typescript
@Component({
  selector: 'app-login',           // kebab-case с префиксом app-
})

// ✅ Правильно
'app-login'
'app-button'
'app-user-profile'

// ❌ Неправильно
'login'
'Login'
'appLogin'
```

### Константы:

```typescript
// ✅ Правильно
const API_BASE_URL = 'https://api.example.com';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_TIMEOUT = 5000;

// ❌ Неправильно
const apiUrl = 'https://api.example.com';
const maxFileSize = 10485760;
const defaultTimeout = 5000;
```

---

## 6️⃣ 🔄 State Management Rules

### NgRx Store:

- **Глобальное состояние**: NgRx Store
- **Actions**: использовать createActionGroup
- **Selectors**: только pure functions, использовать createSelector
- **Effects**: для всех side effects (API вызовы, редиректы)
- **Feature slices**: логически группировать state

### Signals:

- **Локальное состояние**: component signals
- **Cross-component коммуникация**: через NgRx или service signals
- **Computed values**: computed signals
- **Side effects**: effects в сервисах

### Правила подписок:

```typescript
// ✅ Правильно - selectSignal
user = this.store.selectSignal(selectUser);

// ✅ Правильно - async pipe
user$ = this.store.select(selectUser);
// В шаблоне: *ngIf="user$ | async as user"

// ❌ Неправильно - manual subscription без отписки
user!: User;
ngOnInit() {
  this.store.select(selectUser).subscribe(user => {
    this.user = user;
  });
}
```

---

## 7️⃣ 🎨 Стилилизация Rules

### TailwindCSS приоритет:

```html
<!-- ✅ Правильно - Tailwind утилиты -->
<div class="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
  <!-- ❌ Неправильно - inline styles -->
  <div [style]="'background-color: white; border-radius: 8px;'"></div>
</div>
```

### SCSS использование:

```scss
// ✅ Правильно - только для component-specific стилей
:host {
  display: block;
}

.special-class {
  // Компонент-специфичные стили, которые нельзя выразить через Tailwind
}
```

### CSS Variables для темизации:

```scss
:root {
  --primary-color: #3b82f6;
  --background-color: #ffffff;
}

.dark {
  --primary-color: #60a5fa;
  --background-color: #1f2937;
}
```

---

## 8️⃣ 🔗 Dependency Injection Rules

### Использование inject():

```typescript
// ✅ Правильно - inject() (современный подход)
   export class MyComponent {
     private http = inject(HttpClient);
     private store = inject(Store);
   }
   
   // ✅ Допустимо - constructor injection (традиционный подход)
   export class MyComponent {
     constructor(
       private http: HttpClient,
       private store: Store,
     ) {}
   }
```

### Service injection:

```typescript
@Injectable({
  providedIn: 'root', // Всегда root для глобальных сервисов
})
export class MyService {
  private http = inject(HttpClient);
}
```

---

## 9️⃣ 📁 File Structure Rules

### Component files:

```
login/
├── login.ts           # Component class
├── login.html         # Template
├── login.scss         # Styles (если есть)
├── login.spec.ts      # Unit tests (ОБЯЗАТЕЛЬНО)
└── index.ts          # Barrel export (опционально)
```

### Feature module structure:

```
features/login/
├── components/       # Если есть подкомпоненты
├── services/         # Feature-specific сервисы
├── models/           # Feature-specific модели
├── utils/            # Feature утилиты
├── index.ts         # Barrel exports
└── login.component.ts  # Main component
```

---

## 🔟 🧪 Testing Rules

### Обязательные тесты:

- ✅ **Все компоненты**: unit тесты
- ✅ **Все сервисы**: unit тесты
- ✅ **All guards/inteceptors**: unit тесты
- ✅ **NgRx**: actions, reducers, selectors, effects

### Тестирование компонентов:

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      // providers для mock сервисов
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    const initial = component.showPassword();
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(!initial);
  });
});
```

---

## 1️⃣1️⃣ 🔍 Import Rules

### Абсолютные импорты:

```typescript
// ✅ Правильно
import { Button } from '@shared/ui/button/button';
import { AuthService } from '@core/auth/services/auth.service';
import { Login } from '@features/login/login';

// ❌ Неправильно
import { Button } from '../../../shared/ui/button/button';
import { AuthService } from '../../core/auth/services/auth.service';
import { Login } from './login';
```

### TypeScript path mapping:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

---

## 1️⃣2️⃣ ⚠️ Правила для AI агентов

### 🚨 ПРИ ИЗМЕНЕНИИ АРХИТЕКТУРЫ:

1. **Обновить** `docs/architecture/architecture.md`
2. **Добавить описание** в `docs/architecture/components-guide.md`
3. **Обновить** Mermaid диаграммы в `docs/architecture/diagrams.md`
4. **Проверить соответствие** этим arch-rules.md
5. **Обновить** `docs/ai-guidelines.md` если меняются паттерны

### 📝 ФОРМАТ КОММИТОВ:

Следовать conventional commits:

```bash
feat: add user profile feature
fix: resolve login validation issue
docs: update api documentation
refactor: migrate to signals-based state management
test: add unit tests for button component
```

### 🔄 ПРОВЕРКИ ПЕРЕД КОММИТОМ:

```bash
npm run lint        # Обязательно
npm test            # Обязательно
npm run build       # Проверить production build
```

---

## 🚨 EMERGENCY RULES

Эти правила **КАТЕГОРИЧЕСКИ НЕЛЬЗЯ** нарушать:

### 🚫 CRITICAL VIOLATIONS:

- Использовать NgModules
- Хранить секреты в коде
- Отключать strict mode в TypeScript
- Игнорировать ошибки в консоли
- Коммитить без тестов
- Использовать any тип без веской причины
- Создавать циклические зависимости

### ✅ MANDATORY PRACTICES:

- Всегда использовать `ChangeDetectionStrategy.OnPush`
- Всегда использовать `selectSignal()` для NgRx
- Всегда писать unit тесты
- Всегда обрабатывать ошибки в observable streams
- Всегда отписываться от подписок
- Всегда использовать абсолютные импорты

---

**⚠️ ВАЖНО:** Нарушение этих правил приводит к:

- Деградации производительности
- Потере типизации
- Сложностям в поддержке
- Багам в runtime
- Проблемам с масштабированием

**🎯 ЦЕЛЬ:** Создание предсказуемого, масштабируемого и поддерживаемого кода, который легко понимать и модифицировать.

---

## 1️⃣3️⃣ 🧪 Testing Specifics

### Running Single Tests
```bash
# ✅ ПРАВИЛЬНО: Для одного теста используй vitest CLI
bunx vitest run src/app/path/to/component.spec.ts

# ❌ НЕПРАВИЛЬНО: ng test не поддерживает single file
ng test src/app/path/to/component.spec.ts
```

## 1️⃣4️⃣ 📦 Bundle Size Constraints
```typescript
// Соблюдай bundle budget из angular.json
Initial bundle: 500kB warning, 1MB error
Component styles: 4kB warning, 8kB error
```

---

## 📞 Что делать при сомнениях

Если вы не уверены, как поступить:

1. **Читайте эти правила** - ответ здесь
2. **Смотрите существующий код** - следуйте паттернам
3. **Создайте issue** - спросите команду
4. **Следуйте принципу консерватизма** - выберите более безопасный вариант

**Помните: Код читается чаще, чем пишется!** 📚
