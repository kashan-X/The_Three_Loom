const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    subCategory: {
      type: String,
      enum: ['Summer', 'Winter', 'Spring', 'Autumn'],
      default: 'Summer'
    },
    sizes: { type: [String], default: [] },   // real array now, no more JSON.stringify
    colors: { type: [String], default: [] },  // real array now
    images: { type: [String], default: [] },  // real array now
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);