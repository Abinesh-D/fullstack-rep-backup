const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const extractKeyEvents = ($) => {
    const events = [];

    $('dd[itemprop="events"][itemscope]').each((_, el) => {
        const date = $(el).find('time[itemprop="date"]').attr('datetime') || '';
        const title = $(el).find('span[itemprop="title"]').text().trim();
        const type = $(el).find('span[itemprop="type"]').text().trim();
        events.push({ date, title, type });
    });

    const getEvent = (filterFn) => {
        const e = events.find(filterFn);
        return { date: e?.date || '', title: e?.title || '' };
    };

    const publicationEvents = events.filter(e => /Publication of/i.test(e.title));

    return {
        applicationFiledDate: getEvent(e => /filed/i.test(e.type)).date,
        applicationFiledTitle: getEvent(e => /filed/i.test(e.type)).title,

        priorityDate: getEvent(e => /priority/i.test(e.type)).date,
        priorityTitle: getEvent(e => /priority/i.test(e.type)).title,

        publicationDate: publicationEvents[0]?.date || '',

        grantDate: getEvent(e => /granted/i.test(e.type)).date,
        grantTitle: getEvent(e => /granted/i.test(e.type)).title,

        statusTitle: getEvent(e => /legal-status/i.test(e.type) && /Active/i.test(e.title)).title || ''
    };
};

const getGooglePatentData = async (patentNumber) => {
    const url = `https://patents.google.com/patent/${patentNumber}/en`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });

        const $ = cheerio.load(response.data);

        const title = $('meta[name="DC.title"]').attr('content') || $('span[itemprop="title"]').text().trim();
        const abstract = $('div.abstract').text().trim();

        const eventsData = extractKeyEvents($);

        const inventors = [];
        $('dd[itemprop="inventor"]').each((i, el) => {
            inventors.push($(el).text().trim());
        });

        const assignees = [];
        $('dd[itemprop="assigneeOriginal"]').each((i, el) => {
            assignees.push($(el).text().trim());
        });

        const classifications = [];
        $('section h2:contains("Classifications")')
            .nextAll('ul')
            .find('ul[itemprop="classifications"]')
            .each((_, classificationGroup) => {
                const path = [];
                $(classificationGroup)
                    .find('> li[itemprop="classifications"]')
                    .each((__, li) => {
                        const code = $(li).find('span[itemprop="Code"]').text().trim();
                        const desc = $(li).find('span[itemprop="Description"]').text().trim();
                        if (code && desc) path.push({ [code]: desc });

                        const isLeaf = $(li).find('meta[itemprop="Leaf"]').length > 0;
                        const lastItem = path[path.length - 1];
                        const lastValue = lastItem ? Object.values(lastItem)[0] : null;

                        if (isLeaf && code) {
                            classifications.push({
                                leafCode: code,
                                leafCodeDefinition: lastValue,
                                hierarchy: [...path],
                            });
                        }
                    });
            });

        return {
            patentNumber: patentNumber || '',
            title: title || '',
            pageUrl: url || '',
            abstract: abstract || '',
            inventors: inventors || '',
            assignees: assignees || '',
            applicationDate: eventsData.applicationFiledDate || '',
            priorityDate: eventsData.priorityDate || '',
            publicationDate: eventsData.publicationDate || '',
            classifications: classifications || ''
        };

    } catch (error) {
        console.error('Error fetching or parsing:', error.message);
        return { error: error.message };
    }
};

