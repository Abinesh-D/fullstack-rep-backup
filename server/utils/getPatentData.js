const axios = require('axios');
const cheerio = require('cheerio');
const { franc } = require('franc');
const langs = require('langs');
const translateToEnglish = require('../translate/Translate');
const countryCodeMap = require("../utils/countryCodeMAp");
const puppeteer = require('puppeteer');
const fetchFamilyPatentDataResults = require("../routes/gleFamilyMembersRoutes");


const getPatentData = async (patentNumber) => {
    const url = `https://patents.google.com/patent/${patentNumber}/en`;
    const { data } = await axios.get(url);

    const dataResultFamilyMembers = await fetchFamilyPatentDataResults(patentNumber);
  
    const $ = cheerio.load(data);
    const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';
    const getTextByLabel = (label) => {
        const dt = $(`dt:contains("${label}")`);
        return dt.length ? dt.next('dd').text().trim() : 'Not found';
    };
    const getTextByPossibleLabels = (labels) => {
        for (let label of labels) {
            const dt = $(`dt:contains("${label}")`);
            if (dt.length) return dt.next('dd').text().trim();
        }
        return 'Not found';
    };

    const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
    const publicationDate = getTextByLabel('Publication date');
    let title = getMeta('DC.title');
    const rawContributors = $('meta[name="DC.contributor"]')
        .map((_, el) => $(el).attr('content'))
        .get()
        .filter(Boolean);

    const cleanAssignee = (raw) => {
        let parts = raw.split(/\s+/);
        let seen = new Set();
        let result = [];

        for (let word of parts) {
            if (!seen.has(word)) {
                seen.add(word);
                result.push(word);
            }
        }
        return result.join(' ').trim();
    };

    let assigneeRaw = getTextByLabel('Assignee');
    let uniqueAssignee = cleanAssignee(assigneeRaw);

    const lowerAssignee = uniqueAssignee.toLowerCase();
    const inventors = rawContributors
        .filter(name => !lowerAssignee.includes(name.trim().toLowerCase()))
        .filter(Boolean)
        .join('; ') 
        || 'Not found';

    // const abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';
    const getAbstractWithPuppeteer = async (patentNumber) => {
        const url = `https://patents.google.com/patent/${patentNumber}/en`;

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        await page.waitForSelector('section#abstract patent-text section abstract');

        const abstract = await page.evaluate(() => {
            const el = document.querySelector('section#abstract patent-text section abstract div');
            return el ? el.innerText.trim() : 'Not found';
        });

        await browser.close();
        return abstract;
    };    
      
      const abstract = await getAbstractWithPuppeteer(patentNumber);

    let bibliographicData = {
        title,
        abstract,
        assignee: uniqueAssignee,
        inventors
    };

    let translationFlags = {
        title_translated: false,
        abstract_translated: false,
        assignee_translated: false,
        inventors_translated: false
    };
    const manualLanguageCheck = (text) => {
        const isKorean = /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
        return isKorean ? 'ko' : franc(text);
    };

    for (const [key, value] of Object.entries(bibliographicData)) {
        if (value && value !== 'Not found') {
            let langCode = manualLanguageCheck(value);

            if (langCode !== 'und' && langCode !== 'en') {
                const language = langs.where('3', langCode);
                if (language?.name !== 'English') {
                    const translatedValue = await translateToEnglish(value);
                    bibliographicData[key] = translatedValue;
                    translationFlags[`${key}_translated`] = true;
                }
            }
        }
    }

    if (uniqueAssignee && uniqueAssignee !== 'Not found') {
        const langCode = franc(uniqueAssignee);
        if (langCode !== 'und') {
            const language = langs.where('3', langCode);
            if (language?.name !== 'English') {
                const translatedAssignee = await translateToEnglish(uniqueAssignee);
                bibliographicData.assignee = translatedAssignee;
                translationFlags.assignee_translated = true;
            }
        }
    }
    const priorityDate = getTextByLabel('Priority date');

    const getCountryCode = (patentNumber) => {
        const regex = /^[A-Za-z]+/;
        const match = patentNumber.match(regex);
        return match ? match[0] : null;
    }
    const patentOffice = getCountryCode(patentNumber);
    const countryCode = countryCodeMap[patentOffice] || 'Unknown';
    const viewerUrl = `https://patents.google.com/patent/${patentNumber}/en`;


    // let mostSpecificClassifications = [];
    // try {
    //     const classificationRes = await axios.get(`http://localhost:8000/api/classification/${patentNumber}`);
    //     mostSpecificClassifications = classificationRes.data?.mostSpecificClassifications || [];
    // } catch (err) {
    //     console.warn('Failed to fetch classifications:', err.message);
    // }



    // const ipc = $('section#internationalClassification tbody tr')
    //     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')) 
    //     .get()
    //     .join('; ') || 'Not found';

    // const cpc = $('section#cpcClassification tbody tr')
    //     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
    //     .get()
    //     .join('; ') || 'Not found';

    // const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';
    // const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();

  


    return {
        patentNumber: patentNumber,
        ...bibliographicData,
        ...translationFlags,
        publicationDate: publicationDate,
        applicationDate: applicationDate,
        priorityDate: priorityDate,
        // cpc: ipc_cpc,
        // ipc: IPC,
        url: viewerUrl,
        country: countryCode,
        family: dataResultFamilyMembers.join('; ') || 'Not found',
        // classificationCode: mostSpecificClassifications,
    };
};

