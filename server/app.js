const express = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const scrapeRoutes = require('./routes/scrapeRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/scrape', scrapeRoutes);

// Static Asset Serving
// Serves files from the 'public' directory located one level up
app.use(express.static(path.join(__dirname, '../public')));

// Fallback Route (SPA Support)
// Matches any route not handled above and returns index.html
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
