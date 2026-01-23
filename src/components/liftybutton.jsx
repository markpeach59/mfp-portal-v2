import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Liftybutton = props => {
  const { liftybuttons, onLiftybuttonSel, selectedLiftybutton } = props;

  var aa = "X";
  if (selectedLiftybutton) {
    aa = selectedLiftybutton.liftybuttontype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">2 Sided Lifty Button</FormLabel>

        <RadioGroup aria-label="liftybuttons" name="liftybuttons" row={true}>
          {liftybuttons.map(liftybutton => (
            <FormControlLabel
              key={liftybutton._id}
              value={liftybutton.liftybuttontype}
              control={<Radio color="primary" />}
              label={liftybutton.liftybuttontype}
              onChange={() => onLiftybuttonSel(liftybutton)}
              checked={aa === liftybutton.liftybuttontype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Liftybutton;