# Codebase Structure

**Analysis Date:** 2026-03-20

## Directory Layout

```
fa-subsetter/
├── public/                 # Static HTML and assets served by React
├── src/                    # React frontend source code
│   ├── actions/            # Redux action creators and thunks
│   ├── components/         # React presentational components
│   ├── reducers/           # Redux reducers
│   ├── App.js              # Root app component
│   ├── App.css             # Root app styles
│   ├── App.test.js         # Root component test
│   ├── index.js            # React DOM entry point
│   ├── index.css           # Global styles
│   ├── store.js            # Redux store configuration
│   └── serviceWorker.js    # PWA service worker
├── server/                 # Express backend server
│   ├── server.js           # Express app, routes, file generation
│   ├── generated-css/      # Output directory for generated files (not committed)
│   ├── fontawesome-free-5.11.2-web/  # Font Awesome source assets
│   └── ...                 # Other FA distribution files
├── .planning/              # GSD planning documents
├── package.json            # NPM dependencies and scripts
└── README.md              # Project documentation
```

## Directory Purposes

**public/:**
- Purpose: Static web assets served directly by Express (production) or CRA dev server (development)
- Contains: index.html, favicon.png, manifest.json, robots.txt
- Key files: `public/index.html` - root HTML file with <div id="root"></div>

**src/:**
- Purpose: React frontend application source code
- Contains: Components, Redux setup, assets, styles
- Key files: `src/index.js` (entry), `src/App.js` (root), `src/store.js` (Redux)

**src/actions/:**
- Purpose: Redux action creators and async thunks
- Contains: iconActions.js (icon operations), notiActions.js (notification operations), types.js (constants)
- Key files:
  - `src/actions/iconActions.js` - getIcons, addIcon, deleteIcon, saveAndGenerate, downloadFiles
  - `src/actions/notiActions.js` - pushError, pushNoti, dismissNoti
  - `src/actions/types.js` - action type constants

**src/components/:**
- Purpose: Reusable React presentational components
- Contains: Form, UI, and container components using Material-UI
- Key files:
  - `src/components/AddIconForm.js` - form to add icons
  - `src/components/Icons.js` - grid display of saved icons
  - `src/components/Generator.js` - save/download orchestration
  - `src/components/SaveButton.js` - button with progress indicator
  - `src/components/DownloadButton.js` - button with progress indicator
  - `src/components/NotificationBar.js` - snackbar notifications

**src/reducers/:**
- Purpose: Redux pure functions computing next state
- Contains: Root combineReducers, iconReducer, notiReducer
- Key files:
  - `src/reducers/index.js` - combines all reducers
  - `src/reducers/iconReducer.js` - icon state (items, save/download flags)
  - `src/reducers/notiReducer.js` - notification state (show, text, isError)

**server/:**
- Purpose: Express backend for API routes and font generation
- Contains: Express app, API endpoints, file I/O, Font Awesome SDK
- Key files: `server/server.js` - entire backend (single file)

**server/generated-css/:**
- Purpose: Output directory for generated subset CSS, webfonts, and archives
- Contains: _icons.scss, custom-fa.scss, custom-fa.min.css, webfonts/, saved-icons.json, css_webfonts.zip
- Generated: Yes (runtime output)
- Committed: No (.gitignore excludes this)

**server/fontawesome-free-5.11.2-web/:**
- Purpose: Font Awesome free distribution assets (source reference)
- Contains: CSS, SCSS, SVG files, metadata, webfonts
- Subdirs: svgs/solid/, svgs/brands/, svgs/regular/, scss/, css/, webfonts/, metadata/

## Key File Locations

**Entry Points:**
- `src/index.js` - Renders React app to DOM
- `server/server.js` - Starts Express server on port 8080
- `public/index.html` - Root HTML document

**Configuration:**
- `package.json` - Dependencies, scripts, build config
- `src/store.js` - Redux store initialization
- `src/App.js` - Theme configuration, root layout

