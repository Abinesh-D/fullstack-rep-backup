import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { fetchBulkESPData } from '../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice';


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

  const dispatch = useDispatch();

  const bulkESPData = useSelector(state => state.patentSlice.bulkESPData)

  const [famId, setfamId] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [patentNumbers, setPatentNumbers] = useState("");

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

      const commaSeparated = extractedNumbers.join(', ');

      setPatentNumbers(commaSeparated);
      if (onUpload) onUpload(commaSeparated);

      bulkBiblioApiCall(commaSeparated);

    };

    reader.readAsArrayBuffer(file);


  };



  const bulkBiblioApiCall = async (patentNumbers) => {
    try {
      await fetchBulkESPData(patentNumbers, dispatch, "relavent");

    } catch (error) {
      console.log('error', error)
    }
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


  const publicationDateFunction = (biblioData) => {
    const docIds = biblioData?.['publication-reference']?.['document-id'];

    const epodocDate = Array.isArray(docIds)
      ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
      : docIds?.$?.['document-id-type'] === 'epodoc'
        ? docIds.date
        : null;

    const formatDate = (dateStr) =>
      dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : '';

    return formatDate(epodocDate);
  }


  const applicationDateFunction = (biblioData) => {
    const docIds = biblioData?.['application-reference']?.['document-id'];

    const epodocDate = Array.isArray(docIds)
      ? docIds.find(doc => doc?.$?.['document-id-type'] === 'epodoc')?.date
      : docIds?.$?.['document-id-type'] === 'epodoc'
        ? docIds.date
        : null;

    const formatDate = (dateStr) =>
      dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : '';

    return formatDate(epodocDate);
  }


  const getPriorityDates = (biblioData) => {
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




  const classifications = (biblioData) => {
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




  const normalizeText = text => text?.replace(/\s+/g, '').trim();



  useEffect(() => {
    if (!Array.isArray(bulkESPData)) return;

    const result = [];

    for (const map of bulkESPData) {
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

    setfamId(result);
  }, [bulkESPData]);



  // Bulk Biblio
  const mappedValue = bulkESPData.map((map) => {

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

    console.log('familyMembersData', familyMembersData);




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

  console.log('mappedValue', mappedValue)
  const count = patentNumbers?.split(',').map(val => val.trim()).filter(val => val !== '').length || 0;


  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>📑</div>
        <h2 style={styles.heading}>Bulk Patent Uploader</h2>
        <p style={styles.subheading}>
          Upload an Excel (.xls, .xlsx) file with patent numbers in the first column
        </p>

        <label htmlFor="excel-upload" style={styles.uploadBox}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
              handleFileUpload({ target: { files: [file] } });
            }
          }}
        >
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
            <div><strong>🔢 Total Patents:</strong> {count} </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExcelPatentUploader;
