import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Wirelesscamerasystem = props => {
  const { wirelesscamerasystems, onWirelesscamerasystemSel, selectedWirelesscamerasystem } = props;

  var aa = "X";
  if (selectedWirelesscamerasystem) {
    aa = selectedWirelesscamerasystem.wirelesscamerasystemtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Wireless Camera System</FormLabel>

        <RadioGroup aria-label="wirelesscamerasystems" name="wirelesscamerasystems" row={true}>
          {wirelesscamerasystems.map(wirelesscamerasystem => (
            <FormControlLabel
              key={wirelesscamerasystem._id}
              value={wirelesscamerasystem.wirelesscamerasystemtype}
              control={<Radio color="primary" />}
              label={wirelesscamerasystem.wirelesscamerasystemtype}
              onChange={() => onWirelesscamerasystemSel(wirelesscamerasystem)}
              checked={aa === wirelesscamerasystem.wirelesscamerasystemtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Wirelesscamerasystem;
