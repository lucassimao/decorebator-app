import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { Link } from "react-router-dom";
import WordlistsImage from "./wordlists.jpeg";
import YoutubeImage from "./youtube2.jpg";
import WikipediaImage from "./wikipedia.jpeg";

import clsx from "clsx";

const useStyles = makeStyles(theme => ({
  main: {
    position: "relative"
  },
  img: {
    position: "absolute",
    top: theme.spacing(12),
    left: 0,
    right: 0,
    display: "block",
    maxWidth: "50%",
    margin: "0 auto",
    borderRadius: theme.spacing(1)
  },
  img1: {
    transform: "rotate(-20deg) translate(-70px,10px)"
  },
  img2: {
    transform: "rotate(20deg) translate(70px,10px)"
  }
}));

const NewWordlistLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new" innerRef={ref} {...props} />
));

const NewWordlistFromYoutubeLink = React.forwardRef((props, ref) => (
  <Link to="/wordlists/new-from-youtube" innerRef={ref} {...props} />
));
function Welcome() {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h6" style={{ fontWeight: "bold" }} align="center">
        No wordlists!
      </Typography>

      <Typography variant="body2" color="textSecondary" align="center" component="p">
        Create a brand new empty wordlist
      </Typography>

      <div className={classes.main}>
        <Card raised={true} className={clsx(classes.img, classes.img1)}>
          <CardActionArea component={NewWordlistLink}>
            <CardMedia
              component="img"
              alt="Create empty wordlist"
              style={{ objectFit: "fill" }}
              image={WordlistsImage}
              title="Create empty wordlist"
            />
          </CardActionArea>
          {/* <CardContent></CardContent> */}
        </Card>
        <Card raised={true} className={clsx(classes.img, classes.img2)}>
          <CardActionArea component={NewWordlistLink}>
            <CardMedia
              component="img"
              alt="Create empty wordlist"
              style={{ objectFit: "fill" }}
              image={WikipediaImage}
              title="Create empty wordlist"
            />
          </CardActionArea>
          {/* <CardContent></CardContent> */}
        </Card>
        <Card raised={true} className={clsx(classes.img)}>
          <CardActionArea component={NewWordlistLink}>
            <CardMedia
              component="img"
              alt="Create empty wordlist"
              style={{ objectFit: "fill" }}
              image={YoutubeImage}
              title="Create empty wordlist"
            />
          </CardActionArea>
          {/* <CardContent></CardContent> */}
        </Card>
      </div>
    </>
  );
}

export default Welcome;
