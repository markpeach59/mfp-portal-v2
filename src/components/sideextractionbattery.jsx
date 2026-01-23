import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Sideextractionbatterys = props => {
  const {
    sideextractionbatterys,
    onSideextractionbatterySel,
    selectedSideextractionbattery
  } = props;

  var aa = "X";
  if (selectedSideextractionbattery) {
    aa = selectedSideextractionbattery.sideextractionbatterytype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Side Extraction Battery</FormLabel>

        <RadioGroup
          aria-label="sideextractionbatterys"
          name="sideextractionbatterys"
          row={true}
        >
          {sideextractionbatterys.map(sideextractionbattery => (
            <FormControlLabel
              key={sideextractionbattery._id}
              value={sideextractionbattery.sideextractionbatterytype}
              control={<Radio color="primary" />}
              label={sideextractionbattery.sideextractionbatterytype}
              onChange={() => onSideextractionbatterySel(sideextractionbattery)}
              checked={aa === sideextractionbattery.sideextractionbatterytype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Sideextractionbatterys;
