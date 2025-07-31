const express = require("express");
const router = express.Router();
const cln_feedback_patentnumber_schema = require("../../models/livePatentScema/cln_feedback_patentnumber_schema");







router.post("/save", async (req, res) => {
    const { patentNumber, submittedBy } = req.body;

    if (!patentNumber || patentNumber.trim() === "") {
        return res.status(400).json({ message: " Patent number is required" });
    }
    if (!submittedBy || submittedBy.trim() === "") {
        return res.status(400).json({ message: " Submitted by (name) is required" });
    }

    try {
        const feedback = new cln_feedback_patentnumber_schema({
            feedbackPatentNumber: patentNumber.trim(),
            submittedBy: submittedBy.trim(),
        });

        await feedback.save();

        res.status(201).json({
            message: " Feedback submitted successfully",
            feedback,
        });
    } catch (err) {
        console.error(" Error saving feedback:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

router.get("/fetch", async (req, res) => {
    try {
        const feedback = await cln_feedback_patentnumber_schema.findOne();
        res.status(200).json(feedback || { feedbackPatentNumber: [] });
    } catch (err) {
        console.error(" Error fetching feedback:", err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});







module.exports = router;