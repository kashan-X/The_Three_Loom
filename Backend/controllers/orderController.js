// controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/product');
const CategoryDiscount = require('../models/categoryDiscount');
const { sendOrderConfirmation, sendStatusUpdate, sendCancellationEmail, sendPaymentRejectionEmail } = require('../services/emailService');

const CANCELLATION_WINDOW_HOURS = 24;
const LATE_CANCELLATION_PENALTY_RATE = 0.20;

exports.createOrder = async (req, res) => {
  try {
    // Debug — remove after confirming uploads work
    console.log('[createOrder] req.file  :', req.file  || 'NO FILE');
    console.log('[createOrder] req.body  :', { ...req.body, items: req.body.items?.slice(0, 60) + '…' });

    const {
      email, fullName, phoneNumber, address, city,
      whatsappNumber, shippingMethod = 'Standard',
      paymentMethod = 'cod', billingAddress = 'same', items,
    } = req.body;

    // items arrives as a JSON string when submitted via FormData — parse it first
    let parsedItems;
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch {
      return res.status(400).json({ error: 'Invalid items format' });
    }

    if (!email || !fullName || !phoneNumber || !address || !city ||
      !parsedItems || !Array.isArray(parsedItems) || parsedItems.length === 0) {
      return res.status(400).json({ error: 'Missing required fields or empty cart' });
    }

    // For online payment, a screenshot is required
    if (paymentMethod === 'online' && !req.file) {
      return res.status(400).json({ error: 'Payment screenshot is required for online payment.' });
    }

    // Load all active discounts once upfront
    const activeDiscounts = await CategoryDiscount.find({ active: true });
    const discountMap = {};
    activeDiscounts.forEach(d => { discountMap[d.category] = d.discountPercent; });

    const orderItems = [];
    let totalPrice = 0;

    for (const item of parsedItems) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: `Product not found: ${item.productId}` });
      if (!item.quantity || item.quantity < 1) return res.status(400).json({ error: 'Each item must have a valid quantity' });
      if (product.stock <= 0) return res.status(400).json({ error: `"${product.name}" is sold out and cannot be ordered.` });
      if (item.quantity > product.stock) return res.status(400).json({ error: `Only ${product.stock} unit(s) of "${product.name}" left in stock.` });

      const discountPct = discountMap[product.category] || 0;
      const effectivePrice = discountPct > 0
        ? Math.round(product.price * (1 - discountPct / 100))
        : product.price;

      const lineItem = {
        productId: product._id,
        name: product.name,
        price: effectivePrice,
        size: item.size || '',
        color: item.color || '',
        quantity: item.quantity
      };

      orderItems.push(lineItem);
      totalPrice += effectivePrice * item.quantity;
    }

    const order = await Order.create({
      customerEmail: email, fullName, phoneNumber, address, city,
      whatsappNumber, shippingMethod, paymentMethod, billingAddress,
      items: orderItems, totalPrice,
      paymentScreenshot: req.file ? req.file.filename : null,
      paymentVerified: false,
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, { $inc: { stock: -item.quantity } });
    }

    sendOrderConfirmation(order).catch(err => console.error('Confirmation email failed:', err));

    return res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      id: order._id,
      fullName: order.fullName,
      product: order.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
      itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
      items: order.items,
      totalPrice: order.totalPrice,
      phoneNumber: order.phoneNumber,
      whatsappNumber: order.whatsappNumber,
      billingAddress: order.billingAddress,
      city: order.city,
      email: order.customerEmail,
      status: order.status,
      paymentMethod: order.paymentMethod,
      paymentScreenshot: order.paymentScreenshot,
      paymentVerified: order.paymentVerified,
      rejectedAt: order.rejectedAt,
      rejectionReason: order.rejectionReason,
      cancellationPenalty: order.cancellationPenalty,
      cancellationPenaltyApplied: order.cancellationPenaltyApplied,
      cancelledAt: order.cancelledAt,
      createdAt: order.createdAt,
    }));
    return res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await order.deleteOne();
    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const { fullName, phoneNumber, address, city, whatsappNumber, shippingMethod, paymentMethod, billingAddress, status } = req.body;
    const allowed = { fullName, phoneNumber, address, city, whatsappNumber, shippingMethod, paymentMethod, billingAddress, status };
    Object.entries(allowed).forEach(([key, val]) => { if (val !== undefined) order[key] = val; });

    await order.save();

    if (status) {
      sendStatusUpdate(order).catch(err => console.error('Status email failed:', err));
    }

    return res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Approve payment (admin) ───────────────────────────────────────────────────
