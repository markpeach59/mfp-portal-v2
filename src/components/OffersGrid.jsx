import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileApi from '../services/fileApi';
import auth from '../services/authService';

class OffersGrid extends Component {
  state = {
    offers: [],
    loading: true,
    selectedOffer: null
  };
  
  componentDidMount() {
    this.loadOffers();
  }
  
  loadOffers = async () => {
    try {
      const response = await fileApi.listFiles('offers');
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
        offers: withUrls.filter(offer => offer !== null),
        loading: false 
      });
    } catch (error) {
      console.error('Failed to load offers:', error);
      this.setState({ loading: false });
    }
  };
  
  openOffer = (offer) => {
    this.setState({ selectedOffer: offer });
  };
  
  closeOffer = () => {
    this.setState({ selectedOffer: null });
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
    const { offers, loading, selectedOffer } = this.state;
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
          <h1 className="page-title">Current Offers</h1>
          <p className="page-subtitle">View and download the latest promotional offers</p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ color: '#6B7280' }}>Loading offers...</p>
            </div>
          ) : offers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
              <svg width="64" height="64" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', display: 'block' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <h3 style={{ marginBottom: '0.5rem', color: '#1F2937' }}>No Offers Available</h3>
              <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>Check back soon for new promotional offers.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
              {offers.map(offer => (
                <div key={offer._id} onClick={() => this.openOffer(offer)} style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                  <div style={{ aspectRatio: '16/9', backgroundColor: '#F3F4F6', overflow: 'hidden' }}>
                    <img src={offer.url} alt={offer.originalName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#FEE2E2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <svg width="20" height="20" fill="#E31837" viewBox="0 0 24 24">
                          <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, color: '#1F2937', fontWeight: 500, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{offer.originalName}</p>
                        <p style={{ margin: 0, color: '#6B7280', fontSize: '13px', marginTop: '2px' }}>
                          {offer.mimeType.includes('image') ? 'Image' : 'File'} • {(offer.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {selectedOffer && (
            <div onClick={this.closeOffer} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}>
              <img src={selectedOffer.url} alt={selectedOffer.originalName} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} onClick={(e) => e.stopPropagation()} />
              <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '12px 24px', borderRadius: '8px', backdropFilter: 'blur(8px)', maxWidth: '90%' }} onClick={(e) => e.stopPropagation()}>
                <p style={{ margin: 0, fontSize: '14px', textAlign: 'center' }}>{selectedOffer.originalName}</p>
              </div>
              <button onClick={this.closeOffer} style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '32px', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}>
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

export default OffersGrid;
