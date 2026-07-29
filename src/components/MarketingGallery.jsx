import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import fileApi from '../services/fileApi';
import auth from '../services/authService';
import { MARKETING_CATEGORIES, findCategoryById } from '../config/marketingCategories';

class MarketingGallery extends Component {
  state = {
    // Array of selected category ids, one per depth level
    // e.g. ['white-background-imagery', 'ice', 'a-series-ice-4-7t']
    breadcrumb: [],
    images: [],
    loading: false,
    lightboxImage: null
  };

  componentDidMount() {
    // Start at the top level — no images to load yet
  }

  // Navigate into a child category
  handleSelectCategory = (categoryId) => {
    const { breadcrumb } = this.state;
    const node = findCategoryById(categoryId);

    if (!node) return;

    const newBreadcrumb = [...breadcrumb, categoryId];

    // If this node has no children, it's a leaf — load images
    if (!node.children || node.children.length === 0) {
      this.setState({ breadcrumb: newBreadcrumb }, () => this.loadImages());
    } else {
      // Has children — just navigate into it, don't load images yet
      this.setState({ breadcrumb: newBreadcrumb, images: [] });
    }
  };

  // Navigate back to a specific breadcrumb level (0 = root)
  handleBreadcrumbNav = (depth) => {
    const { breadcrumb } = this.state;
    const newBreadcrumb = breadcrumb.slice(0, depth);
    this.setState({ breadcrumb: newBreadcrumb, images: [] });
  };

  // Determine the current node being viewed
  getCurrentNode = () => {
    const { breadcrumb } = this.state;
    if (breadcrumb.length === 0) return null;
    return findCategoryById(breadcrumb[breadcrumb.length - 1]);
  };

  // Map breadcrumb ids to subcategory params
  // breadcrumb can be up to 4 levels deep:
  //   [0] subcategory, [1] subcategory2, [2] subcategory3 -OR- [3] subcategory3
  // When 4 levels deep, breadcrumb[3] is the leaf and maps to subcategory3
  getSubcategoryParams = () => {
    const { breadcrumb } = this.state;
    return {
      subcategory:  breadcrumb[0] || null,
      subcategory2: breadcrumb[1] || null,
      subcategory3: breadcrumb[3] || breadcrumb[2] || null
    };
  };

  loadImages = async () => {
    this.setState({ loading: true });
    const { subcategory, subcategory2, subcategory3 } = this.getSubcategoryParams();

    try {
      const response = await fileApi.listFiles('marketing', subcategory, subcategory2, subcategory3);
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

  openLightbox = (image) => {
    this.setState({ lightboxImage: image });
  };

  closeLightbox = () => {
    this.setState({ lightboxImage: null });
  };

  getUserInitials(fullname) {
    if (!fullname) return 'U';
    const names = fullname.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  render() {
    const { breadcrumb, images, loading, lightboxImage } = this.state;
    const user = auth.getCurrentUser();

    // Determine what to show: children of current node, or root categories
    const currentNode = this.getCurrentNode();
    const isAtRoot = breadcrumb.length === 0;
    const isLeaf = currentNode && (!currentNode.children || currentNode.children.length === 0);

    // The items to show as clickable category cards at the current level
    const currentChildren = isAtRoot
      ? MARKETING_CATEGORIES
      : (currentNode && currentNode.children) || [];

    // Build breadcrumb labels
    const breadcrumbLabels = breadcrumb.map(id => {
      const node = findCategoryById(id);
      return { id, label: node ? node.label : id };
    });

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

        <main className="main-content">
          <h1 className="page-title">Marketing Materials</h1>
          <p className="page-subtitle">Browse and download marketing images and materials</p>

          {/* Breadcrumb navigation */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', flexWrap: 'wrap', fontSize: '14px' }}>
            <button
              onClick={() => this.handleBreadcrumbNav(0)}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer',
                color: isAtRoot ? '#1F2937' : '#E31837',
                fontWeight: isAtRoot ? 600 : 400,
                fontSize: '14px',
                borderRadius: '4px'
              }}
            >
              All Categories
            </button>
            {breadcrumbLabels.map((crumb, index) => {
              const isLast = index === breadcrumbLabels.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  <svg width="14" height="14" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <button
                    onClick={() => !isLast && this.handleBreadcrumbNav(index + 1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px 8px',
                      cursor: isLast ? 'default' : 'pointer',
                      color: isLast ? '#1F2937' : '#E31837',
                      fontWeight: isLast ? 600 : 400,
                      fontSize: '14px',
                      borderRadius: '4px'
                    }}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Category grid — shown when there are sub-categories to choose from */}
          {!isLeaf && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {currentChildren.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => this.handleSelectCategory(cat.id)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '20px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s',
                    gap: '8px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#E31837';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(227,24,55,0.1)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E5E7EB';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Folder icon */}
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#FEF2F2', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {cat.children ? (
                      <svg width="22" height="22" fill="none" stroke="#E31837" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" fill="none" stroke="#E31837" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#1F2937', lineHeight: '1.4' }}>
                      {cat.label}
                    </p>
                    {cat.children && (
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9CA3AF' }}>
                        {cat.children.length} {cat.children.length === 1 ? 'subcategory' : 'subcategories'}
                      </p>
                    )}
                  </div>
                  {cat.children && (
                    <svg width="16" height="16" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" style={{ marginLeft: 'auto', flexShrink: 0, alignSelf: 'center' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Image grid — shown when at a leaf category */}
          {isLeaf && (
            <>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280' }}>
                  <p>Loading images...</p>
                </div>
              ) : images.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <svg width="48" height="48" fill="none" stroke="#9CA3AF" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem', display: 'block' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p style={{ color: '#6B7280', margin: 0 }}>No images in this category yet.</p>
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
            </>
          )}

          {/* Lightbox */}
          {lightboxImage && (
            <div
              onClick={this.closeLightbox}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '24px' }}
            >
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
                <img
                  src={lightboxImage.url}
                  alt={lightboxImage.originalName}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <button
                onClick={this.closeLightbox}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '32px', cursor: 'pointer', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.3)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
              >
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
