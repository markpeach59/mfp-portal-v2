import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Halolight = props => {
  const { halolights, onHalolightSel, selectedHalolight } = props;

  var aa = "X";
  if (selectedHalolight) {
    aa = selectedHalolight.halolighttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Halo Light</FormLabel>

        <RadioGroup aria-label="halolights" name="halolights" row={true}>
          {halolights.map(halolight => (
            <FormControlLabel
              key={halolight._id}
              value={halolight.halolighttype}
              control={<Radio color="primary" />}
              label={halolight.halolighttype}
              onChange={() => onHalolightSel(halolight)}
              checked={aa === halolight.halolighttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Halolight;