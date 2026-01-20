const scrapeService = require('../services/scrapeService');

const scrapeUrl = async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ error: 'URL is required' });

        const data = await scrapeService.scrapeUrl(url);
        res.json({ status: 'success', data });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

module.exports = { scrapeUrl };
