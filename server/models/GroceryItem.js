const mongoose = require('mongoose');

const groceryItemSchema = new mongoose.Schema({
  // Reference to the user who owns this item
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    enum: ['Grains', 'Dairy', 'Vegetables', 'Fruits', 'Beverages', 'Snacks', 'Meat', 'Frozen', 'Spices', 'Other'],
    default: 'Other',
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity cannot be negative'],
    default: 0,
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'L', 'ml', 'pcs', 'dozen', 'pack'],
    default: 'pcs',
  },
  minStock: {
    type: Number,
    default: 2,
    min: 0,
  },
  expiryDate: {
    type: Date,
    default: null,
  },
  price: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

module.exports = mongoose.model('GroceryItem', groceryItemSchema);