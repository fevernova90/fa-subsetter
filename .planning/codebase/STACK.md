# Technology Stack

**Analysis Date:** 2026-03-20

## Languages

**Primary:**
- JavaScript (ES6+) - Frontend React application and backend Express server
- JSX - React component syntax used throughout `src/components/` and `src/App.js`

**Secondary:**
- SCSS/SASS - Stylesheet processing in `server/generated-css/`

## Runtime

**Environment:**
- Node.js (unspecified version, but supports Express 4.17.1)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 16.12.0 - Frontend UI framework
  - react-dom 16.12.0 - React DOM rendering
  - react-scripts 3.2.0 - Create React App build tooling
- Express.js 4.17.1 - Backend server framework

**State Management:**
- Redux 4.0.4 - Predictable state container
  - react-redux 7.1.3 - React bindings for Redux
  - redux-thunk 2.3.0 - Middleware for async actions

**UI Components:**
- Material-UI (core) 4.7.0 - Component library (`src/App.js`, `src/components/`)
- Material-UI Icons 4.5.1 - Icon components from Material Design

## Key Dependencies

**Critical:**
- fontawesome-subset 1.1.0 - Core utility for subsetting Font Awesome icons
  - Used by `server/server.js` to process and generate custom icon webfonts
- node-sass 4.13.0 - SCSS/SASS compilation
  - Compiles custom SCSS to CSS in webfont generation (`server/server.js` line 150)
- archiver 3.5.1 - File compression and archiving
  - Creates ZIP files of generated CSS and webfonts for download

**Infrastructure:**
- express 4.17.1 - HTTP server and routing
  - Serves React build in production
  - Handles API endpoints: `/gen-webfonts` (POST), `/download` (GET), `/saved-icons` (GET)

**Development:**
- typescript 3.7.2 - Type checking support (installed but not actively used for compilation)
- concurrently 5.0.0 - Run multiple processes in parallel
  - Used in npm scripts to run Express server and React dev server simultaneously
- react-app-rewired 2.1.5 - Override Create React App config without ejecting
- customize-cra 0.9.1 - Configuration presets for react-app-rewired

## Configuration

**Environment:**
- Environment variables read from process.env:
  - `PORT` (default: 8080) - Express server port in `server/server.js` line 10
  - `NODE_ENV` - Determines production vs development mode
    - `production` mode: serves React build from `build/` folder
    - development mode: React dev server runs separately via react-scripts

**Build:**
- Create React App configuration via `package.json`:
  - ESLint extends "react-app"
  - Browserslist defines supported browsers for transpilation
- No custom webpack/build config files (using react-app-rewired internally)

## Platform Requirements

**Development:**
- Node.js with npm
- Port 8080 (for Express server)
- Port 3000 (for React dev server in dev mode)
- Redux DevTools browser extension recommended for dev mode (optional but mentioned in README)

**Production:**
- Node.js runtime with npm packages installed
- Port configurable via `PORT` environment variable (default 8080)
- Pre-built React application in `build/` folder required before starting

## Scripts

**Start Commands:**
- `npm start` - Production mode: starts Express server on port 8080, serves optimized CRA build
- `npm run dev` - Development mode: runs Express server and React dev server concurrently
- `npm run build` - Builds React app for production into `build/` folder
- `npm test` - Run tests via react-scripts
- `npm run eject` - Eject from Create React App (not recommended)

---

*Stack analysis: 2026-03-20*
