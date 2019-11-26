import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { dismissNoti } from '../actions/notiActions';

import { Snackbar, Grow, IconButton, SnackbarContent } from '@material-ui/core';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';

import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
};

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.main
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20,
    color: 'white'
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1)
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    color: 'white'
  },
  margin: {
    margin: theme.spacing(1)
  }
}));

function MySnackbarContentWrapper(props) {
  const classes = useStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby='client-snackbar'
      message={
        <span id='client-snackbar' className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key='close'
          aria-label='close'
          color='inherit'
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>
      ]}
      {...other}
    />
  );
}

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired
};

function NotificationBar(props) {
  const classes = useStyles();

  const barVariant = props.isErrorNotification ? 'error' : 'success';

  const handleClose = () => {
    props.dismissNoti();
  };

  function GrowTransition(props) {
    return <Grow {...props} />;
  }

  return (
    <Snackbar
      open={props.showNotification}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      autoHideDuration={6000}
      TransitionComponent={GrowTransition}
    >
      <MySnackbarContentWrapper
        onClose={handleClose}
        variant={barVariant}
        message={props.notificationText}
        className={classes.margin}
      />
    </Snackbar>
  );
}

NotificationBar.propTypes = {
  showNotification: PropTypes.bool.isRequired,
  notificationText: PropTypes.string,
  dismissNoti: PropTypes.func.isRequired,
  isErrorNotification: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  showNotification: state.notifications.show,
  notificationText: state.notifications.text,
  isErrorNotification: state.notifications.isError
});

export default connect(mapStateToProps, { dismissNoti })(NotificationBar);
