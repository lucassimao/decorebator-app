import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import blue from "@material-ui/core/colors/blue";

const theme = createMuiTheme({
  palette: {
    primary: { main: "#5468ff", light: '##9096ff', dark: '#003ecb', contrastText: '#000' },
    background: {
      default: "#f4f5f9"
    }
  }
});

export default theme;
