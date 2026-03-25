# Phase 3: react-scripts 3 to 5 Upgrade - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

react-scripts is upgraded from 3.2.0 to 5.0.1, clearing ~200 of 239 vulnerabilities, with the app building and all tests passing under Webpack 5 and Jest 27.

Requirements: SEC-01

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

Key constraints from research:
- CRA is officially deprecated (Feb 2025) — 5.0.1 is the final stable release
- Webpack 4→5 transition: should be transparent for this codebase (no Node built-ins in frontend)
- Jest 26→27: default test environment changed from jsdom to node — may need explicit config
- react-app-rewired and customize-cra should be REMOVED (no config-overrides.js exists, scripts use react-scripts directly)
- Node 24 OpenSSL issue: set NODE_OPTIONS=--openssl-legacy-provider if webpack 5 still needs it
- Existing App.test.js uses ReactDOM.render — still valid on React 16, but may need jsdom environment config
- Stay on React 16 — do NOT upgrade to React 18
- Do NOT upgrade redux/react-redux/redux-thunk (would require React 18)
- npm overrides may be needed for residual transitive vulns (nth-check, postcss, glob-parent, semver, word-wrap, tough-cookie)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 1 tests: 4 component/Redux test files + 1 server test file (safety net)
- Phase 2: sass (dart-sass) already installed and working

### Established Patterns
- react-scripts test runner for frontend tests
- Separate test:server script for server tests
- CI=true npm test -- --watchAll=false for CI mode

### Integration Points
- package.json scripts all use react-scripts directly (NOT react-app-rewired)
- No config-overrides.js exists
- browserslist config in package.json

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
