// controllers/categoryDiscountController.js
const CategoryDiscount = require('../models/categoryDiscount');
const Order = require('../models/order');
const { sendSaleAnnouncementBulk, sendSaleEndedBulk } = require('../services/emailService');

// Helper — get all unique customer emails from the Order collection
const getAllCustomerEmails = async () => {
  const orders = await Order.find({}, 'customerEmail');
  const unique = [...new Set(orders.map(o => o.customerEmail).filter(Boolean))];
  return unique;
};

// GET /category-discount/all
exports.getAllDiscounts = async (req, res) => {
  try {
    const discounts = await CategoryDiscount.find().sort({ category: 1 });
    return res.json({ discounts });
  } catch (err) {
    console.error('Error fetching discounts:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /category-discount/set — create or update, then email customers if active
exports.setDiscount = async (req, res) => {
  try {
    const { category, discountPercent, active = true } = req.body;

    if (!category || discountPercent === undefined) {
      return res.status(400).json({ error: 'category and discountPercent are required' });
    }
    if (discountPercent < 0 || discountPercent > 100) {
      return res.status(400).json({ error: 'discountPercent must be between 0 and 100' });
    }

    // Check if there was a previously active discount for this category
    const existing = await CategoryDiscount.findOne({ category });
    const wasActive = existing?.active ?? false;

    const discount = await CategoryDiscount.findOneAndUpdate(
      { category },
      { discountPercent, active },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send sale announcement email if discount is being activated
    if (active) {
      getAllCustomerEmails()
        .then(emails => {
          if (emails.length > 0) {
            return sendSaleAnnouncementBulk(emails, { category, discountPercent });
          }
        })
        .catch(err => console.error('Sale announcement emails failed:', err));
    }

    return res.status(200).json({ message: 'Discount saved', discount });
  } catch (err) {
    console.error('Error setting discount:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /category-discount/:category/toggle — flip active, email customers on both transitions
exports.toggleDiscount = async (req, res) => {
  try {
    const { category } = req.params;
    const record = await CategoryDiscount.findOne({ category });

    if (!record) {
      return res.status(404).json({ error: 'No discount found for this category' });
    }

    record.active = !record.active;
    await record.save();

    // Email customers based on the new state
    getAllCustomerEmails()
      .then(emails => {
        if (emails.length === 0) return;
        if (record.active) {
          return sendSaleAnnouncementBulk(emails, {
            category: record.category,
            discountPercent: record.discountPercent
          });
        } else {
          return sendSaleEndedBulk(emails, {
            category: record.category,
            discountPercent: record.discountPercent
          });
        }
      })
      .catch(err => console.error('Toggle discount emails failed:', err));

    return res.json({
      message: `Discount ${record.active ? 'activated' : 'deactivated'}`,
      discount: record
    });
  } catch (err) {
    console.error('Error toggling discount:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /category-discount/:category — remove discount, email customers that sale ended
exports.deleteDiscount = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch record before deleting so we have the discountPercent for the email
    const record = await CategoryDiscount.findOne({ category });

    await CategoryDiscount.findOneAndDelete({ category });

    // Only notify if the discount was active when removed
    if (record && record.active) {
      getAllCustomerEmails()
        .then(emails => {
          if (emails.length > 0) {
            return sendSaleEndedBulk(emails, {
              category: record.category,
              discountPercent: record.discountPercent
            });
          }
        })
        .catch(err => console.error('Sale ended emails failed:', err));
    }

    return res.json({ message: 'Discount removed' });
  } catch (err) {
    console.error('Error deleting discount:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};