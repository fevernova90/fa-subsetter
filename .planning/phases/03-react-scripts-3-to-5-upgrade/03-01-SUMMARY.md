---
phase: 03-react-scripts-3-to-5-upgrade
plan: 01
subsystem: infra
tags: [react-scripts, webpack, jest, npm, security, dependencies]

# Dependency graph
requires:
  - phase: 02-node-sass-to-sass-migration
    provides: dart-sass (sass package) installed, node-sass removed — react-scripts 5 sass loader depends on this
provides:
  - react-scripts 5.0.1 installed with Webpack 5 and Jest 27
  - All 5 frontend test files patched with jsdom docblock for Jest 27
  - npm audit vulnerability count reduced from 239 to 44 (195 resolved)
  - npm overrides for nth-check and postcss applied
  - supertest upgraded to 7.x (node: protocol compatible with Jest 27)
affects:
  - phase-04-direct-dependency-updates (supertest@7.x now active; Jest 27 env baseline established)

# Tech tracking
tech-stack:
  added:
    - react-scripts@5.0.1 (Webpack 5, Jest 27, ESLint 8, Babel 7)
    - supertest@^7.2.2
  patterns:
    - Per-file `/** @jest-environment jsdom */` docblock for frontend tests (not global jest.config.js) to allow server tests to use node environment
    - npm overrides field for silencing transitive vulnerability in fixed CRA release

key-files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - src/App.test.js
    - src/store.test.js
    - src/store.js
    - src/components/Icons.test.js
    - src/components/AddIconForm.test.js
    - src/components/Generator.test.js

key-decisions:
  - "Pin react-scripts at 5.0.1 (exact, no caret) — this is the final CRA release; no higher version exists"
  - "Per-file docblock approach for Jest 27 jsdom env — avoids forcing server tests into wrong environment"
  - "Add npm overrides for nth-check@^2.1.1 and postcss@^8.4.31 — reduces residual transitive vulns from 51 to 44"
  - "Upgrade supertest to ^7.x now that Jest 27 handles node: protocol (was blocked at 6.x during Phase 1/2)"
  - "Fix store.js Redux DevTools compose guard — use __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ pattern instead of unsafe && compose()"

patterns-established:
  - "Pattern 1: Jest 27 frontend test docblock — add /** @jest-environment jsdom */ as line 1 of every React/DOM test file"
  - "Pattern 2: Redux DevTools guard — use window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ with compose fallback, never window.ext && ext()"

requirements-completed: [SEC-01]

# Metrics
duration: 25min
completed: 2026-03-25
---

# Phase 3 Plan 1: React Scripts 3 to 5 Upgrade Summary

**react-scripts 3.2.0 → 5.0.1 (Webpack 5 + Jest 27), cutting npm audit vulnerabilities from 239 to 44 and patching all frontend tests for Jest 27's node-default environment**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-25T08:37:43Z
- **Completed:** 2026-03-25T09:03:00Z
- **Tasks:** 3 completed
- **Files modified:** 8

## Accomplishments

- Upgraded react-scripts from 3.2.0 to 5.0.1 (exact pin), bringing in Webpack 5, Jest 27, and ESLint 8
- Reduced npm audit vulnerability count from 239 to 44 — a reduction of 195 (target was ~200)
- Fixed all 5 frontend test files for Jest 27's changed default testEnvironment (jsdom → node) by adding per-file docblocks
- Removed unused devDependencies react-app-rewired and customize-cra
- Upgraded supertest to 7.x (node: protocol now supported under Jest 27)
- Added npm overrides for nth-check and postcss to silence residual CRA-internal transitive vulnerabilities

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove react-app-rewired/customize-cra, upgrade react-scripts to 5.0.1** - `62bf8ef` (chore)
2. **Task 2: Fix Jest 27 jsdom environment — docblocks + Redux DevTools guard** - `3620a32` (feat)
3. **Task 3: Add npm overrides, verify Webpack 5 build and audit** - `bf0ca04` (chore)

## Files Created/Modified

- `package.json` - react-scripts 5.0.1 pinned, removed react-app-rewired/customize-cra, upgraded supertest, added nth-check/postcss overrides
- `package-lock.json` - lockfile updated for all dependency changes
- `src/App.test.js` - added `/** @jest-environment jsdom */` docblock as line 1
- `src/store.test.js` - added `/** @jest-environment jsdom */` docblock as line 1
- `src/store.js` - replaced unsafe Redux DevTools compose pattern with __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ guard
- `src/components/Icons.test.js` - added `/** @jest-environment jsdom */` docblock as line 1
- `src/components/AddIconForm.test.js` - added `/** @jest-environment jsdom */` docblock as line 1
- `src/components/Generator.test.js` - added `/** @jest-environment jsdom */` docblock as line 1

## Decisions Made

- Pinned react-scripts at exactly `5.0.1` (not `^5`) since it's the final CRA release — no upgrade path exists
- Used per-file docblock approach for Jest 27 jsdom rather than global jest.config.js — this allows `server/server.test.js` to keep running in node environment without a separate config
- Added npm overrides only for packages that actually appeared in `npm audit --json` output (nth-check, postcss) — no preemptive overrides
- Upgraded supertest to ^7.x: previously blocked at 6.x because formidable in supertest@7 used node: protocol which Jest 24 (in react-scripts 3) couldn't resolve; now Jest 27 handles it correctly

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Redux DevTools compose crash under jsdom environment**
- **Found during:** Task 2 (adding jsdom docblocks to frontend tests)
- **Issue:** `src/store.js` used `compose(applyMiddleware(...middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())` — when `window.__REDUX_DEVTOOLS_EXTENSION__` is undefined (no devtools in jsdom), this passes `undefined` as a compose enhancer, causing `TypeError: Cannot read properties of undefined (reading 'apply')` crashing the App test suite
- **Fix:** Replaced with `window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose` pattern — safe under jsdom and in production
- **Files modified:** `src/store.js`
- **Verification:** `CI=true npx react-scripts test --watchAll=false` passes 7 tests across 5 suites
- **Committed in:** `3620a32` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Auto-fix was necessary for correctness — App.test.js would crash without it. No scope creep.

## Issues Encountered

None beyond the auto-fixed Redux DevTools bug. Webpack 5 build succeeded without needing NODE_OPTIONS=--openssl-legacy-provider (Node 24 + Webpack 5 native OpenSSL support works correctly).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- React-scripts 5.0.1 baseline established — Jest 27 test environment fully configured
- All 5 frontend test suites passing (7 tests), server test suite passing (3 tests)
- Phase 4 (direct dependency updates: fontawesome-subset, archiver) can proceed safely
- supertest@7.x active — no more node: protocol workarounds needed
- Remaining 44 vulnerabilities are in other direct dependencies targeted by Phase 4

---
*Phase: 03-react-scripts-3-to-5-upgrade*
*Completed: 2026-03-25*
