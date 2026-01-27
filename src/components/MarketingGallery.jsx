import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileApi from '../services/fileApi';
import auth from '../services/authService';

const SUBCATEGORIES = [
  { id: 'brochures', label: 'Brochures' },
  { id: 'social-media', label: 'Social Media' },
  { id: 'banners', label: 'Banners' },
  { id: 'product-photos', label: 'Product Photos' },
  { id: 'logos', label: 'Logos' },
  { id: 'other', label: 'Other' }
];

class MarketingGallery extends Component {
  state = {
    activeCategory: 'brochures',
    images: [],
    loading: false,
    lightboxImage: null
  };
  
  componentDidMount() {
    this.loadImages();
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeCategory !== this.state.activeCategory) {
      this.loadImages();
    }
  }
  
  loadImages = async () => {
    this.setState({ loading: true });
    
    try {
      const response = await fileApi.listFiles('marketing', this.state.activeCategory);
      const files = response.data;
      
      const withUrls = await Promise.all(
        files.map(async (file) => {
          try {
            const urlResponse = await fileApi.getFileUrl(file._id);
            return { ...file, url: urlResponse.data.url };
          } catch (error) {
            console.error('Failed to get URL for file:', file._id);
            return null;
          }
        })
      );
      
      this.setState({ 
        images: withUrls.filter(img => img !== null),
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load images:', error);
      this.setState({ loading: false });
    }
  };
  
  handleCategoryChange = (categoryId) => {
    this.setState({ activeCategory: categoryId });
  };
  
  openLightbox = (image) => {
    this.setState({ lightboxImage: image });
  };
  
  closeLightbox = () => {
    this.setState({ lightboxImage: null });
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
    const { activeCategory, images, loading, lightboxImage } = this.state;
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
          <h1 className="page-title">Marketing Materials</h1>
          <p className="page-subtitle">Browse and download marketing images and materials</p>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {SUBCATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => this.handleCategoryChange(cat.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeCategory === cat.id ? '#E31837' : '#F3F4F6',
                  color: activeCategory === cat.id ? '#FFFFFF' : '#4B5563',
                  fontWeight: 500,
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
              <p>Loading...</p>
            </div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <svg width="48" height="48" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p style={{ color: '#6B7280', margin: 0 }}>No images in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {images.map(img => (
                <div
                  key={img._id}
                  onClick={() => this.openLightbox(img)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundColor: '#F3F4F6',
                    border: '1px solid #E5E7EB',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {img.mimeType === 'application/pdf' ? (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                      <svg width="48" height="48" fill="#E31837" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <path fill="#fff" d="M14 2v6h6" />
                      </svg>
                      <p style={{ fontSize: '12px', color: '#4B5563', margin: 0, padding: '0 8px', textAlign: 'center', wordBreak: 'break-word' }}>
                        {img.originalName}
                      </p>
                    </div>
                  ) : (
                    <img src={img.url} alt={img.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
              ))}
            </div>
          )}
          
          {lightboxImage && (
            <div onClick={this.closeLightbox} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
              {lightboxImage.mimeType === 'application/pdf' ? (
                <div style={{ backgroundColor: '#fff', borderRadius: '12px', padding: '2rem', textAlign: 'center', maxWidth: '400px' }}>
                  <svg width="64" height="64" fill="#E31837" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                    <path fill="#fff" d="M14 2v6h6" />
                  </svg>
                  <h3 style={{ marginBottom: '0.5rem' }}>{lightboxImage.originalName}</h3>
                  <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>{(lightboxImage.size / 1024).toFixed(1)} KB</p>
                  <a href={lightboxImage.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary" onClick={(e) => e.stopPropagation()}>
                    Open PDF
                  </a>
                </div>
              ) : (
                <img src={lightboxImage.url} alt={lightboxImage.originalName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onClick={(e) => e.stopPropagation()} />
              )}
              
              <button onClick={this.closeLightbox} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '32px', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}>
                ×
              </button>
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

export default MarketingGallery;
