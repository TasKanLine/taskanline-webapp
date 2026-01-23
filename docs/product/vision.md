# 🔭 Product Vision: TasKanLine

*"Where Task Management meets Timeline Flow."*

### 🌟 The Core Concept

TasKanLine is not just a board; it is a **flow**.
Most project management tools force you to choose between a "Bucket" (Kanban) and a "Roadmap" (Timeline). **TasKanLine merges them.**

We aim to build a tool where switching between seeing "What needs to be done" (Kanban) and "When it needs to be done" (Timeline) is instantaneous and fluid.

### 🧠 Design Philosophy

1. **Speed is a Feature**

The UI must be **instant**. We use Angular Signals and optimistic UI updates to ensure the user never waits for a spinner when moving a card. Interaction latency should be near zero.

2. **Clarity over Complexity**

We are not building JIRA. We are avoiding "feature bloat."
- **Simple:** A task has a title, status, and date.
- **Visua**l: Statuses are color-coded (Flexoki palette).
- **Focused**: No complex workflows, sub-sub-tasks, or permission schemes in the MVP.

3. **Native Feel on the Web**

The application should behave like a native desktop/mobile app, not a website.
- No page reloads.
- Smooth transitions between views.
- Keyboard shortcuts for power users.

🎯 **Target Audience**
- **Freelancers & Solopreneurs**: Who need to visualize their deadlines alongside their to-do list.
- **Small Agile Teams**: Who need transparency without the bureaucratic overhead of enterprise tools.

🏗️ **Technical Pillars supporting the Vision**
- **Reactive Core**: The UI is a direct reflection of the state (Signals).
- **Type Safety**: We trust our code because it is strictly typed.
- **Modern Stack**: We don't support legacy browsers. We use the latest web standards.
