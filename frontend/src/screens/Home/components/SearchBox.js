import InputBase from "@material-ui/core/InputBase";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import PropTypes from "proptypes";
import React from "react";
import { connect } from "react-redux";
import { fetchUserWordlists } from "../../../redux/wordlists/actions";

const useStyles = makeStyles((theme) => ({
  search: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#fff",
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
  },
  searchWrapper: {
    backgroundColor: theme.palette.primary.main,
    borderRadius: theme.spacing(0.5),
    pointerEvents: "none",
    padding: theme.spacing(0.6, 1),
    color: "#fff",
    boxShadow: "0 3px 7px rgba(0,0,0,0.25)",
  },
  inputRoot: {
    color: "inherit",
    flexGrow: 1,
    marginLeft: theme.spacing(1),
    fontSize: theme.typography.fontSize * 1.5,
  },
  inputInput: {
    color: "#000",
  },
}));

function SearchBox(props) {
  const { filterWordlists, filter } = props;
  const classes = useStyles();

  return (
    <div className={classes.search}>
      <InputBase
        placeholder="Search …"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        autoFocus
        onChange={(evt) => filterWordlists(evt.target.value)}
        inputProps={{ "aria-label": "search" }}
        defaultValue={filter}
      />
      <div className={classes.searchWrapper}>
        <SearchIcon />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  filter: state.wordlists.filter,
});

const mapDispatchToProps = (dispatch) => ({
  filterWordlists: (filter) => {
    if (filter && filter.trim() && filter.trim().length > 2) {
      dispatch(fetchUserWordlists({ page: 0, filter }));
    } else if (filter === "") {
      dispatch(fetchUserWordlists({ page: 0 }));
    }
  },
});

SearchBox.propTypes = {
  filterWordlists: PropTypes.func,
  filter: PropTypes.string,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
