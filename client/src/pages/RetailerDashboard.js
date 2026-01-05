import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Dashboard.css';

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [wholesalers, setWholesalers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchWholesalers();
  }, []);

  const fetchWholesalers = async () => {
    try {
      const response = await api.get('/users/wholesalers');
      setWholesalers(response.data.wholesalers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wholesalers:', error);
      setLoading(false);
    }
  };

  const filteredWholesalers = wholesalers.filter(w => {
    const matchesSearch = w.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         w.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
                           w.categoriesSupplied?.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const categories = ['Rice & Grains', 'Pulses', 'FMCG', 'Snacks', 'Oil', 'Spices', 'Beverages', 'Dairy'];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-top">
          <div>
            <h2 className="shop-name">{user?.shopName}</h2>
            <p className="user-name">{user?.name}</p>
          </div>
          <div className="header-actions">
            <button className="icon-btn" onClick={() => navigate('/orders')}>
              📋
            </button>
            <button className="icon-btn" onClick={logout}>
              🚪
            </button>
          </div>
        </div>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="🔍 Search wholesalers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filter">
          <div className="filter-scroll">
            <div
              className={`filter-chip ${!selectedCategory ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </div>
            {categories.map(cat => (
              <div
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading-state">Loading wholesalers...</div>
        ) : filteredWholesalers.length === 0 ? (
          <div className="empty-state">
            <p>No wholesalers found</p>
          </div>
        ) : (
          <div className="wholesaler-list">
            {filteredWholesalers.map(wholesaler => (
              <div 
                key={wholesaler._id} 
                className="wholesaler-card"
                onClick={() => navigate(`/wholesaler/${wholesaler._id}/products`)}
              >
                <div className="wholesaler-info">
                  <h3 className="wholesaler-name">{wholesaler.businessName || wholesaler.shopName}</h3>
                  <p className="wholesaler-location">
                    📍 {wholesaler.location?.area}, {wholesaler.location?.city}
                  </p>
                  <div className="wholesaler-categories">
                    {wholesaler.categoriesSupplied?.slice(0, 3).map(cat => (
                      <span key={cat} className="category-tag">{cat}</span>
                    ))}
                    {wholesaler.categoriesSupplied?.length > 3 && (
                      <span className="category-tag">+{wholesaler.categoriesSupplied.length - 3}</span>
                    )}
                  </div>
                </div>
                <div className="wholesaler-action">
                  <button className="btn-view">View Products →</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RetailerDashboard;
