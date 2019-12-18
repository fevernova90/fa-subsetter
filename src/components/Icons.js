import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getIcons, deleteIcon } from '../actions/iconActions';

import {
  Grid,
  Typography,
  IconButton,
  Card,
  CardContent,
  GridList,
  GridListTile
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { amber } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper
  },
  iconList: {
    width: '100%',
    height: '80vh'
  },
  iconCard: {
    position: 'relative'
  },
  icon: {
    fontSize: '2.5rem'
  },
  deleteIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: 0.3
  },
  deleteIconHover: {
    color: amber[900],
    opacity: 1
  }
}));

const Icons = props => {
  const { getIcons } = props;

  useEffect(() => {
    getIcons();
  }, [getIcons]);

  const classes = useStyles();

  const handleDelete = tag => () => {
    props.deleteIcon(tag);
  };

  const iconItems = props.icons.reverse().map(icon => (
    // <Grid item key={icon.tag} className={classes.iconGrid} md={2} sm={4} xs={8}>
    <GridListTile key={icon.tag} cols={1}>
      <Card className={classes.iconCard}>
        <IconButton
          className={classes.deleteIcon}
          key='close'
          aria-label='close'
          color='inherit'
          onClick={handleDelete(icon.tag)}
        >
          <DeleteIcon />
        </IconButton>
        <CardContent>
          <div className={classes.icon}>
            <i className={icon.type + ' fa-' + icon.tag}></i>
          </div>
          <Typography variant='body2'>{icon.title}</Typography>
          <Typography style={{ fontStyle: 'italic' }} variant='caption'>
            {icon.tag}
          </Typography>
        </CardContent>
      </Card>
    </GridListTile>
    // </Grid>
  ));

  return (
    <div className={classes.root}>
      <Typography variant='h6'>List of added icons</Typography>
      {/* <Grid
        className={classes.iconList}
        container
        direction='row'
        justify='center'
        alignItems='center'
        spacing={2}
      > */}
      <GridList cellHeight={160} className={classes.iconList} cols={5}>
        {iconItems}
      </GridList>
      {/* </Grid> */}
    </div>
  );
};

Icons.propTypes = {
  getIcons: PropTypes.func.isRequired,
  deleteIcon: PropTypes.func.isRequired,
  icons: PropTypes.array
};

const mapStateToProps = state => ({
  icons: state.icons.items
});

export default connect(mapStateToProps, { getIcons, deleteIcon })(Icons);
