import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Steerings = props => {
  const { steerings, onSteeringSel, selectedSteering } = props;

  var aa = "X";
  if (selectedSteering) {
    aa = selectedSteering.steeringtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Electronic Steering</FormLabel>

        <RadioGroup aria-label="steerings" name="steerings" row={true}>
          {steerings.map(steering => (
            <FormControlLabel
              key={steering._id}
              value={steering.steeringtype}
              control={<Radio color="primary" />}
              label={steering.steeringtype}
              onChange={() => onSteeringSel(steering)}
              checked={aa === steering.steeringtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Steerings;
