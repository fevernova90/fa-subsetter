# Phase 2: node-sass to sass Migration - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

node-sass is removed and replaced with dart-sass, server.js uses the new synchronous sass.compile() API, and the backend SCSS compilation is verified working before react-scripts is touched.

Requirements: SEC-02, SEC-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from research:
- server.js line 5: `const sass = require('node-sass')` — single call site
- server.js uses `sass.render({ file, outputStyle }, callback)` — callback-based API
- dart-sass replacement: `sass.compile(file, { style })` returns `{ css: string }` (synchronous)
- Alternative: `sass.compileAsync(file, { style })` returns Promise
- SCSS `/` division operator in _variables.scss (`$fa-fw-width: (20em / 16)`) will emit deprecation warnings but NOT break compilation
- node-sass must be removed BEFORE react-scripts upgrade (Phase 3) — react-scripts 5 auto-detects sass implementation
- `npm install sass` (dart-sass) — latest is 1.98.0

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `server/server.js` — single file with node-sass usage (line 5 require, lines 150-195 sass.render call)
- `server/generated-css/custom-fa.scss` — entry SCSS file
- `server/generated-css/scss/_variables.scss` — contains `/` division operator

### Established Patterns
- CommonJS require() throughout server.js
- Callback-based async pattern in POST /gen-webfonts handler
- SCSS files use Font Awesome v5 variable conventions

### Integration Points
- sass.render() is called inside POST /gen-webfonts callback chain
- Result CSS written to generated-css/custom-fa.min.css
- Server tests (from Phase 1) test the endpoints but not SCSS compilation directly

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
