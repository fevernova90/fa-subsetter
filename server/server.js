const fs = require('fs');
const archiver = require('archiver');
// const util = require('util');
// const writeFilePromise = util.promisify(fs.writeFile);
const sass = require('node-sass');
const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 8080;

const fontawesomeSubset = require('fontawesome-subset');

const zippingFiles = () => {
  const output = fs.createWriteStream(
    __dirname + '/generated-css/css_webfonts.zip'
  );
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  output.on('close', () => {
    console.log(archive.pointer() + 'total bytes');
    console.log(
      'Archiver has been finalized and the output file descriptor has closed.'
    );
  });

  output.on('end', () => {
    console.log('Data has been drained');
  });

  archive.on('warning', err => {
    if (err.code === 'ENOENT') {
      console.log('Warning on archiver: ', err);
    } else {
      throw err;
    }
  });

  archive.on('error', err => {
    throw err;
  });

  archive.pipe(output);

  archive.file(__dirname + '/generated-css/custom-fa.min.css', {
    name: 'custom-fa.min.css'
  });
  archive.file(__dirname + '/generated-css/saved-icons.dat', {
    name: 'saved-icons.dat'
  });
  archive.directory(__dirname + '/generated-css/webfonts/', 'webfonts');
  archive.finalize();
};

app.use(express.json());

app.get('/download', (req, res) => {
  res.sendFile(__dirname + '/generated-css/css_webfonts.zip');
});

app.get('/saved-icons', (req, res) => {
  fs.readFile(
    path.join(__dirname, 'generated-css/saved-icons.dat'),
    'utf8',
    (err, data) => {
      if (err) {
        console.log('Error getting saved-icons', err);
        res.sendStatus(500);
      } else {
        res.send(data);
      }
    }
  );
});

app.post('/gen-webfonts', (req, res) => {
  const icons = req.body;
  const iconTags = icons.map(icon => icon.tag);

  if (icons === undefined || icons.length === 0 || iconTags.length === 0) {
    console.log('Null request with undefined/zero icons array.');
    res.sendStatus(500);
    return;
  }
  const customIconsScss = iconTags
    .map(
      tag =>
        `.#{$fa-css-prefix}-${tag}:before { content: fa-content($fa-var-${tag}); }`
    )
    .join('\n');

  fs.writeFile(
    path.join(__dirname, 'generated-css/scss/_icons.scss'),
    customIconsScss,
    err => {
      if (err) {
        console.log('Error writing _icons.scss', err);
        res.sendStatus(500);
      } else {
        sass.render(
          {
            file: path.join(__dirname, 'generated-css/custom-fa.scss'),
            outputStyle: 'compressed'
          },
          (err, result) => {
            if (err) {
              console.log('Error in custom-fa.scss sass render. ', err);
              res.sendStatus(500);
            } else {
              fontawesomeSubset(
                iconTags,
                path.join(__dirname, 'generated-css/webfonts')
              );
              fs.writeFile(
                path.join(__dirname, 'generated-css/custom-fa.min.css'),
                result.css,
                err => {
                  if (!err) {
                    fs.writeFile(
                      path.join(__dirname, 'generated-css/saved-icons.dat'),
                      JSON.stringify(icons),
                      err => {
                        if (!err) {
                          zippingFiles();
                          res.json(icons);
                        } else {
                          console.log(
                            'Error in saving saved icons file, icons-saved.dat ',
                            err
                          );
                          res.sendStatus(500);
                        }
                      }
                    );
                  } else {
                    console.log('Error in writing css file. ', err);
                    res.sendStatus(500);
                  }
                }
              );
            }
          }
        );
      }
    }
  );
});

// Serving the CRA build folder via express
// Comment these below lines to allow for development run of the server
// in conjunction with CRA 'npm start'

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Ends here - Serving the CRA build folder via express

app.listen(port, () => {
  console.log('> Listening on port ', port);
});
