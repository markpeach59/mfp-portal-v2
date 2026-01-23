import React, { Component } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/userService";
import auth from "../services/authService";

class RegisterForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
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

  handleChange = (field, value) => {
    this.setState({ [field]: value, error: null });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.state.name.trim()) {
      this.setState({ error: "Full name is required" });
      return;
    }

    if (!this.state.email.trim()) {
      this.setState({ error: "Email is required" });
      return;
    }

    if (!this.state.password || this.state.password.length < 6) {
      this.setState({ error: "Password must be at least 6 characters" });
      return;
    }

    try {
      const { data } = await registerUser(
        this.state.name,
        this.state.email.toLowerCase(),
        this.state.password
      );
      console.log("registered as ", data);
      this.setState({ success: true, name: "", email: "", password: "" });
      
      // Redirect after success
      setTimeout(() => {
        window.location = "/admin/users";
      }, 1500);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data });
      } else {
        this.setState({ error: "Failed to register. Please try again." });
      }
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
          <Link to="/admin/users" className="back-link">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Users
          </Link>

          <div style={{ maxWidth: '32rem', margin: '0 auto' }}>
            <div className="mb-xl">
              <h2 className="page-title">Register New User</h2>
              <p className="page-subtitle">Add a new user to the system</p>
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
                  <span style={{ fontWeight: '500' }}>User registered successfully! Redirecting...</span>
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
                <div className="mb-md">
                  <label className="form-label" htmlFor="name">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-input"
                    value={this.state.name}
                    onChange={(e) => this.handleChange('name', e.target.value)}
                    placeholder="Enter user's full name"
                    autoFocus
                    required
                  />
                </div>

                <div className="mb-md">
                  <label className="form-label" htmlFor="email">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-input"
                    value={this.state.email}
                    onChange={(e) => this.handleChange('email', e.target.value)}
                    placeholder="Enter user's email"
                    required
                  />
                </div>

                <div className="mb-lg">
                  <label className="form-label" htmlFor="password">
                    Password *
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-input"
                    value={this.state.password}
                    onChange={(e) => this.handleChange('password', e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                    required
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={this.state.success}
                  >
                    Register User
                  </button>
                  <Link to="/admin/users">
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

export default RegisterForm;
