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

async function getAccessToken(retryCount = 0, forceFresh = false) {
    const now = Date.now();
    if (!forceFresh && cachedToken && tokenExpiry && now < tokenExpiry) {
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

        const newToken = response.data.access_token;

        if (!forceFresh) {
            cachedToken = newToken;
            tokenExpiry = now + (18 * 60 * 1000) - (60 * 1000);
        }

        return newToken;

    } catch (error) {
        if (retryCount < 2) {
            return await getAccessToken(retryCount + 1, forceFresh);
        }
        throw new Error("Failed to get access token");
    }
}

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
    const patentList = patentNumber.split(",").map(p => p.trim()).filter(Boolean);

    if (!patentList.length) {
        return res.status(400).json({ error: "Patent number is required" });
    }

    const token = await getAccessToken();

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/xml",
    };

    const parser = new xml2js.Parser({
        explicitArray: false,
        tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    const results = await Promise.allSettled(
        patentList.map(async (pn) => {
            try {
                const formattedNumber = formatPatentNumberWithDot(pn);

                const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
                const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;

                const [biblioResponse, familyResponse] = await Promise.all([
                    axios.get(biblioUrl, { headers }),
                    axios.get(familyUrl, { headers }),
                ]);

                const biblioData = await parser.parseStringPromise(biblioResponse.data);
                const familyData = await parser.parseStringPromise(familyResponse.data);

                return {
                    patentNumber: pn,
                    success: true,
                    biblio: biblioData,
                    family: familyData,
                };
            } catch (error) {
                console.error(`Error fetching for ${pn}`, error?.response?.status || error.message);
                return {
                    patentNumber: pn,
                    success: false,
                    error: error?.response?.data || error.message,
                };
            }
        })
    );

    res.json(results.map(r => r.value || r.reason));
});




// router.get("/:patentNumber", async (req, res) => {
//     const { patentNumber } = req.params;

//     const patentList = patentNumber.split(",").map(p => p.trim()).filter(Boolean);

//     if (!patentList) {
//         return res.status(400).json({ error: "Patent number is required" });
//     }

    // const results = await Promise.all(patentList.map(async (pn) => {
    //     try {
    //         const formattedNumber = formatPatentNumberWithDot(pn);

    //         const token = await getAccessToken(0, true);

    //         const headers = {
    //             Authorization: `Bearer ${token}`,
    //             Accept: "application/xml",
    //         };

    //         const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
    //         const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;

    //         const [biblioResponse, familyResponse] = await Promise.all([
    //             axios.get(biblioUrl, { headers }),
    //             axios.get(familyUrl, { headers }),
    //         ]);

    //         const parser = new xml2js.Parser({
    //             explicitArray: false,
    //             tagNameProcessors: [xml2js.processors.stripPrefix],
    //         });

    //         const biblioData = await parser.parseStringPromise(biblioResponse.data);
    //         const familyData = await parser.parseStringPromise(familyResponse.data);

    //         return Promise.resolve({
    //             patentNumber: pn,
    //             success: true,
    //             biblio: biblioData,
    //             family: familyData,
    //         });


//         } catch (error) {
//             console.error(`Error fetching for ${pn}`, error?.response?.status || error.message);
//             return {
//                 patentNumber: pn,
//                 success: false,
//                 error: error?.response?.data || error.message,
//             };
//         }
//     }));
//     res.json(results);
// });

module.exports = router;




// router.get("/:patentNumber", async (req, res) => {
//     const { patentNumber } = req.params;
//     const patentList = patentNumber.split(",").map(p => p.trim()).filter(Boolean);

//     if (!patentList.length) {
//         return res.status(400).json({ error: "Patent number is required" });
//     }

//     const token = await getAccessToken();

//     const headers = {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/xml",
//     };

//     const parser = new xml2js.Parser({
//         explicitArray: false,
//         tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const results = await Promise.allSettled(
//         patentList.map(async (pn) => {
//             try {
//                 const formattedNumber = formatPatentNumberWithDot(pn);

//                 const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
//                 const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;

//                 const [biblioResponse, familyResponse] = await Promise.all([
//                     axios.get(biblioUrl, { headers }),
//                     axios.get(familyUrl, { headers }),
//                 ]);

//                 const biblioData = await parser.parseStringPromise(biblioResponse.data);
//                 const familyData = await parser.parseStringPromise(familyResponse.data);

//                 return {
//                     patentNumber: pn,
//                     success: true,
//                     biblio: biblioData,
//                     family: familyData,
//                 };
//             } catch (error) {
//                 console.error(`Error fetching for ${pn}`, error?.response?.status || error.message);
//                 return {
//                     patentNumber: pn,
//                     success: false,
//                     error: error?.response?.data || error.message,
//                 };
//             }
//         })
//     );

//     res.json(results.map(r => r.value || r.reason));
// });

