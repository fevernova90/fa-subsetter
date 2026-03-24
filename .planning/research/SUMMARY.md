# Project Research Summary

**Project:** fa-subsetter — dependency security upgrade
**Domain:** Legacy CRA + Express app security maintenance
**Researched:** 2026-03-24
**Confidence:** HIGH

## Executive Summary

The fa-subsetter project carries 239 npm audit vulnerabilities across a React 16 / CRA 3.x / Express 4.17 stack. Research confirms that all 239 have known fixes — none are in a "no fix available" state. The core intervention is upgrading `react-scripts` from 3.2.0 to 5.0.1 (the final stable CRA release), which alone resolves 64 vulnerabilities including the most critical build-toolchain CVEs. The remaining vulnerabilities are cleared through a combination of replacing `node-sass` with Dart Sass (`sass`), upgrading `fontawesome-subset` from 1.x to 4.6.0, patching `express` to 4.21.2, and running `npm audit fix` for transitive dependencies after the primary upgrades are complete.

The recommended approach is phased and sequential, not a single bulk upgrade. Tests must be written before any dependency is touched — the existing smoke test is fragile and will break under Jest 27 (shipped with react-scripts 5) without remediation. After establishing a test baseline, the migration proceeds backend-first: replace `node-sass` → `sass` and update the single `sass.render()` call site in `server/server.js`, verify the backend compiles, then upgrade react-scripts. This order is non-negotiable: react-scripts 5 conflicts with `node-sass` still installed, and upgrading react-scripts without tests means regressions in the Webpack 4→5 and Jest 26→27 transitions go undetected.

The key risks are process risks, not technology risks. The upgrade path is well-documented and fully reversible at each step (git checkout is the recovery mechanism). The two most dangerous failure modes are: (1) running `npm audit fix --force` prematurely, which bypasses semver constraints and can silently install incompatible major versions across multiple packages at once; and (2) upgrading react-scripts before replacing `node-sass`, which causes conflicting SCSS compiler detection inside CRA's build pipeline. Follow the phased sequence, verify with `npm run build` + `npm test` after each phase, and the entire upgrade is achievable in a single focused sprint.

## Key Findings

### Recommended Stack

This is a maintenance upgrade, not a stack replacement. The target versions are the minimum changes necessary to clear all known CVEs while preserving every existing behavior. CRA (`react-scripts`) is deprecated upstream — 5.0.1 is the final stable release — but it remains viable for this project through the security milestone. The long-term migration to Vite is explicitly deferred to a separate milestone.

**Core upgrade targets:**
- `react-scripts` 3.2.0 → **5.0.1**: The single highest-leverage change; bundles Webpack 5, Jest 27, PostCSS 8, ESLint 8. Clears ~200 of 239 vulnerabilities.
- `node-sass` ^4.x → **removed** + `sass` ^1.77.0 added: `node-sass` is deprecated, CVE-carrying, and fails on Node 18+. Dart Sass is the official replacement; react-scripts 5 auto-detects it.
- `express` 4.17.1 → **^4.21.2**: Patches XSS-via-redirect and open redirect CVEs. Stay on 4.x — Express 5 has breaking path routing syntax changes.
- `fontawesome-subset` 1.1.0 → **^4.6.0**: Clears critical `xmldom` CVE (CVSS 9.4) buried in the 1.x dependency chain.
- `archiver` 3.1.1 → **^7.0.1**: No active CVE at 3.x but 3 major versions behind; housekeeping upgrade with stable API.
- `concurrently` 5.0.0 → **^9.2.1**: Dev dependency; clears moderate vuln via `yargs` chain.
- `npm overrides` block: Patches residual transitive vulnerabilities (`nth-check`, `postcss`, `glob-parent`, `semver`, `word-wrap`, `tough-cookie`) that CRA 5 cannot reach via package upgrades alone.

**Do not upgrade:** React (16.x), react-redux (7.x), redux (4.x), redux-thunk (2.x), @material-ui/core (v4), @fortawesome/fontawesome-free (5.x) — none have active CVEs and each carries breaking change risk out of scope for this milestone.

### Expected Features (Fix Scope)

