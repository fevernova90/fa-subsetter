# Testing Patterns

**Analysis Date:** 2026-03-20

## Test Framework

**Runner:**
- React Scripts (Create React App) uses Jest under the hood
- No explicit Jest config file; defaults inherited from `react-scripts`
- No vitest, mocha, or other alternative test runners

**Assertion Library:**
- Native Jest assertions (implicit, no separate library imported)

**Run Commands:**
```bash
npm test              # Run tests in watch mode (via react-scripts)
npm run build         # Build for production
npm run dev           # Development mode with concurrent server/CRA
npm start             # Production mode
```

**Notes:**
- `package.json` defines `"test": "react-scripts test"`
- No test coverage reporting configured
- No test-specific configuration files present

## Test File Organization

**Location:**
- Co-located: Single test file at `src/App.test.js` co-located with `src/App.js`
- No other test files found in codebase
- Test coverage is minimal (only 1 test total)

**Naming:**
- Pattern: `{ComponentName}.test.js`
- Example: `App.test.js`

**Structure:**
```
src/
├── App.js
├── App.test.js          # Minimal smoke test
├── components/
│   ├── AddIconForm.js
│   ├── Icons.js
│   ├── Generator.js
│   └── [no tests]
├── actions/
│   ├── iconActions.js
│   └── [no tests]
└── reducers/
    ├── iconReducer.js
    └── [no tests]
```

## Test Structure

**Suite Organization:**
```javascript
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
```

**From `src/App.test.js`:**
- Single `it()` block (Jest test case)
- No `describe()` blocks organizing test suites
- No test setup/teardown helpers

**Patterns:**
- Setup: DOM element created inline (`document.createElement('div')`)
- Render: Direct `ReactDOM.render()` call (not using React Testing Library)
- Teardown: `ReactDOM.unmountComponentAtNode(div)` called inline
- No custom test utilities or helper functions

## Mocking

**Framework:**
- Jest mocking capabilities available but not used
- No mock modules, mock functions, or jest.mock() calls in codebase
- No spy functions

**Patterns:**
- Not applicable; no mocking examples in current tests

**What to Mock (if implementing tests):**
- Redux store for component tests (use `Provider` wrapper)
- API fetch calls to `/saved-icons`, `/gen-webfonts`, `/download` endpoints
- Material-UI `makeStyles` hooks
- Browser APIs like `window.URL.createObjectURL()`

**What NOT to Mock:**
- Redux reducers (test as pure functions)
- Component event handlers (test with simulated user actions)
- Material-UI components (use real components for integration)

## Fixtures and Factories

**Test Data:**
- Not used; no test fixtures or factories present
- No sample data generators or test data builders

**Suggested Pattern (for future implementation):**
```javascript
// Example fixture for icon data
const mockIcon = {
  title: 'Home',
  tag: 'home',
  type: 'fas'
};

const mockIcons = [
  { title: 'Home', tag: 'home', type: 'fas' },
  { title: 'Settings', tag: 'cog', type: 'fas' }
];
```

**Location (if implemented):**
- Should be placed in `src/__fixtures__/` or `src/__mocks__/`
- Or co-located as separate file: `AddIconForm.fixtures.js`

## Coverage

**Requirements:**
- Not configured; no coverage thresholds set
- No coverage reports generated or tracked
- Current effective coverage: < 5% (only 1 smoke test for entire app)

**View Coverage (if configured):**
```bash
npm test -- --coverage     # Would generate coverage report
```

**Current State:**
- Zero coverage for Redux actions (`iconActions.js`, `notiActions.js`)
- Zero coverage for Redux reducers (`iconReducer.js`, `notiReducer.js`)
- Zero coverage for form components (`AddIconForm.js`, `Generator.js`)
- Zero coverage for UI components (`Icons.js`, `NotificationBar.js`)
- Minimal coverage for main App component (smoke test only)

## Test Types

**Unit Tests:**
- Not implemented
- Would test:
  - Reducer functions with various action types
  - Action creators with different payloads
  - Pure utility functions in `server.js` (if extracted)

**Integration Tests:**
- Not implemented
- Would test:
  - Component rendering with Redux state
  - User interactions triggering Redux dispatch
  - Form submission flow (AddIconForm → action → reducer → UI update)

**E2E Tests:**
- Not present
- No Cypress, Selenium, or Playwright configuration

## Common Patterns

**Async Testing:**
- Not present in current tests
- No use of `async/await`, `.then()`, or callbacks in test code
- Would need for testing:
  - Fetch calls in `iconActions.js`
  - Redux thunk action behavior

**Expected Async Pattern (not implemented):**
```javascript
it('fetches icons on component mount', async () => {
  // Would require mocking fetch and testing thunk dispatch
  // Currently no such pattern exists
});
```

**Error Testing:**
- Not present in current tests
- No error assertions or error scenario testing
- Would need for validating:
  - Error notifications via `pushError()` action
  - Validation errors in `addIcon()` (duplicate tag/title)
  - Network error handling in action creators

**Expected Error Pattern (not implemented):**
```javascript
it('shows error when tag is duplicated', () => {
  // Would test addIcon() with duplicate tag
  // Expects pushError() dispatch
});
```

## Missing Test Coverage

**Critical Gaps:**
- `src/actions/iconActions.js` - All 4 exported actions untested (getIcons, addIcon, deleteIcon, saveAndGenerate)
- `src/actions/notiActions.js` - All 3 exported actions untested (pushError, pushNoti, dismissNoti)
- `src/reducers/iconReducer.js` - All switch cases untested (10+ cases)
- `src/reducers/notiReducer.js` - State transitions untested (3 cases)
- `src/components/AddIconForm.js` - Form validation, submission, Redux connection untested
- `src/components/Icons.js` - Icon rendering, delete functionality untested
- `src/components/Generator.js` - Save/download handlers untested
- `src/components/NotificationBar.js` - Notification display, dismissal untested
- `src/components/SaveButton.js` - Button state changes untested
- `src/components/DownloadButton.js` - Download functionality untested
- `server/server.js` - All endpoints untested (`/download`, `/saved-icons`, `/gen-webfonts`)

**Priority for Implementation:**
1. Redux reducers (foundational; pure functions)
2. Redux action creators (isolate async logic)
3. Component integration tests (user workflows)
4. Server endpoint tests (API contract validation)

---

*Testing analysis: 2026-03-20*
