# 🔄 Data Flow & State Management

## The Hybrid Approach: NgRx + Signals

We use a **Hybrid State Management** strategy. We do NOT put everything in NgRx.

### 1. Global State (NgRx)
**Use for:** Data shared across multiple features or persistent session data.
- **User Session**: User profile, Auth tokens.
- **App Configuration**: Theme preference, Global settings.
- **Notifications**: Toast messages queue.

**Pattern:**
1.  **Actions**: Define intent (`[Auth] Login Request`).
2.  **Effects**: Handle side effects (API calls).
3.  **Reducers**: Update immutable state.
4.  **Selectors**: Expose state slices.

### 2. Local State (Signals)
**Use for:** Component-specific state that doesn't leave the route.
- **Form State**: Input values, validation status.
- **UI Toggles**: Dropdown open/close, Loading spinners for specific buttons.
- **Computed Data**: Filtering a list based on local input.

**Pattern:**
```typescript
// Define state
searchQuery = signal('');
isLoading = signal(false);

// Derived state
filteredItems = computed(() => 
  this.items().filter(i => i.name.includes(this.searchQuery()))
);
```

### 3. Consumption (The Bridge)
Components consume NgRx state **as Signals**.

```typescript
// BAD (Observables in template)
user$ = this.store.select(selectUser);

// GOOD (Signals)
user = this.store.selectSignal(selectUser);
```
