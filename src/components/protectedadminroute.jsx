import React from "react";
import { Route, Redirect } from "react-router-dom";

import auth from "../services/authService";

const ProtectedAdminRoute = ({
  path,
  component: Component,
  render,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props => {
        const user = auth.getCurrentUser();
        if (!user)
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location }
              }}
            />
          );
        if (user && !user.isAdmin) return <Redirect to="/not-found" />;
        return Component ? <Component {...props} /> : render(props);
      }}
    />
  );
};

export default ProtectedAdminRoute;
