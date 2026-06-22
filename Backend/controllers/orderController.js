// controllers/orderController.js
const Order = require('../models/order');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  try {
    /* ---------- destructure body ---------- */
    const {
      email,                       // keep this key name in JSON
      fullName,
      phoneNumber,
      address,
      city,
      whatsappNumber,
      shippingMethod = 'Standard',
      paymentMethod  = 'cod',
      billingAddress = 'same',
      productId,
      quantity,
      totalPrice
    } = req.body;

    /* ---------- basic validation ---------- */
    if (
      !email || !fullName || !phoneNumber || !address || !city ||
      !productId || !quantity || !totalPrice
    ) {
      console.log('Bad Request Payload:', req.body);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    /* ---------- make sure product exists ---------- */
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    /* ---------- create order ---------- */
    const order = await Order.create({
      customerEmail: email,
      fullName,
      phoneNumber,
      address,
      city,
      whatsappNumber,
      shippingMethod,
      paymentMethod,
      billingAddress,
      productId,
      quantity,
      totalPrice
    });

    return res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    // .populate('productId', 'name') is the Mongoose equivalent of Sequelize's `include`.
    // It replaces the productId (ObjectId) with the actual Product document (just the name field here).
    const orders = await Order.find()
      .populate('productId', 'name')
      .sort({ createdAt: -1 }); // -1 = DESC, same as your old order: [['createdAt','DESC']]

    const formattedOrders = orders.map(order => ({
      id:             order._id,
      fullName:       order.fullName,
      product:        order.productId?.name || 'Unknown',
      totalPrice:     order.totalPrice,
      quantity:       order.quantity,
      phoneNumber:    order.phoneNumber,
      whatsappNumber: order.whatsappNumber,
      billingAddress: order.billingAddress,
      city:           order.city,
      email:          order.customerEmail
    }));

    return res.status(200).json({ orders: formattedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /order/:id – Delete a specific order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.deleteOne();

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Prevent updating productId or customerEmail (sensitive fields)
    const {
      fullName,
      phoneNumber,
      address,
      city,
      whatsappNumber,
      shippingMethod,
      paymentMethod,
      billingAddress,
      quantity,
      totalPrice
    } = req.body;

    // Only update allowed fields
    Object.assign(order, {
      fullName,
      phoneNumber,
      address,
      city,
      whatsappNumber,
      shippingMethod,
      paymentMethod,
      billingAddress,
      quantity,
      totalPrice
    });

    await order.save();

    return res.status(200).json({
      message: 'Order updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCustomerSummary = async (req, res) => {
  try {
    const orders = await Order.find({}, 'customerEmail fullName phoneNumber');

    const summaryMap = {};

    orders.forEach(order => {
      const email = order.customerEmail;
      if (!summaryMap[email]) {
        summaryMap[email] = {
          name: order.fullName,
          phone: order.phoneNumber,
          count: 0,
        };
      }
      summaryMap[email].count += 1;
    });

    const summaryList = Object.entries(summaryMap).map(([email, data]) => {
      const { name, phone, count } = data;
      let category = '';

      if (count > 50) category = 'Super List';
      else if (count > 30) category = 'Excellent List';
      else if (count > 10) category = 'Good List';
      else category = 'Regular';

      return {
        email,
        name,
        phone,
        orders: count,
        category,
      };
    });

    return res.json({ customers: summaryList });
  } catch (err) {
    console.error('Error generating summary:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};