# Feature Research

**Domain:** Security maintenance — legacy CRA app dependency hardening
**Researched:** 2026-03-24
**Confidence:** HIGH (based on live `npm audit` output and direct codebase inspection)

---

## Context: The 239 Vulnerabilities, Decomposed

Running `npm audit` against the current lockfile surfaces 239 vulnerabilities split into three
distinct fix buckets. Understanding which bucket each vuln lives in drives the entire work order.

| Fix Bucket | Vuln Count | How to Resolve |
|---|---|---|
| `react-scripts@3 → @5` upgrade | 64 | Bump `react-scripts` to `5.0.1` |
| `npm audit fix` (independent) | 172 | Standard `npm audit fix --force` after RS5 |
| `fontawesome-subset@1 → @4.6` upgrade | 3 (incl. 1 critical `xmldom`) | Bump `fontawesome-subset` |

All 239 have a known fix. Zero are "no fix available."

---

## Feature Landscape

### Table Stakes (Must Fix)

These are the non-negotiable fixes. They map directly to Dependabot alerts and cover all
critical and high severity vulnerabilities.

| Fix | Severity Addressed | Complexity | Notes |
|---|---|---|---|
| Upgrade `react-scripts` `3.2.0` → `5.0.1` | 64 vulns (critical/high/moderate) | MEDIUM | The single highest-leverage action. Fixes `loader-utils` (ReDoS), `react-dev-utils` (OS command injection), `shell-quote` (command injection), and ~60 others buried in webpack/jest toolchain. Breaking changes: React 17 JSX transform applied, Webpack 4→5 (should be transparent), Jest 26→27 (test API stable). The existing smoke test (`App.test.js`) uses `ReactDOM.render` which is still valid in React 16/17. |
| Replace `node-sass` → `sass` (dart-sass) | HIGH (node-sass itself has 2 CVEs + 6 transitive) | MEDIUM | `node-sass` is a direct dependency (server.js: `require('node-sass')`). Deprecated upstream, fails on Node 18+, carries DoS + improper certificate validation CVEs. Drop-in replacement: `npm install sass`, update `server.js` to `require('sass')`, change callback-style `sass.render()` → `sass.compile()` (sync) or keep async with `sass.compileAsync()`. One call site in server.js. |
| Upgrade `express` `4.17.1` → `4.21.2+` | HIGH (XSS via redirect, open redirect) | LOW | Direct dependency. `express` is auto-fixable. Upgrade to `^4.21.2` to clear XSS-via-`response.redirect()` (GHSA-qw6h-vgh9-j6wx) and open redirect in malformed URLs. Server exposes three routes: GET `/download`, GET `/saved-icons`, POST `/gen-webfonts`. Low attack surface for the redirect vulns but the Dependabot alert remains open until fixed. |
| Upgrade `fontawesome-subset` `1.1.0` → `4.6.0` | CRITICAL (`xmldom` misinterpretation) + 2 moderate | LOW-MEDIUM | Direct dependency. `xmldom` (critical, CVSS 9.4) is buried in the old `1.x` version. `fontawesome-subset@4.6.0` is the current latest and already specified as the fix. API change: the subset function call signature may differ between `1.x` and `4.x` — verify `server.js` call site (`fontawesomeSubset(mapIconsToSubset(icons), outputPath)`). |
| Run `npm audit fix` after the above upgrades | 172 remaining moderate/low vulns | LOW | After RS5 and the direct dep upgrades, the independent transitive vulns (`@babel/traverse` arbitrary code exec, `elliptic` broken crypto, `handlebars` RCE, `url-parse` auth bypass, `tree-kill` command injection, `minimist` prototype pollution, etc.) can be cleared with a single `npm audit fix`. These are build-tool and dev-dependency chain entries — not runtime paths — but they must be cleared to silence Dependabot. |
| Write regression tests before any upgrades | N/A (risk mitigation) | LOW | Current test coverage: one smoke test (`renders without crashing`). Before touching `react-scripts`, at minimum add: a render test for the icon list component, a test that the Redux store initialises correctly, and an API integration smoke test (or mock) for the three server routes. This is the safety net for the RS3→RS5 JSX transform and webpack config changes. |

