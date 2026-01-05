import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.order);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await api.put(`/orders/${id}/status`, { status: newStatus });
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      seen: '#2196f3',
      processing: '#9c27b0',
      completed: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-state">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="empty-state">Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Order Details</h2>
      </div>

      <div className="details-content">
        {/* Order Info */}
        <div className="info-card">
          <div className="info-header">
            <h3 className="order-number">{order.orderNumber}</h3>
            <div
              className="status-badge"
              style={{ backgroundColor: getStatusColor(order.status) }}
            >
              {order.status}
            </div>
          </div>
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">
              {user.role === 'retailer' ? 'Wholesaler:' : 'Retailer:'}
            </span>
            <span className="info-value">
              {user.role === 'retailer' 
                ? order.wholesaler?.businessName || order.wholesaler?.shopName
                : order.retailer?.shopName
              }
            </span>
          </div>
          {user.role === 'wholesaler' && (
            <>
              <div className="info-row">
                <span className="info-label">Contact:</span>
                <span className="info-value">{order.retailer?.mobile}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Location:</span>
                <span className="info-value">
                  {order.retailer?.location?.area}, {order.retailer?.location?.city}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Order Items */}
        <div className="items-card">
          <h3 className="card-title">Order Items ({order.items.length})</h3>
          {order.items.map((item, index) => (
            <div key={index} className="detail-item">
              <div className="item-info">
                <h4>{item.productName}</h4>
                {item.brand && <p className="item-brand">{item.brand}</p>}
                <p className="item-quantity">Quantity: {item.quantity} {item.unit}</p>
              </div>
              {item.price && (
                <div className="item-price-section">
                  <p className="item-unit-price">₹{item.price}</p>
                  <p className="item-total-price">₹{item.price * item.quantity}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="summary-card">
          <h3 className="card-title">Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span className="summary-value">{order.totalItems} units</span>
          </div>
          <div className="summary-row">
            <span>Total Products:</span>
            <span className="summary-value">{order.items.length}</span>
          </div>
          {order.totalAmount > 0 && (
            <div className="summary-row total-row">
              <span>Total Amount:</span>
              <span className="summary-value">₹{order.totalAmount}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {order.notes && (
          <div className="notes-card">
            <h3 className="card-title">Notes</h3>
            <p>{order.notes}</p>
          </div>
        )}

        {/* Wholesaler Actions */}
        {user.role === 'wholesaler' && (
          <div className="actions-card">
            <h3 className="card-title">Update Status</h3>
            <div className="status-buttons">
              {order.status === 'pending' && (
                <button
                  className="status-btn seen"
                  onClick={() => handleStatusUpdate('seen')}
                >
                  Mark as Seen
                </button>
              )}
              {(order.status === 'pending' || order.status === 'seen') && (
                <button
                  className="status-btn processing"
                  onClick={() => handleStatusUpdate('processing')}
                >
                  Mark as Processing
                </button>
              )}
              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <button
                  className="status-btn completed"
                  onClick={() => handleStatusUpdate('completed')}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
