import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React  from "react";


const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.grey[200],
    margin: theme.spacing(2),
  },
  searchIcon: {
    width: theme.spacing(5),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.palette.grey[600]
  },
  inputRoot: {
    color: "inherit",
    fontSize: theme.typography.fontSize * 1.2
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 6),
    width: "100%"
  }
}));

function SearchBox(props) {
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Search …"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
}

export default SearchBox;
