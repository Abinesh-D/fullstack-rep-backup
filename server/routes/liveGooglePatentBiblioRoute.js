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