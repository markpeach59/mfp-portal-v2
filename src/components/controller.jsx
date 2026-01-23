import React from "react";

import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Divider from "@material-ui/core/Divider";

const Controller = props => {
  const { controllers, onControllerSel, selectedController } = props;

  var aa = "XX";
  if (selectedController) {
    aa = selectedController.controllertype;
    console.log("AA", aa);
  }

  return (
    <React.Fragment>
      <FormControl component="fieldset">
        <FormLabel component="legend">Controller</FormLabel>

        <RadioGroup
          aria-label="controller"
          name="controller"
          //value={value}
          //onChange={handleChange}
          //onChange={() => onControllerSel(controller)}
          row={true}
        >
          {controllers.map(controller => (
            <FormControlLabel
              key={controller._id}
              value={controller.controllertype}
              control={<Radio color="primary" />}
              label={controller.controllertype}
              //checked ={selectedController === {controller.controllertype}}
              onChange={() => onControllerSel(controller)}
              checked={aa === controller.controllertype}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default Controller;