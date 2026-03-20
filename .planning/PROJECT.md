# FA Subsetter

## What This Is

A full-stack web tool for creating custom Font Awesome icon subsets. Users select Font Awesome icons (solid/brands), and the app generates optimized CSS and webfont files containing only the selected icons — reducing bundle size for production use. Built with React/Redux frontend and Express/Node.js backend.

## Core Value

Users can select Font Awesome icons and download a minimal, production-ready CSS + webfont bundle containing only what they need.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. Inferred from existing codebase. -->

- ✓ User can add icons by specifying tag, title, and type (solid/brands) — existing
- ✓ User can view all added icons in a scrollable grid — existing
- ✓ User can remove individual icons from the list — existing
- ✓ User can save icon list and trigger webfont generation — existing
- ✓ User can download generated CSS + webfont ZIP file — existing
- ✓ Icon list persists to server-side JSON file — existing
- ✓ Previously saved icons load on app startup — existing
- ✓ User receives feedback via snackbar notifications (success/error) — existing

### Active

<!-- Current scope. Building toward these. -->

- [ ] Resolve all Dependabot security vulnerabilities
- [ ] Replace deprecated node-sass with dart-sass
- [ ] Update react-scripts 3.2 → 5.x
- [ ] Update other direct dependencies with known vulnerabilities

### Out of Scope

- Full UI modernization (React 18, MUI v5) — not needed for security maintenance
- New features (batch import, autocomplete, OAuth) — maintenance focus only
- Architecture refactoring — keep changes minimal for stability

## Context

- This is a maintenance effort, not feature development
- 239 npm audit vulnerabilities (11 low, 129 moderate, 76 high, 23 critical)
- Bulk of vulnerabilities come from react-scripts@3.2.0 transitive dependencies
- node-sass is deprecated and no longer maintained
- App has minimal test coverage (one smoke test) — basic tests will be added before updates
- Dependabot alerts are actively generating email notifications on GitHub

## Constraints

- **Risk tolerance**: Security fixes only — minimize functional changes
- **Testing**: Basic tests must be written before dependency updates to catch regressions
- **Package manager**: npm (existing lockfile)
- **Compatibility**: Must maintain existing functionality after updates

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Update react-scripts 3→5 | Resolves ~200 of 239 vulns; staying on 3.x leaves most vulns unfixable | — Pending |
| Replace node-sass with sass (dart-sass) | node-sass is deprecated, has vulns, fails on newer Node versions | — Pending |
| Add basic tests before updating | Catch regressions from breaking changes in dependency updates | — Pending |

---
*Last updated: 2026-03-20 after initialization*
