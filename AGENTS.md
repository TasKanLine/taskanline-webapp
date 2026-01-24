# Repository Guidelines

## Project Structure & Module Organization
- `src/app/` holds Angular code, split into `core/` (singletons), `features/` (domain pages), `shared/` (dumb UI), and `layout/` (wrappers). Use absolute imports like `@core/...`.
- `src/environments/` contains environment configs. Entry points live in `src/main.ts` and `src/index.html`.
- Static assets live in `public/`. Build output goes to `dist/`.
- Tests are colocated as `*.spec.ts` files (e.g., `src/app/features/login/login.spec.ts`).

## Build, Test, and Development Commands
- `bun run s` (or `npm run s`): start dev server.
- `bun run build`: production build.
- `bun run watch`: rebuild on file changes.
- `bun test` (Vitest runner): run unit tests.
- `bun run lint` / `bun run lint:fix`: lint and auto-fix issues.
- `bun run prettier`: format the codebase.

## Coding Style & Naming Conventions
- TypeScript strict mode; 2-space indentation; Prettier defaults (semi, single quotes, print width 100).
- Standalone components only, `ChangeDetectionStrategy.OnPush` required, DI via `inject()`.
- Signals for local state and inputs (`input()`/`output()`), NgRx for global state.
- Use Tailwind 4 utilities; SCSS only for exceptions.
- Naming: `user-profile.component.ts`, class `UserProfileComponent`, selector `app-user-profile`.

## Testing Guidelines
- Framework: Vitest + Angular TestBed. Prefer `describe/it` from Vitest.
- Keep tests colocated with source; use `*.spec.ts` naming.
- Run focused tests with `bun test -- src/app/features/login/login.spec.ts`.

## Commit & Pull Request Guidelines
- Conventional Commits: `feat(auth): add login form`.
- Before PR: `bun run lint`, `bun test`, `bun run build`.
- PRs should include a clear description, linked issues, and screenshots for UI changes.

## Agent-Specific Instructions
- Read `docs/ai-context/active-context.md` first.
- Follow `docs/ai-context/system-patterns.md` for strict Angular, state, and styling rules.
- Use `docs/architecture/file-structure.md` to place new files correctly.
