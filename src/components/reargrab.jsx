import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Reargrabs = props => {
  const { reargrabs, onReargrabSel, selectedReargrab } = props;

  var aa = "X";
  if (selectedReargrab) {
    aa = selectedReargrab.reargrabtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Rear Grab Handle with Horn</FormLabel>

        <RadioGroup aria-label="reargrabs" name="reargrabs" row={true}>
          {reargrabs.map(reargrab => (
            <FormControlLabel
              key={reargrab._id}
              value={reargrab.reargrabtype}
              control={<Radio color="primary" />}
              label={reargrab.reargrabtype}
              onChange={() => onReargrabSel(reargrab)}
              checked={aa === reargrab.reargrabtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Reargrabs;
