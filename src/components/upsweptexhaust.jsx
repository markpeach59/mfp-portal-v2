import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Upsweptexhausts = props => {
  const { upsweptexhausts, onUpsweptexhaustSel, selectedUpsweptexhaust, selectedCabin } = props;

  var aa = "X";
  if (selectedUpsweptexhaust) {
    aa = selectedUpsweptexhaust.upsweptexhausttype;
  }

  function onCabin () {
    /* selected FP will always mean 3rd + 4th has been selected */
    return selectedCabin ? true:false;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Upswept Exhaust</FormLabel>

        <RadioGroup aria-label="upsweptexhausts" name="upsweptexhausts" row={true}>
          {upsweptexhausts.map(upsweptexhaust => (
            <FormControlLabel
              key={upsweptexhaust._id}
              value={upsweptexhaust.upsweptexhausttype}
              control={<Radio color="primary" />}
              label={upsweptexhaust.upsweptexhausttype}
              disabled ={onCabin()}
              onChange={() => onUpsweptexhaustSel(upsweptexhaust)}
              checked={aa === upsweptexhaust.upsweptexhausttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Upsweptexhausts;