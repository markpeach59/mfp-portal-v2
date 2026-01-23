import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Precleaners = props => {
  const { precleaners, onPrecleanerSel, selectedPrecleaner } = props;

  var aa = "X";
  if (selectedPrecleaner) {
    aa = selectedPrecleaner.precleanertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Pre Cleaner</FormLabel>

        <RadioGroup aria-label="precleaners" name="precleaners" row={true}>
          {precleaners.map(precleaner => (
            <FormControlLabel
              key={precleaner._id}
              value={precleaner.heatertype}
              control={<Radio color="primary" />}
              label={precleaner.precleanertype}
              onChange={() => onPrecleanerSel(precleaner)}
              checked={aa === precleaner.precleanertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Precleaners;