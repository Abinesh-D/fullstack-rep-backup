import React, { useState, useMemo } from 'react';
import "./PatentLookup.css"
import { Spinner } from 'reactstrap';
import PatentDetails from './ReusableComp/PatentDetails';
import { retrievePatentData, resetPatentData } from './BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';

const LensData = () => {
  const dispatch = useDispatch();
  const fetchedData = useSelector(state => state.patentSlice.lensOrgApiData);


  const [patentNumber, setPatentNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');

  const copyToClipboard = () => {
    const text = fetchedData.classification.join('; ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   dispatch(resetPatentData());
  //   setError('');
  //   setLoading(true);
  //   setDataLoading(false);

  //   try {
  //     await retrievePatentData(patentNumber, dispatch, setShowAlert)
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


const memoziedLEnsData = useMemo(() => fetchedData, [fetchedData]);


  return (

    <div>

      <div>
        <PatentDetails
          data={memoziedLEnsData}
          copied={copied}
          copyToClipboard={copyToClipboard}
          type={"lens"}
        />
      </div>
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
  );
};

export default LensData;











// import React, { useState } from 'react';
// import axios from 'axios';

// const LensData = () => {
//   const [patentNumber, setPatentNumber] = useState('');
//   const [patentData, setPatentData] = useState(null);
//   console.log('patentData :>> ', patentData);
//   const [error, setError] = useState('');

//   // Handle input change
//   const handleInputChange = (e) => {
//     setPatentNumber(e.target.value);
//   };

//   // Fetch patent data from the backend API
//   const fetchPatentData = async () => {
//     if (!patentNumber) {
//       setError('Patent number is required');
//       return;
//     }
//     setError('');
//     setPatentData(null);

//     try {
//       // Call the backend API to fetch patent data
//       const response = await axios.post('http://localhost:8080/api/lens/get-patent-data', {
//         patentNumber: patentNumber
//       });

//       if (response.data) {
//         setPatentData(response.data);
//       }
//     } catch (err) {
//       setError('Error fetching patent data');
//     }
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Patent Information</h1>
//         <div>
//           <label htmlFor="patentNumber">Enter Patent Number:</label>
//           <input
//             type="text"
//             id="patentNumber"
//             value={patentNumber}
//             onChange={handleInputChange}
//             placeholder="e.g. EP3126271B1"
//           />
//           <button onClick={fetchPatentData}>Get Patent Data</button>
//         </div>

//         {error && <p className="error">{error}</p>}

//         {patentData && (
//           <div className="result">
//             <h3>Patent Details:</h3>
//             <pre>{JSON.stringify(patentData, null, 2)}</pre>
//           </div>
//         )}
//       </header>
//     </div>
//   );
// }

// export default LensData;





