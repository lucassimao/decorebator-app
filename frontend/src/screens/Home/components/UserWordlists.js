import { Button, Divider, IconButton } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PropTypes from "proptypes";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useStyles } from "./userWordlists.styles";

function Wordlists(props) {
  const classes = useStyles();
  const { wordlists } = props;

  return (
    <List className={classes.list}>
      {wordlists.map((w, idx) => (
        <React.Fragment key={w.id}>
          <ListItem className={classes.listItem}>
            <Avatar
              className={classes.avatar}
              component={RouterLink}
              to={`/wordlists/${w.id}`}
              style={{ backgroundColor: w.avatarColor }}
            >
              {w.name[0]}
            </Avatar>
            <Button
              className={classes.button}
              component={RouterLink}
              to={`/wordlists/${w.id}`}
            >
              {w.name}
            </Button>

            <IconButton
              color="primary"
              component={RouterLink}
              to={`/wordlists/${w.id}/quizzes`}
            >
              <PlayCircleFilledIcon className={classes.play} />
            </IconButton>
          </ListItem>
          {idx < wordlists.length - 1 && (
            <Divider variant="middle" component="li" />
          )}
        </React.Fragment>
      ))}
    </List>
  );
}

Wordlists.propTypes = { wordlists: PropTypes.array };
export default Wordlists;
