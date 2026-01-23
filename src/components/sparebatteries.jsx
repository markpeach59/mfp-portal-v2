import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Sparebatteries = props => {
  const { spares, onSpareSel, selectedSpare } = props;

  var aa = "";
  if (selectedSpare) {
    aa = selectedSpare.sparetype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Spare Battery</FormLabel>

        <RadioGroup aria-label="sparebattery" name="sparebattery" row={true}>
          {spares.map(spare => (
            <FormControlLabel
              key={spare._id}
              value={spare.sparetype}
              control={<Radio color="primary" />}
              label={spare.sparetype}
              onChange={() => onSpareSel(spare)}
              checked={aa === spare.sparetype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Sparebatteries;