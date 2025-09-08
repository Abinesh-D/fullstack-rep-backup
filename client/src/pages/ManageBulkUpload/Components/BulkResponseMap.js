import { bulkBiblioTRanlsation } from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";

const safeSplit = (value, delimiter = ";") =>
    typeof value === "string"
        ? value.split(delimiter).map((v) => v.trim()).filter(Boolean)
        : [];

const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const safeText = (value) => (typeof value === "string" ? value.trim() : "");

// ---- Main Mapper ----
// export const mapRelatedData = (mappedValue = []) => {
//     console.log('mappedValue', mappedValue)
//     return  mappedValue.map((item) => {
//         try {
//             return {
//                 publicationNumber: safeText(item.patentNumber),
//                 relatedPublicationUrl: safeText(item.publicationUrl),
//                 relatedTitle: safeText(item.invention),
//                 relatedAssignee: safeSplit(item.applicantNames),
//                 relatedInventor: safeSplit(item.inventorNames),
//                 relatedFamilyMembers: safeArray(item.familyMembersData).map(
//                     (f) => safeText(f.familyPatent)
//                 ),
//                 relatedPublicationDate: safeText(item.publicationDate),
//                 relatedPriorityDate: safeText(item.priorityDates),
//             };
//         } catch (err) {
//             console.error("Error mapping related data:", err, item);
//             return {};
//         }
//     });
// };


export const mapRelatedData = async (mappedValuePromise) => {
  const mappedValue = await mappedValuePromise; 
  if (!Array.isArray(mappedValue)) {
    console.warn("mapRelatedData expected array, got:", mappedValue);
    return [];
  }

  console.log('mappedValue', mappedValue)

  return mappedValue.map((item) => {
    try {
      return {
        publicationNumber: safeText(item.patentNumber),
        relatedPublicationUrl: safeText(item.publicationUrl),
        relatedTitle: safeText(item.invention),
        relatedAssignee: safeSplit(item.applicantNames),
        relatedInventor: safeSplit(item.inventorNames),
        relatedFamilyMembers: safeArray(item.familyMembersData).map(
          (f) => safeText(f.familyPatent)
        ),
        relatedPublicationDate: safeText(item.publicationDate),
        relatedPriorityDate: safeText(item.priorityDates),
      };
    } catch (err) {
      console.error("Error mapping related data:", err, item);
      return {};
    }
  });
};



export const extractAbstractText = (abstractData) => {
    if (!abstractData) return '';

    if (Array.isArray(abstractData)) {
        return abstractData
            .map(item => item?.p)
            .filter(Boolean)
            .join(' ');
    }
    if (typeof abstractData === 'object' && abstractData?.p) {
        return abstractData.p;
    }
    return '';
};



// async function inventionTitle(biblioData) {
//     const titleData = biblioData?.["invention-title"];
//     if (!titleData) return "";

//     if (Array.isArray(titleData)) {
//         const enTitle = titleData.find(t => t?.$?.lang === "en");
//         if (enTitle) return enTitle._ || "";

//         return await bulkBiblioTRanlsation(titleData[0]._ || "");
//     }

//     if (titleData?.$?.lang === "en") {
//         return titleData._ || "";
//     }

//     return await bulkBiblioTRanlsation(titleData?._ || "");
// }


async function inventionTitle(biblioData) {
  const titleData = biblioData?.["invention-title"];
  if (!titleData) return "";

  if (Array.isArray(titleData)) {
    const enTitle = titleData.find((t) => t?.$?.lang === "en");
    if (enTitle) return enTitle._ || "";

    const titles = titleData.map((t) => t?._).filter(Boolean);
    let translatedTitles = [];
    const chunks = chunkArray(titles, 10);

    for (const chunk of chunks) {
      const translatedChunk = await Promise.all(
        chunk.map((text) => bulkBiblioTRanlsation(text))
      );
      translatedTitles = [...translatedTitles, ...translatedChunk];
    }

    return translatedTitles.join("; ");
  }

  // Case 2: single title
  if (titleData?.$?.lang === "en") {
    return titleData._ || "";
  }

  return await bulkBiblioTRanlsation(titleData?._ || "");
}



