import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FileUploader from './FileUploader';
import fileApi from '../services/fileApi';
import auth from '../services/authService';

const MARKETING_SUBCATEGORIES = [
  'brochures',
  'social-media',
  'banners',
  'product-photos',
  'logos',
  'other'
];

class AdminFileManager extends Component {
  state = {
    activeTab: 'stock',
    subcategory: 'brochures',
    files: [],
    loading: false
  };
  
  componentDidMount() {
    this.loadFiles();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.activeTab !== this.state.activeTab ||
      prevState.subcategory !== this.state.subcategory
    ) {
      this.loadFiles();
    }
  }
  
  loadFiles = async () => {
    this.setState({ loading: true });
    
    try {
      const { activeTab, subcategory } = this.state;
      const response = await fileApi.listFiles(
        activeTab,
        activeTab === 'marketing' ? subcategory : null
      );
      this.setState({ 
        files: response.data,
        loading: false 
      });
    } catch (error) {
      console.error('Load failed:', error);
      this.setState({ loading: false });
    }
  };
  
  handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) {
      return;
    }
    
    try {
      await fileApi.deleteFile(fileId);
      this.setState(prevState => ({
        files: prevState.files.filter(f => f._id !== fileId)
      }));
    } catch (error) {
      alert('Delete failed. Please try again.');
      console.error('Delete error:', error);
    }
  };
  
  handleUploadComplete = () => {
    this.loadFiles();
  };
  
  changeTab = (tab) => {
    this.setState({ activeTab: tab });
  };
  
  changeSubcategory = (e) => {
    this.setState({ subcategory: e.target.value });
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
    const { activeTab, subcategory, files, loading } = this.state;
    const user = auth.getCurrentUser();
    
    const tabs = [
      { id: 'stock', label: 'Stock List' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'offers', label: 'Offers' }
    ];
    
    return (
      <div className="page-container">
        {/* Header */}
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

        {/* Main Content */}
        <main className="main-content">
          <h1 className="page-title">File Management</h1>
          <p className="page-subtitle">Upload and manage files for stock, marketing, and offers</p>
        
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '24px', 
          borderBottom: '1px solid #E5E7EB' 
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => this.changeTab(tab.id)}
              style={{
                padding: '12px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                color: activeTab === tab.id ? '#E31837' : '#6B7280',
                borderBottom: activeTab === tab.id ? '2px solid #E31837' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'color 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Subcategory selector for marketing */}
        {activeTab === 'marketing' && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              fontSize: '14px', 
              fontWeight: 500, 
              color: '#374151',
              marginBottom: '8px'
            }}>
              Marketing Category
            </label>
            <select
              value={subcategory}
              onChange={this.changeSubcategory}
              style={{ 
                padding: '10px 12px', 
                borderRadius: '8px', 
                border: '1px solid #D1D5DB',
                fontSize: '14px',
                minWidth: '200px',
                cursor: 'pointer'
              }}
            >
              {MARKETING_SUBCATEGORIES.map(sub => (
                <option key={sub} value={sub}>
                  {sub.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {/* Upload Section */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '24px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937' }}>
            Upload Files
          </h2>
          <FileUploader
            category={activeTab}
            subcategory={activeTab === 'marketing' ? subcategory : null}
            onUploadComplete={this.handleUploadComplete}
          />
        </div>
        
        {/* File List Section */}
        <div style={{ 
          padding: '24px', 
          backgroundColor: '#FFFFFF', 
          borderRadius: '12px', 
          border: '1px solid #E5E7EB' 
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', color: '#1F2937' }}>
            Files ({files.length})
          </h2>
          
          {loading ? (
            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>Loading...</p>
          ) : files.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px'
            }}>
              <svg 
                width="48" 
                height="48" 
                fill="none" 
                stroke="#9CA3AF" 
                viewBox="0 0 24 24"
                style={{ margin: '0 auto 1rem', display: 'block' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" 
                />
              </svg>
              <p style={{ color: '#6B7280', margin: 0 }}>No files uploaded yet.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      color: '#6B7280', 
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      FILENAME
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      color: '#6B7280', 
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      SIZE
                    </th>
                    <th style={{ 
                      textAlign: 'left', 
                      padding: '12px 8px', 
                      color: '#6B7280', 
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      UPLOADED
                    </th>
                    <th style={{ 
                      textAlign: 'right', 
                      padding: '12px 8px', 
                      color: '#6B7280', 
                      fontSize: '12px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {files.map(file => (
                    <tr key={file._id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '12px 8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <svg width="16" height="16" fill="#6B7280" viewBox="0 0 24 24">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                          </svg>
                          <span style={{ color: '#1F2937' }}>{file.originalName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', color: '#6B7280' }}>
                        {(file.size / 1024).toFixed(1)} KB
                      </td>
                      <td style={{ padding: '12px 8px', color: '#6B7280' }}>
                        {new Date(file.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => this.handleDelete(file._id)}
                          style={{ 
                            padding: '6px 12px', 
                            backgroundColor: '#FEF2F2', 
                            color: '#DC2626', 
                            border: '1px solid #FEE2E2', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: 500,
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEE2E2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#FEF2F2';
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

export default AdminFileManager;
