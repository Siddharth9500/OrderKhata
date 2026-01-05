const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: String,
  brand: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unit: String,
  price: Number
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  retailer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  status: {
    type: String,
    enum: ['pending', 'seen', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  seenAt: Date,
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const count = await mongoose.model('Order').countDocuments();
      const date = new Date();
      const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
      this.orderNumber = `ORD${dateStr}${String(count + 1).padStart(4, '0')}`;
    } catch (err) {
      console.error('Error generating order number:', err);
    }
  }
  
  // Calculate totals
  this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.totalAmount = this.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
  
  next();
});

// Index for faster queries
orderSchema.index({ retailer: 1, createdAt: -1 });
orderSchema.index({ wholesaler: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
