import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
    FaFileExcel,
    FaSpinner,
    FaDownload,
    FaTimesCircle,

} from 'react-icons/fa';
import { motion } from 'framer-motion';

import ImagePreviewModal from '../ReusableComp/ImagePreviewModal';
import sampleExcelImg from '../../../../assets/images/Patents/excel-img-format-ipc.png';
import { Progress } from 'reactstrap';


const IPCExcelUploader = ({
    definition,
    handleFileUpload,
    uploadedRows,
    handleDownloadExcel,
    loading,
    uploadProgress,
    uploadedFileName,
    handleClearFile,
    fileInputRef,
}) => {

    const [showSampleModal, setShowSampleModal] = useState(false);

    const handleDownloadSampleExcel = () => {
        const wsData = [
            ['', 'Class'],
            ['', 'H04W'],
            ['', 'H04'],
            ['', 'H'],
            ['', 'A61B'],
            ['', 'A61'],
            ['', 'A'],
            ['', 'G06F'],
            ['', 'G06'],
            ['', 'G'],
            ['', 'etc... limit 2000']
        ];


        const worksheet = XLSX.utils.aoa_to_sheet(wsData);

        worksheet['B1'].s = {
            fill: {
                fgColor: { rgb: "FFFF00" }
            }
        };

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample');

        XLSX.writeFile(workbook, 'IPC-Sample-Format.xlsx');
    };

    return (
        <div
            style={{
                padding: '2rem',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
                maxWidth: '600px',
                margin: 'auto',
                fontFamily: 'Segoe UI, sans-serif',
            }}
        >

            <div className="text-center mb-4">
                <motion.h3
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-dark"
                >
                    📄 Classification Excel Uploader
                </motion.h3>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="text-muted fs-6"
                >
                    Please upload your IPC Excel file in the correct format.
                </motion.p>

                <motion.div
                    className="container mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <div className="row justify-content-center">
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                onClick={handleDownloadSampleExcel}
                            >
                                <i className="fas fa-cloud-download-alt fs-6 me-1"></i>
                                <span>Sample File Format</span>
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-outline-secondary btn-sm d-flex align-items-center "
                                onClick={() => setShowSampleModal(true)}
                            >
                                <i className="fas fa-eye fs-6 me-1"></i>
                                <span>View Sample File</span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {
                    sampleExcelImg &&
                    <ImagePreviewModal
                        visible={showSampleModal}
                        image={sampleExcelImg}
                        altText="Sample Excel Template"
                        onClose={() => setShowSampleModal(false)}
                    />
                }

            </div>

            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1rem',
                }}
            >
                <label
                    htmlFor="file-upload"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.7rem 1.2rem',
                        backgroundColor: '#198754',
                        color: '#fff',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1rem',
                        transition: 'background 0.3s ease',
                    }}
                >
                    <FaFileExcel style={{ marginRight: '0.5rem' }} />
                    Select Excel File
                </label>

                <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
            </div>

            {uploadedFileName && (
                <div
                    style={{
                        backgroundColor: '#f1f3f5',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.95rem',
                        marginBottom: '1rem',
                        color: '#495057',
                    }}
                >
                    <span>{uploadedFileName}</span>
                    <FaTimesCircle
                        onClick={handleClearFile}
                        style={{
                            color: '#dc3545',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                        }}
                        title="Remove File"
                    />
                </div>
            )}
            {uploadProgress > 0 &&
                <Progress value={uploadProgress} max={100} className='mb-3' color="primary" style={{ width: '100%' }} animated></Progress>
            }

            <button
                onClick={handleDownloadExcel}
                disabled={definition.length === 0}
                style={{
                    width: '100%',
                    padding: '0.75rem 1.2rem',
                    backgroundColor: definition.length === 0 ? '#adb5bd' : '#0d6efd',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: definition.length === 0 ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.3s ease',
                }}
            >
                <FaDownload />
                Download Processed Excel
            </button>
        </div>
    );
};

export default IPCExcelUploader;


















// import React from 'react';
// import { FaFileExcel, FaSpinner, FaDownload, FaTimesCircle } from 'react-icons/fa';

// const IPCExcelUploader = ({
//     definition,
//     handleFileUpload,
//     uploadedRows,
//     handleDownloadExcel,
//     loading,
//     uploadProgress,
//     uploadedFileName,
//     handleClearFile,
//     fileInputRef,
// }) => {



// console.log('definition :>> ', definition);



//     return (
//         <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: 'auto' }}>
//             <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>
//                 Upload IPC Excel
//             </h3>

//             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
//                 <label htmlFor="file-upload"
//                     style={{
//                         display: 'inline-flex',
//                         alignItems: 'center',
//                         padding: '0.6rem 1rem',
//                         backgroundColor: '#28a745',
//                         color: 'white',
//                         borderRadius: '6px',
//                         cursor: 'pointer',
//                         fontWeight: 'bold',
//                         fontSize: '1rem',
//                     }}
//                 >
//                     <FaFileExcel style={{ marginRight: '0.5rem' }} />
//                     Choose Excel File
//                 </label>

//                 <input
//                     id="file-upload"
//                     type="file"
//                     accept=".xlsx, .xls"
//                     onChange={handleFileUpload}
//                     style={{ display: 'none' }}
//                     ref={fileInputRef}
//                 />
//             </div>

//             {uploadedFileName && (
//                 <div style={{
//                     marginTop: '1rem',
//                     backgroundColor: '#e9ecef',
//                     padding: '0.5rem 1rem',
//                     borderRadius: '6px',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     fontSize: '0.95rem',
//                 }}>
//                     <span>{uploadedFileName}</span>
//                     <FaTimesCircle
//                         onClick={handleClearFile}
//                         style={{ color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}
//                         title="Remove File"
//                     />
//                 </div>
//             )}

