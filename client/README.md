## Project Structure

### Frontend

The frontend follows the **Feature-Sliced Design (FSD)** architecture, which organizes the application by business features while keeping shared code centralized.

```
client/
└── src/
    ├── features/      # Business features and their UI, hooks, services, etc.
    ├── shared/        # Shared components, utilities, hooks, API client, constants
    ├── tests/         # Test utilities and global test setup
    ├── App.tsx
    ├── main.tsx
    └── vite-env.d.ts
```

### Folder Responsibilities

| Folder      | Purpose                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------- |
| `features/` | Contains self-contained business features. Each feature owns its components, hooks, API calls, validation, and types.     |
| `shared/`   | Reusable code shared across multiple features, such as UI components, utilities, API client, hooks, constants, and types. |
| `tests/`    | Shared testing utilities, mocks, setup files, and custom render helpers for Vitest.                                       |

### Example Feature

```
features/
└── authentication/
    ├── api/
    ├── components/
    ├── hooks/
    ├── schemas/
    ├── types/
    ├── utils/
    └── index.ts
```

Each feature should be as independent as possible and expose its public API through an `index.ts` file.