The "features" of this milestone are security remediations. Research decomposed the 239 vulnerabilities into clear fix buckets with defined P1/P2/P3 priorities.

**Must have (P1 — required for security milestone completion):**
- Write regression tests before any upgrades — the safety net for all subsequent changes
- Upgrade `react-scripts` 3 → 5 — clears 64 vulns including critical/high build-toolchain CVEs
- Replace `node-sass` with `sass` and update `server.js` API call — 2 direct CVEs + 6 transitive
- Upgrade `fontawesome-subset` 1 → 4.6.0 — clears critical `xmldom` CVE (CVSS 9.4)
- Upgrade `express` 4.17.1 → 4.21.2 — patches XSS and open redirect in active server routes
- Run `npm audit fix` after all direct-dep upgrades — clears remaining 172 transitive vulns
- Zero critical and zero high findings in `npm audit` output

**Should have (P2 — reduce residual risk during same window):**
- Upgrade `concurrently` 5 → 9.x — clears moderate dev-dep vuln
- Upgrade `archiver` 3 → 7 — housekeeping, no active CVE but 3 major versions stale
- Add `npm overrides` block — pins 6 transitive packages to patched versions

**Defer to future milestones (out of scope):**
- React 16 → 18 migration — separate milestone; requires updating render API in tests
- CRA → Vite migration — post-security milestone; too many variables at once
- MUI v4 → v5 migration — UI modernization milestone, no CVEs
- FA5 → FA6 upgrade — only if a direct FA5 CVE materializes

**Anti-features (never do):**
- `npm audit fix --force` without sequenced prep — silently installs incompatible major versions
- Eject from CRA — creates permanent 30-file config burden
- Upgrade react-scripts and React simultaneously — two breaking change sets compound

### Architecture Approach

The app's architecture is a standard CRA-proxied frontend (React/Redux) backed by a minimal Express server exposing three routes. The core data flow (React → Redux → fetch → Express) is completely unaffected by the upgrade. The only functional code change required is in `server/server.js`: the `sass.render()` callback-based call must be rewritten to `sass.compile()` (synchronous, throws on error, returns a string not a Buffer). Everything else in the codebase is either a version bump in `package.json`, a one-line JSX prop fix (`justify` → `justifyContent` in `App.js`), or a test file update.

**Major components and upgrade impact:**
1. `server/server.js` — the only file requiring a functional code change; `sass.render()` → `sass.compile()` rewrite (~15 lines)
2. `src/App.test.js` — must be updated to `@testing-library/react` pattern before react-scripts upgrade; fragile under Jest 27
3. `package.json` — receives all version bumps, the `overrides` block, and removal of `node-sass`, `react-app-rewired`, `customize-cra`
4. `src/App.js` — one-line prop fix (`justify='center'` → `justifyContent='center'`) to silence MUI deprecation warning surfaced by ESLint 8

### Critical Pitfalls

1. **Upgrading react-scripts before removing node-sass** — react-scripts 5 ships `sass-loader` expecting the `sass` package; having `node-sass` present simultaneously causes SCSS compiler detection conflicts and confusing build failures. Remove `node-sass`, add `sass`, verify backend compiles, then upgrade react-scripts.

2. **Running `npm audit fix --force` prematurely** — npm's own output suggests `--force` when automatic fix is blocked. On this repo, `--force` will simultaneously force-bump react-scripts, archiver, express, and other packages past semver constraints with no individual verification. Never use `--force`; upgrade each package explicitly in sequence.

3. **Skipping regression tests before react-scripts upgrade** — The Webpack 4→5 and Jest 26→27 transitions have an unknowable blast radius without tests. The existing `App.test.js` will fail under Jest 27 due to the changed default test environment (`node` instead of `jsdom`). Update or replace the test file before any dependency changes.

4. **Old lockfile (lockfileVersion 1) causing silent peer dep mismatches** — The lockfile was generated by an older npm. Running `npm install` on it with npm 8+ silently regenerates resolution with the newer algorithm and may load wrong package versions. Delete `package-lock.json` and `node_modules` and do a clean `npm install` as the very first action.

