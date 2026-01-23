import React, { Component } from "react";
import { Route, Redirect, Switch, Link } from "react-router-dom";
import ProtectedRoute from "./components/protectedroute";
import ProtectedAdminRoute from "./components/protectedadminroute";

import { ThemeProvider } from "@material-ui/core/styles";
import customtheme from "./style/theme";

import Typography from "@material-ui/core/Typography";

import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import AppBar from "@material-ui/core/AppBar";
import ToolBar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";

import Forklifts from "./components/forklifts";
import ForkliftDetail from "./components/forkliftdetail";
import NotFound from "./components/notFound";

import RegistrationForm from "./components/registrationform";
import DealerRegistrationForm from "./components/dealerregistrationform";

import LoginForm from "./components/loginform";
import Logout from "./components/logout";
import auth from "./services/authService";

import Quotes from "./components/quotes";

import QuoteDetail from "./components/quotedetail";

import Orders from "./components/orders";
import OrderDetail from "./components/orderdetail";

import AllQuotes from "./components/allquotes";
import AllOrders from "./components/allorders";
import DealerHeader from "./components/dealerheader";


import ListAllUsers from "./components/listallusers";
import ListAllDealers from "./components/listalldealers";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Maxim (GB) {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    /* if logged in get dealer details */
  }

  render() {
    return (
      <React.Fragment>
        <ThemeProvider theme={customtheme}>
        <Container component="main">
          <CssBaseline />
          {this.state.user && (
            <AppBar>
              <ToolBar>
                {this.state.user ? "Hello " + this.state.user.fullname : null}
                <Link to={{ pathname: "/" }} style={{ color: "#fff" }}>
                  <Button color="inherit">Forklifts</Button>
                </Link>

                <Link to={{ pathname: "/quotes" }} style={{ color: "#fff" }}>
                  <Button color="inherit">Quotes</Button>
                </Link>

                <Link to={{ pathname: "/orders" }} style={{ color: "#fff" }}>
                  <Button color="inherit">Orders</Button>
                </Link>

                {this.state.user &&
                  (this.state.user.isAdmin || this.state.user.isMaximGB) && (
                    <Link
                      to={{ pathname: "/allquotes" }}
                      style={{ color: "#fff" }}
                    >
                      <Button color="inherit">All Quotes</Button>
                    </Link>
                  )}

                {this.state.user &&
                  (this.state.user.isAdmin || this.state.user.isMaximGB) && (
                    <Link
                      to={{ pathname: "/allorders" }}
                      style={{ color: "#fff" }}
                    >
                      <Button color="inherit">All Orders</Button>
                    </Link>
                  )}

                {this.state.user && this.state.user.isAdmin && (
                  <Link
                    to={{ pathname: "/listallusers" }}
                    style={{ color: "#fff" }}
                  >
                    <Button color="inherit">All Users</Button>
                  </Link>
                )}

                {this.state.user && this.state.user.isAdmin && (
                  <Link
                    to={{ pathname: "/register" }}
                    style={{ color: "#fff" }}
                  >
                    <Button color="inherit">Register User</Button>
                  </Link>
                )}

                {this.state.user && this.state.user.isAdmin && (
                  <Link
                    to={{ pathname: "/listalldealers" }}
                    style={{ color: "#fff" }}
                  >
                    <Button color="inherit">All Dealers</Button>
                  </Link>
                )}

                {this.state.user && this.state.user.isAdmin && (
                  <Link
                    to={{ pathname: "/registerdealer" }}
                    style={{ color: "#fff" }}
                  >
                    <Button color="inherit">Register Dealer</Button>
                  </Link>
                )}

                {this.state.user && (
                  <Link to={{ pathname: "/logout" }} style={{ color: "#fff" }}>
                    <Button color="inherit">Logout</Button>
                  </Link>
                )}
                {!this.state.user && (
                  <Link to={{ pathname: "/login" }} style={{ color: "#fff" }}>
                    <Button color="inherit">Login</Button>
                  </Link>
                )}
              </ToolBar>
            </AppBar>
          )}
          <div>
          <DealerHeader />
          </div>
          
          
          <div>
            <Switch>
              <ProtectedRoute path="/register" component={RegistrationForm} />
              <ProtectedAdminRoute
                path="/registerdealer"
                component={DealerRegistrationForm}
              />
              <Route path="/login" component={LoginForm} />
              <Route path="/logout" component={Logout} />
              <ProtectedRoute
                exact
                path="/forkliftdetail/:modelName"
                component={ForkliftDetail}
              />
              <ProtectedRoute path="/forklifts" component={Forklifts} />
              <ProtectedRoute
                exact
                path="/quotes/:_id"
                component={QuoteDetail}
              />
              <ProtectedRoute path="/quotes" component={Quotes} />
              <ProtectedRoute
                exact
                path="/orders/:_id"
                component={OrderDetail}
              />
              <ProtectedRoute path="/orders" component={Orders} />
              <ProtectedRoute path="/listallusers" component={ListAllUsers} />
              <ProtectedRoute
                path="/listalldealers"
                component={ListAllDealers}
              />
              <ProtectedRoute path="/allquotes" component={AllQuotes} />
              <ProtectedRoute path="/allorders" component={AllOrders} />
              <Route path="/not-found" component={NotFound} />
              <Redirect from="/" exact to="/forklifts" />
              <Redirect to="/not-found" />
            </Switch>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}

export default App;
