const express = require("express");
const router = express.Router();
const axios = require("axios");
const qs = require("qs");
const xml2js = require("xml2js");
require("dotenv").config();
const countryCodeMap = require("../utils/countryCodeMAp");

const CONSUMER_KEY = process.env.CLIENT_KEY;
const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

async function getAccessToken() {
  const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  const headers = {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded"
  };

  const data = qs.stringify({ grant_type: "client_credentials" });
  const response = await axios.post(tokenUrl, data, { headers });
  return response.data.access_token;
}

const getCountryCode = (patentNumber) => {
  const regex = /^[A-Za-z]+/;
  const match = patentNumber.match(regex);
  return match ? match[0] : null;
};

// function formatPatentNumberWithDot(patentNumber) {
//   if (patentNumber.includes('.')) {
//     return patentNumber;
//   }

//   if (patentNumber.startsWith('WO') && /^\d{4}/.test(patentNumber.slice(2))) {
//     const year2Digits = patentNumber.slice(4, 6); 
//     const rest = patentNumber.slice(8); 
//     patentNumber = 'WO' + year2Digits + rest;
//   }

//   const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;
//   const match = patentNumber.match(regex);
//   if (match) {
//     return `${match[1]}.${match[2]}`;
//   }

//   return patentNumber;
// }


function formatPatentNumberWithDot(patentNumber) {
  if (patentNumber.startsWith('WO20')) {
    return patentNumber;
  }
  if (patentNumber.startsWith('WO19')) {
    const indicesToRemove = [2, 3, 6];

    patentNumber = patentNumber
      .split('')
      .filter((_, i) => !indicesToRemove.includes(i))
      .join('');
  } else if (patentNumber.startsWith('US') && patentNumber.length > 13) {
    patentNumber = patentNumber
      .split('')
      .filter((_, i) => i !== 6)
      .join('');
  }

  const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;
  const match = patentNumber.match(regex);
  if (match) {
    return `${match[1]}.${match[2]}`;
  }
  return patentNumber;
}



router.get("/:patentNumber", async (req, res) => {
  const { patentNumber } = req.params;

  if (!patentNumber) {
    return res.status(400).json({ error: "Patent number is required" });
  }

  try {
    const formattedNumber = formatPatentNumberWithDot(patentNumber);

    const token = await getAccessToken();

    const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
    const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/xml"
    };

    const [biblioResponse, familyResponse] = await Promise.all([
      axios.get(biblioUrl, { headers }),
      axios.get(familyUrl, { headers })
    ]);

    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix]
    });

    const biblioData = await new Promise((resolve, reject) => {
      parser.parseString(biblioResponse.data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const familyData = await new Promise((resolve, reject) => {
      parser.parseString(familyResponse.data, (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });

    const patentOffice = getCountryCode(patentNumber);
    const countryCode = countryCodeMap[patentOffice] || 'Unknown';

    res.status(200).json({
      biblio: biblioData,
      patentNumber: patentNumber,
      country: countryCode,
      familyData: familyData
    });

  } catch (error) {
    const errMessage = error.response?.data || error.message;
    console.error("🔴 Failed to fetch data:", errMessage);
    res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
  }
});

module.exports = router;

















// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");
// require("dotenv").config();
// const countryCodeMap = require("../utils/countryCodeMAp");

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });
//   const response = await axios.post(tokenUrl, data, { headers });
//   return response.data.access_token;
// }

// const getCountryCode = (patentNumber) => {
//   const regex = /^[A-Za-z]+/;
//   const match = patentNumber.match(regex);
//   return match ? match[0] : null;
// }

// function formatPatentNumberWithDot(patentNumber) {
//   const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;

//   if (patentNumber.includes('.')) {
//     return patentNumber;
//   }

//   const match = patentNumber.match(regex);
//   if (match) {
//     return `${match[1]}.${match[2]}`;
//   }

//   return patentNumber;
// }

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     console.log('formattedNumber', formattedNumber);
//     const token = await getAccessToken();

//     const familyurl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${patentNumber}`;
//     const url = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml"
//     };

//     const response = await axios.get(url, { headers });
//     const familyData = await axios.get(familyurl, { headers });

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix]
//     });

//     parser.parseString(response.data, (err, result) => {
//       if (err) {
//         console.error("XML Parsing Error:", err);
//         return res.status(500).json({ error: "Failed to parse XML" });
//       }

//       const patentOffice = getCountryCode(patentNumber);
//       const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//       res.status(200).json({ biblio: result, patentNumber: patentNumber, country: countryCode, familyData: familyData });
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Failed to fetch biblio:", errMessage);
//     res.status(500).json({ error: "Failed to fetch bibliographic data." });
//   }
// });

