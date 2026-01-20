/**
 * Database Configuration
 * Uses SQLite for a lightweight, serverless database.
 * Defines the 'Product' model for storing affiliate items.
 */
const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false // Disable logging for cleaner console
});

// Define Product Model
const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false
    },
    productNumber: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

module.exports = { sequelize, Product };
