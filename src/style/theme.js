import { createTheme } from "@material-ui/core/styles";

const myTheme = createTheme({
  root: {
    display: "flex",
  }, 
  typography: {
    fontFamily: "Roboto",
    
    },
 
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#C22424",
      },
    },
  },
});

export default createTheme(myTheme);