import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Platforms = props => {
  const { platforms, onPlatformSel, selectedPlatform } = props;

  var aa = "X";
  if (selectedPlatform) {
    aa = selectedPlatform.platformtype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Platform</FormLabel>

        <RadioGroup aria-label="platforms" name="platforms" row={true}>
          {platforms.map(platform => (
            <FormControlLabel
              key={platform._id}
              value={platform.platformtype}
              control={<Radio color="primary" />}
              label={platform.platformtype}
              onChange={() => onPlatformSel(platform)}
              checked={aa === platform.platformtype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Platforms;
