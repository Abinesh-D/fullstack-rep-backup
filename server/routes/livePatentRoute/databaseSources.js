const express = require("express");
const router = express.Router();
const DatabaseSource = require("../../models/cln_keystrings_database_name");

// /keystrings/sources - fetch all sources
router.get("/", async (req, res) => {
    try {
        const docs = await DatabaseSource.find();

        const allSources = docs.reduce((acc, doc) => {
            if (doc.sources && Array.isArray(doc.sources)) {
                acc.push(...doc.sources);
            }
            return acc;
        }, []);

        res.json(allSources);
    } catch (err) {
        console.error("Error fetching sources:", err);
        res.status(500).json({ error: err.message });
    }
});



// keystrings/sources/add - add new source
router.post("/add", async (req, res) => {
    try {
        const { value } = req.body;
        if (!value) {
            return res.status(400).json({ error: "Value is required" });
        }

        const updatedDoc = await DatabaseSource.findOneAndUpdate(
            {},
            { $push: { sources: { value, label: value } } },
            { new: true, upsert: true } 
        );

        res.json(updatedDoc);
    } catch (err) {
        console.error("Error adding database:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
