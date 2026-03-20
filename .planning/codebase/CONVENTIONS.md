# Coding Conventions

**Analysis Date:** 2026-03-20

## Naming Patterns

**Files:**
- React components: PascalCase (e.g., `AddIconForm.js`, `NotificationBar.js`, `Generator.js`)
- Utility/helper files: camelCase (e.g., `iconActions.js`, `notiActions.js`, `iconReducer.js`)
- Action type files: camelCase plural (e.g., `types.js`)
- Test files: `{ComponentName}.test.js` (e.g., `App.test.js`)

**Functions:**
- Component functions: PascalCase (e.g., `App`, `AddIconForm`, `Icons`)
- Arrow functions (actions/handlers): camelCase (e.g., `downloadFiles`, `addIcon`, `deleteIcon`, `saveAndGenerate`)
- Event handlers: `on{EventName}` (e.g., `onChange`, `onSubmit`, `onClose`)
- Handler functions: `handle{Action}` (e.g., `handleSave`, `handleDelete`, `handleDarkModeToggle`, `handleClose`)

**Variables:**
- State variables (useState hooks): camelCase (e.g., `title`, `tag`, `type`, `darkEnabled`)
- Redux state properties: camelCase (e.g., `isSaving`, `isSaved`, `items`, `isDownloading`)
- Material-UI classes from `makeStyles`: camelCase (e.g., `addIconPaper`, `formControl`, `wrapper`)
- Constants (action types): UPPER_SNAKE_CASE (e.g., `GENERATE_ICONS`, `NEW_ICON`, `DELETE_ICON`)

**Types/Props:**
- No TypeScript used; PropTypes is the validation approach
- Object keys follow camelCase pattern

## Code Style

**Formatting:**
- No `.prettierrc` or `.eslintrc` files present
- Indentation: 2 spaces (observed in all source files)
- Single quotes for strings in JSX attributes and JavaScript (e.g., `'title'`, `'rgba...'`)
- Double quotes for HTML/JSX string props occasionally mixed (minimal inconsistency)

**Linting:**
- ESLint configured via `package.json` with `extends: "react-app"` (Create React App default)
- No custom linting rules beyond CRA defaults
- TypeScript available but not enforced

## Import Organization

**Order:**
1. External library imports (React, Redux, Material-UI)
2. Local component imports
3. Action imports
4. CSS/Asset imports

**Example from `AddIconForm.js`:**
```javascript
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addIcon } from '../actions/iconActions';

import {
  Button,
  TextField,
  // ... Material-UI imports
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
```

**Path Aliases:**
- Relative paths only (e.g., `../actions/`, `../components/`)
- No path aliases configured

## Error Handling

**Patterns:**
- Promise `.catch()` blocks dispatch error notifications via Redux actions
- Example from `iconActions.js`:
```javascript
.catch(err => {
  dispatch(pushError('Failed fetching file for download.'));
});
```
- Errors passed to `pushError()` action with user-friendly messages
- No try-catch blocks in source code (only in generated `serviceWorker.js`)

**Error Notification:**
- All errors dispatch `pushError()` action to show notification bar
- No logging of errors to external services
- Console logging used for debugging (see Logging section)

## Logging

**Framework:** `console` object - native browser console

**Patterns:**
- Debug logs: `console.log()` used liberally throughout
- Examples in `iconActions.js`:
  - `console.log('fetching');` in `getIcons()`
  - `console.log('Adding new icon and regenerate');` in `addIcon()`
  - `console.log('duplicated tag');` for validation feedback
  - `console.log('Client: ', currentIcons);` for data comparison

- Info logs: `console.log()` for operation status (e.g., 'Success saved and generate')
- Error logs: `console.log()` for errors before dispatching error action

**In Server (`server/server.js`):**
```javascript
console.log('Listening on port ', port);
console.log('Error writing _icons.scss', err);
console.log('Error in custom-fa.scss sass render. ', err);
```

**Note:** Excessive console.log() usage suggests development-style logging in production code. No DEBUG level separation.

## Comments

**When to Comment:**
- Minimal inline comments in application code
- Comments present for complex operations (e.g., commented-out alternative implementations in `server.js`)
- Service worker file has explanatory comments about PWA behavior

**JSDoc/TSDoc:**
- Not used in codebase
- No function documentation blocks

## Function Design

**Size:** Functions are compact and focused
- Action creators: 5-30 lines (e.g., `addIcon`, `deleteIcon`)
- Components: 30-100+ lines (e.g., `NotificationBar` with inline wrapper function)
- Reducers: Switch-based, typically 5-15 lines per case

**Parameters:**
- Redux action creators receive single data parameter or dispatch wrapper
- React components receive `props` object
- Event handlers receive `e` (event) or destructured values
- Thunk actions destructure `(dispatch, getState)` when state needed

**Return Values:**
- Reducers return new state object
- Action creators return dispatch calls
- Components return JSX
- No explicit null returns; undefined implicitly returned

## Module Design

**Exports:**
- Redux reducers: `export default` unnamed function
- Redux actions: Named `export const` functions
- React components: `export default` connected component (via `connect()`)
- Type constants: Named `export const`

**Barrel Files:**
- `src/reducers/index.js` uses `combineReducers` to aggregate state
- No barrel files for components or actions
- Imports directly from individual modules

**Example from `reducers/index.js`:**
```javascript
import { combineReducers } from 'redux';
import iconReducer from './iconReducer';
import notiReducer from './notiReducer';

export default combineReducers({
  icons: iconReducer,
  notifications: notiReducer
});
```

---

*Convention analysis: 2026-03-20*
