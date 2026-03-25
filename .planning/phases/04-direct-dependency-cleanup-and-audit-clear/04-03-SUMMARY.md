---
phase: 04-direct-dependency-cleanup-and-audit-clear
plan: 03
subsystem: infra
tags: [npm, security, audit, overrides, fontawesome-subset, express, archiver, concurrently]

# Dependency graph
requires:
  - phase: 04-direct-dependency-cleanup-and-audit-clear
    provides: fontawesome-subset 4.6.0 + express 4.22.1 (Plan 01), archiver 7.x + concurrently 9.x (Plan 02)
provides:
  - zero critical vulnerabilities in npm audit
  - zero high vulnerabilities in npm audit
  - npm overrides for underscore ^1.13.8 and serialize-javascript ^7.0.4
  - all 4 target packages at upgraded versions with clean lockfile
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [npm overrides to force minimum versions on deeply nested transitive deps]

key-files:
  created: []
  modified: [package.json, package-lock.json, server/server.js]

key-decisions:
  - "Add npm overrides for underscore ^1.13.8 (GHSA-qpx9-hpmf-5gmw DoS) and serialize-javascript ^7.0.4 (GHSA-5c6j-r48x-rmvq RCE): safe versions exist, overrides do not break react-scripts"
  - "Accept remaining 2 moderate + 9 low vulns: all locked in react-scripts@5.0.1 transitive deps (webpack-dev-server, jsdom chain); fixing requires --force which would destroy CRA toolchain"
  - "fontawesome-subset 4.6.0 returns a Promise: server.js call site updated from fire-and-forget to .then()/.catch() chain to ensure webfonts complete before ZIP is built"
  - "fontawesome-subset ^4.6.0 and express ^4.22.1 applied to this branch (were completed in Plan 01 on a parallel branch, missing here due to worktree divergence)"

patterns-established:
  - "Iterative override loop: run npm audit fix → identify remaining high/critical → check if safe version exists → add override → npm install → repeat until target achieved"
  - "Do NOT run npm audit fix --force on CRA projects — it installs react-scripts@0.0.0 (breaking change)"

requirements-completed: [SEC-06, SEC-07, SEC-08, SEC-09]

# Metrics
duration: 15min
completed: 2026-03-25
---

# Phase 04 Plan 03: Audit Clear Summary

**npm audit fix + overrides for underscore 1.13.8 and serialize-javascript 7.0.4 bring the audit to zero critical, zero high; all 10 tests pass and production build succeeds**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-03-25T09:02:52Z
- **Completed:** 2026-03-25T09:17:00Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Achieved zero critical and zero high npm audit vulnerabilities (down from 7 critical, 14 high at start of Plan 03)
- Applied fontawesome-subset 4.6.0 and express 4.22.1 (Plan 01 changes that were missing from this worktree branch)
- Fixed server.js fontawesomeSubset call to await the Promise properly before writing CSS/ZIP
- Added npm overrides for underscore (^1.13.8) and serialize-javascript (^7.0.4) to clear remaining high vulns
- Confirmed all 10 tests pass (7 frontend + 3 server) and production build succeeds

## Task Commits

Each task was committed atomically:

1. **Task 1: npm audit fix + overrides** - `0aea563` (chore)
2. **Task 2: Final verification** - No code changes (verification only; all tests pass, build succeeds)

## Files Created/Modified

- `package.json` - fontawesome-subset ^4.6.0, express ^4.22.1; overrides expanded with underscore ^1.13.8, serialize-javascript ^7.0.4
- `package-lock.json` - Clean lockfile reflecting all Phase 4 Plan 01+02+03 changes
- `server/server.js` - fontawesomeSubset() now chains .then()/.catch() (required for 4.6.0 async API)

## Decisions Made

- Used `npm overrides` (not `--force`) to pin transitive vulnerable packages to safe minimum versions
- `underscore ^1.13.8`: vuln range `<=1.13.7`; 1.13.8 is the safe patch release, nested via bfj → jsonpath → react-scripts
- `serialize-javascript ^7.0.4`: vuln range `<=7.0.2`; 7.0.4 is the safe patch release, nested via workbox/css-minimizer → react-scripts
- Accepted 2 moderate + 9 low remaining: all inside react-scripts@5.0.1 (webpack-dev-server, jsdom/jest chain); no safe fix path available without breaking CRA

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Applied fontawesome-subset 4.6.0 and express 4.22.1 that were missing from this branch**
- **Found during:** Task 1 (baseline audit check)
- **Issue:** This worktree branch diverged from master before Plan 01's fontawesome-subset/express upgrades were committed; package.json still had fontawesome-subset ^1.1.0 and express ^4.17.1
- **Fix:** Updated package.json to fontawesome-subset ^4.6.0 and express ^4.22.1; ran npm install to regenerate lockfile
- **Files modified:** package.json, package-lock.json
- **Verification:** npm install completed successfully; lockfile updated; audit count dropped
- **Committed in:** 0aea563 (Task 1 commit)

**2. [Rule 1 - Bug] Fixed fire-and-forget fontawesomeSubset() call in server.js**
- **Found during:** Task 1 (applying fontawesome-subset 4.6.0)
- **Issue:** server.js called fontawesomeSubset() without awaiting its Promise; with 4.6.0 (async), zippingFiles() could run before webfonts were generated producing a corrupt ZIP
- **Fix:** Wrapped fs.writeFile chain inside .then() callback on fontawesomeSubset() Promise; added .catch() error handler returning 500
- **Files modified:** server/server.js
- **Verification:** Server tests pass (3/3); POST /gen-webfonts smoke test exits 0
- **Committed in:** 0aea563 (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - bugs required for correctness)
**Impact on plan:** Both fixes were necessary to achieve correct behavior with fontawesome-subset 4.6.0. No scope creep.

## Issues Encountered

The two worktree branches (agent-a2b59fbd and agent-afe538f1) executed Plan 01 and Plan 02 in parallel on diverged branches. This branch (afe538f1) had Plan 02's archiver/concurrently upgrades but was missing Plan 01's fontawesome-subset/express upgrades. Resolved by applying the missing changes directly rather than attempting a merge (merge had lockfile conflicts).

## Next Phase Readiness

- Phase 4 complete: zero critical, zero high vulnerabilities
- All 4 target dependencies at upgraded versions: fontawesome-subset 4.6.0, express 4.22.1, archiver 7.0.1, concurrently 9.2.1
- All 10 tests passing; production build clean
- Remaining 11 vulnerabilities (2 moderate, 9 low) are all react-scripts transitive — known CRA limitation, no safe fix

## Self-Check: PASSED

- package.json: FOUND
- server/server.js: FOUND
- 04-03-SUMMARY.md: FOUND
- commit 0aea563: FOUND

---
*Phase: 04-direct-dependency-cleanup-and-audit-clear*
*Completed: 2026-03-25*
