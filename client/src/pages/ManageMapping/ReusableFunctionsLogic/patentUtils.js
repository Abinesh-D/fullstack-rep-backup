export const mapFamilyMemberData = (data) => {
    const familyMembers = data?.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];

    const familyMembersArray = Array.isArray(familyMembers)
        ? familyMembers
        : familyMembers
            ? [familyMembers]
            : [];

    const mappedFamilyData = familyMembersArray.map((familyMember) => {
        let publications = familyMember?.["publication-reference"]?.["document-id"];

        const publicationsArray = Array.isArray(publications)
            ? publications
            : publications
                ? [publications]
                : [];

        const publicationInfo = publicationsArray
            .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
            .map(doc => `${doc?.["country"] || ''}${doc?.["doc-number"] || ''}${doc?.["kind"] || ''}`)
            .join(', ');

        return {
            familyId: familyMember?.["$"]?.["family-id"] || '',
            familyPatent: publicationInfo
        };
    });

    return mappedFamilyData;
};



export const getEnglishAbstract = (biblio) => {
    const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
    if (Array.isArray(abstractArray)) {
        const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
        return englishEntry?.p || 'No English abstract found.';
    } else if (typeof abstractArray === 'object') {
        return abstractArray.p;
    }
    return null;
};


export const getCleanPartyNames = (partyArray = [], nameKey = '') => {
    if (!Array.isArray(partyArray) || !nameKey) return '';

    const priority = ['epodoc', 'original', 'docdb'];

    const availableFormat = priority.find(format =>
        partyArray.some(item => item?.$?.['data-format'] === format)
    );

    if (!availableFormat) return '';
    const filteredArray = partyArray.filter(
        item => item?.$?.['data-format'] === availableFormat
    );

    const cleanedNames = filteredArray
        .map(item =>
            nameKey.split('.').reduce((obj, key) => obj?.[key], item)
                ?.replace(/\[.*?\]/g, '')
                ?.replace(/[.,;]/g, '')
                ?.replace(/\s+/g, ' ')
                ?.trim()
        )
        .filter(Boolean);

    const uniqueNames = [...new Map(
        cleanedNames.map(name => [name.toLowerCase(), name])
    ).values()];

    const titleCasedNames = uniqueNames.map(str =>
        str.replace(/\b\w/g, char => char.toUpperCase())
    );

    return titleCasedNames.join('; ');
};

export const convertDescriptionToKeyValue = (descriptionText = '') => {
    const result = {};
    const matches = descriptionText.matchAll(/\[\d{4}\][\s\S]*?(?=\[\d{4}\]|$)/g);

    for (const match of matches) {
        const entry = match[0].trim();
        const keyMatch = entry.match(/^\[(\d{4})\]/);
        if (keyMatch) {
            const key = keyMatch[1];
            const value = entry.replace(/^\[\d{4}\]/, '').trim();
            result[key] = value;
        }
    }
    return result;
};

export const famFilterFunction = (data) => {
    if (data?.patentNumber !== undefined) {
        let familyIDs = [];
        const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
        if (Array.isArray(familyMember)) {
            familyIDs = familyMember[0]?.["$"]?.["family-id"];
        } else if (typeof familyMember === 'object') {
            familyIDs = familyMember?.["$"]?.["family-id"];
        }
        return `https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`;
    }
    return null;
};

export const getPriorityDates = (biblioData) => {
    let claims = biblioData?.['priority-claims']?.['priority-claim'];
    if (!claims) return '';
    if (!Array.isArray(claims)) claims = [claims];

    for (const claim of claims) {
        let doc = claim?.['document-id'];
        if (!doc) continue;
        if (!Array.isArray(doc)) doc = [doc];

        const epodoc = doc.find(d => d?.$?.['document-id-type'] === 'epodoc');
        const rawDate = epodoc?.date?.trim();

        if (rawDate && /^\d{8}$/.test(rawDate)) {
            return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        }
    }
    return '';
};

export const extractIPCCode = (text) => {
    const match = text?.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
    return match ? match[0].replace(/\s+/g, '') : '';
};



