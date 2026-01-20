# Public Directory (Frontend)

This directory contains the static files served by the Node.js backend.

## Structure
- `index.html`: The main landing page / gallery.
- `admin.html`: Admin dashboard for managing products.
- `assets/`: JS and image resources.
- `logo/`: Contains the site logo.

## Notes
- `assets/js/landing/index.js` powers the landing page.
- `assets/js/admin/index.js` powers the admin dashboard.
- Do not run these HTML files directly via file protocol (`file:///`); they must be served by the Node.js server to function correctly.
