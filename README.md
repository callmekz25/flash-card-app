## Project Structure Overview

This project uses a **feature-based (module-based)** architecture.  
Instead of grouping files by type (components, pages, services), features are organized into self-contained modules.  
This makes the project easier to scale, refactor, debug, and maintain.

### Folder Responsibilities

| Folder            | Purpose                                                                                                                               |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| **core**          | Contains global app setup: router configuration, global store, API client, environment variables. No UI here.                         |
| **components/ui** | Reusable presentational UI components (e.g., Button, Input). They do **not** contain business logic.                                  |
| **shared**        | Utilities and hooks that are not tied to any specific feature (e.g., `useDebounce`, `formatDate`).                                    |
| **modules**       | Each module represents a feature or domain (e.g., auth, set, quiz). A module can have its own pages, components, services and routes. |

---

## Routing Concept

Routing is defined **per module** and then combined into a single router.

- Each module exports its own route definitions.
- The `core/router` folder collects these definitions and creates the central router.

---

## Key Principles

- UI that **everyone can reuse** → goes into `components/ui`
- UI that **belongs to a specific feature** → goes into `modules/<feature>/components`
- Business logic **never** goes into `components/ui`
- Each module should be **self-contained** (pages + components + services + routes)
- `core` contains only **infrastructure**, not feature logic

---