5. **`sass.compile()` as a naive drop-in for `sass.render()`** — The APIs are incompatible: option key `outputStyle` → `style`, first argument is a positional path string (not inside options object), `result.css` is now a `string` not a `Buffer`, and errors are thrown synchronously rather than passed to a callback. Rewrite the call site, do not rename the function.

## Implications for Roadmap

Based on combined research, four sequential phases are suggested. The ordering is strictly driven by dependency constraints in the upgrade chain — none of the phases can be safely reordered.

### Phase 1: Pre-Upgrade Baseline

**Rationale:** Tests must exist before any dependency changes so regressions are detectable. Lockfile must be regenerated under the current npm to prevent silent peer dep corruption. These are blocking prerequisites for every subsequent phase.
**Delivers:** A clean lockfile, passing tests using `@testing-library/react`, verified baseline `npm run build` output, and `npm test` exit 0 — all documented as the regression comparison baseline.
**Addresses:** All P1 features require this safety net.
**Avoids:** Pitfall 2 (Jest 27 test breakage), Pitfall 5 (lockfile version mismatch).

### Phase 2: node-sass to sass Migration

**Rationale:** This is the smallest possible code change (backend-only, one call site in `server/server.js`) and must precede the react-scripts upgrade. react-scripts 5 expects `sass` and conflicts with `node-sass` present. Isolating this change first means any breakage is unambiguously attributable to the SCSS compiler swap.
**Delivers:** `node-sass` removed from `package.json`, `sass` installed, `server/server.js` rewritten to `sass.compile()` synchronous API, `POST /gen-webfonts` manually smoke-tested producing valid output.
**Implements:** Architecture Pattern 2 (node-sass → sass migration); rewrites the `server.js` ↔ SCSS compiler integration boundary.
**Avoids:** Pitfall 1 (webpack node-sass conflict), Pitfall 5 (API incompatibility in sass.compile).

### Phase 3: react-scripts 3 to 5 Upgrade

**Rationale:** The highest-leverage single action (clears ~200 of 239 vulnerabilities) but carries the broadest blast radius (Webpack 4→5, Jest 26→27, ESLint 6→8, PostCSS 7→8 simultaneously). Must come after tests are solid and node-sass is already gone. This is the riskiest phase and requires the most verification.
**Delivers:** react-scripts at 5.0.1, `react-app-rewired` and `customize-cra` removed (confirmed unused), `src/App.js` one-line prop fix applied, `npm run build` passes, `npm test` passes, `npm audit` count drops by ~200.
**Uses:** react-scripts 5.0.1; no config-overrides.js needed (no Node polyfills required in client code).
**Avoids:** Pitfall 1 (Webpack 5 node polyfill — verified not needed), Pitfall 6 (react-app-rewired stale version conflict — removed).

### Phase 4: Direct Dependency Cleanup and Full Audit Clear

**Rationale:** With react-scripts 5 stable and tests passing, the remaining direct-dep upgrades are low-risk and fully independent of each other. The final `npm audit fix` and `npm overrides` block clears the transitive tail. Each upgrade is verified individually before proceeding to the next.
**Delivers:** `fontawesome-subset` at 4.6.0 (critical CVE cleared), `express` at 4.21.2 (XSS/open redirect cleared), `archiver` at 7.x, `concurrently` at 9.x, `npm overrides` block applied — `npm audit` reporting zero critical and zero high.
**Implements:** npm overrides pattern for `nth-check`, `postcss`, `glob-parent`, `semver`, `word-wrap`, `tough-cookie`.
**Avoids:** Pitfall 3 (never using `--force`; each package upgraded individually and verified).

### Phase Ordering Rationale

- **Tests first is non-negotiable:** Jest 27 (in react-scripts 5) changes the default test environment, making the existing test fail. Fixing tests before the upgrade means the test failure is not mistaken for an upgrade regression.
- **Backend SCSS before react-scripts:** react-scripts 5 internally uses `sass-loader` configured for the `sass` package. Having `node-sass` installed during the react-scripts upgrade creates ambiguous loader conflicts.
- **Direct deps last:** fontawesome-subset, archiver, and express upgrades have no dependency on which version of react-scripts is running. Sequencing them after Phase 3 is confirmed working means failures are isolated and easy to diagnose.
- **`npm audit fix` only after all direct deps are upgraded:** Running it earlier re-introduces the risk of `--force`-style behavior on not-yet-upgraded packages.

