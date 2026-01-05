import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './OrderReview.css';

const OrderReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, wholesalerId } = location.state || { cart: [], wholesalerId: null };
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter(item => item.productId !== productId);
    if (updatedCart.length === 0) {
      navigate(-1);
    } else {
      navigate('/order/review', { 
        state: { cart: updatedCart, wholesalerId }, 
        replace: true 
      });
    }
  };

  const handleUpdateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
    } else {
      const updatedCart = cart.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      navigate('/order/review', { 
        state: { cart: updatedCart, wholesalerId }, 
        replace: true 
      });
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        wholesalerId,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        notes
      };

      await api.post('/orders', orderData);
      
      // Show success message
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
    setLoading(false);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="order-review-container">
        <div className="empty-state">
          <p>No items in order</p>
          <button onClick={() => navigate('/')}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-review-container">
      <div className="review-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h2>Review Order</h2>
      </div>

      <div className="review-content">
        <div className="order-items">
          <h3 className="section-title">Order Items ({cart.length})</h3>
          {cart.map(item => (
            <div key={item.productId} className="order-item">
              <div className="item-details">
                <h4>{item.name}</h4>
                {item.brand && <p className="item-brand">{item.brand}</p>}
                <p className="item-unit">{item.unit}</p>
                {item.price && (
                  <p className="item-price">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                )}
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}>
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <button
                  className="btn-remove"
                  onClick={() => handleRemoveItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3 className="section-title">Order Summary</h3>
          <div className="summary-row">
            <span>Total Items:</span>
            <span className="summary-value">{totalItems} units</span>
          </div>
          {totalAmount > 0 && (
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span className="summary-value">₹{totalAmount}</span>
            </div>
          )}
        </div>

        <div className="notes-section">
          <h3 className="section-title">Additional Notes (Optional)</h3>
          <textarea
            placeholder="Add any special instructions or notes for the wholesaler..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="4"
          />
        </div>
      </div>

      <div className="review-footer">
        <button
          className="btn-submit"
          onClick={handleSubmitOrder}
          disabled={loading}
        >
          {loading ? 'Placing Order...' : 'Send Order →'}
        </button>
      </div>
    </div>
  );
};

export default OrderReview;
