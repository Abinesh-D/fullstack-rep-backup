import { parseStringPromise } from 'xml2js';

export const parseCPCXML = async (xmlContent) => {
    try {
        const result = await parseStringPromise(xmlContent, { explicitArray: false });

        const items = result?.definitions?.['definition-item'];
        if (!items) return [];

        const definitions = Array.isArray(items) ? items : [items];

        const parsed = definitions.map(item => {
            const mainCode = item['classification-symbol'] || '';
            const titleText = getTextFromNested(item['definition-title']);
            const titleRefs = extractClassRefs(item['definition-title']);
            const informativeRef = getTextFromNested(item?.references?.['informative-references']);
            const informativeCodes = extractClassRefs(item?.references?.['informative-references']);
            const specialRules = getTextFromNested(item['special-rules']);
            const specialCodes = extractClassRefs(item['special-rules']);
            const glossary = getTextFromNested(item['glossary-of-terms']);

            return {
                cpc_code: mainCode,
                title: titleText,
                title_cpc_codes: titleRefs,
                informative_references: informativeRef,
                informative_references_cpc_codes: informativeCodes,
                special_rules: specialRules,
                special_rules_cpc_codes: specialCodes,
                glossary_of_terms: glossary
            };
        });

        return parsed;
    } catch (error) {
        console.error("XML Parse Error:", error.message);
        return [];
    }
};

// Helper: Extract plain text
function getTextFromNested(obj) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
        return Object.values(obj)
            .flat()
            .map(v => (typeof v === 'string' ? v : getTextFromNested(v)))
            .join(' ')
            .trim();
    }
    return '';
}

// Helper: Extract class-ref codes
function extractClassRefs(obj) {
    if (!obj) return '';
    const refs = [];

    const walk = (node) => {
        if (typeof node !== 'object') return;
        for (const key in node) {
            if (key === 'class-ref') {
                const val = node[key];
                if (Array.isArray(val)) refs.push(...val);
                else refs.push(val);
            } else {
                walk(node[key]);
            }
        }
    };

    walk(obj);
    return refs.join('|');
}
