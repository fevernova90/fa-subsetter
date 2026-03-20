# External Integrations

**Analysis Date:** 2026-03-20

## APIs & External Services

**Font Awesome:**
- Service: Font Awesome Free icon library
- What it's used for: Provides icon glyphs and CSS metadata for subsetting
  - SDK/Client: `@fortawesome/fontawesome-free` 5.11.2
  - Files: Icons stored in `server/fontawesome-free-5.11.2-web/`
  - Pro support: Optional via manual credential configuration (see README.md line 60-63)

## Data Storage

**Databases:**
- None - This application does not use a database
- No persistent data store beyond generated files

**File Storage:**
- Local filesystem only
- Generated files location: `server/generated-css/`
  - `custom-fa.min.css` - Generated CSS file
  - `custom-fa.scss` - SCSS template file
  - `webfonts/` - Directory containing font files (.woff, .woff2, etc.)
  - `saved-icons.json` - JSON record of selected icons
  - `css_webfonts.zip` - Generated ZIP archive for download
  - `scss/_icons.scss` - Dynamically generated icon definitions

**Caching:**
- None - No explicit caching layer

## Authentication & Identity

**Auth Provider:**
- None - Application is public with no user authentication
- No login/authorization system

## Monitoring & Observability

**Error Tracking:**
- None - No third-party error tracking service

**Logs:**
- Console logging only via Node.js `console.log()`
- Server logs in `server/server.js`:
  - Archive completion messages (line 23-26)
  - SASS compilation errors (line 157)
  - File system errors (line 69, 145, 157, 179, 187)
- Client logs via `console.log()` in Redux actions (`src/actions/iconActions.js`)

## CI/CD & Deployment

**Hosting:**
- Self-hosted via Node.js Express server
- No integration with external CI/CD platforms detected

**CI Pipeline:**
- None - No CI/CD workflow files found

## Environment Configuration

**Required env vars:**
- `PORT` (optional, defaults to 8080)
- `NODE_ENV` (optional, defaults to development)
  - Set to "production" to serve React build instead of dev server

**Secrets location:**
- No secrets management system in place
- .env files ignored via .gitignore (`.env.local`, `.env.development.local`, `.env.test.local`, `.env.production.local`)
- Font Awesome Pro credentials would be configured manually per README.md instructions

## Webhooks & Callbacks

**Incoming:**
- None - No webhook endpoints

**Outgoing:**
- None - No outbound webhook triggers

## Internal API Endpoints

**Endpoints:**

**GET `/saved-icons`:**
- Purpose: Retrieve previously saved icon selection
- Response: JSON array of icon objects with properties: `tag`, `title`, `type`
- Error handling: Returns 500 status on file read error
- Called from: `src/actions/iconActions.js` line 40 (getIcons action)

**POST `/gen-webfonts`:**
- Purpose: Generate custom CSS and webfonts from selected icons
- Request body: JSON array of icon objects `[{ tag, title, type }, ...]`
  - Supported types: `fas` (solid), `fab` (brands)
- Process:
  1. Validates icon array is not empty
  2. Generates SCSS with icon selectors from `src/actions/iconActions.js` line 80
  3. Compiles SCSS to CSS via node-sass (line 150-154)
  4. Calls fontawesome-subset to generate webfont files (line 162-165)
  5. Writes generated CSS and saved icons JSON (line 166-186)
  6. Creates ZIP archive of CSS and webfonts (line 176)
- Response: JSON array of icons if successful, or error object with `error` property
- Error scenarios: Invalid icons, SASS compilation failure, file write failure
- Called from: `src/actions/iconActions.js` line 96 (saveAndGenerate action)

**GET `/download`:**
- Purpose: Download the generated ZIP file
- Response: Binary ZIP file `css_webfonts.zip`
- Error handling: Returns 500 if file not found
- File contents: `custom-fa.min.css`, `webfonts/` directory, `saved-icons.json`
- Called from: `src/actions/iconActions.js` line 16 (downloadFiles action)

## Frontend-Backend Communication

**HTTP Client:**
- Fetch API (native browser API)
- Used in `src/actions/iconActions.js` for all server communication
- Content-Type: `application/json` for POST requests
- Error handling via `.catch()` with user notification via Redux actions

**Request Pattern:**
```javascript
fetch('/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
  .then(resp => resp.json())
  .catch(err => dispatch(pushError(...)))
```

---

*Integration audit: 2026-03-20*
