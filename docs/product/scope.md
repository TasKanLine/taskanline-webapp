# 📐 Project Scope & Roadmap

This document defines the boundaries of the TasKanLine Client project. It tells AI agents what to focus on and what to ignore.

## ✅ Phase 1: Foundation (Current Focus)

_Goal: Establish the architecture, auth flow, and basic user identity._
- [x] **Project Setup:** Angular 21, Tailwind 4, Bun, ESLint/Prettier.
- [x] **Architecture:** Standalone components, Core/Features/Shared structure.
- [x] **Authentication:** Login, Signup, JWT handling, Interceptors.
- [x] **User Identity:** Profile page, Theme switching (Dark/Light).
- [x] **Error Handling:** 404, 403, 500 pages, Toast notifications.

## 🚧 Phase 2: Core Task Engine (Next Steps)

_Goal: CRUD operations for tasks and basic listing._
- [ ] **Workspaces:** Create/Edit/Delete workspaces (projects).
- [ ] **Task Model:** Define strict interfaces for Tasks (ID, Title, Status, DueDate, Assignee).
- [ ] **Task Service:** HTTP methods + Signal Store integration.
- [ ] **List View:** Simple vertical list of tasks with checkbox and status.
- [ ] **Task Detail Modal:** View and edit task details without leaving the page.

## 🔮 Phase 3: The "KanLine" Experience

_Goal: The visual differentiators._
- [ ] **Kanban Board:**
    - Drag and Drop (using `@angular/cdk/drag-drop`).
    - Columns map to Statuses.
- [ ] **Timeline View:**
    - Horizontal scrollable view based on dates.
    - Tasks rendered as bars spanning start -> due date.
- [ ] **View Switcher:** Instant toggle between List/Kanban/Timeline.

## 🛑 Out of Scope (Do Not Implement)

- **Mobile Native App:** We are building a PWA/Responsive Web App only.
- **Real-time Chat:** Use Slack/Telegram. Do not build a chat inside the app.
- **Video Calls:** Out of scope.
- **Complex Permissions:** MVP assumes Admin + Member roles only. No custom ACLs.
- **Legacy Browser Support:** We target modern Chrome/Firefox/Safari/Edge.

## 📉 Debt & Refactoring

- **Performance:** Monitor bundle size. Keep initial chunk under 1MB.
- **A11y:** Ensure basic keyboard navigation and screen reader support for form inputs.