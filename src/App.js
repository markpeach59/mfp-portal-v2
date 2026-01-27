import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ProtectedRoute from "./components/protectedroute";
import ProtectedAdminRoute from "./components/protectedadminroute";

// Import portal CSS
import "./styles/portal.css";

// New components
import Dashboard from "./components/dashboard";
import ConfiguratorLayout from "./components/configuratorlayout";
import StockListNew from "./components/stocklist";
import MarketingGalleryNew from "./components/MarketingGallery";
import OffersGridNew from "./components/OffersGrid";
import AdminFileManager from "./components/AdminFileManager";

// Existing components
import ForkliftDetail from "./components/forkliftdetail";
import QuoteDetail from "./components/quotedetail";
import OrderDetail from "./components/orderdetail";
import AllQuotes from "./components/allquotes";
import AllOrders from "./components/allorders";
import ListAllUsers from "./components/listallusers";
import ListAllDealers from "./components/listalldealers";
import RegistrationForm from "./components/registrationform";
import DealerRegistrationForm from "./components/dealerregistrationform";
import LoginForm from "./components/loginform";
import Logout from "./components/logout";
import NotFound from "./components/notFound";

import auth from "./services/authService";


class App extends Component {
  state = {};

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  render() {
    return (
      <Switch>
        {/* Public routes */}
        <Route path="/login" component={LoginForm} />
        <Route path="/logout" component={Logout} />
        <Route path="/not-found" component={NotFound} />

        {/* Protected Dashboard - new home */}
        <ProtectedRoute exact path="/" component={Dashboard} />

        {/* Configurator section with sub-routes */}
        <ProtectedRoute path="/configurator" component={ConfiguratorLayout} />

        {/* Stock, Marketing, Offers */}
        <ProtectedRoute path="/stock" component={StockListNew} />
        <ProtectedRoute path="/marketing" component={MarketingGalleryNew} />
        <ProtectedRoute path="/offers" component={OffersGridNew} />

        {/* Forklift detail page */}
        <ProtectedRoute exact path="/forkliftdetail/:modelName" component={ForkliftDetail} />

        {/* Quote and Order details (outside configurator layout) */}
        <ProtectedRoute exact path="/quotedetail/:_id" component={QuoteDetail} />
        <ProtectedRoute exact path="/orderdetail/:_id" component={OrderDetail} />

        {/* Admin routes */}
        <ProtectedRoute path="/admin/allquotes" component={AllQuotes} />
        <ProtectedRoute path="/admin/allorders" component={AllOrders} />
        <ProtectedAdminRoute path="/admin/users" component={ListAllUsers} />
        <ProtectedAdminRoute path="/admin/dealers" component={ListAllDealers} />
        <ProtectedAdminRoute path="/admin/register-user" component={RegistrationForm} />
        <ProtectedAdminRoute path="/admin/register-dealer" component={DealerRegistrationForm} />
        <ProtectedAdminRoute path="/admin/files" component={AdminFileManager} />

        {/* Legacy redirects for backward compatibility */}
        <Redirect from="/forklifts" to="/configurator/build" />
        <Redirect from="/quotes/:id" to="/quotedetail/:id" />
        <Redirect from="/quotes" to="/configurator/quotes" />
        <Redirect from="/orders/:id" to="/orderdetail/:id" />
        <Redirect from="/orders" to="/configurator/orders" />
        <Redirect from="/allquotes" to="/admin/allquotes" />
        <Redirect from="/allorders" to="/admin/allorders" />
        <Redirect from="/listallusers" to="/admin/users" />
        <Redirect from="/listalldealers" to="/admin/dealers" />
        <Redirect from="/register" to="/admin/register-user" />
        <Redirect from="/registerdealer" to="/admin/register-dealer" />

        {/* Catch all - redirect to not found */}
        <Redirect to="/not-found" />
      </Switch>
    );
  }
}

export default App;
