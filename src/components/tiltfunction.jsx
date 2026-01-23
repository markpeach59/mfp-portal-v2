import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Tiltfunction = props => {
  const { tiltfunctions, onTiltfunctionSel, selectedTiltfunction } = props;

  var aa = "X";
  if (selectedTiltfunction) {
    aa = selectedTiltfunction.tiltfunctiontype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Tilt Function</FormLabel>

        <RadioGroup aria-label="tiltfunctions" name="tiltfunctions" row={true}>
          {tiltfunctions.map(tiltfunction => (
            <FormControlLabel
              key={tiltfunction._id}
              value={tiltfunction.heatertype}
              control={<Radio color="primary" />}
              label={tiltfunction.tiltfunctiontype}
              onChange={() => onTiltfunctionSel(tiltfunction)}
              checked={aa === tiltfunction.tiltfunctiontype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};



export default Tiltfunction;