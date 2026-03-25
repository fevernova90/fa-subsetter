# Roadmap: FA Subsetter — Security Maintenance

## Overview

This roadmap covers the security maintenance milestone for fa-subsetter: clearing 239 npm audit vulnerabilities in a React 16 / CRA 3.x / Express 4.17 stack. The approach is strictly sequential — tests first, then backend SCSS compiler swap, then react-scripts upgrade, then remaining direct dependency cleanup. None of the phases can be safely reordered due to hard dependency constraints in the upgrade chain.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Pre-Upgrade Baseline** - Write regression tests and regenerate lockfile before any dependencies are changed (completed 2026-03-25)
- [x] **Phase 2: node-sass to sass Migration** - Replace deprecated node-sass with dart-sass and update server.js call site (completed 2026-03-25)
- [x] **Phase 3: react-scripts 3 to 5 Upgrade** - Upgrade CRA from 3.2.0 to 5.0.1, clearing ~200 vulnerabilities (completed 2026-03-25)
- [x] **Phase 4: Direct Dependency Cleanup and Audit Clear** - Upgrade remaining vulnerable deps and achieve zero critical/high findings (completed 2026-03-25)

## Phase Details

### Phase 1: Pre-Upgrade Baseline
**Goal**: A verified test baseline and clean lockfile exist before any dependency is changed — so regressions from subsequent upgrades are detectable
**Depends on**: Nothing (first phase)
**Requirements**: TEST-01, TEST-02, TEST-03
**Success Criteria** (what must be TRUE):
  1. `npm test` exits 0 with component render tests passing for Icons, AddIconForm, and Generator components
  2. `npm test` exits 0 with Redux store initialization and addIcon/deleteIcon action dispatch tests passing
  3. `npm test` exits 0 with server API smoke tests covering all three endpoints (GET /download, GET /saved-icons, POST /gen-webfonts)
  4. `npm run build` completes without errors on the current codebase (pre-upgrade baseline documented)
  5. `package-lock.json` regenerated from a clean `npm install` with current dependency versions
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Component render tests (Icons, AddIconForm, Generator) + Redux store/action dispatch tests
- [x] 01-02-PLAN.md — Server API smoke tests (all 3 endpoints) + regenerate package-lock.json baseline

### Phase 2: node-sass to sass Migration
**Goal**: node-sass is removed and replaced with dart-sass, server.js uses the new synchronous sass.compile() API, and the backend SCSS compilation is verified working before react-scripts is touched
**Depends on**: Phase 1
**Requirements**: SEC-02, SEC-03
**Success Criteria** (what must be TRUE):
  1. `node-sass` is absent from package.json and node_modules; `sass` (dart-sass) is installed
  2. POST /gen-webfonts endpoint produces a valid ZIP file with correctly compiled CSS (manually testable via the app)
  3. `npm test` still exits 0 after the node-sass replacement (no regression)
  4. `npm run build` still completes without errors after the node-sass replacement
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Swap node-sass for dart-sass, migrate server.js sass.render() to sass.compile(), remove node-sass mock from server tests

### Phase 3: react-scripts 3 to 5 Upgrade
**Goal**: react-scripts is upgraded from 3.2.0 to 5.0.1, clearing ~200 of 239 vulnerabilities, with the app building and all tests passing under Webpack 5 and Jest 27
**Depends on**: Phase 2
**Requirements**: SEC-01
**Success Criteria** (what must be TRUE):
  1. `react-scripts` is at version 5.0.1 in package.json and node_modules
  2. `npm run build` completes without errors (Webpack 5 build succeeds)
  3. `npm test` exits 0 with all tests passing under Jest 27
  4. `npm audit` vulnerability count is reduced by approximately 200 compared to the Phase 1 baseline
  5. The app loads and functions correctly in the browser (icon list renders, add/remove/generate/download all work)
**Plans**: 1 plan

Plans:
- [x] 03-01-PLAN.md — Remove react-app-rewired/customize-cra, upgrade react-scripts 3→5, fix Jest 27 jsdom env, verify Webpack 5 build (completed 2026-03-25)

### Phase 4: Direct Dependency Cleanup and Audit Clear
**Goal**: All remaining direct-dependency vulnerabilities are resolved, housekeeping upgrades are applied, and npm audit reports zero critical and zero high severity findings
**Depends on**: Phase 3
**Requirements**: SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, HOUSE-01, HOUSE-02, HOUSE-03
**Success Criteria** (what must be TRUE):
  1. `npm audit` reports zero critical severity vulnerabilities
  2. `npm audit` reports zero high severity vulnerabilities
  3. `npm test` exits 0 with all tests passing after all dependency upgrades
  4. The app builds (`npm run build`) and all core workflows function correctly (add icon, remove icon, generate and download ZIP)
  5. `fontawesome-subset`, `express`, `archiver`, and `concurrently` are all at their target versions in package.json
**Plans**: 3 plans

Plans:
- [x] 04-01-PLAN.md — Upgrade fontawesome-subset 1.1.0→4.6.0 and express 4.17.1→4.21.2+ (critical/high CVE fixes)
- [x] 04-02-PLAN.md — Upgrade archiver 3.1.1→7.x and concurrently 5.x→9.x; confirm react-app-rewired/customize-cra removed
- [x] 04-03-PLAN.md — npm audit fix, add overrides for remaining transitive vulns, final zero-critical/zero-high verification

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Pre-Upgrade Baseline | 2/2 | Complete   | 2026-03-25 |
| 2. node-sass to sass Migration | 1/1 | Complete   | 2026-03-25 |
| 3. react-scripts 3 to 5 Upgrade | 1/1 | Complete   | 2026-03-25 |
| 4. Direct Dependency Cleanup and Audit Clear | 3/3 | Complete   | 2026-03-25 |
