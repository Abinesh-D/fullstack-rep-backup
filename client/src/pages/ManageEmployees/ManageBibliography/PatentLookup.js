import React, { useMemo, useState } from 'react';
import axios from 'axios';
import "./PatentLookup.css"
import { Spinner } from 'reactstrap';
import PatentDetails from './ReusableComp/PatentDetails';
import { fetchPatentData } from './BibliographySLice/BibliographySlice';
import { useSelector } from 'react-redux';


const PatentLookup = () => {

  const googleSLiceData = useSelector(state => state.patentSlice.googleApiData);

  const [patentNumber, setPatentNumber] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  const copyToClipboard = () => {
    const text = googleSLiceData.classification.join('; ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');
  //   setData(null);
  //   setLoading(true);

  //   try {
  //     const res = await axios.get(`http://localhost:8080/patent/${patentNumber.trim()}`);
  //   //  const res = await fetchPatentData(patentNumber.trim());
  //     const result = res.data;
  //     console.log('result :>> ', result);
  //     setAlertType('success');
  //     setShowAlert(true);
  //     setTimeout(() => setShowAlert(false), 3000);

  //     setData({
  //       publicationNo: result.publicationNo || 'Data not available',
  //       title: result.title || 'Data not available',
  //       title_translated: result.title_translated || false,
  //       inventors: result.inventors || 'Data not available',
  //       inventors_translated: result.inventors_translated || false,
  //       assignee: result.assignee || 'Data not available',
  //       assignee_translated: result.assignee_translated || false,
  //       abstract: result.abstract || 'Data not available',
  //       abstract_translated: result.abstract_translated || false,
  //       publicationDate: result.publicationDate || 'Data not available',
  //       applicationDate: result.applicationDate || 'Data not available',
  //       priorityDate: result.priorityDate || 'Data not available',
  //       ipc_cpc: result.ipc_cpc || 'Data not available',
  //       IPC: result.IPC || 'Data not available',
  //       family: result.family_member || 'Data not available',
  //       countryCode: result.countryCode || "Country not available",
  //       URL: result.viewerUrl || "Url not found",
  //       classification: result.classificationCode || 'classification not available',
  //     });
  //   } catch (err) {
  //     console.error('Error fetching patent:', err);
  //     setError('Failed to fetch patent data. Please check the number and try again.');
  //     setAlertType('error');
  //     setShowAlert(true);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const memoizedGoogleData = useMemo(() => googleSLiceData, [googleSLiceData])
  return (

    <div>
      <PatentDetails
        data={memoizedGoogleData}
        copied={copied}
        copyToClipboard={copyToClipboard}
        type={"gle"}
      /> 
  </div>



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
    //         : 'Failed to fetch. Please check the patent number and try again!...'}
    //     </div>
    //   )}

    //   {data ? (
    //     <>
    //       <PatentDetails
    //         data={data}
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
  );
};

export default PatentLookup;



























// import React, { useState } from 'react';
// import axios from 'axios';
// import "./PatentLookup.css"
// import { Spinner } from 'reactstrap';
// import PatentDetails from './ReusableComp/PatentDetails';
// import LensData from './LensData';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [copied, setCopied] = useState(false);

//   const [showAlert, setShowAlert] = useState(false);
//   const [alertType, setAlertType] = useState('');

//   const copyToClipboard = () => {
//     const text = data.classification.join('; ');
//     navigator.clipboard.writeText(text).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);
//     setLoading(true);

//     try {
//       const res = await axios.get(`http://localhost:5000/patent/${patentNumber.trim()}`);
//       const result = res.data;
//       console.log('result :>> ', result);
//       setAlertType('success');
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 3000);

