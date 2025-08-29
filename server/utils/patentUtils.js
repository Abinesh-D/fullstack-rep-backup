function mapFamilyMemberData(data) {
    const familyMembers = data?.["world-patent-data"]?.["patent-family"]?.["family-member"];

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

function extractIPCCode(bibliographicData) {
    const ipcrRaw = bibliographicData?.["classifications-ipcr"]?.["classification-ipcr"];
    const ipc = bibliographicData?.["classification-ipc"]?.text || "";

    let ipcrText = "";
    if (ipcrRaw) {
        const classifications = Array.isArray(ipcrRaw) ? ipcrRaw : [ipcrRaw];
        ipcrText = classifications
            .map((item) => item?.text?.replace(/\s+/g, " ").trim())
            .filter(Boolean)
            .join(", ");
    }

    const ipcFormatted = ipc ? `${ipc}, ` : "";
    const ipcrFormatted = ipcrText ? `${ipcrText}, ` : "";

    const patentClassifications = bibliographicData?.["patent-classifications"]?.["patent-classification"];
    let cpc = "";
    let usClassification = "";

    if (Array.isArray(patentClassifications)) {
        const cpcSet = new Set();
        const usSet = new Set();

        patentClassifications.forEach((item) => {
            const scheme = item["classification-scheme"]?.$?.scheme;
            if (scheme === "CPCI") {
                const { section, class: cls, subclass, "main-group": mainGroup, subgroup } = item;
                const cpcCode = `${section || ""}${cls || ""}${subclass || ""}${mainGroup || ""}/${subgroup || ""}`;
                cpcSet.add(cpcCode.trim());
            } else if (scheme === "UC") {
                if (item["classification-symbol"]) {
                    usSet.add(item["classification-symbol"].trim());
                }
            }
        });

        cpc = [...cpcSet].join(", ");
        usClassification = [...usSet].join(", ");
    }
    return {
        ipcFormatted,
        ipcrFormatted,
        ipcClass: `${ipcrFormatted}${ipcFormatted},`,
        cpc,
        US_Classification: usClassification,
    };
}

function formatDate(dateStr) {
    return dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : "";
}

function getApplicationDate(biblioData) {
    const docIds = biblioData?.["application-reference"]?.["document-id"];
    const epodocDate = Array.isArray(docIds)
        ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
        : docIds?.$?.["document-id-type"] === "epodoc"
            ? docIds.date
            : null;

    return formatDate(epodocDate);
}

function getPublicationDate(biblioData) {
    const docIds = biblioData?.["publication-reference"]?.["document-id"];
    const epodocDate = Array.isArray(docIds)
        ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
        : docIds?.$?.["document-id-type"] === "epodoc"
            ? docIds.date
            : null;

    return formatDate(epodocDate);
}

function getPriorityDates(biblioData) {
    let claims = biblioData?.["priority-claims"]?.["priority-claim"];
    if (!claims) return "";
    if (!Array.isArray(claims)) claims = [claims];

    for (const claim of claims) {
        let doc = claim?.["document-id"];
        if (!doc) continue;
        if (!Array.isArray(doc)) doc = [doc];

        const epodoc = doc.find((d) => d?.$?.["document-id-type"] === "epodoc");
        const rawDate = epodoc?.date?.trim();

        if (rawDate && /^\d{8}$/.test(rawDate)) {
            return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(
                6,
                8
            )}`;
        }
    }
    return "";
}

const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const safeText = (val) => (typeof val === "string" ? val : val?._ || "");

function getInventorNames(biblioData) {
    const inventorsData = safeArray(biblioData?.parties?.inventors?.inventor);

    const inventorOriginal = inventorsData.filter(
        (i) => i?.$?.["data-format"] === "original"
    );
    const inventorEpodoc = inventorsData.filter(
        (i) => i?.$?.["data-format"] === "epodoc"
    );

    const finalInventors =
        inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc;

    return finalInventors
        .map((i) =>
            safeText(i?.["inventor-name"]?.name)
                ?.replace(/,+$/g, "")
                .trim()
        )
        .filter(Boolean)
        .join("; ");
}

function getApplicantNames(biblioData) {
    const applicantsData = safeArray(biblioData?.parties?.applicants?.applicant);

    const applicantOriginal = applicantsData.filter(
        (a) => a?.$?.["data-format"] === "original"
    );
    const applicantEpodoc = applicantsData.filter(
        (a) => a?.$?.["data-format"] === "epodoc"
    );

    const finalApplicants =
        applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc;

    return finalApplicants
        .map((a) =>
            safeText(a?.["applicant-name"]?.name)
                ?.replace(/,+$/g, "")
                .trim()
        )
        .filter(Boolean)
        .join("; ");
}

function getEnglishAbstract(biblio) {
    const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
    if (Array.isArray(abstractArray)) {
        const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
        return englishEntry?.p || 'No English abstract found.';
    } else if (typeof abstractArray === 'object') {
        return abstractArray.p;
    }
    return null;
};

function inventionTitle(biblioData) {
    const titleData = biblioData?.['invention-title'];

    if (Array.isArray(titleData)) {
        const enTitle = titleData.find(t => t?.$?.lang === 'en');
        if (enTitle) {
            return enTitle._ || '';
        }
        return titleData[0]._ || '';
    }
    else if (titleData?.$?.lang === 'en') {
        return titleData._ || '';
    }
    return titleData?._ || '';
}



// function getEnglishAbstract(biblio) {
//     try {
//         const abstracts = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['abstract'];
//         if (!abstracts) return "";

//         if (Array.isArray(abstracts)) {
//             const enAbstract = abstracts.find(abs => abs?.$?.lang === "en");
//             return enAbstract?._ || "";
//         }
//         return abstracts?._ || "";
//     } catch {
//         return "";
//     }
// }






// function convertDescriptionToKeyValue(descriptionText = '') {
//     const result = {};
//     const matches = descriptionText.matchAll(/\[\d{4}\][\s\S]*?(?=\[\d{4}\]|$)/g);

//     for (const match of matches) {
//         const entry = match[0].trim();
//         const keyMatch = entry.match(/^\[(\d{4})\]/);
//         if (keyMatch) {
//             const key = keyMatch[1];
//             const value = entry.replace(/^\[\d{4}\]/, '').trim();
//             result[key] = value;
//         }
//     }
//     return result;
// };



module.exports = {
    getEnglishAbstract,
    extractIPCCode,
    // getCleanPartyNames,
    // extractPartyNames,
    // convertDescriptionToKeyValue,
    mapFamilyMemberData,
    inventionTitle,
    getInventorNames,
    getApplicantNames,

    formatDate,
    getApplicationDate,
    getPublicationDate,
    getPriorityDates,
};