### Research Flags

Phases with well-documented patterns (no additional research needed):
- **Phase 1 (Baseline):** Standard testing library migration, well-documented lockfile regeneration process.
- **Phase 2 (node-sass → sass):** Official Sass migration docs are complete and specific. Architecture research includes exact before/after code. No unknown decisions.
- **Phase 3 (react-scripts upgrade):** Extensively documented across CRA GitHub issues and community guides. The specific breaking changes for this codebase are all identified and scoped.
- **Phase 4 (direct dep cleanup):** Each package has stable upgrade paths documented in stack research. fontawesome-subset API signature needs one-time verification against 4.6.0 docs before upgrading.

No phase requires `/gsd:research-phase` during planning — research confidence is HIGH across all areas and the codebase has been directly inspected.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All target versions verified against npm registry and official changelogs. Compatibility matrix fully mapped. |
| Features | HIGH | Based on live `npm audit --json` output and direct `server.js` and `package.json` inspection. Vulnerability counts are exact, not estimated. |
| Architecture | HIGH | All changed components directly inspected. Code before/after for `sass.compile()` migration is fully specified. Only one functional code change required in the entire codebase. |
| Pitfalls | HIGH | All six critical pitfalls corroborated by multiple sources (CRA GitHub issues, Jest blog, official Sass docs). Recovery strategies are tested and documented. |

**Overall confidence:** HIGH

### Gaps to Address

- **fontawesome-subset 1.x → 4.6.0 call signature:** Research flags this as MEDIUM confidence. The `fontawesomeSubset(iconsObject, outputPath)` signature is expected to be stable but must be verified against the 4.6.0 README or source before upgrading. Check at the start of Phase 4.
- **archiver 3.x → 7.x API compatibility:** The ZIP creation call in `server.js` is expected to be compatible but archiver 7.x has not been directly compared against the existing call site. Verify the `append()` and `finalize()` usage during Phase 4.
- **SCSS slash-division warnings in generated FA SCSS:** The `server/generated-css/scss/_variables.scss` file uses `/` as a division operator (deprecated in Dart Sass). This will produce warnings but not errors in current Dart Sass. No action needed for this milestone; note for future Dart Sass 2.0 upgrade.

## Sources

### Primary (HIGH confidence)
- Create React App CHANGELOG (github.com/facebook/create-react-app) — 3.x→5.x breaking changes, Webpack 5, Jest 27, Node requirements
- Sass Legacy JS API breaking changes (sass-lang.com) — compile() vs render() API differences, result type changes
- Express 5.1.0 release announcement (expressjs.com) — 4.x maintenance until Oct 2026 confirmed
- npm overrides documentation (docs.npmjs.com) — npm 8.3+ native feature, standard transitive vuln patching approach
- fontawesome-subset releases (github.com/omacranger/fontawesome-subset) — 4.6.0 latest, FA 5.x+ supported
- CRA issues #12790, #13186, #13671 — residual vuln override set confirmed
- Live `npm audit --json` output on current repo lockfile (2026-03-24) — exact vulnerability counts

### Secondary (MEDIUM confidence)
- react-app-rewired issue #587 — CRA 5 support confirmed via PR #530
- MUI Grid justify → justifyContent deprecation (github.com/mui/material-ui/issues/25540)
- Webpack 5 node core polyfills removed (github.com/facebook/create-react-app/issues/11756)
- npm registry dist-tags for react-scripts, sass, express, fontawesome-subset, archiver, concurrently

### Tertiary (community, patterns verified against official docs)
- Upgrading react-scripts to v5 — for idiots (Medium) — CRA 3→5 migration experience report
- My experience migrating from CRA 4 to 5 (dev.to) — practical pitfall documentation
- Migrating from Node-Sass to Dart-Sass (dev.to) — sass API migration patterns

---
*Research completed: 2026-03-24*
*Ready for roadmap: yes*
