# Architecture

**Analysis Date:** 2026-03-20

## Pattern Overview

**Overall:** Full-stack Redux + Express architecture with separation between frontend (React/Redux) and backend (Node.js/Express) serving Icon generation and management.

**Key Characteristics:**
- Redux-based state management for UI state and icon data
- Thunk middleware for async operations and API communication
- Express server handling file generation, SCSS compilation, and font subsetting
- Material-UI for consistent component styling
- Fetch-based client-server communication (REST-like)

## Layers

**Frontend View Layer:**
- Purpose: React components consuming Redux state and dispatching actions
- Location: `src/components/`
- Contains: Presentational components (Icons, AddIconForm, Generator, NotificationBar, SaveButton, DownloadButton)
- Depends on: Redux store, Material-UI, react-redux
- Used by: App.js root component

**Frontend State Management (Redux):**
- Purpose: Centralized state management for icons and notifications
- Location: `src/store.js`, `src/reducers/`, `src/actions/`
- Contains: Store configuration, reducers (iconReducer, notiReducer), action creators with thunks
- Depends on: redux, redux-thunk
- Used by: All connected components via react-redux Provider and connect()

**API Client (Frontend):**
- Purpose: Fetch-based communication with backend server
- Location: `src/actions/iconActions.js` (within thunk actions: downloadFiles, getIcons, saveAndGenerate)
- Contains: fetch() calls to `/download`, `/saved-icons`, `/gen-webfonts` endpoints
- Depends on: Browser Fetch API
- Used by: Redux thunks (dispatched from components)

**Backend File Generation Layer:**
- Purpose: Generate custom Font Awesome subsets with CSS/webfonts
- Location: `server/server.js` - POST `/gen-webfonts` endpoint
- Contains: SCSS compilation, icon subsetting, file generation logic
- Depends on: node-sass, fontawesome-subset, archiver
- Used by: Frontend saveAndGenerate action

**Backend File Management Layer:**
- Purpose: Retrieve and serve generated files
- Location: `server/server.js` - GET `/download`, GET `/saved-icons` endpoints
- Contains: File serving, saved-icons JSON retrieval
- Depends on: fs module, express.static
- Used by: Frontend getIcons, downloadFiles actions

**Express Server Layer:**
- Purpose: HTTP server and middleware configuration
- Location: `server/server.js`
- Contains: Express app initialization, middleware setup (JSON parsing, static serving), routing
- Depends on: express, node-sass, fontawesome-subset, archiver
- Used by: Serves both frontend (production) and API endpoints

## Data Flow

**Icon Addition Flow:**

1. User fills AddIconForm with title, tag, and type (fas/fab)
2. Form submission calls addIcon() action creator
3. addIcon thunk checks for duplicates in Redux state (getState())
4. If valid, dispatches NEW_ICON action to iconReducer
5. iconReducer adds icon to state.icons.items array
6. Icons component re-renders showing the new icon

**Save and Generate Flow:**

1. User clicks Save button in Generator component
2. handleSave validates icons array, then calls saveAndGenerate(icons)
3. Dispatches SAVING action (sets isSaving=true)
4. Thunk makes fetch POST to `/gen-webfonts` with icon array
5. Backend processes: maps icons to solid/brands, writes SCSS, compiles CSS, subsets fonts, zips files
6. Backend returns success with icon array
7. Frontend compares request/response arrays for validation
8. Dispatches SAVED action (isSaving=false, isSaved=true)
9. User sees green checkmark in SaveButton

**Download Flow:**

1. User clicks Download button in Generator component
2. handleDownload calls downloadFiles()
3. Dispatches DOWNLOADING action (isDownloading=true)
4. Thunk makes fetch GET to `/download`
5. Backend serves `generated-css/css_webfonts.zip`
6. Frontend converts blob to object URL, creates hidden anchor, triggers download
7. Dispatches DOWNLOADED action (isDownloading=false, isDownloaded=true)

**Initial Load Flow:**

1. Icons component mounts
2. useEffect calls getIcons()
3. Thunk makes fetch GET to `/saved-icons`
4. Backend reads `generated-css/saved-icons.json`
5. Dispatches GENERATE_ICONS action with JSON array
6. iconReducer sets state.icons.items = payload
7. Icons component renders GridList of fetched icons

## Key Abstractions

**Redux Actions:**
- Purpose: Encapsulate business logic and API calls
- Examples: `src/actions/iconActions.js`, `src/actions/notiActions.js`
- Pattern: Thunk-based (functions returning functions) for async operations, simple dispatch for sync

**Redux Reducers:**
- Purpose: Pure functions that compute next state from current state + action
- Examples: `src/reducers/iconReducer.js`, `src/reducers/notiReducer.js`
- Pattern: Switch on action.type, return new state object via spread

**Connected Components:**
- Purpose: Subscribe to Redux state and dispatch actions
- Examples: Icons, AddIconForm, Generator, NotificationBar
- Pattern: mapStateToProps + mapDispatchToProps using react-redux connect() HOC

**Backend Controllers (embedded in server.js):**
- Purpose: Handle specific HTTP routes
- Examples: POST `/gen-webfonts` handler, GET `/saved-icons` handler, GET `/download` handler
- Pattern: Express route handlers with inline business logic

## Entry Points

**Frontend Entry:**
- Location: `src/index.js`
- Triggers: Browser loads index.html, ReactDOM renders App to #root
- Responsibilities: Mounts React app, registers Redux store via Provider

**Backend Entry:**
- Location: `server/server.js`
- Triggers: `node ./server/server.js` (via npm dev or npm start)
- Responsibilities: Starts Express server on port 8080, listens for API requests, serves static files in production

**Main App Component:**
- Location: `src/App.js`
- Triggers: Rendered by index.js
- Responsibilities: Wraps app in Redux Provider and Material-UI ThemeProvider, renders layout with AppBar, sidebar (AddIconForm/Generator), and main Icons component

## Error Handling

**Strategy:** Try-catch pattern in callbacks and error dispatches to notification reducer

**Patterns:**
- API errors trigger pushError() action, which dispatches to notifications reducer
- Backend sends HTTP status codes (500) or JSON error objects
- Frontend catches fetch errors in .catch() handlers
- Validation errors checked synchronously (duplicate tags/titles) before state dispatch
- Form validation via required HTML attributes
- Async operation errors revert state flags (e.g., RESET_SAVING, RESET_DOWNLOAD)

## Cross-Cutting Concerns

**Logging:**
- console.log() statements throughout actions and server (not structured logging)
- Debug logs for fetching, saving, icon operations

**Validation:**
- Frontend: Duplicate tag/title checking in addIcon thunk before state update
- Frontend: Form required fields
- Backend: Icon array length validation before processing in POST /gen-webfonts

**Authentication:**
- Not implemented - no auth layer present
- Server endpoints are public and unprotected

**State Persistence:**
- Notifications: Auto-dismiss via Snackbar autoHideDuration={6000}
- Icons: Persisted to disk at `server/generated-css/saved-icons.json`, reloaded on app init via getIcons()

---

*Architecture analysis: 2026-03-20*
