const express = require("express");
const router = express.Router();
const qs = require("qs");
const xml2js = require("xml2js");

require("dotenv").config();

const CONSUMER_KEY = process.env.CLIENT_KEY;
const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

let cachedToken = null;
let tokenExpiry = null;

async function getAccessToken(retryCount = 0) {
  const now = Date.now();
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    return cachedToken;
  }

  const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

  try {
    const response = await axios.post(tokenUrl, qs.stringify({ grant_type: "client_credentials" }), {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 5000,
    });

    cachedToken = response.data.access_token;
    tokenExpiry = now + (18 * 60 * 1000) - (60 * 1000);

    return cachedToken;
  } catch (error) {
    if (retryCount < 2) {
      return await getAccessToken(retryCount + 1);
    }
    throw new Error("Failed to get access token");
  }
};

function formatPatentNumberWithDot(patentNumber) {
  if (!patentNumber) return "";

  let formatted = patentNumber;

  if (formatted.startsWith("WO19")) {
    formatted = formatted.split('').filter((_, i) => ![2, 3, 6].includes(i)).join('');
  }
  else if (formatted.length === 14) {
    return formatted;
  }
  else if (formatted.startsWith("US") && formatted.length > 13) {
    formatted = formatted.split('').filter((_, i) => i !== 6).join('');
  }

  const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
  const match = formatted.match(regex);

  if (match) {
    const base = match[1];
    const kind = match[2];

    if (/^[A-Z]+$/i.test(kind)) {
      return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
    }

    return `${base}.${kind}`;
  }

  return formatted;
};

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
      Accept: "application/xml",
    };

    const [biblioResponse,
      familyResponse
    ] = await Promise.all([axios.get(biblioUrl, { headers }),
    axios.get(familyUrl, { headers }),
    ]
    );

    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    const biblioData = await parser.parseStringPromise(biblioResponse.data);
    const familyData = await parser.parseStringPromise(familyResponse.data);

    res.status(200).json({
      patentNumber,
      biblio: biblioData,
      familyData,
    });

  } catch (error) {
    const status = error.response?.status;
    const errData = error.response?.data;
    console.error(`🔴 Error fetching data for ${patentNumber} | Status: ${status}`, errData || error.message);
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

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null;

// async function getAccessToken() {
//   const now = Date.now();
//   if (cachedToken && tokenExpiry && now < tokenExpiry) {
//     return cachedToken;
//   }

//   const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//   const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//   const headers = {
//     Authorization: `Basic ${auth}`,
//     "Content-Type": "application/x-www-form-urlencoded",
//   };

//   const data = qs.stringify({ grant_type: "client_credentials" });

//   const response = await axios.post(tokenUrl, data, { headers });

//   cachedToken = response.data.access_token;
//   tokenExpiry = now + (18 * 60 * 1000) - 30 * 1000;

//   return cachedToken;
// }


// // function getFormattedPatentPath(patentNumber) {
// //   const match = patentNumber.match(/^([A-Z]{2})(\d+)([A-Z]\d)$/);

// //   if (!match) {
// //     throw new Error("Invalid patent number format. Expected format: 'EP1000000A1'");
// //   }

// //   const [, countryCode, docNumber, kindCode] = match;

// //   return `${countryCode}/${docNumber}/${kindCode}`;
// // }



// // function removeKindCodeFunct(patentNumber) {
// //   return patentNumber.replace(/[A-Z]\d?$/, '');
// // }

// function formatPatentNumberWithDot(patentNumber) {
//   const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;

//   if (patentNumber.startsWith('WO20')) {
//     const match = patentNumber.match(regex);
//     if (match) {
//       return `${match[1]}.${match[2]}`;
//     }
//     return patentNumber;
//   }
//   if (patentNumber.startsWith('WO19')) {
//     const indicesToRemove = [2, 3, 6];
//     patentNumber = patentNumber.split('').filter((_, i) => !indicesToRemove.includes(i)).join('');
//   } else if (patentNumber.startsWith('US') && patentNumber.length > 13) {
//     patentNumber = patentNumber.split('').filter((_, i) => i !== 6).join('');
//     console.log(patentNumber, 'patentNumber')
//   }

//   const match = patentNumber.match(regex);
//   if (match) {
//     return `${match[1]}.${match[2]}`;
//   }
//   return patentNumber;
// }

// // function extractCountryAndKindCode(patentNumber) {
// //   const match = patentNumber.match(/^([A-Z]{2})\d+([A-Z]\d?)?$/);
// //   if (!match) return { countryCode: null, kindCode: null };
// //   return {
// //     countryCode: match[1],
// //     kindCode: match[2] || null,
// //   };
// // }

// router.get("/:patentNumber", async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: "Patent number is required" });
//   }

//   try {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     // const endpNumber = removeKindCodeFunct(patentNumber);
//     // const { countryCode, kindCode } = extractCountryAndKindCode(patentNumber);
//     // const drawingFormatNumber = getFormattedPatentPath(patentNumber);


//     const token = await getAccessToken();
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
//     // const drawingUrl = `https://ops.epo.org/3.2/rest-services/published-data/images/${drawingFormatNumber}/fullimage?Range=6`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml",
//     };

//     const [biblioResponse, familyResponse, 
//       // drawingResponse
//     ] = await Promise.all([
//       axios.get(biblioUrl, { headers }),
//       axios.get(familyUrl, { headers }),
//       // axios.get(drawingUrl, { headers: { ...headers, Accept: "application/pdf" } }),
//     ]);

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const biblioData = await parser.parseStringPromise(biblioResponse.data);
//     const familyData = await parser.parseStringPromise(familyResponse.data);

//     // let descriptionData = null;
//     // let claimsData = null;

//     // if (countryCode === 'EP' && kindCode?.startsWith('B')) {
//     //   const descriptionUrl = `https://ops.epo.org/rest-services/published-data/publication/epodoc/${formattedNumber}/description`;
//     //   const claimsUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formattedNumber}/claims`;

//     //   const [descriptionResponse, claimsResponse] = await Promise.all([
//     //     axios.get(descriptionUrl, { headers }),
//     //     axios.get(claimsUrl, { headers }),
//     //   ]);

//     //   descriptionData = await parser.parseStringPromise(descriptionResponse.data);
//     //   claimsData = await parser.parseStringPromise(claimsResponse.data);
//     // }

//     res.status(200).json({
//       patentNumber,
//       biblio: biblioData,
//       familyData,
//       // descriptionData,
//       // claimsData,
//       // drawings: drawingResponse.data,
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Failed to fetch data:", errMessage);
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

// async function getAccessToken() {//   const now = Date.now();
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


// function removeKindCodeFunct(patentNumber) {
//   return patentNumber.replace(/[A-Z]\d?$/, '');
// }

// function formatPatentNumberWithDot(patentNumber) {
//   const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/;

//   if (patentNumber.startsWith('WO20')) {
//     const match = patentNumber.match(regex);
//     if (match) {
//       return `${match[1]}.${match[2]}`;
//     }
//     return patentNumber;
//   }
//   if (patentNumber.startsWith('WO19')) {
//     const indicesToRemove = [2, 3, 6];

//     patentNumber = patentNumber
//       .split('')
//       .filter((_, i) => !indicesToRemove.includes(i))
//       .join('');
//   } else if (patentNumber.startsWith('US') && patentNumber.length > 13) {
//     patentNumber = patentNumber
//       .split('')
//       .filter((_, i) => i !== 6)
//       .join('');
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
//     const endpNumber = removeKindCodeFunct(patentNumber);

//     console.log('Formatted Patent Number:', formattedNumber, endpNumber);
//     const token = await getAccessToken();
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
//     const descriptionUrl = `https://ops.epo.org/rest-services/published-data/publication/epodoc/${formattedNumber}/description`;
//     const claimsUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/epodoc/${formattedNumber}/claims`;

//     const headers = {
//       Authorization: `Bearer ${token}`,
//       Accept: "application/xml"
//     };

//     const [biblioResponse, familyResponse, descriptionResponse, claimsResponse] = await Promise.all([
//       axios.get(biblioUrl, { headers }),
//       axios.get(familyUrl, { headers }),
//       axios.get(descriptionUrl, { headers }),
//       axios.get(claimsUrl, {headers})
//     ]);

    
//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       tagNameProcessors: [xml2js.processors.stripPrefix]
//     });

//     const biblioData = await new Promise((resolve, reject) => {
//       parser.parseString(biblioResponse.data, (err, result) => {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });

//     const familyData = await new Promise((resolve, reject) => {
//       parser.parseString(familyResponse.data, (err, result) => {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });

//      const descriptionData = await new Promise((resolve, reject) => {
//       parser.parseString(descriptionResponse.data, (err, result) => {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });

//      const claimsData = await new Promise((resolve, reject) => {
//       parser.parseString(claimsResponse.data, (err, result) => {
//         if (err) reject(err);
//         resolve(result);
//       });
//     });

//     res.status(200).json({
//       biblio: biblioData,
//       patentNumber: patentNumber,
//       familyData: familyData,
//       descriptionData: descriptionData,
//       claimsData: claimsData,
//     });

//   } catch (error) {
//     const errMessage = error.response?.data || error.message;
//     console.error("🔴 Failed to fetch data:", errMessage);
//     res.status(500).json({ error: "Failed to fetch bibliographic or family data." });
//   }
// });

// module.exports = router;