import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import { registerUser } from "../services/userService";

import "typeface-roboto";

class RegisterForm extends Component {
  state = {
    name: { value: null, error: false, helperText: null },
    email: { value: null, error: false, helperText: null },
    password: { value: null, error: false, helperText: null }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const { data } = await registerUser(
        this.nameInput.value,
        this.emailInput.value.toLowerCase(),
        this.passwordInput.value
      );
      console.log("registered as ", data);
      //localStorage.setItem("token", jwt);
      window.location = "/login";
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const email = { ...this.state.email };
        email.error = true;
        email.helperText = error.response.data;

        this.setState({ email });
      }
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Registration</h1>

        <form onSubmit={this.handleSubmit}>
          <TextField
            label="Enter your full name"
            fullWidth
            autoFocus
            required
            inputRef={input => (this.nameInput = input)}
            error={this.state.name.error}
            helperText={this.state.name.helperText}
          />
          <TextField
            label="Enter your email"
            fullWidth
            autoFocus
            required
            inputRef={input => (this.emailInput = input)}
            error={this.state.email.error}
            helperText={this.state.email.helperText}
          />
          <TextField
            label="Enter your password"
            fullWidth
            required
            type="password"
            inputRef={input => (this.passwordInput = input)}
          />
          <Button type="submit" color="primary">
            Register
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default RegisterForm;
