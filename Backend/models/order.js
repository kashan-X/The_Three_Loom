const mongoose = require('mongoose');

// One line item within an order (one product + its quantity/price at time of purchase)
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: { type: String, required: true },     // snapshot of product name at order time
  price: { type: Number, required: true },    // snapshot of price at order time
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, required: true }
}, { _id: false });

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

    items: {
      type: [orderItemSchema],
      required: true,
      validate: [arr => arr.length > 0, 'Order must contain at least one item']
    },

    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Rejected'],
      default: 'Pending'
    },

    totalPrice: { type: Number, required: true }, // sum of all line items

    // ── Payment screenshot (Easypaisa / JazzCash) ──────────────────────────────
    paymentScreenshot: { type: String, default: null },   // filename saved on disk
    paymentVerified:   { type: Boolean, default: false }, // set true when admin approves

    // ── Rejection tracking ─────────────────────────────────────────────────────
    rejectedAt:     { type: Date, default: null },
    rejectionReason:{ type: String, default: null },

    // Cancellation tracking
    cancelledAt: { type: Date, default: null },
    cancellationPenalty: { type: Number, default: 0 },
    cancellationPenaltyApplied: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);