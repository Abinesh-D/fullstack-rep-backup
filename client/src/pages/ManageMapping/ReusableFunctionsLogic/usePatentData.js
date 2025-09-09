import { useMemo, useEffect, useState } from "react";
import {
  getEnglishAbstract,
  convertDescriptionToKeyValue,
  famFilterFunction,
  getPriorityDates,
  extractIPCCode,
  getCleanPartyNames,
  mapFamilyMemberData,
  trasnlatedText,
  safeArray,
  safeText,
  capitalize,
  normalizeNames,
} from "./patentUtils.js";
import { bulkBiblioTRanlsation } from "../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice.js";

const usePatentData = async (data, type, pubNumber) => {
  const abstractData = getEnglishAbstract(data?.biblio);

  const descriptionText = (
    data?.descriptionData?.["world-patent-data"]?.["fulltext-documents"]?.[
      "fulltext-document"
    ]?.description.p || []
  ).join("\n");
  const formattedDescriptions = convertDescriptionToKeyValue(descriptionText);

  const publicationUrl = famFilterFunction(data);

  const googlePublicationUrl = `https://patents.google.com/patent/${pubNumber}/en`;

  const biblioData =
    data?.biblio?.["world-patent-data"]?.["exchange-documents"]?.[
      "exchange-document"
    ]?.["bibliographic-data"];

  // const inventorNames = useMemo(() => {
  //     const inventorsArray = Array.isArray(biblioData?.parties?.inventors?.inventor)
  //         ? biblioData.parties.inventors.inventor
  //         : biblioData?.parties?.inventors?.inventor
  //             ? [biblioData.parties.inventors.inventor]
  //             : [];
  //     return getCleanPartyNames(inventorsArray, 'inventor-name.name');
  // }, [biblioData]);

  // const applicantNames = useMemo(() => {

  //     const applicantsArray = Array.isArray(biblioData?.parties?.applicants?.applicant)
  //         ? biblioData.parties.applicants.applicant
  //         : biblioData?.parties?.applicants?.applicant
  //             ? [biblioData.parties.applicants.applicant]
  //             : [];
  //     return getCleanPartyNames(applicantsArray, 'applicant-name.name');
  // }, [biblioData]);

  async function inventionTitle(biblioData) {
    const titleData = biblioData?.["invention-title"];
    if (!titleData) return "";

    if (Array.isArray(titleData)) {
      const enTitle = titleData.find((t) => t?.$?.lang === "en");
      if (enTitle) return enTitle._ || "";

      return await bulkBiblioTRanlsation(titleData[0]._ || "");
    }

    if (titleData?.$?.lang === "en") {
      return titleData._ || "";
    }

    return await bulkBiblioTRanlsation(titleData?._ || "");
  }

  const title = inventionTitle();

  async function getInventorNames(biblioData) {
    const inventorsData = safeArray(biblioData?.parties?.inventors?.inventor);

    const inventorOriginal = inventorsData.filter(
      (i) => i?.$?.["data-format"] === "original"
    );
    const inventorEpodoc = inventorsData.filter(
      (i) => i?.$?.["data-format"] === "epodoc"
    );

    let finalInventors =
      inventorOriginal.length > 0 ? inventorOriginal : inventorEpodoc;

    const names = finalInventors
      .map((i) =>
        safeText(i?.["inventor-name"]?.name)?.replace(/,+$/g, "").trim()
      )
      .filter(Boolean);

    if (!names.length) return "";

    const formattedNames = names.map((n) => {
      let parts = n
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length === 2) {
        let [last, first] = parts;
        return `${capitalize(first)} ${capitalize(last)}`;
      }

      return capitalize(n);
    });

    const uniqueNames = Array.from(
      new Set(formattedNames.map((n) => n.toLowerCase()))
    ).map((lower) => formattedNames.find((n) => n.toLowerCase() === lower));

    const joinedNames = uniqueNames.join("; ");
    const normalizedNames = normalizeNames(joinedNames);
    const translated = await bulkBiblioTRanlsation(normalizedNames);
    return translated;
  }

  async function getApplicantNames(biblioData) {
    const applicantsData = safeArray(
      biblioData?.parties?.applicants?.applicant
    );
    console.log("applicantsData", applicantsData);

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
    return await bulkBiblioTRanlsation(joinedNames);
  }

  const inventorNames = await getInventorNames(biblioData);
  const applicantNames = await getApplicantNames(biblioData);

  // const inventionTitle = () => {
  //     const titleData = biblioData?.['invention-title'];

  //     if (Array.isArray(titleData)) {
  //         const enTitle = titleData.find(t => t?.$?.lang === 'en');
  //         if (enTitle) {
  //             return enTitle._ || '';
  //         }
  //         return titleData[0]._ || '';
  //     }
  //     else if (titleData?.$?.lang === 'en') {
  //         return titleData._ || '';
  //     }
  //     return titleData?._ || '';

  // }

  // const title = inventionTitle();

  const formatDate = (dateStr) =>
    dateStr && /^\d{8}$/.test(dateStr)
      ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
      : "";

  const applicationDate = useMemo(() => {
    const docIds = biblioData?.["application-reference"]?.["document-id"];
    const epodocDate = Array.isArray(docIds)
      ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
      : docIds?.$?.["document-id-type"] === "epodoc"
      ? docIds.date
      : null;
    return formatDate(epodocDate);
  }, [biblioData]);

  const publicationDate = useMemo(() => {
    const docIds = biblioData?.["publication-reference"]?.["document-id"];
    const epodocDate = Array.isArray(docIds)
      ? docIds.find((doc) => doc?.$?.["document-id-type"] === "epodoc")?.date
      : docIds?.$?.["document-id-type"] === "epodoc"
      ? docIds.date
      : null;
    return formatDate(epodocDate);
  }, [biblioData]);

  const priorityDates = useMemo(
    () => getPriorityDates(biblioData),
    [biblioData]
  );

  const classifications = useMemo(() => {
    const patentClassifications =
      biblioData?.["patent-classifications"]?.["patent-classification"];
    if (!Array.isArray(patentClassifications))
      return { cpc: "", US_Classification: "" };

    const cpcSet = new Set();
    const usSet = new Set();

    patentClassifications.forEach((item) => {
      const scheme = item["classification-scheme"]?.$?.scheme;
      if (scheme === "CPCI") {
        const {
          section,
          class: cls,
          subclass,
          "main-group": mainGroup,
          subgroup,
        } = item;
        const cpcCode = `${section}${cls}${subclass}${mainGroup}/${subgroup}`;
        cpcSet.add(cpcCode);
      } else if (scheme === "UC") {
        usSet.add(item["classification-symbol"]);
      }
    });

    return {
      cpc: [...cpcSet].join(", "),
      US_Classification: [...usSet].join(", "),
    };
  }, [biblioData]);

  const ipcrRaw = biblioData?.["classifications-ipcr"]?.["classification-ipcr"];
  const ipc = biblioData?.["classification-ipc"]?.text || "";

  const ipcrText = useMemo(() => {
    if (!ipcrRaw) return "";
    return Array.isArray(ipcrRaw)
      ? ipcrRaw
          .map((item) => extractIPCCode(item?.text))
          .filter(Boolean)
          .join(", ")
      : extractIPCCode(ipcrRaw?.text) || "";
  }, [ipcrRaw]);

  const ipcFormatted = ipc ? `${ipc}, ` : "";
  const ipcrFormatted = ipcrText ? `${ipcrText}, ` : "";

  const classificationsSymbol = `${ipcrFormatted}${ipcFormatted}${classifications.cpc}`;
  const famData = mapFamilyMemberData(data);

  const familyMemData = famData
    ?.filter((ptn) => ptn.familyPatent !== data.patentNumber)
    ?.map((f) => f?.familyPatent)
    .join(", ");

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
    };
  }
};

export default usePatentData;
