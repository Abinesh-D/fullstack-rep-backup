const express = require('express');
const router = express.Router();
const getPatentData = require('../utils/getPatentData');

router.get('/:patentNumber', async (req, res) => {
  const { patentNumber } = req.params;

  try {
    const data = await getPatentData(patentNumber.trim());
    res.json(data);
  } catch (err) {
    console.error('Scrape error:', err.message);
    res.status(500).json({ error: 'Scraping failed', details: err.message });
  }
});

module.exports = router;










// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { franc } = require('franc');
// const langs = require('langs');
// const translateToEnglish = require('../translate/Translate');

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     let title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     let uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(', ').trim();

//     let inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .filter(Boolean)
//       .join('; ') || 'Not found';

//     let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     let bibliographicData = {
//       title,
//       abstract,
//       assignee: uniqueAssignee,
//       inventors
//     };

//     let translationFlags = {
//       title_translated: false,
//       abstract_translated: false,
//       assignee_translated: false,
//       inventors_translated: false
//     };

//     for (const [key, value] of Object.entries(bibliographicData)) {
//       if (value && value !== 'Not found') {
//         const langCode = franc(value);

//         if (langCode === 'und') {
//           console.log(`${key}: Could not detect language. Skipping translation.`);
//         } else {
//           const language = langs.where('3', langCode);
//           console.log(`${key}: Detected language -`, language?.name || 'Unknown');

//           if (language && language.name === 'English') {
//             console.log(`${key}: Already in English.`);
//           } else {
//             try {
//               const translatedValue = await translateToEnglish(value);
//               bibliographicData[key] = translatedValue;
//               translationFlags[`${key}_translated`] = true;
//               console.log(`${key}: Translated to English.`);
//             } catch (err) {
//               console.error(`${key}: Translation error:`, err.message);
//             }
//           }
//         }
//       } else {
//         console.log(`${key}: Not found or empty.`);
//       }
//     }

//     ({ title, abstract, assignee: uniqueAssignee, inventors } = bibliographicData);

//     const priorityDate = getTextByLabel('Priority date');

//     const ipc = $('section#internationalClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const cpc = $('section#cpcClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();

//     const family_member = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

//     let familyMembers = [];
//     $('section.related-publications a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       title_translated: translationFlags.title_translated,
//       inventors,
//       inventors_translated: translationFlags.inventors_translated,
//       assignee: uniqueAssignee,
//       assignee_translated: translationFlags.assignee_translated,
//       abstract,
//       abstract_translated: translationFlags.abstract_translated,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       IPC,
//       family_member,
//       family: familyMembers.join(', ') || 'Not found'
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const { franc } = require('franc');
// const langs = require('langs');
// const translateToEnglish = require('../translate/Translate');

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     let title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     let uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(' ').trim();

//     let inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .join('; ') || 'Not found';

//     let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     // --- Dynamic language detection & translation for all relevant fields ---
//     let bibliographicData = {
//       title,
//       abstract,
//       assignee: uniqueAssignee,
//       inventors
//     };

//     for (const [key, value] of Object.entries(bibliographicData)) {
//       if (value && value !== 'Not found') {
//         const langCode = franc(value);

//         if (langCode === 'und') {
//           console.log(`${key}: Could not detect language. Skipping translation.`);
//         } else {
//           const language = langs.where('3', langCode);
//           console.log(`${key}: Detected language -`, language?.name || 'Unknown');

//           if (language && language.name === 'English') {
//             console.log(`${key}: Already in English. No translation needed.`);
//           } else {
//             try {
//               const translatedValue = await translateToEnglish(value);
//               bibliographicData[key] = translatedValue;
//               console.log(`${key}: Translated to English.`);
//             } catch (err) {
//               console.error(`${key}: Translation error:`, err.message);
//             }
//           }
//         }
//       } else {
//         console.log(`${key}: Not found or empty.`);
//       }
//     }

//     // Destructure updated fields back
//     ({ title, abstract, assignee: uniqueAssignee, inventors } = bibliographicData);

//     const priorityDate = getTextByLabel('Priority date');

//     const ipc = $('section#internationalClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const cpc = $('section#cpcClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();

//     const family_member = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

//     let familyMembers = [];
//     $('section.related-publications a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee: uniqueAssignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       IPC,
//       family_member,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;











// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const {franc} = require('franc');
// const langs = require('langs');
// const translateToEnglish = require("../translate/Translate"); 

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     const title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     const uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(' ').trim();

//     let inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .join('; ');

 

//       if (inventors !== 'Not found') {
//         const langCode = franc(inventors);
      
//         if (langCode === 'und') {
//           console.log('Could not detect language. Skipping translation.');
//         } else {
//           const language = langs.where('3', langCode);
//           console.log('language :>> ', language);
      
//           if (language && language.name === 'English') {
//             console.log('Language is already English. No translation needed.');
//           } else {
//             try {
//               inventors = await translateToEnglish(inventors);
//             } catch (err) {
//               console.error('Translation error:', err.message);
//             }
//           }
//         }
//       }
    

//     const priorityDate = getTextByLabel('Priority date');

//     let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     const ipc = $('section#internationalClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const cpc = $('section#cpcClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();
//     const family = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

//     console.log('IPC :>> ', IPC);

//   let familyMembers = [];
//   $('section.related-publications a').each((_, el) => {
//     const text = $(el).text().trim();
//     if (text) familyMembers.push(text);
//   });


//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee: uniqueAssignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       IPC,
//       family,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;










// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const franc = require('franc');
// const langs = require('langs');
// const translateToEnglish = require("../translate/Translate"); 

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     const title = getMeta('DC.title');

