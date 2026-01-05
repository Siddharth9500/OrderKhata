const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
// @desc    Register new user (retailer or wholesaler)
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile').trim().notEmpty().withMessage('Mobile number is required')
    .matches(/^[0-9]{10}$/).withMessage('Mobile number must be 10 digits'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['retailer', 'wholesaler']).withMessage('Role must be retailer or wholesaler'),
  body('shopName').trim().notEmpty().withMessage('Shop name is required'),
  body('location.area').trim().notEmpty().withMessage('Area is required'),
  body('location.city').trim().notEmpty().withMessage('City is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { name, mobile, password, role, shopName, location, businessName, categoriesSupplied, shopSize, preferredCategories } = req.body;

    // Check if user already exists
    let user = await User.findOne({ mobile });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this mobile number already exists' 
      });
    }

    // Create user object
    const userData = {
      name,
      mobile,
      password,
      role,
      shopName,
      location
    };

    // Add role-specific fields
    if (role === 'wholesaler') {
      userData.businessName = businessName;
      userData.categoriesSupplied = categoriesSupplied || [];
    } else if (role === 'retailer') {
      userData.shopSize = shopSize;
      userData.preferredCategories = preferredCategories || [];
    }

    // Create new user
    user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        shopName: user.shopName,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during signup' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('mobile').trim().notEmpty().withMessage('Mobile number is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { mobile, password } = req.body;

    // Find user
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        shopName: user.shopName,
        location: user.location,
        businessName: user.businessName,
        categoriesSupplied: user.categoriesSupplied,
        shopSize: user.shopSize,
        preferredCategories: user.preferredCategories
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP (placeholder for future implementation)
// @access  Public
router.post('/verify-otp', async (req, res) => {
  // This is a placeholder for OTP verification
  // In production, integrate with SMS gateway like Twilio, MSG91, etc.
  res.json({
    success: true,
    message: 'OTP verification endpoint - to be implemented with SMS gateway'
  });
});

module.exports = router;
