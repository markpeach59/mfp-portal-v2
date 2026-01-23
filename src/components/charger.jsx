import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Chargers = props => {
  const { chargers, onChargerSel, selectedCharger } = props;

  var aa = "";
  if (selectedCharger) {
    aa = selectedCharger.chargertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Chargers</FormLabel>

        <RadioGroup aria-label="chargers" name="chargers" row={true}>
          {chargers.map(charger => (
            <FormControlLabel
              key={charger._id}
              value={charger.chargertype}
              control={<Radio color="primary" />}
              label={charger.chargertype}
              onChange={() => onChargerSel(charger)}
              checked={aa === charger.chargertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Chargers;
