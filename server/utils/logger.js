const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'app.log');

const getTimestamp = () => new Date().toISOString();

const log = (level, message, meta = {}) => {
    const timestamp = getTimestamp();
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    const logLine = `[${timestamp}] [${level}] ${message} ${metaStr}\n`;

    // Write to file
    fs.appendFileSync(logFile, logLine);

    // Write to console
    const color = level === 'ERROR' ? '\x1b[31m' : level === 'WARN' ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    console.log(`${color}[${timestamp}] [${level}]${reset} ${message}`, metaStr ? meta : '');
};

module.exports = {
    info: (msg, meta) => log('INFO', msg, meta),
    error: (msg, meta) => log('ERROR', msg, meta),
    warn: (msg, meta) => log('WARN', msg, meta),
    debug: (msg, meta) => log('DEBUG', msg, meta),
    clear: () => fs.writeFileSync(logFile, '')
};
