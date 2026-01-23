import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Forkpositioners = props => {
  const {
    forkpositioners,
    onForkpositionerSel,
    selectedForkpositioner
  } = props;

  var aa = "X";
  if (selectedForkpositioner) {
    aa = selectedForkpositioner.forkpositionertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Sideshifting Fork Positioner</FormLabel>

        <RadioGroup
          aria-label="forkpositioners"
          name="forkpositioners"
          row={true}
        >
          {forkpositioners.map(forkpositioner => (
            <FormControlLabel
              key={forkpositioner._id}
              value={forkpositioner.forkpositionertype}
              control={<Radio color="primary" />}
              label={forkpositioner.forkpositionertype}
              onChange={() => onForkpositionerSel(forkpositioner)}
              checked={aa === forkpositioner.forkpositionertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Forkpositioners;
