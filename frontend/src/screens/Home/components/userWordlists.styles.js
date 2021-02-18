import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  listItem: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    display: "flex",
    justifyContent: "start",
  },

  avatar: {
    textDecoration: "none",
    textTransform: "uppercase",
  },

  button: {
    paddingLeft: theme.spacing(2),
    textTransform: "none",
    flexGrow: 1,
    justifyContent: "left",
  },
  play: {
    marginLeft: theme.spacing(2),
    fontSize: theme.typography.h4.fontSize,
  },

  list: {
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
    backgroundColor: "#fff",
  },
}));
