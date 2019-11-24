A frontend app where you can subset Font-Awesome and download the smaller version of CSS and Webfonts glyphs.

## Framework Baseline

Frontend: Create-React-App (CRA)

Backend: Nodejs and Express

### Usage

If you haven't made any changes to the source file then directly use :

 `npm start`

This will run the express server and serve the optimized production file of CRA and handle API calls/routing.

Should you made changes to the source, build the CRA first and rerun the server :

 `npm run build` `npm start`
 
To run in dev mode where CRA and Express run separately, uncomment the line near the end of server/server.js file.
