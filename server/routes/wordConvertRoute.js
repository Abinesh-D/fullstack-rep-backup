const express = require("express");
const htmlToDocx = require("html-to-docx");

const router = express.Router();

router.post("/convert", async (req, res) => {
    try {
        const { html, fileName } = req.body;
        console.log(html, fileName, "html, fileName")

        if (!html) {
            return res.status(400).json({ error: "HTML content is required" });
        }

        const fileBuffer = await htmlToDocx(html, null, {
            table: { row: { cantSplit: true } },
            footer: true,
            header: true,
        });

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${fileName || "output"}.docx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );

        res.send(fileBuffer);
    } catch (err) {
        console.error("❌ Error converting HTML to Word:", err);
        res.status(500).json({ error: "Conversion failed" });
    }
});

module.exports = router;
