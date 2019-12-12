import { Container } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import { Link } from "react-router-dom";
import WordlistsImage from "./wordlists.jpeg";
import YoutubeImage from "./youtube.jpg";

const useStyles = makeStyles(theme => ({
  header: {
    position: "relative"
    // display: "flex"
  },
  main: {
    display: "grid",
    gridColumnGap: theme.spacing(1),
    gridRowGap: theme.spacing(2),
    padding: theme.spacing(2, 0)
  }
}));

const NewWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new" innerRef={ref} {...props} />
));

const NewWordlistFromYoutubeLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new-from-youtube" innerRef={ref} {...props} />
));

function MenuNewWordlist() {
  const classes = useStyles();
  return (
    <Container>
      <header className={classes.header}>
        <Fab
          size="small"
          href="/"
          variant="outlined"
          color="primary"
          aria-label="go back"
          style={{ position: "absolute", top: 0, left: 0, fontWeight: "bold" }}
        >
          <ArrowBackIcon fontSize="small" />
        </Fab>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          New wordlist
        </Typography>
      </header>

      <main className={classes.main}>
        <Card raised="true" className={classes.card}>
          <CardActionArea component={NewWordlistLink}>
            <CardMedia
              component="img"
              alt="Create empty wordlist"
              height="140"
              style={{ objectFit: "fill" }}
              image={WordlistsImage}
              title="Create empty wordlist"
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Empty wordlist
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Create a brand new empty wordlist
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>

        <Card raised="true" className={classes.card}>
          <CardActionArea component={NewWordlistFromYoutubeLink}>
            <CardMedia
              component="img"
              alt="Create wordlist from youtube"
              height="140"
              style={{ objectFit: "fill" }}
              image={YoutubeImage}
              title="Create wordlist from youtube"
            />
            <CardContent>
              <Typography gutterBottom variant="h6">
                Youtube
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Create a new wordlist from subtitles of youtube videos. You can choose the minimum word length
                as well as ignore words that already exists in your other wordlists.
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </main>
    </Container>
  );
}

export default MenuNewWordlist;
