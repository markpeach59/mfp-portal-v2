import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileApi from '../services/fileApi';
import auth from '../services/authService';

class StockList extends Component {
  state = {
    stockFile: null,
    loading: true,
    downloading: false,
    error: null
  };
  
  componentDidMount() {
    this.loadStockFile();
  }
  
  loadStockFile = async () => {
    try {
      const response = await fileApi.listFiles('stock');
      const files = response.data;
      this.setState({ 
        stockFile: files[0] || null,
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load stock file:', error);
      this.setState({ 
        error: 'Failed to load stock file',
        loading: false 
      });
    }
  };
  
  handleDownload = async () => {
    const { stockFile } = this.state;
    if (!stockFile) return;
    
    this.setState({ downloading: true, error: null });
    
    try {
      await fileApi.downloadStockFile(stockFile._id, stockFile.originalName);
      this.setState({ downloading: false });
    } catch (error) {
      console.error('Download failed:', error);
      this.setState({ 
        error: 'Download failed. Please try again.',
        downloading: false 
      });
    }
  };
  
  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }
  
  render() {
    const { stockFile, loading, downloading, error } = this.state;
    const user = auth.getCurrentUser();
    
    return (
      <div className="page-container">
        <header className="header">
          <Link to="/" className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </Link>
          <nav className="header-nav">
            <Link to="/" className="header-link">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="header-user">
              <div className="header-user-info">
                <p className="header-user-name">{user?.fullname || user?.email}</p>
                <p className={`header-user-role ${user?.isAdmin ? 'admin' : ''}`}>
                  {user?.isAdmin ? 'Administrator' : user?.isMaximGB ? 'Maximal GB' : 'Dealer'}
                </p>
              </div>
              <div className="header-avatar">
                {this.getUserInitials(user?.fullname || user?.email)}
              </div>
              <Link to="/logout" className="btn-icon btn-ghost" title="Sign out">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </nav>
        </header>

        <main className="main-content">
          <h1 className="page-title">Stock List</h1>
          <p className="page-subtitle">Download the latest available stock inventory</p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6B7280' }}>Loading...</p>
            </div>
          ) : !stockFile ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '3rem',
              maxWidth: '400px',
              textAlign: 'center'
            }}>
              <svg 
                width="64" 
                height="64" 
                fill="none" 
                stroke="#9CA3AF" 
                viewBox="0 0 24 24"
                style={{ margin: '0 auto 1rem', display: 'block' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                />
              </svg>
              <h3 style={{ marginBottom: '0.5rem', color: '#1F2937' }}>No Stock List Available</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>
                The stock list will be available soon.
              </p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              padding: '24px',
              maxWidth: '500px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '16px' 
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#FEE2E2',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svg width="32" height="32" fill="#E31837" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path fill="#fff" d="M14 2v6h6" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    margin: 0, 
                    color: '#1F2937', 
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '4px'
                  }}>
                    Stock List
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    color: '#6B7280', 
                    fontSize: '14px' 
                  }}>
                    {(stockFile.size / 1024).toFixed(1)} KB • Updated{' '}
                    {new Date(stockFile.updatedAt || stockFile.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              {error && (
                <div style={{
                  padding: '12px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FEE2E2',
                  borderRadius: '8px',
                  marginBottom: '16px'
                }}>
                  <p style={{ color: '#DC2626', fontSize: '14px', margin: 0 }}>
                    {error}
                  </p>
                </div>
              )}
              
              <button
                onClick={this.handleDownload}
                disabled={downloading}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: downloading ? 0.7 : 1
                }}
              >
                {downloading ? (
                  <>
                    <svg 
                      width="20" 
                      height="20" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      style={{ animation: 'spin 1s linear infinite' }}
                    >
                      <circle 
                        style={{ opacity: 0.25 }} 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4" 
                      />
                      <path 
                        style={{ opacity: 0.75 }} 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                      />
                    </svg>
                    Downloading...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                      />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
              
              <p style={{
                marginTop: '12px',
                fontSize: '13px',
                color: '#6B7280',
                textAlign: 'center',
                margin: '12px 0 0 0'
              }}>
                Secure download • File: {stockFile.originalName}
              </p>
              
              <style>{`
                @keyframes spin {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          )}
        </main>

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
