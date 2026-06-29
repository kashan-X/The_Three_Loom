// app.js
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const connectDB = require('./config/db');

const authRoute             = require('./routes/authRoute');
const customerAuthRoute     = require('./routes/customerAuthRoute');
const productRoute          = require('./routes/productRoute');
const orderRoutes           = require('./routes/orderRoutes');
const adminRoutes           = require('./routes/adminRoutes');
const contactRoute          = require('./routes/contactRoute');
const categoryDiscountRoute = require('./routes/categoryDiscountRoute');

const app  = express();
const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/images',               express.static(path.join(__dirname, 'public', 'images')));
// Serve uploaded payment screenshots — must match SCREENSHOT_BASE in OrderTable.jsx
app.use('/payment-screenshots',  express.static(path.join(__dirname, 'public', 'Payment_Screenshots')));

app.use('/auth',              authRoute);
app.use('/customer',          customerAuthRoute);
app.use('/product',           productRoute);
app.use('/order',             orderRoutes);
app.use('/contact',           contactRoute);
app.use('/admin',             adminRoutes);
app.use('/category-discount', categoryDiscountRoute);

app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));