import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Safetybluespothalolight = props => {
  const { safetybluespothalolights, onSafetybluespothalolightSel, selectedSafetybluespothalolight } = props;

  var aa = "X";
  if (selectedSafetybluespothalolight) {
    aa = selectedSafetybluespothalolight.safetybluespothalolighttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Safety Blue Spot and Halo Light</FormLabel>

        <RadioGroup aria-label="safetybluespothalolights" name="safetybluespothalolights" row={true}>
          {safetybluespothalolights.map(safetybluespothalolight => (
            <FormControlLabel
              key={safetybluespothalolight._id}
              value={safetybluespothalolight.safetybluespothalolighttype}
              control={<Radio color="primary" />}
              label={safetybluespothalolight.safetybluespothalolighttype}
              onChange={() => onSafetybluespothalolightSel(safetybluespothalolight)}
              checked={aa === safetybluespothalolight.safetybluespothalolighttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Safetybluespothalolight;
