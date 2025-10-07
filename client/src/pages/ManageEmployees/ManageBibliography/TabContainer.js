import React, { useState } from 'react';
import { Spinner, AccordionBody, AccordionHeader, AccordionItem, Card, CardBody, CardText, CardTitle, Col, Collapse, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledAccordion, UncontrolledCollapse } from "reactstrap";
import classnames from "classnames";
import { motion } from "framer-motion";

// import PatentSearch from './PatentSearch';
// import PatentLookup from './PatentLookup';
// import LensData from './LensData';
// import EspaceComp from './EspaceComp';


import { retrieveEspacePatentData, retrieveClassificationData, fetchLegalStatusData, fetchGooglePatentData, retrieveLensPatentData, setPatentLoading, resetPatentData } from './BibliographySLice/BibliographySlice';
import { useDispatch, useSelector } from 'react-redux';

// Import child components
import SearchTabs from '../ManageBibliography/ReusableComp/SearchTabs';
import Quicksearch from '../ManageBibliography/ReusableComp/QuickSearchForm';
import SourceTab from '../ManageBibliography/ReusableComp/SourceContent';

import Normalsearchtab from '../ManageBibliography/ReusableComp/NormalSearchPlaceholder';
import ClassifySearch from './ReusableComp/ClassifySearch';
import SourceContent from '../ManageBibliography/ReusableComp/SourceContent';


const TabContainer = (props) => {
  const dispatch = useDispatch();
  const patentSlice = useSelector(state => state.patentSlice);

  const [activeTab1, setactiveTab1] = useState("5");
  const [customActiveTab, setcustomActiveTab] = useState("1");

  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [dataLoading, setDataLoading] = useState(false);
  const [customAlertMessage, setCustomAlertMessage] = useState("");
  const [patentNumber, setPatentNumber] = useState('');
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    const text = data.classification.join('; ');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };

  const toggleCustom = tab => {
    if (customActiveTab !== tab) {
      setcustomActiveTab(tab);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(resetPatentData())
    const trimmedNumber = patentNumber.trim();
    if (!trimmedNumber) {
      setAlertType("error");
      setCustomAlertMessage("❌ Patent number is required.");
      setShowAlert(true);
      return;
    }

    dispatch(setPatentLoading(true));
    setShowAlert(false);
    setLoading(true);
  


    try {
      // Espacenet API
      try {
        // await retrieveEspacePatentData(trimmedNumber, dispatch, setShowAlert);
        // await fetchLegalStatusData(trimmedNumber, dispatch);

        await Promise.all([
          retrieveEspacePatentData(trimmedNumber, dispatch, setShowAlert),
          // fetchLegalStatusData(trimmedNumber, dispatch),
        ]);

        setAlertType("success");
        setCustomAlertMessage("✅ Espacenet patent data successfully fetched.");
        setShowAlert(true);
      } catch (error) {
        console.error("Espacenet fetch error:", error);
        setAlertType("error");
        setCustomAlertMessage("❌ Espacenet: No data found or fetch failed.");
        setShowAlert(true);
      }


  
      // Lens API
      // try {
      //   await retrieveLensPatentData(patentNumber, dispatch, setShowAlert);
      //   setAlertType("success");
      //   setCustomAlertMessage("✅ Lens.org patent data successfully fetched.");
      //   setShowAlert(true);
      // } catch (error) {
      //   console.error("Lens fetch error:", error);
      //   setAlertType("error");
      //   setCustomAlertMessage("❌ Lens.org: No data found or fetch failed.");
      //   setShowAlert(true);
      // }
  
      // Google Patents API
      // try {
      //   await fetchGooglePatentData(patentNumber, dispatch, setShowAlert);
      //   setAlertType("success");
      //   setCustomAlertMessage("✅ Google Patents data successfully fetched.");
      //   setShowAlert(true);
      // } catch (error) {
      //   console.error("Google fetch error:", error);
      //   setAlertType("error");
      //   setCustomAlertMessage("❌ Google Patents: No data found or fetch failed.");
      //   setShowAlert(true);
      // }
  
      // Hide alert after delay
      setTimeout(() => setShowAlert(false), 3000);
    } catch (err) {
      console.error("Unexpected error:", err);
      setAlertType("error");
      setCustomAlertMessage("Unexpected error occurred.");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoading(false);
      dispatch(setPatentLoading(false));
    }
  };
  

  return (
    <div>
      <Row className="justify-content-center">
        <Col xl={12}>
          <Card className="">
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified mb-4">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: customActiveTab === "1" })}
                    onClick={() => toggleCustom("1")}
                  >
                    <span className="d-block d-sm-none"><i className="fas fa-search"></i></span>
                    <span className="d-none d-sm-block">Quick Patent Search</span>
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: customActiveTab === "2" })}
                    onClick={() => toggleCustom("2")}
                  >
                    <span className="d-block d-sm-none"><i className="fas fa-search-plus"></i></span>
                    <span className="d-none d-sm-block">Normal Patent Search</span>
                  </NavLink>
                </NavItem> */}

                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: customActiveTab === "3" })}
                    onClick={() => toggleCustom("3")}
                  >
                    <span className="d-block d-sm-none"><i className="fas fa-search"></i></span>
                    <span className="d-none d-sm-block">Classification</span>
                  </NavLink>
                </NavItem>


                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({ active: customActiveTab === "4" })}
                    onClick={() => toggleCustom("4")}
                  >
                    <span className="d-block d-sm-none"><i className="fas fa-search"></i></span>
                    <span className="d-none d-sm-block">Classification(CPC)</span>
                  </NavLink>
                </NavItem>

              </Nav>

              <TabContent
                activeTab={customActiveTab}
                className="p-3"
                tag={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TabPane tabId="1">
                  <Quicksearch
                    patentSlice={patentSlice}
                    patentNumber={patentNumber}
                    setPatentNumber={setPatentNumber}
                    handleSubmit={handleSubmit}
                    setShowAlert={setShowAlert}
                    showAlert={showAlert}
                    alertType={alertType}
                    customAlertMessage={customAlertMessage}
                    loading={loading}
                    activeTab1={activeTab1}
                    toggle1={toggle1}
                  />
                </TabPane>

                {/* <TabPane tabId="2">
                  <SourceTab activeTab={activeTab1} />
                </TabPane> */}

                <TabPane tabId="3">
                  <ClassifySearch
                  activeTab={activeTab1}

                  />
                </TabPane>


                <TabPane tabId="4">
                  <div style={{ minHeight: "100vh", backgroundColor: "#f4f6f9", paddingTop: "1rem" }}>
                    <Container>
                      <Row className="mb-4">
                        <Col className="text-center">
                          <motion.h2
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="fw-bold text-primary"
                          >
                            📘 CPC Explorer
                          </motion.h2>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-muted"
                          >
                            Enter a patent number to explore its Cooperative Patent Classification (CPC) hierarchy.
                          </motion.p>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={{ size: 8, offset: 2 }}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7 }}
                          >
                            <SourceContent activeTab="1" />
                          </motion.div>
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </TabPane>

              </TabContent>

            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TabContainer;



