// module.exports = router;













// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     console.log('Formatted patent number:', formattedNumber);

//     const token = await getAccessToken();

//     const url = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml"
//     };

//     let response;
//     try {
//       response = await axios.get(url, { headers });
//     } catch (apiError) {


//       const patentOffice = getCountryCode(patentNumber);
//       const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//       return res.status(200).json({
//         biblio: null,
//         message: "No data found for the given patent number.",
//         patentNumber,
//         country: countryCode
//       });
//     }

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix]
//     });

//     parser.parseString(response.data, (err, result) => {
//       if (err) {
//         console.error("❌ XML Parsing Error:", err.message);
//         return res.status(500).json({ error: "Failed to parse bibliographic data." });
//       }

//       const patentOffice = getCountryCode(patentNumber);
//       const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//       res.status(200).json({
//         biblio: result,
//         patentNumber,
//         country: countryCode
//       });
//     });

//   } catch (error) {
//     console.error("❌ Unexpected Server Error:", error.message || error);
//     res.status(500).json({ error: "Unexpected server error." });
//   }
// });



// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     console.log('Formatted patent number:', formattedNumber);

//     const token = await getAccessToken();

//     const url = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml"
//     };

//     let response;
//     try {
//       response = await axios.get(url, { headers });
//     } catch (apiError) {
//       console.error("❌ Error fetching from EPO:", apiError?.response?.status, apiError?.response?.data || apiError.message);
//       return res.status(404).json({ error: "Patent not found or API issue." });
//     }

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix]
//     });

//     parser.parseString(response.data, (err, result) => {
//       if (err) {
//         console.error("❌ XML Parsing Error:", err.message);
//         return res.status(500).json({ error: "Failed to parse bibliographic data." });
//       }

//       const patentOffice = getCountryCode(patentNumber);
//       const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//       res.status(200).json({
//         biblio: result,
//         patentNumber: patentNumber,
//         country: countryCode
//       });
//     });

//   } catch (error) {
//     console.error("❌ Unexpected Server Error:", error.message || error);
//     res.status(500).json({ error: "Unexpected server error." });
//   }
// });









// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });
//   const response = await axios.post(tokenUrl, data, { headers });
//   return response.data.access_token;
// }

// function formatPatentNumberWithDot(patentNumber) {
//   const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/i);
//   if (!match) throw new Error("Invalid patent number format.");

//   const [, countryCode, numberPart, kindCode] = match;
//   return `${countryCode}${numberPart}.${kindCode}`;
// }

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     console.log('formattedNumber :>> ', formattedNumber);
//     const token = await getAccessToken();

//     const url = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;    

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const response = await axios.get(url, { headers });

//     res.status(200).json({ biblio: response.data });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Failed to fetch biblio:", errMessage);
//     res.status(500).json({ error: "Failed to fetch bibliographic data." });
//   }
// });

// module.exports = router;



























// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });
//   const response = await axios.post(tokenUrl, data, { headers });
//   return response.data.access_token;
// }

// function formatPatentNumberWithDot(patentNumber) {
//   const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/i);
//   if (!match) throw new Error("Invalid patent number format.");
//   const [, countryCode, numberPart, kindCode] = match;
//   return `${countryCode}${numberPart}.${kindCode}`;
// }

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const baseUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formattedNumber}`;
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const fetchEndpoint = async (type) => {
//       try {
//         const res = await axios.get(`${baseUrl}/${type}`, { headers });
//         return res.data;
//       } catch (err) {
//         console.warn(`⚠️ Could not fetch ${type}:`, err.response?.status || err.message);
//         return null;
//       }
//     };

//     const [biblio, abstract, claims, description] = await Promise.all([
//       fetchEndpoint("biblio"),
//       fetchEndpoint("abstract"),
//       fetchEndpoint("claims"),
//       fetchEndpoint("description")
//     ]);

//     res.status(200).json({
//       biblio,
//       abstract,
//       claims,
//       description
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Fatal Patent Fetch Error:", errMessage);
//     res.status(500).json({ error: "Failed to fetch complete patent data." });
//   }
// });

// module.exports = router;



























// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });

//   try {
//     const response = await axios.post(tokenUrl, data, { headers });
//     return response.data.access_token;
//   } catch (error) {
//     console.error("🔴 Error fetching access token:", error.response?.data || error.message);
//     throw new Error("Could not retrieve access token");
//   }
// }

// router.get("/:patentNumber", async (req, res) => {
//   let { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   function formatPatentNumberWithDot(patentNumber) {
//     const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/i);  
//     if (!match) {
//       throw new Error("Invalid patent number format.");
//     }  
//     const [, countryCode, numberPart, kindCode] = match;
//     return `${countryCode}${numberPart}.${kindCode}`;
//   }

//   const formatPatnNUmber = formatPatentNumberWithDot(patentNumber);
  
// console.log('formatPatnNUmber :>> ', formatPatnNUmber);
//   try {
//     const token = await getAccessToken();
//     const espUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formatPatnNUmber}/biblio`;

