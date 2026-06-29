// models/categoryDiscount.js
const mongoose = require('mongoose');

const categoryDiscountSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      unique: true,   // one discount record per category
      trim: true
    },
    discountPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CategoryDiscount', categoryDiscountSchema);