import React, { Component } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/userService";

class RegisterForm extends Component {
  state = {
    name: "",
    email: "",
    password: "",
    error: null,
    success: false
  };

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
      this.setState({ success: true });
      
      // Redirect after success
      setTimeout(() => {
        window.location = "/login";
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
    return (
      <div style={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-gray-50)',
        padding: '2rem'
      }}>
        <div style={{ width: '100%', maxWidth: '28rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '48px', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: '0 0 0.5rem 0' }}>
              Create Account
            </h1>
            <p style={{ color: 'var(--color-gray-600)', margin: 0 }}>
              Register for the Maximal Dealer Portal
            </p>
          </div>

          {/* Registration Card */}
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
                <span style={{ fontWeight: '500' }}>Registration successful! Redirecting to login...</span>
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
                  placeholder="Enter your full name"
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
                  placeholder="Enter your email"
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
                  placeholder="Enter your password (min 6 characters)"
                  required
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', marginTop: '0.5rem' }}>
                  Password must be at least 6 characters long
                </p>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem' }}
                disabled={this.state.success}
              >
                Create Account
              </button>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: 0 }}>
                  Already have an account?{' '}
                  <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <a 
              href="https://maximalforklift.co.uk" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)', textDecoration: 'none' }}
            >
              © 2026 Maximal Forklifts UK
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
