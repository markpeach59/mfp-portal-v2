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

const Reassignquote = (props) => {
  const { quoteid, quoteowner, users, onReassign } = props;

  //console.log("XXXXX", quoteid, " ", quoteowner, " ", users);

  const [owner, setOwner] = useState(quoteowner);

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
    //console.log("YYY", quoteid, " ", quoteowner, " ", owner);

    if (quoteowner === owner) {
      setSnackbarOpen(true);
      setSnackbarMessage(`No Change`);
      onDialogClose();
      return;
    }

    setSnackbarOpen(true);

    const n = _.find(users, ["_id", owner]).name;
    setSnackbarMessage(`Reassigned quote to ${n}`);
    onReassign(quoteid, owner);
    onDialogClose();
  };

  const onSnackbarClose = (e, reason) => {
    if (reason === "clickaway") return;

    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleSelectChange = (event) => {
    //console.log("SSSS", event.target.value);
    setOwner(event.target.value);
  };

  return (
    <React.Fragment>
      <Button onClick={() => onDialogOpen()}>Reassign</Button>

      <Dialog open={dialogOpen} onClose={onDialogClose}>
        <DialogTitle>Reassign</DialogTitle>
        <DialogContent>
          <form>
            <FormControl>
              <InputLabel>User</InputLabel>
              <Select value={owner} onChange={handleSelectChange}>
                <option aria-label="None" value={owner} />
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDialogClose}>Cancel</Button>

          <Button onClick={(quoteid, onSave)} variant="contained">
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

export default Reassignquote;
