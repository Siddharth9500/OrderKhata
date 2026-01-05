import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './OrderHistory.css';

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    try {
      const params = filter === 'all' ? {} : { status: filter };
      const response = await api.get('/orders/my-orders', { params });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    if (!window.confirm('Do you want to reorder the same items?')) return;
    
    try {
      await api.post(`/orders/${orderId}/reorder`);
      alert('Reorder placed successfully!');
      fetchOrders();
    } catch (error) {
      console.error('Error reordering:', error);
      alert('Failed to place reorder');
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

  return (
    <div className="order-history-container">
      <div className="history-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2>Order History</h2>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="history-order-card">
                <div className="order-card-header">
                  <div>
                    <h3 className="order-number">{order.orderNumber}</h3>
                    <p className="order-party">
                      {user.role === 'retailer' 
                        ? `To: ${order.wholesaler?.shopName}`
                        : `From: ${order.retailer?.shopName}`
                      }
                    </p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div
                    className="order-status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="order-summary-box">
                  <p className="summary-text">
                    {order.totalItems} items • {order.items.length} products
                  </p>
                  {order.totalAmount > 0 && (
                    <p className="summary-amount">₹{order.totalAmount}</p>
                  )}
                </div>

                <div className="order-card-actions">
                  <button
                    className="btn-view-details"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </button>
                  {user.role === 'retailer' && (
                    <button
                      className="btn-reorder"
                      onClick={() => handleReorder(order._id)}
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
