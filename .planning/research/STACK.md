# Stack Research

**Domain:** Dependency security upgrade — legacy React/Express CRA app
**Researched:** 2026-03-24
**Confidence:** HIGH (verified against official sources, npm registry data, GitHub issues)

---

## Context

This is a **maintenance-only upgrade**, not a new stack selection. The existing app runs React 16 + Express 4 + Redux + CRA (`react-scripts` 3.2.0) with 239 `npm audit` vulnerabilities. The goal is minimum-footprint changes that clear security alerts while preserving all existing functionality.

The upgrade scope:
1. `react-scripts` 3.2.0 → 5.0.1 (the final stable release — CRA is deprecated and will not release 5.1+)
2. `node-sass` 4.x → `sass` (Dart Sass, latest stable)
3. Selected direct dependencies with exploitable CVEs
4. Residual transitive vulnerabilities patched via `npm overrides`

---

## Recommended Stack

### Upgrade Targets

| Package | Current | Target | Why This Version |
|---------|---------|--------|-----------------|
| `react-scripts` | 3.2.0 | **5.0.1** | Last stable release (April 2022). Bundles Webpack 5, Jest 27, PostCSS 8, ESLint 8. Clears ~200 of 239 vulnerabilities. 5.1.x exists only as a pre-release (`next` tag) and is never going to land as stable — CRA is deprecated. Confidence: HIGH |
| `node-sass` | ^4.13.0 | **remove** | Deprecated. No longer maintained. Fails on Node 18+. React-scripts 5 auto-detects `sass` (Dart Sass) as the SCSS implementation — no config change needed. Confidence: HIGH |
| `sass` | (not installed) | **^1.77.0** | Dart Sass — the official replacement for node-sass. Install as a direct dependency; react-scripts 5's sass-loader will auto-use it. Any 1.x version works; pin to latest 1.x. Confidence: HIGH |
| `archiver` | ^3.1.1 | **^7.0.1** | Version 3.x has known transitive CVEs. Current latest is 7.0.1 (Feb 2024). Used only in the Express server for ZIP generation — no API breaking changes affecting the existing usage pattern. Confidence: MEDIUM (API should be compatible; verify in test) |
| `express` | ^4.17.1 | **^4.21.2** | Stay on 4.x — Express 5 (released as `latest` on npm March 2025) has breaking changes in path routing syntax that would require manual code changes outside the maintenance scope. 4.21.2 is the latest 4.x release and has no known CVEs. Confidence: HIGH |
| `concurrently` | ^5.0.0 | **^9.2.1** | Dev dependency. Current 5.x has lodash CVEs. 9.x is the latest; fully API-compatible for the simple use in `dev`/`start` scripts. Confidence: HIGH |
| `fontawesome-subset` | ^1.1.0 | **^4.6.0** | Current 1.x is several major versions behind (latest is 4.6.0). Supports FA 5.x through 7.x. The API signature for the main `subset()` call is stable. Confidence: MEDIUM (verify call signature; breaking changes possible across major versions) |

### Do Not Upgrade

