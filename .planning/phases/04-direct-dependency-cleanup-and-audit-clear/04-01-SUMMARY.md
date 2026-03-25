---
phase: 04-direct-dependency-cleanup-and-audit-clear
plan: "01"
subsystem: server
tags: [security, dependencies, express, fontawesome-subset]
dependency_graph:
  requires: []
  provides: [fontawesome-subset-4.6.0, express-4.22.1]
  affects: [server/server.js, package.json]
tech_stack:
  added: []
  patterns: [promise-chaining]
key_files:
  created: []
  modified:
    - package.json
    - package-lock.json
    - server/server.js
decisions:
  - "Chain fontawesomeSubset Promise with .then()/.catch() since 4.6.0 is now async"
  - "express upgraded to 4.22.1 (within 4.x range, no breaking changes)"
metrics:
  duration: "~2min"
  completed_date: "2026-03-25"
  tasks_completed: 2
  files_modified: 3
---

# Phase 04 Plan 01: Direct Dependency Upgrade (fontawesome-subset + express) Summary

**One-liner:** Upgraded fontawesome-subset 1.1.0→4.6.0 and express 4.17.1→4.22.1 to eliminate critical xmldom CVE and XSS/open-redirect CVEs; updated call site to chain the now-async fontawesomeSubset Promise.

## What Was Done

Upgraded the two direct dependencies carrying critical security vulnerabilities:
- **fontawesome-subset**: 1.1.0 → 4.6.0 (eliminates critical xmldom CVE)
- **express**: 4.17.1 → 4.22.1 (eliminates XSS and open-redirect CVEs)

## Tasks Completed

| Task | Description | Commit | Status |
|------|-------------|--------|--------|
| 1 | Inspect 4.6.0 signature, upgrade fontawesome-subset and express | ae872c6 | Done |
| 2 | Smoke-test after upgrades (10/10 tests pass) | — (no changes) | Done |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] fontawesomeSubset 4.6.0 is now async — updated call site**
- **Found during:** Task 1 (signature inspection)
- **Issue:** fontawesome-subset 4.6.0 returns a Promise; the existing call in server.js was fire-and-forget. Without awaiting, `zippingFiles()` could run before webfonts were generated, producing an empty/corrupt ZIP.
- **Fix:** Wrapped `fs.writeFile` chain inside `.then()` callback on the `fontawesomeSubset()` Promise, added `.catch()` error handler returning 500.
- **Files modified:** server/server.js
- **Commit:** ae872c6

## Verification Results

- package.json: fontawesome-subset `^4.6.0`, express `^4.22.1`
- node_modules installed: fontawesome-subset `4.6.0`, express `4.22.1`
- `server.js` loads without errors
- `npm run test:server`: 3/3 pass
- `CI=true npx react-scripts test --watchAll=false`: 7/7 pass
- Total: 10/10 tests pass, zero regressions

## Self-Check: PASSED

- server/server.js: modified and committed (ae872c6)
- package.json: shows `^4.6.0` and `^4.22.1`
- ae872c6: confirmed in git log
