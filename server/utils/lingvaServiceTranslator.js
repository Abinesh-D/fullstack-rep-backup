const axios = require("axios");
const translationCache = new Map();

async function lingaTranslateText(text) {
    if (!text) return "";
    if (translationCache.has(text)) {
        return translationCache.get(text);
    }

    try {
        const url = `https://lingva.ml/api/v1/auto/en/${encodeURIComponent(text)}`;
        const response = await axios.get(url, { timeout: 10000 });
        const translated = response.data?.translation?.trim() || text;
        translationCache.set(text, translated); 
        return translated;
    } catch (error) {
        if (error.response) {
            console.error("Lingva API error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("Lingva API no response:", error.request);
        } else {
            console.error("Lingva API request error:", error.message);
        }
        return text; 
    }
}

module.exports = { lingaTranslateText };















// const axios = require("axios");

// async function lingaTranslateText(text) {
//     try {
//         const url = `https://lingva.ml/api/v1/auto/en/${encodeURIComponent(text)}`;
//         const response = await axios.get(url);

//         const translated = response.data?.translation;
//         return translated && translated.trim() !== "" ? translated : text;
//     } catch (error) {
//         if (error.response) {
//             console.error("Lingva API error:", error.response.status, error.response.data);
//         } else if (error.request) {
//             console.error("Lingva API no response:", error.request);
//         } else {
//             console.error("Lingva API request error:", error.message);
//         }
//         return text;
//     }
// }

// module.exports = { lingaTranslateText };












// const axios = require("axios");

// const api = axios.create({
//     baseURL: process.env.LINGVA_BASE_URL,
//     timeout: 5000,
//     headers: {
//         "User-Agent": "Lingva-Client/1.0",
//     },
// });


// async function lingaTranslateText(text) {
//     if (!text || typeof text !== "string") {
//         throw new Error("Text must be a non-empty string");
//     }

//     try {
//         const url = `/auto/en/${encodeURIComponent(text)}`;
//         const { data } = await api.get(url);

//         return {
//             translation: data.translation,
//             detectedSource: data.info?.detectedSource || sourceLang,
//         };
//     } catch (error) {
//         if (error.response) {
//             console.error("Lingva API error:", error.response.status, error.response.data);
//         } else if (error.request) {
//             console.error("Lingva API no response:", error.request);
//         } else {
//             console.error("Lingva API request error:", error.message);
//         }
//         throw new Error("Failed to fetch translation");
//     }
// }

// module.exports = { lingaTranslateText };










// const axios = require("axios");


// async function translateText(text) {
//     try {
//         const url = `${process.env.LINGVA_BASE_URL}/auto/en/${encodeURIComponent(text)}`;
//         const response = await axios.get(url);

//         return {
//             translation: response.data.translation,
//             detectedSource: response.data.info?.detectedSource || sourceLang,
//         };
//     } catch (error) {
//         console.error("Translation error:", error.message);
//         throw new Error("Failed to fetch translation");
//     }
// }

// module.exports = { translateText };
