import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addIcon } from '../actions/iconActions';

import { Button, TextField, Paper, Typography } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  addIconPaper: {
    padding: theme.spacing(2, 3),
    textAlign: 'center'
  }
}));

const AddIconForm = props => {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');

  const classes = useStyles();

  function onChange(e) {
    switch (e.target.name) {
      case 'title':
        setTitle(e.target.value);
        break;
      case 'tag':
        setTag(e.target.value);
        break;
      default:
        break;
    }
  }

  function onSubmit(e) {
    e.preventDefault();

    const icon = {
      title: title,
      tag: tag
    };

    props.addIcon(icon);

    setTitle('');
    setTag('');

    document.getElementById('input-title').focus();
  }

  return (
    <Paper className={classes.addIconPaper}>
      <Typography variant='h6'>Add Icon</Typography>
      <form onSubmit={onSubmit}>
        <TextField
          id='input-title'
          label='Title'
          required
          name='title'
          value={title}
          onChange={onChange}
        />
        <br />
        <TextField
          id='input-tag'
          label='Tag Name'
          required
          name='tag'
          value={tag}
          onChange={onChange}
        />
        <br />
        <br />
        <Button type='submit' variant='contained' color='primary'>
          Add
        </Button>
      </form>
    </Paper>
  );
};

AddIconForm.propTypes = {
  addIcon: PropTypes.func.isRequired
};

export default connect(null, { addIcon })(AddIconForm);
