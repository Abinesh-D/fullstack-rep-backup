import { useMemo } from "react";
import {
    getEnglishAbstract,
    convertDescriptionToKeyValue,
    famFilterFunction,
    getPriorityDates,
    extractIPCCode,
    getCleanPartyNames,
    mapFamilyMemberData,
} from "./patentUtils.js";

const usePatentData = (data, type, pubNumber) => {
    const abstractData = getEnglishAbstract(data?.biblio);

    const descriptionText = (data?.descriptionData?.['world-patent-data']?.['fulltext-documents']?.['fulltext-document']?.description.p || []).join('\n');
    const formattedDescriptions = convertDescriptionToKeyValue(descriptionText);

    const publicationUrl = famFilterFunction(data);

    const googlePublicationUrl = `https://patents.google.com/patent/${pubNumber}/en`;

    const biblioData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

    const inventorNames = useMemo(() => {
        const inventorsArray = Array.isArray(biblioData?.parties?.inventors?.inventor)
            ? biblioData.parties.inventors.inventor
            : biblioData?.parties?.inventors?.inventor
                ? [biblioData.parties.inventors.inventor]
                : [];
        return getCleanPartyNames(inventorsArray, 'inventor-name.name');
    }, [biblioData]);




    const applicantNames = useMemo(() => {
        const applicantsArray = Array.isArray(biblioData?.parties?.applicants?.applicant)
            ? biblioData.parties.applicants.applicant
            : biblioData?.parties?.applicants?.applicant
                ? [biblioData.parties.applicants.applicant]
                : [];
        return getCleanPartyNames(applicantsArray, 'applicant-name.name');
    }, [biblioData]);

    const inventionTitle = () => {
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

    const title = inventionTitle();

    const formatDate = (dateStr) =>
        dateStr && /^\d{8}$/.test(dateStr)
            ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
            : '';

    const applicationDate = useMemo(() => {
        const docIds = biblioData?.['application-reference']?.['document-id'];
        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;
        return formatDate(epodocDate);
    }, [biblioData]);


    const publicationDate = useMemo(() => {
        const docIds = biblioData?.['publication-reference']?.['document-id'];
        const epodocDate = Array.isArray(docIds)
            ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
            : docIds?.$?.['document-id-type'] === 'epodoc'
                ? docIds.date
                : null;
        return formatDate(epodocDate);
    }, [biblioData]);

    
    const priorityDates = useMemo(() => getPriorityDates(biblioData), [biblioData]);

    const classifications = useMemo(() => {
        const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];
        if (!Array.isArray(patentClassifications)) return { cpc: '', US_Classification: '' };

        const cpcSet = new Set();
        const usSet = new Set();

        patentClassifications.forEach((item) => {
            const scheme = item['classification-scheme']?.$?.scheme;
            if (scheme === 'CPCI') {
                const { section, class: cls, subclass, 'main-group': mainGroup, subgroup } = item;
                const cpcCode = `${section}${cls}${subclass}${mainGroup}/${subgroup}`;
                cpcSet.add(cpcCode);
            } else if (scheme === 'UC') {
                usSet.add(item['classification-symbol']);
            }
        });

        return {
            cpc: [...cpcSet].join(', '),
            US_Classification: [...usSet].join(', ')
        };
    }, [biblioData]);

    const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];
    const ipc = biblioData?.['classification-ipc']?.text || '';

    const ipcrText = useMemo(() => {
        if (!ipcrRaw) return '';
        return Array.isArray(ipcrRaw)
            ? ipcrRaw.map(item => extractIPCCode(item?.text)).filter(Boolean).join(', ')
            : extractIPCCode(ipcrRaw?.text) || '';
    }, [ipcrRaw]);

    const ipcFormatted = ipc ? `${ipc}, ` : '';
    const ipcrFormatted = ipcrText ? `${ipcrText}, ` : '';

    const classificationsSymbol = `${ipcrFormatted}${ipcFormatted}${classifications.cpc}`;
    const famData = mapFamilyMemberData(data);

    const familyMemData = famData?.filter(ptn=> ptn.familyPatent !== data.patentNumber)?.map(f => f?.familyPatent).join(', ');

    if (type === "relevant") {
        return {
            title,
            publicationUrl,
            googlePublicationUrl,
            abstractData,
            aplDate: applicationDate,
            pubDate: publicationDate,
            priorityDates,
            inventorNames,
            applicantNames,
            classificationsSymbol,
            classData: classifications,
            familyMemData,
            formattedDescriptions,
            ipcClass: `${ipcrFormatted}${ipcFormatted},`,
            cpcClass: classifications.cpc,
        };
    } else if (type === "related") {
        return {
            relatedPublicationUrl: publicationUrl,
            relatedTitle: title,
            relatedAssignee: applicantNames,
            relatedInventor: inventorNames,
            relatedPublicationDate: publicationDate,
            relatedPriorityDate: priorityDates,
            relatedFamilyMembers: familyMemData,
        }
    }

};

export default usePatentData;
