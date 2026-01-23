import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Pincode = props => {
  const { pincodes, onPincodeSel, selectedPincode } = props;

  var aa = "X";
  if (selectedPincode) {
    aa = selectedPincode.pincodetype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Pincode</FormLabel>

        <RadioGroup aria-label="pincodes" name="pincodes" row={true}>
          {pincodes.map(pincode => (
            <FormControlLabel
              key={pincode._id}
              value={pincode.pincodetype}
              control={<Radio color="primary" />}
              label={pincode.pincodetype}
              onChange={() => onPincodeSel(pincode)}
              checked={aa === pincode.pincodetype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Pincode;