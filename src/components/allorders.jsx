import _ from "lodash";
import React, { Component } from "react";
import { brandConfig } from "../config/brand";
import { Link } from "react-router-dom";
import { getAllOrders, deleteOrder } from "../services/allOrdersService";
import { confirmOrder } from "../services/ordersService";
import { getUsers } from "../services/userService";
import { getDealers } from "../services/dealerService";
import Confirmorder from "./confirmorder";
import auth from "../services/authService";

class Orders extends Component {
  state = {
    orders: [],
    users: [],
    dealers: [],
    user: null,
    deleteDialogOpen: false,
    deleteTarget: null,
    deleteLoading: false,
    snackbarOpen: false,
    snackbarMessage: "",
  };

  async componentDidMount() {
    const user = auth.getCurrentUser();
    this.setState({ user });

    const { data: orders } = await getAllOrders();
    const { data: users } = await getUsers();
    const { data: dealers } = await getDealers();

    this.setState({ orders, users, dealers });
  }

  getUserInitials(fullname) {
    if (!fullname) return "U";
    const names = fullname.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return fullname.substring(0, 2).toUpperCase();
  }

  handleConfirmation = async (orderid, stocknumber) => {
    const theorder = _.find(this.state.orders, ["_id", orderid]);
    if (theorder === undefined) return;

    theorder.confirmedorder = true;
    theorder.stocknumber = stocknumber;
    this.setState({ theorder });

    try {
      await confirmOrder(orderid, stocknumber);
    } catch(error) {
      console.log("Could not Confirm Order ", orderid, " in DB");
    }
  };

  handleDeleteClick = (order) => {
    this.setState({ deleteDialogOpen: true, deleteTarget: order });
  };

  handleDeleteCancel = () => {
    this.setState({ deleteDialogOpen: false, deleteTarget: null });
  };

