import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { registerDealer } from "../services/dealerService";

import "typeface-roboto";

class RegisterDealerForm extends Component {
  state = {
    dealername: { value: null, error: false, helperText: null },
    dealermarkup: { value: null, error: false, helperText: null }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const { data } = await registerDealer(this.dealernameInput.value);
      console.log("registered as ", data);
    } catch (error) {
      if (error.response) {
        const dealername = { ...this.state.dealername };
        dealername.error = true;
        dealername.helperText = error.response.data;

        this.setState({ dealername });
      }
      console.log("here", error);
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Dealer Registration</h1>

        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Enter Dealer Name"
            fullWidth
            autoFocus
            required
            inputRef={input => (this.dealernameInput = input)}
            error={this.state.dealername.error}
            helperText={this.state.dealername.helperText}
          />

          <Button type="submit" color="primary">
            Register
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default RegisterDealerForm;
