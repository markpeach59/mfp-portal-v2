import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import "typeface-roboto";

const ResetOptions = props => {
  const { onResetOptions } = props;

  return (
    <React.Fragment>
      <Button onClick={() => onResetOptions()}>Reset Options</Button>
      <br />
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default ResetOptions;