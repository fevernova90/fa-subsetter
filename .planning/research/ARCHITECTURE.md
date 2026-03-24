# Architecture Research

**Domain:** CRA + Express full-stack app — dependency security upgrade migration
**Researched:** 2026-03-24
**Confidence:** HIGH (official docs + multiple verified sources)

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Browser)                        │
├──────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌───────────┐  │
│  │  Icons   │  │AddIcon   │  │ Generator │  │  Notifi-  │  │
│  │          │  │  Form    │  │           │  │  cation   │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └─────┬─────┘  │
│       │             │              │               │        │
│  ┌────▼─────────────▼──────────────▼───────────────▼─────┐  │
│  │              Redux Store (connect HOC)                 │  │
│  │         iconReducer | notiReducer | thunks            │  │
│  └────────────────────────┬───────────────────────────────┘  │
│                           │ fetch()                          │
├───────────────────────────┼──────────────────────────────────┤
│                    Build toolchain                           │
│  react-scripts (CRA)  ←→  node-sass / sass                  │
│  webpack (bundler)    ←→  PostCSS / autoprefixer            │
│  ESLint               ←→  babel                             │
└───────────────────────────┼──────────────────────────────────┘
                            │ HTTP (proxy :8080 in dev)
┌───────────────────────────┼──────────────────────────────────┐
│                    Backend (Express)                         │
├──────────────────────────────────────────────────────────────┤
│  GET /saved-icons   POST /gen-webfonts   GET /download       │
│                           │                                  │
│                   ┌───────▼────────┐                         │
│                   │  node-sass /   │                         │
│                   │     sass       │                         │
│                   │  (SCSS→CSS)    │                         │
│                   └───────┬────────┘                         │
│                   fontawesome-subset + archiver              │
│                   server/generated-css/  (file I/O)          │
└──────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Affected by Upgrade |
|-----------|----------------|---------------------|
| `src/index.js` | Mounts React app via `ReactDOM.render()` | react-scripts 5 ships React 18 peer expectation — `ReactDOM.render` still works with React 16, no forced change |
| `src/App.js` | Redux Provider, MUI ThemeProvider, layout | `Grid justify=` prop deprecated in MUI 4.12+, surfaces as warning |
| `src/App.test.js` | Smoke test using `ReactDOM.render` | Needs update to React Testing Library pattern before upgrade |
| `src/serviceWorker.js` | Legacy CRA service worker helper | CRA v4+ moved to workbox-based SW; this file is unused but harmless |
| `server/server.js` | SCSS compilation via `sass.render()` | **Core breaking change**: `node-sass` API removed, `sass` package uses `compile()` |
| `server/generated-css/scss/_variables.scss` | Font Awesome variables including division | Dart Sass deprecates `/` as division operator — produces warnings, not errors in current sass |

## Recommended Project Structure

No structural changes needed. The upgrade is in-place within the existing layout:

```
fa-subsetter/
├── src/                      # No file moves needed
│   ├── index.js              # ReactDOM.render stays (React 16 retained)
│   ├── App.js                # justify → justifyContent (1-line fix)
│   ├── App.test.js           # Replace ReactDOM.render test with @testing-library/react
│   ├── serviceWorker.js      # Leave as-is (not registered, causes no harm)
│   ├── components/           # No changes unless ESLint 8 flags issues
│   ├── actions/              # No changes
│   └── reducers/             # No changes
│
├── server/
│   └── server.js             # sass.render() → sass.compile()  ← KEY CHANGE
│
├── package.json              # node-sass removed, sass added; react-scripts bumped
└── package-lock.json         # Full regeneration required after upgrade
```

### Structure Rationale

- **No folder restructuring:** Project scope is security maintenance only. Moving files introduces regression risk with no security benefit.
- **server/server.js is the only functional code change required:** All other changes are cosmetic (warnings) or test scaffolding.

## Architectural Patterns

