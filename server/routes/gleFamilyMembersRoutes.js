const axios = require('axios');
const cheerio = require('cheerio');

const cleanDocumentId = (id) => id.replace('patent/', '').replace('/en', '');

const extractFamilyMembers = (html) => {
  const $ = cheerio.load(html);
  const documentIds = [];

  $('ul').each((_, ul) => {
    $(ul).find('span[itemprop="documentId"]').each((_, el) => {
      const documentId = $(el).text().trim();
      documentIds.push(cleanDocumentId(documentId));
    });
  });

  return [...new Set(documentIds)];
};

const fetchFamilyPatentDataResults = async (patentNumber) => {
  const url = `https://patents.google.com/patent/${patentNumber}/en`;
  const { data } = await axios.get(url);
  return extractFamilyMembers(data);
};

module.exports = fetchFamilyPatentDataResults;
