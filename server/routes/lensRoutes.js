const express = require('express');
const axios = require('axios');
const countryCodeMap = require('../utils/countryCodeMAp');
const router = express.Router();

function splitPatentNumber(patentNumber) {
    if (!patentNumber || patentNumber.length < 4) return null;
  
    const jurisdiction = patentNumber.slice(0, 2);
    const rest = patentNumber.slice(2);
  
    const kindMatch = rest.match(/([0-9]+)([A-Za-z0-9]*)$/);
    if (!kindMatch) return null;
  
    const docNumber = rest.slice(0, kindMatch.index + kindMatch[1].length);
    const kind = kindMatch[2] || '';
  
    return { jurisdiction, docNumber, kind };
  }

function extractFamilyMembers(members) {
    return members
        ?.map(member => {
            const doc = member?.document_id;
            if (doc?.jurisdiction && doc?.doc_number && doc?.kind) {
                return `${doc.jurisdiction}${doc.doc_number}${doc.kind}`;
            }
            return null;
        })
        .filter(Boolean)
        .join('; ') + '; ';
}


function formatPatentData(rawData) {
    const data = rawData?.data?.[0];
    const biblio = data?.biblio;

    return {
        patentNumber: `${data?.jurisdiction || ''}${data?.doc_number || ''}${data?.kind || ''}`,
        url: data?.docdb_id 
          ? `https://worldwide.espacenet.com/patent/search/family/${data.docdb_id}`
          : 'URL not available',
        country: countryCodeMap[data?.jurisdiction] || data?.jurisdiction || 'Country information not available',
        
        title: biblio?.invention_title?.[0]?.text || 'Title not available',
        inventors: biblio?.parties?.inventors?.map(i => i?.extracted_name?.value).join('; ') || 'Inventor information not available',
        assignee: biblio?.parties?.applicants?.[0]?.extracted_name?.value || 'Assignee information not available',
      
        abstract: data?.abstract?.map(a => ({
          lang: a?.lang || 'Unknown language',
          text: a?.text || 'Abstract not available'
        })) || [{ lang: 'en', text: 'Abstract not available' }],
      
        claims: data?.claims || 'Claims information not available',
        description: data?.description || 'Description information not available',
      
        publicationDate: data?.date_published || biblio?.publication_reference?.date || 'Publication date not available',
        applicationDate: biblio?.application_reference?.date || 'Application date not available',
        priorityDate: biblio?.priority_claims?.earliest_claim?.date || 'Priority date not available',
      
        ipc: biblio?.classifications_ipcr?.classifications?.map(c => c.symbol).join('; ') || 'IPC classification not available',
        cpc: biblio?.classifications_cpc?.classifications?.map(c => c.symbol).join('; ') || 'CPC classification not available',
      
        simple_family: extractFamilyMembers(data?.families?.simple_family?.members) || 'Simple family information not available',
        extended_family: extractFamilyMembers(data?.families?.extended_family?.members) || 'Extended family information not available',
      
        sequence_listing: data?.sequence_listing || 'Sequence listing not available',
        publication_type: data?.publication_type || 'Publication type not available',
        legal_status: data?.legal_status || 'Legal status information not available',
      
        ...(data?.jurisdiction === 'US' && {
          US_Classification:
            Array.isArray(biblio?.classifications_national?.classifications)
              ? biblio.classifications_national.classifications
                  .map(c => c?.symbol)
                  .filter(Boolean)
                  .join('; ')
              : 'US Classification not available',
        })
      };
}



router.post('/get-patent-data', async (req, res) => {
    try {
        const { patentNumber } = req.body;
        const lensPageUrl = `https://www.lens.org/lens/search/patent/list?q=${patentNumber}`;


        if (!patentNumber) {
            return res.status(400).json({ error: 'Patent number is required' });
        }

        const splitPatent = splitPatentNumber(patentNumber);
        if (!splitPatent) {
            return res.status(400).json({ error: 'Invalid patent number format' });
        }

        const { jurisdiction, docNumber, kind } = splitPatent;

        const query = {
            bool: {
                must: []
            }
        };

        if (jurisdiction) query.bool.must.push({ match: { jurisdiction } });
        if (docNumber) query.bool.must.push({ match: { doc_number: docNumber } });
        if (kind) query.bool.must.push({ match: { kind } });

        const requestBody = {
            query,
            include: [
                "lens_id",
                "jurisdiction",
                "doc_number",
                "kind",
                "date_published",
                "doc_key",
                "docdb_id",
                "families",
                "abstract",
                "biblio",
                "legal_status",
                "publication_type",
                "claims",
                "description"

            ]
        };

        const response = await axios.post('https://api.lens.org/patent/search', requestBody, {
            headers: {
                Authorization: `Bearer ${process.env.LENS_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(response.data, 'responseresponse')

        if (response.data.total > 0) {
            const formattedData = formatPatentData(response.data);
            return res.json({formattedData, fullData : response.data, url: lensPageUrl});
        } else {
            return res.status(404).json({ error: 'Patent not found' });
        }
    } catch (error) {
        console.error(error?.response?.data || error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;












// const express = require('express');
// const axios = require('axios');
// const countryCodeMAp = require('../utils/countryCodeMAp');
// const router = express.Router();


// function splitPatentNumber(patentNumber) {
//     const regex = /^([A-Za-z]{2,3})(\d+)([A-Za-z0-9]*)$/;
//     const match = patentNumber.match(regex);

//     if (!match) {
//         return null;
//     }


//     const jurisdiction = match[1];
//     const docNumber = match[2];
//     const kind = match[3] || '';

//     return { jurisdiction, docNumber, kind };
// }

// router.post('/get-patent-data', async (req, res) => {
//     try {
//         const { patentNumber } = req.body;

//         if (!patentNumber) {
//             return res.status(400).json({ error: 'Patent number is required' });
//         }
//         const splitPatent = splitPatentNumber(patentNumber);

//         if (!splitPatent) {
//             return res.status(400).json({ error: 'Invalid patent number format' });
//         }

//         const { jurisdiction, docNumber, kind } = splitPatent;
//         const query = {
//             bool: {
//                 must: []
//             }
//         };

//         if (jurisdiction) {
//             query.bool.must.push({ match: { jurisdiction: jurisdiction } });
//         }

//         if (docNumber) {
//             query.bool.must.push({ match: { doc_number: docNumber } });
//         }

//         if (kind) {
//             query.bool.must.push({ match: { kind: kind } });
//         }

//         const requestBody = {
//             query: query,
//             include: [
//                 "lens_id",
//                 "jurisdiction",
//                 "doc_number",
//                 "kind",
//                 "date_published",
//                 "doc_key",
//                 "docdb_id",
//                 "biblio"
//             ]
//         };

//         const response = await axios.post('https://api.lens.org/patent/search', requestBody, {
//             headers: {
//                 Authorization: `Bearer ${process.env.LENS_API_KEY}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         if (response.data.total > 0) {
//             return res.json(response.data);
//         } else {
//             return res.status(404).json({ error: 'Patent not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// module.exports = router;
