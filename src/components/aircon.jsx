import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Aircons = props => {
  const { aircons, onAirconSel, selectedAircon } = props;

  var aa = "X";
  if (selectedAircon) {
    aa = selectedAircon.aircontype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Air Conditioner</FormLabel>

        <RadioGroup aria-label="aircons" name="aircons" row={true}>
          {aircons.map(aircon => (
            <FormControlLabel
              key={aircon._id}
              value={aircon.aircontype}
              control={<Radio color="primary" />}
              label={aircon.aircontype}
              onChange={() => onAirconSel(aircon)}
              checked={aa === aircon.aircontype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Aircons;
