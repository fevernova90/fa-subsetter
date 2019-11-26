import React, { useState, useEffect } from 'react';
import darkBgLogo from './logo_darkbg.png';
import './App.css';
import { Provider } from 'react-redux';

import Icons from './components/Icons';
import AddIconForm from './components/AddIconForm';
import Generator from './components/Generator';
import NotificationBar from './components/NotificationBar';

import {
  CssBaseline,
  Typography,
  Grid,
  AppBar,
  Toolbar,
  FormControlLabel,
  Switch,
  FormGroup,
  Paper
} from '@material-ui/core';
import {
  makeStyles,
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
  withStyles
} from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { indigo, pink, grey } from '@material-ui/core/colors';

import store from './store';

const PurpleSwitch = withStyles({
  switchBase: {
    color: pink,
    '&$checked': {
      color: grey[500]
    },
    '&$checked + $track': {
      backgroundColor: grey[500]
    }
  },
  checked: {},
  track: {}
})(Switch);

function App() {
  const externalDarkModeTriggerer = useMediaQuery(
    '(prefers-color-scheme: dark)'
  );
  const [darkEnabled, setDarkEnabled] = useState(externalDarkModeTriggerer);

  useEffect(() => {
    setDarkEnabled(externalDarkModeTriggerer);
  }, [externalDarkModeTriggerer]);

  // const effectiveLogo = darkEnabled ? darkBgLogo : lightBgLogo;
  const effectiveLogo = darkBgLogo;

  const theme = React.useMemo(
    () =>
      responsiveFontSizes(
        createMuiTheme({
          palette: {
            type: darkEnabled ? 'dark' : 'light',
            primary: indigo,
            secondary: pink
          }
        })
      ),
    [darkEnabled]
  );

  const useStyles = makeStyles(theme => ({
    root: {},
    appBar: {
      display: 'flex',
      justifyContent: 'space-around'
    },
    title: {
      color: 'white'
    },
    logo: {
      height: '8vmin'
    },
    body: {
      padding: theme.spacing(2)
    },
    iconPaper: {
      padding: theme.spacing(2),
      textAlign: 'center'
    },
    leftBar: {
      padding: theme.spacing(2),
      flexDirection: 'column'
    }
  }));

  const classes = useStyles();

  const handleDarkModeToggle = () => setDarkEnabled(!darkEnabled);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <NotificationBar />
          <AppBar position='static'>
            <Toolbar className={classes.appBar} variant='regular'>
              <img
                className={classes.logo}
                src={effectiveLogo}
                alt='fa-subset-logo'
              />
              <Typography variant='h6' className={classes.title}>
                Font Awesome Subsetter
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <PurpleSwitch
                      checked={darkEnabled}
                      onChange={handleDarkModeToggle}
                    />
                  }
                  label='Dark mode'
                />
              </FormGroup>
            </Toolbar>
          </AppBar>
          <Grid container className={classes.body} spacing={3} justify='center'>
            <Grid className={classes.leftBar} item xs={3}>
              <AddIconForm />
              <br />
              <Generator />
            </Grid>
            <Grid item xs={9}>
              <Paper className={classes.iconPaper}>
                <Icons />
              </Paper>
            </Grid>
          </Grid>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