**Core Logic:**
- `src/actions/iconActions.js` - Icon operations and API calls
- `server/server.js` - Backend routes and file generation (POST /gen-webfonts is largest)
- `src/reducers/iconReducer.js` - Icon state transitions

**UI Components:**
- `src/components/Icons.js` - Main content area (icon grid)
- `src/components/AddIconForm.js` - Left sidebar form
- `src/components/Generator.js` - Left sidebar buttons
- `src/App.js` - Header and layout container

**Styling:**
- `src/App.css` - App-level styles
- `src/index.css` - Global styles
- Material-UI theme defined inline in `src/App.js` via createMuiTheme()

**Testing:**
- `src/App.test.js` - Root component test (CRA template)

## Naming Conventions

**Files:**
- Components: PascalCase with .js extension (e.g., AddIconForm.js, Icons.js)
- Actions: camelCase with -Actions suffix (e.g., iconActions.js, notiActions.js)
- Reducers: camelCase with Reducer suffix (e.g., iconReducer.js, notiReducer.js)
- Utils: camelCase (serviceWorker.js, store.js)

**Directories:**
- Lowercase plural (src/actions/, src/reducers/, src/components/)
- Server backend uses singular (server/, not servers/)
- Generated output uses kebab-case (generated-css/, custom-fa-min.css)

**Functions/Variables:**
- Redux actions: camelCase verbs (addIcon, deleteIcon, saveAndGenerate, downloadFiles)
- State slices: camelCase (icons, notifications)
- State properties: camelCase (items, isSaving, isSaved, isDownloading, isDownloaded)
- Constants: UPPER_SNAKE_CASE in types.js (GENERATE_ICONS, NEW_ICON, etc.)

**Components:**
- PascalCase (Icons, AddIconForm, Generator, SaveButton, NotificationBar)
- Connected component pattern: export connect(mapStateToProps, mapDispatchToProps)(Component)

## Where to Add New Code

**New Feature (e.g., icon filtering, bulk operations):**
- Primary code: Add new thunk in `src/actions/iconActions.js`
- State: Add reducer case in `src/reducers/iconReducer.js`, state shape property
- Type constant: Add to `src/actions/types.js`
- Component: Create new file in `src/components/` if UI needed, or extend existing component
- Tests: Create `src/components/ComponentName.test.js`

**New Component/Module:**
- Implementation: Create in `src/components/ComponentName.js`
- Export: Preferably as default export with connect() HOC if Redux-connected
- Styling: Use Material-UI makeStyles() hook inline or in separate .css file
- Tests: `src/components/ComponentName.test.js` co-located

**New Backend Route:**
- Location: Add endpoint handler in `server/server.js`
- Pattern: app.get('/path') or app.post('/path') with (req, res) callback
- File I/O: Use fs module with absolute paths via path.join(__dirname, ...)
- Error handling: Use console.log() for errors, res.sendStatus() or res.json() for responses

**Shared Utilities:**
- Location: `src/` root or create `src/utils/` directory
- Export: Named exports or default
- Import: Use relative paths from consuming component (e.g., ../utils/helper.js)

**Material-UI Customization:**
- Global theme: Modify createMuiTheme() in `src/App.js`
- Component styles: Use makeStyles() hook in component file
- Color overrides: Extend palette object in theme

## Special Directories

**node_modules/:**
- Purpose: NPM dependencies
- Generated: Yes (npm install)
- Committed: No (.gitignore)

**build/:**
- Purpose: Production build output from "react-scripts build"
- Generated: Yes (npm run build)
- Committed: No (excluded from version control)

**.planning/:**
- Purpose: GSD planning and analysis documents
- Generated: Yes (manual creation by GSD tools)
- Committed: Yes

**server/generated-css/:**
- Purpose: Runtime-generated font subset files and CSS
- Generated: Yes (POST /gen-webfonts creates files)
- Committed: No (.gitignore)

---

*Structure analysis: 2026-03-20*
