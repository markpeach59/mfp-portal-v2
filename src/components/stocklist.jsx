import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class StockList extends Component {
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

        {/* Main Content */}
        <main className="main-content">
          <Link to="/" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>

          <div className="mb-xl">
            <h1 className="page-title">Stock List</h1>
            <p className="page-subtitle">Download the latest available stock inventory</p>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', backgroundColor: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-gray-800)', margin: '0 0 0.25rem 0' }}>
                  Current Stock List
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: 0 }}>
                  Last updated: {new Date().toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            <div style={{ padding: '1.5rem', backgroundColor: 'var(--color-gray-50)', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', margin: '0 0 1rem 0' }}>
                <strong>File:</strong> Maximal-Stock-List-{new Date().toISOString().split('T')[0]}.xlsx
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', margin: '0 0 1rem 0' }}>
                <strong>Size:</strong> 245 KB
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', margin: 0 }}>
                <strong>Contains:</strong> 156 stock items across all ranges
              </p>
            </div>

            <button className="btn btn-primary" disabled>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Stock List
            </button>

            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '1rem' }}>
              Note: Backend API integration required. This feature will be available once the file portal API is implemented.
            </p>
          </div>
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

export default StockList;
