import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Stabiliser = props => {
  const { stabilisers, onStabiliserSel, selectedStabiliser } = props;

  var aa = "X";
  if (selectedStabiliser) {
    aa = selectedStabiliser.stabilisertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Stabiliser Caster Wheel</FormLabel>

        <RadioGroup aria-label="stabilisers" name="stabilisers" row={true}>
          {stabilisers.map(stabiliser => (
            <FormControlLabel
              key={stabiliser._id}
              value={stabiliser.stabilisertype}
              control={<Radio color="primary" />}
              label={stabiliser.stabilisertype}
              onChange={() => onStabiliserSel(stabiliser)}
              checked={aa === stabiliser.stabilisertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Stabiliser;