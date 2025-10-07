const express = require("express");
const {translate} = require("@vitalets/google-translate-api");
const router = express.Router();

router.post("/", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const result = await translate(text, { to: "en" });
        res.json({
            success: true,
            originalText: text,
            translatedText: result,
            detectedLang: result,
            to: "en",
        });
    } catch (err) {
        console.error("Translation error:", err);
        res.status(500).json({ error: "Translation failed" });
    }
});

module.exports = router;









// const express = require("express");
// const router = express.Router();
// const translate = require("google-translate-api-x");

// router.post("/", async (req, res) => {
//     const { text } = req.body;

//     if (!text) {
//         return res.status(400).json({ error: "Text is required" });
//     }

//     try {
//         const result = await translate(text, { to: "en" });
//         res.json({
//             success: true,
//             originalText: text,
//             translatedText: result.text,
//             detectedLang: result.from.language.iso, 
//             to: "en",
//         });
//     } catch (err) {
//         console.error("Translation error:", err);
//         res.status(500).json({ error: "Translation failed" });
//     }
// });

// module.exports = router;
