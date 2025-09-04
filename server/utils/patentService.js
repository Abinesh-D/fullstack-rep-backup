const axios = require("axios");
const qs = require("qs");
const xml2js = require("xml2js");
const {
    getIPCClasses,
    getPriorityDates,
    extractIPCCode,
    mapFamilyMemberData,
    inventionTitle,
    getApplicationDate,
    getPublicationDate,
    getInventorNames,
    getApplicantNames,
} = require("./patentUtils");
const { getFilteredCPC } = require("./commonResusableFunctions");
require("dotenv").config();

const CONSUMER_KEY = process.env.CLIENT_KEY;
const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

let cachedToken = null;
let tokenExpiry = null;

const patentCache = new Map();

async function getAccessToken(retryCount = 0) {
    const now = Date.now();
    if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;

    const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

    try {
        const response = await axios.post(
            tokenUrl,
            qs.stringify({ grant_type: "client_credentials" }),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                timeout: 5000,
            }
        );
        cachedToken = response.data.access_token;
        tokenExpiry = now + 17 * 60 * 1000;
        return cachedToken;
    } catch (error) {
        if (retryCount < 2) return await getAccessToken(retryCount + 1);
        throw new Error("Failed to get access token");
    }
}

function formatPatentNumberWithDot(patentNumber) {
    if (!patentNumber) return "";
    let formatted = patentNumber;

    if (formatted.startsWith("WO19")) {
        formatted = formatted.split("").filter((_, i) => ![2, 3, 6].includes(i)).join("");
    } else if (formatted.length === 14) {
        return formatted;
    } else if (formatted.startsWith("US") && formatted.length > 13) {
        formatted = formatted.split("").filter((_, i) => i !== 6).join("");
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
}

async function getPatentData(patentNumber, type) {
    if (patentCache.has(patentNumber)) {
        return patentCache.get(patentNumber);
    }

    const formattedNumber = formatPatentNumberWithDot(patentNumber);
    const token = await getAccessToken();

    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/xml",
    };

    const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
    const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;

    const parser = new xml2js.Parser({
        explicitArray: false,
        tagNameProcessors: [xml2js.processors.stripPrefix],
    });

    const [biblioResponse, familyResponse] = await Promise.all([
        axios.get(biblioUrl, { headers }),
        (type === "relevant" || type === "related") ? axios.get(familyUrl, { headers }) : Promise.resolve(null),
    ]);

    const [biblioData, familyData] = await Promise.all([
        parser.parseStringPromise(biblioResponse.data),
        familyResponse ? parser.parseStringPromise(familyResponse.data) : Promise.resolve(null),
    ]);

    const bibliographicData =
        biblioData?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.["bibliographic-data"];

    const {
        inventorNames,
        applicantNames,
        title,
        priorityDates,
        applicationDate,
        publicationDate,
        familyMemData,
        classifications,
        classificationsIPC,
        finalCPC,
    } = await (async () => {
        const [
            inventorNames,
            applicantNames,
            title,
            priorityDates,
            applicationDate,
            publicationDate,
            familyMemData,
            classifications,
            classificationsIPC,
        ] = await Promise.all([
            getInventorNames(bibliographicData),
            getApplicantNames(bibliographicData),
            inventionTitle(bibliographicData),
            getPriorityDates(bibliographicData),
            getApplicationDate(bibliographicData),
            getPublicationDate(bibliographicData),
            Promise.resolve(familyData ? mapFamilyMemberData(familyData, patentNumber) : []),
            extractIPCCode(bibliographicData),
            getIPCClasses(bibliographicData),
        ]);

        const finalCPC = getFilteredCPC(classifications, classificationsIPC);

        return {
            inventorNames,
            applicantNames,
            title,
            priorityDates,
            applicationDate,
            publicationDate,
            familyMemData,
            classifications,
            classificationsIPC,
            finalCPC
        };
    })();

    const publicationUrl = `https://worldwide.espacenet.com/patent/search?q=${patentNumber}`;
    const googlePublicationUrl = `https://patents.google.com/patent/${patentNumber}`;

    let result;
    if (type === "relevant") {
        result = {
            title,
            patentNumber,
            familyMemData,
            priorityDates,
            inventorNames,
            applicantNames,
            publicationUrl,
            googlePublicationUrl,
            aplDate: applicationDate,
            pubDate: publicationDate,
            classData: classifications,
            cpcClass: classifications.cpc,
            ipcClass: classificationsIPC,
            finalCPC,
            bibliographicData,
        };
    } else if (type === "related") {
        result = {
            publicationNumber: patentNumber,
            relatedTitle: title,
            relatedInventor: inventorNames,
            relatedAssignee: applicantNames,
            relatedPriorityDate: priorityDates,
            relatedFamilyMembers: familyMemData,
            relatedPublicationUrl: publicationUrl,
            relatedPublicationDate: publicationDate,
            bibliographicData,
        };
    }

    patentCache.set(patentNumber, result);
    return result;
}

