const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const targets = [
    { name: 'shopee', url: 'https://id.shp.ee/EMd8qqS' },
    { name: 'tokopedia', url: 'https://tk.tokopedia.com/ZSaYDT245/' },
    // User wrote vt.tokopedia.com, checking if it works. If generic, we handle it.
    { name: 'tiktok', url: 'https://vt.tokopedia.com/t/ZSHoqHN39JrCq-vWsl0/' }
];

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-blink-features=AutomationControlled']
    });

    for (const target of targets) {
        console.log(`Analyzing ${target.name}: ${target.url}`);
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        await page.setViewport({ width: 1366, height: 768 });

        try {
            await page.goto(target.url, { waitUntil: 'networkidle2', timeout: 60000 });

            const finalUrl = page.url();
            console.log(`  -> Redirected to: ${finalUrl}`);

            // Screenshot
            const screenshotPath = path.join(__dirname, `../../public/debug_${target.name}.png`);
            await page.screenshot({ path: screenshotPath });
            console.log(`  -> Screenshot: ${screenshotPath}`);

            // Dump Content (Title, Meta, First 1000 chars of body text)
            const content = await page.content();
            const dumpPath = path.join(__dirname, `../../public/debug_${target.name}.html`);
            fs.writeFileSync(dumpPath, content);
            console.log(`  -> HTML Saved: ${dumpPath}`);

        } catch (e) {
            console.error(`  -> Failed: ${e.message}`);
        } finally {
            await page.close();
        }
    }

    await browser.close();
})();