export const publicationDateFunction = (biblioData) => {
    const docIds = biblioData?.['publication-reference']?.['document-id'];
    const epodocDate = Array.isArray(docIds)
        ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
        : docIds?.$?.['document-id-type'] === 'epodoc'
            ? docIds.date
            : null;

    return formatDate(epodocDate);
};

export const applicationDateFunction = (biblioData) => {
    const docIds = biblioData?.['application-reference']?.['document-id'];
    const epodocDate = Array.isArray(docIds)
        ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
        : docIds?.$?.['document-id-type'] === 'epodoc'
            ? docIds.date
            : null;

    return formatDate(epodocDate);
};

const formatDate = (dateStr) =>
    dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : '';

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

export const classifications = (biblioData) => {
    const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];
    if (!Array.isArray(patentClassifications)) {
        return { cpc: '', US_Classification: '' };
    }

    const cpcSet = new Set();
    const usSet = new Set();

    patentClassifications.forEach((item) => {
        const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

        if (scheme?.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
            const cpcCode = `${section}${classValue}${subclass}${mainGroup}/${subgroup}`;
            cpcSet.add(cpcCode);
        }

        if (scheme?.$?.scheme === 'UC') {
            const classificationSymbol = item['classification-symbol'];
            if (classificationSymbol) {
                usSet.add(classificationSymbol);
            }
        }
    });

    return {
        cpc: cpcSet.size ? Array.from(cpcSet).join(', ') : '',
        US_Classification: usSet.size ? Array.from(usSet).join(', ') : ''
    };
};

export const normalizeText = (text) => text?.replace(/\s+/g, '').trim();

export const computeFamId = (espData = []) => {
    const result = [];

    for (const map of espData) {
        if (!map?.patentNumber) continue;

        const familyMember = map.family?.["world-patent-data"]?.["patent-family"]?.["family-member"];
        const familyID = Array.isArray(familyMember)
            ? familyMember[0]?.["$"]?.["family-id"]
            : familyMember?.["$"]?.["family-id"];

        if (familyID) {
            result.push({
                [map.patentNumber]: `https://worldwide.espacenet.com/patent/search/family/0${familyID}/publication/${map.patentNumber}?q=${map.patentNumber}`
            });
        }
    }

    return result;
};


function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}



export const mappedValue = async (espData = [], famId = []) => {
    return await Promise.all(
        espData.map(async (map) => {
            try {
                const biblioArray =
                    map?.biblio?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.[
                        "bibliographic-data"
                    ] ?? {};

                const ipcrRaw = biblioArray?.["classifications-ipcr"]?.["classification-ipcr"];
                const ipcrText = safeArray(ipcrRaw)
                    .map((item) => normalizeText(item?.text))
                    .filter(Boolean)
                    .join("; ");

                const abstractData =
                    map?.biblio?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]
                        ?.abstract;
                const abstractText = extractAbstractText(abstractData);

                const invention = await inventionTitle(biblioArray);

                // Assignees
                const applicantsData = safeArray(biblioArray?.parties?.applicants?.applicant);
                const applicantOriginal = applicantsData.filter(a => a?.$?.["data-format"] === "original");
                const applicantEpodoc = applicantsData.filter(a => a?.$?.["data-format"] === "epodoc");
                const applicantArray = (applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc)
                .map(a => safeText(a?.["applicant-name"]?.name)?.replace(/,+$/g, "").trim())
                .filter(Boolean);

                let translatedApplicants = [];
                const applicantChunks = chunkArray(applicantArray, 10);

                for (const chunk of applicantChunks) {
                const translatedChunk = await Promise.all(chunk.map(name => bulkBiblioTRanlsation(name)));
                translatedApplicants = [...translatedApplicants, ...translatedChunk];
                }
                const applicantNames = translatedApplicants.join("; ");
                console.log('applicantNames', applicantNames)

                // Inventors
                const inventorsData = safeArray(biblioArray?.parties?.inventors?.inventor);
                const inventorOriginal = inventorsData.filter(i => i?.$?.["data-format"] === "original");
                const inventorEpodoc = inventorsData.filter(i => i?.$?.["data-format"] === "epodoc");
                const inventorArray = (inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc)
                .map(i => safeText(i?.["inventor-name"]?.name)?.replace(/,+$/g, "").trim())
                .filter(Boolean);

                let translatedInventors = [];
                const inventorChunks = chunkArray(inventorArray, 10);
                for (const chunk of inventorChunks) {
                const translatedChunk = await Promise.all(chunk.map(name => bulkBiblioTRanlsation(name)));
                translatedInventors = [...translatedInventors, ...translatedChunk];
                }
                const inventorNames = translatedInventors.join("; ");
                console.log('inventorNames', inventorNames)
               

                const publicationDate = publicationDateFunction(biblioArray);
                const applicationDate = applicationDateFunction(biblioArray);
                const priorityDates = getPriorityDates(biblioArray);
                const cpcClass = classifications(biblioArray);

                const familyMembers = safeArray(
                    map?.family?.["world-patent-data"]?.["patent-family"]?.["family-member"]
                );

                const familyMembersData = familyMembers
                    .map((fm) => {
                        const publications = safeArray(fm?.["publication-reference"]?.["document-id"]);

                        let publicationInfo = publications
                            .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
                            .map((doc) => ({
                                familyId: fm?.["$"]?.["family-id"] || "",
                                familyPatent: `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`.trim().toUpperCase(),
                            }));

                        const uniqueInfo = Array.from(
                            new Map(publicationInfo.map(item => [item.familyPatent, item])).values()
                        );

                        let filteredInfo = uniqueInfo;
                        if (map?.patentNumber) {
                            const patentNumber = map.patentNumber.trim().toUpperCase();
                            filteredInfo = uniqueInfo.filter(item => item.familyPatent !== patentNumber);
                        }

                        return filteredInfo;
                    })
                    .flat();

                return {
                    patentNumber: safeText(map.patentNumber),
                    publicationUrl: famId.find((obj) => obj[map.patentNumber])?.[map.patentNumber] || "",
                    familyMembersData,
                    abstractText,
                    ipcrText,
                    cpcClass,
                    invention,
                    inventorNames,
                    applicantNames,
                    publicationDate,
                    applicationDate,
                    priorityDates,
                };
            } catch (err) {
                console.error("Error mapping espData:", err, map);
                return {};
            }
        })
    );
};








