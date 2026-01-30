import React, { Component } from "react";
import auth from "../services/authService";

class LoginForm extends Component {
  state = {
    email: "",
    password: "",
    showPassword: false,
    isLoading: false,
    error: null
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ isLoading: true, error: null });

    try {
      await auth.login(
        this.state.email.toLowerCase(),
        this.state.password
      );
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/";
    } catch (error) {
      this.setState({ isLoading: false });
      if (error.response && error.response.status === 400) {
        this.setState({ error: error.response.data });
      } else {
        this.setState({ error: "An error occurred. Please try again." });
      }
    }
  };

  render() {
    const { email, password, showPassword, isLoading, error } = this.state;

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </div>
          <a 
            href="https://maximalforklift.co.uk"
            className="header-link"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Main Site
          </a>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '28rem' }}>
            {/* Login Card */}
            <div className="card" style={{ padding: '2rem' }}>
              {/* Logo/Title Section */}
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div 
                  style={{ 
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '1rem',
                    backgroundColor: 'rgba(227, 24, 55, 0.08)',
                    border: '1px solid rgba(227, 24, 55, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem'
                  }}
                >
                  <svg width="40" height="40" style={{ color: '#E31837' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>Dealer Portal</h1>
                <p style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  Sign in to access stock lists, marketing<br />materials and current offers
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div 
                  style={{ 
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--color-error-bg)',
                    border: '1px solid var(--color-error)',
                    borderRadius: 'var(--border-radius-md)',
                    marginBottom: '1.25rem'
                  }}
                >
                  <p style={{ color: 'var(--color-error)', fontSize: '0.875rem', margin: 0 }}>
                    {error}
                  </p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={this.handleSubmit}>
                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label" style={{ textTransform: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => this.setState({ email: e.target.value })}
                    placeholder="dealer@example.com"
                    required
                    autoFocus
                    style={{ backgroundColor: '#FAFAFA' }}
                  />
                </div>

                {/* Password Field */}
                <div className="form-group">
                  <label className="form-label" style={{ textTransform: 'none', fontSize: '0.875rem', fontWeight: '500' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-input"
                      value={password}
                      onChange={(e) => this.setState({ password: e.target.value })}
                      placeholder="••••••••"
                      required
                      style={{ backgroundColor: '#FAFAFA', paddingRight: '3rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => this.setState({ showPassword: !showPassword })}
                      className="btn-icon btn-ghost"
                      style={{ 
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-gray-400)'
                      }}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                  style={{ 
                    width: '100%',
                    padding: '0.875rem 1rem',
                    boxShadow: '0 2px 8px rgba(227, 24, 55, 0.25)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>

            {/* Help Text */}
            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
              Need dealer access?{' '}
              <a href="https://maximalforklift.co.uk" style={{ color: 'var(--color-primary)', fontWeight: '500', textDecoration: 'none' }}>
                Contact Maximal UK
              </a>
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

        {/* Add spinner animation */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
}

export default LoginForm;
