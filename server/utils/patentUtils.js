// biblioMapper.js
const { lingaTranslateText } = require("./lingvaServiceTranslator");
const { formatDate, capitalize, safeArray, safeText, convertIpc, normalizeNames } = require("./commonResusableFunctions");

function mapFamilyMemberData(data, patentNumber) {
    const familyMembers = data?.["world-patent-data"]?.["patent-family"]?.["family-member"];

    const familyMembersArray = Array.isArray(familyMembers)
        ? familyMembers
        : familyMembers
            ? [familyMembers]
            : [];

    return familyMembersArray
        .map((familyMember) => {
            let publications = familyMember?.["publication-reference"]?.["document-id"];

            const publicationsArray = Array.isArray(publications)
                ? publications
                : publications
                    ? [publications]
                    : [];

            const publicationInfo = publicationsArray
                .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
                .map(doc => `${doc?.["country"] || ''}${doc?.["doc-number"] || ''}${doc?.["kind"] || ''}`)
                .join("; ");

            return {
                familyId: familyMember?.["$"]?.["family-id"] || '',
                familyPatent: publicationInfo
            };
        })
        .filter(item => item.familyPatent && !item.familyPatent.split("; ").includes(patentNumber));
}

function extractIPCCode(bibliographicData) {
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
                if (cpcCode.trim()) {
                    cpcSet.add(cpcCode.trim());
                }
            } else if (scheme === "UC") {
                if (item["classification-symbol"]) {
                    usSet.add(item["classification-symbol"].trim());
                }
            }
        });

        cpc = [...cpcSet].join("; ");
        usClassification = [...usSet].join(", ");
    }

    return {
        cpc,
        US_Classification: usClassification,
    };
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
            return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
        }
    }
    return "";
}

async function inventionTitle(biblioData) {
    const titleData = biblioData?.["invention-title"];
    if (!titleData) return "";

    if (Array.isArray(titleData)) {
        const enTitle = titleData.find(t => t?.$?.lang === "en");
        if (enTitle) return enTitle._ || "";

        return await lingaTranslateText(titleData[0]._ || "");
    }

    if (titleData?.$?.lang === "en") {
        return titleData._ || "";
    }

    return await lingaTranslateText(titleData?._ || "");
}

async function getInventorNames(biblioData) {
    const inventorsData = safeArray(biblioData?.parties?.inventors?.inventor);

    const inventorOriginal = inventorsData.filter(
        (i) => i?.$?.["data-format"] === "original"
    );
    const inventorEpodoc = inventorsData.filter(
        (i) => i?.$?.["data-format"] === "epodoc"
    );

    let finalInventors = inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc;

    const names = finalInventors
        .map((i) =>
            safeText(i?.["inventor-name"]?.name)?.replace(/,+$/g, "").trim()
        )
        .filter(Boolean);

    if (!names.length) return "";

    const formattedNames = names.map((n) => {
        let parts = n.split(",").map(p => p.trim()).filter(Boolean);

        if (parts.length === 2) {
            let [last, first] = parts;
            return `${capitalize(first)} ${capitalize(last)}`;
        }

        return capitalize(n);
    });

    const uniqueNames = Array.from(
        new Set(formattedNames.map(n => n.toLowerCase()))
    ).map(lower => formattedNames.find(n => n.toLowerCase() === lower));

    const joinedNames = uniqueNames.join("; ");
    const normalizedNames = normalizeNames(joinedNames);
    const translated = await lingaTranslateText(normalizedNames);
    return translated;
}

