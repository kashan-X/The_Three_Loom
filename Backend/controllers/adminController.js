// controllers/adminController.js
const { Product, Order, sequelize } = require('../models');
const { Op } = require('sequelize');
const { fn, col } = require('sequelize');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();

    const totalUsersResult = await Order.aggregate('customerEmail', 'DISTINCT', { plain: false });
    const totalUsers = totalUsersResult.length;

    const totalSalesResult = await Order.sum('totalPrice');
    const totalSales = Number(totalSalesResult) || 0;

    const categories = ['Men', 'Women', 'Children'];
    const categoryCounts = {};

    for (const cat of categories) {
      categoryCounts[cat] = await Product.count({ where: { category: cat } });
    }

    // 🧮 Monthly sales (for chartData)
    const monthlySalesRaw = await Order.findAll({
      attributes: [
        [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalPrice')), 'total']
      ],
      group: [sequelize.fn('MONTH', sequelize.col('createdAt'))],
      order: [[sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']]
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlySales = monthNames.map((name, index) => {
      const record = monthlySalesRaw.find(row => Number(row.dataValues.month) === index + 1);
      return {
        name,
        value: record ? Number(record.dataValues.total) : 0
      };
    });

    // 🧮 Sales by country (radarData)
    const countrySalesRaw = await Order.findAll({
      attributes: ['city', [fn('SUM', col('totalPrice')), 'total']],
      group: ['city']
    });

    const countrySales = countrySalesRaw.map(row => ({
      country: row.city || 'Unknown',
      year2025: Number(row.dataValues.total)
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
