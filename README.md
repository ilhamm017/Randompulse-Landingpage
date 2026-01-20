# Randompulse Website - Node.js Refactor

A modern, responsive affiliate landing page built with **Node.js**, **Express**, and **Sequelize**.

## Features
- **Frontend**: Lightweight HTML/CSS/JS (served statically).
- **Backend**: Express.js server with SQLite database.
- **Admin**: Simple admin form to add products.

## Directory Structure
- `server/`: Backend code (API, Database).
- `server/modules/`: Feature modules (routes, controllers, services).
- `server/public/`: Frontend static files (HTML, Assets).
- `server/public/assets`: CSS, JS, and Images.

## How to Run
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000` in your browser.

## API Endpoints
- `GET /api/products`: List all products.
