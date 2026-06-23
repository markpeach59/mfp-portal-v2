import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Keypad = props => {
  const { keypads, onKeypadSel, selectedKeypad } = props;

  var aa = "X";
  if (selectedKeypad) {
    aa = selectedKeypad.keypadtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Keypad Entry</FormLabel>

        <RadioGroup aria-label="keypads" name="keypads" row={true}>
          {keypads.map(keypad => (
            <FormControlLabel
              key={keypad._id}
              value={keypad.keypadtype}
              control={<Radio color="primary" />}
              label={keypad.keypadtype}
              onChange={() => onKeypadSel(keypad)}
              checked={aa === keypad.keypadtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Keypad;
