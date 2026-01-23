import React from "react";
import Button from "@material-ui/core/Button";

const QuoteSave = props => {
  const { onQuoteSave, forklift } = props;

  //console.log('forklift', forklift);

  let disabled = false;

  // leave for now - quote enabled checking

  if  ( !forklift.selectedSeat && forklift.seatrequired ) { disabled=true;}

  if  (!forklift.powertrain && forklift.chassisrequired ){disabled=true;}

  if  (forklift.voltagerequired && !forklift.selectedVoltage ){disabled=true;}

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => onQuoteSave()} disabled={disabled} >Save Quote</Button>
      </div>
    </React.Fragment>
  );
};

export default QuoteSave;
