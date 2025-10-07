const express = require("express");
const router = express.Router();
const { lingaTranslateText } = require("../utils/lingvaServiceTranslator"); 

router.post("/bulk", async (req, res) => {
    try {
        const { text } = req.body;
        console.log('bulktext', text)
        if (!text) return res.status(400).json({ error: "No text provided" });

        const translated = await lingaTranslateText(text);
        res.json({ translated });
    } catch (err) {
        console.error("Translation API error:", err);
        res.status(500).json({ error: "Translation failed" });
    }
});

module.exports = router;
