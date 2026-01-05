import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './WholesalerProducts.css';

const WholesalerProducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [wholesaler, setWholesaler] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    fetchWholesaler();
    fetchProducts();
  }, [id]);

  useEffect(() => {
    // Fetch recommendations when cart changes
    if (cart.length > 0) {
      fetchRecommendations();
    }
  }, [cart]);

  const fetchWholesaler = async () => {
    try {
      const response = await api.get(`/users/wholesaler/${id}`);
      setWholesaler(response.data.wholesaler);
    } catch (error) {
      console.error('Error fetching wholesaler:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products/wholesaler/${id}`);
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const productIds = cart.map(item => item.productId);
      const response = await api.post('/recommendations/suggest', {
        wholesalerId: id,
        currentItems: productIds
      });
      setRecommendations(response.data.recommendations);
      if (response.data.recommendations.length > 0) {
        setShowRecommendations(true);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(item => item.productId === product._id);
    if (existing) {
      setCart(cart.map(item =>
        item.productId === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        unit: product.unit,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.productId !== productId));
    } else {
      setCart(cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      ));
    }
  };

  const getCartQuantity = (productId) => {
    const item = cart.find(i => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-container">
      {/* Header */}
      <div className="products-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <div className="wholesaler-info-header">
          <h2>{wholesaler?.businessName || wholesaler?.shopName}</h2>
          <p>{wholesaler?.location?.city}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="products-toolbar">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="category-scroll">
          <div
            className={`category-chip ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory('')}
          >
            All
          </div>
          {categories.map(cat => (
            <div
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="products-content">
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">No products found</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => {
              const quantity = getCartQuantity(product._id);
              return (
                <div key={product._id} className="product-card">
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    {product.brand && <p className="product-brand">{product.brand}</p>}
                    <p className="product-unit">
                      {product.unitSize} {product.unit}
                    </p>
                    {product.price && (
                      <p className="product-price">₹{product.price}</p>
                    )}
                  </div>

                  {quantity === 0 ? (
                    <button
                      className="btn-add"
                      onClick={() => addToCart(product)}
                    >
                      Add to Order
                    </button>
                  ) : (
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(product._id, quantity - 1)}>
                        −
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(product._id, quantity + 1)}>
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations Modal */}
      {showRecommendations && recommendations.length > 0 && (
        <div className="recommendations-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>📋 You may have missed these items</h3>
              <button onClick={() => setShowRecommendations(false)}>✕</button>
            </div>
            <div className="recommendations-list">
              {recommendations.map(product => (
                <div key={product._id} className="recommendation-item">
                  <div>
                    <h4>{product.name}</h4>
                    <p>{product.brand} • {product.unitSize} {product.unit}</p>
                  </div>
                  <button
                    className="btn-add-small"
                    onClick={() => {
                      addToCart(product);
                      setRecommendations(recommendations.filter(r => r._id !== product._id));
                    }}
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
            <button
              className="btn-continue"
              onClick={() => setShowRecommendations(false)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Cart Footer */}
      {cart.length > 0 && (
        <div className="cart-footer">
          <div className="cart-info">
            <span className="cart-count">{cart.length} items</span>
            <span className="cart-total">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} total units
            </span>
          </div>
          <button
            className="btn-review"
            onClick={() => navigate('/order/review', { state: { cart, wholesalerId: id } })}
          >
            Review Order →
          </button>
        </div>
      )}
    </div>
  );
};

export default WholesalerProducts;
