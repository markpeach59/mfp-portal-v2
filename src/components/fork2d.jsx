import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Fork2ds = props => {
  const { fork2ds, onFork2dSel, selectedFork2d } = props;

  var aa = "";
  if (selectedFork2d) {
    aa = selectedFork2d.forklength;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Forks</FormLabel>

        <RadioGroup aria-label="fork2ds" name="fork2ds" row={true}>
          {fork2ds.map(fork2d => (
            <FormControlLabel
              key={fork2d._id}
              value={fork2d.forklength}
              control={<Radio color="primary" />}
              label={fork2d.forklength}
              onChange={() => onFork2dSel(fork2d)}
              checked={aa === fork2d.forklength}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Fork2ds;
