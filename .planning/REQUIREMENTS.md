# Requirements: FA Subsetter

**Defined:** 2026-03-25
**Core Value:** Users can select Font Awesome icons and download a minimal, production-ready CSS + webfont bundle containing only what they need.

## v1 Requirements

Requirements for security maintenance milestone. Each maps to roadmap phases.

### Testing

- [x] **TEST-01**: Component render tests exist for Icons, AddIconForm, and Generator components
- [x] **TEST-02**: Redux store initializes correctly and key actions (addIcon, deleteIcon) dispatch properly
- [x] **TEST-03**: Server API smoke tests cover all 3 endpoints (GET /download, GET /saved-icons, POST /gen-webfonts)

### Security — Build Toolchain

- [ ] **SEC-01**: react-scripts upgraded from 3.2.0 to 5.0.1, resolving ~64 transitive vulnerabilities
- [ ] **SEC-02**: node-sass replaced with sass (dart-sass) in package.json and server.js
- [ ] **SEC-03**: SCSS compilation in server.js uses dart-sass API (sass.compile or sass.compileAsync)

### Security — Direct Dependencies

- [ ] **SEC-04**: fontawesome-subset upgraded from 1.1.0 to 4.6.0, resolving critical xmldom CVE
- [ ] **SEC-05**: express upgraded from 4.17.1 to 4.21.2+, resolving XSS and open redirect CVEs
- [ ] **SEC-06**: npm audit fix run to clear remaining transitive vulnerabilities

### Security — Audit Targets

- [ ] **SEC-07**: npm audit reports zero critical vulnerabilities
- [ ] **SEC-08**: npm audit reports zero high severity vulnerabilities
- [ ] **SEC-09**: App builds successfully and all tests pass after updates

### Housekeeping

- [ ] **HOUSE-01**: concurrently upgraded from 5.0.0 to 9.x, resolving moderate yargs vuln
- [ ] **HOUSE-02**: archiver upgraded from 3.1.1 to 7.x
- [ ] **HOUSE-03**: react-app-rewired and customize-cra removed if no config-overrides.js exists

## v2 Requirements

Deferred to future milestones. Tracked but not in current roadmap.

### Modernization

- **MOD-01**: React 16 upgraded to React 18 with createRoot API migration
- **MOD-02**: Material-UI v4 migrated to MUI v5
- **MOD-03**: CRA/react-scripts replaced with Vite
- **MOD-04**: @fortawesome/fontawesome-free upgraded from v5 to v6
- **MOD-05**: TypeScript upgraded from 3.7 to 5.x

## Out of Scope

| Feature | Reason |
|---------|--------|
| React 18 migration | Requires ReactDOM.render→createRoot, concurrent mode validation — separate milestone |
| Vite migration | Changes too many variables; do after security is clean |
| MUI v5 migration | No CVEs in MUI v4; pure UI work, not security |
| FA6 icon set upgrade | No FA5 CVE; icon name changes require audit |
| CRA eject | Creates permanent maintenance burden; vulns fixable without ejecting |
| npm audit fix --force without prep | Breaks node-sass import and may break fontawesome-subset silently |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| TEST-01 | Phase 1 | Complete |
| TEST-02 | Phase 1 | Complete |
| TEST-03 | Phase 1 | Complete |
| SEC-01 | Phase 3 | Pending |
| SEC-02 | Phase 2 | Pending |
| SEC-03 | Phase 2 | Pending |
| SEC-04 | Phase 4 | Pending |
| SEC-05 | Phase 4 | Pending |
| SEC-06 | Phase 4 | Pending |
| SEC-07 | Phase 4 | Pending |
| SEC-08 | Phase 4 | Pending |
| SEC-09 | Phase 4 | Pending |
| HOUSE-01 | Phase 4 | Pending |
| HOUSE-02 | Phase 4 | Pending |
| HOUSE-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 15 total
- Mapped to phases: 15
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-25*
*Last updated: 2026-03-25 after roadmap creation*
