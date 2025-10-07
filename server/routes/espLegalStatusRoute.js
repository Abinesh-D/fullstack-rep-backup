const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("qs");
const xml2js = require("xml2js");

require("dotenv").config();

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

  const data = qs.stringify({ grant_type: "client_credentials" });
  
  const response = await axios.post(tokenUrl, data, { headers });

  cachedToken = response.data.access_token;
  tokenExpiry = now + (18 * 60 * 1000) - 30 * 1000;

  return cachedToken;
}

function removeKindCodeFunct(patentNumber) {
  return patentNumber.replace(/[A-Z]\d?$/, '');
}

router.get("/:patentNumber", async (req, res) => {
  const { patentNumber } = req.params;
  if (!patentNumber) {
    return res.status(400).json({ error: "Patent number is required" });
  }
  try {
    const endpNumber = removeKindCodeFunct(patentNumber);

    const token = await getAccessToken();
    const legalUrl = `https://ops.epo.org/3.2/rest-services/legal/publication/epodoc/${endpNumber}`;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/xml"
    };

    const legalStatusResponse = await axios.get(legalUrl, { headers });
    
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });

     const legalStatusData = await new Promise((resolve, reject) => {
      parser.parseString(legalStatusResponse.data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    res.status(200).json({
      legalStatusData: legalStatusData,
    });

  } catch (error) {
    const errMessage = error.response?.data || error.message;
    console.error("🔴 Failed to fetch data:", errMessage);
    res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
  }
});

module.exports = router;