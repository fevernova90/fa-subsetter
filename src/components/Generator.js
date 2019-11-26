import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { saveAndGenerate, downloadFiles } from '../actions/iconActions';
import { pushError } from '../actions/notiActions';

import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography } from '@material-ui/core';

import SaveButton from './SaveButton';
import DownloadButton from './DownloadButton';

const useStyles = makeStyles(theme => ({
  generatorPaper: {
    padding: theme.spacing(2, 3),
    textAlign: 'center'
  },
  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

function Generator(props) {
  const classes = useStyles();

  const { isSaving, isSaved, isDownloading, isDownloaded } = props;

  const handleSave = () => {
    if (props.icons.length === 0) {
      props.pushError('No selected icons to save.');
      return;
    }

    if (isSaving) {
      props.pushError('Saving in progress. Please wait for it to complete.');
    }
    props.saveAndGenerate(props.icons);
  };

  const handleDownload = () => {
    props.downloadFiles();
  };

  return (
    <Paper className={classes.generatorPaper}>
      <Typography variant='h6'>Generate CSS/Webfonts</Typography>
      <div className={classes.buttonWrapper}>
        <SaveButton
          handleSave={handleSave}
          isSaved={isSaved}
          isSaving={isSaving}
        />
        <DownloadButton
          isDownloading={isDownloading}
          isDownloaded={isDownloaded}
          handleDownload={handleDownload}
          content='Download'
        />
      </div>
    </Paper>
  );
}

Generator.propTypes = {
  icons: PropTypes.array.isRequired,
  saveAndGenerate: PropTypes.func.isRequired,
  downloadFiles: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  isSaved: PropTypes.bool.isRequired,
  isDownloading: PropTypes.bool.isRequired,
  isDownloaded: PropTypes.bool.isRequired,
  pushError: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  icons: state.icons.items,
  isSaving: state.icons.isSaving,
  isSaved: state.icons.isSaved,
  isDownloading: state.icons.isDownloading,
  isDownloaded: state.icons.isDownloaded
});

export default connect(mapStateToProps, {
  saveAndGenerate,
  pushError,
  downloadFiles
})(Generator);
