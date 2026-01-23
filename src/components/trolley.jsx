import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Trolley = props => {
  const { trolleys, onTrolleySel, selectedTrolley } = props;

  var aa = "X";
  if (selectedTrolley) {
    aa = selectedTrolley.trolleytype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Trolley</FormLabel>

        <RadioGroup aria-label="trolleys" name="trolleys" row={true}>
          {trolleys.map(trolley => (
            <FormControlLabel
              key={trolley._id}
              value={trolley.trolleytype}
              control={<Radio color="primary" />}
              label={trolley.trolleytype}
              onChange={() => onTrolleySel(trolley)}
              checked={aa === trolley.trolleytype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Trolley;