module.exports = getPatentData;













// const axios = require('axios');
// const cheerio = require('cheerio');
// const { franc } = require('franc');
// const langs = require('langs');
// const translateToEnglish = require('../translate/Translate');
// const countryCodeMap = require("../utils/countryCodeMAp");

// const getPatentData = async (patentNumber) => {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);
//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';
//     const getTextByLabel = (label) => {
//         const dt = $(`dt:contains("${label}")`);
//         return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };
//     const getTextByPossibleLabels = (labels) => {
//         for (let label of labels) {
//             const dt = $(`dt:contains("${label}")`);
//             if (dt.length) return dt.next('dd').text().trim();
//         }
//         return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     let title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//         .map((_, el) => $(el).attr('content'))
//         .get()
//         .filter(Boolean);

//     const cleanAssignee = (raw) => {
//         let parts = raw.split(/\s+/);
//         let seen = new Set();
//         let result = [];

//         for (let word of parts) {
//             if (!seen.has(word)) {
//                 seen.add(word);
//                 result.push(word);
//             }
//         }

//         return result.join(' ').trim();
//     };

//     let assigneeRaw = getTextByLabel('Assignee');
//     let uniqueAssignee = cleanAssignee(assigneeRaw);

//     const lowerAssignee = uniqueAssignee.toLowerCase();
//     const inventors = rawContributors
//         .filter(name => !lowerAssignee.includes(name.trim().toLowerCase()))
//         .filter(Boolean)
//         .join('; ') || 'Not found';

//     const abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     let bibliographicData = {
//         title,
//         abstract,
//         assignee: uniqueAssignee,
//         inventors
//     };

//     let translationFlags = {
//         title_translated: false,
//         abstract_translated: false,
//         assignee_translated: false,
//         inventors_translated: false
//     };

//     const manualLanguageCheck = (text) => {
//         const isKorean = /[\u3131-\u3163\uac00-\ud7a3]/.test(text);
//         return isKorean ? 'ko' : franc(text);
//     };

//     for (const [key, value] of Object.entries(bibliographicData)) {
//         if (value && value !== 'Not found') {
//             let langCode = manualLanguageCheck(value); 

//             if (langCode !== 'und' && langCode !== 'en') {
//                 const language = langs.where('3', langCode);
//                 if (language?.name !== 'English') {
//                     const translatedValue = await translateToEnglish(value);
//                     bibliographicData[key] = translatedValue;
//                     translationFlags[`${key}_translated`] = true;
//                 }
//             }

