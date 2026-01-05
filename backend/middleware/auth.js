const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Check if user is retailer
const isRetailer = (req, res, next) => {
  if (req.user.role !== 'retailer') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Retailer only.' 
    });
  }
  next();
};

// Check if user is wholesaler
const isWholesaler = (req, res, next) => {
  if (req.user.role !== 'wholesaler') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Wholesaler only.' 
    });
  }
  next();
};

module.exports = { auth, isRetailer, isWholesaler };
