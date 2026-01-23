import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../services/userService";
import { getDealers } from "../services/dealerService";
import Assigndealer from "./assigndealer";
import { assignDealertouser, removeDealerfromuser } from "../services/userService";
import auth from "../services/authService";

class ListAllUsers extends Component {
  state = {
    users: [],
    dealers: [],
    user: null
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

  render() {
    const { users: u, dealers: d, user } = this.state;
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
                          <Assigndealer
                            user={x}
                            dealers={d}
                            onAssigndealer={this.handleAssigndealer}
                          />
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
                      Dealers
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {u.filter(user => !user.isAdmin && !user.isMaximGB).length}
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
      </div>
    );
  }
}

export default ListAllUsers;
