import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUsers, getUserSummary, deleteUser } from "../services/userService";
import { getDealers } from "../services/dealerService";
import Assigndealer from "./assigndealer";
import { assignDealertouser, removeDealerfromuser } from "../services/userService";
import auth from "../services/authService";

class ListAllUsers extends Component {
  state = {
    users: [],
    dealers: [],
    user: null,
    // delete dialog state
    deleteDialogOpen: false,
    deleteTarget: null,       // the user object to be deleted
    deleteSummary: null,      // { quoteCount, orderCount }
    deleteLoading: false,
    deleteSnackbarOpen: false,
    deleteSnackbarMessage: "",
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data: users } = await getUsers();
    const { data: dealers } = await getDealers();

    this.setState({
      users,
      dealers,
    });
  }

  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  handleAssigndealer = (user, newdealerId) => {
    if (newdealerId === '') {
      user.dealerId = undefined;
      this.setState({ user });
      removeDealerfromuser(user._id);
      return;
    }

    user.dealerId = newdealerId;
    this.setState({ user });
    assignDealertouser(user._id, newdealerId);
  };

  handleDeleteClick = async (targetUser) => {
    // Fetch quote/order counts before opening the dialog
    const { data: summary } = await getUserSummary(targetUser._id);
    this.setState({
      deleteDialogOpen: true,
      deleteTarget: targetUser,
      deleteSummary: summary,
    });
  };

  handleDeleteCancel = () => {
    this.setState({
      deleteDialogOpen: false,
      deleteTarget: null,
      deleteSummary: null,
    });
  };

  handleDeleteConfirm = async () => {
    const { deleteTarget, users } = this.state;
    this.setState({ deleteLoading: true });

    try {
      await deleteUser(deleteTarget._id);
      const updatedUsers = users.filter(u => u._id !== deleteTarget._id);
      this.setState({
        users: updatedUsers,
        deleteDialogOpen: false,
        deleteTarget: null,
        deleteSummary: null,
        deleteLoading: false,
        deleteSnackbarOpen: true,
        deleteSnackbarMessage: `${deleteTarget.name} has been deleted.`,
      });
    } catch (ex) {
      this.setState({
        deleteLoading: false,
        deleteSnackbarOpen: true,
        deleteSnackbarMessage: "Failed to delete user. Please try again.",
      });
    }
  };

  handleDeleteSnackbarClose = () => {
    this.setState({ deleteSnackbarOpen: false, deleteSnackbarMessage: "" });
  };

  render() {
    const {
      users: u,
      dealers: d,
      user,
      deleteDialogOpen,
      deleteTarget,
      deleteSummary,
      deleteLoading,
      deleteSnackbarOpen,
      deleteSnackbarMessage,
    } = this.state;
    const { length: count } = u;

    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;

    const dealername = (id) => {
      const foundUser = _.find(u, ["_id", id]);
      if (!foundUser || !foundUser.dealerId) return "-";
      
      const dealer = _.find(d, ["_id", foundUser.dealerId]);
      return dealer ? dealer.dealername : "-";
    };

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
            <h2 className="page-title">User Management</h2>
            <p className="page-subtitle">Manage user accounts and dealer assignments</p>
          </div>

          {count === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
                No users found
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                Users will appear here once registered
              </p>
            </div>
          ) : (
            <>
              {/* Users Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Dealer</th>
                      <th style={{ textAlign: 'center' }}>Role</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {u.map((x) => (
                      <tr key={x._id}>
                        <td>
                          <span style={{ fontWeight: '500', color: 'var(--color-gray-800)' }}>
                            {x.name || '-'}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--color-gray-700)' }}>
                            {x.email}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--color-gray-700)' }}>
                            {dealername(x._id)}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {x.isAdmin ? (
                            <span className="badge badge-danger">Admin</span>
                          ) : x.isMaximGB ? (
                            <span className="badge badge-info">Maximal GB</span>
                          ) : (
                            <span className="badge badge-secondary">Dealer</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                            <Assigndealer
                              user={x}
                              dealers={d}
                              onAssigndealer={this.handleAssigndealer}
                            />
                            {/* Only show Delete for non-admin users who are not the logged-in user */}
                            {isAdmin && !x.isAdmin && x._id !== user._id && (
                              <button
                                onClick={() => this.handleDeleteClick(x)}
                                style={{
                                  background: 'none',
                                  border: '1px solid var(--color-danger, #dc2626)',
                                  color: 'var(--color-danger, #dc2626)',
                                  borderRadius: '4px',
                                  padding: '4px 10px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap',
                                }}
                                title="Delete user"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="card mt-lg">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Total Users
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {count}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Admins
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {u.filter(user => user.isAdmin).length}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Maximal GB
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {u.filter(user => user.isMaximGB).length}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Dealer Companies
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {d.length}
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

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && deleteTarget && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          }}>
            <div style={{
              background: '#fff', borderRadius: '8px', padding: '2rem',
              maxWidth: '460px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            }}>
              <h3 style={{ margin: '0 0 0.75rem', color: 'var(--color-gray-800)', fontSize: '1.1rem' }}>
                Delete User
              </h3>
              <p style={{ margin: '0 0 1rem', color: 'var(--color-gray-700)' }}>
                Are you sure you want to delete <strong>{deleteTarget.name}</strong> ({deleteTarget.email})?
                This action cannot be undone.
              </p>

              {/* Warning if user has quotes or orders */}
              {deleteSummary && (deleteSummary.quoteCount > 0 || deleteSummary.orderCount > 0) && (
                <div style={{
                  background: '#fffbeb', border: '1px solid #f59e0b',
                  borderRadius: '6px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
                }}>
                  <p style={{ margin: '0 0 0.25rem', fontWeight: '600', color: '#92400e', fontSize: '0.875rem' }}>
                    ⚠ Warning: This user has existing data
                  </p>
                  <p style={{ margin: 0, color: '#92400e', fontSize: '0.875rem' }}>
                    {deleteSummary.quoteCount > 0 && `${deleteSummary.quoteCount} quote${deleteSummary.quoteCount !== 1 ? 's' : ''}`}
                    {deleteSummary.quoteCount > 0 && deleteSummary.orderCount > 0 && ' and '}
                    {deleteSummary.orderCount > 0 && `${deleteSummary.orderCount} order${deleteSummary.orderCount !== 1 ? 's' : ''}`}
                    {' will remain in the system but will no longer be associated with an active user.'}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={this.handleDeleteCancel}
                  disabled={deleteLoading}
                  style={{
                    padding: '8px 18px', borderRadius: '4px', border: '1px solid var(--color-gray-300, #d1d5db)',
                    background: '#fff', color: 'var(--color-gray-700)', cursor: 'pointer', fontSize: '0.875rem',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={this.handleDeleteConfirm}
                  disabled={deleteLoading}
                  style={{
                    padding: '8px 18px', borderRadius: '4px', border: 'none',
                    background: 'var(--color-danger, #dc2626)', color: '#fff',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
                    opacity: deleteLoading ? 0.7 : 1,
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete result snackbar */}
        {deleteSnackbarOpen && (
          <div style={{
            position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
            background: '#1f2937', color: '#fff', padding: '0.75rem 1.5rem',
            borderRadius: '6px', fontSize: '0.875rem', zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            {deleteSnackbarMessage}
            <button
              onClick={this.handleDeleteSnackbarClose}
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

export default ListAllUsers;
