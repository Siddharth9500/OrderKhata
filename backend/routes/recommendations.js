const express = require('express');
const router = express.Router();
const { auth, isRetailer } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Smart recommendation rules based on product categories and common patterns
const recommendationRules = {
  'Rice & Grains': ['Pulses', 'Oil', 'Spices'],
  'Pulses': ['Rice & Grains', 'Oil', 'Spices'],
  'Oil': ['Rice & Grains', 'Spices', 'Pulses'],
  'Snacks': ['Beverages', 'FMCG'],
  'Beverages': ['Snacks', 'FMCG'],
  'FMCG': ['Snacks', 'Beverages', 'Personal Care'],
  'Dairy': ['Beverages', 'FMCG'],
  'Spices': ['Rice & Grains', 'Pulses', 'Oil'],
  'Cleaning': ['Personal Care'],
  'Personal Care': ['Cleaning', 'FMCG']
};

// @route   POST /api/recommendations/suggest
// @desc    Get smart recommendations based on current cart items
// @access  Private (Retailer)
router.post('/suggest', auth, isRetailer, async (req, res) => {
  try {
    const { wholesalerId, currentItems } = req.body;

    if (!currentItems || currentItems.length === 0) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    // Get product details for current items
    const currentProducts = await Product.find({
      _id: { $in: currentItems }
    });

    // Extract categories from current items
    const currentCategories = [...new Set(currentProducts.map(p => p.category))];

    // Get recommended categories based on rules
    const recommendedCategories = new Set();
    currentCategories.forEach(category => {
      if (recommendationRules[category]) {
        recommendationRules[category].forEach(rec => recommendedCategories.add(rec));
      }
    });

    // Remove categories already in cart
    currentCategories.forEach(cat => recommendedCategories.delete(cat));

    if (recommendedCategories.size === 0) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    // Get products from recommended categories
    let recommendedProducts = await Product.find({
      wholesaler: wholesalerId,
      category: { $in: Array.from(recommendedCategories) },
      _id: { $nin: currentItems },
      isAvailable: true
    }).limit(10);

    // Enhance with frequency data from past orders
    const pastOrders = await Order.find({
      retailer: req.user._id,
      wholesaler: wholesalerId
    }).limit(20);

    // Calculate frequency of products ordered together
    const frequencyMap = {};
    pastOrders.forEach(order => {
      const orderProductIds = order.items.map(item => item.product.toString());
      const hasCurrentItem = orderProductIds.some(id => 
        currentItems.some(currentId => currentId === id)
      );
      
      if (hasCurrentItem) {
        orderProductIds.forEach(productId => {
          if (!currentItems.includes(productId)) {
            frequencyMap[productId] = (frequencyMap[productId] || 0) + 1;
          }
        });
      }
    });

    // Sort recommended products by frequency
    recommendedProducts = recommendedProducts.map(product => ({
      ...product.toObject(),
      frequency: frequencyMap[product._id.toString()] || 0
    })).sort((a, b) => b.frequency - a.frequency);

    res.json({
      success: true,
      message: 'You may have missed these items',
      count: recommendedProducts.length,
      recommendations: recommendedProducts
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recommendations/frequently-ordered-together
// @desc    Get products frequently ordered together with a specific product
// @access  Private
router.get('/frequently-ordered-together/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find all orders containing this product
    const orders = await Order.find({
      'items.product': productId,
      retailer: req.user._id
    }).limit(50);

    if (orders.length === 0) {
      return res.json({
        success: true,
        recommendations: []
      });
    }

    // Count frequency of other products in these orders
    const frequencyMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const itemProductId = item.product.toString();
        if (itemProductId !== productId) {
          frequencyMap[itemProductId] = (frequencyMap[itemProductId] || 0) + 1;
        }
      });
    });

    // Sort by frequency and get top products
    const sortedProducts = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId, frequency]) => ({ productId, frequency }));

    // Get product details
    const productIds = sortedProducts.map(p => p.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const recommendations = products.map(product => {
      const freq = sortedProducts.find(p => p.productId === product._id.toString());
      return {
        ...product.toObject(),
        frequency: freq.frequency,
        orderedTogetherTimes: freq.frequency
      };
    });

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Get frequently ordered together error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recommendations/popular
// @desc    Get popular products from a wholesaler based on order history
// @access  Private
router.get('/popular/:wholesalerId', auth, async (req, res) => {
  try {
    const { wholesalerId } = req.params;
    
    // Get recent orders from this wholesaler
    const orders = await Order.find({
      wholesaler: wholesalerId
    }).limit(100);

    if (orders.length === 0) {
      return res.json({
        success: true,
        popularProducts: []
      });
    }

    // Count product frequency
    const frequencyMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.toString();
        frequencyMap[productId] = (frequencyMap[productId] || 0) + item.quantity;
      });
    });

    // Get top 15 products
    const topProductIds = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([productId]) => productId);

    const popularProducts = await Product.find({
      _id: { $in: topProductIds }
    });

    res.json({
      success: true,
      count: popularProducts.length,
      popularProducts
    });
  } catch (error) {
    console.error('Get popular products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/recommendations/my-frequent-items
// @desc    Get retailer's most frequently ordered items
// @access  Private (Retailer)
router.get('/my-frequent-items', auth, isRetailer, async (req, res) => {
  try {
    const { wholesalerId } = req.query;
    
    let query = { retailer: req.user._id };
    if (wholesalerId) {
      query.wholesaler = wholesalerId;
    }

    const orders = await Order.find(query).limit(50);

    if (orders.length === 0) {
      return res.json({
        success: true,
        frequentItems: []
      });
    }

    // Count product frequency
    const frequencyMap = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = item.product.toString();
        if (!frequencyMap[productId]) {
          frequencyMap[productId] = {
            count: 0,
            totalQuantity: 0,
            productName: item.productName,
            brand: item.brand
          };
        }
        frequencyMap[productId].count += 1;
        frequencyMap[productId].totalQuantity += item.quantity;
      });
    });

    // Get top items
    const frequentItems = Object.entries(frequencyMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20)
      .map(([productId, data]) => ({
        productId,
        ...data
      }));

    res.json({
      success: true,
      count: frequentItems.length,
      frequentItems
    });
  } catch (error) {
    console.error('Get frequent items error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
