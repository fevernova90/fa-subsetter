import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Button from '@material-ui/core/Button';

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
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));

export default function DownloadButton(props) {
  const classes = useStyles();

  const { isDownloading, isDownloaded, handleDownload, content } = props;

  const buttonClassname = clsx({
    [classes.buttonSuccess]: isDownloaded
  });

  return (
    <div className={classes.wrapper}>
      <Button
        variant='contained'
        color='primary'
        className={buttonClassname}
        disabled={isDownloading}
        onClick={handleDownload}
      >
        {content}
      </Button>
      {isDownloading && (
        <CircularProgress size={24} className={classes.buttonProgress} />
      )}
    </div>
  );
}
