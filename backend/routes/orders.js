const express = require('express');
const router = express.Router();
const { auth, isRetailer, isWholesaler } = require('../middleware/auth');
const Order = require('../models/Order');
const Product = require('../models/Product');

// @route   POST /api/orders
// @desc    Create new order (retailer only)
// @access  Private (Retailer)
router.post('/', auth, isRetailer, async (req, res) => {
  try {
    const { wholesalerId, items, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order must contain at least one item' 
      });
    }

    // Validate and enrich items with product details
    const enrichedItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          message: `Product ${item.productId} not found` 
        });
      }
      
      enrichedItems.push({
        product: product._id,
        productName: product.name,
        brand: product.brand,
        quantity: item.quantity,
        unit: product.unit,
        price: product.price
      });
    }

    // Create order without orderNumber (it will be auto-generated)
    const order = new Order({
      retailer: req.user._id,
      wholesaler: wholesalerId,
      items: enrichedItems,
      notes,
      orderNumber: undefined // Let pre-save hook generate it
    });

    await order.save();

    // Populate order details
    await order.populate('retailer', 'name shopName mobile location');
    await order.populate('wholesaler', 'shopName businessName mobile');

    // Send SMS notification to wholesaler
    try {
      const wholesalerMobile = order.wholesaler.mobile;
      const retailerName = order.retailer.name;
      const retailerShop = order.retailer.shopName;
      const totalItems = order.totalItems;
      
      // SMS notification message
      const smsMessage = `New Order Alert! ${retailerName} (${retailerShop}) has placed an order with ${totalItems} items. Order #${order.orderNumber}. Check OrderKhata portal for details.`;
      
      console.log('📱 SMS Notification:');
      console.log(`To: ${wholesalerMobile}`);
      console.log(`Message: ${smsMessage}`);
      console.log('Note: SMS integration requires Twilio/MSG91 setup');
      
      // TODO: Integrate SMS API (Twilio/MSG91)
      // Example with Twilio:
      // await twilioClient.messages.create({
      //   body: smsMessage,
      //   to: wholesalerMobile,
      //   from: process.env.TWILIO_PHONE_NUMBER
      // });
    } catch (smsError) {
      console.error('SMS notification error:', smsError);
      // Don't fail the order if SMS fails
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Server error' 
    });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get orders for logged in user (retailer sees sent orders, wholesaler sees received orders)
// @access  Private
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    // Set query based on user role
    if (req.user.role === 'retailer') {
      query.retailer = req.user._id;
    } else if (req.user.role === 'wholesaler') {
      query.wholesaler = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('retailer', 'name shopName mobile location')
      .populate('wholesaler', 'shopName businessName mobile')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      orders
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('retailer', 'name shopName mobile location')
      .populate('wholesaler', 'shopName businessName mobile')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if user has access to this order
    const userId = req.user._id.toString();
    if (order.retailer._id.toString() !== userId && order.wholesaler._id.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this order' 
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status (wholesaler only)
// @access  Private (Wholesaler)
router.put('/:id/status', auth, isWholesaler, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['seen', 'processing', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    // Check if order belongs to this wholesaler
    if (order.wholesaler.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this order' 
      });
    }

    order.status = status;
    if (status === 'seen' && !order.seenAt) {
      order.seenAt = Date.now();
    }
    order.updatedAt = Date.now();

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   POST /api/orders/:id/reorder
// @desc    Create a new order from an existing order (retailer only)
// @access  Private (Retailer)
router.post('/:id/reorder', auth, isRetailer, async (req, res) => {
  try {
    const originalOrder = await Order.findById(req.params.id);

    if (!originalOrder) {
      return res.status(404).json({ 
        success: false, 
        message: 'Original order not found' 
      });
    }

    // Check if order belongs to this retailer
    if (originalOrder.retailer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to reorder this order' 
      });
    }

    // Create new order with same items
    const newOrder = new Order({
      retailer: req.user._id,
      wholesaler: originalOrder.wholesaler,
      items: originalOrder.items,
      notes: req.body.notes || `Reorder of ${originalOrder.orderNumber}`
    });

    await newOrder.save();

    await newOrder.populate('retailer', 'name shopName mobile location');
    await newOrder.populate('wholesaler', 'shopName businessName mobile');

    res.status(201).json({
      success: true,
      message: 'Reorder placed successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// @route   GET /api/orders/stats/summary
// @desc    Get order statistics for logged in user
// @access  Private
router.get('/stats/summary', auth, async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'retailer') {
      query.retailer = req.user._id;
    } else if (req.user.role === 'wholesaler') {
      query.wholesaler = req.user._id;
    }

    const total = await Order.countDocuments(query);
    const pending = await Order.countDocuments({ ...query, status: 'pending' });
    const completed = await Order.countDocuments({ ...query, status: 'completed' });

    res.json({
      success: true,
      stats: {
        total,
        pending,
        completed
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router;