// import React, { useState } from 'react';
// import { Spinner, AccordionBody, AccordionHeader, AccordionItem, Card, CardBody, CardText, CardTitle, Col, Collapse, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane, UncontrolledAccordion, UncontrolledCollapse } from "reactstrap";
// import classnames from "classnames";
// import PatentLookup from './PatentLookup';
// import LensData from './LensData';
// import EspaceComp from './EspaceComp';
// import { motion } from "framer-motion";
// import PatentSearch from './PatentSearch';
// import { retrieveEspacePatentData } from './BibliographySLice/BibliographySlice';
// import { useDispatch } from 'react-redux';

// const TabContainer = (props) => {
//   const dispatch = useDispatch();
//   const [activeTab1, setactiveTab1] = useState("5");
//   const [customActiveTab, setcustomActiveTab] = useState("1");

//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertType, setAlertType] = useState('');
//   const [dataLoading, setDataLoading] = useState(false);
//   const [customAlertMessage, setCustomAlertMessage] = useState("");
//   const [patentNumber, setPatentNumber] = useState('');
//   const [data, setData] = useState(null);
//   const [error, setError] = useState('');
//   const [copied, setCopied] = useState(false);

//   <motion.button
//     whileHover={{ scale: 1.05 }}
//     whileTap={{ scale: 0.95 }}
//     type="submit"
//     className="btn btn-success px-4"
//     disabled={loading}
//   >
//     {loading && <Spinner size="sm" color="light" className="me-2" />}
//     {loading ? "Searching..." : "Search"}
//   </motion.button>


//   const copyToClipboard = () => {
//     const text = data.classification.join('; ');
//     navigator.clipboard.writeText(text).then(() => {
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     });
//   };

//   const toggle1 = tab => {
//     if (activeTab1 !== tab) {
//       setactiveTab1(tab);
//     }
//   };

//   const toggleCustom = tab => {
//     if (customActiveTab !== tab) {
//       setcustomActiveTab(tab);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const trimmedNumber = patentNumber.trim();

//     if (!trimmedNumber) {
//       setAlertType("error");
//       setCustomAlertMessage("❌ Patent number is required.");
//       setShowAlert(true);
//       return;
//     }

