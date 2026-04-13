## Cursor Cloud specific instructions

### Project Overview

Angular 21 shopping web app with mock data (no backend required). See `README.md` for full feature list.

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Angular Dev Server | `npm start` | 4200 | Primary service. Uses Vite under the hood. First run may prompt for analytics — disable with `npx ng analytics disable --global`. |
| C++ Backend (optional) | See `cpp-backend/README.md` | 8080 | Not connected to frontend by default. Requires `libstdc++-14-dev` (or equivalent) to build. |

### Key Commands

- **Install deps:** `npm install`
- **Dev server:** `npm start` (port 4200)
- **Build:** `npm run build`
- **Test:** `npm test` (Vitest via Angular CLI; 2 pre-existing test failures due to missing `ActivatedRoute` provider in test setup)
- **Lint/Format check:** `npx prettier --check "src/**/*.{ts,html,css}"`
- **Format fix:** `npx prettier --write "src/**/*.{ts,html,css}"`

### Gotchas

- The Angular CLI analytics prompt blocks `npm start` on first run in a fresh environment. Run `npx ng analytics disable --global` beforehand to avoid it.
- The existing unit tests in `src/app/app.spec.ts` fail because the test setup lacks `ActivatedRoute` provider. This is a pre-existing issue, not caused by environment setup.
- The C++ backend's CMake `FetchContent` for `cpp-httplib` may not wire include paths correctly with all compilers (observed with Clang 18). This is a pre-existing build configuration issue.
- The frontend uses all mock/local data — no network APIs or databases are required.
