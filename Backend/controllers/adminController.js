// controllers/adminController.js
const Product = require('../models/product');
const Order = require('../models/order');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // distinct customer emails -> count of unique customers
    const distinctEmails = await Order.distinct('customerEmail');
    const totalUsers = distinctEmails.length;

    // sum of totalPrice across all orders
    const totalSalesAgg = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalSales = totalSalesAgg[0]?.total || 0;

    const categories = ['Men', 'Women', 'Children'];
    const categoryCounts = {};

    for (const cat of categories) {
      categoryCounts[cat] = await Product.countDocuments({ category: cat });
    }

    /* ---------- Monthly sales (for chartData) ---------- */
    // $month extracts the month number (1-12) directly from the createdAt date field.
    const monthlySalesRaw = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = monthNames.map((name, index) => {
      const record = monthlySalesRaw.find(row => row._id === index + 1);
      return {
        name,
        value: record ? record.total : 0
      };
    });

    /* ---------- Sales by city (radarData) ---------- */
    const citySalesRaw = await Order.aggregate([
      {
        $group: {
          _id: '$city',
          total: { $sum: '$totalPrice' }
        }
      }
    ]);

    const countrySales = citySalesRaw.map(row => ({
      country: row._id || 'Unknown',
      year2025: row.total
    }));

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalSales,
      categoryCounts,
      monthlySales,
      countrySales
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard stats' });
  }
};