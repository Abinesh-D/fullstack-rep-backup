import React, { useState } from "react";
import axios from "axios";
import { TabContent, TabPane, Spinner, Card, CardBody, } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";
import { FaCode } from "react-icons/fa";
import { fetchGoogleCPCData } from "../BibliographySLice/BibliographySlice";
import { useDispatch } from "react-redux";

const SourceContent = ({ activeTab }) => {

  const dispatch = useDispatch();

  const [classNumber, setClassNumber] = useState("");
  const [dataLoading, setDataLoading] = useState(false);
  const [definitionData, setDefinitionData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  const onSubmitFunction = async (e) => {
    e.preventDefault();
    if (!classNumber.trim()) return alert("Please enter a valid class number.");

    setDataLoading(true);
    try {
      await dispatch(fetchGoogleCPCData(classNumber, setDefinitionData))
      setExpandedIndex(null);
    } catch (error) {
      console.error("API Error:", error.message);
    } finally {
      setDataLoading(false);
    }
  };

  const toggleExpand = (index) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };

  return (
    
    <TabContent activeTab={activeTab}>
      <TabPane tabId={activeTab}>
        <form onSubmit={onSubmitFunction}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Enter Patent Number:</label>
            <input
              type="text"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              className="form-control"
              placeholder="e.g.,EP3376361B1"
            />
            <div style={{ display: "flex", justifyContent: 'end' }}>
              <button type="submit" className="btn btn-primary mt-3" disabled={dataLoading}>
                Submit{" "}
                {dataLoading && <Spinner size="sm" color="light" className="ms-2" />}
              </button>
            </div>

          </div>
        </form>

        {definitionData?.classifications?.map((item, index) => {
          const lastEntry = item.hierarchy[item.hierarchy.length - 1];
          const leafCode = Object.keys(lastEntry)[0];
          const leafCodeDefinition = Object.values(lastEntry)[0];

          return (
            <AnimatePresence key={index} initial={false}>
              <Card className="mb-3 shadow-sm border-start border-primary border-3">
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div>
                      <h6 className="fw-semibold text-primary d-flex align-items-center mb-1">
                        <FaCode className="me-2" /> Classification Symbol
                      </h6>
                      <p className="mb-0 text-muted">{leafCode || "N/A"}</p>
                    </div>
                    <button
                      size="sm"
                      color="secondary"
                      className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedIndex === index ? "Hide Info" : "More Info"}
                    </button>
                  </div>

                  <p className="mb-0">{leafCodeDefinition}</p>

                  {expandedIndex === index &&
                    <motion.div
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
                      style={{ overflow: "hidden" }}
                      className="mt-3"
                    >
                      <motion.ul
                        className="list-group list-group-flush"
                        layout
                        transition={{ duration: 0.3 }}
                      >
                        {item.hierarchy.map((step, stepIndex) => {
                          const code = Object.keys(step)[0];
                          const desc = Object.values(step)[0];

                          return (
                            <motion.li
                              key={stepIndex}
                              className="list-group-item px-3 py-2"
                              style={{
                                fontSize: "0.8rem",
                                lineHeight: "1.2",
                                marginBottom: "0.25rem",
                                backgroundColor: code === leafCode ? "white" : "#f8f9fa",
                                borderRadius: "4px",
                                borderLeft: code === leafCode ? "4px solid #5cb85c" : "4px solid #0d6efd",
                              }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -10 }}
                              transition={{ duration: 0.3, delay: stepIndex * 0.05 }}
                            >
                              <div><strong className={code === leafCode ? "text-success" : "text-primary"}>{code}</strong></div>

                              <div>{desc}</div>
                            </motion.li>
                          );
                        })}
                      </motion.ul>
                    </motion.div>}
                </CardBody>
              </Card>
            </AnimatePresence>
          );
        })}
      </TabPane>
    </TabContent>
  );
};

