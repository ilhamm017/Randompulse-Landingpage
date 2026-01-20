const { Product } = require('../database');

// Service for Product DB Operations
const getAllProducts = async () => {
    return await Product.findAll({ order: [['createdAt', 'DESC']] });
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
};

const createProduct = async (data) => {
    // Basic validation could go here
    return await Product.create(data);
};

const deleteProduct = async (id) => {
    return await Product.destroy({ where: { id } });
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    deleteProduct
};