//             if (uniqueAssignee && uniqueAssignee !== 'Not found') {
//                 const langCode = franc(uniqueAssignee);
//                 if (langCode !== 'und') {
//                     const language = langs.where('3', langCode);
//                     if (language?.name !== 'English') {
//                         const translatedAssignee = await translateToEnglish(uniqueAssignee);
//                         bibliographicData.assignee = translatedAssignee;
//                         translationFlags.assignee_translated = true;
//                     }
//                 }
//             }
            
//         }
//     }

//     const priorityDate = getTextByLabel('Priority date');
    // const ipc = $('section#internationalClassification tbody tr')
    //     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' ')) 
    //     .get()
    //     .join('; ') || 'Not found';

    // const cpc = $('section#cpcClassification tbody tr')
    //     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
    //     .get()
    //     .join('; ') || 'Not found';

    // const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';
    // const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();
    // const family_member = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

    // let familyMembers = [];
    // $('section.related-publications a').each((_, el) => {
    //     const text = $(el).text().trim();
    //     if (text) familyMembers.push(text);
    // });

//     const getCountryCode = (patentNumber) => {
//         const match = patentNumber.match(/^[A-Z]{2}/);
//         return match ? match[0] : 'Unknown';
//     };

//     const patentOffice = getCountryCode(patentNumber);
//     const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//     const viewerUrl = `https://patents.google.com/patent/${patentNumber}/en`;

//     return {
//         publicationNo: patentNumber,
//         ...bibliographicData,
//         ...translationFlags,
//         publicationDate,
//         applicationDate,
//         priorityDate,
//         ipc_cpc,
//         IPC,
//         viewerUrl,
//         countryCode,
//         family_member,
//         family: familyMembers.join(', ') || 'Not found',
//     };
// };

// module.exports = getPatentData;










































       // --- 2. Use Puppeteer to extract CPC codes from the correct tag structure ---
    //    const browser = await puppeteer.launch({ headless: true });
    //    const page = await browser.newPage();
    //    await page.goto(url, { waitUntil: 'domcontentloaded' });
   
    //    await page.waitForSelector('section#classifications classification-viewer classification-tree');
   
    //    const classifications = await page.evaluate(() => {
    //      const treeElements = document.querySelectorAll(
    //        'section#classifications classification-viewer classification-tree'
    //      );
   
    //      const cpcValues = [];
   
    //      treeElements.forEach(tree => {
    //        const modifiers = tree.querySelectorAll('state-modifier.code.style-scope.classification-tree');
    //        modifiers.forEach(mod => {
    //          const code = mod.getAttribute('data-cpc');
    //          if (code && code.includes('/')) {
    //            cpcValues.push(code);
    //          }
    //        });
    //      });
   
    //      return cpcValues;
    //    });
   
    //    await browser.close();
   
    //    // --- 3. Group and extract most specific classifications ---
    //    const groups = {};
    //    for (const code of classifications) {
    //      const [mainPart] = code.split('; ');
    //      if (!groups[mainPart]) groups[mainPart] = [];
    //      groups[mainPart].push(code);
    //    }
   
    //    const mostSpecificClassifications = [];
    //    for (const group in groups) {
    //      const codes = groups[group];
    //      const maxLength = Math.max(...codes.map(code => code.length));
    //      const deepest = codes.filter(code => code.length === maxLength);
    //      mostSpecificClassifications.push(...deepest);
    //    }
   
    //    const uniqueMostSpecific = [...new Set(mostSpecificClassifications)];






// const getPatentData = async (patentNumber) => {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;
//     const { data } = await axios.get(url);
//     const $ = cheerio.load(data);