//     console.log("📡 Fetching from:", espUrl);

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const response = await axios.get(espUrl, { headers });
//     res.status(200).json(response.data);
//   } catch (error) {
//     const errorMessage = error.response?.data || error.message;
//     console.error("🔴 Patent fetch error:", errorMessage);

//     if (typeof errorMessage === "string" && errorMessage.includes("EntityNotFound")) {
//       return res.status(404).json({ error: "No results found for the given patent number." });
//     }

//     res.status(500).json({ error: "Failed to fetch patent data from Espacenet." });
//   }
// });






















// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });
//   const response = await axios.post(tokenUrl, data, { headers });
//   return response.data.access_token;
// }

// function formatPatentNumberWithDot(patentNumber) {
//   const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/i);
//   if (!match) throw new Error("Invalid patent number format.");
//   const [, countryCode, numberPart, kindCode] = match;
//   return `${countryCode}${numberPart}.${kindCode}`;
// }

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const baseUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formattedNumber}`;
//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const fetchEndpoint = async (type) => {
//       try {
//         const res = await axios.get(`${baseUrl}/${type}`, { headers });
//         return res.data;
//       } catch (err) {
//         console.warn(`⚠️ Could not fetch ${type}:`, err.response?.status || err.message);
//         return null;
//       }
//     };

//     const [biblio, abstract, claims, description] = await Promise.all([
//       fetchEndpoint("biblio"),
//       fetchEndpoint("abstract"),
//       fetchEndpoint("claims"),
//       fetchEndpoint("description")
//     ]);

//     res.status(200).json({
//       biblio,
//       abstract,
//       claims,
//       description
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Fatal Patent Fetch Error:", errMessage);
//     res.status(500).json({ error: "Failed to fetch complete patent data." });
//   }
// });

// module.exports = router;





























// const express = require("express");
// const router = express.Router();
// const axios = require("axios");
// const qs = require("qs");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// async function getAccessToken() {
//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded"
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });

//   try {
//     const response = await axios.post(tokenUrl, data, { headers });
//     return response.data.access_token;
//   } catch (error) {
//     console.error("🔴 Error fetching access token:", error.response?.data || error.message);
//     throw new Error("Could not retrieve access token");
//   }
// }

// router.get("/:patentNumber", async (req, res) => {
//   let { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   function formatPatentNumberWithDot(patentNumber) {
//     const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d?)$/i);  
//     if (!match) {
//       throw new Error("Invalid patent number format.");
//     }  
//     const [, countryCode, numberPart, kindCode] = match;
//     return `${countryCode}${numberPart}.${kindCode}`;
//   }

//   const formatPatnNUmber = formatPatentNumberWithDot(patentNumber);
  
// console.log('formatPatnNUmber :>> ', formatPatnNUmber);
//   try {
//     const token = await getAccessToken();
//     const espUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formatPatnNUmber}/biblio`;

//     console.log("📡 Fetching from:", espUrl);

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const response = await axios.get(espUrl, { headers });
//     res.status(200).json(response.data);
//   } catch (error) {
//     const errorMessage = error.response?.data || error.message;
//     console.error("🔴 Patent fetch error:", errorMessage);

//     if (typeof errorMessage === "string" && errorMessage.includes("EntityNotFound")) {
//       return res.status(404).json({ error: "No results found for the given patent number." });
//     }

//     res.status(500).json({ error: "Failed to fetch patent data from Espacenet." });
//   }
// });





// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const token = await getAccessToken();
//     const espUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${patentNumber}/biblio`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/json"
//     };

//     const response = await axios.get(espUrl, { headers });

//     console.log('response.data :>> ', response.data);
//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error("🔴 Error fetching patent data:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to fetch patent data" });
//   }
// });

module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const qs = require('querystring');

// const CLIENT_ID = process.env.CLIENT_KEY;
// const CLIENT_SECRET = process.env.CLIENT_SECRET_KEY;


// let tokenCache = {
//   token: null,
//   expiry: null
// };

