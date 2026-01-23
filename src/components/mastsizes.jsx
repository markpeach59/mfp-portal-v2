import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

const MastSizes = props => {
  const { mastsizes, onMastSizeSel, selectedMastSize } = props;

  var aa = "";
  if (selectedMastSize) {
    aa = selectedMastSize.length;
    //console.log("AXA");
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Mast Size</FormLabel>

        <RadioGroup
          aria-label="mastsize"
          name="mastsize"
          //value={value}
          //onChange={handleChange}
          //onClick={() => onMastSizeSel(mastsize)}
        >
          {mastsizes.map(mastsize => (
            <FormControlLabel
              key={mastsize._id}
              value={mastsize.length}
              control={<Radio color="primary" />}
              label={mastsize.length}
              checked={aa === mastsize.length}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </React.Fragment>
  );
};

export default MastSizes;
