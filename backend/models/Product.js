const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  wholesaler: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
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
    ]
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'gram', 'liter', 'ml', 'packet', 'carton', 'piece']
  },
  unitSize: {
    type: Number,
    default: 1
  },
  price: {
    type: Number,
    min: 0
  },
  description: String,
  isAvailable: {
    type: Boolean,
    default: true
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
productSchema.index({ wholesaler: 1, category: 1 });
productSchema.index({ name: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);