// // Get OPS Access Token
// async function getAccessToken() {
//   if (tokenCache.token && tokenCache.expiry > Date.now()) {
//     return tokenCache.token;
//   }

//   const tokenUrl = 'https://ops.epo.org/3.2/auth/accesstoken';
//   const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

//   const response = await axios.post(tokenUrl, qs.stringify({ grant_type: 'client_credentials' }), {
//     headers: {
//       'Authorization': `Basic ${auth}`,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   });

//   tokenCache.token = response.data.access_token;
//   tokenCache.expiry = Date.now() + (response.data.expires_in - 60) * 1000;
//   return tokenCache.token;
// }

// // Route: /api/espacenet/:patentNumber
// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;

//   try {
//     const token = await getAccessToken();

//     const response = await axios.get(`https://ops.epo.org/rest-services/published-data/publication/epodoc/${patentNumber}/biblio`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       }
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching data from Espacenet:", error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to fetch patent data' });
//   }
// });

// module.exports = router;

















// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const qs = require('querystring');

// const CLIENT_ID = process.env.CLIENT_KEY;
// const CLIENT_SECRET = process.env.CLIENT_SECRET_KEY;

// let tokenCache = {
//     token: null,
//     expiry: null
// };

// // Get OPS Access Token
// async function getAccessToken() {
//     if (tokenCache.token && tokenCache.expiry > Date.now()) {
//         return tokenCache.token;
//     }

//     const tokenUrl = 'https://ops.epo.org/3.2/auth/accesstoken';
//     const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

//     const response = await axios.post(tokenUrl, qs.stringify({ grant_type: 'client_credentials' }), {
//         headers: {
//             'Authorization': `Basic ${auth}`,
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     });

//     tokenCache.token = response.data.access_token;
//     tokenCache.expiry = Date.now() + (response.data.expires_in - 60) * 1000;
//     return tokenCache.token;
// }

// // Fetch helper
// const fetchData = async (url, token) => {
//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Accept': 'application/json'
//             }
//         });
//         return response.data;
//     } catch (err) {
//         console.error(`Error fetching ${url}:`, err.response?.data || err.message);
//         return { error: `Failed to fetch from ${url}` };
//     }
// };

// // Route: /api/espacenet/:patentNumber
// router.get('/:patentNumber', async (req, res) => {
//     const { patentNumber } = req.params;

//     try {
//         const token = await getAccessToken();

//         console.log('token :>> ', token);

//         const baseUrl = `https://ops.epo.org/rest-services/published-data/publication/epodoc/${patentNumber}`;

//         // Fetch all in parallel
//         const [biblio, abstract, claims, description] = await Promise.all([
//             fetchData(`${baseUrl}/biblio`, token),
//             fetchData(`${baseUrl}/abstract`, token),
//             fetchData(`${baseUrl}/claims`, token),
//             fetchData(`${baseUrl}/description`, token)
//         ]);

//         const result = {
//             patentNumber,
//             biblio,
//             abstract,
//             claims,
//             description
//         };

//         res.json(result);

//     } catch (error) {
//         console.error("Error fetching data from Espacenet:", error.message);
//         res.status(500).json({ error: 'Failed to fetch patent data' });
//     }
// });

// module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const qs = require('querystring');

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET_KEY;

// console.log('CLIENT_ID,CLIENT_SECRET', CLIENT_ID, CLIENT_SECRET);

// let tokenCache = {
//   token: null,
//   expiry: null
// };

// // Get OPS Access Token
// async function getAccessToken() {
//   if (tokenCache.token && tokenCache.expiry > Date.now()) {
//     return tokenCache.token;
//   }

//   const tokenUrl = 'https://ops.epo.org/3.2/auth/accesstoken';
//   const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

//   const response = await axios.post(tokenUrl, qs.stringify({ grant_type: 'client_credentials' }), {
//     headers: {
//       'Authorization': `Basic ${auth}`,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   });

//   tokenCache.token = response.data.access_token;
//   tokenCache.expiry = Date.now() + (response.data.expires_in - 60) * 1000;
//   return tokenCache.token;
// }

// // Route: /api/espacenet/:patentNumber
// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;

//   try {
//     const token = await getAccessToken();

//     const response = await axios.get(`https://ops.epo.org/rest-services/published-data/publication/epodoc/${patentNumber}/biblio`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Accept': 'application/json'
//       }
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error fetching data from Espacenet:", error.response?.data || error.message);
//     res.status(500).json({ error: 'Failed to fetch patent data' });
//   }
// });

// module.exports = router;
