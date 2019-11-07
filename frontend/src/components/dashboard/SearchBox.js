import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import React from "react";
import { connect } from "react-redux";
import { fetchUserWordlists, fetchPublicWordlists } from "../../thunks/wordlist.thunks";

const useStyles = makeStyles(theme => ({
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.grey[200]
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
  const { filterWordlists } = props;
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
        onKeyUp={evt => filterWordlists(evt.target.value)}
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  filterWordlists: filter => {
    if (filter && filter.trim() && filter.trim().length > 2) {
      dispatch(fetchUserWordlists({ page: 0, filter }));
      dispatch(fetchPublicWordlists({ page: 0, filter }));
    } else if (filter === "") {
      dispatch(fetchUserWordlists({ page: 0 }));
      dispatch(fetchPublicWordlists({ page: 0 }));
    }
  }
});

export default connect(
  null,
  mapDispatchToProps
)(SearchBox);
