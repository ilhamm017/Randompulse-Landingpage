# Public Directory (Frontend)

This directory contains the static files served by the Node.js backend.

## Structure
- `index.html`: The main landing page / gallery.
- `detail.html`: Product detail page.
- `admin.html`: Admin dashboard for managing products.
- `assets/`: CSS, JS, and Image resources.
- `logo/`: Contains the site logo.

## Notes
- `app.js` has been updated to fetch data from the `/api` endpoints provided by the server.
- Do not run these HTML files directly via file protocol (`file:///`); they must be served by the Node.js server to function correctly.
