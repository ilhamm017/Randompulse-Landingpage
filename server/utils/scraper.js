/**
 * Scraper Utility
 * Handles fetching HTML from URLs and extracting OpenGraph metadata.
 * Uses a real User-Agent to mimic a browser and avoid some bot detection.
 */
const axios = require('axios');
const cheerio = require('cheerio');

const scrapeMetadata = async (targetUrl) => {
    try {
        console.log(`Scraping: ${targetUrl}`);

        // 1. Fetch the HTML
        // We use a common User-Agent to avoid immediate blocking
        const response = await axios.get(targetUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,id;q=0.8'
            },
            maxRedirects: 10, // Follow shortlinks (shp.ee, etc)
            timeout: 10000
        });

        // 2. Load into Cheerio (jQuery-like parser)
        const $ = cheerio.load(response.data);

        // 3. Extract Metadata
        // Priority: OpenGraph > Twitter Card > Standard Meta > Fallback
        const title = $('meta[property="og:title"]').attr('content') ||
            $('title').text() ||
            '';

        const description = $('meta[property="og:description"]').attr('content') ||
            $('meta[name="description"]').attr('content') ||
            '';

        const image = $('meta[property="og:image"]').attr('content') ||
            $('meta[name="twitter:image"]').attr('content') ||
            '';

        console.log('Scraped Data:', { title, description, image });

        return {
            title: title.trim(),
            description: description.trim(),
            image: image.trim(),
            url: response.request.res.responseUrl || targetUrl // The final URL after redirects
        };

    } catch (error) {
        console.error('Scraping Error:', error.message);
        throw new Error('Gagal mengambil data dari URL tersebut.');
    }
};

module.exports = { scrapeMetadata };
