import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Chassis = (props) => {
  const { chassis, onChassisSel, selectedChassis } = props;

  var aa = "";
  if (selectedChassis) {
    aa = selectedChassis.label;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Chassis</FormLabel>

        <RadioGroup aria-label="chassis" name="chassis" row={true}>
          {chassis.map((chass) => (
            <FormControlLabel
              key={chass._id}
              value={chass.label}
              control={<Radio color="primary" />}
              label={chass.label}
              onChange={() => onChassisSel(chass)}
              checked={aa === chass.label}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
    
  );
};

export default Chassis;