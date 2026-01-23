import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class Offers extends Component {
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

    const offers = [
      { title: "Spring Sale 2024", description: "Special pricing on A Series models", isNew: true },
      { title: "Battery Upgrade Offer", description: "Free lithium upgrade on select models", isNew: true },
      { title: "Finance Promotion", description: "0% APR for 24 months", isNew: true }
    ];

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
            <h1 className="page-title">Current Offers</h1>
            <p className="page-subtitle">View and download the latest promotional offers</p>
          </div>

          <div className="grid-3">
            {offers.map((offer, index) => (
              <div key={index} className="card">
                <div style={{ width: '100%', height: '200px', backgroundColor: 'var(--color-gray-100)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" fill="none" stroke="var(--color-gray-400)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-gray-800)', margin: 0 }}>
                    {offer.title}
                  </h3>
                  {offer.isNew && (
                    <span className="badge badge-warning">New</span>
                  )}
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
                  {offer.description}
                </p>
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                  Download PDF
                </button>
              </div>
            ))}
          </div>

          <div className="card mt-xl">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: 0, textAlign: 'center' }}>
              <strong>Note:</strong> Backend API integration required. This feature will be available once the file portal API is implemented.
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

export default Offers;