### Differentiators (Nice to Have)

Fixes that reduce risk beyond the Dependabot alerts, or improve maintainability during the
maintenance window. Worth doing if the table stakes work is on schedule.

| Fix | Value Proposition | Complexity | Notes |
|---|---|---|---|
| Upgrade `concurrently` `5.0.0` → `9.x` | Clears moderate vuln (yargs chain); aligns with Node 18+ | LOW | Dev dependency. `concurrently@5` carries a moderate vuln via `yargs`. Upgrade is non-breaking for the two `concurrently` usages in `package.json` scripts. |
| Upgrade `archiver` `3.1.1` → `7.0.1` | Removes stale package risk; major version has housekeeping fixes | MEDIUM | Direct server dependency. No known CVE at `3.x` right now, but it is 3 major versions behind. API is stable across versions. Low urgency but good to do while touching the server. |
| Upgrade `@fortawesome/fontawesome-free` `5.11.2` → `6.x` | Stays on supported version; FA5 is maintenance-only | HIGH | Not required for security. FA6 has icon set changes (some icon names changed). `fontawesome-subset` `4.6.0` targets FA5 source files — changing this requires verifying subset compatibility. Defer unless there is a FA5 CVE. |
| Pin TypeScript `3.7.2` → `5.x` | Removes unsupported TS version, future-proofs | MEDIUM | DevDependency only. `react-scripts@5` ships its own TS support; the loose `typescript` devDependency is for IDE hints. TS 3.x is end-of-life. No functional impact during this maintenance window. |
| Remove `react-app-rewired` + `customize-cra` if unused | Removes two abandoned devDeps | LOW | `customize-cra` latest is `1.0.0` (stagnant), `react-app-rewired@2.2.1` is maintained but not needed if no webpack overrides are actually in use. Check for `config-overrides.js` — if it does not exist or is empty, remove both. |

### Anti-Features (Deliberately Out of Scope)

| Feature | Why It Gets Requested | Why to Avoid It | What to Do Instead |
|---|---|---|---|
| Eject from CRA | "More control over webpack config, fix vulns directly" | Ejecting creates ~30 config files that become permanent maintenance burden. Any future CRA/Vite migration becomes a full rewrite. The vuln count is fixable without ejecting. | Upgrade react-scripts to 5.0.1. All critical/high/moderate toolchain vulns are resolved by the upgrade. |
| Migrate to Vite | "CRA is deprecated, Vite is the modern choice" | Out of scope for a security maintenance milestone. Vite migration requires restructuring build config, verifying SCSS handling, and re-validating production build output. Changes too many variables at once. | Treat Vite migration as a separate milestone post-security-fix, after tests are in place. |
| Upgrade React 16 → 18 | "While we're updating things..." | React 18 removes `ReactDOM.render` (used in the existing test). Combined with RS5's React 17 upgrade, the test needs updating. React 18 concurrent mode changes also require validating Redux 7.x compatibility. Scope creep risk. | Stay on React 16 through this milestone. React 18 belongs in a separate feature milestone. |
| Upgrade `@material-ui/core` v4 → MUI v5 | "MUI v4 is deprecated" | No CVEs in MUI v4 directly. Migration requires full component API review and theming changes. Pure UI work, not security work. | Defer to a UI modernization milestone. |
| `npm audit fix --force` without prep | "Fastest way to clear the count" | `--force` installs semver-breaking versions indiscriminately. On this repo it will break the node-sass import before you have a replacement ready, and may break the fontawesome-subset call signature silently. | Follow the ordered upgrade sequence: tests first, RS5, direct deps, then `npm audit fix`. |

---

## Feature Dependencies

