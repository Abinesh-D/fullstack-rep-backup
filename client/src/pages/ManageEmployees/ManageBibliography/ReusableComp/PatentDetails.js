import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CalendarDays } from 'lucide-react';
import CopyableField from './CopyableFiled';
import Flag from 'react-world-flags';
import NoDataFound from './NoDataFound';
import WIPO from '../../../../assets/images/WO.png';
import EPO from '../../../../assets/images/EP.png';
import { isEmptyArray } from 'formik';
import { Badge, Button } from 'reactstrap';
import ScrollButtons from './ScrollButtons';
import { useSelector } from 'react-redux';
import LegalStatusModal from './ModalWindow';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut', delayChildren: 0.3, staggerChildren: 0.2 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 80 },
  },
};

const Section = ({ children }) => (
  <motion.div
    variants={sectionVariants}
    whileHover={{ scale: 1.01 }}
    className="p-4 bg-gray-50 rounded-xl shadow-sm border hover:shadow-md transition"
  >
    {children}
  </motion.div>
);

const PatentDetails = ({ data, legalData, copied, copyToClipboard, type }) => {

  const [famId, setfamId] = useState("");
  // const [modalOpen, setModalOpen] = useState(false);

  const shortedLegalData = legalData?.['world-patent-data']?.['patent-family']?.['family-member'][0]?.legal;

  // const toggleModal = () => setModalOpen(!modalOpen);

  const mapFamilyMemberData = (data) => {
    const familyMembers = data.familyData["world-patent-data"]["patent-family"]["family-member"];

    const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];

    const mappedFamilyData = familyMembersArray.map((familyMember) => {
      const publications = familyMember["publication-reference"] ? familyMember["publication-reference"]["document-id"] : [];

      const publicationInfo = publications
        .filter(doc => doc["$"]["document-id-type"] === "docdb")
        .map(doc => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
        .join('');

      return {
        familyId: familyMember["$"]["family-id"],
        familyPatent: publicationInfo
      };
    });

    return mappedFamilyData;
  };

  useEffect(() => {
    if (type === 'esp') {
      let familyIDs = [];
      const familyMember = data.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];

      if (Array.isArray(familyMember)) {
        familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"][0]?.["$"]?.["family-id"];

      } else if  ( typeof familyMember === 'object') {
        familyIDs = data.familyData["world-patent-data"]?.["patent-family"]?.["family-member"]?.["$"]?.["family-id"];
      }
      setfamId(`https://worldwide.espacenet.com/patent/search/family/0${familyIDs}/publication/${data?.patentNumber}?q=${data?.patentNumber}`);
    }
  }, [])



  const lensPageUrl = useSelector(state => state.patentSlice.lensPageUrl);

  const biblioData = useMemo(() => {
    return data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];
  }, [data]);

  const abstractData = data?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;

  const ipcrRaw = biblioData?.['classifications-ipcr']?.['classification-ipcr'];

  const normalizeText = text => text?.replace(/\s+/g, '').trim();

  const ipcrText = Array.isArray(ipcrRaw) ? ipcrRaw.map(item => normalizeText(item?.text)).filter(Boolean).join('; ') : normalizeText(ipcrRaw?.text) || '';

  const inventionTitle = useMemo(() => {
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
  }, [biblioData]);


  const inventorsData = biblioData?.parties?.inventors?.inventor;

  const inventorNames = Array.isArray(inventorsData) ? inventorsData.filter(item => item?.$?.['data-format'] === 'epodoc')
    .map(item => item?.['inventor-name']?.name?.trim()).filter(Boolean).join('; ') : '';

  const applicantsData = biblioData?.parties?.applicants?.applicant;

  const applicantNames = Array.isArray(applicantsData)
    ? applicantsData
      .filter(app => app?.$?.['data-format'] === 'epodoc')
      .map(app => app?.['applicant-name']?.name?.trim())
      .filter(Boolean)
      .join('; ')
    : '';

  const applicationDate = useMemo(() => {
    const docIds = biblioData?.['application-reference']?.['document-id'];

    const epodocDate = Array.isArray(docIds)
      ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
      : docIds?.$?.['document-id-type'] === 'epodoc'
        ? docIds.date
        : null;
    const formatDate = (dateStr) =>
      dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : 'N/A';

    return formatDate(epodocDate);
  }, [biblioData]);

  const publicationDate = useMemo(() => {
    const docIds = biblioData?.['publication-reference']?.['document-id'];

    const epodocDate = Array.isArray(docIds)
      ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
      : docIds?.$?.['document-id-type'] === 'epodoc'
        ? docIds.date
        : null;

    const formatDate = (dateStr) =>
      dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : 'N/A';

    return formatDate(epodocDate);
  }, [biblioData]);


  const priorityDates = useMemo(() => {
    let claims = biblioData?.['priority-claims']?.['priority-claim'];
    if (!Array.isArray(claims) ) {
      if (typeof claims === 'object' && claims !== null) {
        claims = [claims];
      } else {
        return 'N/A';
      }
    }

    const epodocDates = claims.map(claim => {
      const docIds = claim['document-id'];
      if (!Array.isArray(docIds)) return null;

      const epodoc = docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc');
      const rawDate = epodoc?.date?.trim();

      if (rawDate && /^\d{8}$/.test(rawDate)) {
        return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
      }

      return rawDate || null;
    }).filter(Boolean);

    return epodocDates.length ? epodocDates.join('; ') : 'N/A';
  }, [biblioData]);

  const classifications = useMemo(() => {
    const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];

    if (!Array.isArray(patentClassifications)) return { cpc: 'N/A', US_Classification: 'N/A' };

    let cpcClassifications = [];
    let usClassifications = [];

    patentClassifications.forEach((item) => {
      const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

      if (scheme.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
        cpcClassifications.push(`${section}${classValue}${subclass}${mainGroup}/${subgroup}`);
      }

      if (scheme.$?.scheme === 'UC') {
        const classificationSymbol = item['classification-symbol'];
        if (classificationSymbol) {
          usClassifications.push(classificationSymbol);
        }
      }
    });

    const cpc = cpcClassifications.length > 0 ? cpcClassifications.join('; ') : 'N/A';

    const US_Classification = usClassifications.length > 0 ? usClassifications.join('; ') : 'N/A';

    return { cpc, US_Classification };
  }, [biblioData]);


  const getCountryCodeFromPatent = (patentNumber) =>
    patentNumber ? patentNumber.slice(0, 2) : null;
  const countryFlag = getCountryCodeFromPatent(data.patentNumber);

  const statusColorMap = {
    ACTIVE: "success",
    PENDING: "primary",
    EXPIRED: "danger"
  };
  
  const status = data.legal_status?.patent_status;
  const badgeColor = statusColorMap[status] || "secondary"; 
  const badgeText = status || "Patent Status not available";
  const isStatusAvailable = !!status;

  

  return (
    <>
      {(data.biblio === null || isEmptyArray(data)) ? (
        <>
        <NoDataFound type={type} />
        </>
      ) : (
        <>
          <motion.div
            className="bibliographic-container p-8 bg-white rounded-3xl shadow-2xl space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h4
              className="text-4xl font-bold text-gray-800 flex items-center gap-3"
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <FileText className="text-blue-500" /> Patent Bibliographic Details
            </motion.h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Section>
                <div className="space-y-3">
                  <p className="font-semibold text-gray-700">🔢 <strong>Patent Number :</strong></p>
                  <Badge color="primary" pill className="text-base px-4 py-2">
                    {(type === 'esp' && data?.patentNumber || type === 'lens' && data?.patentNumber || type === 'gle' && data?.patentNumber)}
                  </Badge>
                  <p className="font-semibold text-gray-700 mt-4">🌐 <strong>Country / Organization :</strong></p>

                  <p className="flex items-center gap-3 px-4 py-2 mt-2 bg-gray-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200">
                    <span className="text-gray-800 text-base font-medium">
                      <b>
                        {(type === 'esp' && data?.country) || (type === 'lens' && data?.country) || (type === 'gle' && data?.country)}
                      </b>
                    </span>

                    {(countryFlag === 'WO' || countryFlag === 'EP') ? (
                      <img src={countryFlag === 'WO' ? WIPO : EPO} alt="img not found"
                        style={{ width: 30, height: 20, margin: '5px', borderRadius: '4px', border: '1px solid #ccc', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                        className="hover:scale-110" />
                    ) : (data?.patentNumber && (
                      <Flag code={countryFlag} style={{ width: 30, height: 20, margin: '5px', borderRadius: '4px', border: '1px solid #ccc', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                        className="hover:scale-110" />
                    ))}
                  </p>
                  <>
                    <p className="font-semibold text-gray-700 mt-4">🔗 <strong>Patent URL :</strong></p>
                    <a href={(type === 'esp' && famId || type === 'lens' && lensPageUrl || type === 'gle' && data.url)} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {(type === 'esp' && 'View on Espacenet' || type === 'lens' && "View on Lens" || type === 'gle' && "View on Google")}
                    </a>
                  </>
                </div>
              </Section>
              <Section>
                <div className="space-y-3">
                  <CopyableField label={`📌 Title${data.title_translated ? ' (Translated)' : ''}`} text={(type === 'esp' && inventionTitle || type === 'lens' && data.title || type === 'gle' && data.title)} field="title" />
                  <CopyableField label="👨‍🔬 Inventors" text={(type === 'esp' && inventorNames || type === 'lens' && data.inventors || type === 'gle' && data.inventors) || "Inventor data not available"} field="inventors" />
                  <CopyableField label="🏢 Assignee" text={(type === 'esp' && applicantNames || type === 'lens' && data.assignee || type === 'gle' && data.assignee) || "Assignee data not available"} field="assignee" />
                </div>
              </Section>
              <Section>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
                  <CopyableField label={<><CalendarDays className="inline-block mr-1" size={18} /><strong>Publication/Granted Date </strong></>}
                    text={(type === 'esp' && publicationDate || type === 'lens' && data.publicationDate || type === 'gle' && data.publicationDate)} field="publication-date" />

                  <CopyableField label={<> <CalendarDays className="inline-block mr-1" size={18} /><strong>Application/Filing Date </strong></>}
                    text={type === 'esp' && applicationDate || type === 'lens' && data.applicationDate || type === 'gle' && data.applicationDate} field="application-date" />
                  <CopyableField label={<> <CalendarDays className="inline-block mr-1" size={18} /><strong>Priority Dates </strong> </>}
                    text={type === 'esp' && priorityDates || type === 'lens' && data.priorityDate || type === 'gle' && data.priorityDate} field="priority-dates" />
                </div>
              </Section>

              <Section>
                <div className="space-y-2">
                  {type === 'esp' ? (
                    Array.isArray(abstractData) ? (
                      (() => {
                        const englishAbstract = abstractData.find(a => a?.$?.lang === 'en');
                        const anyAbstract = abstractData[0];

                        if (englishAbstract) {
                          return (
                            <CopyableField
                              label="📄 Abstract"
                              text={englishAbstract.p}
                              field="abstract-esp-en"
                            />
                          );
                        } else if (anyAbstract) {
                          return (
                            <CopyableField
                              label={`📄 Abstract (${anyAbstract.$?.lang || 'unknown'})`}
                              text={anyAbstract.p}
                              field="abstract-esp-other"
                            />
                          );
                        } else {
                          return (
                            <CopyableField
                              label="📄 Abstract"
                              text="Abstract not available"
                              field="abstract-esp-na"
                            />
                          );
                        }
                      })()
                    ) : abstractData?.$ ? (
                      <CopyableField
                        label="📄 Abstract"
                        text={abstractData.p}
                        field="abstract-esp-single"
                      />
                    ) : (
                      <CopyableField
                        label="📄 Abstract"
                        text="Abstract not available"
                        field="abstract-esp-na"
                      />
                    )
                  ) : type === 'lens' ? (
                    <CopyableField
                      label="📄 Abstract"
                      text={data.abstract?.[0]?.text || 'Abstract not available'}
                      field="abstract-lens"
                    />
                  ) : type === 'gle' ? (
                    <CopyableField
                      label="📄 Abstract"
                      text={data.abstract || 'Abstract not available'}
                      field="abstract-gle"
                    />
                  ) : (
                    <CopyableField
                      label="📄 Abstract"
                      text="Abstract not available"
                      field="abstract"
                    />
                  )}
                </div>
              </Section>
              <Section>
                <div className="space-y-4 text-gray-800">
                  <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    🧩 Classifications
                  </h3>
                  <div className="space-y-2">
                    {
                      type === 'gle' &&
                      <CopyableField label="CPC" text={data?.classificationCode?.join('; ')} field="cpc" />
                    }
                    {type !== 'gle' &&
                      <>
                        <CopyableField label="🔢 IPC" text={(type === 'esp' && ipcrText || type === 'lens' && data.ipc || type === 'gle' && data.ipc) || 'Not available'} field="ipc" />
                        <CopyableField label="📗 CPC" text={type === 'esp' && classifications.cpc || type === 'lens' && data.cpc || type === 'gle' && data.cpc} field="cpc" />
                      </>
                    }
                    {classifications.US_Classification !== 'N/A' && (
                      <CopyableField label="📙 USC" text={classifications.US_Classification} field="usc" />
                    )}
                  </div>
                </div>
              </Section>
              <Section>
                <div className="space-y-4 text-gray-800">
                  <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                    👨‍👩‍👧 Family Members
                  </h3>
                  <div className="space-y-2">
                    {
                      type === 'esp' &&
                      <CopyableField
                        label="Simple Family "
                        text={mapFamilyMemberData(data).map(data => data.familyPatent).join('; ') || 'N/A'}
                        field="simple-family"
                      />
                    }
                    {
                      type === 'lens' &&
                      <CopyableField
                        label="👪 Simple Family "
                        text={Array.isArray(data.simple_family) ? data.simple_family.join(', ') : data.simple_family || 'N/A'}
                        field="simple-family"
                      />
                    }
                     {
                      type === 'gle' &&
                      <CopyableField
                        label="👪 Family Patent "
                        text={data.family || 'N/A'}
                        field="patent-family"
                      />
                    }
                  </div>
                </div>
              </Section>
              {
                type === 'lens' && (
                  <Section >
                    <div className="space-y-4 text-gray-800">
                      <h3 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
                        ⚖️ Legal Status
                      </h3>
                      <div className='space-y-4'>
                        <CopyableField
                          label="Anticipated term date"
                          text={data.legal_status.anticipated_term_date || 'Anticipated term date is not available'}
                          field="legal-status-lens"
                        />

                        <div className="d-flex align-items-center mb-3">
                          <strong className="me-2">Patent Status :</strong>
                            <Badge
                              color={badgeColor}
                              style={{ padding: "5px 10px" }}
                              pill
                            >
                              {isStatusAvailable ? badgeText.charAt(0).toUpperCase() + badgeText.slice(1).toLowerCase() : badgeText}
                            </Badge>

                        </div>
                        <div className='space-y-4'>
                          <CopyableField
                            label="Grant date"
                            text={data.legal_status.grant_date || 'Grant date is not available'}
                            field="legal-status-lens"
                          />

                          <div className="mt-2">
                            <strong className="mb-1">Calculation Log:</strong>
                            {Array.isArray(data.legal_status?.calculation_log) && data.legal_status.calculation_log.length > 0 ? (
                              <ol className="mt-1">
                                {data.legal_status.calculation_log.map((item, index) => (
                                  <li key={index}>{item}</li>
                                ))}
                              </ol>
                            ) : (
                              <p>Calculation log is not available</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Section>
                )}

                <div className="container mt-4">
                  {/* <Button color="primary" onClick={toggleModal}>
                    View Legal Status
                  </Button> */}
                  {/* <h3>Legal Status</h3> */}

                  {/* <LegalStatusModal
                    isOpen={modalOpen}
                    toggle={toggleModal}
                    legalStatusData={shortedLegalData}
                  /> */}
                </div>

            </div>
            <ScrollButtons />
          </motion.div>
        </>
      )
      }
    </>
  );
};

export default PatentDetails;












// import React from 'react';
// import { Badge } from 'reactstrap';
// import { motion } from 'framer-motion';
// import { Copy } from 'lucide-react';
// import CopyableField from './CopyableFiled';

// const sectionVariants = {
//   hidden: { opacity: 0, y: 30 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: { delay: i * 0.2, type: 'spring', stiffness: 100 },
//   }),
// };

// const Section = ({ children, index }) => (
//   <motion.div
//     className="p-4 bg-gray-50 rounded-lg shadow"
//     custom={index}
//     initial="hidden"
//     animate="visible"
//     variants={sectionVariants}
//   >
//     {children}
//   </motion.div>
// );

// const PatentDetails = ({ data }) => {
//   return (
//     <div className="bibliographic-container p-6 bg-white rounded-2xl shadow-2xl space-y-6">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">📄 Patent Bibliographic Details</h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Section index={0}>
//           <div className="flex flex-col space-y-2">
//             <p className="text-gray-600 font-semibold"><strong>Patent Number :</strong></p>
//             <Badge color="primary" pill className="text-base px-4 fs-6 py-2 self-start">
//               {data.patentNumber}
//             </Badge>

//             <p className="text-gray-600 font-semibold mt-3"><strong>Country / Org :</strong></p>
//             <p>{data.country}</p>

//             <p className="text-gray-600 font-semibold mt-3"><strong>Patent URL :</strong></p>
//             <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//               Click to view on Espacenet
//             </a>
//           </div>
//         </Section>

//         <Section index={1}>
//           <div className="space-y-2">
//             <CopyableField label={`Title${data.title_translated ? ' (Translated)' : ''}`} text={data.title} field="title" />
//             <CopyableField label={`Inventors${data.inventors_translated ? ' (Translated)' : ''}`} text={data.inventors} field="inventors" />
//             <CopyableField label={`Assignee${data.assignee_translated ? ' (Translated)' : ''}`} text={data.assignee} field="assignee" />
//           </div>
//         </Section>

//         <Section index={2}>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <p><strong>📅 Publication Date:</strong> {data.publicationDate}</p>
//             <p><strong>📝 Application Date:</strong> {data.applicationDate}</p>
//             <p><strong>🔖 Priority Date:</strong> {data.priorityDate}</p>
//           </div>
//         </Section>

//         <Section index={3}>
//           <div className="space-y-2">
//             {Array.isArray(data.abstract) ? (
//               data.abstract.map((a, idx) => (
//                 <CopyableField
//                   key={idx}
//                   label={`Abstract (${a.lang.toUpperCase()})${data.abstract_translated ? ' (Translated)' : ''}`}
//                   text={a.text}
//                   field={`abstract-${a.lang}`}
//                 />
//               ))
//             ) : (
//               <CopyableField label="Abstract" text="Abstract not available" field="abstract" />
//             )}
//           </div>
//         </Section>

//         <Section index={4}>
//           <div className="space-y-2">
//             <p><strong>🔍 IPC:</strong> {data.ipc}</p>
//             <p><strong>🔎 CPC:</strong> {data.cpc}</p>
//           </div>
//         </Section>

//         <Section index={5}>
//           <div className="space-y-2">
//             <p><strong>👨‍👩‍👧 Simple Family:</strong> {Array.isArray(data.simple_family) ? data.simple_family.join(', ') : data.simple_family}</p>
//             <p><strong>👥 Extended Family:</strong> {Array.isArray(data.extended_family) ? data.extended_family.join(', ') : data.extended_family}</p>
//           </div>
//         </Section>
//       </div>
//     </div>
//   );
// };

// export default PatentDetails;












// import React from 'react';
// import { Badge } from 'reactstrap';
// import { motion } from 'framer-motion';
// import { Copy } from 'lucide-react';
// import CopyableField from './CopyableFiled';

// const PatentDetails = ({ data, copied, copyToClipboard }) => {
//     return (
//       <div className="bibliographic-container p-6 bg-white rounded-xl shadow-lg space-y-4 animate-fade-in">
//         <h2 className="text-2xl font-bold text-gray-800 mb-4 animate-fade-in-up">Bibliographic Details</h2>  
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
//             className="d-flex align-items-center gap-2 mb-2"
//             style={{ fontSize: '1rem', color: '#333' }}
//           >
//             <strong>Patent Number:</strong>
//             <motion.div whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.95 }}>
//               <Badge color="primary" pill style={{ fontSize: '0.95rem', padding: '0.6em 0.9em' }}>
//                 {data.patentNumber}
//               </Badge>
//             </motion.div>
//           </motion.div>  
//           <p>
//             <strong>URL:</strong>{' '}
//             <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
//               Click to open patent file
//             </a>
//           </p>  
//           <p><strong>Country Name/Organization:</strong> {data.country}</p>
  
//           <CopyableField label={`Title${data.title_translated ? ' (Translated)' : ''}`} text={data.title} field="title" />
//           <CopyableField label={`Inventors${data.inventors_translated ? ' (Translated)' : ''}`} text={data.inventors} field="inventors" />
//           <CopyableField label={`Assignee${data.assignee_translated ? ' (Translated)' : ''}`} text={data.assignee} field="assignee" />
  
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Application Date:</strong> {data.applicationDate}</p>
//           <p><strong>Priority Date:</strong> {data.priorityDate}</p>
  
//           <div className="md:col-span-2">
//             {console.log('data.abstract :>> ', data.abstract)}
//             <CopyableField label={`Abstract${data.abstract_translated ? ' (Translated)' : ''}`} text={data.abstract[0].text} field="abstract" />
//           </div>
//         </div>  
//         <div className="classification-container">
//           <div className="classification-grid">
//           <p><strong>Classification IPC:</strong> {data.ipc}</p>
//           <p><strong>Classification CPC:</strong> {data.cpc}</p>
//           </div>
//         </div>  
//         <p><strong>Simple Family:</strong> {Array.isArray(data.simple_family) ? data.simple_family.join(', ') : data.simple_family}</p>
//         <p><strong>Extended Family:</strong> {Array.isArray(data.extended_family) ? data.extended_family.join(', ') : data.extended_family}</p>
//       </div>
//     );
//   };

// export default PatentDetails;















  
// const PatentDetails = ({ data, copied, copyToClipboard }) => {
//     const [copiedField, setCopiedField] = React.useState('');

//     const handleCopy = (text, field) => {
//         navigator.clipboard.writeText(text).then(() => {
//             setCopiedField(field);
//             setTimeout(() => setCopiedField(''), 2000);
//         });
//     };

//     const renderCopyIcon = (text, field) => (
//         <span className="inline-flex items-center gap-1 ml-2 cursor-pointer text-blue-600" onClick={() => handleCopy(text, field)} title={`Copy ${field}`}>
//             <Copy size={16} />
//             {copiedField === field && <span className="text-green-600 text-xs">Copied!</span>}
//         </span>
//     );

//     return (
//         <div className="bibliographic-container p-6 bg-white rounded-xl shadow-lg space-y-4 animate-fade-in">
//             <h2 className="bibliographic-title text-2xl font-bold text-gray-800 mb-4 animate-fade-in-up">
//                 Bibliographic Details
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
//                     className="d-flex align-items-center gap-2 mb-2"
//                     style={{ fontSize: '1rem', color: '#333' }}
//                 >
//                     <strong>Patent Number:</strong>
//                     <motion.div whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.95 }}>
//                         <Badge color="primary" pill style={{ fontSize: '0.95rem', padding: '0.6em 0.9em' }}>
//                             {data.publicationNo}
//                         </Badge>
//                     </motion.div>
//                 </motion.div>

//                 <p><strong>URL:</strong> <a href={data.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Click to open patent file</a></p>
//                 <p><strong>Country Name/Organization:</strong> {data.countryCode}</p>
//                 <p>
//                     <strong>Title{data.title_translated ? ' (Translated)' : ''}:</strong> {data.title}
//                     {renderCopyIcon(data.title, 'title')}
//                 </p>
//                 <p>
//                     <strong>Inventors{data.inventors_translated ? ' (Translated)' : ''}:</strong> {data.inventors}
//                     {renderCopyIcon(data.inventors, 'inventors')}
//                 </p>
//                 <p>
//                     <strong>Assignee{data.assignee_translated ? ' (Translated)' : ''}:</strong> {data.assignee}
//                     {renderCopyIcon(data.assignee, 'assignee')}
//                 </p>
//                 <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//                 <p><strong>Application Date:</strong> {data.applicationDate}</p>
//                 <p><strong>Priority Date:</strong> {data.priorityDate}</p>

//                 <p className="md:col-span-2">
//                     <strong>Abstract{data.abstract_translated ? ' (Translated)' : ''}:</strong> {data.abstract}
//                     {renderCopyIcon(data.abstract, 'abstract')}
//                 </p>
//             </div>

//             <div className="classification-container">
//                 <div className="classification-label">
//                     <strong>Classification (IPC/CPC):</strong>
//                     <span className="copy-icon" onClick={copyToClipboard} title="Copy all classifications">
//                         <Copy size={16} />
//                         {copied && <span className="copied-text">Copied!</span>}
//                     </span>
//                 </div>

//                 <div className="classification-grid">
//                     {data.classification.map((code, index) => (
//                         <a
//                             key={index}
//                             href={`https://patents.google.com/?q=(${encodeURIComponent(code)})`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="classification-chip"
//                         >
//                             {code}
//                         </a>
//                     ))}
//                 </div>
//             </div>

//             <p><strong>Family:</strong> {Array.isArray(data.family_member) ? data.family_member.join(', ') : data.family}</p>
//         </div>
//     );
// };







// import React from 'react';
// import { Badge } from 'reactstrap';
// import { motion } from 'framer-motion';
// import { Copy } from 'lucide-react';

// const PatentDetails = ({ data, copied, copyToClipboard }) => {
//   return (
//     <div className="bibliographic-container p-6 bg-white rounded-xl shadow-lg space-y-4 animate-fade-in">
//       <h2 className="bibliographic-title text-2xl font-bold text-gray-800 mb-4 animate-fade-in-up">
//         Bibliographic Details
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
//           className="d-flex align-items-center gap-2 mb-2"
//           style={{ fontSize: '1rem', color: '#333' }}
//         >
//           <strong>Patent Number:</strong>
//           <motion.div whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.95 }}>
//             <Badge color="primary" pill style={{ fontSize: '0.95rem', padding: '0.6em 0.9em' }}>
//               {data.publicationNo}
//             </Badge>
//           </motion.div>
//         </motion.div>

//         <p><strong>URL:</strong> <a href={data.URL} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Click to open patent file</a></p>
//         <p><strong>Title{data.title_translated ? ' (Translated)' : ''}:</strong> {data.title}</p>
//         <p><strong>Country Name/Organization:</strong> {data.countryCode}</p>
//         <p><strong>Inventors{data.inventors_translated ? ' (Translated)' : ''}:</strong> {data.inventors}</p>
//         <p><strong>Assignee{data.assignee_translated ? ' (Translated)' : ''}:</strong> {data.assignee}</p>
//         <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//         <p><strong>Application Date:</strong> {data.applicationDate}</p>
//         <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//         <p className="md:col-span-2"><strong>Abstract{data.abstract_translated ? ' (Translated)' : ''}:</strong> {data.abstract}</p>
//       </div>

//       <div className="classification-container">
//         <div className="classification-label">
//           <strong>Classification (IPC/CPC):</strong>
//           <span className="copy-icon" onClick={copyToClipboard} title="Copy all classifications">
//             <Copy size={16} />
//             {copied && <span className="copied-text">Copied!</span>}
//           </span>
//         </div>

//         <div className="classification-grid">
//           {data.classification.map((code, index) => (
//             <a
//               key={index}
//               href={`https://patents.google.com/?q=(${encodeURIComponent(code)})`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="classification-chip"
//             >
//               {code}
//             </a>
//           ))}
//         </div>
//       </div>

//       <p><strong>Family:</strong> {Array.isArray(data.family_member) ? data.family_member.join(', ') : data.family}</p>
//     </div>
//   );
// };

// export default PatentDetails;
