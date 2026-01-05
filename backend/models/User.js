const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['retailer', 'wholesaler'],
    required: true
  },
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    area: String,
    city: String
  },
  // Wholesaler specific fields
  businessName: {
    type: String,
    required: function() { return this.role === 'wholesaler'; }
  },
  categoriesSupplied: [{
    type: String
  }],
  // Retailer specific fields
  shopSize: {
    type: String,
    enum: ['small', 'medium', 'large'],
    required: function() { return this.role === 'retailer'; }
  },
  preferredCategories: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
