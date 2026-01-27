import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class Dashboard extends Component {
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
    
    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;
    const isMaximGB = user.isMaximGB;
    const showAdminTools = isAdmin || isMaximGB;

    const dealerTiles = [
      {
        id: "configurator",
        title: "Quote Configurator",
        description: "Build quotes, view your quotes and track orders",
        icon: (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
        to: "/configurator",
        badge: null
      },
      {
        id: "stock",
        title: "Stock List",
        description: "Download the latest available stock inventory",
        icon: (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        to: "/stock",
        badge: "Updated Today",
        badgeClass: "badge-success"
      },
      {
        id: "marketing",
        title: "Marketing Images",
        description: "Access brochures, product photos and promotional materials",
        icon: (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        to: "/marketing",
        badge: "6 Categories",
        badgeClass: "badge-info"
      },
      {
        id: "offers",
        title: "Current Offers",
        description: "View and download the latest promotional offers",
        icon: (
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        ),
        to: "/offers",
        badge: "3 New",
        badgeClass: "badge-warning"
      }
    ];

    const adminTiles = [
      {
        id: "allquotes",
        title: "All Quotes",
        description: "View all dealer quotes",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
        to: "/admin/allquotes",
        requireAdmin: false // MaximGB + Admin
      },
      {
        id: "allorders",
        title: "All Orders",
        description: "View all dealer orders",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        ),
        to: "/admin/allorders",
        requireAdmin: false // MaximGB + Admin
      },
      {
        id: "alldealers",
        title: "All Dealers",
        description: "View and manage",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        to: "/admin/dealers",
        requireAdmin: true // Admin only
      },
      {
        id: "allusers",
        title: "All Users",
        description: "View and manage",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        to: "/admin/users",
        requireAdmin: true // Admin only
      },
      {
        id: "registerdealer",
        title: "Register Dealer",
        description: "Add new",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
        to: "/admin/register-dealer",
        requireAdmin: true // Admin only
      },
      {
        id: "registeruser",
        title: "Register User",
        description: "Add new",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ),
        to: "/admin/register-user",
        requireAdmin: true // Admin only
      },
      {
        id: "managefiles",
        title: "Manage Files",
        description: "Upload and manage",
        icon: (
          <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        ),
        to: "/admin/files",
        requireAdmin: true // Admin only
      }
    ];

    // Filter admin tiles based on user role
    const visibleAdminTiles = adminTiles.filter(tile => {
      if (tile.requireAdmin) {
        return isAdmin;
      }
      return showAdminTools;
    });

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <Link to="/" className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </Link>
          <nav className="header-nav">
            <a href="https://maximal.tlhdev.co.uk" className="header-link" target="_blank" rel="noopener noreferrer">
              Main Site
            </a>
            <div className="header-user">
              <div className="header-user-info">
                <p className="header-user-name">{user.fullname || user.email}</p>
                <p className={`header-user-role ${isAdmin ? 'admin' : ''}`}>
                  {isAdmin ? 'Administrator' : isMaximGB ? 'Maximal GB' : 'Dealer'}
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

        {/* Main Content */}
        <main className="main-content">
          {/* Welcome Section */}
          <div className="mb-xl">
            <h1 className="page-title">Welcome back, {user.fullname?.split(' ')[0] || 'User'}</h1>
            <p className="page-subtitle">Access your dealer tools and resources below</p>
          </div>

          {/* Dealer Tiles Grid */}
          <div className="grid-2 mb-xl">
            {dealerTiles.map((tile) => (
              <Link
                key={tile.id}
                to={tile.to}
                className="card tile"
              >
                <div className="tile-header">
                  <div className="tile-icon primary">
                    {tile.icon}
                  </div>
                  {tile.badge && (
                    <span className={`badge ${tile.badgeClass}`}>
                      {tile.badge}
                    </span>
                  )}
                </div>
                <h3 className="tile-title">{tile.title}</h3>
                <p className="tile-description">{tile.description}</p>
                <div className="tile-footer">
                  <span>Open</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          {showAdminTools && visibleAdminTiles.length > 0 && (
            <>
              <h2 className="section-title mt-xl">Administration</h2>
              <div className="grid-6 mb-xl">
                {visibleAdminTiles.map((tile) => (
                  <Link
                    key={tile.id}
                    to={tile.to}
                    className="card card-admin tile"
                  >
                    <div className="tile-icon admin">
                      {tile.icon}
                    </div>
                    <h3 className="tile-title">{tile.title}</h3>
                    <p className="tile-description">{tile.description}</p>
                  </Link>
                ))}
              </div>
            </>
          )}

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

export default Dashboard;
