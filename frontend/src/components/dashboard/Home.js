import { Container } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ListAltRoundedIcon from "@material-ui/icons/ListAltRounded";
import YouTubeIcon from "@material-ui/icons/YouTube";
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
    margin: theme.spacing(3, 0, 1, 0),
    fontWeight: "bold",
    color: theme.palette.text.primary
  },
  fab: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(2)
  }
}));

const NewWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new" innerRef={ref} {...props} />
));

const NewWordlistFromYoutubeLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new-from-youtube" innerRef={ref} {...props} />
));

const actions = [
  { icon: <ListAltRoundedIcon color="primary" />, name: "New wordlist", component: NewWordlistLink },
  {
    icon: <YouTubeIcon style={{ color: "#f00" }} />,
    name: "From youtube",
    component: NewWordlistFromYoutubeLink
  }
];

function Home(props) {
  const { userWordlists, publicWordlists, loadUserWordlists, loadPublicWordlists } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    loadUserWordlists();
    loadPublicWordlists();
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      <SearchBox />
      <Typography variant="h5" className={classes.sectionHeader}>
        Your wordlists
      </Typography>
      <Wordlists wordlists={userWordlists} />

      <Typography variant="h5" className={classes.sectionHeader}>
        Recent public wordlists
      </Typography>

      <Wordlists wordlists={publicWordlists} />

      <Fab className={classes.fab} color="primary" aria-label="add">
        <AddIcon color="" />
      </Fab>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
