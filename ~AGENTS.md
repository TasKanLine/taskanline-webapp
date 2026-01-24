# 🤖 AGENTS.md - AI Context Entry Point

> **STOP! READ THIS FIRST.**
> This file is your map to this codebase. Do not guess patterns. Follow the documentation below.

## ⚡ Quick Start (Critical Rules)
1.  **Framework**: Angular 21 (Standalone Components). **NO NgModules**.
2.  **State**: NgRx (Global) + Signals (Local). **ChangeDetectionStrategy.OnPush** is MANDATORY.
3.  **Styling**: TailwindCSS 4 (Utility-first) + SCSS Modules (Rare exceptions).
4.  **Tests**: Vitest. NO Jasmine/Karma.

## 📚 Documentation Index

### 1. 🤖 AI Context (`docs/ai-context/`)
**MUST READ for every task.**
- [👉 **active-context.md**](docs/ai-context/active-context.md) - **WHAT WE ARE DOING RIGHT NOW**. Check this first.
- [system-patterns.md](docs/ai-context/system-patterns.md) - Strict coding rules, boilerplate, and "Do/Don't".
- [tech-stack.md](docs/ai-context/tech-stack.md) - Exact versions of dependencies.

### 2. 🏗 Architecture (`docs/architecture/`)
**Read when creating files or changing logic.**
- [file-structure.md](docs/architecture/file-structure.md) - Where to put your new file (`@core` vs `@feature` vs `@shared`).
- [data-flow.md](docs/architecture/data-flow.md) - How to use NgRx and Signals together.

### 3. 🧠 Product (`docs/product/`)
**Read to understand "Why" and "What".**
- [domain-language.md](docs/product/domain-language.md) - What is a "Lane"? What is a "Task"?
- [vision.md](docs/product/vision.md) - Overall goals.

### 4. 👤 Guides (`docs/guides/`)
Legacy documentation and human-oriented guides (Installation, manual testing).

---

## 🛠 Common Tasks Shortcuts

- **Start Dev Server**: `bun run s`
- **Run Tests**: `bun test`
- **Lint**: `bun run lint`
