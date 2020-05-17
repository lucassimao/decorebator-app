import { Container, IconButton } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import React from "react";
import { Link } from "react-router-dom";
import WordlistsImage from "../../img/wordlists.jpeg";
import YoutubeImage from "../../img/youtube.jpg";

const useStyles = makeStyles(theme => ({
  header: {
    position: "relative",
  },
  main: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  card:{
    margin: theme.spacing(1, 0)
  }
}));

const NewEmptyWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new" innerRef={ref} {...props} />
));

NewEmptyWordlistLink.displayName = 'NewEmptyWordlistLink'

const NewWordlistFromYoutubeLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new-from-youtube" innerRef={ref} {...props} />
));

NewWordlistFromYoutubeLink.displayName = 'NewWordlistFromYoutubeLink'


const HomeLink = React.forwardRef((props, ref) => (
  <Link to="/" innerRef={ref} {...props} />
));
HomeLink.displayName = 'HomeLink'


export function NewWordlistScreen() {
  const classes = useStyles();
  return (
    <Container>

      <header className={classes.header}>
        <IconButton component={HomeLink} size="medium" color="primary"
          style={{ position: "absolute", top: -5, left: 0, fontWeight: "bold" }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          Choose a type
</Typography>
      </header>

      <main className={classes.main}>
        <Card raised={true} className={classes.card}>
          <CardActionArea component={NewEmptyWordlistLink}>
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

        <Card raised={true} className={classes.card}>
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