| Package | Current | Why NOT to Upgrade |
|---------|---------|-------------------|
| `react` | ^16.12.0 | React 17 and 18 are compatible with react-scripts 5 but upgrading React itself is a separate scope item with its own risk. react-scripts 5 works fine with React 16.12+. Confidence: HIGH |
| `react-dom` | ^16.12.0 | Same as `react` — keep in sync with `react`. Confidence: HIGH |
| `react-redux` | ^7.1.3 | 7.x supports React 16.8+ and has no known CVEs. React-Redux 8.x and 9.x require React 18. Do not upgrade. Confidence: HIGH |
| `redux` | ^4.0.4 | No known CVEs in the redux 4.x JS package. Redux 5.x has breaking changes for TypeScript users but the app uses JS. Upgrading provides no security benefit and adds risk. Confidence: MEDIUM |
| `redux-thunk` | ^2.3.0 | No CVEs. Redux Thunk 3.x requires Redux 5. Keep at 2.x to stay compatible with Redux 4. Confidence: HIGH |
| `@material-ui/core` | ^4.7.0 | MUI v4. Upgrading to v5 is a major UI rewrite (styled-engine swap, component renames). Out of scope for a security maintenance milestone. Confidence: HIGH |
| `@material-ui/icons` | ^4.5.1 | Keep in sync with `@material-ui/core`. Confidence: HIGH |
| `@fortawesome/fontawesome-free` | ^5.11.2 | No CVEs. FA 6.x is available but upgrading would require matching icon name/path changes throughout the UI. Out of scope. Confidence: HIGH |
| `typescript` | ^3.7.2 | Dev dependency. Used loosely (not a TS project). react-scripts 5 bundles its own TypeScript support and does not depend on this devDep. Leave as-is or remove. Confidence: MEDIUM |
| `react-app-rewired` / `customize-cra` | 2.1.5 / 0.9.1 | These exist as devDeps. react-app-rewired does support react-scripts 5 (fixed in PR #530). However, the existing `config-overrides.js` (if any) must be verified. If no `config-overrides.js` exists, these devDeps are dead weight — remove them. Confidence: MEDIUM |

### Residual Vulnerability Mitigation

After upgrading react-scripts to 5.0.1, a small set of transitive vulnerabilities remain in deeply pinned subdependencies that CRA never updated. Apply `npm overrides` in `package.json` to force safe versions:

```json
"overrides": {
  "nth-check": "^2.0.1",
  "postcss": "^8.4.31",
  "glob-parent": "^5.1.2",
  "semver": "^7.5.4",
  "word-wrap": "^1.2.4",
  "tough-cookie": "^4.1.3"
}
```

**How overrides work:** npm 8.3+ `overrides` in `package.json` force a specific version of a nested dependency regardless of what the parent requests. This is the standard 2024/2025 approach for unfixable transitive CVEs in abandoned packages like CRA. Minimum npm version required: **8.3.0** (ships with Node 16+). Confidence: HIGH — this exact override set is documented across multiple CRA vulnerability issues (#12790, #13186, #13671).

---

## Installation — Order of Operations

Order matters. Follow this sequence to avoid partial breakage:

### Step 1 — Write Tests First

Before touching any dependency, verify the one existing test passes:

```bash
npm test -- --watchAll=false
```

This gives a baseline to detect regressions after upgrades.

### Step 2 — Remove node-sass, Add sass

```bash
npm uninstall node-sass
npm install sass
```

This can be done while still on react-scripts 3.x to verify it compiles. (react-scripts 3.x also supports `sass`.)

### Step 3 — Upgrade react-scripts

```bash
npm install react-scripts@5.0.1
```

Delete `node_modules` and `package-lock.json` first to force a clean resolution:

```bash
rm -rf node_modules package-lock.json
npm install react-scripts@5.0.1
npm install
```

Then verify the build and test:

```bash
npm run build
npm test -- --watchAll=false
```

### Step 4 — Apply npm overrides

Add the `overrides` block to `package.json`, then force reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
npm audit
```

### Step 5 — Upgrade remaining direct dependencies

```bash
npm install archiver@^7.0.1
npm install concurrently@^9.2.1 --save-dev
npm install fontawesome-subset@^4.6.0
npm install express@^4.21.2
```

Run `npm audit` and the test suite after each install to isolate regressions.

### Step 6 — Clean up dead devDeps

Check if `config-overrides.js` exists at project root:

```bash
ls config-overrides.js
```

If it does not exist, remove the unused devDeps:

```bash
npm uninstall react-app-rewired customize-cra
```

---

## Alternatives Considered

| Recommended | Alternative | Why Not |
|-------------|-------------|---------|
| `react-scripts` 5.0.1 | Vite migration | Correct long-term direction but out-of-scope for a security-only maintenance milestone. Would require ejecting CRA tooling, updating test runner, rewriting `vite.config.ts`. Months of work vs. one sprint. |
| `react-scripts` 5.0.1 | Stay on 3.2.0 + overrides | Overrides cannot reach all vulns locked deep inside webpack 4 deps. CRA 3.x ships Webpack 4, which itself has unfixable CVEs in its dependency tree. |
| `express` 4.21.2 | Express 5.x | Express 5 became npm `latest` on March 31, 2025, but the path routing syntax change is a breaking change requiring manual code edits. LTS support for 4.x runs until October 2026. No security benefit justifies the risk now. |
| `npm overrides` | `npm-force-resolutions` | `npm-force-resolutions` is a third-party hack for pre-npm-7. Native `overrides` (npm 8.3+) is the standard supported mechanism. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `node-sass` | Deprecated since 2022. Wraps LibSass which is also deprecated. Fails to compile on Node 18+. Has known CVEs. No bug fixes will ever be released. | `sass` (Dart Sass) — the official reference implementation |
| `react-scripts` 3.x | Ships Webpack 4 with deep CVE chains in `terser-webpack-plugin`, `node-forge`, `url-parse`, etc. that cannot be overridden without breaking the build. | `react-scripts` 5.0.1 |
| `react-scripts` `next` channel (5.1.0-next.26) | Pre-release. CRA is deprecated. The main branch has been frozen. This pre-release will never be promoted to stable. | `react-scripts` 5.0.1 for now; long-term: Vite |
| `redux-thunk` 3.x | Requires Redux 5. Upgrading Redux 4 → 5 has TS-centric breaking changes and no security benefit for this app. | `redux-thunk` 2.x (current) |

---

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| `react-scripts@5.0.1` | `react@16.12+`, `react@17`, `react@18` | Templates assume React 18's `createRoot`, but the app continues to work with `ReactDOM.render` (React 16) — just produces a console warning in dev. Do not change the render call. |
| `react-scripts@5.0.1` | `sass@1.x` (not `node-sass`) | CRA 5 removed node-sass from its allowed implementations. Installing `sass` is required for any SCSS files. |
| `react-scripts@5.0.1` | `react-app-rewired@2.x` | Supported after react-app-rewired PR #530. Verify `config-overrides.js` exists before keeping the dependency. |
| `react-redux@7.x` | `react@16.8+` only | React-Redux 8+ requires React 18. Do not upgrade react-redux while staying on React 16. |
| `redux-thunk@2.x` | `redux@4.x` | Redux Thunk 3 requires Redux 5. Keep at 2.x. |
| `archiver@7.x` | Node 16+ | archiver 7.x drops Node 14 support. The app uses Node 16+ (required by react-scripts 5 anyway). |
| `npm overrides` | npm 8.3+ (Node 16+) | Node 16+ ships with npm 8.3+. If running Node 14, upgrade Node first. |

---

## Sources

- [Create React App CHANGELOG](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md) — 3.x→4.x→5.x breaking changes, Webpack 5, Jest 27, Node requirements. Confidence: HIGH
- [CRA Docs: Adding a Sass Stylesheet](https://create-react-app.dev/docs/adding-a-sass-stylesheet/) — Confirmed: `sass` package required, `node-sass` deprecated. Confidence: HIGH
- [Express 5.1.0 release announcement](https://expressjs.com/2025/03/31/v5-1-latest-release.html) — Express 5 became npm `latest` March 31 2025; 4.x in maintenance until Oct 2026. Confidence: HIGH
- [react-app-rewired issue #587](https://github.com/timarney/react-app-rewired/issues/587) — Confirmed CRA 5 support added via PR #530. Confidence: HIGH
- [CRA issue #13186](https://github.com/facebook/create-react-app/issues/13186) — Residual vulns in react-scripts 5.0.1 (nth-check, postcss). Confidence: HIGH
- [CRA issue #12790](https://github.com/facebook/create-react-app/issues/12790) — npm overrides workaround confirmed. Confidence: HIGH
- [fontawesome-subset releases](https://github.com/omacranger/fontawesome-subset/releases) — Latest is 4.6.0; FA 5.x+ supported. Confidence: HIGH
- [npm overrides documentation](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) — Native npm 8.3+ feature; standard approach. Confidence: HIGH
- WebSearch: redux 4.x/5.x, react-redux 7.x/8.x/9.x peer deps, concurrently 9.x — Confidence: MEDIUM (cross-verified with npm registry data)

---

*Stack research for: fa-subsetter dependency security upgrade milestone*
*Researched: 2026-03-24*
