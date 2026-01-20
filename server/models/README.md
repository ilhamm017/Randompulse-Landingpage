# Server Models

This directory contains the database schema definitions used by Sequelize.

## Files
- `../database.js`: Main configuration file that initializes the SQLite connection and defines the models.

## Models
### Product
Represents an affiliate product item.
- `id`: Unique string ID (timestamp based).
- `name`: Product title.
- `price`: Display price (e.g., "Rp 50.000").
- `description`: Product details.
- `image`: URL to the product image.
- `link`: Affiliate link (Shopee/Tokopedia/TikTok).
