import React from "react";
import Button from "@material-ui/core/Button";

const OrderCreate = props => {
  const { onOrderCreate } = props;

  return (
    <React.Fragment>
      <div>
        <Button onClick={() => onOrderCreate()}>Generate Order</Button>
      </div>
    </React.Fragment>
  );
};

export default OrderCreate;
