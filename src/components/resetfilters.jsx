import React from "react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";

import "typeface-roboto";

const ResetFilters = props => {
  const { onResetFilters } = props;

  return (
    <React.Fragment>
      <Button onClick={() => onResetFilters()}>Reset Filters</Button>
      <br />
      <Divider />
      <br />
    </React.Fragment>
  );
};

export default ResetFilters;