```
[Write regression tests]
    └──must precede──> [react-scripts 3 → 5 upgrade]
                           └──must precede──> [npm audit fix (mass clear)]

[Replace node-sass → sass]
    └──must precede──> [npm audit fix --force on node-sass chain]

[fontawesome-subset 1 → 4.6 upgrade]
    └──verify API compat──> [server.js fontawesomeSubset() call site]

[express upgrade]
    └──independent, safe to do at any point]
```

### Dependency Notes

- **Tests must precede react-scripts upgrade:** RS3→RS5 is a semver-major bump on a build tool. Without tests there is no way to detect regressions from the Webpack 4→5 or Jest 26→27 transitions.
- **node-sass replacement must happen before `npm audit fix`:** `npm audit fix` with node-sass in place may attempt a version pin that still uses the deprecated native binding. Replacing the import first avoids this.
- **fontawesome-subset API verification is blocking:** The package jumps from `1.x` to `4.x`. The call in `server.js` passes `(iconsObject, outputPath)` — confirm this signature is unchanged in `4.6.0` before upgrading.
- **express upgrade is fully independent:** No other change depends on or conflicts with the express bump. It can be done first or last in the direct-dep sequence.

---

## MVP Definition

### Launch With (security milestone complete when)

- [ ] All 23 critical vulnerabilities cleared
- [ ] All 76 high severity vulnerabilities cleared
- [ ] `npm audit` reports zero critical and zero high
- [ ] App builds and existing smoke test passes after updates
- [ ] `node-sass` fully removed from `package.json` and `server.js`

### Add After Validation (v1.x — moderate cleanup)

- [ ] Moderate vulnerability count reduced to <10 — after `npm audit fix` run post RS5
- [ ] `concurrently` upgraded — low-risk, resolves the remaining moderate devDep vuln

### Future Consideration (out of this milestone)

- [ ] React 18 migration — separate milestone, requires test coverage investment
- [ ] Vite migration — separate milestone, after security is clean
- [ ] MUI v5 migration — UI modernization milestone
- [ ] FA6 upgrade — only if FA5 receives a direct CVE

---

## Feature Prioritization Matrix

| Fix | User Value | Implementation Cost | Priority |
|---|---|---|---|
| Write regression tests | HIGH (enables all other fixes safely) | LOW | P1 |
| `react-scripts` 3 → 5 | HIGH (clears 64 vulns including 3 critical) | MEDIUM | P1 |
| `node-sass` → `sass` | HIGH (direct dep, deprecated, 2 CVEs) | MEDIUM | P1 |
| `fontawesome-subset` 1 → 4.6 | HIGH (1 critical `xmldom` CVE) | LOW-MEDIUM | P1 |
| `express` 4.17 → 4.21+ | HIGH (direct dep, XSS + open redirect) | LOW | P1 |
| `npm audit fix` (mass clear) | HIGH (eliminates remaining 172) | LOW | P1 (after above) |
| `concurrently` upgrade | LOW (dev-only, moderate vuln) | LOW | P2 |
| `archiver` upgrade | LOW (no active CVE, housekeeping) | MEDIUM | P2 |
| TypeScript upgrade | LOW (devDep, no CVE) | LOW | P3 |
| Remove `react-app-rewired`/`customize-cra` | LOW (cleanup) | LOW | P3 |

**Priority key:**
- P1: Required for security milestone completion
- P2: Reduces residual risk, do during the same window if time allows
- P3: Housekeeping only, defer

---

## Sources

- Live `npm audit --json` output on the current repo lockfile (2026-03-24) — HIGH confidence
- npm registry `dist-tags` for `react-scripts`, `sass`, `express`, `fontawesome-subset`, `archiver` — HIGH confidence
- `server/server.js` direct inspection — single `node-sass` call site confirmed at line 3 and `sass.render()` at line 98 — HIGH confidence
- CVE advisories linked in audit output: GHSA-67hx-6x53-jw92 (babel/traverse), GHSA-qw6h-vgh9-j6wx (express XSS), GHSA-rv95-896h-c2vc (express open redirect), GHSA-968p-4wvh-cqc8 (babel ReDoS)

---
*Feature research for: FA Subsetter — security maintenance milestone*
*Researched: 2026-03-24*
