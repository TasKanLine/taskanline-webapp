# ⚡ Technical Stack & Versions

**Context for AI:** Do not hallucinate old versions. We are on the bleeding edge.

## Core Framework
- **Framework:** Angular `^21.1.0`
- **Architecture:** Standalone Components (NO NgModules)
- **Reactivity:** Signals (`signal`, `computed`, `effect`, `input`, `output`)
- **Runtime:** Bun (Use `bun` for package management and scripts)

## State Management
- **Global:** NgRx Store `^21.0.1` (Actions, Reducers, Effects, Selectors)
- **Local:** Angular Signals
- **Pattern:** Hybrid (Store for shared data, Signals for component state)

## Styling
- **Engine:** Tailwind CSS `^4.1.18` (PostCSS)
- **Preprocessor:** SCSS (Only for specific component nuances, otherwise Utility-first)
- **Icons:** Lucide Angular `^0.555.0` (Do not use FontAwesome or Material Icons)
- **Font:** IBM Plex Sans (UI) & IBM Plex Serif (Headings)
## Testing
- **Unit Runner:** Vitest `^4.0.17`
- **Environment:** jsdom `^27.4.0`
- **Command:** `bun test` or `bunx vitest run`

## Build & Tooling
- **Bundler:** Angular CLI (Esbuild)
- **Linter:** ESLint `^9.39.2` + angular-eslint
- **Formatter:** Prettier `^3.8.0`
- **Container:** Docker (Multi-stage build)

## Key Libraries
- **Date Handling:** Native `Date` or `date-fns` (if needed later). Avoid Moment.js.
- **Drag & Drop:** `@angular/cdk/drag-drop` (To be added in Phase 3).
