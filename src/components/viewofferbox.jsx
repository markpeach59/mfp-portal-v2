import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Snackbar from "@material-ui/core/Snackbar";
import Grid from "@material-ui/core/Grid";



import "typeface-roboto";


import Typography from "@material-ui/core/Typography";

const ViewOfferBox = (props) => {
   
  const [dialogOpen, setDialogOpen] = useState(true); // set to true so it opens immmediately

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
      <Button color="inherit" onClick={() => onDialogOpen()}>Offer</Button>

      <Dialog open={dialogOpen} onClose={onDialogClose}>
        <DialogTitle>Important Notice – Additional Discount on Electric Machines</DialogTitle>
        <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
          
        
          <React.Fragment>
        
 
<Typography variant="body1" paragraph>
  From{' '}
  <Typography component="span" style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.5' }}>
    Monday, 21st July 2025
  </Typography>
  , all orders for Electric Machines will receive an{' '}
  <Typography component="span" style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.5' }}>
    additional 5% discount
  </Typography>
  . Please ensure this discount is applied before submitting the order to the Sales Team.
</Typography>

<Typography variant="body1" paragraph>
  <Typography component="span" style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.5' }}>
    Note:
  </Typography>{' '}
  This offer{' '}
  <Typography component="span" style={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: '1.5' }}>
    does not apply to AX machines.
  </Typography>
</Typography>  
         </React.Fragment>
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

export default ViewOfferBox;