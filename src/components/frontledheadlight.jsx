import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Frontledheadlight = props => {
  const { frontledheadlights, onFrontledheadlightSel, selectedFrontledheadlight } = props;

  var aa = "X";
  if (selectedFrontledheadlight) {
    aa = selectedFrontledheadlight.frontledheadlighttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Front LED Headlight</FormLabel>

        <RadioGroup aria-label="frontledheadlights" name="frontledheadlights" row={true}>
          {frontledheadlights.map(frontledheadlight => (
            <FormControlLabel
              key={frontledheadlight._id}
              value={frontledheadlight.frontledheadlighttype}
              control={<Radio color="primary" />}
              label={frontledheadlight.frontledheadlighttype}
              onChange={() => onFrontledheadlightSel(frontledheadlight)}
              checked={aa === frontledheadlight.frontledheadlighttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Frontledheadlight;
