import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Batterycompartments = props => {
  const { batterycompartments, onBatterycompartmentSel, selectedBatterycompartment } = props;

  var aa = "";
  if (selectedBatterycompartment) {
    aa = selectedBatterycompartment.batterycompartmenttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Battery Compartment</FormLabel>

        <RadioGroup aria-label="batterycompartments" name="batterycompartments" row={true}>
          {batterycompartments.map(batterycompartment => (
            <FormControlLabel
              key={batterycompartment._id}
              value={batterycompartment.batterycompartmenttype}
              control={<Radio color="primary" />}
              label={batterycompartment.batterycompartmenttype}
              onChange={() => onBatterycompartmentSel(batterycompartment)}
              checked={aa === batterycompartment.batterycompartmenttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Batterycompartments;