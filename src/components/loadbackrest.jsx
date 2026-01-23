import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Loadbackrests = props => {
  const { loadbackrests, onLoadbackrestSel, selectedLoadbackrest } = props;

  var aa = "X";
  if (selectedLoadbackrest) {
    aa = selectedLoadbackrest.loadbackresttype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Load Backrest</FormLabel>

        <RadioGroup aria-label="loadbackrests" name="loadbackrests" row={true}>
          {loadbackrests.map(loadbackrest => (
            <FormControlLabel
              key={loadbackrest._id}
              value={loadbackrest.loadbackresttype}
              control={<Radio color="primary" />}
              label={loadbackrest.loadbackresttype}
              onChange={() => onLoadbackrestSel(loadbackrest)}
              checked={aa === loadbackrest.loadbackresttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Loadbackrests;
