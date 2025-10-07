import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import sampleExcelImage from "../../../assets/images/bulk_patent_sample_image.png";
import { Modal, ModalBody, ModalHeader, Button } from "reactstrap";
import { fetchBulkESPData, saveExcelRelatedReferences } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';
import { FaFileExcel } from 'react-icons/fa';
import { downloadSampleExcel } from './sampleBulkPatentDownload';
import { computeFamId, mapRelatedData, mappedValue, } from "./BulkResponseMap";
import debounce from 'lodash/debounce';


const ExcelPatentUploader = ({ setRelatedFormData }) => {

  const dispatch = useDispatch();

  const espData = useSelector(state => state.patentSlice.espData);


  const id = sessionStorage.getItem("_id");
  const fileInputRef = useRef(null);

  const [famId, setfamId] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [patentNumbers, setPatentNumbers] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitDisable, setSubmitDisable] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);

  useEffect(() => {
    if (!Array.isArray(espData)) return;

    const famIdResult = computeFamId(espData,);
    setfamId(famIdResult);
  }, [espData]);



  const bulkBiblioApiCall = async (patentNumbers) => {
    try {
      setLoading(true);
      await fetchBulkESPData(patentNumbers, dispatch, "excelrelated");
    } catch (error) {
      console.error("❌ Error fetching data:", error);
    } finally {
      setLoading(false);
      setSubmitDisable(true);
    }
  };


  useEffect(() => {
    return () => {
      debouncedParseFile.cancel();
    };
  }, []);



  const debouncedParseFile = useCallback(
    debounce((file) => {
      setFileName(file.name);
      setLoading(true);

      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const extractedNumbers = jsonData
          .map(row => row["Patent Number"])
          .filter(val => val)
          .map(val => String(val).trim());

        const commaSeparated = extractedNumbers.join(", ");
        setPatentNumbers(commaSeparated.split(',').map(val => val.trim()).filter(val => val !== '').length || 0);
        bulkBiblioApiCall(commaSeparated);
      };

      reader.readAsArrayBuffer(file);

    }, 300),
    []
  );



  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    debouncedParseFile(file);

    // setFileName(file.name);
    // setLoading(true);

    // const reader = new FileReader();
    // reader.onload = (e) => {
    //   const data = new Uint8Array(e.target.result);
    //   const workbook = XLSX.read(data, { type: "array" });

    //   const sheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[sheetName];
    //   const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    //   const extractedNumbers = jsonData
    //     .map(row => row["Patent Number"])
    //     .filter(val => val)
    //     .map(val => String(val).trim());

    //   const commaSeparated = extractedNumbers.join(", ");
    //   setPatentNumbers(commaSeparated.split(',').map(val => val.trim()).filter(val => val !== '').length || 0);
    //   bulkBiblioApiCall(commaSeparated);
    // };

    // reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleFileUpload({ target: { files: [file] } });
    }
  };


  const handleSubmit = async () => {
    setSubmitLoading(true);
    try {
      const relatedData = await mapRelatedData(bulkmappedValue);
      const response = await saveExcelRelatedReferences(id, relatedData);
      setRelatedFormData(response);
    } catch (error) {
      console.log(error, "error")
    } finally {
      setSubmitLoading(false);
      setPatentNumbers(0);
      setSubmitDisable(false);
      setFileName(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };



  // const extractAbstractText = (abstractData) => {
  //   if (!abstractData) return '';

  //   if (Array.isArray(abstractData)) {
  //     return abstractData
  //       .map(item => item?.p)
  //       .filter(Boolean)
  //       .join(' ');
  //   }
  //   if (typeof abstractData === 'object' && abstractData?.p) {
  //     return abstractData.p;
  //   }
  //   return '';
  // };


  // const inventionTitle = (biblioArray) => {
  //   const titleData = biblioArray?.['invention-title'];

  //   if (Array.isArray(titleData)) {
  //     const enTitle = titleData.find(t => t?.$?.lang === 'en');
  //     if (enTitle) {
  //       return enTitle._ || '';
  //     }
  //     return titleData[0]._ || '';
  //   }
  //   else if (titleData?.$?.lang === 'en') {
  //     return titleData._ || '';
  //   }
  //   return titleData?._ || '';
  // };

  // const publicationDateFunction = (biblioData) => {
  //   const docIds = biblioData?.['publication-reference']?.['document-id'];

  //   const epodocDate = Array.isArray(docIds)
  //     ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
  //     : docIds?.$?.['document-id-type'] === 'epodoc'
  //       ? docIds.date
  //       : null;

  //   const formatDate = (dateStr) =>
  //     dateStr && /^\d{8}$/.test(dateStr)
  //       ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
  //       : '';

  //   return formatDate(epodocDate);
  // }

  // const applicationDateFunction = (biblioData) => {
  //   const docIds = biblioData?.['application-reference']?.['document-id'];

  //   const epodocDate = Array.isArray(docIds)
  //     ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
  //     : docIds?.$?.['document-id-type'] === 'epodoc'
  //       ? docIds.date
  //       : null;

  //   const formatDate = (dateStr) =>
  //     dateStr && /^\d{8}$/.test(dateStr)
  //       ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
  //       : '';

  //   return formatDate(epodocDate);
  // }

  // const getPriorityDates = (biblioData) => {
  //   let claims = biblioData?.['priority-claims']?.['priority-claim'];
  //   if (!claims) return '';

  //   if (!Array.isArray(claims)) claims = [claims];

  //   for (const claim of claims) {
  //     let doc = claim?.['document-id'];
  //     if (!doc) continue;

  //     if (!Array.isArray(doc)) doc = [doc];

  //     const epodoc = doc.find(d => d?.$?.['document-id-type'] === 'epodoc');
  //     const rawDate = epodoc?.date?.trim();

  //     if (rawDate && /^\d{8}$/.test(rawDate)) {
  //       return `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
  //     }
  //   }
  //   return '';
  // };

  // const classifications = (biblioData) => {
  //   const patentClassifications = biblioData?.['patent-classifications']?.['patent-classification'];

  //   if (!Array.isArray(patentClassifications)) {
  //     return { cpc: '', US_Classification: '' };
  //   }

  //   const cpcSet = new Set();
  //   const usSet = new Set();

  //   patentClassifications.forEach((item) => {
  //     const { 'classification-scheme': scheme, section, class: classValue, subclass, 'main-group': mainGroup, subgroup } = item;

  //     if (scheme?.$?.scheme === 'CPCI' && section && classValue && subclass && mainGroup && subgroup) {
  //       const cpcCode = `${section}${classValue}${subclass}${mainGroup}/${subgroup}`;
  //       cpcSet.add(cpcCode);
  //     }

  //     if (scheme?.$?.scheme === 'UC') {
  //       const classificationSymbol = item['classification-symbol'];
  //       if (classificationSymbol) {
  //         usSet.add(classificationSymbol);
  //       }
  //     }
  //   });

  //   return {
  //     cpc: cpcSet.size ? Array.from(cpcSet).join(', ') : '',
  //     US_Classification: usSet.size ? Array.from(usSet).join(', ') : ''
  //   };
  // };

  // const normalizeText = text => text?.replace(/\s+/g, '').trim();



  // useEffect(() => {
  //   if (!Array.isArray(espData)) return;

  //   const result = [];

  //   for (const map of espData) {
  //     if (!map?.patentNumber) continue;

  //     const familyMember = map.family?.["world-patent-data"]?.["patent-family"]?.["family-member"];
  //     const familyID = Array.isArray(familyMember)
  //       ? familyMember[0]?.["$"]?.["family-id"]
  //       : familyMember?.["$"]?.["family-id"];

  //     if (familyID) {
  //       result.push({
  //         [map.patentNumber]: `https://worldwide.espacenet.com/patent/search/family/0${familyID}/publication/${map.patentNumber}?q=${map.patentNumber}`
  //       });
  //     }
  //   }

  //   setfamId(result);
  // }, [espData]);




  // // Bulk Biblio
  //  const bulkmappedValue = mappedValue(espData, famId);

  const bulkmappedValue = useMemo(() => mappedValue(espData, famId), [espData, famId]);




  // const mappedValue = espData.map((map) => {

  //   const biblioArray = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

  //   const ipcrRaw = biblioArray?.['classifications-ipcr']?.['classification-ipcr'];

  //   const ipcrText = Array.isArray(ipcrRaw) ? ipcrRaw.map(item => normalizeText(item?.text)).filter(Boolean).join('; ') : normalizeText(ipcrRaw?.text) || '';

  //   const abstractData = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.abstract;

  //   const abstractText = extractAbstractText(abstractData);

  //   const invention = inventionTitle(biblioArray);

  //   const inventorsData = biblioArray?.parties?.inventors?.inventor;

  //   const inventorNames = (() => {
  //     if (!Array.isArray(inventorsData)) return '';

  //     const epodocInventors = inventorsData
  //       .filter(item => item?.$?.['data-format'] === 'epodoc')
  //       .map(item => item?.['inventor-name']?.name?.trim())
  //       .filter(Boolean);

  //     if (epodocInventors.length > 0) {
  //       return epodocInventors.join('; ');
  //     }

  //     const originalInventors = inventorsData
  //       .filter(item => item?.$?.['data-format'] === 'original')
  //       .map(item => item?.['inventor-name']?.name?.trim())
  //       .filter(Boolean);

  //     return originalInventors.join('; ');
  //   })();

  //   const applicantsData = biblioArray?.parties?.applicants?.applicant;

  //   const applicantNames = (() => {
  //     if (!applicantsData) return '';

  //     const applicantArray = Array.isArray(applicantsData) ? applicantsData : [applicantsData];

  //     const epodocApplicants = applicantArray
  //       .filter(app => app?.$?.['data-format'] === 'epodoc')
  //       .map(app => app?.['applicant-name']?.name?.trim())
  //       .filter(Boolean);

  //     if (epodocApplicants.length > 0) {
  //       return epodocApplicants.join('; ');
  //     }

  //     const originalApplicants = applicantArray
  //       .filter(app => app?.$?.['data-format'] === 'original')
  //       .map(app => app?.['applicant-name']?.name?.trim())
  //       .filter(Boolean);

  //     return originalApplicants.join('; ');
  //   })();


  //   const publicationDate = publicationDateFunction(biblioArray);

  //   const applicationDate = applicationDateFunction(biblioArray);

  //   const priorityDates = getPriorityDates(biblioArray);

  //   const cpcClass = classifications(biblioArray);

  //   const familyMembers = map.family?.["world-patent-data"]?.["patent-family"]?.["family-member"];

  //   const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];

  //   const familyMembersData = familyMembersArray.map((familyMember) => {
  //     const publications = familyMember?.["publication-reference"]?.["document-id"] || [];

  //     const publicationInfo = (Array.isArray(publications) ? publications : [publications])
  //       .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
  //       .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
  //       .join('');

  //     return {
  //       familyId: familyMember?.["$"]?.["family-id"],
  //       familyPatent: publicationInfo,
  //     };
  //   });

  //   return {
  //     patentNumber: map.patentNumber,
  //     publicationUrl: (() => {
  //       const item = famId.find(obj => obj[map.patentNumber]);
  //       return item ? item[map.patentNumber] : '';
  //     })(),

  //     familyMembersData: familyMembersData,
  //     abstractText: abstractText,
  //     ipcrText: ipcrText,
  //     cpcClass: cpcClass,
  //     invention: invention,
  //     inventorNames: inventorNames,
  //     applicantNames: applicantNames,
  //     publicationDate: publicationDate,
  //     applicationDate: applicationDate,
  //     priorityDates: priorityDates,

  //   };
  // });





  return (
    <div
      className={`p-4 rounded-lg border shadow-sm transition-all duration-300 
      ${fileName ? "bg-gradient-to-r from-blue-50 to-green-50" : "bg-light"}
      ${isDragOver ? "border-primary animate-pulse" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <label
        htmlFor="excel-upload"
        className={`d-block p-5 text-center border rounded-lg ${isDragOver ? "border-primary bg-primary bg-opacity-10" : "border-secondary"}`}
        style={{ cursor: "pointer", transition: "all 0.4s ease" }}
      >
        <input
          ref={fileInputRef}
          id="excel-upload"
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          hidden
        />
        <div className="fs-4 mb-2">
          <FaFileExcel
            style={{
              color: "#1D6F42",
              fontSize: "2.5rem",
              transform: isDragOver ? "scale(1.2) rotate(5deg)" : "scale(1)",
              transition: "transform 0.3s ease"
            }}
          />
        </div>
        <div className="fw-bold text-dark">
          {isDragOver ? "🚀 Drop your Excel file here" : "📂 Drag & Drop Excel here or Browse"}
        </div>
        <div className="text-muted">Supports .xlsx, .xls</div>
        {loading && (
          <div className="mt-3 text-primary">
            <div className="spinner-border spinner-border-sm me-2" role="status"></div>
            Loading Excel data...
          </div>
        )}
      </label>

      <div className="d-flex justify-content-between mt-3">
        <Button
          color="dark"
          outline
          onClick={() => setShowSampleModal(true)}
        >
          📄 View Sample Excel
        </Button>
        <Button
          color="dark"
          outline
          onClick={downloadSampleExcel}
        >
          ⬇️ Download Sample Excel
        </Button>
      </div>

      {fileName && !loading && (
        <div className="mt-3">
          <div><strong>📁 File Name:</strong> {fileName}</div>
          <div><strong>🔢 Selected Count:</strong> {patentNumbers}</div>
        </div>
      )}

      {fileName && !loading && (
        <Button
          color="primary"
          className="mt-3 w-100 d-flex justify-content-center align-items-center"
          onClick={handleSubmit}
        >
          {submitLoading && (
            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          )}
          {submitLoading ? "Submitting..." : "Submit"}
        </Button>
      )}

      <Modal isOpen={showSampleModal} toggle={() => setShowSampleModal(false)} size="lg" centered>
        <ModalHeader toggle={() => setShowSampleModal(false)}>
          📄 Sample Excel Format
        </ModalHeader>

        <ModalBody className="text-center">
          {showSampleModal && (
            <img
              src={sampleExcelImage}
              alt="Sample Excel Format"
              className="img-fluid rounded shadow"
            />
          )}
        </ModalBody>

        {/* <ModalBody className="text-center">
          <img
            src={sampleExcelImage}
            alt="Sample Excel Format"
            className="img-fluid rounded shadow"
          />
        </ModalBody> */}
      </Modal>
    </div>



    // <div
    //   className={`p-3 rounded-lg border shadow-sm transition-all duration-300 ${fileName ? "bg-gradient-to-r from-blue-50 to-green-50" : "bg-light"
    //     }`}
    //   onDragOver={(e) => {
    //     e.preventDefault();
    //     setIsDragOver(true);
    //   }}
    //   onDragLeave={() => setIsDragOver(false)}
    //   onDrop={handleDrop}
    // >

    //   <label htmlFor="excel-upload"
    //     className={`d-block p-5 text-center border rounded-lg ${isDragOver ? "border-primary bg-primary bg-opacity-10" : "border-secondary"}`}
    //     style={{ cursor: "pointer" }}>
    //     <input
    //       ref={fileInputRef}
    //       id="excel-upload"
    //       type="file"
    //       accept=".xlsx, .xls"
    //       onChange={handleFileUpload}
    //       hidden
    //     />

    //     <div className="fs-4 mb-2">
    //       <FaFileExcel style={{ color: "#1D6F42" }} /> Drag & Drop Excel here or{" "}
    //       <span className="text-primary">Browse</span>
    //     </div>
    //     <div className="text-muted">Supports .xlsx, .xls</div>
    //     {loading && (
    //       <div className="mt-3 text-primary">
    //         <div
    //           className="spinner-border spinner-border-sm me-2"
    //           role="status"
    //         ></div>
    //         Loading Excel data...
    //       </div>
    //     )}
    //   </label>

    //   <div className="d-flex justify-content-between mt-3">
    //     <button
    //       type="button"
    //       className="btn btn-outline-info"
    //       onClick={() => setShowSampleModal(true)}
    //     >
    //       📄 View Sample Excel
    //     </button>

    //     <button
    //       type="button"
    //       className="btn btn-outline-success"
    //       onClick={downloadSampleExcel}
    //     >
    //       ⬇️ Download Sample Excel
    //     </button>

    //   </div>

    //   {fileName && !loading && (
    //     <div className="mt-3">
    //       <div>
    //         <strong>📂 File Name:</strong> {fileName}
    //       </div>
    //       <div>
    //         <strong>🔢 Selected Count:</strong> {patentNumbers}
    //       </div>
    //     </div>
    //   )}

    //   {fileName && !loading && (
    //     <button
    //       className="btn btn-primary mt-3 w-100 d-flex justify-content-center align-items-center"
    //       onClick={handleSubmit}
    //       disabled={submitLoading && submitDisable}
    //     >
    //       {submitLoading && (
    //         <span
    //           className="spinner-border spinner-border-sm me-2"
    //           role="status"
    //           aria-hidden="true"
    //         ></span>
    //       )}
    //       {submitLoading ? "Submitting..." : "Submit"}
    //     </button>
    //   )}
    //   <Modal isOpen={showSampleModal} toggle={() => setShowSampleModal(false)} size="lg" centered>
    //     <ModalHeader toggle={() => setShowSampleModal(false)}>
    //       📄 Sample Excel Format
    //     </ModalHeader>
    //     <ModalBody className="text-center">
    //       <img
    //         src={sampleExcelImage}
    //         alt="Sample Excel Format"
    //         className="img-fluid rounded shadow"
    //       />
    //     </ModalBody>
    //   </Modal>
    // </div>





    // <div
    //   className={`p-4 rounded-lg border shadow-sm transition-all duration-300 ${fileName ? "bg-gradient-to-r from-blue-50 to-green-50" : "bg-light"}`}
    //   onDragOver={(e) => {
    //     e.preventDefault();
    //     setIsDragOver(true);
    //   }}
    //   onDragLeave={() => setIsDragOver(false)}
    //   onDrop={handleDrop}
    // >
    //   <label
    //     htmlFor="excel-upload"
    //     className={`d-block p-5 text-center border rounded-lg ${isDragOver ? "border-primary bg-primary bg-opacity-10" : "border-secondary"
    //       }`}
    //     style={{ cursor: "pointer" }}
    //   >
    //     <input ref={fileInputRef} id="excel-upload" type="file" accept=".xlsx, .xls" onChange={handleFileUpload} hidden />

    //     <div className="fs-4 mb-2">
    //       <FaFileExcel style={{ color: "#1D6F42" }} /> Drag & Drop Excel here or <span className="text-primary">Browse</span>
    //     </div>
    //     <div className="text-muted">Supports .xlsx, .xls</div>
    //     {loading && (
    //       <div className="mt-3 text-primary">
    //         <div className="spinner-border spinner-border-sm me-2" role="status"></div>
    //         Loading Excel data...
    //       </div>
    //     )}
    //   </label>

    //   {fileName && !loading && (
    //     <div className="mt-3">
    //       <div><strong>📂 File Name:</strong> {fileName}</div>
    //       <div><strong>🔢 Selected Count:</strong> {patentNumbers}</div>
    //     </div>
    //   )}

    //   {fileName && !loading && (
    //     <button
    //       className="btn btn-primary mt-3 w-100 d-flex justify-content-center align-items-center"
    //       onClick={handleSubmit}
    //       disabled={submitLoading && submitDisable}
    //     >
    //       {submitLoading && (
    //         <span
    //           className="spinner-border spinner-border-sm me-2"
    //           role="status"
    //           aria-hidden="true"
    //         ></span>
    //       )}
    //       {submitLoading ? "Submitting..." : "Submit"}
    //     </button>
    //   )}
    // </div>
  );
};

export default ExcelPatentUploader;
