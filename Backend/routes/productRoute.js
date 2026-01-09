const express = require('express');
const router = express.Router();
const { showAllProducts, showSingleProduct ,showSingleProductBYID,showAllProductsByCategory, createProduct, deleteProduct, updateProduct} = require('../controllers/Products.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.get('/all_Products', showAllProducts);
router.get('/single_Product', showSingleProduct);
router.get('/single_Product/:id', showSingleProductBYID);
router.get('/Product_by_Category/:category', showAllProductsByCategory);
router.post('/create_Products',authMiddleware, createProduct);
router.delete('/delete_Product/:id', authMiddleware,deleteProduct);
router.put('/update_Product/:id', authMiddleware,updateProduct);

module.exports = router;
