import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Blinkey = props => {
  const { blinkeys, onBlinkeySel, selectedBlinkey } = props;

  var aa = "X";
  if (selectedBlinkey) {
    aa = selectedBlinkey.blinkeytype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Blinkey</FormLabel>

        <RadioGroup aria-label="blinkeys" name="blinkeys" row={true}>
          {blinkeys.map(blinkey => (
            <FormControlLabel
              key={blinkey._id}
              value={blinkey.blinkeytype}
              control={<Radio color="primary" />}
              label={blinkey.blinkeytype}
              onChange={() => onBlinkeySel(blinkey)}
              checked={aa === blinkey.blinkeytype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Blinkey;