export default SourceContent;































          //   <motion.div
          //   key="cpc-info"
          //   layout
          //   initial={{ opacity: 0, height: 0 }}
          //   animate={{ opacity: 1, height: "auto" }}
          //   exit={{ opacity: 0, height: 0 }}
          //   transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
          //   style={{ overflow: 'hidden' }}
          //   className="mt-3"
          // >
          //   <motion.ul
          //     className="list-group list-group-flush"
          //     layout
          //     transition={{ duration: 0.3 }}
          //   >
          //     {definitionData.map((item, index) => (
          //       <motion.li
          //         key={index}
          //         className="list-group-item px-3 py-2"
          //         style={{
                    // borderLeft: item.symbol === classificationSymbol ? "4px solid #5cb85c" : "4px solid #0d6efd",
                    // fontSize: "0.8rem",
                    // lineHeight: "1.2",
                    // marginBottom: "0.25rem",
                    // backgroundColor: item.symbol === classificationSymbol ? "white" : "#f8f9fa",
                    // borderRadius: "4px",
          //         }}
          //         initial={{ opacity: 0, x: -10 }}
          //         animate={{ opacity: 1, x: 0 }}
          //         exit={{ opacity: 0, x: -10 }}
          //         transition={{ duration: 0.3, delay: index * 0.05 }}
          //       >
                  // <div><strong className={item.symbol === classificationSymbol ? "text-success" : "text-primary"}>{item.symbol}</strong></div>
          //         <div>{item.title}</div>
          //       </motion.li>
          //     ))}
          //   </motion.ul>
          // </motion.div>


















        {/* {definitionData.length > 0 && (
          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="text-primary fw-bold mb-0">Classification Definition</h5>
              <button
                className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                onClick={() => setShowInfo(!showInfo)}
              >
                {showInfo ? "Hide Info" : "More Info"}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }}
                  className="mt-3"
                  style={{ overflow: "hidden" }}
                >
                  {definitionData.map((item, index) => {
                    const lastEntry = item.hierarchy[item.hierarchy.length - 1];
                    const [finalCode, finalDesc] = Object.entries(lastEntry)[0];

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Card className="mb-3 shadow-sm border-start border-4" style={{ borderColor: "#0d6efd" }}>
                          <CardBody>
                            <h6 className="fw-semibold text-primary d-flex align-items-center">
                              <FaCode className="me-2" />
                              {finalCode}
                            </h6>
                            <p className="mb-2 text-muted">{finalDesc}</p>

                            <Button
                              size="sm"
                              color="secondary"
                              onClick={() => toggleExpand(index)}
                            >
                              {expandedIndex === index ? (
                                <>Collapse <FaAngleUp /></>
                              ) : (
                                <>Show Hierarchy <FaAngleDown /></>
                              )}
                            </Button>

                            <AnimatePresence>
                              {expandedIndex === index && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.4 }}
                                  className="mt-3"
                                >
                                  <ul className="mb-0 text-muted small">
                                    {item.hierarchy.map((step, i) => {
                                      const [code, desc] = Object.entries(step)[0];
                                      return (
                                        <li key={i} className="mb-1">
                                          <strong className="text-dark">{code}</strong>: {desc}
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </CardBody>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )} */}


// import React, { useState } from "react";
// import axios from "axios";
// import {
//   TabContent,
//   TabPane,
//   Spinner,
//   Card,
//   CardBody,
//   Button,
// } from "reactstrap";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaAngleDown, FaAngleUp, FaCode } from "react-icons/fa";

// const SourceContent = ({ activeTab }) => {
//   const [classNumber, setClassNumber] = useState("");
//   const [dataLoading, setDataLoading] = useState(false);
//   const [definitionData, setDefinitionData] = useState([]);
//   const [expandedIndex, setExpandedIndex] = useState(null); 

//   const onSubmitFunction = async (e) => {
//     e.preventDefault();
//     if (!classNumber.trim()) return alert("Please enter a valid class number.");

