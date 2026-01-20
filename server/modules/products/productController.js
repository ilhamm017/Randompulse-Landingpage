const productService = require('./productService');

const getAllProducts = async (req, res) => {
    try {
        const searchTerm = (req.query.q || '').trim();
        const page = Math.max(parseInt(req.query.page || '1', 10), 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit || '24', 10), 1), 100);
        const result = await productService.getProductsPaged({ searchTerm, page, limit });
        res.json({
            items: result.rows,
            total: result.count,
            page,
            limit
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const productNumber = req.body.productNumber || await productService.getNextProductNumber();
        const images = Array.isArray(req.body.images) ? req.body.images.slice(0, 5) : [];
        const image = req.body.image || images[0] || '';
        const productData = {
            id: req.body.id || Date.now().toString(),
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image,
            images: images.length ? images : null,
            link: req.body.link,
            productNumber
        };
        const newProduct = await productService.createProduct(productData);
        res.json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProductsBulk = async (req, res) => {
    try {
        const items = Array.isArray(req.body) ? req.body : [];
        if (items.length === 0) {
            res.status(400).json({ error: 'Items array is required' });
            return;
        }
        if (items.length > 2000) {
            res.status(400).json({ error: 'Too many items' });
            return;
        }
        const created = await productService.createProductsBulk(items);
        res.json({ created: created.length });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const images = Array.isArray(req.body.images) ? req.body.images.slice(0, 5) : [];
        const image = req.body.image || images[0] || '';
        const productData = {
            name: req.body.name,
            price: req.body.price,
            description: req.body.description,
            image,
            images: images.length ? images : null,
            link: req.body.link
        };
        const updated = await productService.updateProduct(req.params.id, productData);
        if (!updated) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    createProductsBulk,
    updateProduct,
    deleteProduct
};
