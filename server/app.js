const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./modules/products/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// API Routes
app.use('/api/products', productRoutes);

// Static Asset Serving
// Serves files from the 'public' directory inside server
app.use(express.static(path.join(__dirname, './public')));

// Fallback Route (SPA Support)
// Matches any route not handled above and returns index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

module.exports = app;
