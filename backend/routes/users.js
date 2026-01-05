const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/wholesalers
// @desc    Get all wholesalers
// @access  Private (Retailer)
router.get('/wholesalers', auth, async (req, res) => {
  try {
    const { city, category } = req.query;
    
    // Build query
    let query = { role: 'wholesaler', isActive: true };
    
    if (city) {
      query['location.city'] = city;
    }
    
    if (category) {
      query.categoriesSupplied = category;
    }

    const wholesalers = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: wholesalers.length,
      wholesalers
    });
  } catch (error) {
    console.error('Get wholesalers error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/users/wholesaler/:id
// @desc    Get single wholesaler details
// @access  Private
router.get('/wholesaler/:id', auth, async (req, res) => {
  try {
    const wholesaler = await User.findOne({ 
      _id: req.params.id, 
      role: 'wholesaler' 
    }).select('-password');

    if (!wholesaler) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wholesaler not found' 
      });
    }

    res.json({
      success: true,
      wholesaler
    });
  } catch (error) {
    console.error('Get wholesaler error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, shopName, location, businessName, categoriesSupplied, shopSize, preferredCategories } = req.body;
    
    const updateData = {};
    
    if (name) updateData.name = name;
    if (shopName) updateData.shopName = shopName;
    if (location) updateData.location = location;
    
    if (req.user.role === 'wholesaler') {
      if (businessName) updateData.businessName = businessName;
      if (categoriesSupplied) updateData.categoriesSupplied = categoriesSupplied;
    }
    
    if (req.user.role === 'retailer') {
      if (shopSize) updateData.shopSize = shopSize;
      if (preferredCategories) updateData.preferredCategories = preferredCategories;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