async function getApplicantNames(biblioData) {
    const applicantsData = safeArray(biblioData?.parties?.applicants?.applicant);
    console.log('applicantsData', applicantsData)

    const applicantOriginal = applicantsData.filter(
        (a) => a?.$?.["data-format"] === "original"
    );
    const applicantEpodoc = applicantsData.filter(
        (a) => a?.$?.["data-format"] === "epodoc"
    );

    const finalApplicants =
        applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc;

    const names = finalApplicants
        .map((a) =>
            safeText(a?.["applicant-name"]?.name)
                ?.replace(/,+$/g, "")
                ?.replace(/,/g, " ")
                .replace(/\s+/g, " ")
                .trim()
        )
        .filter(Boolean)
        .map((n) => capitalize(n));

    if (!names.length) return "";

    const uniqueNames = Array.from(
        new Set(names.map((n) => n.toLowerCase()))
    ).map((lower) => names.find((n) => n.toLowerCase() === lower));

    const joinedNames = uniqueNames.join("; ");
    return await lingaTranslateText(joinedNames);
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




// async function cleanAndTranslate(input) {
//   if (!input) return "";

//   const values = Array.isArray(input) ? input : [input];

//   const cleanedValues = values.map((val) => {
//     if (!val || typeof val !== "string") return "";

//     return val
//       .replace(/,\s*\./g, ".")
//       .replace(/,+/g, ",")
//       .replace(/,([a-z0-9])/gi, " $1")
//       .replace(/\s+/g, " ")
//       .trim();
//   });
// }



// (async (biblioData) => {
//   function convertIpc(text) {
//     if (!text) return "";
//     const match = text.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
//     return match ? match[0].replace(/\s+/g, "") : "";
//   }

//   function getIPCClasses(biblioData) {
//     const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
//     const ipcRaw = biblioData?.['classification-ipc']?.text || "";

//     const ipcrCodes = Array.isArray(ipcrRaw)
//       ? ipcrRaw.map(item => convertIpc(item?.text)).filter(Boolean)
//       : ipcrRaw
//         ? [convertIpc(ipcrRaw?.text)].filter(Boolean)
//         : [];

//     const ipcCodes = ipcRaw
//       ? ipcRaw
//           .split(/[;,]/)
//           .map(code => convertIpc(code))
//           .filter(Boolean)
//       : [];

//     const allIPC = [...new Set([...ipcrCodes, ...ipcCodes])];
//     return allIPC.join("; ");
//   }

//   const ipcClasses = getIPCClasses(biblioData);
//   console.log("IPC Classes:", ipcClasses);

// })();



function getIPCClasses(biblioData) {
  const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
  const ipcRaw = biblioData?.['classification-ipc']?.text || "";

  const ipcrCodes = Array.isArray(ipcrRaw)
    ? ipcrRaw.map(item => convertIpc(item?.text)).filter(Boolean)
    : ipcrRaw
      ? [convertIpc(ipcrRaw?.text)].filter(Boolean)
      : [];

  const ipcCodes = ipcRaw
    ? ipcRaw
        .split(/[;,]/)
        .map(code => convertIpc(code))
        .filter(Boolean)
    : [];

  const allIPC = [...new Set([...ipcrCodes, ...ipcCodes])];
  return allIPC.join("; ");
}



// function getIPCClasses(biblioData) {
//     const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
//     const ipcRaw = biblioData?.['classification-ipc']?.text || '';

//     const ipcrCodes = Array.isArray(ipcrRaw)
//         ? ipcrRaw.map(item => consvertIpc(item?.text)).filter(Boolean)
//         : ipcrRaw
//             ? [consvertIpc(ipcrRaw?.text)].filter(Boolean)
//             : [];

//     const ipcCodes = ipcRaw
//         ? ipcRaw
//             .split(/[;,]/)
//             .map(code => consvertIpc(code))
//             .filter(Boolean)
//         : [];

//     const allIPC = [...new Set([...ipcrCodes, ...ipcCodes])];

//     return allIPC.join('; ');
// }

module.exports = {
    getEnglishAbstract,
    extractIPCCode,
    getIPCClasses,
    mapFamilyMemberData,
    inventionTitle,
    getInventorNames,
    getApplicantNames,
    formatDate,
    getApplicationDate,
    getPublicationDate,
    getPriorityDates
};













// const { lingaTranslateText } = require("./lingvaServiceTranslator");
// const { formatDate, capitalize, safeArray, safeText, consvertIpc } = require("./commonResusableFunctions");


// function mapFamilyMemberData(data, patentNumber) {
//     const familyMembers = data?.["world-patent-data"]?.["patent-family"]?.["family-member"];

//     const familyMembersArray = Array.isArray(familyMembers)
//         ? familyMembers
//         : familyMembers
//             ? [familyMembers]
//             : [];

//     const mappedFamilyData = familyMembersArray
//         .map((familyMember) => {
//             let publications = familyMember?.["publication-reference"]?.["document-id"];

//             const publicationsArray = Array.isArray(publications)
//                 ? publications
//                 : publications
//                     ? [publications]
//                     : [];

//             const publicationInfo = publicationsArray
//                 .filter(doc => doc?.["$"]?.["document-id-type"] === "docdb")
//                 .map(doc => `${doc?.["country"] || ''}${doc?.["doc-number"] || ''}${doc?.["kind"] || ''}`)
//                 .join("; ");

//             return {
//                 familyId: familyMember?.["$"]?.["family-id"] || '',
//                 familyPatent: publicationInfo
//             };
//         })
//         .filter(item => item.familyPatent && !item.familyPatent.split("; ").includes(patentNumber));
//     return mappedFamilyData;
// }

// function extractIPCCode(bibliographicData) {
//     const ipcrRaw = bibliographicData?.["classifications-ipcr"]?.["classification-ipcr"];
//     const ipc = bibliographicData?.["classification-ipc"]?.text || "";

//     const cleanIPC = (code) =>
//         code
//             ?.replace(/\s+/g, " ")
//             .replace(/(\d)\/\s*(\d+)/g, "$1/$2")
//             .replace(/\s*A\s*I\s*$/i, "")
//             .trim();


//     let ipcrText = "";
//     if (ipcrRaw) {
//         const classifications = Array.isArray(ipcrRaw) ? ipcrRaw : [ipcrRaw];
//         ipcrText = classifications
//             .map((item) => cleanIPC(item?.text))
//             .filter(Boolean)
//             .join("; ");
//     }

//     const ipcFormatted = ipc
//         ? ipc
//             .split(",")
//             .map((c) => cleanIPC(c))
//             .filter(Boolean)
//             .join("; ")
//         : "";

//     const patentClassifications = bibliographicData?.["patent-classifications"]?.["patent-classification"];
//     let cpc = "";
//     let usClassification = "";

//     if (Array.isArray(patentClassifications)) {
//         const cpcSet = new Set();
//         const usSet = new Set();

//         patentClassifications.forEach((item) => {
//             const scheme = item["classification-scheme"]?.$?.scheme;
//             if (scheme === "CPCI") {
//                 const { section, class: cls, subclass, "main-group": mainGroup, subgroup } = item;
//                 const cpcCode = `${section || ""}${cls || ""}${subclass || ""}${mainGroup || ""}/${subgroup || ""}`;
//                 if (cpcCode.trim()) {
//                     cpcSet.add(cpcCode.trim());
//                 }
//             } else if (scheme === "UC") {
//                 if (item["classification-symbol"]) {
//                     usSet.add(item["classification-symbol"].trim());
//                 }
//             }
//         });

//         cpc = [...cpcSet].join("; ");
//         usClassification = [...usSet].join(", ");
//     }

//     return {
//         ipcClass: [ipcrText, ipcFormatted].filter(Boolean).join("; "),
//         cpc,
//         US_Classification: usClassification,
//     };
// }

// function getApplicationDate(biblioData) {
//     const docIds = biblioData?.["application-reference"]?.["document-id"];
//     const epodocDate = Array.isArray(docIds)
//         ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
//         : docIds?.$?.["document-id-type"] === "epodoc"
//             ? docIds.date
//             : null;

//     return formatDate(epodocDate);
// }

// function getPublicationDate(biblioData) {
//     const docIds = biblioData?.["publication-reference"]?.["document-id"];
//     const epodocDate = Array.isArray(docIds)
//         ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
//         : docIds?.$?.["document-id-type"] === "epodoc"
//             ? docIds.date
//             : null;

//     return formatDate(epodocDate);
// }

// function getPriorityDates(biblioData) {
//     let claims = biblioData?.["priority-claims"]?.["priority-claim"];
//     if (!claims) return "";
//     if (!Array.isArray(claims)) claims = [claims];

//     for (const claim of claims) {
//         let doc = claim?.["document-id"];
//         if (!doc) continue;
//         if (!Array.isArray(doc)) doc = [doc];

//         const epodoc = doc.find((d) => d?.$?.["document-id-type"] === "epodoc");
//         const rawDate = epodoc?.date?.trim();

//         if (rawDate && /^\d{8}$/.test(rawDate)) {
//             return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(
//                 6,
//                 8
//             )}`;
//         }
//     }
//     return "";
// }

// async function inventionTitle(biblioData) {
//     const titleData = biblioData?.["invention-title"];
//     if (!titleData) return "";

//     if (Array.isArray(titleData)) {
//         const enTitle = titleData.find(t => t?.$?.lang === "en");
//         if (enTitle) return enTitle._ || "";

//         return await lingaTranslateText(titleData[0]._ || "");
//     }

//     if (titleData?.$?.lang === "en") {
//         return titleData._ || "";
//     }

//     return await lingaTranslateText(titleData?._ || "");
// }

// async function getInventorNames(biblioData) {
//     const inventorsData = safeArray(biblioData?.parties?.inventors?.inventor);

//     const inventorOriginal = inventorsData.filter(
//         (i) => i?.$?.["data-format"] === "original"
//     );
//     const inventorEpodoc = inventorsData.filter(
//         (i) => i?.$?.["data-format"] === "epodoc"
//     );

//     let finalInventors = inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc;

//     const names = finalInventors
//         .map((i) =>
//             safeText(i?.["inventor-name"]?.name)?.replace(/,+$/g, "").trim()
//         )
//         .filter(Boolean);

//     if (!names.length) return "";

//     const formattedNames = names.map((n) => {
//         let parts = n.split(",").map(p => p.trim()).filter(Boolean);

//         if (parts.length === 2) {
//             let [last, first] = parts;
//             return `${capitalize(first)} ${capitalize(last)}`;
//         }

//         return capitalize(n);
//     });

//     const uniqueNames = Array.from(
//         new Set(formattedNames.map(n => n.toLowerCase()))
//     ).map(lower => formattedNames.find(n => n.toLowerCase() === lower));

//     const joinedNames = uniqueNames.join("; ");

//     let translated = await lingaTranslateText(joinedNames);
//     translated = (translated || joinedNames)
//         .replace(/,+/g, ";")
//         .replace(/;+/g, ";")
//         .replace(/\s*;\s*/g, "; ")
//         .trim();

//     return translated;
// }

// async function getApplicantNames(biblioData) {
//     const applicantsData = safeArray(biblioData?.parties?.applicants?.applicant);

//     const applicantOriginal = applicantsData.filter(
//         (a) => a?.$?.["data-format"] === "original"
//     );
//     const applicantEpodoc = applicantsData.filter(
//         (a) => a?.$?.["data-format"] === "epodoc"
//     );

//     const finalApplicants =
//         applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc;

//     const names = finalApplicants
//         .map((a) =>
//             safeText(a?.["applicant-name"]?.name)
//                 ?.replace(/,+$/g, "")
//                 ?.replace(/,/g, " ")
//                 .replace(/\s+/g, " ") 
//                 .trim()
//         )
//         .filter(Boolean)
//         .map((n) => capitalize(n));

//     if (!names.length) return "";

//     const uniqueNames = Array.from(
//         new Set(names.map((n) => n.toLowerCase()))
//     ).map((lower) => names.find((n) => n.toLowerCase() === lower));

//     const joinedNames = uniqueNames.join("; ");

//     return await lingaTranslateText(joinedNames);
// }

// function getEnglishAbstract(biblio) {
//     const abstractArray = biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
//     if (Array.isArray(abstractArray)) {
//         const englishEntry = abstractArray.find(entry => entry?.$?.lang === 'en');
//         return englishEntry?.p || 'No English abstract found.';
//     } else if (typeof abstractArray === 'object') {
//         return abstractArray.p;
//     }
//     return null;
// };


// function getIPCClasses(biblioData) {
//     const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
//     const ipcRaw = biblioData?.['classification-ipc']?.text || '';

//     const ipcrCodes = Array.isArray(ipcrRaw)
//         ? ipcrRaw.map(item => consvertIpc(item?.text)).filter(Boolean)
//         : ipcrRaw
//             ? [consvertIpc(ipcrRaw?.text)].filter(Boolean)
//             : [];

//     const ipcCodes = ipcRaw
//         ? ipcRaw
//             .split(/[;,]/)
//             .map(code => consvertIpc(code))
//             .filter(Boolean)
//         : [];

//     const allIPC = [...new Set([...ipcrCodes, ...ipcCodes])];

//     return allIPC.join('; ');
// };

// module.exports = {
//     getEnglishAbstract, extractIPCCode, getIPCClasses, mapFamilyMemberData, inventionTitle, getInventorNames, getApplicantNames,
//     formatDate, getApplicationDate, getPublicationDate, getPriorityDates,
//     // getCleanPartyNames,
//     // extractPartyNames,
//     // convertDescriptionToKeyValue,
// };