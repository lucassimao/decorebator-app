import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AccountBoxRoundedIcon from '@material-ui/icons/AccountBoxRounded';
import DraftsIcon from '@material-ui/icons/Drafts';
import InboxIcon from '@material-ui/icons/Inbox';
import ListAltRoundedIcon from '@material-ui/icons/ListAltRounded';
import NotificationsActiveRoundedIcon from '@material-ui/icons/NotificationsActiveRounded';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import TopBar from './TopBar';




const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#e0e2e4',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#eaebed',
    marginTop: theme.spacing(1),
    /*    [theme.breakpoints.up('sm')]: {
          marginLeft: theme.spacing(3),
          width: 'auto',
        },*/
  },
  searchIcon: {
    width: theme.spacing(5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    // fontSize: '20px'
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%',
    // [theme.breakpoints.up('md')]: {
    //   width: 200,
    // },
  },
}))

function SearchBox(props) {
  const { classes } = props;

  return <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder="Search…"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ 'aria-label': 'search' }}
    />
  </div>;
}


function App() {
  const classes = useStyles();

  return <React.Fragment>
    <CssBaseline />
    <TopBar />
    <Container className={classes.container} maxWidth="sm">

      <SearchBox classes={classes} />

      <Typography variant="h6" style={{ 'display': 'flex', alignItems: 'center', marginTop: '5px' }}>
        <AccessTimeIcon style={{ 'color': '#0079bf', marginRight: '5px' }} />
        Recent wordlists
      </Typography>

      <List component="nav">
        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Inbox" />
        </ListItem>
        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Drafts" />
        </ListItem>
      </List>

      <Typography variant="h6" style={{ 'display': 'flex', alignItems: 'center', marginTop: '5px' }}>
        <AccessTimeIcon style={{ 'color': '#0079bf', marginRight: '5px' }} />
        Personal wordlists
      </Typography>      

      <List component="nav">
        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Inbox" />
        </ListItem>
        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Drafts" />
        </ListItem>

        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Drafts" />
        </ListItem>

        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Drafts" />
        </ListItem>

        <ListItem button style={{paddingLeft:0}}>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText style={{borderBottom: '1px solid #c5c5c5'}} primary="Drafts" />
        </ListItem>
      </List>      
    </Container>

    <AppBar position="fixed" color="primary" style={{top: 'auto', bottom:0, backgroundColor: '#0079bf'}}>
        <Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
          <IconButton edge="start" color="inherit">
            <ListAltRoundedIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsActiveRoundedIcon />
          </IconButton>
          <IconButton edge="end" color="inherit">
            <AccountBoxRoundedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

  </React.Fragment>
}

export default App;