//       setData({
//         publicationNo: result.publicationNo || 'Data not available',
//         title: result.title || 'Data not available',
//         title_translated: result.title_translated || false,
//         inventors: result.inventors || 'Data not available',
//         inventors_translated: result.inventors_translated || false,
//         assignee: result.assignee || 'Data not available',
//         assignee_translated: result.assignee_translated || false,
//         abstract: result.abstract || 'Data not available',
//         abstract_translated: result.abstract_translated || false,
//         publicationDate: result.publicationDate || 'Data not available',
//         applicationDate: result.applicationDate || 'Data not available',
//         priorityDate: result.priorityDate || 'Data not available',
//         ipc_cpc: result.ipc_cpc || 'Data not available',
//         IPC: result.IPC || 'Data not available',
//         family: result.family_member || 'Data not available',
//         countryCode: result.countryCode || "Country not available",
//         URL: result.viewerUrl || "Url not found",
//         classification: result.classificationCode || 'classification not available',
//       });
//     } catch (err) {
//       console.error('Error fetching patent:', err);
//       setError('Failed to fetch patent data. Please check the number and try again.');
//       setAlertType('error');
//       setShowAlert(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10 ">
//       <LensData />      
//       <form onSubmit={(e) => { setShowAlert(false); handleSubmit(e) }}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber.trim()}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="(e.g., WO2007067176A2)"
//           required
//         />
//         <button
//           type="submit"
//           className="btn btn-outline-success btn-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           disabled={loading}
//         >
//           {loading && <Spinner style={{ marginRight: "5px" }} size="sm" color="primary" />}
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {showAlert && (
//         <div
//           className={`alert text-center mb-4 ${alertType === 'success' ? 'alert-success' : 'alert-danger'}`}
//           role="alert"
//         >
//           {alertType === 'success'
//             ? '✅ Bibliography details Successfully fetched...'
//             : 'Failed to fetch. Please check the patent number and try again!...'}
//         </div>
//       )}

//       {data ? (
//         <>
//           <PatentDetails
//             data={data}
//             copied={copied}
//             copyToClipboard={copyToClipboard}
//           />
//         </>
//       ) : (
//         <>
//           {
//             loading &&
//             <div className="spinner-container">
//               <Spinner style={{ height: '2rem', width: '2rem' }} size="sm" color="primary" />
//             </div>
//           }
//         </>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;











// import React, { useState } from 'react';
// import axios from 'axios';
// import { Spinner } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { fetchPatentData } from './BibliographySLice/BibliographySlice';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);
//     setLoading(true);
//     const result = await fetchPatentData(patentNumber.trim());

    
//     try {
//       // const result = await fetchPatentData(patentNumber);
//       console.log('PatentLookup', result);
//       setData({
//         publicationNo: result.publicationNo || 'Data not available',
//         title: result.title || 'Data not available',
//         countryInfo: result.countryInfo || 'not available',
//         inventors: result.inventors || 'Data not available',
//         assignee: result.assignee || 'Data not available',
//         publicationDate: result.publicationDate || 'Data not available',
//         applicationDate: result.applicationDate || 'Data not available',
//         priorityDate: result.priorityDate || 'Data not available',
//         ipc_cpc: result.ipc_cpc || 'Data not available',
//         family: result.family || 'Data not available',
//         abstract: result.abstract || 'Data not available',
//         IPC: result.IPC || 'Data not available',
//         CPC: result.CPC || 'Data not available',
//         family: result.family_member || 'Data not available',
//       });
    
//     } catch (err) {
//       setError('Failed to fetch patent data. Please check the number and try again.');
//     } finally {
//       setLoading(false);
//     }
  

//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <>
//         <form onSubmit={handleSubmit}>
//           <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//           <input
//             type="text"
//             value={patentNumber}
//             onChange={(e) => setPatentNumber(e.target.value)}
//             className="border p-2 w-full rounded mb-4"
//             placeholder="(e.g., WO2007067176A2)"
//             required
//           />
//           <button
//             type="submit"
//             className="btn btn-outline-success btn-white px-4 py-2 rounded hover:bg-blue-700 transition"
//           >
//             {loading && <Spinner style={{ marginRight: "5px" }} size="sm" color="success" />}

//             {loading ? 'Fetching...' : 'Submit'}
//           </button>
//         </form>

//         {error && <p className="text-red-600 mt-4">{error}</p>}
//         <div className={loading && 'd-flex justify-content-center'} >
//           {data ? (
//             <div className="mt-6 border-t pt-4">
//               <h2 className="text-xl font-bold mb-2">Bibliographic Details</h2>
//               <p><strong>Patent Number:</strong> {data.publicationNo}</p>
//               <p><strong>Title:</strong> {data.title}</p>
//               <p><strong>Inventors:</strong> {data.inventors}</p>
//               <p><strong>Assignee:</strong> {data.assignee}</p>
//               <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//               <p><strong>Application Date:</strong> {data.applicationDate}</p>
//               <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//               <p><strong>IPC/CPC Classification:</strong> {data.ipc_cpc}</p>
//               <p><strong>Family Members:</strong> {data.family}</p>
//               <p><strong>Abstract:</strong> {data.abstract}</p>
//               <p><strong>IPC:</strong> {data.ipc}</p>
//               <p><strong>CPC:</strong> {data.CPC}</p>
//               <p><strong>Family:</strong> {data.family_member}</p>
//             </div>
//           ) : (
//             <>
//               {loading && <Spinner style={{ height: "2rem", width: "2rem" }} size="sm" color="success" />}
//             </>
//           )}
//         </div>
//       </>
//       {data?.relatedReferences?.length > 0 && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Related References</h2>
//           <div className="table-responsive">
//             <table className="table table-bordered table-striped">
//               <thead className="table-success">
//                 <tr>
//                   <th>Publication Number</th>
//                   <th>Title</th>
//                   <th>Assignee/Inventor</th>
//                   <th>Priority Date</th>
//                   <th>Publication Date</th>
//                   <th>Family Members</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data?.relatedReferences.map((ref, idx) => (
//                   <tr key={idx}>
//                     <td>{ref.publicationNumber}</td>
//                     <td>{ref.title}</td>
//                     <td>{ref.assigneeOrInventor}</td>
//                     <td>{ref.priorityDate}</td>
//                     <td>{ref.publicationDate}</td>
//                     <td>{ref.familyMembers}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//     </div>
//   );
// };

// export default PatentLookup;














    // try {
    //   const res = await axios.get(`http://localhost:5000/patent/${patentNumber.trim()}`);
    //   const result = res.data;
    //   console.log('PatentLookup', result);

    //   setData(result);
    // } catch (err) {
    //   console.error('Error fetching patent:', err);
    //   setError('Failed to fetch patent data. Please check the number and try again.');
    // } finally {
      // setLoading(false);
    // }



{/* <h2 className="text-xl font-bold mb-2">Bibliographic Details</h2>
          <p><strong>Patent Number:</strong> {data.publicationNo}</p>
          <p><strong>Title{data.title_translated ? '(Translated)' : ''}:</strong> {data.title} </p>
          <p><strong>Inventors{data.inventors_translated ? '(Translated)' : ''}:</strong> {data.inventors} </p>
          <p><strong>Assignee{data.assignee_translated ? '(Translated)' : ''}:</strong> {data.assignee} </p>
          <p><strong>Publication Date:</strong> {data.publicationDate}</p>
          <p><strong>Application Date:</strong> {data.applicationDate}</p>
          <p><strong>Priority Date:</strong> {data.priorityDate}</p>
          <p><strong>IPC/CPC Classification:</strong> {data.ipc_cpc}</p>
          <p><strong>Abstract {data.abstract_translated ? '(Translated)' : ''}:</strong> {data.abstract}</p>
          <p><strong>IPC:</strong> {Array.isArray(data.IPC) ? data.IPC.join(', ') : data.IPC}</p>
          <p><strong>Family:</strong> {Array.isArray(data.family_member) ? data.family_member.join(', ') : data.family}</p> */}




// import React, { useState } from 'react';
// import axios from 'axios';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);
//     setLoading(true);

//     try {
//       const res = await axios.get(`http://localhost:5000/patent/${patentNumber.trim()}`);
//       const result = res.data;
//       console.log('result :>> ', result);

//       setData({
//         publicationNo: result.publicationNo || 'Data not available',
//         title: result.title || 'Data not available',
//         countryInfo: result.countryInfo || 'not available',
//         inventors: result.inventors || 'Data not available',
//         assignee: result.assignee || 'Data not available',
//         publicationDate: result.publicationDate || 'Data not available',
//         applicationDate: result.applicationDate || 'Data not available',
//         priorityDate: result.priorityDate || 'Data not available',
//         ipc_cpc: result.ipc_cpc || 'Data not available',
//         family: result.family || 'Data not available',
//         abstract: result.abstract || 'Data not available',
//         IPC: result.IPC || 'Data not available',
//         family: result.family_member || 'Data not available',
//       });

//     } catch (err) {
//       console.error('Error fetching patent:', err);
//       setError('Failed to fetch patent data. Please check the number and try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="(e.g., WO2007067176A2)"
//           required
//         />
//         <button
//           type="submit"
//           className="btn btn-outline-success btn-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           {loading ? 'Searching...' : 'Search'}
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {data && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Bibliographic Details</h2>
//           <p><strong>Patent Number:</strong> {data.publicationNo}</p>
//           <p><strong>Title:</strong> {data.title}</p>
//           {/* <p><strong>Country Name: </strong> {data.countryInfo}</p> */}
//           <p><strong>Inventors:</strong> {data.inventors}</p>
//           <p><strong>Assignee:</strong> {data.assignee}</p>
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Application Date:</strong> {data.applicationDate}</p>
//           <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//           <p><strong>IPC/CPC Classification:</strong> {data.ipc_cpc}</p>
//           <p><strong>Family Members:</strong> {data.family}</p>
//           <p><strong>Abstract:</strong> {data.abstract}</p>
//           <p><strong>IPC:</strong> {data.ipc}</p>
//           <p><strong>Family:</strong> {data.family_member}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;











// import React, { useState } from 'react';
// import axios from 'axios';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);

//     try {
//       const res = await axios.get(`http://localhost:5000/patent/${patentNumber.trim()}`);
//       const result = res.data;

//       console.log('result :>> ', result);

//       setData({
//         publicationNo: result.publicationNo || 'N/A',
//         title: result.title || 'N/A',
//         inventors: result.inventors || 'N/A',
//         assignee: result.assignee || 'N/A',
//         publicationDate: result.publicationDate || 'N/A',
//         applicationDate: result.applicationDate || 'N/A',
//         priorityDate: result.priorityDate || 'N/A',
//         ipc_cpc: result.ipc_cpc || 'N/A',
//         family: result.family || 'N/A',
//         abstract: result.abstract || 'N/A'
//       });

//     } catch (err) {
//       console.error('Error fetching patent:', err);
//       setError('Failed to fetch patent data. Please check the number and try again.');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="e.g. WO2007067176A2"
//           required
//         />
//         <button
//           type="submit"
//           className="btn btn-white btn-outline-success px-4 py-2"
//           // className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Search
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {data && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Bibliographic Details</h2>
//           <p><strong>Patent Number:</strong> {data.publicationNo}</p>
//           <p><strong>Title:</strong> {data.title}</p>
//           <p><strong>Inventors:</strong> {data.inventors}</p>
//           <p><strong>Assignee:</strong> {data.assignee}</p>
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Application Date:</strong> {data.applicationDate}</p>
//           <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//           <p><strong>IPC/CPC Classification:</strong> {data.ipc_cpc}</p>
//           <p><strong>Family Members:</strong> {data.family}</p>
//           <p><strong>Abstract:</strong> {data.abstract}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;















// import React, { useState } from 'react';
// import axios from 'axios';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);
//     console.log('patentNumber :>> ', patentNumber);

//     try {
//       const res = await axios.post('http://localhost:5000/getPatent', {
//         publication_number: patentNumber,
//       });

//       if (res.data.length === 0) {
//         setError('No data found for this publication number.');
//         return;
//       }

//       const result = res.data[0];

//       setData({
//         publicationNo: result.publication_number || 'N/A',
//         title: result.title_localized?.[0]?.text || 'N/A',
//         inventors: result.inventor_harmonized?.map(inv => inv.name).join(', ') || 'N/A',
//         assignee: result.assignee_harmonized?.map(ass => ass.name).join(', ') || 'N/A',
//         publicationDate: result.publication_date || 'N/A',
//         filingDate: result.filing_date || 'N/A',
//         priorityDate: result.priority_date || 'N/A',
//         classification: result.kind_code || 'N/A',
//         ipc: result.ipc?.map(code => code.code).join(', ') || 'N/A',
//         cpc: result.cpc?.map(code => code.code).join(', ') || 'N/A',
//         family: 'Nil', // BigQuery doesn't have family info directly in this dataset
//       });
      
//     } catch (err) {
//       console.error('Error fetching patent:', err);
//       setError('Failed to fetch patent data.');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="e.g. US-9474634-B2"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {data && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Bibliography Details</h2>
//           <p><strong>Patent Number:</strong> {data.publicationNo}</p>
//           <p><strong>Title:</strong> {data.title}</p>
//           <p><strong>Inventors:</strong> {data.inventors}</p>
//           <p><strong>Assignee:</strong> {data.assignee}</p>
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Filing Date:</strong> {data.filingDate}</p>
//           <p><strong>Classification:</strong> {data.classification}</p>
//           <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//           <p><strong>IPC:</strong> {data.ipc}</p>
//           <p><strong>CPC:</strong> {data.cpc}</p>
//           <p><strong>Family Member:</strong> {data.family}</p>

//         </div>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;

















// import React, { useState } from 'react';
// import axios from 'axios';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setData(null);

//     try {
//       const res = await axios.post('http://localhost:5000/api/patent', { patentNumber });
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError(err.response?.data?.error || 'Something went wrong');
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="e.g. 2008288458"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {data && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Bibliography Details</h2>
//           <p><strong>Patent Number:</strong> {data.publicationNo}</p>
//           <p><strong>Title:</strong> {data.title}</p>
//           <p><strong>Inventors:</strong> {data.inventors}</p>
//           <p><strong>Assignee:</strong> {data.assignee}</p>
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Filing Date:</strong> {data.filingDate}</p>
//           <p><strong>Classification:</strong> {data.classification}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;











// import React, { useState } from 'react';
// import axios from 'axios';

// const PatentLookup = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');


  

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     try {
//       console.log('patentNumber :>> ', patentNumber);
//       const res = await axios.post('http://localhost:5000/api/patent', { patentNumber });
//       console.log('API Response:', res.data);
//       setData(res.data);
//     } catch (err) {
//       console.error('Frontend error:', err);
//       setData(null);
//       setError('Patent not found or error fetching data.');
//     }
//   };
  

//   return (
//     <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10">
//       <form onSubmit={handleSubmit}>
//         <label className="block mb-2 font-semibold">Enter Patent Number:</label>
//         <input
//           type="text"
//           value={patentNumber}
//           onChange={(e) => setPatentNumber(e.target.value)}
//           className="border p-2 w-full rounded mb-4"
//           placeholder="e.g. WO2007067176A2"
//           required
//         />
//         <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
//           Search
//         </button>
//       </form>

//       {error && <p className="text-red-600 mt-4">{error}</p>}

//       {data && (
//         <div className="mt-6 border-t pt-4">
//           <h2 className="text-xl font-bold mb-2">Bibliography Details</h2>
//           <p><strong>Patent Number:</strong> {data.patentNumber}</p>
//           <p><strong>Title:</strong> {data.title}</p>
//           <p><strong>Inventors:</strong> {data.inventors}</p>
//           <p><strong>Assignee:</strong> {data.assignee}</p>
//           <p><strong>Publication Date:</strong> {data.publicationDate}</p>
//           <p><strong>Filing Date:</strong> {data.filingDate}</p>
//           <p><strong>Priority Date:</strong> {data.priorityDate}</p>
//           <p><strong>IPC/CPC:</strong> {data.classification}</p>
//           <p><strong>US Classification:</strong> {data.usClassification}</p>
//           <p><strong>Family Members:</strong> {data.familyMembers}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PatentLookup;


// // const value = {
// //   "publicationNo": "WO2007067176A2",
// //   "title": "Session Initiation Protocol (SIP) Multicast Management Method",
// //   "inventors": "Sun Sheng; Bing Wen; Wu Eric",
// //   "assignee": "Nortel Networks Ltd",
// //   "publicationDate": "2007-06-14",
// //   "filingDate": "2005-12-08",
// //   "priorityDate": "2022-12-08",
// //   "classification": "G06F15/173; H04B7/26; H04W80/10; H04L65/612; H04L67/1097; H04L67/563; H04L67/568; H04L65/110",
// //   "usClassification": "",
// //   "familyMembers": "WO2007067176A3, CN101443749A, CN101443749B, EP1958080A2, EP1958080A4, KR20080099237A, KR101215683B1, US2008288458A1"
// // }