import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [step, setStep] = useState(1); // Step 1: Role selection, Step 2: Details
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    mobile: '',
    password: '',
    shopName: '',
    area: '',
    city: '',
    // Wholesaler specific
    businessName: '',
    categoriesSupplied: [],
    // Retailer specific
    shopSize: '',
    preferredCategories: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Rice & Grains', 'Pulses', 'FMCG', 'Snacks', 'Oil', 
    'Spices', 'Beverages', 'Dairy', 'Cleaning', 'Personal Care'
  ];

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleCategoryToggle = (category) => {
    const field = formData.role === 'wholesaler' ? 'categoriesSupplied' : 'preferredCategories';
    const currentCategories = formData[field];
    
    if (currentCategories.includes(category)) {
      setFormData({
        ...formData,
        [field]: currentCategories.filter(c => c !== category)
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentCategories, category]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const userData = {
      ...formData,
      location: {
        area: formData.area,
        city: formData.city
      }
    };

    const result = await signup(userData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {step === 1 && (
          <>
            <div className="auth-header">
              <h2 className="auth-title">Join OrderKhata</h2>
              <p className="auth-subtitle">Select your role</p>
            </div>

            <div className="role-selection">
              <div 
                className="role-card"
                onClick={() => handleRoleSelect('retailer')}
              >
                <div className="role-icon">🏪</div>
                <h3>I am a Retailer</h3>
                <p>(Shopkeeper)</p>
              </div>

              <div 
                className="role-card"
                onClick={() => handleRoleSelect('wholesaler')}
              >
                <div className="role-icon">📦</div>
                <h3>I am a Wholesaler</h3>
                <p>(Distributor)</p>
              </div>
            </div>

            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="auth-header">
              <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">
                {formData.role === 'retailer' ? 'Retailer Details' : 'Wholesaler Details'}
              </p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10 digit mobile"
                  maxLength="10"
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 6 characters"
                  minLength="6"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="shopName">Shop Name *</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Enter shop name"
                  required
                />
              </div>

              {formData.role === 'wholesaler' && (
                <div className="form-group">
                  <label htmlFor="businessName">Business Name *</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    placeholder="Enter business name"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="area">Area *</label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  required
                />
              </div>

              {formData.role === 'retailer' && (
                <div className="form-group">
                  <label htmlFor="shopSize">Shop Size *</label>
                  <select
                    id="shopSize"
                    name="shopSize"
                    value={formData.shopSize}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select shop size</option>
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>
                  {formData.role === 'wholesaler' ? 'Categories Supplied' : 'Preferred Categories'}
                </label>
                <div className="category-grid">
                  {categories.map(category => (
                    <div
                      key={category}
                      className={`category-chip ${
                        (formData.role === 'wholesaler' 
                          ? formData.categoriesSupplied 
                          : formData.preferredCategories
                        ).includes(category) ? 'selected' : ''
                      }`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;
