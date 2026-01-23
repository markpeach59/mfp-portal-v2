import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Heavydutyairfilters = props => {
  const { heavydutyairfilters, onHeavydutyairfilterSel, selectedHeavydutyairfilter } = props;

  var aa = "X";
  if (selectedHeavydutyairfilter) {
    aa = selectedHeavydutyairfilter.heavydutyairfiltertype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Heavy Duty Air Filter</FormLabel>

        <RadioGroup aria-label="heavydutyairfilters" name="heavydutyairfilters" row={true}>
          {heavydutyairfilters.map(heavydutyairfilter => (
            <FormControlLabel
              key={heavydutyairfilter._id}
              value={heavydutyairfilter.heavydutyairfiltertype}
              control={<Radio color="primary" />}
              label={heavydutyairfilter.heavydutyairfiltertype}
              onChange={() => onHeavydutyairfilterSel(heavydutyairfilter)}
              checked={aa === heavydutyairfilter.heavydutyairfiltertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Heavydutyairfilters;