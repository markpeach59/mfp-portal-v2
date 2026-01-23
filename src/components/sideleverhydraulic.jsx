import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Sideleverhydraulics = props => {
  const {
    sideleverhydraulics,
    onSideleverhydraulicSel,
    selectedSideleverhydraulic
  } = props;

  var aa = "X";
  if (selectedSideleverhydraulic) {
    aa = selectedSideleverhydraulic.sideleverhydraulictype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Side Lever Hydraulics</FormLabel>

        <RadioGroup
          aria-label="sideleverhydraulics"
          name="sideleverhydraulics"
          row={true}
        >
          {sideleverhydraulics.map(sideleverhydraulic => (
            <FormControlLabel
              key={sideleverhydraulic._id}
              value={sideleverhydraulic.sideleverhydraulictype}
              control={<Radio color="primary" />}
              label={sideleverhydraulic.sideleverhydraulictype}
              onChange={() => onSideleverhydraulicSel(sideleverhydraulic)}
              checked={aa === sideleverhydraulic.sideleverhydraulictype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Sideleverhydraulics;
