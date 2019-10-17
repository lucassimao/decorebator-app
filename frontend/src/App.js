
import Container from '@material-ui/core/Container';
import InputBase from '@material-ui/core/InputBase';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import InboxIcon from '@material-ui/icons/Inbox';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';
import AppFooter from './components/AppFooter';
import TopBar from './components/TopBar';



const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.grey[200] ,//'#eaebed',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  searchIcon: {
    width: theme.spacing(5),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.grey[600]
  },
  inputRoot: {
    color: 'inherit',
    fontSize: theme.typography.fontSize * 1.2
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: '100%',
  },

  sectionHeader: {
    'display': 'flex', 
    alignItems: 'center', 
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    color: theme.palette.grey[500],
    '& .section-icon': {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2),
    }
  },

  listItem: {
    paddingLeft: 0,
    '& .text': { borderBottom: '1px solid #c5c5c5' }
  }
}))

function SearchBox(props) {
  const { classes } = props;

  return <div className={classes.search}>
    <div className={classes.searchIcon}>
      <SearchIcon />
    </div>
    <InputBase
      placeholder="Search …"
      classes={{
        root: classes.inputRoot,
        input: classes.inputInput,
      }}
      inputProps={{ 'aria-label': 'search' }}
    />
  </div>;
}

function Wordlists(props) {
  const { n, classes } = props;

  const listItems = [];

  for (let i = 0; i < n; ++i) {
    listItems.push(
      <ListItem className={classes.listItem} key={i} button>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText className='text' primary={"Wordlist " + i} />
      </ListItem>
    )
  }

  return <List component="nav"> {listItems}  </List>;

}


function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <TopBar />
      <Container maxWidth="sm">

        <SearchBox classes={classes} />

        <Typography variant="h6" className={classes.sectionHeader}>
          <AccessTimeIcon className='section-icon' />
          Recent wordlists
        </Typography>

        <Wordlists classes={classes} n={5} />

        <Typography variant="h6" className={classes.sectionHeader}>
          <AccessTimeIcon className='section-icon' />
          Personal wordlists
        </Typography>

        <Wordlists classes={classes} n={15} />

      </Container>
      <AppFooter />
    </React.Fragment>
  );

}

export default App;
