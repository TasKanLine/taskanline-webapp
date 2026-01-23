# 🤖 System Patterns & Code Standards (TasKanLine Client)

> **CRITICAL INSTRUCTION FOR AI:** This is the Single Source of Truth for coding standards in this project. You must STRICTLY adhere to these patterns. Ignore generic Angular knowledge if it conflicts with these rules.

---

## 1. ⚡ Tech Stack & Versioning
* **Runtime:** Bun (Use `bun` for scripts, e.g., `bun run s`, `bun test`).
* **Framework:** Angular 21.1.0+ (Bleeding Edge).
* **Styling:** TailwindCSS 4.1.18 (PostCSS) + SCSS Modules.
* **State:** NgRx 21.0.1 (Global) + Signals (Local).
* **Testing:** Vitest 4.0.17 (NOT Karma/Jasmine).
* **Icons:** Lucide Angular (`lucide-angular`).

---

## 2. 🏗️ Architectural Axioms

### Component Structure
* **Standalone Only:** All components must have `standalone: true`. NgModules are FORBIDDEN.
* **OnPush Mandatory:** `changeDetection: ChangeDetectionStrategy.OnPush` is required for every component.
* **Injection Context:** Use `inject()` for DI. Constructor injection is deprecated in this codebase.
* **Imports:** Use absolute paths (`@core/...`, `@shared/...`, `@features/...`).

### File Organization
```text
src/app/
├── core/       # Global singletons (Auth, Theme, Toasts). NEVER import 'features' here.
├── features/   # Smart components (Login, Profile, Home). Isolated domains.
├── shared/     # Dumb UI components (Buttons, Inputs). NO logic, only Input/Output.
├── layout/     # Structural wrappers.
```

## 3. 💻 Coding Patterns (The "How-To")

### A. Component Definition (Modern Angular)

**❌ OLD / FORBIDDEN:** 

```
@Component({ ... })
export class OldComponent {
  @Input() data: string; // Forbidden
  constructor(private service: MyService) {} // Forbidden
}
```

✅ REQUIRED PATTERN:

```
import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './example.html',
  styleUrl: './example.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // MANDATORY
})
export class ExampleComponent {
  // 1. Dependencies
  private store = inject(Store);
  
  // 2. Inputs (Signal Inputs)
  title = input.required<string>();
  isActive = input<boolean>(false);
  
  // 3. Outputs
  saved = output<void>();
  
  // 4. State
  localCount = signal(0);
  
  // 5. Computeds
  displayTitle = computed(() => `${this.title()} (${this.localCount()})`);
}
```

### B. State Management (Hybrid: NgRx + Signals)

- **Global State:** Use NgRx for data shared across features (Auth, User Profile).
- **Consumption:** Use `store.selectSignal()` to read from store.
- **Local State:** Use `signal()` for UI toggles, form inputs, etc.

**✅ NgRx Consumption Pattern:**

```
export class ProfileComponent {
  private store = inject(Store);
  
  // Selectors as Signals (No Observables in component logic if possible)
  user = this.store.selectSignal(selectUser);
  isLoading = this.store.selectSignal(selectIsLoading);
  
  updateProfile(data: User): void {
    // Dispatch Actions
    this.store.dispatch(AuthActions.updateProfile({ data }));
  }
}
```

### C. Control Flow (Templates)

Use modern Angular Control Flow syntax (`@if`, `@for`, `@switch`).

**❌ FORBIDDEN:** `*ngIf`, `*ngFor` **✅ REQUIRED:**

```
@if (isLoading()) {
  <app-skeleton />
} @else {
  @for (item of items(); track item.id) {
    <app-card [data]="item" />
  } @empty {
    <p>No items found</p>
  }
}
```

## 4. 🎨 Styling & Theming (Tailwind 4)

- **Utility First:** Use Tailwind classes for 90% of styling.
- **SCSS fallback:** Use `component.scss` only for complex animations or pseudo-states not covered by utilities.
- **Dark Mode:** Handled via `html.dark` class. Use `dark:` prefix in Tailwind.
- **Colors:** Flexoki palette variables (e.g., `bg-bg-1`, `text-tx-1`).

**✅ Example:**

```
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg">
  <button appButton>Action</button>
</div>
```

## 5. 🧪 Testing (Vitest)

Tests are mandatory. Use `vi` for mocks.

**✅ Spec Pattern:**

```
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent],
      providers: [
        // Mock Store or Services
        provideMockStore({ initialState: {} })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## 6. 🛡️ Routing & Auth Patterns

- **Guards:** Use functional guards (`CanActivateFn`).    
- **Lazy Loading:** Always use `loadComponent`.

**✅ Route Definition:**

```
{
  path: 'profile',
  loadComponent: () => import('@features/profile/profile').then(m => m.Profile),
  canActivateChild: [authGuard]
}
```

## 7. 🚫 Absolute Prohibitions (Hard Constraints)

1. **NEVER** use `NgModule`.
2. **NEVER** use `ChangeDetectionStrategy.Default`.
3. **NEVER** access `localStorage` directly for auth tokens (handled by `AuthService`/`AuthInterceptor`).
4. **NEVER** style components using broad tag selectors (e.g., `div { ... }`). Use classes.
5. **NEVER** commit without running `bun run lint`.
