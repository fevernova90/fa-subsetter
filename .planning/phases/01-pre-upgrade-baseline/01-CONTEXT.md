# Phase 1: Pre-Upgrade Baseline - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

A verified test baseline and clean lockfile exist before any dependency is changed — so regressions from subsequent upgrades are detectable.

Requirements: TEST-01, TEST-02, TEST-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Use ROADMAP phase goal, success criteria, and codebase conventions to guide decisions.

Key constraints from research:
- Existing App.test.js uses ReactDOM.render (valid for React 16, will need updating in Phase 3)
- Server uses node-sass (callback-based sass.render API) — tests should verify this works before migration
- Three Express endpoints to cover: GET /download, GET /saved-icons, POST /gen-webfonts
- Use @testing-library/react for component tests where possible with react-scripts 3.2

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/App.test.js` — existing smoke test (renders without crashing)
- `src/store.js` — Redux store with iconReducer, notiReducer
- `src/reducers/iconReducer.js`, `src/reducers/notiReducer.js` — state management
- `src/actions/iconActions.js` — addIcon, deleteIcon, saveAndGenerate, downloadFiles, getIcons
- `server/server.js` — Express server with 3 routes

### Established Patterns
- React 16 with class-less functional components using hooks
- Redux with react-redux connect() HOC pattern
- Jest via react-scripts test runner
- Fetch-based API communication

### Integration Points
- Tests run via `npm test` (react-scripts test)
- Server tests need separate setup (not CRA test runner)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. Refer to ROADMAP phase description and success criteria.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
