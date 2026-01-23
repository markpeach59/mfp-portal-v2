import React, { Component } from "react";
import { Link } from "react-router-dom";
import { registerDealer } from "../services/dealerService";
import auth from "../services/authService";

class RegisterDealerForm extends Component {
  state = {
    dealername: "",
    error: null,
    success: false,
    user: null
  };

  async componentDidMount() {
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

  handleChange = (e) => {
    this.setState({ dealername: e.target.value, error: null });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.state.dealername.trim()) {
      this.setState({ error: "Dealer name is required" });
      return;
    }

    try {
      const { data } = await registerDealer(this.state.dealername);
      console.log("registered as ", data);
      this.setState({ success: true, dealername: "" });
      
      // Redirect after success
      setTimeout(() => {
        window.location = "/admin/dealers";
      }, 1500);
    } catch (error) {
      if (error.response) {
        this.setState({ error: error.response.data });
      } else {
        this.setState({ error: "Failed to register dealer. Please try again." });
      }
      console.log("Error:", error);
    }
  };

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
          <Link to="/admin/dealers" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dealers
          </Link>

          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <div className="mb-xl">
              <h2 className="page-title">Register New Dealer</h2>
              <p className="page-subtitle">Add a new dealer to the system</p>
            </div>

            <div className="card">
              {this.state.success && (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--color-success-bg)', 
                  color: 'var(--color-success)', 
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>Dealer registered successfully! Redirecting...</span>
                </div>
              )}

              {this.state.error && (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--color-danger-bg)', 
                  color: 'var(--color-danger)', 
                  borderRadius: 'var(--border-radius-md)',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span style={{ fontWeight: '500' }}>{this.state.error}</span>
                </div>
              )}

              <form onSubmit={this.handleSubmit}>
                <div className="mb-lg">
                  <label className="form-label" htmlFor="dealername">
                    Dealer Name *
                  </label>
                  <input
                    id="dealername"
                    type="text"
                    className="form-input"
                    value={this.state.dealername}
                    onChange={this.handleChange}
                    placeholder="Enter dealer company name"
                    autoFocus
                    required
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                    Enter the full company name of the dealer
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={this.state.success}
                  >
                    Register Dealer
                  </button>
                  <Link to="/admin/dealers">
                    <button type="button" className="btn btn-secondary">
                      Cancel
                    </button>
                  </Link>
                </div>
              </form>
            </div>
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

export default RegisterDealerForm;