### Pattern 1: Phased Upgrade — Tests First

**What:** Write regression tests before touching dependencies so breakage is detectable.
**When to use:** Always before dependency major-version upgrades on an app with minimal tests.
**Trade-offs:** Adds one phase of overhead but is the only safe way to know if the upgrade breaks behavior.

**Sequence:**
```
Phase A: Write tests (smoke + key behaviors)
Phase B: node-sass → sass (isolated, backend-only)
Phase C: react-scripts 3 → 5 (frontend build, broader blast radius)
Phase D: Audit remaining direct-dependency vulns
```

**Rationale for this order:** node-sass → sass affects only `server/server.js` and zero frontend files. It is the smallest possible change and the easiest to verify in isolation. react-scripts 3 → 5 touches webpack, ESLint, Jest, PostCSS, and peer dependencies all at once — it must come after tests exist and after the simpler backend change is confirmed working.

### Pattern 2: node-sass → sass Migration (Backend)

**What:** Replace the deprecated callback-based `sass.render()` with the modern synchronous `sass.compile()` in `server/server.js`.
**When to use:** Whenever the SCSS compilation block in `server/server.js` is touched.
**Trade-offs:** `compile()` (synchronous, path-based) is 2x faster than `compileAsync()` due to Dart Sass's JS interop overhead. For a single-file compile triggered per HTTP request, sync is appropriate.

**Before (node-sass / legacy API):**
```javascript
const sass = require('node-sass');

sass.render(
  {
    file: path.join(__dirname, 'generated-css/custom-fa.scss'),
    outputStyle: 'compressed'
  },
  (err, result) => {
    if (err) { ... }
    else { /* result.css is a Buffer */ }
  }
);
```

**After (sass / modern API):**
```javascript
const sass = require('sass');

try {
  const result = sass.compile(
    path.join(__dirname, 'generated-css/custom-fa.scss'),
    { style: 'compressed' }
  );
  // result.css is a string, not a Buffer
  const cssContent = result.css;
  // Use cssContent instead of result.css.toString()
} catch (err) {
  // compile() throws synchronously on SCSS error
}
```

**Key API differences:**
- `outputStyle` option renamed to `style`
- `result.css` is now a `string`, not a `Buffer` (no `.toString()` needed)
- Errors are thrown as exceptions, not passed to a callback
- The surrounding `fs.writeFile` callback nesting must be refactored — `compile()` is sync, so the callback-within-callback structure in `server.js` lines 150–196 flattens into try/catch + direct `fs.writeFile` call

### Pattern 3: react-scripts 3 → 5 Upgrade

**What:** Bump the `react-scripts` version in `package.json`, delete `node_modules`, and reinstall.
**When to use:** After node-sass migration is confirmed working and tests are written.
**Trade-offs:** Broad blast radius — upgrades webpack 4→5, ESLint 6→8, Jest 24→27, PostCSS 7→8 all at once. Cannot be done incrementally.

**Known breaking changes in this project's codebase:**

1. **ESLint 8 peer conflict** — react-scripts 3 shipped with ESLint ~6. If a standalone `eslint` version is present in `devDependencies`, it will conflict. Solution: remove any manually-installed `eslint` from `devDependencies` before upgrading; let react-scripts 5 own it.

2. **`customize-cra` / `react-app-rewired` compatibility** — `react-app-rewired@2.1.5` is installed. react-app-rewired 2.x was built for CRA 3/webpack 4. For CRA 5/webpack 5, `react-app-rewired@2.2.x+` is required. However, this project's `package.json` scripts use `react-scripts` directly (not `react-app-rewired start`), so `react-app-rewired` and `customize-cra` are currently **unused devDependencies** — they can be removed during the upgrade to eliminate the compatibility risk.

3. **Webpack 5 node core module polyfills removed** — This project does not import any Node.js built-ins (`fs`, `path`, `crypto`, etc.) in frontend code. The `fs` and `path` usage is exclusively in `server/server.js` (Node.js, not bundled by webpack). No polyfill configuration is needed.