  handleDeleteConfirm = async () => {
    const { deleteTarget, orders } = this.state;
    this.setState({ deleteLoading: true });

    try {
      await deleteOrder(deleteTarget._id);
      this.setState({
        orders: orders.filter(o => o._id !== deleteTarget._id),
        deleteDialogOpen: false,
        deleteTarget: null,
        deleteLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Order for ${deleteTarget.model || 'unknown model'} has been deleted.`,
      });
    } catch (ex) {
      this.setState({
        deleteLoading: false,
        snackbarOpen: true,
        snackbarMessage: "Failed to delete order. Please try again.",
      });
    }
  };

  handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false, snackbarMessage: "" });
  };



  render() {
    const {
      orders: t,
      users: u,
      dealers: d,
      user,
      deleteDialogOpen,
      deleteTarget,
      deleteLoading,
      snackbarOpen,
      snackbarMessage,
    } = this.state;
    const { length: count } = t;

    if (!user) return <p>Loading...</p>;

    const isAdmin = user.isAdmin;

    const dealername = (id) => {
      const ptr = _.find(u, ["_id", id]);
      if (ptr === undefined) return "-";
      const m = ptr.dealerId;
      if (m === undefined) return "-";
      const dealer = _.find(d, ["_id", m]);
      return dealer ? dealer.dealername : "-";
    };

    const username = (id) => {
      const ptr = _.find(u, ["_id", id]);
      return ptr ? ptr.name : "-";
    };

    const emailaddr = (id) => {
      const ptr = _.find(u, ["_id", id]);
      return ptr ? ptr.email : "-";
    };

    const totalValue = t.reduce((sum, order) => {
      if (order.hasDiscount && order.discountedPrice != null) {
        return sum + order.discountedPrice;
      } else if (order.saving != null && order.price != null) {
        return sum + (order.price - order.saving);
      } else if (order.price != null) {
        return sum + order.price;
      }
      return sum;
    }, 0);

    const confirmedCount = t.filter(o => o.confirmedorder).length;

    return (
      <div className="page-container">
        {/* Header */}
        <header className="header">
          <Link to="/" className="header-logo">
            <img src={brandConfig.logo} alt={brandConfig.name} style={{ height: '40px' }} />
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
            <h2 className="page-title">All Orders</h2>
            <p className="page-subtitle">View and manage all orders across the system</p>
          </div>

          {count === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
              <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
                No orders found
              </p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                Orders will appear here once created
              </p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className="card mb-lg">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Total Orders
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {count}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Confirmed
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {confirmedCount}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Pending
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      {count - confirmedCount}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                      Total Value
                    </p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                      £{totalValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>User</th>
                      <th>Email</th>
                      <th>Dealer</th>
                      <th>Model</th>
                      <th style={{ textAlign: 'center' }}>Offer</th>
                      <th style={{ textAlign: 'right' }}>Discount %</th>
                      <th style={{ textAlign: 'right' }}>Saving</th>
                      <th style={{ textAlign: 'right' }}>Total</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th>PO Number</th>
                      <th>Stock Number</th>
                      {isAdmin && <th></th>}
                    </tr>
                  </thead>
                  <tbody>
                    {t.map((x) => (
                      <tr key={x._id}>
                        <td>
                          <Link to={"/orderdetail/" + x._id} style={{ textDecoration: 'none' }}>
                            <div style={{ color: 'var(--color-primary)', fontWeight: '500' }}>
                              {_.slice(x.updatedAt, 0, 10)}
                            </div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--color-gray-500)' }}>
                              {_.slice(x.updatedAt, 11, 19)}
                            </div>
                          </Link>
                        </td>
                        <td>
                          <span style={{ fontWeight: '500', color: 'var(--color-gray-800)' }}>
                            {username(x.userid)}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
                            {emailaddr(x.userid)}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--color-gray-700)' }}>
                            {dealername(x.userid)}
                          </span>
                        </td>
                        <td>
                          <span style={{ color: 'var(--color-gray-800)' }}>
                            {x.model}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {(x.hasDiscount || x.saving > 0) && (
                            <span className="badge badge-success">Yes</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {x.hasDiscount ? (
                            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                              {(x.discountPercentage * 100) % 1 === 0 
                                ? (x.discountPercentage * 100).toFixed(0) + "%" 
                                : (x.discountPercentage * 100).toFixed(1) + "%"}
                            </span>
                          ) : null}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {x.hasDiscount && x.discountAmount != null && (
                            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                              £{x.discountAmount.toLocaleString()}
                            </span>
                          )}
                          {!x.hasDiscount && x.saving != null && (
                            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                              £{x.saving.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>
                            {x.hasDiscount && x.discountedPrice != null && `£${x.discountedPrice.toLocaleString()}`}
                            {!x.hasDiscount && x.saving != null && x.price != null && `£${(x.price - x.saving).toLocaleString()}`}
                            {!x.hasDiscount && !x.saving && x.price != null && `£${x.price.toLocaleString()}`}
                            {x.price == null && '-'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          {x.confirmedorder ? (
                            <span className="badge badge-success">Confirmed</span>
                          ) : (
                            <Confirmorder  
                              orderid={x._id}
                              onConfirmorder={this.handleConfirmation}
                            />
                          )}
                        </td>
                        <td>
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                            {x.ponumber || "-"}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                            {x.stocknumber || "-"}
                          </span>
                        </td>
                        {isAdmin && !x.confirmedorder && !x.stocknumber && (
                          <td style={{ textAlign: 'right' }}>
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
                            >
                              Delete
                            </button>
                          </td>
                        )}
                        {isAdmin && (x.confirmedorder || x.stocknumber) && (
                          <td />
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>

        {/* Delete Order Confirmation Dialog */}
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
                Delete Order
              </h3>
              <p style={{ margin: '0 0 1.25rem', color: 'var(--color-gray-700)' }}>
                Are you sure you want to delete the order for <strong>{deleteTarget.model}</strong>
                {deleteTarget.quoteRef ? <> ({deleteTarget.quoteRef})</> : null}?
                This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  onClick={this.handleDeleteCancel}
                  disabled={deleteLoading}
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
                  onClick={this.handleDeleteConfirm}
                  disabled={deleteLoading}
                  style={{
                    padding: '8px 18px', borderRadius: '4px', border: 'none',
                    background: 'var(--color-danger, #dc2626)', color: '#fff',
                    cursor: deleteLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.875rem', opacity: deleteLoading ? 0.7 : 1,
                  }}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Order'}
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

export default Orders;
