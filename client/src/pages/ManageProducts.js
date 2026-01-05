import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './ManageProducts.css';

const ManageProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: '',
    unit: '',
    unitSize: 1,
    price: '',
    description: ''
  });

  const categories = [
    'Rice & Grains', 'Pulses', 'FMCG', 'Snacks', 'Oil',
    'Spices', 'Beverages', 'Dairy', 'Cleaning', 'Personal Care', 'Other'
  ];

  const units = ['kg', 'gram', 'liter', 'ml', 'packet', 'carton', 'piece'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products/my-products');
      setProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, formData);
        alert('Product updated successfully!');
      } else {
        await api.post('/products', formData);
        alert('Product added successfully!');
      }
      setShowAddForm(false);
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: '',
        category: '',
        unit: '',
        unitSize: 1,
        price: '',
        description: ''
      });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand || '',
      category: product.category,
      unit: product.unit,
      unitSize: product.unitSize,
      price: product.price || '',
      description: product.description || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.delete(`/products/${productId}`);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  const handleToggleAvailability = async (product) => {
    try {
      await api.put(`/products/${product._id}`, {
        isAvailable: !product.isAvailable
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <div className="manage-products-container">
      <div className="manage-header">
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2>Manage Products</h2>
        <button className="btn-add-product" onClick={() => setShowAddForm(true)}>
          + Add Product
        </button>
      </div>

      <div className="manage-content">
        {loading ? (
          <div className="loading-state">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <p>No products added yet</p>
            <button className="btn-primary" onClick={() => setShowAddForm(true)}>
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="products-list-manage">
            {products.map(product => (
              <div key={product._id} className="product-card-manage">
                <div className="product-main-info">
                  <div>
                    <h3>{product.name}</h3>
                    {product.brand && <p className="product-brand">{product.brand}</p>}
                    <p className="product-details">
                      {product.unitSize} {product.unit} • {product.category}
                    </p>
                    {product.price && <p className="product-price">₹{product.price}</p>}
                  </div>
                  <div className="availability-toggle">
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={product.isAvailable}
                        onChange={() => handleToggleAvailability(product)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="availability-label">
                      {product.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-form">
            <div className="modal-form-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => {
                setShowAddForm(false);
                setEditingProduct(null);
              }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="Enter brand name"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unit Size *</label>
                  <input
                    type="number"
                    name="unitSize"
                    value={formData.unitSize}
                    onChange={handleChange}
                    placeholder="1"
                    step="0.01"
                    min="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select unit</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit-form">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
