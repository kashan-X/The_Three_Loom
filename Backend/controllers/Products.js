const Product = require('../models/product');

const showAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    // No more JSON.parse needed — images/sizes/colors are already real arrays in MongoDB
    res.status(200).json({
      status: 'Success',
      data: products,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

const showSingleProduct = async (req, res) => {
  try {
    const { name, category } = req.body;
    const product = await Product.findOne({ name, category });

    if (product) {
      res.status(200).json({ status: 'Success', data: product });
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

    const product = await Product.findById(id);

    if (product) {
      res.status(200).json({ status: 'Success', data: product });
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

    if (!category) {
      return res.status(400).json({ status: 'Fail', error: 'Category parameter is required' });
    }

    const products = await Product.find({ category });

    if (products.length > 0) {
      res.status(200).json({ status: 'Success', data: products });
    } else {
      res.status(404).json({ status: 'Fail', error: 'No products found in this category' });
    }
  } catch (err) {
    res.status(500).json({ status: 'Error', message: 'Server error', error: err.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isFeatured, sizes, colors, images } = req.body;

    // sizes/colors/images are stored as real arrays now — no JSON.stringify needed.
    // If the frontend sends them as actual arrays (e.g. ["S","M","L"]), this works as-is.
    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      isFeatured,
      sizes,
      colors,
      images,
    });

    res.status(201).json({
      status: 'Success',
      message: 'Product created successfully',
      data: {
        productId: newProduct._id,
        ...newProduct.toObject()
      }
    });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to create product',
      message: err.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.deleteOne();
    res.status(200).json({ status: 'Success', message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', message: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // sizes/colors/images are real arrays now — no stringify step needed
    Object.assign(product, updates);
    await product.save();

    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (error) {
    res.status(500).json({ error: 'Error updating product', message: error.message });
  }
};

module.exports = {
  showAllProducts,
  showSingleProduct,
  showSingleProductBYID,
  createProduct,
  deleteProduct,
  updateProduct,
  showAllProductsByCategory
};