# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Angular 21 shopping web application with an optional C++ backend. The primary product is the Angular frontend — it operates entirely client-side with mock data (no backend required).

### Services

| Service | Port | Command | Required |
|---------|------|---------|----------|
| Angular Frontend | 4200 | `npm start` | Yes |
| C++ Backend | 8080 | See `cpp-backend/README.md` | No (not wired to frontend) |

### Key commands

See `package.json` scripts. Summary:
- **Dev server:** `npm start` (serves on http://localhost:4200)
- **Build:** `npm run build`
- **Tests:** `npm test` (uses Angular's `@angular/build:unit-test` builder with vitest)
- **Format check:** `npx prettier --check "src/**/*.{ts,html,css}"`

### Caveats

- Running `npx vitest run` directly will fail because `describe`/`it` globals aren't defined. Always use `npm test` (i.e. `ng test`) which configures vitest globals through the Angular build system.
- The existing test suite (`src/app/app.spec.ts`) has 2 pre-existing failures due to missing `ActivatedRoute` provider in the test setup — this is not an environment issue.
- The C++ backend (`cpp-backend/`) has a pre-existing CMake target name mismatch (`cpp-httplib` vs `httplib`), which prevents it from compiling. Building the C++ backend also requires `libstdc++-14-dev` to be installed.
- Product images are loaded from `picsum.photos` (external CDN), so they may not render in network-restricted environments.