module.exports = { getPatentData };
















// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");
// const {
//     getIPCClasses,
//     getPriorityDates,
//     extractIPCCode,
//     mapFamilyMemberData,
//     inventionTitle,
//     getApplicationDate,
//     getPublicationDate,
//     getInventorNames,
//     getApplicantNames,
// } = require("./patentUtils");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null;

// const patentCache = new Map();

// async function getAccessToken(retryCount = 0) {
//     const now = Date.now();
//     if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;

//     const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//     try {
//         const response = await axios.post(
//             tokenUrl,
//             qs.stringify({ grant_type: "client_credentials" }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 timeout: 5000,
//             }
//         );
//         cachedToken = response.data.access_token;
//         tokenExpiry = now + 17 * 60 * 1000; // 17 min validity
//         return cachedToken;
//     } catch (error) {
//         if (retryCount < 2) return await getAccessToken(retryCount + 1);
//         throw new Error("Failed to get access token");
//     }
// }

// function formatPatentNumberWithDot(patentNumber) {
//     if (!patentNumber) return "";
//     let formatted = patentNumber;

//     if (formatted.startsWith("WO19")) {
//         formatted = formatted.split("").filter((_, i) => ![2, 3, 6].includes(i)).join("");
//     } else if (formatted.length === 14) {
//         return formatted;
//     } else if (formatted.startsWith("US") && formatted.length > 13) {
//         formatted = formatted.split("").filter((_, i) => i !== 6).join("");
//     }

//     const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
//     const match = formatted.match(regex);
//     if (match) {
//         const base = match[1];
//         const kind = match[2];
//         if (/^[A-Z]+$/i.test(kind)) {
//             return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
//         }
//         return `${base}.${kind}`;
//     }
//     return formatted;
// }

// async function getPatentData(patentNumber, type) {
//     if (patentCache.has(patentNumber)) {
//         return patentCache.get(patentNumber);
//     }

//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const headers = {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/xml",
//     };

//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;

//     const parser = new xml2js.Parser({
//         explicitArray: false,
//         tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const biblioResponse = await axios.get(biblioUrl, { headers });
//     const biblioData = await parser.parseStringPromise(biblioResponse.data);

//     let familyData = null;
//     if (type === "relevant" || type === "related") {
//         const familyResponse = await axios.get(familyUrl, { headers });
//         familyData = await parser.parseStringPromise(familyResponse.data);
//     }
//     const bibliographicData =biblioData?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.["bibliographic-data"];

//     const classifications = extractIPCCode(bibliographicData);
//     const classificationsIPC = getIPCClasses(bibliographicData);

//     const [inventorNames, applicantNames, title] = await Promise.all([
//         getInventorNames(bibliographicData),
//         getApplicantNames(bibliographicData),
//         inventionTitle(bibliographicData),
//     ]);

//     const priorityDates = getPriorityDates(bibliographicData);
//     const applicationDate = getApplicationDate(bibliographicData);
//     const publicationDate = getPublicationDate(bibliographicData);
//     const familyMemData = familyData ? mapFamilyMemberData(familyData, patentNumber) : [];

//     const publicationUrl = `https://worldwide.espacenet.com/patent/search?q=${patentNumber}`;
//     const googlePublicationUrl = `https://patents.google.com/patent/${patentNumber}`;



    

//     let result;
//     if (type === "relevant") {
//         result = {
//             title,
//             patentNumber,
//             familyMemData,
//             priorityDates,
//             inventorNames,
//             applicantNames,
//             publicationUrl,
//             googlePublicationUrl,
//             aplDate: applicationDate,
//             pubDate: publicationDate,
//             classData: classifications,
//             cpcClass: classifications.cpc,
//             ipcClass: classificationsIPC,
//             bibliographicData,
//         };
//     } else if (type === "related") {
//         result = {
//             publicationNumber: patentNumber,
//             relatedTitle: title,
//             relatedInventor: inventorNames,
//             relatedAssignee: applicantNames,
//             relatedPriorityDate: priorityDates,
//             relatedFamilyMembers: familyMemData,
//             relatedPublicationUrl: publicationUrl,
//             relatedPublicationDate: publicationDate,
//             bibliographicData,
//         };
//     }
//     patentCache.set(patentNumber, result);
//     return result;
// }
// module.exports = { getPatentData };
















// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");
// const { getIPCClasses, getPriorityDates, extractIPCCode, mapFamilyMemberData, inventionTitle, getApplicationDate, getPublicationDate, getInventorNames,
//     getApplicantNames,
//     // getEnglishAbstract,
//     // convertDescriptionToKeyValue,
// } = require("./patentUtils");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null;

// const patentCache = new Map();

// async function getAccessToken(retryCount = 0) {
//     const now = Date.now();
//     if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;
//     const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//     try {
//         const response = await axios.post(
//             tokenUrl,
//             qs.stringify({ grant_type: "client_credentials" }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 timeout: 5000,
//             }
//         );
//         cachedToken = response.data.access_token;
//         tokenExpiry = now + 17 * 60 * 1000;
//         return cachedToken;
//     } catch (error) {
//         if (retryCount < 2) return await getAccessToken(retryCount + 1);
//         throw new Error("Failed to get access token");
//     }
// }

// function formatPatentNumberWithDot(patentNumber) {
//     if (!patentNumber) return "";
//     let formatted = patentNumber;
//     if (formatted.startsWith("WO19")) {
//         formatted = formatted.split("").filter((_, i) => ![2, 3, 6].includes(i)).join("");
//     } else if (formatted.length === 14) {
//         return formatted;
//     } else if (formatted.startsWith("US") && formatted.length > 13) {
//         formatted = formatted.split("").filter((_, i) => i !== 6).join("");
//     }
//     const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
//     const match = formatted.match(regex);
//     if (match) {
//         const base = match[1];
//         const kind = match[2];
//         if (/^[A-Z]+$/i.test(kind)) {
//             return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
//         }
//         return `${base}.${kind}`;
//     }
//     return formatted;
// }

// async function getPatentData(patentNumber, type) {
//     if (patentCache.has(patentNumber)) {
//         return patentCache.get(patentNumber);
//     }