4. **`Grid justify` prop** — MUI v4.12+ deprecated `justify` in favour of `justifyContent`. react-scripts 5 does not enforce this, but upgraded ESLint may surface it as a warning. `src/App.js` line 133 uses `justify='center'` — change to `justifyContent='center'`.

5. **`ReactDOM.render` in tests** — `src/App.test.js` uses `ReactDOM.render` directly. Jest 27 (shipped with react-scripts 5) still supports this with React 16, but it is fragile. Replace with `@testing-library/react` render before the upgrade — this is covered by "write tests first" phase.

6. **`serviceWorker.js`** — The legacy CRA service worker registration file remains in the project but `serviceWorker.unregister()` is the only call in `index.js`. No breakage expected; no action needed.

7. **`SKIP_PREFLIGHT_CHECK`** — If `react-app-rewired`/`customize-cra` are not removed first, the CRA preflight check may detect version conflicts. Adding `SKIP_PREFLIGHT_CHECK=true` to `.env` silences the check but masks real issues; prefer removing the unused packages instead.

## Data Flow

### Upgrade Impact on Data Flow

The core data flow (React → Redux → fetch → Express) is unaffected. Only the SCSS compilation step inside the `POST /gen-webfonts` handler changes its internal mechanism.

```
Save and Generate Flow — before and after upgrade:

User click → Redux thunk → fetch POST /gen-webfonts
                                        ↓
                            [BEFORE] sass.render({ file, outputStyle }, callback)
                            [AFTER]  result = sass.compile(file, { style })
                                        ↓
                            fontawesome-subset(...)
                                        ↓
                            fs.writeFile(custom-fa.min.css, result.css)
                                        ↓
                            res.json(icons)
```

**What does NOT change:**
- Redux action types and reducers
- All fetch() endpoints and their URL paths
- Express routing (`/gen-webfonts`, `/download`, `/saved-icons`)
- File I/O locations (`generated-css/` directory)
- Frontend component tree and Redux connect() bindings

### Build Order Implications

```
Upgrade sequence dependencies:

1. Write tests
   └── Required before any dep changes (catch regressions)

2. Replace node-sass with sass
   ├── Only touches: server/server.js (sass.render → sass.compile)
   ├── Only touches: package.json (node-sass removed, sass added)
   └── Verify: npm start, POST /gen-webfonts produces valid ZIP

3. Upgrade react-scripts 3 → 5
   ├── Touches: package.json (react-scripts version bump)
   ├── Touches: devDependencies (remove react-app-rewired, customize-cra)
   ├── Touches: src/App.js (justify → justifyContent, 1 line)
   ├── Action: rm -rf node_modules && npm install
   └── Verify: npm run build succeeds, npm test passes, app loads

4. Address remaining direct-dep vulns
   └── Only after step 3 confirms app is working
```

## Scaling Considerations

Not applicable — this is a single-user local tool, not a multi-user service. Scaling is out of scope per PROJECT.md constraints.

## Anti-Patterns

### Anti-Pattern 1: Upgrading react-scripts Before Fixing node-sass

**What people do:** Bump react-scripts first because it resolves the most CVEs.
**Why it's wrong:** react-scripts 5 ships with built-in sass support that expects the `sass` package. If `node-sass` is still present when react-scripts 5 is installed, there is a version conflict: react-scripts 5 internally uses `sass-loader` with the `sass` (dart-sass) package. Having both `node-sass` and `sass` installed simultaneously produces confusing build failures and double-compile warnings.
**Do this instead:** Remove `node-sass`, add `sass`, verify backend compiles, then upgrade react-scripts.

### Anti-Pattern 2: Keeping react-app-rewired and customize-cra During the Upgrade