//             {loading && (
//                 <div style={{ marginTop: '1rem', color: '#007bff', display: 'flex', alignItems: 'center' }}>
//                     <FaSpinner className="spin" style={{ marginRight: '0.5rem' }} />
//                     Processing Excel...
//                 </div>
//             )}

//             {uploadProgress > 0 && (
//                 <div style={{ marginTop: '1rem', height: '10px', background: '#ddd', borderRadius: '4px' }}>
//                     <div
//                         style={{
//                             width: `${uploadProgress}%`,
//                             background: '#007bff',
//                             height: '100%',
//                             borderRadius: '4px',
//                             transition: 'width 0.4s ease',
//                         }}
//                     />
//                 </div>
//             )}

//             <button
//                 onClick={handleDownloadExcel}
//                 disabled={definition.length === 0}
//                 style={{
//                     marginTop: '1.5rem',
//                     padding: '0.6rem 1.2rem',
//                     backgroundColor: definition.length === 0 ? '#cccccc' : '#007bff',
//                     color: '#fff',
//                     border: 'none',
//                     borderRadius: '6px',
//                     fontWeight: 'bold',
//                     fontSize: '1rem',
//                     cursor: definition.length === 0 ? 'not-allowed' : 'pointer',
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                 }}
//             >
//                 <FaDownload style={{ marginRight: '0.5rem' }} />
//                 Download Excel
//             </button>
//         </div>
//     );
// };

// export default IPCExcelUploader;

















// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
// import { FaFileExcel, FaDownload, FaSpinner } from 'react-icons/fa';



// const IPCExcelUploader = ({ definition, handleFileUpload, uploadedRows, handleDownloadExcel, loading }) => {
//     // const [uploadedRows, setUploadedRows] = useState([]);
//     const [error, setError] = useState('');

//     // const handleFileUpload = async (e) => {
//     //     const file = e.target.files[0];
//     //     if (!file) return;

//     //     setLoading(true);
//     //     setError('');

//     //     try {
//     //         const data = await file.arrayBuffer();
//     //         const workbook = XLSX.read(data, { type: 'buffer' });
//     //         const sheetName = workbook.SheetNames[0];
//     //         const worksheet = workbook.Sheets[sheetName];
//     //         const jsonData = XLSX.utils.sheet_to_json(worksheet);

//     //         setUploadedRows(jsonData); // Store uploaded data
//     //     } catch (err) {
//     //         console.error(err);
//     //         setError('Error processing the file.');
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };



//     return (

//         // <div
//         //     style={{
//         //         marginTop: '2rem',
//         //         padding: '1.5rem',
//         //         backgroundColor: '#f9f9f9',
//         //         borderRadius: '8px',
//         //         boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
//         //         maxWidth: '500px',
//         //     }}
//         // >
//         //     <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#333' }}>Upload IPC Excel</h3>

//         //     <label
//         //         htmlFor="file-upload"
//         //         style={{
//         //             display: 'inline-flex',
//         //             alignItems: 'center',
//         //             padding: '0.6rem 1rem',
//         //             backgroundColor: '#28a745',
//         //             color: 'white',
//         //             borderRadius: '6px',
//         //             cursor: 'pointer',
//         //             fontWeight: 'bold',
//         //             fontSize: '1rem',
//         //         }}
//         //     >
//         //         <FaFileExcel style={{ marginRight: '0.5rem' }} />
//         //         Choose Excel File
//         //     </label>
//         //     <input
//         //         id="file-upload"
//         //         type="file"
//         //         accept=".xlsx, .xls"
//         //         onChange={handleFileUpload}
//         //         style={{ display: 'none' }}
//         //     />

//         //     {loading && (
//         //         <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', color: '#007bff' }}>
//         //             <FaSpinner className="spin" style={{ marginRight: '0.5rem' }} />
//         //             Processing Excel file...
//         //         </div>
//         //     )}

//         //     {error && (
//         //         <p style={{ color: 'red', marginTop: '1rem', fontWeight: 500 }}>
//         //             ⚠️ {error}
//         //         </p>
//         //     )}

//         //     <button
//         //         onClick={handleDownloadExcel}
//         //         disabled={definition.length === 0}
//         //         style={{
//         //             marginTop: '1.5rem',
//         //             padding: '0.6rem 1.2rem',
//         //             backgroundColor: definition.length === 0 ? '#cccccc' : '#007bff',
//         //             color: '#fff',
//         //             border: 'none',
//         //             borderRadius: '6px',
//         //             fontWeight: 'bold',
//         //             fontSize: '1rem',
//         //             cursor: definition.length === 0 ? 'not-allowed' : 'pointer',
//         //             display: 'inline-flex',
//         //             alignItems: 'center',
//         //         }}
//         //     >
//         //         <FaDownload style={{ marginRight: '0.5rem' }} />
//         //         Download Excel with Definitions
//         //     </button>
//         // </div>


//         // <div style={{ marginTop: '2rem' }}>
//         //     <h3>Upload IPC Excel</h3>
//         //     <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//         //     {/* {loading && <p>Processing...</p>}
//         //     {error && <p style={{ color: 'red' }}>{error}</p>} */}

//         //     <button
//         //         onClick={handleDownloadExcel}
//         //         disabled={definition.length === 0}
//         //         style={{
//         //             marginTop: '1rem',
//         //             padding: '0.5rem 1rem',
//         //             backgroundColor: '#007bff',
//         //             color: '#fff',
//         //             border: 'none',
//         //             cursor: 'pointer',
//         //         }}
//         //     >
//         //         Download Excel with Definitions
//         //     </button>
//         // </div>
//     );
// };

// export default IPCExcelUploader;
