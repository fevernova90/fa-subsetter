---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: Milestone complete
stopped_at: Completed 04-direct-dependency-cleanup-and-audit-clear plan 03 (04-03-PLAN.md)
last_updated: "2026-03-25T10:22:12.572Z"
progress:
  total_phases: 4
  completed_phases: 3
  total_plans: 7
  completed_plans: 6
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-20)

**Core value:** Users can select Font Awesome icons and download a minimal, production-ready CSS + webfont bundle containing only what they need.
**Current focus:** Phase 04 — direct-dependency-cleanup-and-audit-clear

## Current Position

Phase: 04
Plan: Not started

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: -
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: -
- Trend: -

*Updated after each plan completion*
| Phase 01-pre-upgrade-baseline P02 | 11 | 3 tasks | 4 files |
| Phase 02-node-sass-to-sass-migration P01 | 4min | 2 tasks | 4 files |
| Phase 03-react-scripts-3-to-5-upgrade P01 | 25min | 3 tasks | 8 files |
| Phase 04-direct-dependency-cleanup-and-audit-clear P02 | 8min | 2 tasks | 2 files |
| Phase 04 P01 | 2min | 2 tasks | 3 files |
| Phase 04-direct-dependency-cleanup-and-audit-clear P03 | 6min | 2 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Pre-roadmap]: Update react-scripts 3 → 5 to resolve ~200 of 239 vulns; staying on 3.x leaves most unfixable
- [Pre-roadmap]: Replace node-sass with sass (dart-sass); node-sass deprecated, has CVEs, fails on Node 18+
- [Pre-roadmap]: Add basic tests before any upgrade; existing smoke test is fragile under Jest 27
- [Phase 01-pre-upgrade-baseline]: Use applyMiddleware(thunk) in test stores; rootReducer import avoids REDUX_DEVTOOLS crash; global.fetch mock for jsdom
- [Phase 01-pre-upgrade-baseline]: Use supertest@6.x not 7.x: formidable in 7.x uses node: protocol incompatible with Jest 24 in react-scripts 3
- [Phase 01-pre-upgrade-baseline]: Mock node-sass in server tests: native binary unsupported on Node 24/arm64; Phase 2 will replace node-sass
- [Phase 01-pre-upgrade-baseline]: Use npm install --ignore-scripts: node-sass requires Python for native build, unavailable on CI/Node 24
- [Phase 02-node-sass-to-sass-migration]: Downgrade supertest@7.x to @6.3.4: Jest 24 in react-scripts 3 cannot resolve node: protocol used by formidable in supertest@7.x
- [Phase 02-node-sass-to-sass-migration]: Replace node-sass with sass (dart-sass 1.98.0): dart-sass has no native binary, works on Node 24/arm64
- [Phase 03-react-scripts-3-to-5-upgrade]: Pin react-scripts at exactly 5.0.1 (final CRA release); per-file jsdom docblocks for Jest 27 to preserve node env for server tests
- [Phase 03-react-scripts-3-to-5-upgrade]: Fix Redux DevTools compose guard in store.js: use __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ fallback pattern instead of unsafe && compose(undefined)
- [Phase 03-react-scripts-3-to-5-upgrade]: Upgrade supertest to ^7.x: Jest 27 now handles node: protocol (was blocked at 6.x in react-scripts 3)
- [Phase 04-direct-dependency-cleanup-and-audit-clear]: Upgraded concurrently 5.x to 9.x (clears yargs moderate CVE) and archiver 3.1.1 to 7.x (dependency hygiene); archiver 7.x API fully backwards compatible with server.js zippingFiles() call site
- [Phase 04]: fontawesomeSubset 4.6.0 is async; chained .then()/.catch() on call site in server.js to ensure webfonts complete before zipping
- [Phase 04]: express upgraded to 4.22.1 within 4.x range; no breaking changes from 4.17 API used in server.js
- [Phase 04-direct-dependency-cleanup-and-audit-clear]: npm overrides for underscore ^1.13.8 and serialize-javascript ^7.0.4: safe patch releases exist, do not break react-scripts, clear all remaining high vulns
- [Phase 04-direct-dependency-cleanup-and-audit-clear]: Accept 2 moderate + 9 low in react-scripts@5.0.1 transitive tree (webpack-dev-server, jsdom chain): --force required, would install react-scripts@0.0.0 breaking change

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 4]: fontawesome-subset 1.x → 4.6.0 call signature needs verification against 4.6.0 README before upgrading (MEDIUM confidence from research)
- [Phase 4]: archiver 3.x → 7.x append()/finalize() API compatibility needs direct comparison against existing call site in server.js before upgrading

## Session Continuity

Last session: 2026-03-25T09:09:18.100Z
Stopped at: Completed 04-direct-dependency-cleanup-and-audit-clear plan 03 (04-03-PLAN.md)
Resume file: None
