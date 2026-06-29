// controllers/Products.js
const Product = require('../models/product');
const CategoryDiscount = require('../models/categoryDiscount');

// Helper: build a map of { category -> discountPercent } for all active discounts
const getActiveDiscountMap = async () => {
  const discounts = await CategoryDiscount.find({ active: true });
  const map = {};
  discounts.forEach(d => { map[d.category] = d.discountPercent; });
  return map;
};

// Helper: attach discountedPrice to a product plain object
const applyDiscount = (product, discountMap) => {
  const obj = product.toObject ? product.toObject() : { ...product };
  const pct = discountMap[obj.category];
  if (pct && pct > 0) {
    obj.discountPercent = pct;
    obj.discountedPrice = Math.round(obj.price * (1 - pct / 100));
  } else {
    obj.discountPercent = 0;
    obj.discountedPrice = obj.price;
  }
  return obj;
};

const showAllProducts = async (req, res) => {
  try {
    const [products, discountMap] = await Promise.all([
      Product.find(),
      getActiveDiscountMap()
    ]);
    res.status(200).json({
      status: 'Success',
      data: products.map(p => applyDiscount(p, discountMap))
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const showSingleProduct = async (req, res) => {
  try {
    const { name, category } = req.body;
    const [product, discountMap] = await Promise.all([
      Product.findOne({ name, category }),
      getActiveDiscountMap()
    ]);
    if (product) {
      res.status(200).json({ status: 'Success', data: applyDiscount(product, discountMap) });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const showSingleProductBYID = async (req, res) => {
  try {
    const { id } = req.params;
    const [product, discountMap] = await Promise.all([
      Product.findById(id),
      getActiveDiscountMap()
    ]);
    if (product) {
      res.status(200).json({ status: 'Success', data: applyDiscount(product, discountMap) });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const showAllProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const { subCategory } = req.query;

    if (!category) {
      return res.status(400).json({ status: 'Fail', error: 'Category parameter is required' });
    }

    const filter = { category };
    if (subCategory) filter.subCategory = subCategory;

    const [products, discountMap] = await Promise.all([
      Product.find(filter),
      getActiveDiscountMap()
    ]);

    if (products.length > 0) {
      res.status(200).json({ status: 'Success', data: products.map(p => applyDiscount(p, discountMap)) });
    } else {
      res.status(404).json({ status: 'Fail', error: 'No products found in this category' });
    }
  } catch (err) {
    res.status(500).json({ status: 'Error', message: 'Server error', error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, stock, isFeatured, sizes, colors, images } = req.body;
    const newProduct = await Product.create({ name, description, price, category, subCategory, stock, isFeatured, sizes, colors, images });
    res.status(201).json({
      status: 'Success',
      message: 'Product created successfully',
      data: { productId: newProduct._id, ...newProduct.toObject() }
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product', message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.deleteOne();
    res.status(200).json({ status: 'Success', message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    Object.assign(product, req.body);
    await product.save();
    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product', message: error.message });
  }
};

module.exports = {
  showAllProducts, showSingleProduct, showSingleProductBYID,
  createProduct, deleteProduct, updateProduct, showAllProductsByCategory
};