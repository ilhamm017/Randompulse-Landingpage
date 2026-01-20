# Randompulse Website - Node.js Refactor

A modern, responsive affiliate landing page built with **Node.js**, **Express**, and **Sequelize**.

## Features
- **Frontend**: Lightweight HTML/CSS/JS (served statically).
- **Backend**: Express.js server with SQLite database.
- **Scraping**: Server-side scraping (`axios` + `cheerio`) for resolving affiliate redirects (Shopee, Tokopedia, TikTok).
- **Admin**: "Auto-Fill" feature to fetch product metadata automatically.

## Directory Structure
- `server/`: Backend code (API, Database, Scraper).
- `public/`: Frontend static files (HTML, Assets).
- `public/assets`: CSS, JS, and Images.

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
- `POST /api/scrape`: Extract metadata from URL (handles redirects).
