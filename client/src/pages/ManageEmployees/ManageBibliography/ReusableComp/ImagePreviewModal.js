import { FaTimes } from 'react-icons/fa';

const ImagePreviewModal = ({ visible, image, altText, onClose }) => {
    if (!visible) return null;

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                zIndex: 9999,
            }}
        >
            <div
                className="bg-white p-4 rounded shadow"
                style={{
                    maxWidth: '95%',
                    maxHeight: '90%',
                    position: 'relative',
                    textAlign: 'center',
                }}
            >
                <img
                    src={image}
                    alt={altText}
                    className="img-fluid mb-3"
                    style={{ maxHeight: '60vh', objectFit: 'contain' }}
                />

                <div className="row align-items-center mb-2">
                    <div className="col-10">
                        <p className="mb-0 text-center" style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6' }}>
                            🔔 Please upload your Excel file in the <strong>same format</strong> as shown.<br />
                            <span style={{ color: 'red', fontWeight: 'bold' }}>
                                * Do not change the "<u>Class</u>" column heading. It must stay as is.
                            </span>
                        </p>
                    </div>

                    <div className="col-2 text-end">
                        <button
                            onClick={onClose}
                            className="btn btn-dark btn-sm fw-bold rounded"
                            aria-label="Close"
                        >
                            Close
                        </button>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.25rem',
                        cursor: 'pointer',
                        color: '#333',
                    }}
                    aria-label="Close Modal"
                    title="Close"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default ImagePreviewModal;












// import { FaTimes } from 'react-icons/fa';


// const ImagePreviewModal = ({ visible, image, altText, onClose }) => {
//     if (!visible) return null;

//     return (
//         <div style={{
//             position: 'fixed',
//             top: 0, left: 0, right: 0, bottom: 0,
//             backgroundColor: 'rgba(0, 0, 0, 0.6)',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//             zIndex: 9999
//         }}>
//             <div style={{
//                 backgroundColor: '#fff',
//                 padding: '1.5rem',
//                 borderRadius: '8px',
//                 maxWidth: '95%',
//                 maxHeight: '90%',
//                 boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
//                 position: 'relative',
//                 textAlign: 'center'
//             }}>
//                 <img
//                     src={image}
//                     alt={altText}
//                     style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', marginBottom: '1rem' }}
//                 />
//                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
//   <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.6', margin: 0 }}>
//     🔔 Please upload your Excel file in the <strong>same format</strong> as shown.<br />
//     <span style={{ color: 'red', fontWeight: 'bold' }}>
//       * Do not change the "<u>Class</u>" column heading. It must stay as is.
//     </span>
//   </p>

//   <button
//     onClick={onClose}
//     style={{
//       backgroundColor: '#17a2b8', // Bootstrap info color
//       color: '#fff',
//       border: 'none',
//       borderRadius: '12px',
//       fontSize: '0.8rem',
//       fontWeight: 'bold',
//       padding: '4px 10px',
//       cursor: 'pointer',
//       whiteSpace: 'nowrap',
//     }}
//     aria-label="Close"
//     title="Close"
//   >
//     Close
//   </button>
// </div>


//                 <button
//                     onClick={onClose}
//                     style={{
//                         position: 'absolute',
//                         top: '-3px',
//                         right: '-8px',
//                         background: 'transparent',
//                         border: 'none',
//                         fontSize: '1.25rem',
//                         cursor: 'pointer',
//                         color: '#333',
//                         display: 'flex',
//                         alignItems: 'center',
//                         justifyContent: 'center'
//                     }}
//                     aria-label="Close Modal"
//                     title="Close"
//                 >
//                     <FaTimes />
//                 </button>

//                 {/* <button
//                     onClick={onClose}
//                     style={{
//                         position: 'absolute',
//                         top: '5px',
//                         right: '5px',
//                         background: 'transparent',
//                         border: 'none',
//                         fontSize: '1.5rem',
//                         cursor: 'pointer'
//                     }}
//                     aria-label="Close"
//                 >
//                     &times;
//                 </button> */}
//             </div>
//         </div>
//     );
// };






// // const ImagePreviewModal = ({ visible, image, altText, onClose }) => {
// //     useEffect(() => {
// //         const handleEsc = (e) => {
// //             if (e.key === 'Escape') onClose();
// //         };
// //         document.addEventListener('keydown', handleEsc);
// //         return () => document.removeEventListener('keydown', handleEsc);
// //     }, [onClose]);

// //     if (!visible) return null;

// //     return (
// //         <div style={{
// //             position: 'fixed',
// //             top: 0, left: 0, right: 0, bottom: 0,
// //             backgroundColor: 'rgba(0, 0, 0, 0.6)',
// //             display: 'flex',
// //             justifyContent: 'center',
// //             alignItems: 'center',
// //             zIndex: 9999
// //         }}>
// //             <div style={{
// //                 backgroundColor: '#fff',
// //                 padding: '1.5rem',
// //                 borderRadius: '8px',
// //                 maxWidth: '90%',
// //                 maxHeight: '90%',
// //                 boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
// //                 position: 'relative'
// //             }}>
// //                 <img
// //                     src={image}
// //                     alt={altText}
// //                     style={{
// //                         maxWidth: '100%',
// //                         maxHeight: '70vh',
// //                         objectFit: 'contain'
// //                     }}
// //                 />
// //                 <button
// //                     onClick={onClose}
// //                     style={{
// //                         position: 'absolute',
// //                         top: '10px',
// //                         right: '10px',
// //                         background: 'transparent',
// //                         border: 'none',
// //                         fontSize: '1.5rem',
// //                         fontWeight: 'bold',
// //                         cursor: 'pointer'
// //                     }}
// //                     aria-label="Close"
// //                 >
// //                     &times;
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// export default ImagePreviewModal;
