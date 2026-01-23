# 🏗 File Structure & Modules

## High-Level Overview

```text
src/app/
├── core/               # SINGLETONS. Services loaded once (root).
├── features/           # SMART COMPONENTS. Domain logic.
├── shared/             # DUMB COMPONENTS. Reusable UI, Pipes, Directives.
└── layout/             # SCAFFOLDING. Header, Sidebar, Main Layout.
```

## Detailed Breakdown

### 1. Core (`@core`)
Contains logic that must be singletons. **NEVER** import feature modules here to avoid circular dependencies.

- **`auth/`**: Authentication logic.
    - `store/`: NgRx state for user session.
    - `guards/`: Route protection (`authGuard`).
    - `interceptors/`: Token injection.
    - `services/`: API communication for auth.
- **`services/`**: Global services.
    - `theme.service.ts`: Dark/Light mode.
    - `toast.service.ts`: Notifications.

### 2. Features (`@features`)
Business logic partitioned by domain. Each feature is usually a lazy-loaded route.

- **`home/`**: Landing page / Dashboard.
- **`login/`**, **`signup/`**: Auth pages.
- **`profile/`**: User settings.
- **`errors/`**: 404, 500 pages.

### 3. Shared (`@shared`)
Reusable elements used across features.

- **`ui/`**: Atomic components (Buttons, Inputs, Cards).
    - *Rule*: No business logic here. Just Inputs/Outputs.
- **`utils/`**: Helper functions.

### 4. Layout (`@layout`)
Structural components that wrap features.
- `MainLayout`, `AuthLayout`.
