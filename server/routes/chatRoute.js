const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const cohereRequest = {
    model: "command-r",
    stream: false,
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 0.3,
  };

  try {
    const cohereResponse = await axios.post(
      "https://api.cohere.com/v2/chat",
      cohereRequest,
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(cohereResponse.data);
  } catch (error) {
    console.error("Cohere Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Cohere API call failed." });
  }
});

module.exports = router;
