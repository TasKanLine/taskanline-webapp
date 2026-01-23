# 📊 Архитектурные диаграммы TasKanLine Client

Визуализация архитектуры, потоков данных и взаимодействий в TasKanLine Client. Все диаграммы используют Mermaid синтаксис для легкой интеграции с документацией.

---

## 📋 Оглавление

- [Общая архитектура](#-общая-архитектура)
- [Component Hierarchy](#-component-hierarchy)
- [Authentication Flow](#-authentication-flow)
- [State Management Flow](#-state-management-flow)
- [HTTP Request Flow](#-http-request-flow)
- [Navigation & Routing](#-navigation--routing)
- [Error Handling Flow](#-error-handling-flow)
- [Cross-tab Communication](#-cross-tab-communication)
- [Theme Management Flow](#-theme-management-flow)

---

## 🏗️ Общая архитектура

Высокоуровневая диаграмма всей системы с основными слоями и их взаимодействиями.

```mermaid
graph TB
    subgraph "Presentation Layer"
        App[App Component]
        Features[Feature Components]
        SharedUI[Shared UI Components]
    end

    subgraph "Business Logic Layer"
        Router[Angular Router]
        Guards[Route Guards]
        Store[NgRx Store]
        Effects[NgRx Effects]
    end

    subgraph "Service Layer"
        CoreServices[Core Services]
        AuthServices[Auth Service]
        ThemeService[Theme Service]
        ToastService[Toast Service]
    end

    subgraph "Data Access Layer"
        Interceptors[HTTP Interceptors]
        HttpClient[HTTP Client]
    end

    subgraph "External Systems"
        Backend[Backend API]
        BroadcastChannel[BroadcastChannel API]
        LocalStorage[Local Storage]
    end

    App --> Router
    App --> Features
    App --> SharedUI

    Features --> Store
    Features --> Guards
    Features --> CoreServices

    Router --> Guards
    Store --> Effects
    Effects --> CoreServices
    CoreServices --> Interceptors
    Interceptors --> HttpClient

    HttpClient --> Backend
    CoreServices --> LocalStorage
    AuthServices --> BroadcastChannel

    ThemeService -.-> Features
    ToastService -.-> Features

    style Features fill:#e8f5e8
    style Store fill:#e1f5fe
    style CoreServices fill:#f3e5f5
    style Backend fill:#fff3e0
```

### 📦 Пакетная архитектура

```mermaid
graph TD
    subgraph core ["@core"]
        AuthService[Auth Service]
        ThemeSvc[Theme Service]
        ToastSvc[Toast Service]
        AuthGuard[Auth Guard]
        AuthInterceptor[Auth Interceptor]
    end

    subgraph shared ["@shared"]
        Button[Button Component]
        ThemeSwitcher[Theme Switcher]
        Toast[Toast Component]
    end

    subgraph features ["@features"]
        Login[Login Feature]
        Signup[Signup Feature]
        Home[Home Feature]
        Profile[Profile Feature]
        Reference[Reference Feature]
        Errors[Error Pages]
    end

    subgraph ngrx ["NgRx Store"]
        AuthStore[Auth Slice]
        AuthActions[Auth Actions]
        AuthEffects[Auth Effects]
    end

    Login --> AuthService
    Login --> Button
    Login --> AuthGuard

    Profile --> AuthGuard
    Profile --> Button

    Signup --> AuthService
    Signup --> Button

    Home --> ThemeSwitcher
    Home --> Button

    AuthStore --> AuthActions
    AuthStore --> AuthEffects
    AuthEffects --> AuthService

    style core fill:#e1f5fe
    style shared fill:#f3e5f5
    style features fill:#e8f5e8
```

---

## 🧩 Component Hierarchy

Иерархия компонентов и их отношения наследования/композиции.

```mermaid
graph TD
    subgraph "Root Level"
        AppRoot[App Component]
    end

    subgraph "Layout Components"
        MainLayout[Main Layout]
        Header[Header]
        Footer[Footer]
        Content[Content Area]
    end

    subgraph "Feature Components"
        Login[Login Component]
        Signup[Signup Component]
        Home[Home Component]
        Profile[Profile Component]
        Reference[Reference Component]
        NotFound[404 Component]
        Forbidden[403 Component]
        ServerError[500 Component]
    end

    subgraph "Shared UI Components"
        Button[Button Component]
        ThemeSwitcher[Theme Switcher]
        Toast[Toast Component]
        FormInput[Form Input]
    end

    AppRoot --> MainLayout
    MainLayout --> Header
    MainLayout --> Content
    MainLayout --> Footer

    Header --> ThemeSwitcher

    Content --> Login
    Content --> Signup
    Content --> Home
    Content --> Profile
    Content --> Reference
    Content --> NotFound
    Content --> Forbidden
    Content --> ServerError

    Login --> Button
    Login --> FormInput
    Signup --> Button
    Signup --> FormInput
    Home --> Button
    Profile --> Button
    Reference --> Button

    AppRoot --> Toast

    style AppRoot fill:#ff9999
    style Header fill:#99ccff
    style Content fill:#99ff99
    style Button fill:#ffcc99
```

---

## 🔐 Authentication Flow

Полный поток аутентификации от пользователя до backend и обратно.

```mermaid
sequenceDiagram
    participant User
    participant LoginComponent as Login Component
    participant Store as NgRx Store
    participant LoginEffect as Auth Effect
    participant AuthService as Auth Service
    participant AuthInterceptor as Auth Interceptor
    participant Backend as Backend API
    participant BroadcastChannel as BroadcastChannel
    participant OtherTabs as Other Tabs
    participant Router as Router
    participant Toast as Toast Service

    User->>LoginComponent: Ввод credentials
    LoginComponent->>LoginComponent: Валидация формы
    LoginComponent->>Store: dispatch(Login(request))

    Store->>LoginEffect: trigger loginEffect
    LoginEffect->>AuthService: authService.login(request)

    AuthService->>AuthInterceptor: HTTP POST /auth/login
    AuthInterceptor->>AuthInterceptor: Add auth headers
    AuthInterceptor->>Backend: Request with cookies

    Backend-->>AuthInterceptor: Response + HttpOnly cookie
    AuthInterceptor-->>AuthService: User data
    AuthService-->>LoginEffect: Observable<User>
    LoginEffect->>Store: dispatch(LoginSuccess(user))

    opt Cross-tab sync
        LoginEffect->>BroadcastChannel: broadcastLogin(user)
        BroadcastChannel-->>OtherTabs: login message
    end
    opt User feedback
        LoginEffect->>Toast: show('Login successful')
        LoginEffect->>Router: navigate('/profile')
    end
    opt Additional data
        LoginEffect->>Store: dispatch(CheckAuth())
    end


    Store-->>LoginComponent: user signal updated
    Router-->>User: Redirect to profile
    Toast-->>User: Success notification
```

### Cross-tab Authentication Sync

```mermaid
sequenceDiagram
    participant Tab1 as Primary Tab
    participant Store1 as Store Tab 1
    participant BroadcastChannel as BroadcastChannel
    participant Tab2 as Secondary Tab
    participant Store2 as Store Tab 2
    participant Effects2 as Effects Tab 2

    Note over Tab1,Tab2: Initial state: user logged in Tab 1

    Tab1->>Store1: dispatch(LoginSuccess)
    Effects1->>BroadcastChannel: broadcastLogin(user)

    BroadcastChannel-->>Tab2: login message
    Tab2->>Store2: dispatch(LoginSync)

    Store2->>Effects2: trigger loginSyncEffect
    Effects2->>Tab2: navigate('/profile')

    Note over Tab1,Tab2: Both tabs now synchronized
```

---

## 🔄 State Management Flow

Поток данных через NgRx Store и Signals в компонентах.

```mermaid
graph LR
    subgraph "UI Layer"
        UI[Component Template]
        Component[Component Class]
    end

    subgraph "NgRx Store"
        Actions[Actions]
        Reducer[Reducer]
        State[State]
        Selectors[Selectors]
        Effects[Effects]
    end

    subgraph "Services"
        AuthService[Auth Service]
        OtherServices[Other Services]
        ToastService[Toast Service]
        Router[Router]
    end

    subgraph "External"
        API[Backend API]
        Storage[Local Storage]
    end

    UI -.-> Component
    Component --> Actions
    Actions --> Effects
    Effects --> AuthService
    AuthService --> API
    API -->> AuthService
    AuthService --> Effects
    Effects --> Actions
    Actions --> Reducer
    Reducer --> State
    State --> Selectors
    Selectors --> Component
    Component --> UI

    Effects --> ToastService
    Effects --> Router
    Effects --> Storage

    style UI fill:#ffebcc
    style Actions fill:#ccf2ff
    style Effects fill:#ccffcc
    style API fill:#ffcccc
```

### State Update Timeline

```mermaid
gantt
    title NgRx State Update Timeline
    dateFormat X
    axisFormat %s

    section User Action
    Form Submit :0, 1

    section Store Actions
    Login Action :1, 2
    Login Effect :2, 4
    HTTP Request :4, 6
    Login Success :6, 7
    State Update :7, 8

    sideEffects :8, 10

    section UI Updates
    Loading State :1, 8
    Success State :8, 10
    Navigation :8, 9
    Toast Notification :8, 10
```

---

## 🌐 HTTP Request Flow

Полный цикл HTTP запроса через interceptors и обработку ответов.

```mermaid
sequenceDiagram
    participant Component
    participant Service
    participant AuthInterceptor as Auth Interceptor
    participant ErrorInterceptor as Error Interceptor
    participant HttpClient
    participant BackendAPI as Backend API

    Component->>Service: businessMethod()
    Service->>HttpClient: http.get('/api/data')

    HttpClient->>AuthInterceptor: Intercept Request
    AuthInterceptor->>AuthInterceptor: Add Authorization header
    AuthInterceptor->>AuthInterceptor: Add withCredentials
    AuthInterceptor->>ErrorInterceptor: Request with auth

    ErrorInterceptor->>BackendAPI: HTTP Request
    BackendAPI-->>ErrorInterceptor: HTTP Response

    alt Success Response (200-299)
        ErrorInterceptor->>ErrorInterceptor: Check for errors
        ErrorInterceptor-->>HttpClient: Response
        HttpClient-->>Service: Observable<T>
        Service-->>Component: Observable<T>
    else Client Error (400-499)
        ErrorInterceptor->>ErrorInterceptor: Handle client error
        alt 401 Unauthorized
            ErrorInterceptor->>Router: navigate('/login')
        else 403 Forbidden
            ErrorInterceptor->>Router: navigate('/error/403')
        else Validation Error
            ErrorInterceptor-->>Component: Error data
        end
        ErrorInterceptor->>ToastService: showError(error)
    else Server Error (500-599)
        ErrorInterceptor->>ErrorInterceptor: Handle server error
        ErrorInterceptor->>Router: navigate('/error/500')
        ErrorInterceptor->>ToastService: showError('Server error')
    end
```

### Interceptor Chain

```mermaid
graph TD
    Request[HTTP Request] --> AuthInterceptor[Auth Interceptor]
    AuthInterceptor --> ErrorInterceptor[Error Interceptor]
    ErrorInterceptor --> HttpClient[HTTP Client]
    HttpClient --> Backend[Backend API]

    Backend --> ErrorInterceptor
    ErrorInterceptor --> AuthInterceptor
    AuthInterceptor --> Response[HTTP Response]

    subgraph "Auth Interceptor Logic"
        CheckToken{Has token?}
        CheckToken -->|Yes| AddHeader[Add Authorization header]
        CheckToken -->|No| PassThrough[Pass request through]
        AddHeader --> PassThrough
    end

    subgraph "Error Interceptor Logic"
        CheckStatus{HTTP Status?}
        CheckStatus -->|401| Handle401[Handle unauthorized]
        CheckStatus -->|403| Handle403[Handle forbidden]
        CheckStatus -->|500| Handle500[Handle server error]
        CheckStatus -->|Other| PassResponse[Pass response through]
    end
```

---

## 🔔 Toast Notifications Flow

Как работают уведомления от создания до отображения и удаления.

```mermaid
sequenceDiagram
    participant Component
    participant ToastService
    participant ToastSignal as toasts signal
    participant ToastComponent
    participant User

    Component->>ToastService: show('Success!', 'success', 3000)
    ToastService->>ToastService: Generate unique ID
    ToastService->>ToastSignal: Add toast to array
    ToastSignal-->>ToastComponent: Signal update
    ToastComponent-->>User: Display toast

    Note over ToastComponent: Auto-remove after 3s
    
    alt User clicks close
        User->>ToastComponent: Click close button
        ToastComponent->>ToastService: remove(id)
    else Timeout expires
        ToastComponent->>ToastComponent: Wait duration
        ToastComponent->>ToastService: remove(id)
    end

    ToastService->>ToastSignal: Remove toast from array
    ToastSignal-->>ToastComponent: Signal update
    ToastComponent-->>User: Toast disappears
```

## 🎯 Signals Integration Pattern

Как Signals интегрируются с NgRx Store в компонентах.

```mermaid
graph TB
    subgraph "Component"
        Template[Template HTML]
        ComponentClass[Component Class]
        
        subgraph "Signals"
            LocalSignal[Local Signals<br/>signal/computed]
            StoreSignal[Store Signals<br/>selectSignal]
        end
    end

    subgraph "NgRx Store"
        Store[Store State]
        Selectors[Selectors]
        Actions[Actions]
    end

    subgraph "Services"
        ServiceSignals[Service Signals]
    end

    Template -.reads.-> LocalSignal
    Template -.reads.-> StoreSignal
    
    ComponentClass --> LocalSignal
    ComponentClass --> StoreSignal
    ComponentClass --> Actions
    
    StoreSignal -.subscribes.-> Selectors
    Selectors -.-> Store
    Actions --> Store
    
    ServiceSignals -.-> ComponentClass
    
    style LocalSignal fill:#ffeb3b
    style StoreSignal fill:#4caf50
    style Store fill:#2196f3
```

---

## 🛣️ Navigation & Routing

Маршрутизация приложения и защита роутов с помощью guards.

```mermaid
graph TD
    Start[/] --> CheckAuth{Check Auth}

    CheckAuth -->|Authenticated| Home[Home Page]
    CheckAuth -->|Not Authenticated| GuestHome[Public Home]

    GuestHome --> LoginPath[/login]
    GuestHome --> SignupPath[/signup]

    LoginPath --> GuestGuard{Guest Guard}
    GuestGuard -->|Guest| LoginComp[Login Component]
    GuestGuard -->|Authenticated| RedirectHome[Redirect to /]

    SignupPath --> GuestGuard
    GuestGuard -->|Guest| SignupComp[Signup Component]

    AuthenticatedRoutes[Authenticated Routes] --> AuthGuard{Auth Guard}
    AuthGuard -->|Authenticated| Profile[/profile]
    AuthGuard -->|Not Authenticated| RedirectLogin[Redirect to /login]

    Profile --> ProfileComp[Profile Component]

    ErrorRoutes[Error Routes] --> NotFound[** → 404]
    ErrorRoutes --> Forbidden[/error/403]
    ErrorRoutes --> ServerError[/error/500]

    NotFound --> NotFoundComp[404 Component]
    Forbidden --> ForbiddenComp[403 Component]
    ServerError --> ServerErrorComp[500 Component]

    style CheckAuth fill:#ffeb3b
    style GuestGuard fill:#4caf50
    style AuthGuard fill:#f44336
    style ErrorRoutes fill:#ff9800
```

### Guard Decision Flow

```mermaid
flowchart TD
    RouteAccess[Route Access Request] --> CheckLoading{Is Loading?}
    CheckLoading -->|Yes| WaitForLoading[Wait for auth check]
    CheckLoading -->|No| CheckAuth{Is Authenticated?}

    CheckAuth -->|Yes| CheckRouteType{Route Type?}
    CheckAuth -->|No| CheckIfGuest{Guest Only Route?}

    CheckIfGuest -->|Yes| AllowAccess[Allow Access]
    CheckIfGuest -->|No| RedirectToLogin[Redirect to /login]

    CheckRouteType -->|Authenticated Only| AllowAccess
    CheckRouteType -->|Public| AllowAccess
    CheckRouteType -->|Guest Only| RedirectToHome[Redirect to /]

    WaitForLoading --> CheckAuth

    AllowAccess --> Success[Route Activated]
    RedirectToLogin --> Fail[Route Blocked]
    RedirectToHome --> Fail

    style AllowAccess fill:#4caf50
    style Fail fill:#f44336
    style Success fill:#2196f3
```

---

## ⚠️ Error Handling Flow

Обработка ошибок на разных уровнях приложения.

```mermaid
graph TB
    subgraph "Error Sources"
        ValidationError[Form Validation]
        HTTPError[HTTP Errors]
        JSRuntimeError[Runtime Errors]
        AuthError[Auth Errors]
    end

    subgraph "Component Level"
        TryCatch[Try-Catch Blocks]
        ErrorHandlers[Error Handlers]
        ValidationErrors[Validation Messages]
    end

    subgraph "Global Level"
        ErrorInterceptor[Error Interceptor]
        ErrorHandler[Global Error Handler]
        ToastService[Toast Service]
    end

    subgraph "User Interface"
        FormMessages[Form Error Messages]
        ToastNotifications[Toast Notifications]
        ErrorPages[Error Pages]
    end

    ValidationError --> TryCatch
    HTTPError --> ErrorInterceptor
    JSRuntimeError --> ErrorHandler
    AuthError --> ErrorInterceptor

    TryCatch --> ValidationErrors
    ErrorInterceptor --> ToastService
    ErrorHandler --> ToastService

    ValidationErrors --> FormMessages
    ToastService --> ToastNotifications
    ErrorInterceptor --> ErrorPages

    style ValidationError fill:#ffcccb
    style HTTPError fill:#ffcccb
    style JSRuntimeError fill:#ffcccb
    style AuthError fill:#ffcccb
    style ToastNotifications fill:#90ee90
    style ErrorPages fill:#87ceeb
```

### Error Classification

```mermaid
flowchart LR
    Error[Error Occurs] --> Classify{Error Type?}

    Classify -->|4xx Client Error| ClientError[Client Error]
    Classify -->|5xx Server Error| ServerError[Server Error]
    Classify -->|Network Error| NetworkError[Network Error]
    Classify -->|Validation Error| ValidationError[Validation Error]
    Classify -->|Unknown Error| UnknownError[Unknown Error]

    ClientError --> ClientAction{Specific Action?}
    ClientAction -->|401| Unauthorized[Redirect to Login]
    ClientAction -->|403| Forbidden[Forbidden Page]
    ClientAction -->|404| NotFound[Not Found Page]
    ClientAction -->|Other| ClientToast[Toast Notification]

    ServerError --> ServerToast[Toast: Server Error]
    NetworkError --> NetworkToast[Toast: Network Error]
    ValidationError --> FormError[Form Field Errors]
    UnknownError --> GenericToast[Generic Error Toast]

    Unauthorized --> ToastMsg[Toast: Please login]
    Forbidden --> ForbiddenPage[Forbidden Page]
    NotFound --> NotFoundPage[Not Found Page]

    style ClientError fill:#ff9800
    style ServerError fill:#f44336
    style NetworkError fill:#9c27b0
    style ValidationError fill:#4caf50
    style UnknownError fill:#607d8b
```

---

## 📡 Cross-tab Communication

Синхронизация состояния между вкладками браузера через BroadcastChannel.

```mermaid
sequenceDiagram
    participant Tab1 as Tab 1
    participant Store1 as NgRx Store 1
    participant Effects1 as Auth Effects 1
    participant AuthService as Auth Service
    participant BroadcastChannel as BroadcastChannel API
    participant Tab2 as Tab 2
    participant Store2 as NgRx Store 2
    participant Effects2 as Auth Effects 2
    participant Component2 as Component Tab 2

    Note over Tab1,Tab2: Initial state: User logs in on Tab 1

    Tab1->>Store1: dispatch(Login)
    Store1->>Effects1: trigger loginEffect
    Effects1->>AuthService: login()
    AuthService-->>Effects1: success response
    Effects1->>Store1: dispatch(LoginSuccess)
    Effects1->>BroadcastChannel: postMessage({type: 'login', payload: user})

    BroadcastChannel-->>Tab2: message event
    Tab2->>Store2: dispatch(LoginSync)
    Store2->>Effects2: trigger loginSyncEffect
    Effects2->>Component2: navigate('/profile')

    Note over Tab1,Tab2: User logs out from Tab 1

    Tab1->>Store1: dispatch(Logout)
    Effects1->>AuthService: logout()
    Effects1->>BroadcastChannel: postMessage({type: 'logout'})

    BroadcastChannel-->>Tab2: logout message
    Tab2->>Store2: dispatch(LogoutSuccess)
    Effects2->>Component2: navigate('/login')
```

### BroadcastChannel Message Flow

```mermaid
stateDiagram-v2
    [*] --> Listening: Start listening

    Listening --> ReceivedMessage: Message received
    ReceivedMessage --> CheckType{Message type?}

    CheckType --> login: 'login'
    CheckType --> logout: 'logout'
    CheckType --> Listening: Unknown type

    login --> DispatchLoginSync: dispatch(LoginSync)
    DispatchLoginSync --> NavigateUser: Navigate to profile
    NavigateUser --> Listening

    logout --> DispatchLogout: dispatch(LogoutSuccess)
    DispatchLogout --> NavigateLogin: Navigate to login
    NavigateLogin --> Listening

    Listening --> Error: Error occurs
    Error --> Listening: Resume listening
```

---

## 🎨 Theme Management Flow

Управление темами приложения и синхронизация между вкладками.

```mermaid
graph TB
    subgraph "Theme Sources"
        SystemPreference[System Preference]
        SavedTheme[Saved Theme]
        UserAction[User Action]
    end

    subgraph "Theme Service"
        InitTheme[initTheme()]
        ToggleTheme[toggleTheme()]
        ApplyTheme[applyTheme()]
        ThemeSignal[currentTheme signal]
    end

    subgraph "Theme Application"
        CSSClasses[CSS Classes]
        DOMAttribute[HTML Attribute]
        ComponentReactions[Component Reactions]
    end

    subgraph "Storage"
        LocalStorage[Local Storage]
        SystemMediaQuery[Prefers-color-scheme]
    end

    SystemPreference --> InitTheme
    SavedTheme --> InitTheme
    UserAction --> ToggleTheme

    InitTheme --> ThemeSignal
    ToggleTheme --> ThemeSignal
    ThemeSignal --> ApplyTheme

    ApplyTheme --> LocalStorage
    ApplyTheme --> CSSClasses
    ApplyTheme --> DOMAttribute

    CSSClasses --> ComponentReactions
    DOMAttribute --> ComponentReactions

    ComponentReactions --> UIUpdate[UI Updates]

    style ThemeSignal fill:#ffeb3b
    style ComponentReactions fill:#4caf50
    style UIUpdate fill:#2196f3
```

### Theme State Machine

```mermaid
stateDiagram-v2
    [*] --> Init: Service created

    Init --> CheckSystem{System prefers dark?}
    CheckSystem -->|Yes| Dark: Set dark theme
    CheckSystem -->|No| Light: Set light theme

    Light --> UserToggle: User clicks toggle
    Dark --> UserToggle: User clicks toggle

    UserToggle --> Light: Switch to light
    UserToggle --> Dark: Switch to dark

    Light --> ApplyLight: Apply light theme
    Dark --> ApplyDark: Apply dark theme

    ApplyLight --> SaveLight: Save to localStorage
    ApplyDark --> SaveDark: Save to localStorage

    SaveLight --> Light: Stable state
    SaveDark --> Dark: Stable state
```

---

## 🎯 Usage Instructions

### Включение диаграмм в документацию

````markdown
```mermaid
<!-- Код диаграммы -->
```
````

```

### Советы по созданию новых диаграмм

1. **Используйте последовательные диаграммы** для flow процессов
2. **Используйте graph диаграммы** для архитектурных представлений
3. **Используйте state diagrams** для состояний и переходов
4. **Используйте gantt charts** для временных линий
5. **Сохраняйте читаемость** - не перегружайте деталями
6. **Используйте цвета** для визуального разделения слоев
7. **Добавляйте комментарии** для сложных переходов

### Обновление диаграмм

При изменении архитектуры:
1. Обновите соответствующие диаграммы
2. Проверьте, что все связи актуальны
3. Убедитесь, что цвета соответствуют соглашениям
4. Обновите этот документ при добавлении новых диаграмм

---

## 📚 Связанная документация

- [Architecture Overview](./architecture.md) - Детальное описание архитектуры
- [State Management](./state-management.md) - NgRx и Signals детали
- [Components Guide](./components-guide.md) - Компонентная архитектура
- [Authentication Flow](../usage.md#-аутентификация) - Практическое использование

---

**💡 Совет:** Эти диаграммы - живой документ. Они должны обновляться вместе с изменениями в архитектуре приложения! 🔄
```
