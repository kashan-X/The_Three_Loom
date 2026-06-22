const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    whatsappNumber: { type: String },
    shippingMethod: { type: String, default: 'Standard' },
    paymentMethod: { type: String, default: 'cod' },
    billingAddress: { type: String, default: 'same' },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);