import { createTheme } from "@material-ui/core/styles";

const restrictedTheme = createTheme({
  root: {
    display: "flex",
  }, 
  typography: {
    fontFamily: "Roboto",
    
    },
 
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#a39e9d",
      },
    },
  },
});

export default createTheme(restrictedTheme);