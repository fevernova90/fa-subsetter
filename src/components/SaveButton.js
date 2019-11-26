import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';

const useStyles = makeStyles(theme => ({
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1
  }
}));

export default function SaveButton(props) {
  const classes = useStyles();
  const { isSaving, isSaved, handleSave } = props;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: isSaved
  });

  return (
    <div className={classes.wrapper}>
      <Fab
        aria-label='save'
        color='primary'
        className={buttonClassname}
        onClick={handleSave}
      >
        {isSaved ? <CheckIcon /> : <SaveIcon />}
      </Fab>
      {isSaving && (
        <CircularProgress size={68} className={classes.fabProgress} />
      )}
    </div>
  );
}
