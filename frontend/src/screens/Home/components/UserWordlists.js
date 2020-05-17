import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import PropTypes from 'proptypes';
import React from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  listItem: {
    paddingLeft: theme.spacing(1),
    paddingRight: 0,
    "& .text": { marginLeft: theme.spacing(1) }
  },

  arrow: {
    color: theme.palette.grey[500]
  },

  list: {
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    backgroundColor: "#fff",
  }
}));

const WordlistLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);
WordlistLink.displayName = 'WordlistLink'

function Wordlists(props) {
  const classes = useStyles();
  const { wordlists } = props;

  return (
    <List className={classes.list}>
      {wordlists.map(w => (
        <ListItem
          className={classes.listItem}
          key={w._id}
          to={`/wordlists/${w._id}`}
          button
          component={WordlistLink}
        >
          <Avatar style={{ backgroundColor: w.avatarColor }}>{w.name[0]}</Avatar>
          <ListItemText className="text" primary={w.name} />
          <ArrowRightIcon className={classes.arrow} />
        </ListItem>
      ))}
    </List>
  );
}

Wordlists.propTypes = { wordlists: PropTypes.array }
export default Wordlists;