//     const pattern = /^[A-Z]{2}\d{7}[A-Z]\d?$/i;
//     if (!pattern.test(trimmedNumber)) {
//       setAlertType("error");
//       setCustomAlertMessage("❌ Please enter a valid patent number format.");
//       setShowAlert(true);
//       return;
//     }

//     setShowAlert(false);
//     setLoading(true);

//     try {
//       await retrieveEspacePatentData(trimmedNumber, dispatch, setShowAlert)
//         .then(() => {
//           setAlertType("success");
//           setCustomAlertMessage("✅ Bibliography details successfully fetched.");
//           setShowAlert(true);
//         })
//         .catch((error) => {
//           console.error("Error retrieving patent data:", error);
//           setAlertType("error");
//           setCustomAlertMessage("❌ Failed to fetch. Please check the patent number and try again.");
//           setShowAlert(true);
//         });

//       setTimeout(() => setShowAlert(false), 3000);
//     } catch (err) {
//       console.error("Unexpected error:", err);
//       setAlertType("error");
//       setCustomAlertMessage("❌ Failed to fetch. Please check the patent number and try again.");
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 3000);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div>
//       <Row className="justify-content-center">
//         <Col xl={10}>
//           <Card className="">
//             <CardBody>
//               <Nav tabs className="nav-tabs-custom nav-justified mb-4">
//                 <NavItem>
//                   <NavLink
//                     style={{ cursor: "pointer" }}
//                     className={classnames({ active: customActiveTab === "1" })}
//                     onClick={() => toggleCustom("1")}
//                   >
//                     <span className="d-block d-sm-none"><i className="fas fa-search"></i></span>
//                     <span className="d-none d-sm-block">Quick Patent Search</span>
//                   </NavLink>
//                 </NavItem>
//                 <NavItem>
//                   <NavLink
//                     style={{ cursor: "pointer" }}
//                     className={classnames({ active: customActiveTab === "2" })}
//                     onClick={() => toggleCustom("2")}
//                   >
//                     <span className="d-block d-sm-none"><i className="fas fa-search-plus"></i></span>
//                     <span className="d-none d-sm-block">Normal Patent Search</span>
//                   </NavLink>
//                 </NavItem>
//               </Nav>
//               <TabContent
//                 activeTab={customActiveTab}
//                 className="p-3"
//                 tag={motion.div}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//               >

//                 <TabPane tabId="1">

//                   <div className="p-4 bg-light rounded shadow-sm">
//                     <form
//                       onSubmit={(e) => {
//                         setShowAlert(false);
//                         handleSubmit(e);
//                       }}
//                     >
//                       <div className="mb-3">
//                         <label className="form-label fw-semibold">Enter Patent Number:</label>
//                         <input
//                           type="text"
//                           value={patentNumber.trim()}
//                           onChange={(e) => setPatentNumber(e.target.value)}
//                           className={`form-control ${error ? "is-invalid" : ""}`}
//                           placeholder="(e.g., WO2007067176A2)"
//                         />
//                         {error && <div className="invalid-feedback">{error}</div>}
//                       </div>

//                       <Row className="align-items-center">
//                         <Col md="9" className="mb-2 mb-md-0">

//                           {showAlert && (
//                             <motion.div
//                               initial={{ opacity: 0, scale: 0.95 }}
//                               animate={{ opacity: 1, scale: 1 }}
//                               transition={{ duration: 0.3 }}
//                               className={`alert m-0 text-center d-flex align-items-center h-100 ${alertType === "success" ? "alert-success" : "alert-danger"
//                                 }`}
//                               style={{ minHeight: "42px" }}
//                             >
//                               {customAlertMessage}
//                             </motion.div>
//                           )}

//                         </Col>

//                         <Col
//                           md="3"
//                           className="text-md-end text-center d-flex justify-content-md-end justify-content-center"
//                         >
//                           <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             type="submit"
//                             className="btn btn-success d-inline-flex align-items-center justify-content-center px-3"
//                             disabled={loading}
//                             style={{ minWidth: loading ? "130px" : "auto", transition: "min-width 0.2s ease" }}
//                           >
//                             {loading && <Spinner size="sm" color="light" className="me-2" />}
//                             {loading ? "Searching..." : "Search"}
//                           </motion.button>
//                         </Col>
//                       </Row>
//                     </form>
//                   </div>



