/**
 * Server Entry Point
 * Imports the configured App and Database connection.
 * Starts the HTTP server.
 */
const app = require('./app');
const { sequelize } = require('./database');
const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Sync Database (Create tables if needed)
        await sequelize.sync();
        console.log('Database synced successfully.');

        // Start Listening
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
    }
};

startServer();