// Sets paymentVerified = true and moves status to Processing
exports.approvePayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ error: 'Only Pending orders can be approved.' });

    order.paymentVerified = true;
    order.status = 'Processing';
    await order.save();

    sendStatusUpdate(order).catch(err => console.error('Status email failed:', err));

    return res.status(200).json({ message: 'Payment approved. Order is now Processing.', order });
  } catch (error) {
    console.error('Error approving payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Reject payment (admin) ────────────────────────────────────────────────────
// Marks order Rejected, keeps it in DB, and sends fraud/invalid payment email
exports.rejectPayment = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.status !== 'Pending') return res.status(400).json({ error: 'Only Pending orders can be rejected.' });

    const { reason } = req.body; // optional rejection note from admin

    order.status = 'Rejected';
    order.rejectedAt = new Date();
    order.rejectionReason = reason || 'Payment could not be verified.';
    await order.save();

    sendPaymentRejectionEmail(order).catch(err => console.error('Rejection email failed:', err));

    return res.status(200).json({ message: 'Order marked as Rejected.', order });
  } catch (error) {
    console.error('Error rejecting payment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const email = req.user.email;
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
      id: order._id,
      items: order.items,
      itemCount: order.items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: order.totalPrice,
      status: order.status,
      city: order.city,
      address: order.address,
      paymentMethod: order.paymentMethod,
      paymentVerified: order.paymentVerified,
      createdAt: order.createdAt,
      cancelledAt: order.cancelledAt,
      cancellationPenalty: order.cancellationPenalty,
      cancellationPenaltyApplied: order.cancellationPenaltyApplied,
      rejectedAt: order.rejectedAt,
      rejectionReason: order.rejectionReason,
    }));
    return res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching customer order history:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user.email;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customerEmail !== email) return res.status(403).json({ error: 'You are not authorised to cancel this order' });
    if (order.status === 'Cancelled') return res.status(400).json({ error: 'This order has already been cancelled' });
    if (order.status === 'Delivered') return res.status(400).json({ error: 'Delivered orders cannot be cancelled' });
    if (order.status === 'Shipped') return res.status(400).json({ error: 'Order has already been shipped and cannot be cancelled' });
    if (order.status === 'Rejected') return res.status(400).json({ error: 'Rejected orders cannot be cancelled' });

    const now = new Date();
    const orderAge = (now - new Date(order.createdAt)) / (1000 * 60 * 60);
    const isWithinFreeWindow = orderAge <= CANCELLATION_WINDOW_HOURS;
    const penalty = isWithinFreeWindow ? 0 : Math.round(order.totalPrice * LATE_CANCELLATION_PENALTY_RATE);

    order.status = 'Cancelled';
    order.cancelledAt = now;
    order.cancellationPenalty = penalty;
    order.cancellationPenaltyApplied = penalty > 0;

    await order.save();
    sendCancellationEmail(order).catch(err => console.error('Cancellation email failed:', err));

    return res.status(200).json({
      message: 'Order cancelled successfully',
      cancellationPenaltyApplied: penalty > 0,
      cancellationPenalty: penalty,
      note: penalty > 0
        ? `A 20% late cancellation penalty of Rs. ${penalty} applies.`
        : 'No penalty applied — order was cancelled within 24 hours.',
      order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCancelPreview = async (req, res) => {
  try {
    const { id } = req.params;
    const email = req.user.email;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.customerEmail !== email) return res.status(403).json({ error: 'Not authorised' });
    if (['Cancelled', 'Delivered', 'Shipped', 'Rejected'].includes(order.status)) {
      return res.status(400).json({ error: `Order cannot be cancelled (status: ${order.status})` });
    }

    const now = new Date();
    const orderAgeHours = (now - new Date(order.createdAt)) / (1000 * 60 * 60);
    const isWithinFreeWindow = orderAgeHours <= CANCELLATION_WINDOW_HOURS;
    const penalty = isWithinFreeWindow ? 0 : Math.round(order.totalPrice * LATE_CANCELLATION_PENALTY_RATE);

    return res.status(200).json({
      orderId: order._id,
      totalPrice: order.totalPrice,
      orderAgeHours: Math.round(orderAgeHours * 10) / 10,
      isWithinFreeWindow,
      cancellationPenalty: penalty,
      message: isWithinFreeWindow
        ? 'You can cancel this order for free — still within the 24-hour window.'
        : `This order was placed more than 24 hours ago. A 20% penalty of Rs. ${penalty} will apply.`
    });
  } catch (error) {
    console.error('Error fetching cancel preview:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerSummary = async (req, res) => {
  try {
    const orders = await Order.find({}, 'customerEmail fullName phoneNumber');
    const summaryMap = {};
    orders.forEach(order => {
      const email = order.customerEmail;
      if (!summaryMap[email]) summaryMap[email] = { name: order.fullName, phone: order.phoneNumber, count: 0 };
      summaryMap[email].count += 1;
    });
    const summaryList = Object.entries(summaryMap).map(([email, data]) => {
      const { name, phone, count } = data;
      let category = count > 50 ? 'Super List' : count > 30 ? 'Excellent List' : count > 10 ? 'Good List' : 'Regular';
      return { email, name, phone, orders: count, category };
    });
    return res.json({ customers: summaryList });
  } catch (err) {
    console.error('Error generating summary:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};