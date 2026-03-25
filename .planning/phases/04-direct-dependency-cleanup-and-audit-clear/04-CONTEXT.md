# Phase 4: Direct Dependency Cleanup and Audit Clear - Context

**Gathered:** 2026-03-25
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

All remaining direct-dependency vulnerabilities are resolved, housekeeping upgrades are applied, and npm audit reports zero critical and zero high severity findings.

Requirements: SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, HOUSE-01, HOUSE-02, HOUSE-03

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase.

Key constraints from research:
- Current state: 44 vulnerabilities (8 critical, 17 high, 10 low, 9 moderate)
- fontawesome-subset 1.1.0 → 4.6.0 (critical xmldom CVE) — verify call signature compatibility
- express 4.17.1 → 4.21.2+ (XSS + open redirect) — do NOT upgrade to Express 5.x
- archiver 3.1.1 → 7.x (housekeeping, no active CVE)
- concurrently 5.0.0 → 9.x (moderate yargs vuln)
- react-app-rewired and customize-cra already removed in Phase 3
- Run npm audit fix after direct dep upgrades for remaining transitive vulns
- npm overrides may be needed for deeply nested deps that npm audit fix can't reach
- Target: zero critical, zero high severity in npm audit

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- server/server.js — uses fontawesomeSubset(mapIconsToSubset(icons), outputPath) on line ~162
- server/server.js — uses archiver('zip', { zlib: { level: 9 } }) in zippingFiles()
- package.json scripts — use concurrently for dev mode

### Established Patterns
- Direct dependency upgrades one at a time, verify after each
- npm audit fix for transitive deps after direct deps are done

### Integration Points
- fontawesome-subset call signature must match: fontawesomeSubset(iconsObject, outputPath)
- archiver API: createWriteStream, archive.file(), archive.directory(), archive.finalize()
- concurrently usage in npm scripts only

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase.

</deferred>
