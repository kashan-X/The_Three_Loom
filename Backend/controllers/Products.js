const Product = require('../models').Product;


const showAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    const parsedProducts = products.map((product) => {
      const prod = product.toJSON();
      return {
        ...prod,
        images: JSON.parse(prod.images || '[]'),
      };
    });

    res.status(200).json({
      status: 'Success',
      data: parsedProducts,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};


const showSingleProduct = async (req, res) => {
  try {
    const { name, category } = req.body;
    const product = await Product.findOne({ where: { name, category } });

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

    const product = await Product.findByPk(id); 

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

    // Fetch all products with matching category
    const products = await Product.findAll({
      where: { category }
    });

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

    const newProduct = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      isFeatured,
      sizes: JSON.stringify(sizes),
      colors: JSON.stringify(colors),
      images: JSON.stringify(images),
    });

    res.status(201).json({
      status: 'Success',
      message: 'Product created successfully',
      data: {
        productId: newProduct.id,
        ...newProduct.toJSON()
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
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await product.destroy();
    res.status(200).json({ status: 'Success', message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product', message: err.message });
  }
};


const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }


    if (updates.sizes) updates.sizes = JSON.stringify(updates.sizes);
    if (updates.colors) updates.colors = JSON.stringify(updates.colors);
    if (updates.images) updates.images = JSON.stringify(updates.images);

    await product.update(updates);

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
