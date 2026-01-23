import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getAllOrders } from "../services/ordersService";

class Orders extends Component {
  state = {
    orders: [],
  };

  async componentDidMount() {
    const { data: orders } = await getAllOrders();
    this.setState({ orders });
  }

  getStatusBadge(order) {
    if (order.confirmedorder) {
      return { text: 'Confirmed', class: 'badge-success' };
    }
    if (order.hasDiscount) {
      return { text: 'Special Offer', class: 'badge-warning' };
    }
    return { text: 'Pending', class: 'badge-secondary' };
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  }

  formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  render() {
    const { orders } = this.state;
    const { length: count } = orders;

    if (count === 0) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <svg width="64" height="64" fill="none" stroke="var(--color-gray-300)" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
            No orders yet
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
            Orders will appear here once quotes are confirmed
          </p>
        </div>
      );
    }

    return (
      <div>
        {/* Page Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>My Orders</h2>
          <p className="page-subtitle">Track your confirmed orders</p>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Model</th>
                <th style={{ textAlign: 'right' }}>Base Price</th>
                <th style={{ textAlign: 'right' }}>Markup</th>
                <th style={{ textAlign: 'center' }}>Status</th>
                <th style={{ textAlign: 'right' }}>Discount</th>
                <th style={{ textAlign: 'right' }}>Saving</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th>PO Number</th>
                <th>Stock Number</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const status = this.getStatusBadge(order);
                const total = order.hasDiscount 
                  ? order.discountedPrice + order.markup
                  : order.price + order.markup;

                return (
                  <tr key={order._id}>
                    <td>
                      <Link to={`/orderdetail/${order._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <span style={{ fontWeight: '500', color: 'var(--color-gray-800)' }}>
                            {this.formatDate(order.updatedAt)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                            {this.formatTime(order.updatedAt)}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500', color: 'var(--color-gray-700)' }}>
                        {order.model}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      £{order.price?.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      {order.markup > 0 ? `£${order.markup.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      {order.hasDiscount ? (
                        <span>
                          {(order.discountPercentage * 100) % 1 === 0 
                            ? (order.discountPercentage * 100).toFixed(0) + '%' 
                            : (order.discountPercentage * 100).toFixed(1) + '%'}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {order.hasDiscount ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                          -£{order.discountAmount?.toLocaleString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>
                        £{total?.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      {order.ponumber ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                          {order.ponumber}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-gray-400)' }}>-</span>
                      )}
                    </td>
                    <td>
                      {order.stocknumber ? (
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                          {order.stocknumber}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-gray-400)' }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="card mt-lg">
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
                {orders.filter(o => o.confirmedorder).length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                Pending
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                {orders.filter(o => !o.confirmedorder).length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                Total Value
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                £{orders.reduce((sum, o) => {
                  const total = o.hasDiscount 
                    ? o.discountedPrice + o.markup
                    : o.price + o.markup;
                  return sum + total;
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Orders;
