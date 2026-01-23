import _ from "lodash";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";

import "typeface-roboto";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";

const Assigndealer = (props) => {
  const { user, dealers, onAssigndealer } = props;

  const [thedealerId, setDealerId] = useState(user.dealerId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const onDialogOpen = () => {
    setDialogOpen(true);
  };

  const onDialogClose = () => {
    setDialogOpen(false);
  };

  const onSave = () => {
    console.log("User ", user);
    console.log("DealerId ", thedealerId);

    if (user.dealerId !== undefined && user.dealerId === thedealerId) {
      setSnackbarOpen(true);
      setSnackbarMessage(`No Change to Dealer`);
      onDialogClose();
      return;
    }

    if (user.dealerId === undefined && thedealerId === '') {
      setSnackbarOpen(true);
      setSnackbarMessage(`No Change to Dealer`);
      onDialogClose();
      return;
    }

    if (thedealerId === undefined) {
      setSnackbarOpen(true);
      setSnackbarMessage(`No Change to Dealer`);
      onDialogClose();
      return;
    }


    if (thedealerId === ''){
      setSnackbarOpen(true);
      setSnackbarMessage(`Dealer assigment removed from ${user.name} `);
      onAssigndealer(user, thedealerId);
      onDialogClose();
      return;

    }
    setSnackbarOpen(true);
    const n = _.find(dealers, ["_id", thedealerId]).dealername;
    setSnackbarMessage(`Assigned ${user.name} to Dealer ${n}`);
    onAssigndealer(user, thedealerId);
    onDialogClose();
  };

  const onSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;

    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSelectChange = (event) => {
    //console.log("SSSS", event.target.value);
    setDealerId(event.target.value);
  };

  return (
    <React.Fragment>
      <Button onClick={() => onDialogOpen()}>Assign Dealer</Button>

      <Dialog open={dialogOpen} onClose={onDialogClose}>
        <DialogTitle>Assign Dealer</DialogTitle>
        <DialogContent>
         
          <form>
            <FormControl>
              <InputLabel>Dealer</InputLabel>
              <Select value={thedealerId} onChange={handleSelectChange}>
              <option aria-label="None" value='' />
                {dealers.map((dealer) => (
                  <option key={dealer._id} value={dealer._id}>
                    {dealer.dealername}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose}>Cancel</Button>

          <Button onClick={(user, onSave)} variant="contained">
            Save
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

export default  Assigndealer;
