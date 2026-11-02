# Smart Admin

An admin dashboard template built with **Vue 3 + TypeScript + Pinia + Vue Router + Element Plus + Vite**.

It ships with dynamic routing, permission guards, i18n (vue-i18n), ECharts, rich text editors, theme switching and mock data — a solid foundation for business admin systems.

## Tech Stack

| Category | Technology |
| ---- | ---- |
| Core framework | Vue 3.x (Composition API + `<script setup>`) |
| Language | TypeScript 5.x |
| State management | Pinia 2.x |
| Routing | Vue Router 4.x |
| UI library | Element Plus 2.x |
| Build tool | Vite 8.x |
| HTTP client | Axios |
| i18n | vue-i18n 9.x |
| Charts | ECharts 5.x |
| Rich text | WangEditor / Quill |
| Linting | oxlint + commitlint + husky + lint-staged |
| Testing | Vitest + jsdom + @vue/test-utils |

## Prerequisites

- **Node.js** >= 20 (LTS recommended, required by Vite 8)
- **pnpm** >= 8 (the project ships a `pnpm-lock.yaml`)

```bash
# Install pnpm (skip if already installed)
npm install -g pnpm
```

## Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd test_project_production

# 2. Install dependencies
pnpm install
```

> `pnpm install` runs the `prepare` script to set up husky Git hooks, so please use it inside a Git repository.

### Environment Variables

Adjust the `.env.*` files in the project root as needed:

```bash
# .env.development example
VITE_BASE_URL="http://127.0.0.1"     # site url
VITE_PORT=8083                        # dev server port
VITE_USER_NODE_ENV='development'      # env identifier
VITE_API_URL="http://127.0.0.1:8081"  # backend API url (proxy target of /api)
```

In dev mode, requests prefixed with `/api` are proxied to `VITE_API_URL`, and `/sapi2` to `http://localhost:7001`. See `server.proxy` in `vite.config.ts`.

## Usage

### Commands

| Command | Description |
| ---- | ---- |
| `pnpm run dev` | Start the dev server (opens the browser automatically) |
| `pnpm run build` | Type-check (vue-tsc) + production build |
| `pnpm run builds` | Production build without type-checking |
| `pnpm run build:test` | Start in `test` mode |
| `pnpm run preview` | Preview the production build |
| `pnpm run test` | Run unit tests with Vitest |
| `pnpm run test:util` | Run tests in a jsdom environment |
| `pnpm run test:types` | Run tsd type tests |

### Development

```bash
pnpm run dev
# Browser opens http://localhost:8083 automatically
```

### Build & Preview

```bash
pnpm run build   # output to dist/, chunked by js/css/img, with gzip files
pnpm run preview
```

### Examples

**1. Add a page**

Create it under `src/views/` and register the route in `src/router/`:

```ts
// src/router/index.ts
{
  path: '/example',
  name: 'Example',
  component: () => import('@/views/example/index.vue'),
}
```

**2. Add an API request**

```ts
// src/api/example.ts
import serve from '@/serve'; // axios instance, import as fits your codebase

export const getUserList = (params: object) => {
  return serve.get('/api/user/list', { params });
};
```

**3. Define a Pinia store**

```ts
// src/store/example.ts
import { defineStore } from 'pinia';

export const useExampleStore = defineStore('example', {
  state: () => ({ count: 0 }),
  actions: {
    increment() { this.count++; },
  },
});
```

**4. Use an SVG icon**

Drop an `.svg` file into `src/icons/` and use the globally registered `<SvgIcon>` component:

```vue
<template>
  <SvgIcon name="example" />
</template>
```

**5. Run unit tests**

```bash
# Write *.spec.ts files under src or test, then:
pnpm run test
```

## Contributing

Issues and pull requests are welcome!

1. **Fork** this repository and clone it locally.
2. **Create a feature branch** (avoid committing directly on `dev`):

   ```bash
   git checkout -b feat/your-feature
   ```

3. **Commit your code.** Commits are validated by [commitlint](./commitlint.config.cjs) + husky, in the format `type: description`. Allowed types:

   | type | description |
   | ---- | ---- |
   | `feat` | new feature |
   | `fix` | bug fix |
   | `docs` | documentation |
   | `style` | formatting (no logic change) |
   | `refactor` | refactoring |
   | `test` | tests |
   | `revert` | revert a commit |

   ```bash
   git commit -m "feat: add user management page"
   ```

4. **Push and open a Pull Request**:

   ```bash
   git push origin feat/your-feature
   ```

   Describe what changed, the scope of impact and your local verification. Approved PRs are merged into `dev`.

### Development conventions

- Make sure `pnpm run test` and `pnpm run build` pass before committing;
- Staged files are auto-fixed by lint-staged via `oxlint --fix` on commit;
- Follow the existing code style (`<script setup>` + TypeScript); extract shared logic into `src/hooks/` or `src/utils/`.

## License

[MIT](./LICENSE)
