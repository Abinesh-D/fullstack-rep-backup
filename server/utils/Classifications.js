const axios = require('axios');
const cheerio = require('cheerio');

const cleanCPC = (cpc) => cpc.replace('patent/', '').replace('/en', '');

const extractClassifications = (html) => {
  const $ = cheerio.load(html);
  const classifications = [];

  $('#classifications classification-viewer concept-mention').each((_, el) => {
    const cpc = $(el).find('state-modifier').attr('data-cpc');
    const description = $(el).find('span.description').text().trim();

    if (cpc && description) {
      classifications.push({ cpc, description });s
    }
  });

  // $('concept-mention.style-scope.classification-tree').each((_, element) => {
  //   const cpc = $(element).find('state-modifier.code.style-scope.classification-tree').attr('data-cpc');
  //   const description = $(element).find('span.description.style-scope.classification-tree').text().trim();

  //   if (cpc && description) {
  //     classifications.push({
  //       cpc: cleanCPC(cpc),
  //       description: description
  //     });
  //   }
  // });

  return classifications;
};

const fetchPatentClassificationDataResults = async (patentNumber) => {
  const url = `https://patents.google.com/patent/${patentNumber}/en`;
  const { data } = await axios.get(url);
  return extractClassifications(data);
};

module.exports = fetchPatentClassificationDataResults;














// const express = require('express');
// const puppeteer = require('puppeteer');

// const router = express.Router();
// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;
//   try {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'networkidle2', timeout:'60000' });

//     await page.waitForSelector('section#classifications classification-viewer classification-tree');

//     const classifications = await page.evaluate(() => {
//       const treeElements = document.querySelectorAll(
//         'section#classifications classification-viewer classification-tree'
//       );
//       const cpcValues = [];
//       treeElements.forEach(tree => {
//         const modifiers = tree.querySelectorAll('state-modifier.code.style-scope.classification-tree');
//         modifiers.forEach(mod => {
//           const code = mod.getAttribute('data-cpc');
//           if (code && code.includes('/')) {
//             cpcValues.push(code);
//           }
//         });
//       });

//       return cpcValues;
//     });
//     await browser.close();
//     const groups = {};
//     for (const code of classifications) {
//       const [mainPart] = code.split('/');
//       if (!groups[mainPart]) groups[mainPart] = [];
//       groups[mainPart].push(code);
//     }
//     const mostSpecificClassifications = [];
//     for (const group in groups) {
//       const codes = groups[group];
//       const maxLength = Math.max(...codes.map(code => code.length));
//       const deepest = codes.filter(code => code.length === maxLength);
//       mostSpecificClassifications.push(...deepest);
//     }
//     const uniqueMostSpecific = [...new Set(mostSpecificClassifications)];
//     res.json({ patentNumber, mostSpecificClassifications: uniqueMostSpecific});
//   } catch (err) {
//     console.error('Error fetching classifications:', err.message);
//     res.status(500).json({ error: 'Failed to fetch classifications' });
//   }
// });
// module.exports = router;






// function formatPatentClassifications(data) {
//   const classes = data["patent-classifications"]["patent-classification"];

//   return classes.map(c => {
//       const section = c.section["$"];
//       const cls = c.class["$"];
//       const subclass = c.subclass["$"];
//       const mainGroup = c["main-group"]["$"];
//       const subgroup = c.subgroup["$"];
//       const office = c["generating-office"]["$"];

//       return `${section}${cls}${subclass}${mainGroup}/${subgroup} (${office})`;
//   }).join('; ');
// }




// const express = require('express');
// const puppeteer = require('puppeteer');

// const router = express.Router();

// router.get('/:patentNumber', async (req, res) => {
//   const { patentNumber } = req.params;

//   try {
//     const url = `https://patents.google.com/patent/${patentNumber}/en`;

//     const browser = await puppeteer.launch({ headless: true });
//     const page = await browser.newPage();

//     await page.goto(url, { waitUntil: 'domcontentloaded' });

//     await page.waitForSelector('state-modifier.code.style-scope.classification-tree');

//     const classifications = await page.evaluate(() => {
//       const elements = Array.from(document.querySelectorAll('state-modifier.code.style-scope.classification-tree'));
//       return elements
//         .map(el => el.getAttribute('data-cpc'))
//         .filter(code => code && code.includes('/'));
//     });

//     await browser.close();

//     // Step 1: Group classifications by prefix
//     const groups = {};
//     for (const code of classifications) {
//       const [mainPart, subPart] = code.split('/');
//       if (!groups[mainPart]) groups[mainPart] = [];
//       groups[mainPart].push(code);
//     }

//     // Step 2: For each group, keep only the longest sub-classification(s)
//     const mostSpecificClassifications = [];
//     for (const group in groups) {
//       const codes = groups[group];
//       const maxLength = Math.max(...codes.map(code => code.length));
//       const deepest = codes.filter(code => code.length === maxLength);
//       mostSpecificClassifications.push(...deepest);
//     }

//     const uniqueMostSpecific = [...new Set(mostSpecificClassifications)];

//     res.json({
//       patentNumber,
//       mostSpecificClassifications: uniqueMostSpecific
//     });

//   } catch (err) {
//     console.error('Error fetching specific classifications:', err.message);
//     res.status(500).json({ error: 'Failed to fetch classifications' });
//   }
// });

// module.exports = router;
