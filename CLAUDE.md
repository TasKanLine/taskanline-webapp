# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
bun run s            # Dev server (http://localhost:4200)
bun run build        # Production build
bun run lint         # ESLint check
bun run lint:fix     # ESLint auto-fix
bun run prettier     # Format all files
bun test             # Run all tests (vitest via @angular/build:unit-test)

# Run a single spec file directly with vitest (ng test does not support single-file targeting):
bunx vitest run src/app/path/to/component.spec.ts
```

`angular.json` declares `packageManager: "bun"`. All scripts should be invoked via `bun run` or `bunx`.

---

## Architecture Overview

### Directory layout

```
src/app/
├── core/            # Global singletons. Auth (guards, interceptors, service, NgRx store), ThemeService, ToastService.
│                    # NEVER import from features/ or layout/ here.
├── features/        # Isolated, route-level feature components (login, signup, home, profile, issues, errors, …).
├── shared/          # Reusable presentational UI — button, toast, theme-switcher. No business logic.
├── layout/          # Structural shell: header, sidebar, footer, main-layout.
├── app.ts           # Root component (just <router-outlet> + <app-toast>)
├── app.config.ts    # Provider bootstrap: router, HttpClient + interceptors, NgRx store/effects, APP_INITIALIZER
└── app.routes.ts    # Top-level route tree
```

### Path aliases (tsconfig.app.json)

| Alias        | Maps to                |
|--------------|------------------------|
| `@core/*`    | `src/app/core/*`       |
| `@shared/*`  | `src/app/shared/*`     |
| `@features/*`| `src/app/features/*`   |
| `@layout/*`  | `src/app/layout/*`     |
| `@env/*`     | `src/environments/*`   |

Always use these aliases. Relative imports (`../../../`) are forbidden.

---

## Hard Rules (enforced by ESLint and project convention)

1. **Standalone components only.** No NgModules anywhere.
2. **`ChangeDetectionStrategy.OnPush`** on every component.
3. **`inject()` for DI**, not constructor parameters.
4. **Signals-first reactivity.** Use `signal()` for local state, `computed()` for derived state, `store.selectSignal()` to consume NgRx. Avoid `.subscribe()` in components — prefer `async` pipe or signal selectors.
5. **Modern control flow in templates:** `@if`, `@for`, `@switch`. Do not use `*ngIf` / `*ngFor`.
6. **Signal inputs/outputs:** `input()` / `input.required()` / `output()` instead of `@Input()` / `@Output()`.
7. **No non-null assertions (`!`).** Use optional chaining or null checks.
8. **No `any` types.** Strict TypeScript throughout.
9. **Absolute imports only** (see aliases above).
10. **Auth tokens are never stored in localStorage.** Cookie-based auth via `withCredentials: true` on every request to the API origin; the `authInterceptor` handles this.

---

## State Management

**Hybrid: NgRx (global) + Signals (local).**

- **NgRx** lives in `src/app/core/auth/store/` today (actions, reducer, effects, auto-generated selectors via `createFeature`). New global slices follow the same pattern and get registered in `app.config.ts`.
- **Selectors are consumed as signals** in components: `this.store.selectSignal(selectUser)`.
- **Effects** own all side-effects: HTTP calls, navigation, toasts, cross-tab sync (via `BroadcastChannel`).
- **Local UI state** (form values, toggles, open/closed) lives in component `signal()`s.

---

## Authentication & HTTP

- `APP_INITIALIZER` dispatches `AuthActions.checkAuth()` on boot → `GET /auth/me`.
- `authInterceptor` clones every request to the API base URL with `withCredentials: true`.
- `errorInterceptor` auto-dispatches logout on 401 (except `/me` and `/login`), navigates to error pages on 403/5xx.
- Route guards (`authGuard`, `guestGuard`) wait for the initial loading flag to settle before allowing navigation.
- Cross-tab auth sync uses `BroadcastChannel('auth_channel')`.

API base URL is `http://localhost:8000/api/v1` in dev (`src/environments/environment.ts`) and `/api/v1` (relative) in production.

---

## Routing

- The public shell (`/`, `/login`, `/signup`) uses eagerly-loaded components with a `guestGuard`.
- Everything authenticated lives under `/home` and uses `loadChildren` → `HOME_ROUTES`. Child routes inside `home.routes.ts` use `loadComponent` for lazy loading.
- Error routes (`/error/403`, `/error/500`, `**`) are lazy-loaded and unguarded.

---

## Styling

- **TailwindCSS 4** (PostCSS plugin) is the primary styling tool. Component `.scss` files are for styles that cannot be expressed with utilities (animations, complex pseudo-states).
- Dark mode is toggled via the `dark` class on `<html>`, managed by `ThemeService` (persists to `localStorage`). Use `dark:` Tailwind variants.
- Theme color tokens are CSS custom properties defined in `src/styles/_variables.scss` and surfaced as Tailwind theme colors in `src/styles.scss` (`@theme { … }`).
- Custom SCSS helpers live in `src/styles/helpers/` — `rem()`, `fluid()`, layout mixins.

---

## Testing

- Test runner: **Vitest** (configured through `@angular/build:unit-test`).
- Every component and service has a co-located `.spec.ts` file.
- Use `vi.fn()` / `vi.mock()` for mocks. Import test utilities from `vitest`, not `jasmine`.
- To run a single file: `bunx vitest run <path>` — do **not** use `ng test` for single-file runs.
- Mock the NgRx store with `provideMockStore({ initialState })` from `@ngrx/store/testing`.

---

## Commit conventions

Conventional commits with scoped prefixes matching the feature directory:

```
feat(home): add calendar view
fix(auth): handle token refresh edge case
refactor(shared): extract icon wrapper
test(sidebar): add keyboard navigation specs
```

---

## When changing architecture

If you add a new NgRx feature slice, a new route group, or a new shared component, update the corresponding files under `docs/architecture/` (architecture.md, components-guide.md, diagrams.md, state-management.md) to keep the project documentation in sync. See `docs/architecture/ai-guidelines.md` for the full checklist.