//     const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';
//     const getTextByLabel = (label) => {
//         const dt = $(`dt:contains("${label}")`);
//         return dt.length ? dt.next('dd').text().trim() : 'Not found';
//     };
//     const getTextByPossibleLabels = (labels) => {
//         for (let label of labels) {
//             const dt = $(`dt:contains("${label}")`);
//             if (dt.length) return dt.next('dd').text().trim();
//         }
//         return 'Not found';
//     };

//     const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//     const publicationDate = getTextByLabel('Publication date');
//     let title = getMeta('DC.title');

//     const rawContributors = $('meta[name="DC.contributor"]')
//         .map((_, el) => $(el).attr('content'))
//         .get()
//         .filter(Boolean);

//     // let assigneeRaw = getTextByLabel('Assignee');
//     // let uniqueAssignee = assigneeRaw.trim();

//     // Clean and deduplicate assignee
// const cleanAssignee = (raw) => {
//     let parts = raw.split(/\s+/); // split by spaces
//     let seen = new Set();
//     let result = [];

//     for (let word of parts) {
//         if (!seen.has(word)) {
//             seen.add(word);
//             result.push(word);
//         }
//     }

//     return result.join(' ').trim();
// };

// let assigneeRaw = getTextByLabel('Assignee');
// let uniqueAssignee = cleanAssignee(assigneeRaw);




//     const lowerAssignee = uniqueAssignee.toLowerCase();
//     const inventors = rawContributors
//         .filter(name => !lowerAssignee.includes(name.trim().toLowerCase()))
//         .filter(Boolean)
//         .join('; ') || 'Not found';

//     const abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//     let bibliographicData = {
//         title,
//         abstract,
//         assignee: uniqueAssignee,
//         inventors
//     };

//     let translationFlags = {
//         title_translated: false,
//         abstract_translated: false,
//         assignee_translated: false,
//         inventors_translated: false
//     };

//     for (const [key, value] of Object.entries(bibliographicData)) {
//         if (value && value !== 'Not found') {
//             const langCode = franc(value);
//             if (langCode !== 'und') {
//                 const language = langs.where('3', langCode);
//                 if (language?.name !== 'English') {
//                     const translatedValue = await translateToEnglish(value);
//                     bibliographicData[key] = translatedValue;
//                     translationFlags[`${key}_translated`] = true;
//                 }
//             }
//         }
//     }


    
//     const priorityDate = getTextByLabel('Priority date');

//     const ipc = $('section#internationalClassification tbody tr')
//         .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//         .get()
//         .join('; ') || 'Not found';

//     const cpc = $('section#cpcClassification tbody tr')
//         .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//         .get()
//         .join('; ') || 'Not found';

//     const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';
//     const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();
//     const family_member = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

//     let familyMembers = [];
//     $('section.related-publications a').each((_, el) => {
//         const text = $(el).text().trim();
//         if (text) familyMembers.push(text);
//     });

//     const getCountryCode = (patentNumber) => {
//         const match = patentNumber.match(/^[A-Z]{2}/);
//         return match ? match[0] : 'Unknown';
//     };

//     const patentOffice = getCountryCode(patentNumber);
//     const countryCode = countryCodeMap[patentOffice] || 'Unknown';

//     const viewerUrl = `https://patents.google.com/patent/${patentNumber}/en`;



//     return {
//         publicationNo: patentNumber,
//         ...bibliographicData,
//         ...translationFlags,
//         publicationDate,
//         applicationDate,
//         priorityDate,
//         ipc_cpc,
//         IPC,
//         viewerUrl,
//         countryCode,
//         family_member,
//         family: familyMembers.join(', ') || 'Not found',
//     };
// };

// module.exports = getPatentData;














// const axios = require('axios');
// const cheerio = require('cheerio');
// const { franc } = require('franc');
// const langs = require('langs');
// const translateToEnglish = require('../translate/Translate');

// const getPatentData = async (patentNumber) => {
//   const url = `https://patents.google.com/patent/${patentNumber}/en`;
//   const { data } = await axios.get(url);
//   const $ = cheerio.load(data);

