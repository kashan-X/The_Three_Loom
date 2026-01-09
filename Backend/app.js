// app.js
//require('dotenv').config();             // if you keep DB/PW/PORT in .env

const express = require('express');
const cors = require('cors');

const authRoute = require('./routes/authRoute');
const productRoute = require('./routes/productRoute');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const app = express();
const PORT = process.env.PORT || 8000;

/* ---------- global middleware ---------- */
app.use(cors());                         // allow cross-origin requests
app.use(express.json());                 // <-- parses application/json
app.use(express.urlencoded({ extended: true })); // parses form bodies
app.use('/images', express.static('public/images'));

/* ---------- routes ---------- */
app.use('/auth', authRoute);
app.use('/product', productRoute);
app.use('/order', orderRoutes);


/* Admin */
app.use('/admin', adminRoutes);

/* ---------- 404 handler ---------- */
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ---------- error handler (keep LAST) ---------- */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

/* ---------- start server ---------- */
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
