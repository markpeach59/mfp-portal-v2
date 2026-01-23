import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";

import "typeface-roboto";
import { TextField } from "@material-ui/core";

const Confirmorder = (props) => {
   
  const {orderid, onConfirmorder } = props;

  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [thestocknumber, setThestocknumber] = useState(0);

  const onDialogOpen = () => {
    setDialogOpen(true);
  };

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  const onConfirm = () => {
    setSnackbarOpen(true);
    setSnackbarMessage(`Setting Order as Confirmed`);
    // need to handle confirmation
    onConfirmorder(orderid, thestocknumber);
    onDialogClose();
  };

  

  const onSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;

    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <React.Fragment>
      <Button onClick={() => onDialogOpen()}>Confirm Order</Button>

      <Dialog open={dialogOpen} onClose={onDialogClose}>
        <DialogTitle>Confirm Order to Dealer</DialogTitle>
        <DialogContent>
        <TextField
            margin="normal"
            label="Please Enter Stock Number"
            InputProps={{ name: "thestocknumber" }}
            onChange={(e) => setThestocknumber(e.target.value)}
            value={thestocknumber}
            fullwidth="true"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose}>Cancel</Button>
          
          <Button onClick={onConfirm} disabled={!thestocknumber} variant="contained">
            Confirm
          </Button>
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

export default Confirmorder;