//     // Log the entire HTML to inspect country info
//     console.log(data);

//     // Try to get country info again (maybe using a more specific selector)
//     const countryInfo = getTextByLabel('Country');
//     console.log('countryInfo :>> ', countryInfo);

//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     const uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(' ').trim();

//     let inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .join('; ');

//     if (inventors !== 'Not found') {
//       const langCode = franc(inventors);
    
//       if (langCode === 'und') {
//         console.log('Could not detect language. Skipping translation.');
//       } else {
//         const language = langs.where('3', langCode);
//         console.log('language :>> ', language);
    
//         if (language && language.name === 'English') {
//           console.log('Language is already English. No translation needed.');
//         } else {
//           try {
//             inventors = await translateToEnglish(inventors);
//           } catch (err) {
//             console.error('Translation error:', err.message);
//           }
//         }
//       }
//     }

//     const priorityDate = getTextByLabel('Priority date');

//     let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     const ipc = $('section#internationalClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')) // Clean up spacing
//       .get()
//       .join('; ') || 'Not found';

//     const cpc = $('section#cpcClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')) // Clean up spacing
//       .get()
//       .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     let familyMembers = [];
//     $('section.related-publications a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       countryInfo,  // Include country info in the response
//       inventors,
//       assignee: uniqueAssignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;



















// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');
// const translateToEnglish = require("../translate/Translate"); // Assuming this is your translation function

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     // Helper function to get meta tags
//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     // Helper function to get text by label
//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     // Helper function to get text by possible labels
//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     // Fetching fields
//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     const title = getMeta('DC.title');

//     // Getting contributors
//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     const uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(' ').trim();

//     // Filtering out assignee name from contributors
//     let inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .join('; ');

//     // Translate inventors to English
//     if (inventors !== 'Not found') {
//       inventors = await translateToEnglish(inventors); // Assuming translateToEnglish can handle a string input
//     }

//     const priorityDate = getTextByLabel('Priority date');

//     // Fetching abstract
//     let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     // Fetching IPC classifications
//     const ipc = $('section#internationalClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     // Fetching CPC classifications
//     const cpc = $('section#cpcClassification tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     // Fetching family members (related publications)
//     let familyMembers = [];
//     $('section.related-publications a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee: uniqueAssignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;








// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const translateToEnglish = require("../translate/Translate")
// const cheerio = require('cheerio');

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     const title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');
//     const uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(' ').trim();

//     const inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//       .join('; ');


//       console.log('inventors :>> ', inventors);

//     const priorityDate = getTextByLabel('Priority date');

//     const abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     const ipc = $('section[itemprop="internationalClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const cpc = $('section[itemprop="cpcClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     let familyMembers = [];
//     $('section.related-publications td a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });


//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee: uniqueAssignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');




// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);

    
//     const publicationDate = getTextByLabel('Publication date');
    

//     const title = getMeta('DC.title');
//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');

//     const inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== assignee.trim().toLowerCase())
//       .join('; ');

//     const priorityDate = getTextByLabel('Priority date');
//     const abstract = $('div.abstract').text().trim() || 'Not found';

//     const ipc = $('section[itemprop="internationalClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const cpc = $('section[itemprop="cpcClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     let familyMembers = [];
//     $('section.related-publications td a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;











// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');




// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);

    
//     const publicationDate = getTextByLabel('Publication date');
    

//     const title = getMeta('DC.title');
//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');

//     const inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== assignee.trim().toLowerCase())
//       .join('; ');

//     const priorityDate = getTextByLabel('Priority date');
//     const abstract = $('div.abstract').text().trim() || 'Not found';

//     const ipc = $('section[itemprop="internationalClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const cpc = $('section[itemprop="cpcClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     let familyMembers = [];
//     $('section.related-publications td a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;











// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');




// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';

//     const getTextByLabel = (label) => {
//       const dt = $(`dt:contains("${label}")`);
//       return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };

//     const getTextByPossibleLabels = (labels) => {
//       for (let label of labels) {
//         const dt = $(`dt:contains("${label}")`);
//         if (dt.length) {
//           return dt.next('dd').text().trim();
//         }
//       }
//       return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);

    
//     const publicationDate = getTextByLabel('Publication date');
    

//     const title = getMeta('DC.title');
//     const rawContributors = $('meta[name="DC.contributor"]')
//       .map((_, el) => $(el).attr('content'))
//       .get()
//       .filter(Boolean);

//     const assignee = getTextByLabel('Assignee');

//     const inventors = rawContributors
//       .filter(name => name.trim().toLowerCase() !== assignee.trim().toLowerCase())
//       .join('; ');

//     const priorityDate = getTextByLabel('Priority date');
//     const abstract = $('div.abstract').text().trim() || 'Not found';

//     const ipc = $('section[itemprop="internationalClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const cpc = $('section[itemprop="cpcClassification"] tbody tr')
//       .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//       .get()
//       .join('; ') || '';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';

//     let familyMembers = [];
//     $('section.related-publications td a').each((_, el) => {
//       const text = $(el).text().trim();
//       if (text) familyMembers.push(text);
//     });

//     res.json({
//       publicationNo: patentNumber,
//       title,
//       inventors,
//       assignee,
//       publicationDate,
//       applicationDate,
//       priorityDate,
//       ipc_cpc,
//       family: familyMembers.join(', ') || 'Not found',
//       abstract
//     });

//   } catch (err) {
//     console.error('Scrape error:', err.message);
//     res.status(500).json({
//       error: 'Scraping failed',
//       details: err.message
//     });
//   }
// });

// module.exports = router;