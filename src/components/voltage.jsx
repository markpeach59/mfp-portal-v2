import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Voltage = (props) => {
  const { voltages, onVoltageSel, selectedVoltage } = props;

  //console.log("Voltage", voltages);

  var aa = "";
  if (selectedVoltage) {
    aa = selectedVoltage.label;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Voltage Type</FormLabel>

        <RadioGroup aria-label="voltage" name="voltage" row={true}>
          {voltages.map((voltage) => (
            <FormControlLabel
              key={voltage._id}
              value={voltage.label}
              control={<Radio color="primary" />}
              label={voltage.label}
              onChange={() => onVoltageSel(voltage)}
              checked={aa === voltage.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
    
  );
};

export default Voltage;