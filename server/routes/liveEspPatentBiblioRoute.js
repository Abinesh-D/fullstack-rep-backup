const express = require("express");
const router = express.Router();
const { getPatentData } = require("../utils/patentService");

router.get("/:patentNumber", async (req, res) => {
  const { patentNumber } = req.params;
  const { type } = req.query;

  if (!patentNumber) {
    return res.status(400).json({ error: "Patent number is required" });
  }
  try {
    const patentData = await getPatentData(patentNumber, type || "relevant");

    if (!patentData) {
      return res.status(404).json({ error: "Patent data not found" });
    }
    res.json(patentData);
  } catch (error) {
    console.error(`🔴 Error fetching ${patentNumber}:`, error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch bibliographic or family data." });
  }
});

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const { getPatentData } = require("../utils/patentService");

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;
//   const { type } = req.query;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const patentData = await getPatentData(patentNumber, type);
//     res.status(200).json(patentData);
//   } catch (error) {
//     console.error(`🔴 Error in /patents/${patentNumber}`, error.message);
//     res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
//   }
// });

// module.exports = router;










// const express = require("express");
// const router = express.Router();
// const { getPatentData } = require("../utils/patentService");

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const patentData = await getPatentData(patentNumber);

//     res.status(200).json(patentData);
//   } catch (error) {
//     console.error(`🔴 Error in /patents/${patentNumber}`, error.message);
//     res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
//   }
// });

// module.exports = router;













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

// async function getAccessToken(retryCount = 0) {
//   const now = Date.now();
//   if (cachedToken && tokenExpiry && now < tokenExpiry) {
//     return cachedToken;
//   }

//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   try {
//     const response = await axios.post(tokenUrl, qs.stringify({ grant_type: "client_credentials" }), {
//       headers: {
//         Authorization: `Basic ${auth}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       timeout: 5000,
//     });

//     cachedToken = response.data.access_token;
//     tokenExpiry = now + (18 * 60 * 1000) - (60 * 1000);

//     return cachedToken;
//   } catch (error) {
//     if (retryCount < 2) {
//       return await getAccessToken(retryCount + 1);
//     }
//     throw new Error("Failed to get access token");
//   }
// };

// function formatPatentNumberWithDot(patentNumber) {
//   if (!patentNumber) return "";

//   let formatted = patentNumber;

//   if (formatted.startsWith("WO19")) {
//     formatted = formatted.split('').filter((_, i) => ![2, 3, 6].includes(i)).join('');
//   }
//   else if (formatted.length === 14) {
//     return formatted;
//   }
//   else if (formatted.startsWith("US") && formatted.length > 13) {
//     formatted = formatted.split('').filter((_, i) => i !== 6).join('');
//   }

//   const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
//   const match = formatted.match(regex);

//   if (match) {
//     const base = match[1];
//     const kind = match[2];

//     if (/^[A-Z]+$/i.test(kind)) {
//       return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
//     }

//     return `${base}.${kind}`;
//   }

//   return formatted;
// };

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);

//     const token = await getAccessToken();
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml",
//     };

//     const [biblioResponse,
//       familyResponse
//     ] = await Promise.all([axios.get(biblioUrl, { headers }),
//     axios.get(familyUrl, { headers }),
//     ]
//     );

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const biblioData = await parser.parseStringPromise(biblioResponse.data);
//     const familyData = await parser.parseStringPromise(familyResponse.data);

//     res.status(200).json({
//       patentNumber,
//       biblio: biblioData,
//       familyData,
//     });

//   } catch (error) {
//     const status = error.response?.status;
//     const errData = error.response?.data;
//     console.error(`🔴 Error fetching data for ${patentNumber} | Status: ${status}`, errData || error.message);
//     res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
//   }

// });

// module.exports = router;