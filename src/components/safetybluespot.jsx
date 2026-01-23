import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Safetybluespot = props => {
  const { safetybluespots, onSafetybluespotSel, selectedSafetybluespot } = props;

  var aa = "X";
  if (selectedSafetybluespot) {
    aa = selectedSafetybluespot.safetybluespottype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Safety Blue Spot</FormLabel>

        <RadioGroup aria-label="safetybluespots" name="safetybluespots" row={true}>
          {safetybluespots.map(safetybluespot => (
            <FormControlLabel
              key={safetybluespot._id}
              value={safetybluespot.safetybluespottype}
              control={<Radio color="primary" />}
              label={safetybluespot.safetybluespottype}
              onChange={() => onSafetybluespotSel(safetybluespot)}
              checked={aa === safetybluespot.safetybluespottype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Safetybluespot;