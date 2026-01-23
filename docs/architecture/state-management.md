# 🔄 State Management TasKanLine Client

Детальное руководство по управлению состоянием в TasKanLine Client с использованием NgRx, Signals и лучших практик реактивного программирования.

---

## 📋 Оглавление

- [Основные концепции](#-основные-концепции)
- [NgRx Store Structure](#ngrx-store-structure)
- [Actions](#actions)
- [Reducers](#reducers)
- [Effects](#effects)
- [Selectors](#selectors)
- [Integration with Signals](#integration-with-signals)
- [Best Practices](#-best-practices)
- [Testing](#testing)
- [Debugging](#debugging)

---

## 🧠 Основные концепции

### 🎯 Philosophy State Management

В TasKanLine Client мы используем гибридный подход:

1. **NgRx Store** для глобального состояния (auth, user data, application state)
2. **Angular Signals** для локального компонентного состояния
3. **Service Signals** для cross-component коммуникации

### 🏗️ Single Source of Truth

NgRx Store является единственным источником правды для:

- Данных пользователя (user profile, authentication status)
- Глобального состояния приложения (loading states, errors)
- Данных, разделенных между компонентами

### 🔄 Unidirectional Data Flow

```
UI Events → Actions → Effects → Services → Actions → Reducer → State → UI Update
```

---

## 🏪 NgRx Store Structure

### 🔧 Feature-based Organization

```typescript
export interface AppState {
  [authFeatureKey]: AuthState;
  // Другие feature slices будут добавляться здесь
  // [userProfileFeatureKey]: UserProfileState;
  // [tasksFeatureKey]: TasksState;
}
```

### 📊 Auth State Interface

```typescript
export interface AuthState {
  user: User | null; // Данные пользователя
  isLoading: boolean; // Статус загрузки
  error: HttpErrorResponse | null; // Ошибка последней операции
  isAuthenticated: boolean; // Флаг аутентификации
}

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};
```

### 🎯 Feature Creation Pattern

```typescript
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(/* ... */),
});
```

Этот подход автоматически создает:

- Feature key: `auth`
- Reducer function
- Selectors: `selectAuthState`, `selectUser`, etc.

---

## 📤 Actions

### 🏷️ createActionGroup Pattern

Мы используем `createActionGroup` для организации связанных actions:

```typescript
export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    // Login flow
    Login: props<{ request: LoginRequest }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: HttpErrorResponse }>(),
    'Login Sync': props<{ user: User }>(), // Для cross-tab синхронизации

    // Registration flow
    Signup: props<{ request: SignupRequest }>(),
    'Signup Success': props<{ response: SignupResponse }>(),
    'Signup Failure': props<{ error: HttpErrorResponse }>(),

    // State management
    Logout: emptyProps(),
    'Logout Success': emptyProps(),
    'Check Auth': emptyProps(),
    'Check Auth Success': props<{ user: User }>(),
    'Check Auth Failure': emptyProps(),
  },
});
```

### 📝 Action Naming Conventions

```typescript
// ✅ Правильные имена
'Login Success'; // PascalCase для success actions
'Login Failure'; // PascalCase для failure actions
'Check Auth'; // PascalCase для trigger actions
login; // camelCase для shortcut actions

// ❌ Неправильные имена
LOGIN_SUCCESS; // UPPER_CASE (устаревший стиль)
login_success; // snake_case
LoginSuccess; // 没有 пробела
```

### 🎭 Action Categories

#### 1. Trigger Actions

Инициируют side effects:

```typescript
Login: props<{ request: LoginRequest }>()
Signup: props<{ request: SignupRequest }>()
'Check Auth': emptyProps()
```

#### 2. Success Actions

Успешное завершение операций:

```typescript
'Login Success': props<{ user: User }>()
'Signup Success': props<{ response: SignupResponse }>()
'Check Auth Success': props<{ user: User }>()
```

#### 3. Failure Actions

Обработка ошибок:

```typescript
'Login Failure': props<{ error: HttpErrorResponse }>()
'Signup Failure': props<{ error: HttpErrorResponse }>()
'Check Auth Failure': emptyProps()
```

#### 4. Sync Actions

Для cross-tab синхронизации:

```typescript
'Login Sync': props<{ user: User }>()  // Не вызывает side effects
```

---

## ⚙️ Reducers

### 🎯 Pure Functions Pattern

```typescript
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    initialState,

    // Login flow
    on(AuthActions.login, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),

    on(AuthActions.loginSuccess, (state, { user }) => ({
      ...state,
      isLoading: false,
      user,
      isAuthenticated: true,
      error: null,
    })),

    // Special case: sync action (same logic, different purpose)
    on(AuthActions.loginSync, (state, { user }) => ({
      ...state,
      isLoading: false,
      user,
      isAuthenticated: true,
      error: null,
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
      isAuthenticated: false,
    })),

    // ... другие обработчики
  ),
});
```

### 📋 Reducer Rules

#### ✅ DO:

- Использовать spread operator для иммутабельности
- Возвращать полное состояние state
- Обрабатывать все возможные actions
- Использовать TypeScript для type safety

#### ❌ DON'T:

- Мутировать существующий state
- Использовать внешние зависимости
- Выполнять side effects
- Возвращать undefined

### 🔄 State Update Patterns

```typescript
// ✅ Правильно: иммутабельное обновление
on(AuthActions.loginSuccess, (state, { user }) => ({
  ...state,
  user,
  isAuthenticated: true,
  isLoading: false,
  error: null,
}));

// ❌ Неправильно: мутация state
on(AuthActions.loginSuccess, (state, { user }) => {
  state.user = user;
  state.isAuthenticated = true;
  return state; // ERROR: мутированный state
});
```

---

## 🎭 Effects

### 🎯 Purpose of Effects

Effects обрабатывают **side effects**:

- HTTP запросы
- Редиректы
- Toast уведомления
- Cross-tab коммуникация
- Логирование

### 🏗️ Basic Effect Structure

```typescript
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  // Primary effect - handles HTTP request
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((user) => AuthActions.loginSuccess({ user })),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
    ),
  );
}
```

### 🔄 Advanced Effect Patterns

#### 1. Success Effect с side effects

```typescript
loginSuccess$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loginSuccess),
    tap(({ user }) => {
      // 1. Cross-tab коммуникация
      this.authService.broadcastLogin(user);

      // 2. User feedback
      this.toastService.show('Login successful!', 'success');

      // 3. Navigation
      this.router.navigate(['/profile']);
    }),
    // 4. Триггер дополнительных действий
    map(() => AuthActions.checkAuth()),
  ),
);
```

#### 2. Failure Effect с ошибками

```typescript
loginFailure$ = createEffect(
  () =>
    this.actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap(({ error }) => {
        // Определение типа ошибки
        if (error.error?.detail) {
          this.toastService.show(error.error.detail, 'error');
        } else {
          this.toastService.show('Login failed. Please check your credentials.', 'error');
        }
      }),
    ),
  { dispatch: false }, // Не диспатчит новые actions
);
```

#### 3. Sync Effect для cross-tab

```typescript
syncAuth$ = createEffect(() =>
  this.authService.authMessage$.pipe(
    map((message) => {
      if (message.type === 'login' && message.payload) {
        // Важно: используем Sync action, чтобы избежать циклов
        return AuthActions.loginSync({ user: message.payload });
      } else if (message.type === 'logout') {
        return AuthActions.logoutSuccess();
      }
      return { type: 'NO_ACTION' };
    }),
    filter((action) => action.type !== 'NO_ACTION'),
  ),
);
```

### ⚡ Operators Usage

```typescript
// exhaustMap - игнорирует новые запросы во время выполнения
login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.login),
    exhaustMap(({ request }) => // ...
  )
);

// switchMap - отменяет предыдущие запросы
search$ = createEffect(() =>
  this.actions$.pipe(
    ofType(SearchActions.search),
    switchMap(({ query }) => // ...
  )
);

// mergeMap - параллельное выполнение
loadMultiple$ = createEffect(() =>
  this.actions$.pipe(
    ofType(LoadActions.loadAll),
    mergeMap(() => // ...
  )
);
```

---

## 🔍 Selectors

### 🎯 Auto-generated Selectors

`createFeature()` автоматически создает:

```typescript
export const {
  // Feature selector
  selectAuthState,

  // Property selectors
  selectUser,
  selectIsLoading,
  selectError,
  selectIsAuthenticated,
} = authFeature;
```

### 📝 Custom Selectors with createSelector

```typescript
// Композитный селектор
export const selectUserEmail = createSelector(selectUser, (user) => user?.email || null);

// Мемоизированный селектор с параметрами
export const selectIsLoadingAction = createSelector(
  selectIsLoading,
  (isLoading, action: string) => `${action}: ${isLoading ? 'Loading...' : 'Ready'}`,
);

// Селектор с несколькими зависимостями
export const selectUserProfile = createSelector(selectUser, selectIsAuthenticated, (user, isAuthenticated) => ({
  user,
  isAuthenticated,
  displayName: user?.name || 'Guest',
}));
```

### 🔄 Signal Selectors for Components

```typescript
// В компоненте - modern approach
export class LoginComponent {
  // Signal selectors
  user = this.store.selectSignal(selectUser);
  isLoading = this.store.selectSignal(selectIsLoading);
  isAuthenticated = this.store.selectSignal(selectIsAuthenticated);

  // Computed signals
  userDisplayName = computed(() => {
    const user = this.user();
    return user ? `${user.name} (${user.email})` : 'Guest';
  });

  constructor(private store: Store) {}
}
```

### 🔄 Traditional Observable Selectors (Legacy)

```typescript
// Для сложной логики или при необходимости
export class LegacyComponent {
  user$ = this.store.select(selectUser);
  isLoading$ = this.store.select(selectIsLoading);

  constructor(private store: Store) {}
}

// В шаблоне
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>
```

---

## 🔗 Integration with Signals

### 🎯 Hybrid State Management

```typescript
@Injectable()
export class UserProfileService {
  // Global state (NgRx)
  private store = inject(Store);
  user = this.store.selectSignal(selectUser);

  // Local state (Signals)
  isEditing = signal(false);
  formData = signal<Partial<User>>({});

  // Computed state
  canSave = computed(() => {
    const formData = this.formData();
    return formData.name && formData.email;
  });

  // Methods
  editProfile() {
    this.isEditing.set(true);
    this.formData.set(this.user() || {});
  }

  saveProfile() {
    const data = this.formData();
    this.store.dispatch(UserActions.updateProfile({ data }));
    this.isEditing.set(false);
  }
}
```

### 🔄 Component State Pattern

```typescript
export class ProfileComponent {
  // Global state from NgRx
  user = this.store.selectSignal(selectUser);

  // Local component state
  isEditing = signal(false);
  tempForm = signal<Partial<User>>({});

  // Computed properties
  hasUnsavedChanges = computed(() => {
    const original = this.user();
    const current = this.tempForm();
    return JSON.stringify(original) !== JSON.stringify(current);
  });

  // Methods
  startEdit() {
    this.isEditing.set(true);
    this.tempForm.set(this.user() || {});
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.tempForm.set({});
  }

  saveChanges() {
    this.store.dispatch(
      UserActions.updateProfile({
        data: this.tempForm(),
      }),
    );
    this.isEditing.set(false);
  }

  constructor(private store: Store) {}
}
```

---

## 🎯 Best Practices

### 📋 Action Design

```typescript
// ✅ Good: typed props
export const Actions = createActionGroup({
  source: 'User',
  events: {
    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: User }>(),
    'Load User Failure': props<{ error: HttpErrorResponse }>(),
  },
});

// ❌ Bad: untyped payload
export const loadUser = createAction('[User] Load User', (id: string) => ({ payload: id }));
```

### 🏗️ Feature Organization

```typescript
// ✅ Good: feature-based organization
src/app/core/auth/store/
├── auth.actions.ts
├── auth.reducer.ts
├── auth.effects.ts
├── auth.selectors.ts
└── index.ts

// ❌ Bad: flat structure
src/app/store/
├── actions.ts
├── reducers.ts
├── effects.ts
└── selectors.ts
```

### 🔄 State Normalization

```typescript
// ✅ Good: normalized state
interface TasksState {
  entities: { [id: string]: Task };
  ids: string[];
  loading: boolean;
  error: string | null;
}

// ❌ Bad: array-based state
interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}
```

### 🧪 Error Handling

```typescript
// ✅ Good: typed error handling
loginFailure$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loginFailure),
    tap(({ error }) => {
      if (error.status === 401) {
        this.toastService.show('Invalid credentials', 'error');
      } else if (error.status >= 500) {
        this.toastService.show('Server error', 'error');
      } else {
        this.toastService.show('Login failed', 'error');
      }
    }),
  ),
);

// ❌ Bad: generic error handling
loginFailure$ = createEffect(() =>
  this.actions$.pipe(
    ofType(AuthActions.loginFailure),
    tap(() => this.toastService.show('Error', 'error')),
  ),
);
```

---

## 🧪 Testing

### 🎯 Unit Testing Effects

```typescript
import { vi } from 'vitest';
   
   describe('AuthEffects', () => {
     let actions: Observable<any>;
     let effects: AuthEffects;
     let authService: MockInstance;
   
     beforeEach(() => {
       authService = {
         login: vi.fn(),
         broadcastLogin: vi.fn(),
       };
   
       TestBed.configureTestingModule({
         providers: [
           AuthEffects,
           provideMockActions(() => actions),
           { provide: AuthService, useValue: authService },
         ],
       });
   
       effects = TestBed.inject(AuthEffects);
     });
   
     it('should login successfully', (done) => {
       const mockUser = { id: '1', email: 'test@test.com' };
       const action = AuthActions.login({ request: { email: 'test@test.com', password: 'pass' } });
       
       authService.login.mockReturnValue(of(mockUser));
       actions = of(action);
   
       effects.login$.subscribe((result) => {
         expect(result).toEqual(AuthActions.loginSuccess({ user: mockUser }));
         done();
       });
     });
   });
```

### 🧪 Testing Reducers

```typescript
describe('AuthReducer', () => {
  it('should handle login success', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };
    const action = AuthActions.loginSuccess({ user });
    const result = authReducer(initialState, action);

    expect(result).toEqual({
      user,
      isLoading: false,
      isAuthenticated: true,
      error: null,
    });
  });

  it('should handle login failure', () => {
    const error = { status: 401, error: { detail: 'Invalid credentials' } };
    const action = AuthActions.loginFailure({ error });
    const result = authReducer(initialState, action);

    expect(result).toEqual({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error,
    });
  });
});
```

### 🧪 Testing Selectors

```typescript
describe('AuthSelectors', () => {
  it('should select user', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };
    const state: AppState = { auth: { ...initialState, user } };

    expect(selectUser.projector(state.auth)).toBe(user);
  });

  it('should select isAuthenticated based on user presence', () => {
    const user = { id: '1', email: 'test@test.com', name: 'Test User' };

    expect(selectIsAuthenticated.projector({ ...initialState, user })).toBe(true);
    expect(selectIsAuthenticated.projector(initialState)).toBe(false);
  });
});
```

---

## 🧪 Vitest-Specific Testing

### Setup
```typescript
// vitest.config.ts already configured
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

### Testing Effects с Vitest
```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

describe('AuthEffects (Vitest)', () => {
  let actions$: Observable<any>;
  let effects: AuthEffects;
  let authService: any;

  beforeEach(() => {
    authService = {
      login: vi.fn(),
      broadcastLogin: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        { provide: AuthService, useValue: authService },
      ],
    });

    effects = TestBed.inject(AuthEffects);
  });

  it('should handle login success', (done) => {
    const user = { id: '1', email: 'test@test.com' };
    authService.login.mockReturnValue(of(user));
    
    actions$ = of(AuthActions.login({ request: { email: 'test', password: 'pass' } }));

    effects.login$.subscribe(action => {
      expect(action).toEqual(AuthActions.loginSuccess({ user }));
      expect(authService.login).toHaveBeenCalled();
      done();
    });
  });
});
```

### Testing Signals
```typescript
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

describe('Component with Signals', () => {
  it('should update signal value', () => {
    const component = TestBed.createComponent(MyComponent).componentInstance;
    
    // Чтение signal
    expect(component.mySignal()).toBe(initialValue);
    
    // Обновление signal
    component.mySignal.set(newValue);
    expect(component.mySignal()).toBe(newValue);
  });
  
  it('should compute values correctly', () => {
    const component = TestBed.createComponent(MyComponent).componentInstance;
    
    component.inputSignal.set(5);
    // computed автоматически пересчитывается
    expect(component.computedValue()).toBe(10);
  });
});
```

---

## 🐛 Debugging

### 🛠️ Redux DevTools Integration

Автоматически настраивается через NgRx Store DevTools:

```typescript
// app.config.ts
provideStore({
  [authFeatureKey]: authReducer,
}),
provideStoreDevtools({
  maxAge: 25,
  logOnly: !isDevMode(),
  trace: true,
  traceLimit: 75,
}),
```

### 📊 State Inspection

```typescript
// В компоненте для debugging
export class DebugComponent {
  authState = this.store.selectSignal(selectAuthState);

  constructor(private store: Store) {
    // Console logging для debugging
    effect(() => {
      console.log('Auth state changed:', this.authState());
    });
  }
}
```

### 🔍 Action Logging

```typescript
// Custom meta reducer для logging
export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.group(`Action: ${action.type}`);
    console.log('Previous State:', state);
    console.log('Action:', action);
    const nextState = reducer(state, action);
    console.log('Next State:', nextState);
    console.groupEnd();
    return nextState;
  };
}

// В app.config.ts
provideStore(
  {
    [authFeatureKey]: authReducer,
  },
  { metaReducers: !isDevMode() ? [] : [debug] },
);
```

---

## 📚 Дополнительные ресурсы

- [Components Guide](./components-guide.md) - Компоненты использующие state
- [Architecture Rules](./arch-rules.md) - Правила для state management
- [Usage Guide](../usage.md) - Практические примеры
- [NgRx Documentation](https://ngrx.io/guide/store) - Официальная документация

---

## 🎯 Ключевые выводы

1. **NgRx для глобального состояния**, Signals для локального
2. **Immutability и pure functions** в reducers
3. **Effects для side effects** - HTTP, навигация, уведомления
4. **Typed selectors** для type-safe доступа к данным
5. **Comprehensive testing** для reliability
6. **Redux DevTools** для productive debugging

**Помните:** Хороший state management делает приложение предсказуемым, отлаживаемым и масштабируемым! 🚀
