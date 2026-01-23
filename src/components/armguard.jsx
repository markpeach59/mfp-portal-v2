import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Armguards = props => {
  const { armguards, onArmguardSel, selectedArmguard } = props;

  var aa = "X";
  if (selectedArmguard) {
    aa = selectedArmguard.armguardtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Arm Guard</FormLabel>

        <RadioGroup aria-label="armguards" name="armguards" row={true}>
          {armguards.map(armguard => (
            <FormControlLabel
              key={armguard._id}
              value={armguard.armguardtype}
              control={<Radio color="primary" />}
              label={armguard.armguardtype}
              onChange={() => onArmguardSel(armguard)}
              checked={aa === armguard.armguardtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Armguards;