// export const mappedValue = (espData = [], famId = []) => {
//     return espData.map((map) => {
//         try {
//             const biblioArray =
//                 map?.biblio?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]?.[
//                 "bibliographic-data"
//                 ] ?? {};

//             const ipcrRaw = biblioArray?.["classifications-ipcr"]?.["classification-ipcr"];
//             const ipcrText = safeArray(ipcrRaw)
//                 .map((item) => normalizeText(item?.text))
//                 .filter(Boolean)
//                 .join("; ");

//             const abstractData =
//                 map?.biblio?.["world-patent-data"]?.["exchange-documents"]?.["exchange-document"]
//                     ?.abstract;
//             const abstractText = extractAbstractText(abstractData);

//             const invention = inventionTitle(biblioArray);

//             // const inventorsData = safeArray(biblioArray?.parties?.inventors?.inventor);
//             // const inventorNames = inventorsData
//             //     .filter((i) => i?.$?.["data-format"] === "original" || i?.$?.["data-format"] === "epodoc")
//             //     .map((i) => safeText(i?.["inventor-name"]?.name))
//             //     .join("; ");

//             // const applicantsData = safeArray(biblioArray?.parties?.applicants?.applicant);
//             // const applicantNames = applicantsData
//             //     .filter((a) => a?.$?.["data-format"] === "original" || a?.$?.["data-format"] === "epodoc" )
//             //     .map((a) => safeText(a?.["applicant-name"]?.name))
//             //     .join("; ");

//             // Inventors
            
//             // const inventorsData = safeArray(biblioArray?.parties?.inventors?.inventor);

//             // const inventorOriginal = inventorsData.filter(i => i?.$?.["data-format"] === "original");
//             // const inventorEpodoc = inventorsData.filter(i => i?.$?.["data-format"] === "epodoc");

//             // const inventorNames = (inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc)
//             //     .map(i => safeText(i?.["inventor-name"]?.name))
//             //     .join("; ");


//             // const applicantsData = safeArray(biblioArray?.parties?.applicants?.applicant);

//             // const applicantOriginal = applicantsData.filter(a => a?.$?.["data-format"] === "original");
//             // const applicantEpodoc = applicantsData.filter(a => a?.$?.["data-format"] === "epodoc");

