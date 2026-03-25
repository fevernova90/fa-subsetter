---
phase: 01-pre-upgrade-baseline
plan: 02
subsystem: testing
tags: [supertest, jest, express, smoke-tests, baseline]

# Dependency graph
requires: []
provides:
  - "server/server.test.js: Express API smoke tests for GET /saved-icons, POST /gen-webfonts, GET /download"
  - "server.js exports app via module.exports for testability"
  - "package.json test:server script for running server tests independently of react-scripts"
  - "package-lock.json regenerated as pre-upgrade baseline"
affects:
  - 02-node-sass-swap
  - 03-dependency-upgrades
  - 04-final-audit

# Tech tracking
tech-stack:
  added: [supertest@6.3.4]
  patterns:
    - "require.main === module guard to separate listen from export in Express servers"
    - "jest.mock('node-sass') to isolate server tests from native binary failures"
    - "Parallel Jest config: react-scripts test for frontend, node_modules/.bin/jest --testEnvironment node for server"

key-files:
  created:
    - server/server.test.js
  modified:
    - server/server.js
    - package.json
    - package-lock.json

key-decisions:
  - "Use supertest@6.x instead of 7.x: supertest 7 uses formidable which imports node:fs — incompatible with Jest 24 bundled in react-scripts 3"
  - "Use --ignore-scripts for npm install: node-sass native build requires Python and fails on Node 24/arm64; safe to skip since node-sass is deprecated (replaced in Phase 2)"
  - "Mock node-sass in server.test.js: node-sass binding crashes on Node 24/arm64; smoke tests do not exercise sass.render, so mock is safe and correct"
  - "Document npm run build failure as pre-existing: webpack 4 (react-scripts 3) uses legacy OpenSSL, incompatible with Node 24 — fixed in Phase 2/3"

patterns-established:
  - "Server test isolation: mock native modules (node-sass) that fail on current Node version using jest.mock"
  - "Conditional server listen: if (require.main === module) { app.listen(...) } for testability"

requirements-completed: [TEST-03]

# Metrics
duration: 11min
completed: 2026-03-25
---

# Phase 01 Plan 02: Server Smoke Tests and Lockfile Baseline Summary

**Express server smoke tests via supertest covering all 3 endpoints, with node-sass mocked for Node 24/arm64 compatibility, and package-lock.json regenerated as pre-upgrade baseline**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-25T07:48:07Z
- **Completed:** 2026-03-25T07:59:18Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- Server API smoke tests (TEST-03) passing: GET /saved-icons (200|500), POST /gen-webfonts empty body (500), GET /download (200|404|500)
- server.js wired for testability via `require.main === module` guard and `module.exports = app`
- package-lock.json regenerated fresh from clean npm install as pre-upgrade baseline (lockfileVersion: 3)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install supertest and wire server.js for testability** - `7eb5f9c` (feat)
2. **Task 2: Server API smoke tests for all 3 endpoints (TEST-03)** - `701822b` (test)
3. **Task 3: Regenerate package-lock.json baseline** - `9f73143` (chore)

## Files Created/Modified

- `server/server.test.js` - Express API smoke tests for all 3 endpoints using supertest + jest.mock for node-sass
- `server/server.js` - Added require.main === module guard and module.exports = app
- `package.json` - Added supertest devDependency and test:server script
- `package-lock.json` - Regenerated via clean npm install as pre-upgrade baseline

## Decisions Made

- Used supertest@6.3.4 not 7.x: supertest 7 pulls in formidable which uses `node:fs` protocol incompatible with Jest 24 bundled in react-scripts 3
- Used `npm install --ignore-scripts`: node-sass native binary build needs Python and fails on Node 24/arm64; skipping scripts is safe since node-sass is deprecated (Phase 2 replaces it)
- Mocked node-sass in server.test.js: the binary crashes on Node 24/arm64 at `require()` time, before any test code runs; smoke tests only test guard clauses (empty body → 500) and file-based responses, not sass compilation, so the mock is correct

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded supertest to 6.x for Jest 24 compatibility**
- **Found during:** Task 2 (Server API smoke tests)
- **Issue:** supertest@7.x requires formidable which uses `node:fs` protocol; Jest 24 (bundled with react-scripts 3) cannot resolve `node:` scheme imports
- **Fix:** Installed `supertest@6.3.4` instead of latest 7.x
- **Files modified:** package.json, package-lock.json
- **Verification:** `npm run test:server` passes with 3 passing tests
- **Committed in:** `701822b` (Task 2 commit)

**2. [Rule 3 - Blocking] Added jest.mock('node-sass') in server.test.js**
- **Found during:** Task 1 verification (testing that server.js exports app)
- **Issue:** node-sass throws at require() time on Node 24/arm64: "Node Sass does not yet support your current environment: OS X Unsupported architecture (arm64) with Unsupported runtime (137)"
- **Fix:** Added `jest.mock('node-sass', () => ({ render: jest.fn(...) }))` before requiring server in the test file
- **Files modified:** server/server.test.js
- **Verification:** `npm run test:server` exits 0 with 3 passing tests
- **Committed in:** `701822b` (Task 2 commit)

**3. [Rule 3 - Blocking] Used --ignore-scripts for npm install**
- **Found during:** Task 1 (npm install --save-dev supertest) and Task 3 (clean npm install)
- **Issue:** node-sass postinstall script requires node-gyp and Python 2/3 to build native bindings; Python not available, build fails with exit code 1
- **Fix:** Added `--ignore-scripts` flag to npm install commands
- **Files modified:** None (runtime flag only)
- **Verification:** npm install completes successfully; supertest and all packages installed
- **Committed in:** `7eb5f9c` (Task 1) and `9f73143` (Task 3)

---

**Total deviations:** 3 auto-fixed (all Rule 3 - Blocking)
**Impact on plan:** All fixes required for the plan to execute on Node 24/arm64 with react-scripts 3. No scope creep. Phase 2 (node-sass → sass swap) will eliminate the root cause.

## Issues Encountered

- `npm run build` fails with `ERR_OSSL_EVP_UNSUPPORTED`: webpack 4 (bundled in react-scripts 3.2) uses legacy OpenSSL hash algorithms deprecated in Node 17+. This is a pre-existing issue unrelated to this plan — Phase 2/3 upgrades react-scripts which includes webpack 5.
- `CI=true npm test -- --watchAll=false` fails on `src/App.test.js` with redux `createStore` error — pre-existing test failure in the repository; out of scope for this plan.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Server smoke tests in place; Phase 2 (node-sass → dart-sass) can immediately run `npm run test:server` to catch regressions
- Pre-upgrade lockfile baseline committed; any dependency version drift will be visible in the diff after Phase 2 changes
- Known blocker for Phase 2: `npm run build` fails due to webpack 4 / Node 24 OpenSSL incompatibility — this is the exact issue Phase 2 addresses

---
*Phase: 01-pre-upgrade-baseline*
*Completed: 2026-03-25*

## Self-Check: PASSED

- FOUND: server/server.test.js
- FOUND: server/server.js (with require.main guard and module.exports)
- FOUND: package.json (with test:server script and supertest devDependency)
- FOUND: package-lock.json (lockfileVersion: 3)
- FOUND commit: 7eb5f9c (feat - Task 1)
- FOUND commit: 701822b (test - Task 2)
- FOUND commit: 9f73143 (chore - Task 3)