router.get('/:patentNumber', async (req, res) => {
    const { patentNumber } = req.params;

    if (!patentNumber) {
        return res.status(400).json({ error: 'Patent number is required' });
    }

    try {
        const result = await getGooglePatentData(patentNumber);
        if (result.error) {
            return res.status(500).json({ error: result.error });
        }
        res.status(200).json(result);
    } catch (error) {
        console.error('🔴 Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');

// // Utility to extract a field value from metadata
// // const getMetaContent = ($, label) => {
// //     return $(`meta[itemprop="${label}"]`).attr('content') || '';
// // };



// const extractDatesFromEvents = ($) => {
//     const events = [];

//     $('tr[itemprop="publication"]') 
//         .each((_, row) => {
//             const eventText = $(row).text().trim();
//             const dateMatch = eventText.match(/\d{4}-\d{2}-\d{2}/); 
//             if (dateMatch) {
//                 events.push({
//                     date: dateMatch[0],
//                     description: eventText.replace(/\s+/g, ' ').trim(),
//                 });
//             }
//         });

//     $('section#events tr')
//         .each((_, row) => {
//             const eventText = $(row).text().trim();
//             const dateMatch = eventText.match(/\d{4}-\d{2}-\d{2}/); 
//             if (dateMatch) {
//                 events.push({
//                     date: dateMatch[0],
//                     description: eventText.replace(/\s+/g, ' ').trim(),
//                 });
//             }
//         });

//     const priorityEvent = events.find(e => /Priority to/i.test(e.description));
//     const filingEvent = events.find(e => /Application filed/i.test(e.description));
//     const publicationEvent = events.find(e => /Publication of .*A1/i.test(e.description));
//     const grantEvent = events.find(e => /Application granted/i.test(e.description));
//     const expirationEvent = events.find(e => /expiration/i.test(e.description));

//     return {
//         filingDate: filingEvent?.date || '',
//         priorityDate: priorityEvent?.date || '',
//         publicationDate: publicationEvent?.date || '',
//         grantDate: grantEvent?.date || '',
//         expirationDate: expirationEvent?.date || '',
//         allEvents: events, 
//     };
// };




// const getGooglePatentData = async (patentNumber) => {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0',
//             },
//         });

//         const $ = cheerio.load(response.data);

//         const title = $('meta[name="DC.title"]').attr('content') || $('span[itemprop="title"]').text().trim();

//         const abstract = $('div.abstract').text().trim();

//         const eventDates = extractDatesFromEvents($);

//         const inventors = [];
//         $('dd[itemprop="inventor"]').each((i, el) => {
//             inventors.push($(el).text().trim());
//         });

//         const assignees = [];
//         $('dd[itemprop="assigneeOriginal"]').each((i, el) => {
//             assignees.push($(el).text().trim());
//         });

//         const classifications = [];
//         $('section h2:contains("Classifications")')
//             .nextAll('ul')
//             .find('ul[itemprop="classifications"]')
//             .each((_, classificationGroup) => {
//                 const path = [];
//                 $(classificationGroup)
//                     .find('> li[itemprop="classifications"]')
//                     .each((__, li) => {
//                         const code = $(li).find('span[itemprop="Code"]').text().trim();
//                         const desc = $(li).find('span[itemprop="Description"]').text().trim();
//                         if (code && desc) path.push({ [code]: desc });

//                         const isLeaf = $(li).find('meta[itemprop="Leaf"]').length > 0;
//                         const lastItem = path[path.length - 1];
//                         const lastValue = lastItem ? Object.values(lastItem)[0] : null;

//                         if (isLeaf && code) {
//                             classifications.push({
//                                 leafCode: code,
//                                 leafCodeDefinition: lastValue,
//                                 hierarchy: [...path],
//                             });
//                         }
//                     });
//             });


//         return {
//             patentNumber,
//             title,
//             abstract,
//             inventors,
//             assignees,
//             publicationDate: eventDates.publicationDate,
//             filingDate: eventDates.filingDate,
//             priorityDate: eventDates.priorityDate,
//             grantDate: eventDates.grantDate,
//             expirationDate: eventDates.expirationDate,
//             classifications,
//             allEvents: eventDates.allEvents
//         };

//     } catch (error) {
//         console.error('Error fetching or parsing:', error.message);
//         return { error: error.message };
//     }
// };



// router.get('/:patentNumber', async (req, res) => {
//     const { patentNumber } = req.params;

//     if (!patentNumber) {
//         return res.status(400).json({ error: 'Patent number is required' });
//     }

//     try {
//         const result = await getGooglePatentData(patentNumber);
//         if (result.error) {
//             return res.status(500).json({ error: result.error });
//         }
//         res.status(200).json(result);
//     } catch (error) {
//         console.error('🔴 Error:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// module.exports = router;












// Workinh CPC api
// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');

// const getCPCDefinitions = async (patentNumber) => {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0',
//             },
//         });

//         const $ = cheerio.load(response.data);
//         const resultArray = [];

//         $('section h2:contains("Classifications")')
//             .nextAll('ul')
//             .find('ul[itemprop="classifications"]')
//             .each((_, classificationGroup) => {
//                 const path = [];

//                 $(classificationGroup)
//                     .find('> li[itemprop="classifications"]')
//                     .each((__, li) => {
//                         const code = $(li).find('span[itemprop="Code"]').text().trim();
//                         const desc = $(li).find('span[itemprop="Description"]').text().trim();
//                         if (code && desc) {
//                             path.push({ [code]: desc });
//                         }
//                         const isLeaf = $(li).find('meta[itemprop="Leaf"]').length > 0;
//                         const lastItem = path[path.length - 1];
//                         const lastValue = Object.values(lastItem)[0];

//                         if (isLeaf && code) {
//                             resultArray.push({
//                                 leafCode: code,
//                                 leafCodeDefinition: lastValue,
//                                 hierarchy: [...path]
//                             });
//                         }
//                     });
//             });

//         return resultArray;
//     } catch (error) {
//         console.error('Error fetching or parsing:', error.message);
//         return { error: error.message };
//     }
// };


// router.get('/:patentNumber', async (req, res) => {
//     const { patentNumber } = req.params;

//     if (!patentNumber) {
//         return res.status(400).json({ error: 'Patent number is required' });
//     }

//     try {
//         const result = await getCPCDefinitions(patentNumber);
//         res.status(200).json(result);
//     } catch (error) {
//         console.error('🔴 Error fetching CPC definitions:', error.message);
//         res.status(500).json({ error: 'Failed to fetch CPC definitions' });
//     }
// });

// module.exports = router;














// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const axiosRetry = require('axios-retry');
// const cheerio = require('cheerio');
// const https = require('https');

// // Setup HTTP Keep-Alive agent
// const httpsAgent = new https.Agent({ keepAlive: true });

// // Retry failed requests automatically
// axiosRetry(axios, {
//     retries: 3,
//     retryDelay: axiosRetry.exponentialDelay,
//     retryCondition: (error) =>
//         axiosRetry.isNetworkError(error) ||
//         axiosRetry.isRetryableError(error) ||
//         error.response?.status === 429, // too many requests
// });

// // Basic in-memory cache (simple TTL logic can be added)
// const cache = new Map();

// const getCPCDefinitions = async (patentNumber) => {
//     if (cache.has(patentNumber)) {
//         return cache.get(patentNumber);
//     }

//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     try {
//         const response = await axios.get(url, {
//             headers: {
//                 'User-Agent': 'Mozilla/5.0',
//             },
//             timeout: 10000,
//             httpsAgent,
//         });

//         const $ = cheerio.load(response.data);
//         const resultArray = [];

//         const classificationSections = $('section h2:contains("Classifications")')
//             .nextAll('ul')
//             .find('ul[itemprop="classifications"]');

//         if (classificationSections.length === 0) {
//             return []; // No classification section found
//         }

//         classificationSections.each((_, group) => {
//             const path = [];
//             const listItems = $(group).children('li[itemprop="classifications"]');

//             listItems.each((__, li) => {
//                 const $li = $(li);
//                 const code = $li.find('span[itemprop="Code"]').text().trim();
//                 const desc = $li.find('span[itemprop="Description"]').text().trim();

//                 if (code && desc) {
//                     path.push({ [code]: desc });
//                 }

//                 const isLeaf = $li.find('meta[itemprop="Leaf"]').length > 0;
//                 if (isLeaf && code) {
//                     resultArray.push({
//                         leafCode: code,
//                         hierarchy: [...path],
//                     });
//                 }
//             });
//         });

//         cache.set(patentNumber, resultArray); // Save to cache
//         return resultArray;
//     } catch (error) {
//         console.error('❌ Error fetching/parsing:', error.message);
//         return { error: error.message };
//     }
// };

// // GET route
// router.get('/:patentNumber', async (req, res) => {
//     const { patentNumber } = req.params;

//     // Validate input format (basic)
//     if (!patentNumber || !/^[A-Z]{2}[0-9A-Z]+$/i.test(patentNumber)) {
//         return res.status(400).json({ error: 'Invalid or missing patent number' });
//     }

//     try {
//         const result = await getCPCDefinitions(patentNumber);

//         if (result.error) {
//             return res.status(500).json({ error: result.error });
//         }

//         res.status(200).json(result);
//     } catch (error) {
//         console.error('🔴 Server error:', error.message);
//         res.status(500).json({ error: 'Failed to fetch CPC definitions' });
//     }
// });

// module.exports = router;































// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const cheerio = require('cheerio');


// const getCPCDefinitions = async (patentNumber) => {
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;

//   try {
//     const response = await axios.get(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0',
//       },
//     });

//     const $ = cheerio.load(response.data);

//     const result = {};
//     const seenPaths = new Set();

//     $('section h2:contains("Classifications")')
//       .nextAll('ul')
//       .each((i, ul) => {
//         const stack = [];
//         $(ul)
//           .find('li[itemprop="classifications"]')
//           .each((j, li) => {
//             const code = $(li).find('span[itemprop="Code"]').text().trim();
//             const desc = $(li).find('span[itemprop="Description"]').text().trim();

//             if (!code || !desc) return;

//             stack.push({ [code]: desc });

//             if ($(li).find('meta[itemprop="Leaf"]').length > 0) {
//               const fullCode = code;
//               if (!seenPaths.has(fullCode)) {
//                 result[fullCode] = [...stack];
//                 seenPaths.add(fullCode);
//               }
//               stack.pop();
//             }
//           });
//       });

//     return result;
//   } catch (error) {
//     console.error('Error fetching or parsing:', error.message);
//   }
// };





// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;

//   if (!patentNumber) {
//     return res.status(400).json({ error: 'Patent number is required' });
//   }

//   try {
//     const result = await getCPCDefinitions(patentNumber);
//     res.status(200).json(result);
//   } catch (error) {
//     console.error('🔴 Error fetching CPC definitions:', error.message);
//     res.status(500).json({ error: 'Failed to fetch CPC definitions' });
//   }
// })

// module.exports = router;