//             // const applicantNames = (applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc)
//             //     .map(a => safeText(a?.["applicant-name"]?.name))
//             //     .join("; ");



//             const inventorsData = safeArray(biblioArray?.parties?.inventors?.inventor);

//             const inventorOriginal = inventorsData.filter(i => i?.$?.["data-format"] === "original");
//             const inventorEpodoc = inventorsData.filter(i => i?.$?.["data-format"] === "epodoc");

//             const inventorNames = (inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc)
//                 .map(i => safeText(i?.["inventor-name"]?.name)?.replace(/,+$/g, "").trim())
//                 .filter(Boolean)
//                 .join("; ");


//             const applicantsData = safeArray(biblioArray?.parties?.applicants?.applicant);

//             const applicantOriginal = applicantsData.filter(a => a?.$?.["data-format"] === "original");
//             const applicantEpodoc = applicantsData.filter(a => a?.$?.["data-format"] === "epodoc");

//             const applicantNames = (applicantOriginal.length > 0 ? applicantOriginal : applicantEpodoc)
//                 .map(a => safeText(a?.["applicant-name"]?.name)?.replace(/,+$/g, "").trim())
//                 .filter(Boolean)
//                 .join("; ");

// // ---------------------------------------------------

//             // const inventorsData = safeArray(biblioArray?.parties?.inventors?.inventor);

//             // const inventorOriginal = inventorsData.filter(i => i?.$?.["data-format"] === "original");
//             // const inventorEpodoc = inventorsData.filter(i => i?.$?.["data-format"] === "epodoc");

//             // const inventorNames = inventorOriginal.length > 0
//             //     ? [inventorOriginal[0]].map(i => safeText(i?.["inventor-name"]?.name)).join("; ")
//             //     : inventorEpodoc.map(i => safeText(i?.["inventor-name"]?.name)).join("; ");


//             // const applicantsData = safeArray(biblioArray?.parties?.applicants?.applicant);

//             // const applicantOriginal = applicantsData.filter(a => a?.$?.["data-format"] === "original");
//             // const applicantEpodoc = applicantsData.filter(a => a?.$?.["data-format"] === "epodoc");

//             // const applicantNames = applicantOriginal.length > 0
//             //     ? [applicantOriginal[0]].map(a => safeText(a?.["applicant-name"]?.name)).join("; ")
//             //     : applicantEpodoc.map(a => safeText(a?.["applicant-name"]?.name)).join("; ");



//             const publicationDate = publicationDateFunction(biblioArray);
//             const applicationDate = applicationDateFunction(biblioArray);
//             const priorityDates = getPriorityDates(biblioArray);
//             const cpcClass = classifications(biblioArray);

//             const familyMembers = safeArray(
//                 map?.family?.["world-patent-data"]?.["patent-family"]?.["family-member"]
//             );
//             // const familyMembersData = familyMembers.map((fm) => {
//             //     const publications = safeArray(fm?.["publication-reference"]?.["document-id"]);
//             //     const publicationInfo = publications
//             //         .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
//             //         .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
//             //         .join("");
//             //     return {
//             //         familyId: fm?.["$"]?.["family-id"] || "",
//             //         familyPatent: publicationInfo,
//             //     };
//             // });

//             const familyMembersData = familyMembers.map((fm) => {
//                 const publications = safeArray(fm?.["publication-reference"]?.["document-id"]);

//                 let publicationInfo = publications
//                     .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
//                     .map((doc) => ({
//                         familyId: fm?.["$"]?.["family-id"] || "",
//                         familyPatent: `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`.trim().toUpperCase(),
//                     }));

//                 const uniqueInfo = Array.from(
//                     new Map(publicationInfo.map(item => [item.familyPatent, item])).values()
//                 );

//                 let filteredInfo = uniqueInfo;
//                 if (map?.patentNumber) {
//                     const patentNumber = map.patentNumber.trim().toUpperCase();
//                     filteredInfo = uniqueInfo.filter(item => item.familyPatent !== patentNumber);
//                 }

//                 return filteredInfo;
//             }).flat();

