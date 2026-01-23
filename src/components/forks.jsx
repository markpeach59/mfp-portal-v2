import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Forks = props => {
  const { forks, onForkSel, selectedFork } = props;

  var aa = "";
  if (selectedFork) {
    aa = selectedFork.forklength;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Forks</FormLabel>

        <RadioGroup
          aria-label="forks"
          name="forks"
          //value={value}
          //onChange={handleChange}
          row={true}
        >
          {forks.map(fork => (
            <FormControlLabel
              key={fork._id}
              value={fork.forklength}
              control={<Radio color="primary" />}
              label={fork.forklength}
              onChange={() => onForkSel(fork)}
              checked={aa === fork.forklength}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Forks;
