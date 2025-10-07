import React, { useState } from 'react';
import "./PatentLookup.css"
import { Spinner } from 'reactstrap';
import PatentDetails from './ReusableComp/PatentDetails';
import { retrieveEspacePatentData } from './BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';
import TabContainer from './TabContainer';

const PatentSearch = () => {
  const dispatch = useDispatch();
  const fetchedData = useSelector(state => state.patentSlice);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setDataLoading(false);

    try {
      await retrieveEspacePatentData(patentNumber, dispatch, setShowAlert)
        .then(() => {
          setDataLoading(true);
          setAlertType('success');
          setShowAlert(true);
        })
        .catch((error) => {
          console.error("Error retrieving patent data:", error);
          setAlertType('error');
          setShowAlert(true);
        });

      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error('Error fetching patent:', err);
      setError('Failed to fetch patent data. Please check the number and try again.');
      setAlertType('error');
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow rounded mt-10 ">
      <form onSubmit={(e) => { setShowAlert(false); handleSubmit(e) }}>
        <label className="block mb-2 font-semibold">Enter Patent Number:</label>
        <input
          type="text"
          value={patentNumber.trim()}
          onChange={(e) => setPatentNumber(e.target.value)}
          className="border p-2 w-full rounded mb-4"
          placeholder="(e.g., WO2007067176A2)"
          required
        />
        <button
          type="submit"
          className="btn btn-outline-success btn-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading && <Spinner style={{ marginRight: "5px" }} size="sm" color="primary" />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {showAlert && (
        <div
          className={`alert text-center mb-4 ${alertType === 'success' ? 'alert-success' : 'alert-danger'}`}
          role="alert"
        >
          {alertType === 'success'
            ? '✅ Bibliography details Successfully fetched...'
            : '❌ Failed to fetch. Please check the patent number and try again!...'}
        </div>
      )}

      {!dataLoading ? (
        <>
          {/* <TabContainer
            data={[]}
            copied={[]}
            copyToClipboard={[]}
          /> */}
        </>
      ) : (
        <>
          {
            loading &&
            <div className="spinner-container">
              <Spinner style={{ height: '2rem', width: '2rem' }} size="sm" color="primary" />
            </div>
          }
        </>
      )}      
    </div>
  );
};

export default PatentSearch;