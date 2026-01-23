import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../services/allOrdersService";
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
    user: null
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

  render() {
    const { orders: t, users: u, dealers: d, user } = this.state;
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
      if (order.hasDiscount) {
        return sum + order.discountedPrice;
      } else if (order.saving) {
        return sum + (order.price - order.saving);
      }
      return sum + order.price;
    }, 0);

    const confirmedCount = t.filter(o => o.confirmedorder).length;

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
                          {x.hasDiscount && (
                            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                              £{x.discountAmount.toLocaleString()}
                            </span>
                          )}
                          {!x.hasDiscount && x.saving && (
                            <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                              £{x.saving.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>
                            {x.hasDiscount && `£${x.discountedPrice.toLocaleString()}`}
                            {!x.hasDiscount && x.saving && `£${(x.price - x.saving).toLocaleString()}`}
                            {!x.hasDiscount && !x.saving && `£${x.price.toLocaleString()}`}
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
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default Orders;
