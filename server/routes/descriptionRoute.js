const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");



router.get('/:patentId/:paraId', async (req, res) => {
  const { patentId, paraId } = req.params;
  try {
    const url = `https://patents.google.com/patent/${patentId}/en`;
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const descriptionHTML = $('#description').html();
    const paragraphs = [];

    if (descriptionHTML) {
      const $desc = cheerio.load(descriptionHTML);

      $desc('p').each((i, el) => {
        const text = $desc(el).text().trim();
        if (text.startsWith(`[${paraId}]`)) {
          paragraphs.push(text);
        }
      });
    }

    if (paragraphs.length === 0) {
      return res.status(404).json({ error: `Paragraph [${paraId}] not found.` });
    }
    res.json({
      patentId,
      paraId,
      content: paragraphs,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Error fetching or parsing patent data.' });
  }
});

module.exports = router;