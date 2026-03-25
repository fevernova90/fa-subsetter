---
phase: 02-node-sass-to-sass-migration
plan: 01
subsystem: infra
tags: [node-sass, dart-sass, sass, scss, jest, supertest, dependency-migration]

# Dependency graph
requires:
  - phase: 01-pre-upgrade-baseline
    provides: server smoke tests (supertest), node-sass mock pattern established in Phase 1
provides:
  - dart-sass (sass package) replaces node-sass in server.js and package.json
  - sass.compile() synchronous API replacing sass.render() callback pattern
  - server/server.test.js without node-sass mock (dart-sass works natively on Node 24/arm64)
affects: [03-react-scripts-upgrade]

# Tech tracking
tech-stack:
  added: [sass@1.98.0 (dart-sass)]
  patterns: [synchronous sass.compile() with try/catch instead of callback sass.render()]

key-files:
  created: [server/server.test.js]
  modified: [server/server.js, package.json, package-lock.json]

key-decisions:
  - "Replace node-sass with sass (dart-sass 1.98.0): dart-sass has no native binary, works on Node 24/arm64"
  - "Use sass.compile() synchronous API with try/catch: simpler than callback, avoids extra nesting level"
  - "Downgrade supertest@7.x to supertest@6.3.4: Jest 24 (react-scripts 3) cannot resolve node: protocol used by formidable in supertest@7.x"

patterns-established:
  - "Synchronous SCSS compilation: sass.compile(filePath, {style:'compressed'}) returns {css: string}"
  - "No sass mock needed in server tests: dart-sass loads natively, empty-icons guard returns 500 before sass.compile is reached"

requirements-completed: [SEC-02, SEC-03]

# Metrics
duration: 7min
completed: 2026-03-25
---

# Phase 02 Plan 01: node-sass to dart-sass Migration Summary

**node-sass removed and replaced with dart-sass (sass@1.98.0) — server.js migrated from sass.render() callback to synchronous sass.compile() with try/catch, server tests updated to remove the now-unnecessary node-sass mock**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-03-25T08:23:58Z
- **Completed:** 2026-03-25T08:31:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- node-sass uninstalled and sass@1.98.0 (dart-sass) installed — no native binary required on Node 24/arm64
- server.js migrated from async `sass.render()` callback pattern to synchronous `sass.compile()` with try/catch
- server/server.test.js created without any jest.mock — dart-sass loads cleanly in test environment
- All 3 server smoke tests pass (6 total including old worktree tests)

## Task Commits

Each task was committed atomically:

1. **Task 1: Swap node-sass for sass and migrate server.js to dart-sass API** - `dfed7aa` (feat)
2. **Task 2: Update server tests — remove node-sass mock, verify tests pass** - `3565343` (feat)

**Plan metadata:** _(final docs commit hash below)_

## Files Created/Modified
- `server/server.js` - Updated require to 'sass', replaced sass.render() callback with sass.compile() try/catch
- `server/server.test.js` - Created: 3 smoke tests without node-sass mock
- `package.json` - node-sass removed, sass@^1.98.0 added; supertest downgraded to ^6.3.4
- `package-lock.json` - Lockfile updated for dependency changes

## Decisions Made
- Used `sass.compile()` synchronous API (not `sass.compileAsync()`): cleaner than callback, avoids extra nesting, result.css is a string
- Downgraded supertest@7.x to @6.3.4: Jest 24 in react-scripts 3 cannot resolve `node:` protocol imports used by formidable in supertest@7.x (same constraint from Phase 1)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Downgraded supertest from 7.x to 6.3.4**
- **Found during:** Task 2 (Update server tests)
- **Issue:** supertest@7.2.2 was installed in main project but uses formidable which requires `node:fs` protocol — Jest 24 (bundled with react-scripts 3) cannot resolve it, causing `Cannot find module 'node:fs'` error
- **Fix:** `npm install supertest@6.3.4 --save-dev --ignore-scripts`
- **Files modified:** package.json, package-lock.json
- **Verification:** `npm run test:server` exits 0 with 3 passing tests
- **Committed in:** 3565343 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking issue)
**Impact on plan:** Fix necessary for tests to run under Jest 24. Consistent with Phase 1 established decision to use supertest@6.x.

## Issues Encountered
- supertest@7.x was already in package.json devDependencies but incompatible with Jest 24 — silently broke new server.test.js. Resolved by applying the Phase 1 supertest@6.x constraint.

## Next Phase Readiness
- dart-sass is now installed and working on Node 24/arm64 — Phase 3 (react-scripts 3 → 5) can proceed
- react-scripts 5 auto-detects the `sass` package (not node-sass), so this migration is a prerequisite
- server smoke tests pass and will catch regressions during the react-scripts upgrade

---
*Phase: 02-node-sass-to-sass-migration*
*Completed: 2026-03-25*
