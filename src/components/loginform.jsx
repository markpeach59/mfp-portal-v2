import React, { Component } from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import auth from "../services/authService";

import "typeface-roboto";

class LoginForm extends Component {
  state = {
    email: { value: null, error: false, helperText: null },
    password: { value: null, error: false, helperText: null }
  };

  handleSubmit = e => {
    e.preventDefault();

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      await auth.login(
        this.emailInput.value.toLowerCase(),
        this.passwordInput.value
      );
      const { state } = this.props.location;

      window.location = state ? state.from.pathname : "/";
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
        <h1>Login</h1>

        <form onSubmit={this.handleSubmit}>
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
            Sign in
          </Button>
        </form>
      </React.Fragment>
    );
  }
}

export default LoginForm;
