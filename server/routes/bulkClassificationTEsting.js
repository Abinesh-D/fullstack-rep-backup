const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");
require("dotenv").config();
const { extractClassificationTitle } = require("../utils/classificationParser");


const router = express.Router();

const CONSUMER_KEY = process.env.CLIENT_KEY;
const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken() {
    const now = Date.now();
    if (cachedToken && tokenExpiry && now < tokenExpiry) {
        return cachedToken;
    }

    const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

    const headers = {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded"
    };

    const data = new URLSearchParams({ grant_type: "client_credentials" });
    const response = await axios.post(tokenUrl, data, { headers });

    cachedToken = response.data.access_token;
    tokenExpiry = now + (18 * 60 * 1000) - 30 * 1000;

    return cachedToken;
}

router.get("/static-classifications", async (req, res) => {
    const { classifyNumber } = req.query;

    const isArray = Array.isArray(classifyNumber);
    const symbolNumber = isArray ? classifyNumber : classifyNumber.split(",") || [];

    try {
        const token = await getAccessToken(0, true);
        const headers = {
            Authorization: `Bearer ${token}`,
            Accept: "application/xml"
        };

        const results = await Promise.all(
            symbolNumber.map(async (symbol) => {
                try {
                    const classifyUrl = `https://ops.epo.org/3.2/rest-services/classification/cpc/${symbol}`;

                    const classify = await axios.get(classifyUrl, { headers });

                    const parser = new xml2js.Parser({
                        explicitArray: false,
                        tagNameProcessors: [xml2js.processors.stripPrefix]
                    });

                    const parsedData = await parser.parseStringPromise(classify.data);
                    const title = extractClassificationTitle(parsedData);

                    return {
                        symbol,
                        title,
                        // classifyData: parsedData,
                        success: true
                    };
                } catch (err) {
                    console.error(`🔴 Error for symbol ${symbol}:`, err?.response?.data || err.message);
                    return {
                        symbol,
                        success: false,
                        error: err?.response?.data || err.message
                    };
                }
            })
        );

        res.status(200).json({ results });

    } catch (error) {
        console.error("🔴 Error fetching static classifications:", error?.response?.data || error.message);
        res.status(500).json({ error: "Failed to fetch static classification data" });
    }
});

module.exports = router;