const puppeteer = require('puppeteer');
const path = require('path');
const logger = require('../utils/logger');

// Helper to launch browser with stealthier args
const launchBrowser = async () => {
    logger.info('Launching Puppeteer browser...');
    return await puppeteer.launch({
        headless: 'new',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-blink-features=AutomationControlled',
            '--window-size=1920,1080',
            '--disable-infobars',
            '--disable-dev-shm-usage', // Handle memory issues
            '--limit-fps=30' // Reduce CPU usage
        ]
    });
};

const scrapeShopee = async (page) => {
    logger.info('Analyzing Shopee page...');
    // Wait for selectors specific to Shopee
    try {
        await page.waitForSelector('.attM6y, .product-briefing, h1', { timeout: 15000 });
        logger.info('Shopee selector found!');
    } catch (e) {
        logger.warn('Shopee selector timeout (might still have JSON-LD)');
    }

    return await page.evaluate(() => {
        // Try JSON-LD first
        let json = {};
        try {
            const scripts = document.querySelectorAll('script[type="application/ld+json"]');
            for (let s of scripts) {
                const c = JSON.parse(s.innerText);
                if (c['@type'] === 'Product' || c.offers) {
                    json = c;
                    break;
                }
            }
        } catch (e) { }

        const getMeta = (p) => document.querySelector(`meta[property="${p}"]`)?.content || document.querySelector(`meta[name="${p}"]`)?.content || '';

        const title = json.name || document.querySelector('.attM6y span')?.innerText || getMeta('og:title') || document.title;
        const description = json.description || getMeta('og:description') || '';
        let image = json.image || getMeta('og:image');
        if (Array.isArray(image)) image = image[0];

        let price = '';
        if (json.offers) {
            const offer = Array.isArray(json.offers) ? json.offers[0] : json.offers;
            price = (offer.priceCurrency || 'Rp') + ' ' + (offer.price || '');
        } else {
            // Shopee Price Selector (Class names change often, better to rely on meta if possible)
            price = document.querySelector('.flex.items-center.text-sp-orange')?.innerText || '';
        }

        const isUnavailable = document.body.innerText.includes('Halaman Tidak Tersedia');
        return { title, description, image, price, isUnavailable };
    });
};

const scrapeTokopedia = async (page) => {
    logger.info('Analyzing Tokopedia page...');
    // Wait for selectors
    try {
        await page.waitForSelector('[data-testid="lblPDPDetailProductName"], h1', { timeout: 15000 });
        logger.info('Tokopedia selector found!');
    } catch (e) {
        logger.warn('Tokopedia selector timeout');
    }

    return await page.evaluate(() => {
        const getMeta = (p) => document.querySelector(`meta[property="${p}"]`)?.content || document.querySelector(`meta[name="${p}"]`)?.content || '';

        const title = document.querySelector('[data-testid="lblPDPDetailProductName"]')?.innerText || getMeta('og:title') || document.title;
        const description = getMeta('og:description') || '';
        const image = getMeta('og:image');
        const price = document.querySelector('[data-testid="lblPDPDetailProductPrice"]')?.innerText || '';

        return { title, description, image, price };
    });
};

const scrapeTikTok = async (page) => {
    logger.info('Analyzing TikTok page...');
    try {
        await page.waitForSelector('h1', { timeout: 15000 });
        logger.info('TikTok selector found!');
    } catch (e) {
        logger.warn('TikTok selector timeout');
    }

    return await page.evaluate(() => {
        const getMeta = (p) => document.querySelector(`meta[property="${p}"]`)?.content || document.querySelector(`meta[name="${p}"]`)?.content || '';
        return {
            title: getMeta('og:title') || document.title,
            description: getMeta('og:description') || '',
            image: getMeta('og:image') || '',
            price: '' // TikTok needs specific verification
        };
    });
};

const scrapeUrl = async (targetUrl) => {
    let browser = null;
    logger.info(`Starting scrape for: ${targetUrl}`);
    try {
        browser = await launchBrowser();
        const page = await browser.newPage();

        // Optimize: Block images/css to speed up loading and reduce timeouts
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // High-Quality User Agent
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1920, height: 1080 });

        logger.info('Navigating to Page...');
        // Navigate
        await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 }); // domcontentloaded is faster than networkidle2
        logger.info('Page Navigation Complete (DOM Content Loaded)');

        // Wait a bit for JS to execute (since we used domcontentloaded)
        await new Promise(r => setTimeout(r, 2000));

        // Debug Screenshot
        const debugPath = path.join(__dirname, '../../public/debug.png');
        await page.screenshot({ path: debugPath });
        logger.info(`Debug screenshot saved: ${debugPath}`);

        const finalUrl = page.url();
        logger.info(`Final URL: ${finalUrl}`);
        let data = {};

        if (finalUrl.includes('shopee') || finalUrl.includes('shp.ee')) {
            data = await scrapeShopee(page);
        } else if (finalUrl.includes('tokopedia')) {
            data = await scrapeTokopedia(page);
        } else if (finalUrl.includes('tiktok')) {
            // Note: vt.tokopedia.com often redirects to TikTok or Tokopedia Video. Logic handles both if domain changes.
            data = await scrapeTikTok(page);
        } else {
            logger.info('Using Generic Fallback');
            // Generic Fallback
            data = await page.evaluate(() => ({
                title: document.title,
                description: document.querySelector('meta[name="description"]')?.content || '',
                image: document.querySelector('meta[property="og:image"]')?.content || '',
                price: ''
            }));
        }

        if (data.isUnavailable) {
            throw new Error('Halaman Tidak Tersedia (Anti-Bot detected)');
        }

        logger.info('Scraping Result:', data);

        return {
            title: (data.title || '').trim(),
            description: (data.description || '').trim(),
            image: (data.image || '').trim(),
            price: (data.price || '').trim(),
            url: finalUrl
        };

    } catch (error) {
        logger.error(`Scrape Error: ${error.message}`, { stack: error.stack });
        throw new Error(`Gagal scraping (${error.message}). Cek debug.png`);
    } finally {
        if (browser) {
            logger.info('Closing Browser...');
            await browser.close();
        }
    }
};

module.exports = { scrapeUrl };
