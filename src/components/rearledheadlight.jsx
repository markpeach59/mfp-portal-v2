import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Rearledheadlight = props => {
  const { rearledheadlights, onRearledheadlightSel, selectedRearledheadlight } = props;

  var aa = "X";
  if (selectedRearledheadlight) {
    aa = selectedRearledheadlight.rearledheadlighttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Rear LED Headlight</FormLabel>

        <RadioGroup aria-label="rearledheadlights" name="rearledheadlights" row={true}>
          {rearledheadlights.map(rearledheadlight => (
            <FormControlLabel
              key={rearledheadlight._id}
              value={rearledheadlight.rearledheadlighttype}
              control={<Radio color="primary" />}
              label={rearledheadlight.rearledheadlighttype}
              onChange={() => onRearledheadlightSel(rearledheadlight)}
              checked={aa === rearledheadlight.rearledheadlighttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Rearledheadlight;
