import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Cabins = props => {
  const { cabins, onCabinSel, selectedCabin, selectedUpsweptexhaust } = props;

  var aa = "";
  if (selectedCabin) {
    aa = selectedCabin.cabinoption;
  }

  function onUpswept () {
    
    return selectedUpsweptexhaust ? true:false;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Cabins</FormLabel>

        <RadioGroup aria-label="cabins" name="cabins" row={true}>
          {cabins.map(cabin => (
            <FormControlLabel
              key={cabin._id}
              value={cabin.cabinoption}
              control={<Radio color="primary" />}
              label={cabin.cabinoption}
              disabled ={onUpswept()}
              onChange={() => onCabinSel(cabin)}
              checked={aa === cabin.cabinoption}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Cabins;