//     setDataLoading(true);
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/cpc/google/${classNumber.trim()}`
//       );
//       setDefinitionData(response.data || []);
//       setExpandedIndex(null); 
//     } catch (error) {
//       console.error("API Error:", error.message);
//     } finally {
//       setDataLoading(false);
//     }
//   };

//   const toggleExpand = (index) => {
//     setExpandedIndex(index === expandedIndex ? null : index);
//   };

//   return (
//     <TabContent activeTab={activeTab}>
//       <TabPane tabId={activeTab}>
//         <form onSubmit={onSubmitFunction}>
//           <div className="mb-3">
//             <label className="form-label fw-semibold">Enter CPC Number:</label>
//             <input
//               type="text"
//               value={classNumber}
//               onChange={(e) => setClassNumber(e.target.value)}
//               className="form-control"
//               placeholder="e.g., C07D"
//             />
//             <button type="submit" className="btn btn-primary mt-3" disabled={dataLoading}>
//               Submit{" "}
//               {dataLoading && <Spinner size="sm" color="light" className="ms-2" />}
//             </button>
//           </div>
//         </form>

//         {definitionData.length > 0 && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="mt-4"
//           >
//             {definitionData.map((item, index) => {
//               const lastEntry = item.hierarchy[item.hierarchy.length - 1];
//               const [finalCode, finalDesc] = Object.entries(lastEntry)[0];

//               return (
//                 <Card key={index} className="mb-3 shadow-sm border-start border-primary border-4">
//                   <CardBody>
//                     <h6 className="fw-semibold text-primary d-flex align-items-center">
//                       <FaCode className="me-2" />
//                       {finalCode}
//                     </h6>
//                     <p className="mb-2 text-muted">{finalDesc}</p>

//                     <Button
//                       size="sm"
//                       color="secondary"
//                       onClick={() => toggleExpand(index)}
//                     >
//                       {expandedIndex === index ? (
//                         <>
//                           Collapse <FaAngleUp />
//                         </>
//                       ) : (
//                         <>
//                           Show Hierarchy <FaAngleDown />
//                         </>
//                       )}
//                     </Button>

//                     <AnimatePresence>
//                       {expandedIndex === index && (
//                         <motion.div
//                           initial={{ opacity: 0, height: 0 }}
//                           animate={{ opacity: 1, height: "auto" }}
//                           exit={{ opacity: 0, height: 0 }}
//                           transition={{ duration: 0.4 }}
//                           className="mt-3"
//                         >
//                           <ul className="mb-0 text-muted">
//                             {item.hierarchy.map((step, i) => {
//                               const [code, desc] = Object.entries(step)[0];
//                               return (
//                                 <li key={i}>
//                                   <strong>{code}</strong>: {desc}
//                                 </li>
//                               );
//                             })}
//                           </ul>
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   </CardBody>
//                 </Card>
//               );
//             })}
//           </motion.div>
//         )}




//       </TabPane>
//     </TabContent>
//   );
// };

// export default SourceContent;














// import axios from "axios";
// import { useState } from 'react';
// import { Card, CardBody, Button, Spinner, TabContent, TabPane, } from 'reactstrap';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaAngleDown, FaAngleUp, FaCode } from 'react-icons/fa';




// const SourceContent = ({ activeTab }) => {
//   const [classNumber, setClassNumber] = useState("");
//   const [dataLoading, setDataLoading] = useState(false);
//   const [definitionData, setdeFinitionData] = useState([]);

//   const [expanded, setExpanded] = useState(false);

//   const handleToggleExpand = () => setExpanded(!expanded);

//   const onSubmitFunction = async (e) => {
//     e.preventDefault();
//     setDataLoading(true);
//     if (!classNumber.trim()) {
//       alert("Please enter a valid class number.");
//       return;
//     }

//     const trimmedClassNumber = classNumber.trim();
//     console.log('trimmedClassNumber :>> ', trimmedClassNumber);
//     try {
//       const response = await axios.get(`http://localhost:8080/cpc/google/${trimmedClassNumber}`);
//       // const response = await axios.get(`http://localhost:8080/api/classification/${trimmedClassNumber}`);
//       console.log("/cpc/google", response.data);
//       // setdeFinitionData(response.data);
//     } catch (error) {
//       console.error("API Error:", error.message);
//     } finally {
//       setDataLoading(false);
//     }
//   };


//   function extractFullyUppercaseText(text) {
//     console.log('text :>> ', text);

//     if (!text.length ) {
//       return
//     }

//     //  if (text === undefined || text === null || text.trim() === "") {
//     //   console.warn("No text provided to extract uppercase parts.");
//     //   return
//     // }

//     const parts = text.split(/[\.;()]/);
//     const uppercaseParts = parts
//       .map(part => part.trim())
//       .filter(part => {
//         const lettersOnly = part.replace(/[^A-Za-z]/g, '');
//         return lettersOnly && lettersOnly === lettersOnly.toUpperCase();
//       });

//     return uppercaseParts.join("; ");
//   }

