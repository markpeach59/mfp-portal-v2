import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getDealers, setDealerRestricted } from "../services/dealerService";
import auth from "../services/authService";

class ListAllDealers extends Component {
  state = {
    dealers: [],
    user: null,
    // restrict dialog state
    restrictDialogOpen: false,
    restrictTarget: null,     // dealer object
    restrictAction: null,     // 'restrict' | 'unrestrict'
    restrictLoading: false,
    snackbarOpen: false,
    snackbarMessage: "",
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data: dealers } = await getDealers();
    this.setState({ dealers });
  }

  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  handleRestrictClick = (dealer, action) => {
    this.setState({
      restrictDialogOpen: true,
      restrictTarget: dealer,
      restrictAction: action,
    });
  };

  handleRestrictCancel = () => {
    this.setState({
      restrictDialogOpen: false,
      restrictTarget: null,
      restrictAction: null,
    });
  };

  handleRestrictConfirm = async () => {
    const { restrictTarget, restrictAction, dealers } = this.state;
    const isRestricted = restrictAction === 'restrict';
    this.setState({ restrictLoading: true });

    try {
      await setDealerRestricted(restrictTarget._id, isRestricted);
      const updatedDealers = dealers.map(d =>
        d._id === restrictTarget._id ? { ...d, isRestricted } : d
      );
      this.setState({
        dealers: updatedDealers,
        restrictDialogOpen: false,
        restrictTarget: null,
        restrictAction: null,
        restrictLoading: false,
        snackbarOpen: true,
        snackbarMessage: isRestricted
          ? `${restrictTarget.dealername} has been set to restricted pricing.`
          : `Restriction removed from ${restrictTarget.dealername}.`,
      });
    } catch (ex) {
      this.setState({
        restrictLoading: false,
        snackbarOpen: true,
        snackbarMessage: "Failed to update dealer. Please try again.",
      });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarMessage: "" });
  };

  render() {
    const {
      dealers: d,
      user,
      restrictDialogOpen,
      restrictTarget,
      restrictAction,
      restrictLoading,
      snackbarOpen,
      snackbarMessage,
    } = this.state;
    const { length: count } = d;

    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <Link to="/" className="header-logo">
            <img src="/img/logo-black.png" alt="Maximal Forklifts UK" style={{ height: '40px' }} />
          </Link>
          <nav className="header-nav">
            <a href="https://maximalforklift.co.uk" className="header-link" target="_blank" rel="noopener noreferrer">
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

          <div className="mb-lg">
            <h2 className="page-title">Dealer Management</h2>
            <p className="page-subtitle">View and manage dealer accounts</p>
          </div>

          {count === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <svg width="64" height="64" fill="none" stroke="var(--color-gray-300)" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
                No dealers found
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                Dealers will appear here once registered
              </p>
            </div>
          ) : (
            <>
              {/* Dealers Grid */}
              <div className="grid-3">
                {d.map((dealer) => (
                  <div key={dealer._id} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary-light)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '1.125rem'
                      }}>
                        {dealer.dealername?.substring(0, 2).toUpperCase() || 'D'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-gray-800)', margin: 0 }}>
                          {dealer.dealername}
                        </h3>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                      {dealer.isRestricted ? (
                        <span className="badge badge-warning">Restricted Pricing</span>
                      ) : (
                        <span />
                      )}
                      {isAdmin && (
                        dealer.isRestricted ? (
                          <button
                            onClick={() => this.handleRestrictClick(dealer, 'unrestrict')}
                            style={{
                              background: 'none',
                              border: '1px solid var(--color-success, #16a34a)',
                              color: 'var(--color-success, #16a34a)',
                              borderRadius: '4px',
                              padding: '3px 10px',
                              fontSize: '0.775rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Remove Restriction
                          </button>
                        ) : (
                          <button
                            onClick={() => this.handleRestrictClick(dealer, 'restrict')}
                            style={{
                              background: 'none',
                              border: '1px solid #f59e0b',
                              color: '#92400e',
                              borderRadius: '4px',
                              padding: '3px 10px',
                              fontSize: '0.775rem',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Restrict Pricing
                          </button>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="card mt-lg">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Total Dealers
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {count}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Restricted Access
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {d.filter(dealer => dealer.isRestricted).length}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
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

        {/* Restrict / Unrestrict Confirmation Dialog */}
        {restrictDialogOpen && restrictTarget && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}>
            <div style={{
              background: '#fff', borderRadius: '8px', padding: '2rem',
              maxWidth: '460px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <h3 style={{ margin: '0 0 0.75rem', color: 'var(--color-gray-800)', fontSize: '1.1rem' }}>
                {restrictAction === 'restrict' ? 'Restrict Pricing' : 'Remove Restriction'}
              </h3>
              <p style={{ margin: '0 0 1.25rem', color: 'var(--color-gray-700)' }}>
                {restrictAction === 'restrict'
                  ? <>Are you sure you want to restrict <strong>{restrictTarget.dealername}</strong>? Their users will see restricted pricing in the configurator.</>
                  : <>Are you sure you want to remove the restriction from <strong>{restrictTarget.dealername}</strong>? Their users will return to standard pricing.</>
                }
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={this.handleRestrictCancel}
                  disabled={restrictLoading}
                  style={{
                    padding: '8px 18px', borderRadius: '4px',
                    border: '1px solid var(--color-gray-300, #d1d5db)',
                    background: '#fff', color: 'var(--color-gray-700)',
                    cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={this.handleRestrictConfirm}
                  disabled={restrictLoading}
                  style={{
                    padding: '8px 18px', borderRadius: '4px', border: 'none',
                    background: restrictAction === 'restrict' ? '#f59e0b' : 'var(--color-success, #16a34a)',
                    color: '#fff',
                    cursor: restrictLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem',
                    opacity: restrictLoading ? 0.7 : 1,
                  }}
                >
                  {restrictLoading
                    ? 'Saving...'
                    : restrictAction === 'restrict' ? 'Restrict Pricing' : 'Remove Restriction'
                  }
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Snackbar */}
        {snackbarOpen && (
          <div style={{
            position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            background: '#1f2937', color: '#fff', padding: '0.75rem 1.5rem',
            borderRadius: '6px', fontSize: '0.875rem', zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {snackbarMessage}
            <button
              onClick={this.handleSnackbarClose}
              style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '1rem' }}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default ListAllDealers;
