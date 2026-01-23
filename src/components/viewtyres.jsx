import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";

import OptionImg from "./optionimg";

import "typeface-roboto";


const Viewtyres = (props) => {
   
  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onDialogOpen = () => {

    setDialogOpen(true);

  };

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  

  const onSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;

    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <React.Fragment>
      <Button onClick={() => onDialogOpen()}>View Tyre Options</Button>

      <Dialog open={dialogOpen} onClose={onDialogClose}>
        <DialogTitle>Available Tyre Options</DialogTitle>
        <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={4}>
<OptionImg imgName="SETyre.png" />
<h6>S/E Tyre</h6>
</Grid>
<Grid item xs={4}>
<OptionImg imgName="NonMarkingTyre.png" />
<h6>Non Marking</h6>
</Grid><Grid item xs={4}>
<OptionImg imgName="SuperElasticTyre.png" />
<h6>Super Elastic</h6>
            </Grid>
        </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose}>Close</Button>
          
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        onClose={onSnackbarClose}
        autoHideDuration={4000}
      />
    </React.Fragment>
  );
};

export default Viewtyres;