import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddRoundedIcon from '@material-ui/icons/AddRounded';

const useStyles = makeStyles(theme => ({
  root: { },
  title: {
    flexGrow: 1,
    textAlign: 'center',
    '& span':{
      fontSize: theme.typography.caption.fontSize
    }
  },
  addButton:{
      transform: 'scale(1.5)'
  }
}));

export default function TopBar() {
  const classes = useStyles();

  return (
    <div>
      <AppBar color="primary" position="static">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            Decorebator <span> beta </span>
          </Typography>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <AddRoundedIcon className={classes.addButton} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}