//                   <Nav pills className="navtab-bg nav-justified my-4">
//                     {[
//                       { id: "5", label: "Google Result" },
//                       { id: "6", label: "Espacenet Result" },
//                       { id: "7", label: "Lens Org Result" },
//                       { id: "8", label: "Patent Free Result" }
//                     ].map(({ id, label }) => (
//                       <NavItem key={id}>
//                         <NavLink
//                           style={{ cursor: "pointer" }}
//                           className={classnames({ active: activeTab1 === id })}
//                           onClick={() => toggle1(id)}
//                         >
//                           <span className="d-none d-sm-block">
//                             {label} {activeTab1 === id && <i className="fas fa-search ms-1"></i>}
//                           </span>
//                         </NavLink>
//                       </NavItem>
//                     ))}
//                   </Nav>

//                   <TabContent activeTab={activeTab1}>
//                     <TabPane tabId="5">
//                       <motion.div
//                         key="google"
//                         initial={{ opacity: 0, x: 30 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ duration: 0.4 }}
//                       >
//                         <PatentLookup />
//                       </motion.div>
//                     </TabPane>

//                     <TabPane tabId="6"><EspaceComp /></TabPane>
//                     <TabPane tabId="7"><LensData /></TabPane>
//                     <TabPane tabId="8"><p className="text-center">Coming Soon...</p></TabPane>
//                   </TabContent>
//                 </TabPane>

//                 <TabPane tabId="2">
//                   <div className="text-center py-5">
//                     <h5>Normal Patent Search Section</h5>
//                     <p>Coming soon...</p>
//                   </div>
//                 </TabPane>
//               </TabContent>
//             </CardBody>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   )
// }
// export default TabContainer






















 {/* <Row>
        <Col xl={12}>
          <Card>
            <CardBody>
              <Nav tabs className="nav-tabs-custom nav-justified">
                <NavItem>
                  <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "1", })} onClick={() => { toggleCustom("1"); }}>
                    <span className="d-block d-sm-none">
                      <i className="fas fa-home"></i>
                    </span>
                    <span className="d-none d-sm-block">Quick Patent Search</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink style={{ cursor: "pointer" }} className={classnames({ active: customActiveTab === "2", })} onClick={() => { toggleCustom("2"); }}>
                    <span className="d-block d-sm-none">
                      <i className="far fa-user"></i>
                    </span>
                    <span className="d-none d-sm-block">Normal Patent Search</span>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={customActiveTab} className="p-3 text-muted">
                <TabPane tabId="1">
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
                  </div>
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">
                        <Col xl={12}>
                          <Nav pills className="navtab-bg nav-justified">
                            <NavItem>
                              <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab1 === "5", })} onClick={() => { toggle1("5"); }}>
                                <span className="d-block d-sm-none"><i className="fas fa-home"></i></span>
                                <span className="d-none d-sm-block">Google Result {activeTab1 === "5" && <i className='fas fa-search'></i>} </span>
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab1 === "6", })} onClick={() => { toggle1("6"); }}>
                                <span className="d-block d-sm-none"><i className="far fa-user"></i></span>
                                <span className="d-none d-sm-block">Espacenet Result {activeTab1 === "6" && <i className='fas fa-search'></i>}</span>
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab1 === "7", })} onClick={() => { toggle1("7"); }}>
                                <span className="d-block d-sm-none"><i className="far fa-envelope"></i></span>
                                <span className="d-none d-sm-block">Lens Org Result {activeTab1 === "7" && <i className='fas fa-search'></i>}</span>
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink style={{ cursor: "pointer" }} className={classnames({ active: activeTab1 === "8", })} onClick={() => { toggle1("8"); }}>
                                <span className="d-block d-sm-none"><i className="fas fa-cog"></i></span>
                                <span className="d-none d-sm-block">Patent Free Result {activeTab1 === "8" && <i className='fas fa-search'></i>}</span>
                              </NavLink>
                            </NavItem>
                          </Nav>
                          <TabContent activeTab={activeTab1} className="p-3 text-muted">
                            <TabPane tabId="5">
                              <Row>
                                <Col sm="12">
                                  <CardText className="mb-0">
                                    <PatentLookup />
                                  </CardText>
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tabId="6">
                              <Row>
                                <Col sm="12">
                                  <CardText className="mb-0">
                                    < EspaceComp />
                                  </CardText>
                                </Col>
                              </Row>
                            </TabPane>
                            <TabPane tabId="7">
                              <Row>
                                <Col sm="12">
                                  <CardText className="mb-0">
                                    <LensData />
                                  </CardText>
                                </Col>
                              </Row>
                            </TabPane>

                            <TabPane tabId="8">
                              <Row>
                                <Col sm="12">
                                  <CardText className="mb-0">
                                  </CardText>
                                </Col>
                              </Row>
                            </TabPane>
                          </TabContent>
                        </Col>
                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <CardText className="mb-0">

                      </CardText>
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row> */}