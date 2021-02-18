import { Container } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import clsx from "clsx";
import React from "react";
import WikipediaImage from "../../img/wikipedia.jpeg";
import WordlistsImage from "../../img/wordlists.jpeg";
import YoutubeImage from "../../img/youtube.jpg";
import MenuLink from "../../components/ui/MenuLink";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cards: {
    position: "relative",
  },
  card: {
    position: "absolute",
    top: theme.spacing(-16),
    left: 0,
    right: 0,
    maxWidth: "70%",
    margin: "0 auto",
    borderRadius: theme.spacing(1),
  },
  img: {
    objectFit: "fill",
  },
  youtubeCard: {
    maxWidth: "80%",
  },
  wordlistsCard: {
    transform: "rotate(-15deg) translate(-70px,10px)",
  },
  wikipediaCard: {
    transform: "rotate(15deg) translate(70px,10px)",
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

function Welcome() {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      {/* used to center both the cards and the title */}
      <div>
        <div className={classes.cards}>
          <Card
            raised={true}
            className={clsx(classes.card, classes.wordlistsCard)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Create empty wordlist"
                className={classes.img}
                image={WordlistsImage}
                title="Create empty wordlist"
              />
            </CardActionArea>
          </Card>
          <Card
            raised={true}
            className={clsx(classes.card, classes.wikipediaCard)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                alt="Create empty wordlist"
                className={classes.img}
                image={WikipediaImage}
                title="Create empty wordlist"
              />
            </CardActionArea>
          </Card>
          <Card
            raised={true}
            className={clsx(classes.card, classes.youtubeCard)}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                className={classes.img}
                alt="Create empty wordlist"
                image={YoutubeImage}
                title="Create empty wordlist"
              />
            </CardActionArea>
          </Card>
        </div>

        <Typography variant="h5" style={{ fontWeight: "bold" }} align="center">
          No wordlists !
        </Typography>

        <Typography
          variant="body1"
          color="textSecondary"
          align="center"
          component="p"
        >
          Create a brand new wordlist
        </Typography>
      </div>

      <Fab
        component={MenuLink}
        className={classes.button}
        color="primary"
        variant="extended"
      >
        <AddIcon /> New
      </Fab>
    </Container>
  );
}

export default Welcome;
