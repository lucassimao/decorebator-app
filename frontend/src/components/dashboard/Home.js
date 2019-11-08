import { Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import YouTubeIcon from "@material-ui/icons/YouTube";
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchPublicWordlists, fetchUserWordlists } from "../../thunks/wordlist.thunks";
import SearchBox from "./SearchBox";
import Wordlists from "./Wordlists";


const useStyles = makeStyles(theme => ({
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(1, 0),
    color: theme.palette.grey[500],
    "& .section-icon": {
      color: theme.palette.primary.main,
      marginRight: theme.spacing(2)
    }
  },
  speedDial: {
    position: 'fixed',
    '&.MuiSpeedDial-directionUp': {
      bottom: theme.spacing(3),
      right: theme.spacing(2),
    },
  },
  tooltip: {
    width: '140px'
  },
}));



const NewWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new" innerRef={ref} {...props} />
));

const NewWordlistFromYoutubeLink = React.forwardRef((props, ref) => (
    <Link to="/wordlists/new-from-youtube" innerRef={ref} {...props} />
  ));

const actions = [
  { icon: <ListAltRoundedIcon />, name: 'New wordlist', component : NewWordlistLink },
  { icon: <YouTubeIcon />, name: 'From youtube', component : NewWordlistFromYoutubeLink }
];

function Home(props) {
  const { userWordlists, publicWordlists, loadUserWordlists, loadPublicWordlists } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () =>  setOpen(true);


  useEffect(() => {
    loadUserWordlists();
    loadPublicWordlists();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <SearchBox />
      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Your wordlists
      </Typography>
      <Wordlists wordlists={userWordlists} />

      <Typography variant="h6" className={classes.sectionHeader}>
        <AccessTimeIcon className="section-icon" />
        Recent public wordlists
      </Typography>

      <Wordlists wordlists={publicWordlists} />

      <SpeedDial 
        ariaLabel="Main menu"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction='up'
      >
        {actions.map(action => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            component={action.component}
            tooltipTitle={action.name}
            tooltipOpen={false}
            classes={{ staticTooltipLabel: classes.tooltip }}
          />
        ))}
      </SpeedDial>

    </Container>
  );
}

const mapStateToProps = state => ({
  userWordlists: state.wordlists.userWordlists,
  publicWordlists: state.wordlists.publicWordlists
});

const mapDispatchToProps = dispatch => ({
  loadUserWordlists: () => dispatch(fetchUserWordlists()),
  loadPublicWordlists: () => dispatch(fetchPublicWordlists())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
