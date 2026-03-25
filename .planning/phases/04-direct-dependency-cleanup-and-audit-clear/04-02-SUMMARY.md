---
phase: 04-direct-dependency-cleanup-and-audit-clear
plan: 02
subsystem: infra
tags: [npm, concurrently, archiver, dependency-upgrade, housekeeping]

# Dependency graph
requires:
  - phase: 03-react-scripts-3-to-5-upgrade
    provides: react-scripts 5.x, Jest 27, updated test infrastructure
provides:
  - concurrently 9.x in devDependencies (replaces 5.x)
  - archiver 7.x in dependencies (replaces 3.1.1)
  - HOUSE-01, HOUSE-02, HOUSE-03 requirements satisfied
affects: [04-03-audit-clear]

# Tech tracking
tech-stack:
  added: [concurrently@9.2.1, archiver@7.0.1]
  patterns: [npm install --save-dev for devDependencies, npm install for runtime dependencies]

key-files:
  created: []
  modified: [package.json, package-lock.json]

key-decisions:
  - "Upgraded concurrently 5.x to 9.x: clears yargs moderate vulnerability, CLI interface is backwards compatible for quoted-command usage in npm scripts"
  - "Upgraded archiver 3.1.1 to 7.x: archiver 7.x maintains same event-driven streaming API (pipe, file, directory, finalize), no changes to server.js required"
  - "HOUSE-03 confirmed already complete: react-app-rewired and customize-cra were removed in Phase 3 Plan 01 and are absent"

patterns-established:
  - "Verify API compatibility before dependency upgrades by checking call sites in source code"
  - "Run full test suite (frontend + server) after housekeeping upgrades to confirm zero regressions"

requirements-completed: [HOUSE-01, HOUSE-02, HOUSE-03]

# Metrics
duration: 8min
completed: 2026-03-25
---

# Phase 4 Plan 02: Dependency Housekeeping Summary

**concurrently 5.x upgraded to 9.2.1 (clears yargs moderate CVE) and archiver 3.1.1 upgraded to 7.0.1 (dependency hygiene); all 10 tests pass with zero regressions**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-25T08:49:00Z
- **Completed:** 2026-03-25T08:57:51Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Upgraded concurrently from ^5.0.0 to ^9.2.1, clearing yargs-related moderate vulnerability
- Upgraded archiver from ^3.1.1 to ^7.0.1, keeping the dependency tree modern
- Confirmed HOUSE-03: react-app-rewired and customize-cra already absent (removed in Phase 3 Plan 01)
- Verified archiver 7.x backwards-compatible API with existing zippingFiles() call site in server.js — no code changes needed
- All 10 tests (7 frontend + 3 server) pass after upgrades with zero regressions

## Task Commits

Each task was committed atomically:

1. **Task 1: Upgrade concurrently 5.x to 9.x and archiver 3.x to 7.x** - `72e0ac2` (chore)
2. **Task 2: Smoke-test after housekeeping upgrades** - Verification-only, no file changes (passes without additional commit)

**Plan metadata:** (see final commit below)

## Files Created/Modified
- `package.json` - concurrently ^5.0.0 → ^9.2.1 in devDependencies; archiver ^3.1.1 → ^7.0.1 in dependencies
- `package-lock.json` - Updated lock file reflecting new dependency tree

## Decisions Made
- archiver 7.x maintains the same event-driven streaming API; no changes to server/server.js zippingFiles() function were required (pipe, file, directory, finalize methods all preserved)
- concurrently 9.x CLI interface is backwards compatible with 5.x for simple quoted-command npm scripts usage

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None - both upgrades installed cleanly, all tests passed on first run.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- HOUSE-01 (concurrently 9.x), HOUSE-02 (archiver 7.x), HOUSE-03 (react-app-rewired/customize-cra absent) all satisfied
- Ready for Plan 03: npm audit fix pass to address remaining vulnerabilities

---
*Phase: 04-direct-dependency-cleanup-and-audit-clear*
*Completed: 2026-03-25*
