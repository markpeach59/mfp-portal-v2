import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Displaywithcamera = props => {
  const { displaywithcameras, onDisplaywithcameraSel, selectedDisplaywithcamera } = props;

  var aa = "XX";
  if (selectedDisplaywithcamera) {
    aa = selectedDisplaywithcamera.displaywithcameratype;
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Display with Camera</FormLabel>

        <RadioGroup aria-label="displaywithcameras" name="displaywithcameras" row={true}>
          {displaywithcameras.map(displaywithcamera => (
            <FormControlLabel
              key={displaywithcamera._id}
              value={displaywithcamera.displaywithcameratype}
              control={<Radio color="primary" />}
              label={displaywithcamera.displaywithcameratype}
              onChange={() => onDisplaywithcameraSel(displaywithcamera)}
              checked={aa === displaywithcamera.displaywithcameratype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Displaywithcamera;
