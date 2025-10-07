import React, { useMemo, useState, useEffect, useRef  } from "react";
import { Row, Col, Button, Label, Input, Form, Spinner } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { Link } from "react-router-dom";
import { isEmptyArray } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setRelevantApiTrue } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import FeedbackModal from "../../ReusableComponents/FeedbackModal";
import NonPatentLiteratureForm from "./NonPatentLiteratureForm";
import CustomOffCanvas from '../../../../components/Common/commonReport/CustomOffCanvas';
import axios from "axios";
import SavedSuccess from "../../../../components/Common/SavedSuccess";
import PatentBibliographicForm from "./PatentBibliographicForm";
import { generateTableColumns } from "../../../../components/Common/commonReport/columnUtils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormTextEditor from "../../../../components/Common/commonReport/FormTextEditor";




const RelevantRefComponent = ({
    loading,
    relevantForm,
    relevantRefSaved,
    errorValidation,
    setErrorValidation,
    handleFetchPatentData,
    handleRelevantSubmit,
    handleNplSubmit,
    handleNplChange,
    nplPatentFormData,
    onNplDeleteClick,
    nonPatentFormData,
    overallSummary,
    summarySaved,
    overallSummarrySavedData,
    setOverallSummary,
    handleOverAllSummarySave,
    relevantFormData,
    onDeleteClick,
    handleRelevatFormInputChange,
    resetRelevantForm,
    setrelevantFormData,
    relevantAndNplUpdatedData,
    setNplPatentFormData
}) => {

    const patentSlice = useSelector(state => state.patentSlice);
    const dispatch = useDispatch();

    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [tableData, setTableData] = useState([]);

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);

    const prevRelevantRef = useRef([]);
    const prevNonPatentRef = useRef([]);

    const nonPatentModified = nonPatentFormData.map((item) => ({
        patentNumber: item.nplTitle,
        publicationUrl: item.nplPublicationUrl,
        googlePublicationUrl: item.nplPublicationUrl,
        assignee: item.url,
        analystComments: item.comments,
        filingDate: item.nplPublicationDate,
        _id: item._id,
        nplId: true,
        relevantExcerpts: item.excerpts

    }));

    const combinedDataValue = useMemo(() => {
        const currentCombined = [...relevantFormData, ...nonPatentModified];

        const hasChanged = (
            prevRelevantRef.current.length !== relevantFormData.length ||
            prevNonPatentRef.current.length !== nonPatentModified.length ||
            JSON.stringify(prevRelevantRef.current) !== JSON.stringify(relevantFormData) ||
            JSON.stringify(prevNonPatentRef.current) !== JSON.stringify(nonPatentModified)
        );

        if (relevantAndNplUpdatedData?.length > 0 && !hasChanged) {
            return [...relevantAndNplUpdatedData];
        } else {
            return currentCombined;
        }
    }, [relevantFormData, nonPatentFormData, relevantAndNplUpdatedData]);

    useEffect(() => {
        prevRelevantRef.current = relevantFormData;
        prevNonPatentRef.current = nonPatentModified;
    }, [relevantFormData, nonPatentFormData]);

    useEffect(() => {
        setTableData(combinedDataValue);
    }, [combinedDataValue]);




    const handleRelevantAndNplCombinedSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-relevantandnpl-data/${patentSlice.singleProject._id}`, 
                { tableData },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                const updatedDetails = response.data.stages.relevantReferences.relevantAndNplCombined;
                setTableData(updatedDetails);
                toggleCanvas();
                toast.success("Order Saved");
            }

        } catch (error) {
            console.error("❌ Error saving publication detail:", error);
        }
    };


    const relevantAndNplColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Publication Number / Title", accessorKey: "patentNumber" },
                { header: "Publication Date", accessorKey: "filingDate" },
                { header: "Author(s) / Assignee(s)", accessorKey: "assignee" },
            ],
            includeSerialNo: true,
            includeActions: false,
        })
        , [relevantAndNplUpdatedData]);

    // const columns = useMemo(() =>
    //     generateTableColumns({
    //         columnsConfig: [
    //             { header: "Publication Number", accessorKey: "patentNumber" },
    //             { header: "Publication Date", accessorKey: "filingDate" },
    //             { header: "Grant Date", accessorKey: "grantDate" },
    //             { header: "Priority Date", accessorKey: "priorityDate" },
    //         ],
    //         includeSerialNo: true,
    //         includeActions: true,
    //         onDeleteClick: onDeleteClick,
    //         deleteTooltip: "Delete Publication",
    //     })
    //     , [relevantFormData]);
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = useMemo(
        () =>
            generateTableColumns({
                columnsConfig: [
                    { header: "Publication Number", accessorKey: "patentNumber" },
                    { header: "Publication Date", accessorKey: "filingDate" },
                    { header: "Grant Date", accessorKey: "grantDate" },
                    { header: "Priority Date", accessorKey: "priorityDate" },
                ],
                includeSerialNo: true,
                includeActions: true,
                onDeleteClick: onDeleteClick,
                selectedRows,
                setSelectedRows,
                allRows: relevantFormData,
                isCell: true
            }),
        [relevantFormData, selectedRows]
    );


    const nplColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Title / Product Name", accessorKey: "nplTitle" },
                { header: "Source / Author(s)", accessorKey: "url" },
                { header: "Publication Date", accessorKey: "nplPublicationDate" },
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onNplDeleteClick,
            deleteTooltip: "Delete Non-Patent",
            isCell: true
        })
        , [nonPatentFormData]);


    const handleClearInputFields = () => {
        resetRelevantForm();
        dispatch(setRelevantApiTrue(false));
    };



    return (
        <>
            <>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </>
            <Row className="align-items-center mb-4">
                <Col className="d-flex align-items-center">
                    <h4 className="fw-bold m-0">Relevant References</h4>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button color="warning" onClick={() => setFeedbackOpen(true)} className="d-flex align-items-center">
                        💬 Feedback
                    </Button>
                </Col>
            </Row>

            {
                <FeedbackModal
                    isOpen={feedbackOpen}
                    toggle={() => setFeedbackOpen(!feedbackOpen)}
                />
            }



            {loading ? (
                <div className="blur-loading-overlay text-center mt-4">
                    <Spinner color="primary" />
                    <p className="mt-2 text-primary">Loading Relevant References...</p>
                </div>
            ) : (
                <PatentBibliographicForm
                    formState={relevantForm}
                    onInputChange={handleRelevatFormInputChange}
                    onSubmit={handleRelevantSubmit}
                    onClear={handleClearInputFields}
                    onFetch={handleFetchPatentData}
                    showSaved={relevantRefSaved}
                    handleValidationError={setErrorValidation}
                    relevantApiTrue={patentSlice.relevantApiTrue}
                />
               
            )}




            {!isEmptyArray(relevantFormData) && (
                <TableContainer
                    columns={columns}
                    data={relevantFormData || []}
                    isPagination={true}
                    isCustomPageSize={true}
                    SearchPlaceholder="Search..."
                    tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                    theadClass="table-light"
                    paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    pagination="pagination"
                />

            )}


            <NonPatentLiteratureForm
                nplPatentFormData={nplPatentFormData}
                handleNplChange={handleNplChange}
                handleNplSubmit={handleNplSubmit}
                nonPatentFormData={nonPatentFormData}
                nplColumns={nplColumns}
                setNplPatentFormData={setNplPatentFormData}
                // relevantExcerpts={relevantExcerpts}
            />


            <>
                <Row style={{
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeeba", borderRadius: "8px", padding: "0.5rem",
                    alignItems: "center",
                }}
                >
                    <Col lg="2" className="mt-3 mt-lg-0">
                        <Button color="secondary" onClick={toggleCanvas}>
                            Reorder Now
                        </Button>
                    </Col>
                    <Col lg="10">
                        <div style={{ flex: '1 1 auto', color: '#dc3545', fontWeight: 500 }}>
                            ⚠️ Don't forget to <strong>Reorder</strong> — otherwise your <strong>Relevant</strong> and <strong>NPL</strong>
                            reference will not appear in the generated Word report.
                        </div>
                    </Col>
                </Row>
            </>

            {/* <CustomOffCanvas
                isOpen={isCanvasOpen}
                toggle={toggleCanvas}
                data={tableData}
                setTableData={setTableData}
                columns={relevantAndNplColumns}
                handleUpdate={handleRelevantAndNplCombinedSubmit}
            /> */}

            <CustomOffCanvas
                isOpen={isCanvasOpen}
                toggle={toggleCanvas}
                title="Relevant References & NPL"
                subtitle={
                    <>
                        Reorder to assign roll numbers for <strong>Relevant and NPL References.</strong>
                    </>
                }
                legendItems={[
                    { label: "Relevant Reference", color: "#fafecf" },
                    { label: "NPL Reference", color: "antiquewhite" },
                    { label: "Dragging", color: "white" },
                ]}
                data={tableData}
                columns={relevantAndNplColumns}
                setTableData={setTableData}
                handleUpdate={handleRelevantAndNplCombinedSubmit}
            />


            {patentSlice.singleProject.projectTypeId === "0001" &&
                <>
                    <h4 className="fw-bold mb-4 mt-4">Overall Summary of Search and Prior Arts</h4>
                    <Row>
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="overall-summary">Overall Summary</Label>
                                <textarea
                                    id="overall-summary"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Overall Summary"
                                    value={overallSummary}
                                    onChange={(e) => setOverallSummary(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="2">
                            <div className="mb-3">
                                <Button onClick={handleOverAllSummarySave} color="warning" className="w-100">
                                    Save Summary
                                </Button>
                            </div>
                        </Col>
                        <Col className="">
                            <SavedSuccess show={summarySaved} message="Summary Saved!" />
                        </Col>
                    </Row>
                </>
            }
        </>
    );
};

export default RelevantRefComponent;




















    // const relevantAndNplColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Publication Number / Title",
    //         accessorKey: "patentNumber",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Publication Date",
    //         accessorKey: "filingDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Grant Date",
    //         accessorKey: "grantDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Priority Date",
    //         accessorKey: "priorityDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    // ], [relevantAndNplUpdatedData]);

    // const columns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Publication Number",
    //         accessorKey: "patentNumber",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Publication Date",
    //         accessorKey: "filingDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Grant Date",
    //         accessorKey: "grantDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Priority Date",
    //         accessorKey: "priorityDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Publication"
    //                         onClick={() => onDeleteClick(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [relevantFormData]);

    // const nplColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serialnumber",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Title / Product Name",
    //         accessorKey: "nplTitle",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "PublicationDate",
    //         accessorKey: "nplPublicationDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Non-Patent"
    //                         onClick={() => onNplDeleteClick(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [nonPatentFormData]);






            {/* {patentSlice.singleProject.projectTypeId === "0002" && (
                <NonPatentLiteratureForm
                    nplPatentFormData={nplPatentFormData}
                    handleNplChange={handleNplChange}
                    handleNplSubmit={handleNplSubmit}
                    nonPatentFormData={nonPatentFormData}
                    nplColumns={nplColumns}
                />)
            }

            {(patentSlice.singleProject.projectTypeId === "0002") && (

                <>
                    <Row style={{
                            backgroundColor: "#fff3cd",
                            border: "1px solid #ffeeba",borderRadius: "8px",padding: "0.5rem",
                            alignItems: "center",
                        }}
                    >   
                        <Col lg="2" className="mt-3 mt-lg-0">
                            <Button color="secondary" onClick={toggleCanvas}>
                                Reorder Now
                            </Button>
                        </Col>
                        <Col lg="10">
                            <div style={{ flex: '1 1 auto', color: '#dc3545', fontWeight: 500 }}>
                                ⚠️ Don't forget to <strong>Reorder</strong> — otherwise your <strong>Relevant</strong> and <strong>NPL</strong> 
                                reference will not appear in the generated Word report.
                            </div>
                        </Col>
                    </Row>
                </>
            )} */}


 // <Form onSubmit={handleRelevantSubmit}>
                //     <Row>
                //         <p className="text-info">
                //             ℹ️ Enter the <strong>Patent Number</strong> and click <strong>Submit</strong> to auto fetch bibliographic info.
                //         </p>
                //         <Col lg="4">
                //             <div className="mb-3">
                //                 <Label for="patentNumber">Publication Number</Label>
                //                 <Input
                //                     type="text"
                //                     id="patentNumber"
                //                     className="form-control"
                //                     placeholder={errorValidation ? "Please check the Patent Number" : "Enter Publication Number"}
                //                     value={relevantForm.patentNumber}
                //                     onChange={(e) => {
                //                         handleRelevatFormInputChange(e);
                //                         setErrorValidation(false);
                //                     }}
                //                 />
                //             </div>
                //         </Col>
                //         <Col className="d-grid align-items-end">
                //             <div className="mb-3">
                //                 {
                //                     relevantForm.patentNumber && patentSlice.relevantApiTrue ? (
                //                         <Button color="danger" onClick={handleClearInputFields} className="w-100">Clear</Button>
                //                     ) : (
                //                         <Button color="success" onClick={handleFetchPatentData} className="w-100">Submit</Button>
                //                     )
                //                 }
                //             </div>
                //         </Col>

                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="publicationUrl">Publication Number (URL)</Label>
                //                 <Input
                //                     type="text"
                //                     id="publicationUrl"
                //                     className="form-control"
                //                     placeholder="Enter Publication Number URL"
                //                     value={relevantForm.publicationUrl}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>

                //     <Row>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="title">Title</Label>
                //                 <Input
                //                     type="text"
                //                     id="title"
                //                     className="form-control"
                //                     placeholder="Enter Title"
                //                     value={relevantForm.title}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="filingDate">Filing/Application Date (Optional)</Label>
                //                 <Input
                //                     type="text"
                //                     id="filingDate"
                //                     className="form-control"
                //                     placeholder="dd-mm-yyyy"
                //                     value={relevantForm.filingDate}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>

                //     <Row>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="assignee">Assignee(s)</Label>
                //                 <Input
                //                     type="text"
                //                     id="assignee"
                //                     className="form-control"
                //                     placeholder="Enter Assignees: Comma(,) Separated Values"
                //                     value={relevantForm.assignee}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="grantDate">Grant/Publication Date</Label>
                //                 <Input
                //                     type="text"
                //                     id="grantDate"
                //                     className="form-control"
                //                     placeholder="dd-mm-yyyy"
                //                     value={relevantForm.grantDate}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>

                //     <Row>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="inventors">Inventor(s)</Label>
                //                 <Input
                //                     type="text"
                //                     id="inventors"
                //                     className="form-control"
                //                     placeholder="Enter Inventors: Semicolon(;) Separated Values"
                //                     value={relevantForm.inventors}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="priorityDate">Priority Date (Optional)</Label>
                //                 <Input
                //                     type="text"
                //                     id="priorityDate"
                //                     className="form-control"
                //                     placeholder="dd-mm-yyyy"
                //                     value={relevantForm.priorityDate}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>

                //     <Row>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="classifications">IPC/CPC Classification</Label>
                //                 <Input
                //                     type="text"
                //                     id="classifications"
                //                     className="form-control"
                //                     placeholder="Enter IPC/CPC Classification: Comma(,) Separated Values"
                //                     value={relevantForm.classifications}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //         <Col lg="6">
                //             <div className="mb-3">
                //                 <Label for="usClassification">US Classification (Optional)</Label>
                //                 <Input
                //                     type="text"
                //                     id="usClassification"
                //                     className="form-control"
                //                     placeholder="Enter US Classification: Comma(,) Separated Values"
                //                     value={relevantForm.usClassification}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>


                //     {/* <Row>
                //           <Col lg="12">
                //             <div className="mb-3">
                //                 <Label for="cpc-classifications">Classification (CPC)</Label>
                //                 <Input
                //                     type="text"
                //                     id="cpc-classifications"
                //                     className="form-control"
                //                     placeholder="Enter CPC Classification: Comma(,) Separated Values"
                //                     value={relevantForm.classifications}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row> */}

                //     <Row>
                //         <Col lg="12">
                //             <div className="mb-3">
                //                 <Label for="familyMembers">Family Member(s)</Label>
                                // <textarea
                                //     id="familyMembers"
                                //     className="form-control"
                                //     rows="3"
                                //     placeholder="Enter Family Members: Comma(,) Separated Values"
                                //     value={relevantForm.familyMembers}
                                //     onChange={handleRelevatFormInputChange}
                                // />
                //             </div>
                //         </Col>
                //     </Row>
                //     <Row>
                //         <Col lg="12">
                //             <div className="mb-3">
                //                 <Label for="analystComments">Analyst Comments</Label>
                //                 <textarea
                //                     id="analystComments"
                //                     className="form-control"
                //                     rows="3"
                //                     placeholder="Enter Comments"
                //                     value={relevantForm.analystComments}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>
                //     <Row>
                //         <Col lg="12">
                //             <div className="mb-3">
                //                 <Label for="relevantExcerpts">Relevant Excerpts</Label>
                //                 <textarea
                //                     id="relevantExcerpts"
                //                     className="form-control"
                //                     rows="3"
                //                     placeholder="Enter Relevant Excerpts"
                //                     value={relevantForm.relevantExcerpts}
                //                     onChange={handleRelevatFormInputChange}
                //                 />
                //             </div>
                //         </Col>
                //     </Row>

                //     <Row>
                //         <Col lg="2">
                //             <div className="mb-3">
                //                 <Button color="info" type="submit" className="w-100">+ Add Relevant</Button>
                //             </div>
                //         </Col>
                //         <Col>
                //             <SavedSuccess show={relevantRefSaved} message="Relevant Reference Saved!" />
                //         </Col>
                //     </Row>
                // </Form>