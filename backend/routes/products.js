const express = require('express');
const router = express.Router();
const { auth, isWholesaler } = require('../middleware/auth');
const Product = require('../models/Product');

// @route   POST /api/products
// @desc    Create new product (wholesaler only)
// @access  Private (Wholesaler)
router.post('/', auth, isWholesaler, async (req, res) => {
  try {
    const { name, brand, category, unit, unitSize, price, description, imageUrl } = req.body;

    const product = new Product({
      wholesaler: req.user._id,
      name,
      brand,
      category,
      unit,
      unitSize,
      price,
      description,
      imageUrl
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/wholesaler/:wholesalerId
// @desc    Get all products of a wholesaler
// @access  Private
router.get('/wholesaler/:wholesalerId', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = { 
      wholesaler: req.params.wholesalerId,
      isAvailable: true
    };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    const products = await Product.find(query)
      .populate('wholesaler', 'shopName businessName')
      .sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/my-products
// @desc    Get all products of logged in wholesaler
// @access  Private (Wholesaler)
router.get('/my-products', auth, isWholesaler, async (req, res) => {
  try {
    const products = await Product.find({ wholesaler: req.user._id })
      .sort({ category: 1, name: 1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('wholesaler', 'shopName businessName location');

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product (wholesaler only)
// @access  Private (Wholesaler)
router.put('/:id', auth, isWholesaler, async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if product belongs to this wholesaler
    if (product.wholesaler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this product' 
      });
    }

    const { name, brand, category, unit, unitSize, price, description, imageUrl, isAvailable } = req.body;

    const updateData = { updatedAt: Date.now() };
    if (name) updateData.name = name;
    if (brand) updateData.brand = brand;
    if (category) updateData.category = category;
    if (unit) updateData.unit = unit;
    if (unitSize) updateData.unitSize = unitSize;
    if (price !== undefined) updateData.price = price;
    if (description) updateData.description = description;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (wholesaler only)
// @access  Private (Wholesaler)
router.delete('/:id', auth, isWholesaler, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if product belongs to this wholesaler
    if (product.wholesaler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this product' 
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all available categories
// @access  Private
router.get('/categories/list', auth, async (req, res) => {
  try {
    const categories = [
      'Rice & Grains',
      'Pulses',
      'FMCG',
      'Snacks',
      'Oil',
      'Spices',
      'Beverages',
      'Dairy',
      'Cleaning',
      'Personal Care',
      'Other'
    ];

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