//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const headers = {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/xml",
//     };
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const [biblioResponse, familyResponse] = await Promise.all([
//         axios.get(biblioUrl, { headers }),
//         axios.get(familyUrl, { headers }),
//     ]);

//     const parser = new xml2js.Parser({
//         explicitArray: false,
//         tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const [biblioData, familyData] = await Promise.all([
//         parser.parseStringPromise(biblioResponse.data),
//         parser.parseStringPromise(familyResponse.data),
//     ]);


//     // const biblioData = await parser.parseStringPromise(biblioResponse.data);
//     // const familyData = await parser.parseStringPromise(familyResponse.data);

//     const bibliographicData = biblioData?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.["bibliographic-data"];
//     // const descriptionText = (biblioData?.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p || []).join('\n');
//     // const abstractData = getEnglishAbstract(bibliographicData);
//     const classifications = extractIPCCode(bibliographicData);
//     const classificationsIPC = getIPCClasses(bibliographicData);
//     const inventorNames = await getInventorNames(bibliographicData);
//     const applicantNames = await getApplicantNames(bibliographicData);
//     const familyMemData = mapFamilyMemberData(familyData, patentNumber);
//     const publicationUrl = `https://worldwide.espacenet.com/patent/search?q=${patentNumber}`;
//     const googlePublicationUrl = `https://patents.google.com/patent/${patentNumber}`;
//     const title = await inventionTitle(bibliographicData);
//     const priorityDates = getPriorityDates(bibliographicData);
//     const applicationDate = getApplicationDate(bibliographicData);
//     const publicationDate = getPublicationDate(bibliographicData);

//     if (type === "relevant") {
//         return {
//             title,
//             patentNumber,
//             familyMemData,
//             priorityDates,
//             inventorNames,
//             applicantNames,
//             publicationUrl,
//             googlePublicationUrl,
//             aplDate: applicationDate,
//             pubDate: publicationDate,
//             classData: classifications,
//             cpcClass: classifications.cpc,
//             ipcClass: classificationsIPC,
//             biblioData,
//             // formattedDescriptions,
//             // abstractData,
//             // familyData: familyData,
//             // biblioData: biblioData,
//         };
//     } else if (type === "related") {
//         return {
//             publicationNumber: patentNumber,
//             relatedTitle: title,
//             relatedInventor: inventorNames,
//             relatedAssignee: applicantNames,
//             relatedPriorityDate: priorityDates,
//             relatedFamilyMembers: familyMemData,
//             relatedPublicationUrl: publicationUrl,
//             relatedPublicationDate: publicationDate,
//             bibliographicData,
//         };
//     }
// }
// module.exports = { getPatentData };



















// LIve code 
// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");
// const { getIPCClasses, getPriorityDates, extractIPCCode, mapFamilyMemberData, inventionTitle, getApplicationDate, getPublicationDate, getInventorNames,
//     getApplicantNames,
//     // getEnglishAbstract,
//     // convertDescriptionToKeyValue,
// } = require("./patentUtils");
// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null;

// async function getAccessToken(retryCount = 0) {
//     const now = Date.now();
//     if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;
//     const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//     try {
//         const response = await axios.post(
//             tokenUrl,
//             qs.stringify({ grant_type: "client_credentials" }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 timeout: 5000,
//             }
//         );
//         cachedToken = response.data.access_token;
//         tokenExpiry = now + 17 * 60 * 1000;
//         return cachedToken;
//     } catch (error) {
//         if (retryCount < 2) return await getAccessToken(retryCount + 1);
//         throw new Error("Failed to get access token");
//     }
// }

// function formatPatentNumberWithDot(patentNumber) {
//     if (!patentNumber) return "";
//     let formatted = patentNumber;
//     if (formatted.startsWith("WO19")) {
//         formatted = formatted.split("").filter((_, i) => ![2, 3, 6].includes(i)).join("");
//     } else if (formatted.length === 14) {
//         return formatted;
//     } else if (formatted.startsWith("US") && formatted.length > 13) {
//         formatted = formatted.split("").filter((_, i) => i !== 6).join("");
//     }
//     const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
//     const match = formatted.match(regex);
//     if (match) {
//         const base = match[1];
//         const kind = match[2];
//         if (/^[A-Z]+$/i.test(kind)) {
//             return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
//         }
//         return `${base}.${kind}`;
//     }
//     return formatted;
// }

// async function getPatentData(patentNumber, type) {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const headers = {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/json",
//     };
//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const [biblioResponse, familyResponse] = await Promise.all([
//         axios.get(biblioUrl, { headers }),
//         axios.get(familyUrl, { headers }),
//     ]);

//     // const parser = new xml2js.Parser({
//     //     explicitArray: false,
//     //     tagNameProcessors: [xml2js.processors.stripPrefix],
//     // });

//     // const biblioData = await parser.parseStringPromise(biblioResponse.data);
//     // const familyData = await parser.parseStringPromise(familyResponse.data);
//     const bibliographicData = biblioResponse?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.["bibliographic-data"];
//     // const descriptionText = (biblioData?.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p || []).join('\n');
//     // const abstractData = getEnglishAbstract(bibliographicData);
//     const classifications = extractIPCCode(bibliographicData);
//     const classificationsIPC = getIPCClasses(bibliographicData);
//     const inventorNames = await getInventorNames(bibliographicData);
//     const applicantNames = await getApplicantNames(bibliographicData);
//     const familyMemData = mapFamilyMemberData(familyResponse, patentNumber);
//     const publicationUrl = `https://worldwide.espacenet.com/patent/search?q=${patentNumber}`;
//     const googlePublicationUrl = `https://patents.google.com/patent/${patentNumber}`;
//     const title = await inventionTitle(bibliographicData);
//     const priorityDates = getPriorityDates(bibliographicData);
//     const applicationDate = getApplicationDate(bibliographicData);
//     const publicationDate = getPublicationDate(bibliographicData);

//     if (type === "relevant") {
//         return {
//             title,
//             patentNumber,
//             familyMemData,
//             priorityDates,
//             inventorNames,
//             applicantNames,
//             publicationUrl,
//             googlePublicationUrl,
//             aplDate: applicationDate,
//             pubDate: publicationDate,
//             classData: classifications,
//             cpcClass: classifications.cpc,
//             ipcClass: classificationsIPC,
//             bibliographicData,
//             // formattedDescriptions,
//             // abstractData,
//             // familyData: familyData,
//             // biblioData: biblioData,
//         };
//     } else if (type === "related") {
//         return {
//             publicationNumber: patentNumber,
//             relatedTitle: title,
//             relatedInventor: inventorNames,
//             relatedAssignee: applicantNames,
//             relatedPriorityDate: priorityDates,
//             relatedFamilyMembers: familyMemData,
//             relatedPublicationUrl: publicationUrl,
//             relatedPublicationDate: publicationDate,
//             bibliographicData,  
//         };
//     }
// }
// module.exports = { getPatentData };














// const axios = require("axios");
// const qs = require("qs");
// const xml2js = require("xml2js");
// const {
//     getEnglishAbstract,
//     convertDescriptionToKeyValue,
//     famFilterFunction,
//     getPriorityDates,
//     extractIPCCode,
//     getCleanPartyNames,
//     mapFamilyMemberData,
// } = require("./patentUtils");

// require("dotenv").config();

// const CONSUMER_KEY = process.env.CLIENT_KEY;
// const CONSUMER_SECRET = process.env.CLIENT_SECRET_KEY;

// let cachedToken = null;
// let tokenExpiry = null;

// /**
//  * ✅ Fetch and cache EPO Access Token
//  */
// async function getAccessToken(retryCount = 0) {
//     const now = Date.now();
//     if (cachedToken && tokenExpiry && now < tokenExpiry) {
//         return cachedToken;
//     }

//     const tokenUrl = "https://ops.epo.org/3.2/auth/accesstoken";
//     const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");

//     try {
//         const response = await axios.post(
//             tokenUrl,
//             qs.stringify({ grant_type: "client_credentials" }),
//             {
//                 headers: {
//                     Authorization: `Basic ${auth}`,
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//                 timeout: 5000,
//             }
//         );

//         cachedToken = response.data.access_token;
//         tokenExpiry = now + 17 * 60 * 1000; // ~17 mins

//         return cachedToken;
//     } catch (error) {
//         if (retryCount < 2) return await getAccessToken(retryCount + 1);
//         throw new Error("Failed to get access token");
//     }
// }

// /**
//  * ✅ Format patent number with dots (WO, US, etc.)
//  */
// function formatPatentNumberWithDot(patentNumber) {
//     if (!patentNumber) return "";

//     let formatted = patentNumber;

//     if (formatted.startsWith("WO19")) {
//         formatted = formatted.split("").filter((_, i) => ![2, 3, 6].includes(i)).join("");
//     } else if (formatted.length === 14) {
//         return formatted;
//     } else if (formatted.startsWith("US") && formatted.length > 13) {
//         formatted = formatted.split("").filter((_, i) => i !== 6).join("");
//     }

//     const regex = /^([A-Z]+\d+)([A-Z]+\d*)$/i;
//     const match = formatted.match(regex);

//     if (match) {
//         const base = match[1];
//         const kind = match[2];
//         if (/^[A-Z]+$/i.test(kind)) {
//             return `${base}${kind.slice(0, -1)}.${kind.slice(-1)}`;
//         }
//         return `${base}.${kind}`;
//     }

//     return formatted;
// }

// /**
//  * ✅ Main Service: Fetch patent data
//  */
// async function getPatentData(patentNumber) {
//     const formattedNumber = formatPatentNumberWithDot(patentNumber);
//     const token = await getAccessToken();

//     const headers = {
//         Authorization: `Bearer ${token}`,
//         Accept: "application/xml",
//     };

//     const familyUrl = `https://ops.epo.org/3.2/rest-services/family/publication/docdb/${formattedNumber}`;
//     const biblioUrl = `https://ops.epo.org/3.2/rest-services/published-data/publication/docdb/${formattedNumber}/biblio`;

//     const [biblioResponse, familyResponse] = await Promise.all([
//         axios.get(biblioUrl, { headers }),
//         axios.get(familyUrl, { headers }),
//     ]);

//     const parser = new xml2js.Parser({
//         explicitArray: false,
//         tagNameProcessors: [xml2js.processors.stripPrefix],
//     });

//     const biblioData = await parser.parseStringPromise(biblioResponse.data);
//     const familyData = await parser.parseStringPromise(familyResponse.data);

//     const bibliographicData = biblioData?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.["bibliographic-data"]

//     // ✅ Apply utils to clean/transform the data
//     return {
//         patentNumber,
//         abstract: getEnglishAbstract(biblioData),
//         priorities: getPriorityDates(bibliographicData),
//         ipcCode: extractIPCCode(bibliographicData),
//         inventors: getCleanPartyNames(bibliographicData),
//         applicants: getCleanPartyNames(bibliographicData),
//         family: mapFamilyMemberData({ familyData }),
//         raw: { biblioData, familyData },
//     };
// }

// module.exports = { getPatentData };
