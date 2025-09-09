import { handleTranslateText } from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";


export const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
export const safeText = (val) => (typeof val === "string" ? val : val?._ || "");

export function capitalize(str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (ch) => ch.toUpperCase())
        .trim();
}


export function normalizeNames(rawValue) {
  if (!rawValue) return "";

  return rawValue
    .split(";") 
    .map(name => name.replace(/,/g, " ").trim())
    .filter(Boolean)
    .map(name => {
      const parts = name.split(/\s+/);
      if (parts.length >= 2) {
        const lastName = parts[0];
        const firstNames = parts.slice(1).join(" ");
        return `${firstNames} ${lastName}`;
      }
      return name;
    })
    .join("; "); 
}


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

export const trasnlatedText = async (text) => {
    if (!text) return '';
    // const textTRanslated = await handleTranslateText(text);
    // console.log('textTRanslated', textTRanslated)
    // return textTRanslated.translation;
}

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

    const priority = ['original', 'epodoc'];

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

// export const getCleanPartyNames = (partyArray = [], nameKey = '') => {
//     if (!Array.isArray(partyArray) || !nameKey) return '';

//     const priority = ['original', 'epodoc'];

//     const availableFormat = priority.find(format =>
//         partyArray.some(item => item?.$?.['data-format'] === format)
//     );

//     if (!availableFormat) return '';

//     const firstMatch = partyArray.find(
//         item => item?.$?.['data-format'] === availableFormat
//     );

//     if (!firstMatch) return '';

//     const rawName = nameKey.split('.').reduce((obj, key) => obj?.[key], firstMatch);

//     if (!rawName) return '';

//     let cleaned = rawName
//         .replace(/\[.*?\]/g, '')
//         .replace(/[.,;]/g, '')
//         .replace(/\s+/g, ' ')
//         .trim();

//     if (!cleaned) return '';

//     cleaned = cleaned.replace(/\b\w/g, char => char.toUpperCase());

//     return cleaned;
// };


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



