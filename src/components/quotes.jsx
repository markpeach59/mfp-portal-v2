import React, { Component } from "react";
import { Link } from "react-router-dom";
import { getQuotes } from "../services/quotesService";

class Quotes extends Component {
  state = {
    quotes: [],
  };

  async componentDidMount() {
    const { data: quotes } = await getQuotes();
    this.setState({ quotes });
  }

  getStatusBadge(quote) {
    // Determine status based on quote properties
    if (quote.hasDiscount || quote.saving > 0) {
      return { text: 'Special Offer', class: 'badge-warning' };
    }
    return { text: 'Standard', class: 'badge-secondary' };
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
    const { quotes } = this.state;
    const { length: count } = quotes;

    if (count === 0) {
      return (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <svg width="64" height="64" fill="none" stroke="var(--color-gray-300)" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p style={{ fontWeight: '500', color: 'var(--color-gray-800)', marginBottom: '0.5rem' }}>
            No quotes yet
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '1.5rem' }}>
            Start by building your first quote
          </p>
          <Link to="/configurator/build">
            <button className="btn btn-primary">
              Build New Quote
            </button>
          </Link>
        </div>
      );
    }

    return (
      <div>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>My Quotes</h2>
            <p className="page-subtitle">View and manage your quote requests</p>
          </div>
          <Link to="/configurator/build">
            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Quote
            </button>
          </Link>
        </div>

        {/* Quotes Table */}
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
              </tr>
            </thead>
            <tbody>
              {quotes.map((quote) => {
                const status = this.getStatusBadge(quote);
                const total = quote.hasDiscount 
                  ? (quote.discountedPrice || 0) + (quote.markup || 0)
                  : (!quote.hasDiscount && quote.saving 
                    ? (quote.price || 0) - (quote.saving || 0) + (quote.markup || 0)
                    : (quote.price || 0) + (quote.markup || 0));

                return (
                  <tr key={quote._id}>
                    <td>
                      <Link to={`/quotedetail/${quote._id}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
                          <span style={{ fontWeight: '500', color: 'var(--color-gray-800)' }}>
                            {this.formatDate(quote.createdAt)}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                            {this.formatTime(quote.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span style={{ fontWeight: '500', color: 'var(--color-gray-700)' }}>
                        {quote.model}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      £{quote.price?.toLocaleString()}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      {quote.markup > 0 ? `£${quote.markup?.toLocaleString()}` : '-'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <span className={`badge ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--color-gray-700)' }}>
                      {quote.hasDiscount ? (
                        <span>
                          {(quote.discountPercentage * 100) % 1 === 0 
                            ? (quote.discountPercentage * 100).toFixed(0) + '%' 
                            : (quote.discountPercentage * 100).toFixed(1) + '%'}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {(quote.hasDiscount || quote.saving > 0) ? (
                        <span style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                          -£{(quote.discountAmount || quote.saving)?.toLocaleString()}
                        </span>
                      ) : '-'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '600', color: 'var(--color-gray-800)' }}>
                        £{total?.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="card mt-lg">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                Total Quotes
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                {count}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                With Offers
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                {quotes.filter(q => q.hasDiscount || q.saving > 0).length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gray-500)', marginBottom: '0.5rem' }}>
                Total Value
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-gray-800)', margin: 0 }}>
                £{quotes.reduce((sum, q) => {
                  const total = q.hasDiscount 
                    ? (q.discountedPrice || 0) + (q.markup || 0)
                    : (!q.hasDiscount && q.saving 
                      ? (q.price || 0) - (q.saving || 0) + (q.markup || 0)
                      : (q.price || 0) + (q.markup || 0));
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

export default Quotes;
