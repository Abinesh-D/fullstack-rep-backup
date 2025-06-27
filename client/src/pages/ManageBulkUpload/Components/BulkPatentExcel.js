import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import {mapFamilyMemberData} from '../ReusableComponent/BulkFunction';

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    background: 'linear-gradient(135deg, #e0f7fa, #e1bee7)',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    padding: '30px 40px',
    maxWidth: '450px',
    width: '100%',
    textAlign: 'center',
    transition: 'transform 0.2s ease-in-out',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  subheading: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '20px',
  },
  uploadBox: {
    border: '2px dashed #9c27b0',
    padding: '25px',
    borderRadius: '12px',
    backgroundColor: '#f3e5f5',
    cursor: 'pointer',
    transition: '0.3s ease',
  },
  fileInput: {
    display: 'none',
  },
  infoBox: {
    marginTop: '25px',
    backgroundColor: '#f9fbe7',
    borderLeft: '6px solid #cddc39',
    padding: '15px',
    textAlign: 'left',
    borderRadius: '6px',
    color: '#333',
    fontSize: '14px',
  },
  icon: {
    fontSize: '30px',
    color: '#7b1fa2',
    marginBottom: '10px',
  },
};

const ExcelPatentUploader = ({ onUpload }) => {

  const fetchESPData = useSelector(state => state.patentSlice.fetchESPData)

  const [fileName, setFileName] = useState(null);
  const [patentNumbers, setPatentNumbers] = useState([]);

  console.log('ExcelPatentUploader', fetchESPData)

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      const extractedNumbers = jsonData
        .map((row) => row['Patent Numbers'])
        .filter((val) => val !== undefined && val !== '')
        .map((val) => String(val).trim());

      setPatentNumbers(extractedNumbers);
      if (onUpload) onUpload(extractedNumbers);
    };

    reader.readAsArrayBuffer(file);
  };


  const extractAbstractText = (abstractData) => {
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


  const inventionTitle = (biblioArray) => {
    const titleData = biblioArray?.['invention-title'];

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
  };


  const normalizeText = text => text?.replace(/\s+/g, '').trim();

  // Family members
  const mappedValue = fetchESPData.map((map) => {

    const biblioArray = map?.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['bibliographic-data'];

    const ipcrRaw = biblioArray?.['classifications-ipcr']?.['classification-ipcr'];

    const ipcrText = Array.isArray(ipcrRaw) ? ipcrRaw.map(item => normalizeText(item?.text)).filter(Boolean).join('; ') : normalizeText(ipcrRaw?.text) || '';

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

      if (epodocInventors.length > 0) {
        return epodocInventors.join('; ');
      }

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

      if (epodocApplicants.length > 0) {
        return epodocApplicants.join('; ');
      }

      const originalApplicants = applicantArray
        .filter(app => app?.$?.['data-format'] === 'original')
        .map(app => app?.['applicant-name']?.name?.trim())
        .filter(Boolean);

      return originalApplicants.join('; ');
    })();

    console.log('applicantNames', applicantNames)


    const familyMembers = map.familyData?.["world-patent-data"]?.["patent-family"]?.["family-member"];
    const biblioDoc = map.biblio?.['world-patent-data']?.['exchange-documents']?.['exchange-document']?.['@id'];

    if (!familyMembers) {
      return {
        patentNumber: biblioDoc || "UNKNOWN",
        familyMembers: []
      };
    }

    const familyMembersArray = Array.isArray(familyMembers) ? familyMembers : [familyMembers];

    const familyData = familyMembersArray.map((familyMember) => {
      const publications = familyMember["publication-reference"]?.["document-id"] || [];

      const publicationInfo = (Array.isArray(publications) ? publications : [publications])
        .filter((doc) => doc?.["$"]?.["document-id-type"] === "docdb")
        .map((doc) => `${doc["country"]}${doc["doc-number"]}${doc["kind"]}`)
        .join('');

      return {
        familyId: familyMember["$"]["family-id"],
        familyPatent: publicationInfo,
       


      };
    });

    return {
      patentNumber: map.patentNumber,
      familyMembers: familyData,
      abstractText: abstractText,
      ipcrText: ipcrText,
      invention: invention,
      inventorNames: inventorNames,
      applicantNames: applicantNames,
      
    };
  });


console.log('mappedValue', mappedValue)


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>📑</div>
        <h2 style={styles.heading}>Bulk Patent Uploader</h2>
        <p style={styles.subheading}>
          Upload an Excel (.xls, .xlsx) file with patent numbers in the first column
        </p>

        <label htmlFor="excel-upload" style={styles.uploadBox}>
          <div>📤 Click or drag Excel file here</div>
          <input
            id="excel-upload"
            type="file"
            accept=".xlsx, .xls"
            style={styles.fileInput}
            onChange={handleFileUpload}
          />
        </label>

        {fileName && (
          <div style={styles.infoBox}>
            <div><strong>📂 File:</strong> {fileName}</div>
            <div><strong>🔢 Total Patents:</strong> {patentNumbers.length}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelPatentUploader;
