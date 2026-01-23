import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const SideShift = props => {
  const { sideshifts, onSideShiftSel, selectedSideShift } = props;

  var aa = "X";
  if (selectedSideShift) {
    aa = selectedSideShift.sideshifttype;
    console.log("AA", selectedSideShift.sideshifttype);
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Side Shift</FormLabel>

        <RadioGroup
          aria-label="sideshift"
          name="sideshift"
          //value={value}
          //onChange={handleChange}
          //onChange={() => onSideShiftSel(sideshift)}
          row={true}
        >
          {sideshifts.map(sideshift => (
            <FormControlLabel
              key={sideshift._id}
              value={sideshift.sideshifttype}
              control={<Radio color="primary" />}
              label={sideshift.sideshifttype}
              //checked ={selectedSideShift === {sideshift.sideshifttype}}
              onChange={() => onSideShiftSel(sideshift)}
              checked={aa === sideshift.sideshifttype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default SideShift;
