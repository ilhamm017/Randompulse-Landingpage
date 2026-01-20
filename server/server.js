/**
 * Server Entry Point
 * Imports the configured App and Database connection.
 * Starts the HTTP server.
 */
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./database');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Sync Database (Create tables if needed)
        await sequelize.sync();
        console.log('Database synced successfully.');

        const [columns] = await sequelize.query("PRAGMA table_info('Products')");
        const hasProductNumber = columns.some((col) => col.name === 'productNumber');
        if (!hasProductNumber) {
            console.log('Adding productNumber column...');
            await sequelize.query('ALTER TABLE Products ADD COLUMN productNumber INTEGER');
        }
        const hasImages = columns.some((col) => col.name === 'images');
        if (!hasImages) {
            console.log('Adding images column...');
            await sequelize.query('ALTER TABLE Products ADD COLUMN images TEXT');
        }
        const [missing] = await sequelize.query("SELECT COUNT(*) as count FROM Products WHERE productNumber IS NULL");
        if (missing[0]?.count) {
            console.log('Backfilling productNumber...');
            await sequelize.query(`
                WITH ranked AS (
                    SELECT id, ROW_NUMBER() OVER (ORDER BY createdAt ASC) AS rn
                    FROM Products
                )
                UPDATE Products
                SET productNumber = (
                    SELECT rn FROM ranked WHERE ranked.id = Products.id
                )
            `);
        }
        const [missingImages] = await sequelize.query("SELECT COUNT(*) as count FROM Products WHERE images IS NULL AND image IS NOT NULL");
        if (missingImages[0]?.count) {
            console.log('Backfilling images from image...');
            await sequelize.query(`
                UPDATE Products
                SET images = json_array(image)
                WHERE images IS NULL AND image IS NOT NULL
            `);
        }

        // Start Listening
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();
