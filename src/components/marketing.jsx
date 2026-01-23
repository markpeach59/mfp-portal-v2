import React, { Component } from "react";
import { Link } from "react-router-dom";
import auth from "../services/authService";

class Marketing extends Component {
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

    const categories = [
      { name: "Brochures", count: 12 },
      { name: "Social Media", count: 24 },
      { name: "Banners", count: 8 },
      { name: "Product Photos", count: 45 },
      { name: "Logos", count: 6 },
      { name: "Spec Sheets", count: 18 }
    ];

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="8" fill="#E31837"/>
              <path d="M10 28V12H14.5L20 22L25.5 12H30V28H26V18L21 27H19L14 18V28H10Z" fill="white"/>
            </svg>
            <div className="header-logo-text">
              <span className="header-logo-title">MAXIMAL</span>
              <span className="header-logo-subtitle">FORKLIFTS UK</span>
            </div>
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
            <h1 className="page-title">Marketing Images</h1>
            <p className="page-subtitle">Access brochures, product photos and promotional materials</p>
          </div>

          <div className="grid-3">
            {categories.map((category, index) => (
              <div key={index} className="card">
                <div style={{ width: '100%', height: '150px', backgroundColor: 'var(--color-gray-100)', borderRadius: '0.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" fill="none" stroke="var(--color-gray-400)" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-gray-800)', margin: '0 0 0.25rem 0' }}>
                  {category.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1rem' }}>
                  {category.count} images
                </p>
                <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                  View Category
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
            <p className="footer-text">© 2024 Maximal UK - Dealer Portal</p>
            <a href="https://maximalforklift.co.uk" className="footer-link" target="_blank" rel="noopener noreferrer">
              maximalforklift.co.uk
            </a>
          </div>
        </footer>
      </div>
    );
  }
}

export default Marketing;
