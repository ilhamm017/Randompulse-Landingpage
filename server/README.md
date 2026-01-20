# Server Directory

This folder contains the Node.js backend code.

## Files
- `server.js`: The main entry point. Sets up Express, API routes, and database parsing.
- `database.js`: SQLite connection and Model definitions.

## Subdirectories
- `modules/`: Feature modules (routes, controllers, services per domain).
- `models/`: Database schema documentation.
- `utils/`: Helper scripts.

## How to Run
From the project root:
```bash
npm start
# or
node server/server.js
```
The server will start on port 3000.
