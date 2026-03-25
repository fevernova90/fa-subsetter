---
phase: 04-direct-dependency-cleanup-and-audit-clear
verified: 2026-03-25T09:30:00Z
status: passed
score: 12/12 must-haves verified
re_verification: false
---

# Phase 4: Direct Dependency Cleanup and Audit Clear Verification Report

**Phase Goal:** All remaining direct-dependency vulnerabilities are resolved, housekeeping upgrades are applied, and npm audit reports zero critical and zero high severity findings
**Verified:** 2026-03-25T09:30:00Z
**Status:** PASSED
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

All must-haves are drawn from the three PLAN frontmatter blocks (04-01, 04-02, 04-03) and the five ROADMAP Success Criteria.

| #  | Truth                                                                                          | Status     | Evidence                                                                   |
|----|-----------------------------------------------------------------------------------------------|------------|----------------------------------------------------------------------------|
| 1  | fontawesome-subset is at version 4.6.0 in package.json and node_modules                      | VERIFIED   | package.json: `^4.6.0`; node_modules/fontawesome-subset/package.json: `4.6.0` |
| 2  | express is at version 4.21.2 or higher (not 5.x) in package.json and node_modules            | VERIFIED   | package.json: `^4.22.1`; node_modules/express/package.json: `4.22.1`      |
| 3  | POST /gen-webfonts calls fontawesomeSubset with correct 4.6.0 async signature (.then/.catch)  | VERIFIED   | server.js lines 161-195: `fontawesomeSubset(...).then(() => { ... }).catch(err => { ... })` |
| 4  | npm test exits 0 after upgrades (no regression)                                               | VERIFIED   | 7 frontend tests passed, 3 server tests passed (CI=true react-scripts test + test:server) |
| 5  | concurrently is at version 9.x in devDependencies                                             | VERIFIED   | package.json devDependencies: `^9.2.1`; `concurrently --version` outputs `9.2.1` |
| 6  | archiver is at version 7.x in dependencies                                                    | VERIFIED   | package.json: `^7.0.1`; node_modules/archiver/package.json: `7.0.1`       |
| 7  | react-app-rewired and customize-cra are absent from package.json and node_modules             | VERIFIED   | Both keys absent from dependencies and devDependencies in package.json     |
| 8  | npm run dev and npm start scripts still reference concurrently correctly                       | VERIFIED   | package.json scripts: `dev` and `start` both invoke `concurrently` with quoted-command patterns |
| 9  | npm audit reports zero critical severity vulnerabilities                                       | VERIFIED   | `npm audit --json`: critical: 0                                            |
| 10 | npm audit reports zero high severity vulnerabilities                                           | VERIFIED   | `npm audit --json`: high: 0 (moderate: 2, low: 9 — all react-scripts transitive, accepted) |
| 11 | npm test exits 0 with all tests passing after all dependency upgrades                         | VERIFIED   | 5 test suites, 7 frontend tests passed; 1 suite, 3 server tests passed     |
| 12 | npm run build completes without errors                                                         | VERIFIED   | Build succeeded: "The build folder is ready to be deployed."               |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact            | Expected                                                                | Status     | Details                                                                                             |
|---------------------|-------------------------------------------------------------------------|------------|-----------------------------------------------------------------------------------------------------|
| `package.json`      | fontawesome-subset ^4.6.0, express ^4.22.1, archiver ^7.0.1, concurrently ^9.2.1; overrides for nth-check, postcss, underscore, serialize-javascript | VERIFIED | All four target deps at correct versions; overrides field contains all four pinned transitive packages |
| `package-lock.json` | Clean lockfile reflecting all Plan 01+02+03 changes                     | VERIFIED   | Regenerated after every install step; consistent with package.json                                  |
| `server/server.js`  | fontawesomeSubset call compatible with 4.6.0 async API (.then/.catch)   | VERIFIED   | Lines 161-195: wraps call in `.then()` / `.catch()` chain; zippingFiles() called inside .then()     |

### Key Link Verification

| From                                     | To                                            | Via                                                  | Status   | Details                                                        |
|------------------------------------------|-----------------------------------------------|------------------------------------------------------|----------|----------------------------------------------------------------|
| server/server.js fontawesomeSubset call  | fontawesome-subset 4.6.0 exported function    | `require('fontawesome-subset')` at line 12           | WIRED    | `fontawesomeSubset(mapIconsToSubset(icons), path.join(...)).then(...).catch(...)` at lines 161-195 |
| package.json scripts.dev                 | node_modules/.bin/concurrently                | concurrently binary in devDependencies               | WIRED    | `scripts.dev` = `concurrently "node ./server/server.js" "react-scripts start"` |
| server/server.js zippingFiles()          | archiver 7.x                                  | `require('archiver')` at line 2                      | WIRED    | `archiver('zip', { zlib: { level: 9 } })` at line 18; pipe/file/directory/finalize all called |
| package.json overrides                   | deeply nested transitive vulnerable deps      | npm overrides field forcing minimum version          | WIRED    | overrides: nth-check, postcss, underscore ^1.13.8, serialize-javascript ^7.0.4 |

