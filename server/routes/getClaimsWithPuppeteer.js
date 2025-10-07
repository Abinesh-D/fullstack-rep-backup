const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

router.get('/:patentNumber', async (req, res) => {
  const { patentNumber } = req.params;
  const url = `https://patents.google.com/patent/${patentNumber}/en`;

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    await page.waitForSelector('section#claims patent-text');

    const data = await page.evaluate(() => {

      const claims = document.querySelectorAll('section#claims patent-text');

      return { claims };
    });

    await browser.close();
    res.json({ ...data });
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Failed to fetch patent data' });
  }
});

module.exports = router;
