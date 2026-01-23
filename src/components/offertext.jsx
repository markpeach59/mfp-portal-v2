import React from "react";


import Typography from "@material-ui/core/Typography";
import "typeface-roboto";

const Offertext = props =>  {
  const {model } = props;

  console.log("Model on Offer", model);

  if ( model === 'AA'){
    return (<React.Fragment>

      <Typography variant="h6">Current Offer : 2.5% off AA Range trunks</Typography>
      <br />
      <br />
    </React.Fragment>)};

if ( model === 'Reach'){
  return (<React.Fragment>

    <Typography variant="h6">Current Offer : 3% off Lithium Powered Reach trunks</Typography>
    <br />
    <br />
  </React.Fragment>)};

 


  if ( model === 'FBAX50-YWL'){
    return (<React.Fragment>

      <Typography variant="h6">Current Offer : 3% off this AX Range trunk</Typography>
      <br />
      <br />
      </React.Fragment>)};

 
// default offer
  return (
        <React.Fragment>


<br />
        </React.Fragment>

    );
    }


export default Offertext;
