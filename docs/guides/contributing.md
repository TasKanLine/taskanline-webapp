# 🤝 Contributing Guide TasKanLine Client

Гайд для контрибьюторов по внесению вклада в TasKanLine Client. От установки окружения до создания Pull Request.

---

## 📋 Оглавление

- [Начало работы](#-начало-работы)
- [Development Workflow](#development-workflow)
- [Code Style & Standards](#code-style--standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Review Process](#review-process)
- [Bug Reporting](#bug-reporting)
- [Feature Requests](#feature-requests)
- [Community Guidelines](#community-guidelines)

---

## 🚀 Начало работы

### 📋 Предварительные требования

Перед тем как начать, убедитесь что у вас установлено:

- **Node.js** 22.20.0+
- **npm** 11.6.2+ или **Bun** (рекомендуется)
- **Git** 2.20.0+
- **VS Code** или **WebStorm** (рекомендуемые IDE)

### 🔧 Fork & Clone

1. **Fork репозитория**

   ```bash
   # Fork на GitHub UI
   ```

2. **Клонирование вашего fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/TasKanLine.git
   cd TasKanLine/client
   ```

3. **Добавление upstream remote**

   ```bash
   git remote add upstream https://github.com/original-org/TasKanLine.git
   ```

4. **Установка зависимостей**

   ```bash
   # Используя Bun (рекомендуется)
   bun install

   # Или npm
   npm install
   ```

5. **Настройка окружения**

   ```bash
   # Создать .env файл если отсутствует
   cp .env.example .env

   # Настроить переменные окружения
   nano .env
   ```

6. **Запуск dev сервера**
   ```bash
   bun run s
   # или
   npm run s
   ```

### 🛠️ Настройка IDE

#### VS Code (рекомендуется)

Установите следующие расширения:

```json
{
  "recommendations": [
    "angular.ng-template",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "gitlens.gitlens",
    "ms-vscode.vscode-json"
  ]
}
```

Создайте `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "angular.enable-strict-mode-prompt": false,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

#### WebStorm

1. Установите **Angular** plugin
2. Настройте **ESLint** и **Prettier**
3. Включите **TypeScript** strict mode
4. Настройте **Tailwind CSS** plugin

---

## 🔄 Development Workflow

### 📋 Выбор задачи

1. **Проверьте Issues** - выберите существующую задачу
2. **Создайте Issue** для новых задач
3. **Обсудите подход** в комментариях перед началом работы

### 🌳 Branch Strategy

```bash
# Структура веток
main                    # Production-ready code
develop                 # Integration branch
feature/user-profile    # Feature branches
bugfix/login-issue     # Bugfix branches
hotfix/security-fix    # Hotfix branches
```

### 🚀 Создание Feature Branch

```bash
# Обновите develop ветку
git checkout develop
git pull upstream develop

# Создайте новую feature ветку
git checkout -b feature/your-feature-name

# Или для bugfix
git checkout -b bugfix/your-bugfix-name
```

### 📝 Naming Conventions

```bash
# Feature branches
feature/user-authentication
feature/profile-page
feature/task-management

# Bugfix branches
bugfix/login-validation-error
bugfix/theme-switcher-issue

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-bug-fix

# Release branches
release/v1.2.0
release/v2.0.0
```

### 🔄 Development Process

1. **Разработка**

   ```bash
   # Работайте над вашей фичей
   # Следуйте architectural rules
   # Пишите код
   ```

2. **Регулярные коммиты**

   ```bash
   git add .
   git commit -m "feat: add user profile component"
   ```

3. **Пуш и синхронизация**

   ```bash
   git push origin feature/your-feature-name
   git fetch upstream
   git rebase upstream/develop
   ```

4. **Регулярное тестирование**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

---

## 📝 Code Style & Standards

### 🎯 Architectural Rules

**КРИТИЧЕСКИ ВАЖНО:** Всегда следуйте [Architectural Rules](./architecture/arch-rules.md)

#### Основные принципы:

- ✅ **Standalone Components** - никаких NgModules
- ✅ **ChangeDetectionStrategy.OnPush** - во всех компонентах
- ✅ **Signals** для локального состояния
- ✅ **NgRx** для глобального состояния
- ✅ **Absolute imports** (`@core`, `@shared`, `@features`)
- ✅ **TypeScript strict mode** - без `any` типов

#### Запрещено:

- ❌ NgModules и deprecated patterns
- ❌ Non-null assertions (`!`)
- ❌ `var` declarations
- ❌ Hardcoded strings (используйте константы)

### 📏 Code Formatting

Используем **Prettier** с едиными настройками:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

### 🎯 Naming Conventions

#### Files:

```
✅ Правильно
user-profile.component.ts
auth.service.ts
login.effects.ts

❌ Неправильно
UserProfileComponent.ts
AuthService.ts
Login_Effects.ts
```

#### Components:

```typescript
✅ Правильно
export class UserProfileComponent {
  selector: 'app-user-profile';
}

❌ Неправильно
export class userprofile_component {
  selector: 'userprofile';
}
```

#### Variables & Functions:

```typescript
✅ Правильно
const maxFileSize = 10 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';

function getUserProfile(): Observable<UserProfile> {
  // ...
}

❌ Неправильно
const max_file_size = 10485760;
const apiurl = 'https://api.example.com';

function getUserProfile(): any {
  // ...
}
```

### 💬 Comments & Documentation

#### JSDoc для public methods:

```typescript
/**
 * Authenticates user with provided credentials
 * @param credentials User login credentials
 * @returns Observable with authenticated user data
 * @throws {AuthenticationError} When credentials are invalid
 */
login(credentials: LoginCredentials): Observable<User> {
  // Implementation
}
```

#### Inline comments для сложной логики:

```typescript
// Special case: Handle cross-tab sync without triggering side effects
if (message.type === 'login' && message.payload) {
  return AuthActions.loginSync({ user: message.payload });
}
```

---

## 🧪 Testing Guidelines

### 📋 Тестовые пирамиды

```
E2E Tests (5%)     # Критические пользовательские пути
Integration (15%)  # Компонентные интеграционные тесты
Unit Tests (80%)    # Юнит-тесты для функций и компонентов
```

### 🎯 Unit Tests

#### Component Testing:

```typescript
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideMockStore({ initialState })],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as MockStore;
    fixture.detectChanges();
  });

  it('should dispatch login action on form submit', () => {
    const spy = jest.spyOn(store, 'dispatch');

    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(spy).toHaveBeenCalledWith(
      AuthActions.login({
        request: { email: 'test@example.com', password: 'password123' },
      }),
    );
  });
});
```

#### Service Testing:

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should login successfully', () => {
    const mockUser = { id: '1', email: 'test@example.com' };
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${API_BASE_URL}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });
});
```

### 🔧 Testing Commands

```bash
# Запустить все тесты
npm test

# Запустить в watch mode
npm test -- --watch

# Запустить с coverage
npm test -- --coverage

# Запустить конкретный тест файл
npm test -- src/app/features/login/login.spec.ts

# Запустить E2E тесты
npm run e2e
```

### 📊 Coverage Requirements

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

```bash
# Генерация coverage отчета
npm run test -- --coverage --coverageReporters=lcov

# Просмотр в браузере
open coverage/lcov-report/index.html
```

---

## 🎯 Commit Guidelines

### 📝 Conventional Commits

Используем [Conventional Commits](https://www.conventionalcommits.org/) стандарт:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:

- `feat`: Новая функциональность
- `fix`: Bug fix
- `docs`: Документация
- `style`: Форматирование, без логических изменений
- `refactor`: Рефакторинг кода
- `perf`: Оптимизация производительности
- `test`: Добавление тестов
- `chore`: Обновление сборки, зависимостей, конфигурации

#### Examples:

```bash
# Feature
git commit -m "feat(auth): add user profile component"

# Bug fix
git commit -m "fix(login): resolve validation error handling"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Breaking change
git commit -m "feat(api)!: change authentication endpoint

BREAKING CHANGE: The /api/auth/login endpoint now requires
additional headers for security."
```

### 🔄 Commit Message Template

```bash
feat(scope): short description (max 50 chars)

More detailed explanatory text (72 chars wrap). Explain what
and why, not how. Reference issues using #123 format.

Closes #123
```

---

## 🎯 Pull Request Process

### 📋 Pre-merge Checklist

Перед созданием PR убедитесь:

- [ ] **Code passes all tests** (`npm test`)
- [ ] **Linting passes** (`npm run lint`)
- [ ] **Build succeeds** (`npm run build`)
- [ ] **Coverage meets requirements**
- [ ] **Documentation updated**
- [ ] **Architecture rules followed**
- [ ] **Commits follow conventional format**
- [ ] **Branch rebased with develop**

### 🚀 Creating Pull Request

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR на GitHub**
   - Use meaningful title
   - Fill description template
   - Link related issues
   - Add reviewers

3. **PR Description Template:**

```markdown
## 🎯 Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## 📝 Description

Brief description of changes made...

## 🔗 Related Issues

Closes #123
Related to #456

## 🧪 Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added
- [ ] Manual testing completed

## 📸 Screenshots (if UI changes)

Add screenshots here...

## ✅ Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
```

### 🔍 Review Process

#### Reviewer Guidelines:

1. **Architecture compliance** - Check against [arch-rules.md](./architecture/arch-rules.md)
2. **Code quality** - Readability, maintainability, performance
3. **Testing** - Adequate test coverage
4. **Security** - No vulnerabilities exposed
5. **Documentation** - Accurate and complete

#### Author Responsibilities:

1. **Respond to reviews** promptly
2. **Make requested changes** or provide justification
3. **Update documentation** as needed
4. **Resolve all conflicts** before merge

#### Merge Requirements:

- ✅ At least one approval
- ✅ All CI checks pass
- ✅ No merge conflicts
- ✅ Documentation updated

---

## 🐛 Bug Reporting

### 📝 Bug Report Template

Используйте этот template для создания bug reports:

```markdown
## 🐛 Bug Description

Clear and concise description of the bug...

## 🔄 Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## 💻 Expected Behavior

What you expected to happen...

## 📸 Screenshots

Add screenshots to help explain...

## 🖥️ Environment

- OS: [e.g. macOS 13.0]
- Browser: [e.g. Chrome 108]
- Angular Version: [e.g. 21.1.0]
- Node Version: [e.g. 22.20.0]

## 📋 Additional Context

Add any other context about the problem...
```

### 🏷️ Bug Labels

- `bug` - General bug reports
- `critical` - Blocking issues
- `security` - Security vulnerabilities
- `performance` - Performance issues

---

## 💡 Feature Requests

### 📝 Feature Request Template

```markdown
## 🚀 Feature Description

Clear and concise description of the feature...

## 💡 Motivation

Why is this feature needed? What problem does it solve?

## 📋 Proposed Solution

Detailed description of your proposed solution...

## 🔄 Alternatives Considered

What other approaches did you consider?...

## 📸 Mockups/UI Design

Add mockups or screenshots...

## 🎯 Acceptance Criteria

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3

## 📋 Additional Notes

Any additional context or considerations...
```

---

## 👥 Community Guidelines

### 🎯 Code of Conduct

1. **Be respectful** - Treat everyone with respect
2. **Be inclusive** - Welcome contributions from all backgrounds
3. **Be constructive** - Provide helpful feedback
4. **Be patient** - Help newcomers learn the project
5. **Be professional** - Keep discussions professional and on-topic

### 💬 Communication Channels

- **GitHub Issues** - Bug reports, feature requests
- **Pull Requests** - Code reviews and discussions
- **Discord/Slack** - Real-time discussions (if available)
- **Email** - Private matters (security issues, etc.)

### 🎯 Recognition

Great contributions will be recognized through:

- 🌟 **Contributor badge** in README
- 📝 **Mention in release notes**
- 🏆 **Spotlight in project updates**

---

## 🎯 Development Best Practices

### 🔄 Git Hygiene

```bash
# Regular sync with upstream
git fetch upstream
git rebase upstream/develop

# Clean up local branches
git branch -d feature/completed-feature
git remote prune origin

# Use .gitignore effectively
node_modules/
dist/
.env.local
*.log
```

### 🏗️ Component Development

```typescript
// ✅ Good component structure
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `...`,
  styleUrl: './user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  // Signals for state
  user = input<User>();
  isEditing = signal(false);

  // Computed values
  displayName = computed(() => {
    const user = this.user();
    return user ? `${user.name} (${user.email})` : 'Guest';
  });

  // Dependency injection
  private authService = inject(AuthService);

  // Public methods
  startEdit(): void {
    this.isEditing.set(true);
  }
}
```

### 📦 Performance Considerations

- **OnPush change detection** - Always use
- **TrackBy functions** - For \*ngFor loops
- **Lazy loading** - For heavy components
- **Signal optimization** - Computed over effects
- **Bundle analysis** - Regular size checks

```bash
# Bundle size analysis
npm run build -- --stats-json
npx webpack-bundle-analyzer dist/client/stats.json
```

---

## 🆘 Getting Help

### 📚 Resources

- [Architecture Rules](./architecture/arch-rules.md) - Must-read
- [Components Guide](./architecture/components-guide.md) - Component patterns
- [State Management](./architecture/state-management.md) - NgRx guide
- [Installation Guide](./installation.md) - Setup help

### 💬 Getting Help

1. **Search existing issues** - Check if already addressed
2. **Read documentation** - Review project docs
3. **Ask in issues** - Create question issue
4. **Join discussions** - Participate in PR discussions

### 🏆 Recognition for Contributors

We value all contributions! Contributors will be:

- Listed in README contributors section
- Mentioned in release notes
- Recognized in project announcements
- Invited to contributor discussions

---

## 🎉 Thank You!

Спасибо за интерес к TasKanLine Client! Ваш вклад помогает сделать проект лучше для всех пользователей.

Не стесняйтесь задавать вопросы и предлагать улучшения. Мы рады помочь новым контрибьюторам!

**Happy Coding!** 🚀

---

**记住：** Great software is built together, one contribution at a time! 💪
