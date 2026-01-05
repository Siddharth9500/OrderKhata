import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const WholesalerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/my-orders', {
        params: { status: activeTab === 'all' ? undefined : activeTab }
      });
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/orders/stats/summary');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
      fetchStats();
    } catch (error) {
      console.error('Error updating order status:', error);
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

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-top">
          <div>
            <h2 className="shop-name">{user?.businessName || user?.shopName}</h2>
            <p className="user-name">{user?.name}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/manage-products')}>
              📦
            </button>
            <button className="icon-btn" onClick={() => navigate('/orders')}>
              📋
            </button>
            <button className="icon-btn" onClick={logout}>
              🚪
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Orders</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button 
            className={`tab ${activeTab === 'seen' ? 'active' : ''}`}
            onClick={() => setActiveTab('seen')}
          >
            Seen
          </button>
          <button 
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-state">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>No orders found</p>
          </div>
        ) : (
          <div className="order-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3 className="order-number">{order.orderNumber}</h3>
                    <p className="retailer-name">{order.retailer?.shopName}</p>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div 
                    className="order-status"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="order-items-preview">
                  <p className="items-count">{order.totalItems} items</p>
                  <div className="items-list-preview">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="item-preview">
                        • {item.productName} ({item.quantity} {item.unit})
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="item-preview">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => navigate(`/order/${order._id}`)}
                  >
                    View Details
                  </button>
                  {order.status === 'pending' && (
                    <button 
                      className="btn-primary"
                      onClick={() => handleStatusUpdate(order._id, 'seen')}
                    >
                      Mark as Seen
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

export default WholesalerDashboard;
