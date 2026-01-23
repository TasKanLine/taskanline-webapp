# 🗣 Domain Language (Glossary)

To ensure consistency in naming variables, classes, and database columns.

## Core Entities

### User (`User`)
system actor who can log in and manage tasks.
- **Context**: `auth`, `profile`.

### Task (`Task`)
A unit of work to be tracked.
- **Attributes**: `title`, `description`, `status` (Todo/In Progress/Done), `priority`.

### Lane (`Lane`)
A column in a Kanban board representing a status or stage.
- *Examples*: "Backlog", "In Progress", "Review".

### Board (`Board`) (Future)
A collection of Lanes and Tasks. Currently, the app implies a single personal board per user.

## UI Terms

### Toast
A temporary notification popup (Success/Error).

### Theme
Visual appearance context (Dark/Light).