**What people do:** Leave unused devDependencies in place to avoid changing `package.json` more than necessary.
**Why it's wrong:** `react-app-rewired@2.1.5` was built against CRA 3/webpack 4. react-scripts 5 triggers CRA's preflight check to flag version mismatches. The packages are not used in any npm scripts in this project, so retaining them provides zero benefit while adding friction to the upgrade.
**Do this instead:** Remove both from `devDependencies` during the react-scripts upgrade step.

### Anti-Pattern 3: Using sass.compile() as a Drop-in for sass.render()

**What people do:** Rename `sass.render` to `sass.compile` and pass the same options object.
**Why it's wrong:** The options object is not compatible. `outputStyle` is renamed to `style`. The first argument to `compile()` is the file path as a positional string, not inside an options object. The result's `.css` property is a `string` not a `Buffer`.
**Do this instead:** Rewrite the call site completely, not just rename the function.

### Anti-Pattern 4: Wrapping sass.compile() in the Existing Callback Chain

**What people do:** Call `sass.compile()` inside the same nested `fs.writeFile` callback structure that was built for `sass.render()`.
**Why it's wrong:** `sass.compile()` is synchronous — there is no callback to receive. Wrapping it in continuation-style code is nonsensical and makes error handling harder.
**Do this instead:** Use `try/catch` around `sass.compile()`, then call `fs.writeFile` with the resulting CSS string directly. The nesting depth in `server.js` lines 142–199 can be reduced by one level.

## Integration Points

### Internal Boundaries — Changed by Upgrade

| Boundary | Before | After | Change Required |
|----------|--------|-------|-----------------|
| `server.js` ↔ SCSS compiler | `node-sass` callback API | `sass` synchronous API | Rewrite `sass.render()` block (~15 lines) |
| CRA build ↔ SCSS files | Not applicable (no `.scss` in `src/`) | Not applicable | No change needed |
| `package.json` scripts ↔ CRA | `react-scripts@3.2.0` | `react-scripts@5.0.1` | Bump version, delete node_modules, reinstall |
| `devDependencies` ↔ webpack | `react-app-rewired@2.1.5`, `customize-cra@0.9.1` (unused) | Removed | Remove both packages |

### SCSS Compatibility Note

The Font Awesome SCSS files in `server/generated-css/scss/` contain `/` as a division operator (e.g., `$fa-fw-width: (20em / 16)` in `_variables.scss`). Dart Sass treats this as deprecated (not a hard error in current sass versions). It will produce deprecation warnings during the `POST /gen-webfonts` SCSS compilation but will not break the build. Suppression via `--quiet-deps` or `silenceDeprecations: ['slash-div']` is available if warnings become noise. This does not need to be fixed for the upgrade to succeed — it is a future concern for when Dart Sass 2.0.0 is released.

## Sources

- [Create React App CHANGELOG (3.x → 5.x)](https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md) — HIGH confidence
- [Sass Legacy JS API breaking changes](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/) — HIGH confidence (official Sass docs)
- [Sass: Slash as Division deprecation](https://sass-lang.com/documentation/breaking-changes/slash-div/) — HIGH confidence (official Sass docs)
- [CRA issue: Move away from node-sass](https://github.com/facebook/create-react-app/issues/10045) — MEDIUM confidence (GitHub issue thread)
- [Webpack 5 node core polyfills removed](https://github.com/facebook/create-react-app/issues/11756) — MEDIUM confidence (GitHub issue)
- [MUI Grid justify → justifyContent deprecation](https://github.com/mui/material-ui/issues/25540) — MEDIUM confidence (GitHub issue)
- [Migrating from Node-Sass to Dart-Sass](https://dev.to/ccreusat/migrating-from-node-sass-to-sass-dart-sass-with-npm-3g3c) — LOW confidence (community article, patterns verified against official docs)

---
*Architecture research for: react-scripts 3→5 and node-sass→sass upgrade in CRA + Express app*
*Researched: 2026-03-24*