### Requirements Coverage

| Requirement | Source Plan | Description                                                                    | Status     | Evidence                                                                 |
|-------------|-------------|--------------------------------------------------------------------------------|------------|--------------------------------------------------------------------------|
| SEC-04      | 04-01       | fontawesome-subset upgraded from 1.1.0 to 4.6.0, resolving critical xmldom CVE | SATISFIED  | node_modules version 4.6.0; package.json `^4.6.0`                       |
| SEC-05      | 04-01       | express upgraded from 4.17.1 to 4.21.2+, resolving XSS and open redirect CVEs  | SATISFIED  | node_modules version 4.22.1; package.json `^4.22.1` (exceeds 4.21.2 target) |
| SEC-06      | 04-03       | npm audit fix run to clear remaining transitive vulnerabilities                 | SATISFIED  | npm audit fix run; overrides added for underscore and serialize-javascript |
| SEC-07      | 04-03       | npm audit reports zero critical vulnerabilities                                 | SATISFIED  | `npm audit --json` critical: 0                                           |
| SEC-08      | 04-03       | npm audit reports zero high severity vulnerabilities                            | SATISFIED  | `npm audit --json` high: 0                                               |
| SEC-09      | 04-03       | App builds successfully and all tests pass after updates                        | SATISFIED  | `npm run build` exits 0; CI=true tests: 7 frontend + 3 server passed     |
| HOUSE-01    | 04-02       | concurrently upgraded from 5.0.0 to 9.x, resolving moderate yargs vuln         | SATISFIED  | node_modules version 9.2.1; package.json `^9.2.1`                       |
| HOUSE-02    | 04-02       | archiver upgraded from 3.1.1 to 7.x                                            | SATISFIED  | node_modules version 7.0.1; package.json `^7.0.1`                       |
| HOUSE-03    | 04-02       | react-app-rewired and customize-cra removed if no config-overrides.js exists    | SATISFIED  | Both absent from package.json dependencies and devDependencies           |

All 9 phase requirements (SEC-04 through SEC-09, HOUSE-01 through HOUSE-03) are SATISFIED. No orphaned requirements found — REQUIREMENTS.md traceability table maps exactly these 9 IDs to Phase 4.

### Anti-Patterns Found

| File              | Line    | Pattern                                      | Severity | Impact |
|-------------------|---------|----------------------------------------------|----------|--------|
| server/server.js  | 3-4     | Commented-out `util` require and promise util | Info     | Dead code, no functional impact |
| server/server.js  | 82-103  | Commented-out `mapIconsSubset` function block | Info     | Dead code, no functional impact |

No blockers or warnings. The commented code is non-functional dead code from an earlier implementation; it does not affect correctness.

### Human Verification Required

The following items cannot be verified programmatically:

#### 1. End-to-end ZIP generation in browser

**Test:** Load the app in a browser, add two or more icons (one solid, one brand), click Generate, then click Download.
**Expected:** A ZIP file is downloaded containing `custom-fa.min.css`, `saved-icons.json`, and a `webfonts/` directory with `.woff`/`.woff2` files for the selected icons only.
**Why human:** The fontawesomeSubset 4.6.0 call is now async (`.then()` chain). The server test only verifies that POST /gen-webfonts returns 500 for an empty body; it does not exercise the full async font generation path with real icon data. Confirming the `.then()` chain actually produces the webfonts before `zippingFiles()` is called requires a real HTTP request with valid icon payloads.

---

## Audit State Summary

| Severity  | Count | Notes                                               |
|-----------|-------|-----------------------------------------------------|
| Critical  | 0     | Cleared — target achieved                           |
| High      | 0     | Cleared — target achieved                           |
| Moderate  | 2     | All inside react-scripts@5.0.1 transitive chain     |
| Low       | 9     | All inside react-scripts@5.0.1 / jsdom / jest chain |

The 11 remaining moderate/low findings are exclusively within the react-scripts@5.0.1 transitive dependency tree (webpack-dev-server, jsdom chain). They cannot be resolved without `npm audit fix --force`, which installs `react-scripts@0.0.0` — a known breaking CRA destruction. These are accepted per the decision recorded in 04-03-SUMMARY.md.

## npm overrides Applied

```json
"overrides": {
  "nth-check": "^2.1.1",
  "postcss": "^8.4.31",
  "underscore": "^1.13.8",
  "serialize-javascript": "^7.0.4"
}
```

The first two were inherited from Phase 3. The last two were added in Plan 03 to clear remaining high-severity transitive vulns.

---

_Verified: 2026-03-25T09:30:00Z_
_Verifier: Claude (gsd-verifier)_
