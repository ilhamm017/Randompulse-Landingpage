const { Op } = require('sequelize');
const { Product, sequelize } = require('../../database');

// Service for Product DB Operations
const getNextProductNumber = async () => {
    const currentMax = await Product.max('productNumber');
    return (currentMax || 0) + 1;
};

const getAllProducts = async (searchTerm = '') => {
    const where = {};
    const numericSearch = Number.isFinite(Number(searchTerm)) ? Math.floor(Number(searchTerm)) : null;
    if (searchTerm) {
        where[Op.or] = [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
            { price: { [Op.like]: `%${searchTerm}%` } }
        ];
        if (numericSearch !== null) {
            where[Op.or].push({ productNumber: numericSearch });
        }
    }
    const order = numericSearch !== null
        ? [[sequelize.literal(`CASE WHEN productNumber = ${numericSearch} THEN 0 ELSE 1 END`), 'ASC'], ['productNumber', 'ASC']]
        : [['productNumber', 'ASC']];
    return await Product.findAll({ where, order });
};

const getProductsPaged = async ({ searchTerm = '', page = 1, limit = 24 }) => {
    const where = {};
    const numericSearch = Number.isFinite(Number(searchTerm)) ? Math.floor(Number(searchTerm)) : null;
    if (searchTerm) {
        where[Op.or] = [
            { name: { [Op.like]: `%${searchTerm}%` } },
            { description: { [Op.like]: `%${searchTerm}%` } },
            { price: { [Op.like]: `%${searchTerm}%` } }
        ];
        if (numericSearch !== null) {
            where[Op.or].push({ productNumber: numericSearch });
        }
    }
    const offset = (page - 1) * limit;
    const order = numericSearch !== null
        ? [[sequelize.literal(`CASE WHEN productNumber = ${numericSearch} THEN 0 ELSE 1 END`), 'ASC'], ['productNumber', 'ASC']]
        : [['productNumber', 'ASC']];
    return await Product.findAndCountAll({
        where,
        limit,
        offset,
        order
    });
};

const getProductById = async (id) => {
    return await Product.findByPk(id);
};

const createProduct = async (data) => {
    // Basic validation could go here
    return await Product.create(data);
};

const createProductsBulk = async (items) => {
    const next = await getNextProductNumber();
    const withNumbers = items.map((item, index) => ({
        ...item,
        productNumber: item.productNumber || next + index
    }));
    return await Product.bulkCreate(withNumbers, { validate: true });
};

const deleteProduct = async (id) => {
    return await Product.destroy({ where: { id } });
};

const updateProduct = async (id, data) => {
    const product = await Product.findByPk(id);
    if (!product) return null;
    return await product.update(data);
};

module.exports = {
    getAllProducts,
    getProductsPaged,
    getNextProductNumber,
    getProductById,
    createProduct,
    createProductsBulk,
    updateProduct,
    deleteProduct
};
