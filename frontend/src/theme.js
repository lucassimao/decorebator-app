import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
  shape: {
    borderRadius: '8px'
  },
  palette: {
    primary: { main: "#5468ff", light: "##9096ff", dark: "#003ecb", contrastText: "#fff" },
    text:{
        primary: '#334155',
        secondary: '#8a929d'
    },
    background: {
      default: "#f4f5f9",
    }
  }
});

export default theme;