//   const getMeta = (name) => $(`meta[name="${name}"]`).attr('content') || 'Not found';
//   const getTextByLabel = (label) => {
//     const dt = $(`dt:contains("${label}")`);
//     return dt.length ? dt.next('dd').text().trim() : 'Not found';
//   };
//   const getTextByPossibleLabels = (labels) => {
//     for (let label of labels) {
//       const dt = $(`dt:contains("${label}")`);
//       if (dt.length) return dt.next('dd').text().trim();
//     }
//     return 'Not found';
//   };

//   const applicationDate = getTextByPossibleLabels(['Application filed', 'Filing date', 'Filed']);
//   const publicationDate = getTextByLabel('Publication date');
//   let title = getMeta('DC.title');

//   const rawContributors = $('meta[name="DC.contributor"]')
//     .map((_, el) => $(el).attr('content'))
//     .get()
//     .filter(Boolean);

//   const assignee = getTextByLabel('Assignee');
//   let uniqueAssignee = [...new Set(assignee.split(/\s+/))].join(', ').trim();

//   let inventors = rawContributors
//     .filter(name => name.trim().toLowerCase() !== uniqueAssignee.trim().toLowerCase())
//     .filter(Boolean)
//     .join('; ') || 'Not found';

//   let abstract = $('section.abstract, div.abstract, div#abstract').text().trim() || 'Not found';

//   let bibliographicData = { title, abstract, assignee: uniqueAssignee, inventors };
//   let translationFlags = {
//     title_translated: false,
//     abstract_translated: false,
//     assignee_translated: false,
//     inventors_translated: false
//   };

//   for (const [key, value] of Object.entries(bibliographicData)) {
//     if (value && value !== 'Not found') {
//       const langCode = franc(value);
//       if (langCode !== 'und') {
//         const language = langs.where('3', langCode);
//         if (language?.name !== 'English') {
//           const translatedValue = await translateToEnglish(value);
//           bibliographicData[key] = translatedValue;
//           translationFlags[`${key}_translated`] = true;
//         }
//       }
//     }
//   }

//   const priorityDate = getTextByLabel('Priority date');

//   const ipc = $('section#internationalClassification tbody tr')
//     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//     .get()
//     .join('; ') || 'Not found';

//   const cpc = $('section#cpcClassification tbody tr')
//     .map((_, el) => $(el).text().trim().replace(/\s+/g, ' '))
//     .get()
//     .join('; ') || 'Not found';

//   const ipc_cpc = [ipc, cpc].filter(Boolean).join('; ') || 'Not found';
//   const IPC = $('meta[name="DC.subject.ipc"]').map((i, el) => $(el).attr('content')).get();
//   const family_member = $('section#family table tr td').map((i, el) => $(el).text().trim()).get();

//   let familyMembers = [];
//   $('section.related-publications a').each((_, el) => {
//     const text = $(el).text().trim();
//     if (text) familyMembers.push(text);
//   });



//   const relatedReferences = []; 

//   $('section.related-publications table tbody tr').each((_, row) => {
//     const cells = $(row).find('td');
//     if (cells.length >= 6) {
//       relatedReferences.push({
//         publicationNumber: $(cells[1]).text().trim(),
//         title: $(cells[2]).text().trim(),
//         assigneeOrInventor: $(cells[3]).text().trim(),
//         priorityDate: $(cells[4]).text().trim(),
//         publicationDate: $(cells[5]).text().trim(),
//         familyMembers: $(cells[6]).text().trim(),
//       });
//     }
//   });

//   return {
//     publicationNo: patentNumber,
//     ...bibliographicData,
//     ...translationFlags,
//     publicationDate,
//     applicationDate,
//     priorityDate,
//     ipc_cpc,
//     IPC,
//     family_member,
//     family: familyMembers.join(', ') || 'Not found',
//     relatedReferences,
//   };
// };

// module.exports = getPatentData;