//             return {
//                 patentNumber: safeText(map.patentNumber),
//                 publicationUrl: famId.find((obj) => obj[map.patentNumber])?.[map.patentNumber] || "",
//                 familyMembersData,
//                 abstractText,
//                 ipcrText,
//                 cpcClass,
//                 invention,
//                 inventorNames,
//                 applicantNames,
//                 publicationDate,
//                 applicationDate,
//                 priorityDates,
//             };
//         } catch (err) {
//             console.error("Error mapping espData:", err, map);
//             return {};
//         }
//     });
// };




// export const mappedValue = (espData = [], famId = []) => {
//     return espData?.map((map) => {
//         const biblioArray = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

//         const ipcrRaw = biblioArray?.['classifications-ipcr']?.['classification-ipcr'];
//         const ipcrText = Array.isArray(ipcrRaw)
//             ? ipcrRaw.map(item => normalizeText(item?.text)).filter(Boolean).join('; ')
//             : normalizeText(ipcrRaw?.text) || '';

//         const abstractData = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
//         const abstractText = extractAbstractText(abstractData);

//         const invention = inventionTitle(biblioArray);

//         const inventorsData = biblioArray?.parties?.inventors?.inventor;
//         const inventorNames = (() => {
//             if (!Array.isArray(inventorsData)) return '';

//             const epodocInventors = inventorsData
//                 .filter(item => item?.$?.['data-format'] === 'epodoc')
//                 .map(item => item?.['inventor-name']?.name?.trim())
//                 .filter(Boolean);

//             if (epodocInventors.length > 0) return epodocInventors.join('; ');

//             const originalInventors = inventorsData
//                 .filter(item => item?.$?.['data-format'] === 'original')
//                 .map(item => item?.['inventor-name']?.name?.trim())
//                 .filter(Boolean);

//             return originalInventors.join('; ');
//         })();

//         const applicantsData = biblioArray?.parties?.applicants?.applicant;
//         const applicantNames = (() => {
//             if (!applicantsData) return '';

//             const applicantArray = Array.isArray(applicantsData) ? applicantsData : [applicantsData];

//             const epodocApplicants = applicantArray
//                 .filter(app => app?.$?.['data-format'] === 'epodoc')
//                 .map(app => app?.['applicant-name']?.name?.trim())
//                 .filter(Boolean);

//             if (epodocApplicants.length > 0) return epodocApplicants.join('; ');

//             const originalApplicants = applicantArray
//                 .filter(app => app?.$?.['data-format'] === 'original')
//                 .map(app => app?.['applicant-name']?.name?.trim())
//                 .filter(Boolean);

//             return originalApplicants.join('; ');
//         })();

//         const publicationDate = publicationDateFunction(biblioArray);
//         const applicationDate = applicationDateFunction(biblioArray);
//         const priorityDates = getPriorityDates(biblioArray);
//         const cpcClass = classifications(biblioArray);

//         const familyMembers = map.family?.["world-patent-data"]?.["patent-family"]?.["family-member"];
//         const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];
//         const familyMembersData = familyMembersArray.map((familyMember) => {
//             const publications = familyMember?.["publication-reference"]?.["document-id"] || [];
//             const publicationInfo = (Array.isArray(publications) ? publications : [publications])
//                 .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
//                 .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
//                 .join('');

//             return {
//                 familyId: familyMember?.["$"]?.["family-id"],
//                 familyPatent: publicationInfo,
//             };
//         });

//         return {
//             patentNumber: map.patentNumber,
//             publicationUrl: (() => {
//                 const item = famId.find(obj => obj[map.patentNumber]);
//                 return item ? item[map.patentNumber] : '';
//             })(),
//             familyMembersData: familyMembersData,
//             abstractText: abstractText,
//             ipcrText: ipcrText,
//             cpcClass: cpcClass,
//             invention: invention,
//             inventorNames: inventorNames,
//             applicantNames: applicantNames,
//             publicationDate: publicationDate,
//             applicationDate: applicationDate,
//             priorityDates: priorityDates,
//         };
//     });
// };



// export const inventionTitle = (biblioArray) => {
//     const titleData = biblioArray?.['invention-title'];

//     if (Array.isArray(titleData)) {
//         const enTitle = titleData.find(t => t?.$?.lang === 'en');
//         return enTitle?._ || titleData[0]?._ || '';
//     } else if (titleData?.$?.lang === 'en') {
//         return titleData._ || '';
//     }
//     return titleData?._ || '';
// };


