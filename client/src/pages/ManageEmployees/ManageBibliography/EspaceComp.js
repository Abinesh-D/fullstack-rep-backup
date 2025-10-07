import React, { useState, useMemo } from 'react';
import "./PatentLookup.css"
import { Spinner } from 'reactstrap';
import PatentDetails from './ReusableComp/PatentDetails';
import { retrieveEspacePatentData } from './BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';

const EspaceComp = (data) => {
  const dispatch = useDispatch();
  const fetchedData = useSelector(state => state.patentSlice);

  function extractPatentData(espaceApiData) {


    // const docIds = espaceApiData["publication-reference"]?.["document-id"] || [];
    // const epodoc = docIds.find(doc => doc["document-id-type"] === "epodoc");
    // const docdb = docIds.find(doc => doc["document-id-type"] === "docdb");
  
    // const patentNumber = epodoc?.["doc-number"] || "N/A";
    // const country = docdb?.country || "N/A";
    // const patentUrl = patentNumber !== "N/A" ? `https://worldwide.espacenet.com/patent/search/family/EP${patentNumber}` : "N/A";
    // const titleObj = (espaceApiData["invention-title"] || []).find(t => t.lang === "en");
    // const title = titleObj?._ || "N/A";
  
    // const inventors = (espaceApiData.parties?.inventors?.inventor || [])
    //   .map(inv => inv["inventor-name"]?.name)
    //   .filter(Boolean)
    //   .join("; ") || "N/A";
  
    // const assignees = (espaceApiData.parties?.applicants?.applicant || [])
    //   .map(app => app["applicant-name"]?.name)
    //   .filter(Boolean)
    //   .join("; ") || "N/A";
  
    // const ipc = (espaceApiData["classifications-ipcr"]?.["classification-ipcr"] || [])
    //   .map(ipc => ipc.text?.trim())
    //   .filter(Boolean)
    //   .join("; ") || "N/A";
  
    // const cpc = (espaceApiData["patent-classifications"]?.["patent-classification"] || [])
    //   .map(c => `${c.section}${c.class}/${c.subclass} ${c["main-group"]}/${c.subgroup}`)
    //   .filter(Boolean)
    //   .join("; ") || "N/A";
  
    return { 
      // patentNumber, country, patentUrl, title, inventors, assignees, ipc, cpc, patentUrl
     };
  }

  const converteddata = extractPatentData(data.data);

  const [patentNumber, setPatentNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  const copyToClipboard = () => {
    const text = fetchedData.espaceApiData.classification.join('; ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  

  const memoizedEspData = useMemo(() => fetchedData.espaceApiData, [fetchedData.espaceApiData]);
  const legalStatusData = useMemo(() => fetchedData.fetchLegalStatus.legalStatusData, [fetchedData.fetchLegalStatus]);


  return (
    <div>
      <PatentDetails
        data={memoizedEspData}
        legalData={legalStatusData}
        copied={copied}
        copyToClipboard={copyToClipboard}
        type={"esp"}
      />
    </div>
  );
};

export default EspaceComp;















  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setLoading(true);
  //   setDataLoading(false);

  //   try {
  //     await retrieveEspacePatentData(patentNumber, dispatch, setShowAlert)
  //       .then(() => {
  //         setDataLoading(true);
  //         setAlertType('success');
  //         setShowAlert(true);
  //       })
  //       .catch((error) => {
  //         console.error("Error retrieving patent data:", error);
  //         setAlertType('error');
  //         setShowAlert(true);
  //       });

  //     setTimeout(() => setShowAlert(false), 3000);
  //   } catch (err) {
  //     console.error('Error fetching patent:', err);
  //     setError('Failed to fetch patent data. Please check the number and try again.');
  //     setAlertType('error');
  //     setTimeout(() => setShowAlert(false), 3000);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




    
    // <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10 ">
    //   <form onSubmit={(e) => { setShowAlert(false); handleSubmit(e) }}>
    //     <label className="block mb-2 font-semibold">Enter Patent Number:</label>
    //     <input
    //       type="text"
    //       value={patentNumber.trim()}
    //       onChange={(e) => setPatentNumber(e.target.value)}
    //       className="border p-2 w-full rounded mb-4"
    //       placeholder="(e.g., WO2007067176A2)"
    //       required
    //     />
    //     <button
    //       type="submit"
    //       className="btn btn-outline-success btn-white px-4 py-2 rounded hover:bg-blue-700 transition"
    //       disabled={loading}
    //     >
    //       {loading && <Spinner style={{ marginRight: "5px" }} size="sm" color="primary" />}
    //       {loading ? 'Searching...' : 'Search'}
    //     </button>
    //   </form>

    //   {showAlert && (
    //     <div
    //       className={`alert text-center mb-4 ${alertType === 'success' ? 'alert-success' : 'alert-danger'}`}
    //       role="alert"
    //     >
    //       {alertType === 'success'
    //         ? '✅ Bibliography details Successfully fetched...'
    //         : '❌ Failed to fetch. Please check the patent number and try again!...'}
    //     </div>
    //   )}

    //   {dataLoading ? (
    //     <>
    //       <PatentDetails
    //         data={fetchedData}
    //         copied={copied}
    //         copyToClipboard={copyToClipboard}
    //       />
    //     </>
    //   ) : (
    //     <>
    //       {
    //         loading &&
    //         <div className="spinner-container">
    //           <Spinner style={{ height: '2rem', width: '2rem' }} size="sm" color="primary" />
    //         </div>
    //       }
    //     </>
    //   )}      
    // </div>