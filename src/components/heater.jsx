import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Heaters = props => {
  const { heaters, onHeaterSel, selectedHeater } = props;

  var aa = "X";
  if (selectedHeater) {
    aa = selectedHeater.heatertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Heater/Demister</FormLabel>

        <RadioGroup aria-label="heaters" name="heaters" row={true}>
          {heaters.map(heater => (
            <FormControlLabel
              key={heater._id}
              value={heater.heatertype}
              control={<Radio color="primary" />}
              label={heater.heatertype}
              onChange={() => onHeaterSel(heater)}
              checked={aa === heater.heatertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Heaters;
