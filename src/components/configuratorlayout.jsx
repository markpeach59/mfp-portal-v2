import React, { Component } from "react";
import { Link, Route, Switch, Redirect } from "react-router-dom";
import auth from "../services/authService";

// Import existing components
import Forklifts from "./forklifts";
import Quotes from "./quotes";
import Orders from "./orders";

class ConfiguratorLayout extends Component {
  state = {
    user: null
  };

  componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });
  }

  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  render() {
    const { user } = this.state;
    const { location } = this.props;
    
    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;
    const currentPath = location.pathname;

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </div>
          <nav className="header-nav">
            <a href="https://maximal.tlhdev.co.uk" className="header-link" target="_blank" rel="noopener noreferrer">
              Main Site
            </a>
            <div className="header-user">
              <div className="header-user-info">
                <p className="header-user-name">{user.fullname || user.email}</p>
                <p className={`header-user-role ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Administrator' : user.isMaximGB ? 'Maximal GB' : 'Dealer'}
                </p>
              </div>
              <div className="header-avatar">
                {this.getUserInitials(user.fullname || user.email)}
              </div>
              <Link to="/logout" className="btn-icon btn-ghost" title="Sign out">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </nav>
        </header>

        {/* Sub-header with tabs */}
        <div className="sub-header">
          <nav className="tab-nav">
            <Link 
              to="/configurator/build" 
              className={`tab-link ${currentPath.startsWith('/configurator/build') || currentPath === '/configurator' ? 'active' : ''}`}
            >
              Build Quote
            </Link>
            <Link 
              to="/configurator/quotes" 
              className={`tab-link ${currentPath.startsWith('/configurator/quotes') ? 'active' : ''}`}
            >
              My Quotes
            </Link>
            <Link 
              to="/configurator/orders" 
              className={`tab-link ${currentPath.startsWith('/configurator/orders') ? 'active' : ''}`}
            >
              My Orders
            </Link>
          </nav>
        </div>

        {/* Main Content - renders child routes */}
        <main className="main-content-wide">
          <Link to="/" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <Switch>
            <Route path="/configurator/build" component={Forklifts} />
            <Route path="/configurator/quotes" component={Quotes} />
            <Route path="/configurator/orders" component={Orders} />
            <Redirect from="/configurator" exact to="/configurator/build" />
          </Switch>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p className="footer-text">© 2026 Maximal UK - Dealer Portal</p>
            <a href="https://maximalforklift.co.uk" className="footer-link" target="_blank" rel="noopener noreferrer">
              maximalforklift.co.uk
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default ConfiguratorLayout;
