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



router.get("/:classifyNumber", async (req, res) => {
  const { classifyNumber } = req.params;

  if (!classifyNumber) {
    return res.status(400).json({ error: "Classification number is required" });
  }

  try {
    const token = await getAccessToken();
    
    const ClassifyUrl = `https://ops.epo.org/3.2/rest-services/classification/cpc/${classifyNumber}`;
    const cpcFullDataUrl = `https://ops.epo.org/3.2/rest-services/classification/cpc/${classifyNumber}?ancestors=true&navigation=true&depth=all`

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/xml"
    };


    const [classify, cpcFullData] = await Promise.all([
      axios.get(ClassifyUrl, { headers }),
      axios.get(cpcFullDataUrl, { headers }),

    ])
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });

    const parsedData = await parser.parseStringPromise(classify.data);
    const cpcFullConvertedData = await parser.parseStringPromise(cpcFullData.data);

    res.status(200).json({ classifyData: parsedData, cpcFullData: cpcFullConvertedData });

  } catch (error) {
    console.error("🔴 Error fetching classification:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch classification data", });
  }
});

module.exports = router;
















// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");

// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null; 

// async function getAccessToken() {
//   const now = Date.now();
//   console.log(now, tokenExpiry, 'now')

//   if (cachedToken && tokenExpiry && now < tokenExpiry) {
//     console.log('cachedToken',cachedToken, tokenExpiry)
//     return cachedToken;
//   }

//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });
  
//   const response = await axios.post(tokenUrl, data, { headers });

//   console.log('Access Tocken',response.data.access_token)
  
//   cachedToken = response.data.access_token;
//   tokenExpiry = now + (18 * 60 * 1000) - 30 * 1000;

//   return cachedToken;
// }


// router.get("/:classifyNumber", async (req, res) => {
//   const { classifyNumber } = req.params;
//   console.log(classifyNumber, 'classifyNumber')
//   if (!classifyNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }
//   try {

//     const token = await getAccessToken();
//     const CPCUrl = `https://ops.epo.org/3.2/rest-services/classification/cpc/${classifyNumber}`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml"
//     };

//     const classifyResponse = await axios.get(CPCUrl, { headers });

//     console.log('classifyResponse :>> ', classifyResponse);
    
//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix]
//     });

//      const classifyData = await new Promise((resolve, reject) => {
//       parser.parseString(classifyResponse.data, (err, result) => {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });

//     res.status(200).json({
//       classifyData: classifyData,
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Failed to fetch data:", errMessage);
//     res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
//   }
// });

// module.exports = router;