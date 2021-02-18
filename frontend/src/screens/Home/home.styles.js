import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    margin: theme.spacing(3, 0, 1, 0),
    fontWeight: "bold",
    color: theme.palette.text.primary,
  },

  fab: {
    position: "fixed",
    bottom: theme.spacing(3),
    right: theme.spacing(2),
  },

  container: {
    display: "flex",
    flexDirection: "column",
  },

  wordlistWrapper: {
    borderRadius: theme.shape.borderRadius,
    overflow: "scroll",
    boxShadow: "0 7px 14px rgba(0,0,0,0.25)",
  },
  body: {
    position: "relative",
    height: "400px",
  },
}));
