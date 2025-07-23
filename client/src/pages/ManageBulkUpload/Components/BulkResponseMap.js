export const mapRelatedData =  (mappedValue =[]) => {
    return mappedValue?.map((item) => ({
        publicationNumber: item.patentNumber || "",
        relatedPublicationUrl: item.publicationUrl || "",
        relatedTitle: item.invention || "",
        relatedAssignee: item.applicantNames
            ? item.applicantNames.split(";").map((name) => name.trim())
            : [],
        relatedInventor: item.inventorNames
            ? item.inventorNames.split(";").map((name) => name.trim())
            : [],
        relatedFamilyMembers: item.familyMembersData
            ? item.familyMembersData.map((f) => f.familyPatent)
            : [],
        relatedPublicationDate: item.publicationDate || "",
        relatedPriorityDate: item.priorityDates || "",
    }));
};



// utils/espacenetHelpers.js

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

export const inventionTitle = (biblioArray) => {
    const titleData = biblioArray?.['invention-title'];

    if (Array.isArray(titleData)) {
        const enTitle = titleData.find(t => t?.$?.lang === 'en');
        return enTitle?._ || titleData[0]?._ || '';
    } else if (titleData?.$?.lang === 'en') {
        return titleData._ || '';
    }
    return titleData?._ || '';
};

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

export const mappedValue = (espData = [], famId = []) => {
    return espData?.map((map) => {
        const biblioArray = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

        const ipcrRaw = biblioArray?.['classifications-ipcr']?.['classification-ipcr'];
        const ipcrText = Array.isArray(ipcrRaw)
            ? ipcrRaw.map(item => normalizeText(item?.text)).filter(Boolean).join('; ')
            : normalizeText(ipcrRaw?.text) || '';

        const abstractData = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;
        const abstractText = extractAbstractText(abstractData);

        const invention = inventionTitle(biblioArray);

        const inventorsData = biblioArray?.parties?.inventors?.inventor;
        const inventorNames = (() => {
            if (!Array.isArray(inventorsData)) return '';

            const epodocInventors = inventorsData
                .filter(item => item?.$?.['data-format'] === 'epodoc')
                .map(item => item?.['inventor-name']?.name?.trim())
                .filter(Boolean);

            if (epodocInventors.length > 0) return epodocInventors.join('; ');

            const originalInventors = inventorsData
                .filter(item => item?.$?.['data-format'] === 'original')
                .map(item => item?.['inventor-name']?.name?.trim())
                .filter(Boolean);

            return originalInventors.join('; ');
        })();

        const applicantsData = biblioArray?.parties?.applicants?.applicant;
        const applicantNames = (() => {
            if (!applicantsData) return '';

            const applicantArray = Array.isArray(applicantsData) ? applicantsData : [applicantsData];

            const epodocApplicants = applicantArray
                .filter(app => app?.$?.['data-format'] === 'epodoc')
                .map(app => app?.['applicant-name']?.name?.trim())
                .filter(Boolean);

            if (epodocApplicants.length > 0) return epodocApplicants.join('; ');

            const originalApplicants = applicantArray
                .filter(app => app?.$?.['data-format'] === 'original')
                .map(app => app?.['applicant-name']?.name?.trim())
                .filter(Boolean);

            return originalApplicants.join('; ');
        })();

        const publicationDate = publicationDateFunction(biblioArray);
        const applicationDate = applicationDateFunction(biblioArray);
        const priorityDates = getPriorityDates(biblioArray);
        const cpcClass = classifications(biblioArray);

        const familyMembers = map.family?.["world-patent-data"]?.["patent-family"]?.["family-member"];
        const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];
        const familyMembersData = familyMembersArray.map((familyMember) => {
            const publications = familyMember?.["publication-reference"]?.["document-id"] || [];
            const publicationInfo = (Array.isArray(publications) ? publications : [publications])
                .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
                .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
                .join('');

            return {
                familyId: familyMember?.["$"]?.["family-id"],
                familyPatent: publicationInfo,
            };
        });

        return {
            patentNumber: map.patentNumber,
            publicationUrl: (() => {
                const item = famId.find(obj => obj[map.patentNumber]);
                return item ? item[map.patentNumber] : '';
            })(),
            familyMembersData: familyMembersData,
            abstractText: abstractText,
            ipcrText: ipcrText,
            cpcClass: cpcClass,
            invention: invention,
            inventorNames: inventorNames,
            applicantNames: applicantNames,
            publicationDate: publicationDate,
            applicationDate: applicationDate,
            priorityDates: priorityDates,
        };
    });
};
