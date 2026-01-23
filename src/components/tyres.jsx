import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Tyres = props => {
  const { tyres, onTyreSel, selectedTyre } = props;

  var aa = "";
  if (selectedTyre) {
    aa = selectedTyre.tyretype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Tyres</FormLabel>

        <RadioGroup aria-label="tyres" name="tyres" row={true}>
          {tyres.map(tyre => (
            <FormControlLabel
              key={tyre._id}
              value={tyre.tyretype}
              control={<Radio color="primary" />}
              label={tyre.tyretype}
              onChange={() => onTyreSel(tyre)}
              checked={aa === tyre.tyretype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Tyres;
