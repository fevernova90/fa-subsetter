___

A GUI helper app where you can type-in your chosen icons from FontAwesome, subset them and download the smaller version of CSS and Webfonts glyphs.

#### Framework/Modules Used
- Express.js
- Create-react-app (CRA)
- Node.js
- [fontawesome-subset](https://github.com/omacranger/fontawesome-subset) by omacranger

___
## Usage

If you haven't made any changes to the source file then directly use :
```
 npm start
```
This will run the express server and serve the optimized production file of CRA and handle API calls/routing.
Go to http://localhost:8080 in your browser to access to GUI.

Should you made changes to the source, build the CRA first and rerun the server :
```
 npm run build
 
 npm start
```
 
To run in dev mode where CRA and Express run separately, use :
```
npm run dev
```
___

Font Awesome Pro is possible but you have to manually configure the credentials for `@fortawesome/fontawesome` by following this [instructions](https://fontawesome.com/how-to-use/on-the-web/setup/using-package-managers).