//   console.log(definitionData.title, 'definitionData')

//   const definitionText = extractFullyUppercaseText(definitionData.title || []);
//   console.log('definitionText', definitionText);

//   return (

//     <TabContent activeTab={activeTab}>
//       <TabPane tabId={activeTab}>
//         <div>
//           <p className="text-center">Source content will be displayed here.</p>
//           <form onSubmit={onSubmitFunction}>
//             <div className="mb-3">
//               <label className="form-label fw-semibold">Enter Classification Number:</label>
//               <input
//                 type="text"
//                 value={classNumber}
//                 onChange={(e) => setClassNumber(e.target.value)}
//                 className="form-control"
//                 placeholder="e.g., A01B"
//               />
//               <button type="submit" className="btn btn-primary mt-3" disabled={dataLoading}>
//                 Submit{' '}
//                 {dataLoading && (
//                   <Spinner size="sm" color="light" style={{ marginLeft: '5px' }} />
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Render after submit */}
//           {!submitted ? null : loading ? (
//             <div style={{ position: 'relative', height: '100%', width: '100%' }}>
//               <Spinner size="md" color="primary" style={{ position: 'absolute', top: '50%', left: '50%' }} />
//             </div>
//           ) : (
//             cpcItems &&
//             cpcItems.length > 0 && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="mt-4"
//               >
//                 {/* Show only main CPC on top */}
                // <Card className="mb-3 shadow-sm border-start border-primary border-4">
                //   <CardBody>
                //     <h6 className="fw-semibold text-primary d-flex align-items-center">
                //       <FaCode className="me-2" /> Classification Symbol
                //     </h6>
                //     <p className="mb-0 text-muted">{classificationSymbol || "N/A"}</p>
                //   </CardBody>
                // </Card>

//                 <Card className="mb-3 shadow-sm border-start border-success border-4">
//                   <CardBody>
//                     <h6 className="fw-semibold text-success">Definition</h6>
//                     <p className="mb-0 text-muted">{classTitle || "N/A"}</p>
//                   </CardBody>
//                 </Card>

//                 <div className="text-center mb-3">
//                   <Button color="secondary" onClick={handleToggleExpand}>
//                     {expanded ? (
//                       <>
//                         Collapse Details <FaAngleUp />
//                       </>
//                     ) : (
//                       <>
//                         Show More <FaAngleDown />
//                       </>
//                     )}
//                   </Button>
//                 </div>

//                 {/* Expandable detailed CPC definitions */}
//                 <AnimatePresence>
//                   {expanded && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: 'auto' }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ duration: 0.5 }}
//                     >
//                       {cpcItems.map((item, index) => (
//                         <Card key={index} className="mb-3 shadow-sm border-start border-info border-4">
//                           <CardBody>
//                             <h6 className="fw-bold text-info mb-2">Hierarchy for: {item.leafCode}</h6>
//                             <ul className="mb-0 text-muted">
//                               {item.hierarchy.map((step, i) => {
//                                 const [code, desc] = Object.entries(step)[0];
//                                 return (
//                                   <li key={i}>
//                                     <strong>{code}</strong>: {desc}
//                                   </li>
//                                 );
//                               })}
//                             </ul>
//                           </CardBody>
//                         </Card>
//                       ))}
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )
//           )}
//         </div>
//       </TabPane>
//     </TabContent>


//     // <TabContent activeTab={activeTab}>
//     //   <TabPane tabId={activeTab}>
//     //     <div>
//     //       <p className="text-center">Source content will be displayed here.</p>
//     //       <form onSubmit={onSubmitFunction}>
//     //         <div className="mb-3">
//     //           <label className="form-label fw-semibold">Enter Classification Number:</label>
//     //           <input
//     //             type="text"
//     //             value={classNumber}
//     //             onChange={(e) => setClassNumber(e.target.value)}
//     //             className="form-control"
//     //             placeholder="e.g., A01B"
//     //           />
//     //           <button type="submit" className="btn btn-primary mt-3">
//     //             Submit <Spinner size="sm" color="light" style={{ display: dataLoading ? 'inline-block' : 'none' }} />
//     //           </button>
//     //         </div>
//     //       </form>
//     //     </div>
//     //   </TabPane>
//     // </TabContent>
//   );
// };

// export default SourceContent;
