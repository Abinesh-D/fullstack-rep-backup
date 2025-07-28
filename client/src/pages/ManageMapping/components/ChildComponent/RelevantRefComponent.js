import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Button, Label, Input, Form, Spinner } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { Link } from "react-router-dom";
import { isEmptyArray } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setRelevantApiTrue } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import FeedbackModal from "../../ReusableComponents/FeedbackModal";
import NonPatentLiteratureForm from "./NonPatentLiteratureForm";
import DraggableTable from "../../../../components/Common/commonReport/DraggableTable";
import RelevantReferenceOffCanvas from '../../../../components/Common/commonReport/RelevantReferenceOffCanvas';
import axios from "axios";

const RelevantRefComponent = ({
    loading,
    relevantForm,
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
    overallSummarrySavedData,
    setOverallSummary,
    handleOverAllSummarySave,
    relevantFormData,
    onDeleteClick,
    handleRelevatFormInputChange,
    resetRelevantForm,
    setrelevantFormData,
}) => {


    const nonPatentModified = nonPatentFormData.map((item, index) => ({
        patentNumber: item.nplTitle,
        publicationUrl: item.url,
        analystComments: item.comments,
        filingDate: item.nplPublicationDate,
        _id: item._id,
        nplId: true,
    }));

    const combinedDataValue = useMemo(() => {
        return [...relevantFormData, ...nonPatentModified];
    }, [relevantFormData, nonPatentModified]);


    const patentSlice = useSelector(state => state.patentSlice);
    const dispatch = useDispatch();

    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const [tableData, setTableData] = useState([]);
    const [relevantAndNplUpdatedData, setRelevantAndNplUpdatedData] = useState([]);
    console.log('relevantAndNplUpdatedData', relevantAndNplUpdatedData)

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);


    const handleRelevantAndNplCombinedSubmit = async (e) => {
        e.preventDefault();
        console.log('tableData', tableData)
        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-relevantandnpl-data/${patentSlice.singleProject._id}`, { tableData },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                const updatedDetails = response.data.stages.relevantReferences.relevantAndNplCombined;
                console.log('updatedDetails', updatedDetails)
                setRelevantAndNplUpdatedData(updatedDetails);
            }

        } catch (error) {
            console.error("❌ Error saving publication detail:", error);
        }
    };



    useEffect(() => {
        setTableData(combinedDataValue || []);
    }, [relevantFormData]);

    // useEffect(() => {
    //     setTableData(relevantAndNplUpdatedData || combinedDataValue)
    // }, [])



    const columns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Publication Number",
            accessorKey: "patentNumber",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Publication Date",
            accessorKey: "filingDate",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Grant Date",
            accessorKey: "grantDate",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Priority Date",
            accessorKey: "priorityDate",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <Link
                            to="#"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Delete Publication"
                            onClick={() => onDeleteClick(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [relevantFormData]);


    const nplColumns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serialnumber",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Title / Product Name",
            accessorKey: "nplTitle",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "PublicationDate",
            accessorKey: "nplPublicationDate",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Actions",
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <Link
                            to="#"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Delete Non-Patent"
                            onClick={() => onNplDeleteClick(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [nonPatentFormData]);

    const handleClearInputFields = () => {
        resetRelevantForm();
        dispatch(setRelevantApiTrue(false));
    };



    return (
        <>
            <Row className="align-items-center mb-4">
                <Col className="d-flex align-items-center">
                    <h4 className="fw-bold m-0">Publication Details</h4>
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
                <Form onSubmit={handleRelevantSubmit}>
                    <Row>
                        <p className="text-info">
                            ℹ️ Enter the <strong>Patent Number</strong> and click <strong>Submit</strong> to auto fetch bibliographic info.
                        </p>
                        <Col lg="4">
                            <div className="mb-3">
                                <Label for="patentNumber">Publication Number</Label>
                                <Input
                                    type="text"
                                    id="patentNumber"
                                    className="form-control"
                                    placeholder={errorValidation ? "Please check the Patent Number" : "Enter Publication Number"}
                                    value={relevantForm.patentNumber}
                                    onChange={(e) => {
                                        handleRelevatFormInputChange(e);
                                        setErrorValidation(false);
                                    }}
                                    style={{ border: errorValidation ? '1px solid red' : '' }}
                                />
                            </div>
                        </Col>
                        <Col className="d-grid align-items-end">
                            <div className="mb-3">
                                {
                                    relevantForm.patentNumber && patentSlice.relevantApiTrue ? (
                                        <Button color="danger" onClick={handleClearInputFields} className="w-100">Clear</Button>
                                    ) : (
                                        <Button color="success" onClick={handleFetchPatentData} className="w-100">Submit</Button>
                                    )
                                }
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="publicationUrl">Publication Number (URL)</Label>
                                <Input
                                    type="text"
                                    id="publicationUrl"
                                    className="form-control"
                                    placeholder="Enter Publication Number URL"
                                    value={relevantForm.publicationUrl}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="title">Title</Label>
                                <Input
                                    type="text"
                                    id="title"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    value={relevantForm.title}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="filingDate">Filing/Application Date (Optional)</Label>
                                <Input
                                    type="text"
                                    id="filingDate"
                                    className="form-control"
                                    placeholder="dd-mm-yyyy"
                                    value={relevantForm.filingDate}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="assignee">Assignee(s)</Label>
                                <Input
                                    type="text"
                                    id="assignee"
                                    className="form-control"
                                    placeholder="Enter Assignees: Comma(,) Separated Values"
                                    value={relevantForm.assignee}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="grantDate">Grant/Publication Date</Label>
                                <Input
                                    type="text"
                                    id="grantDate"
                                    className="form-control"
                                    placeholder="dd-mm-yyyy"
                                    value={relevantForm.grantDate}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="inventors">Inventor(s)</Label>
                                <Input
                                    type="text"
                                    id="inventors"
                                    className="form-control"
                                    placeholder="Enter Inventors: Semicolon(;) Separated Values"
                                    value={relevantForm.inventors}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="priorityDate">Priority Date (Optional)</Label>
                                <Input
                                    type="text"
                                    id="priorityDate"
                                    className="form-control"
                                    placeholder="dd-mm-yyyy"
                                    value={relevantForm.priorityDate}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="classifications">IPC/CPC Classification</Label>
                                <Input
                                    type="text"
                                    id="classifications"
                                    className="form-control"
                                    placeholder="Enter IPC/CPC Classification: Comma(,) Separated Values"
                                    value={relevantForm.classifications}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="usClassification">US Classification (Optional)</Label>
                                <Input
                                    type="text"
                                    id="usClassification"
                                    className="form-control"
                                    placeholder="Enter US Classification: Comma(,) Separated Values"
                                    value={relevantForm.usClassification}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="familyMembers">Family Member(s)</Label>
                                <textarea
                                    id="familyMembers"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Family Members: Comma(,) Separated Values"
                                    value={relevantForm.familyMembers}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="analystComments">Analyst Comments</Label>
                                <textarea
                                    id="analystComments"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Comments"
                                    value={relevantForm.analystComments}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="relevantExcerpts">Relevant Excerpts</Label>
                                <textarea
                                    id="relevantExcerpts"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Relevant Excerpts"
                                    value={relevantForm.relevantExcerpts}
                                    onChange={handleRelevatFormInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="2">
                            <div className="mb-3">
                                <Button color="info" type="submit" className="w-100">+ Add Relevant</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
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


                // <DraggableTable
                //     data={tableData}
                //     setData={setTableData}
                //     columns={columns}
                // />
            )}


            {patentSlice.singleProject.projectTypeId === "0002" && (
                <NonPatentLiteratureForm
                    nplPatentFormData={nplPatentFormData}
                    handleNplChange={handleNplChange}
                    handleNplSubmit={handleNplSubmit}
                    nonPatentFormData={nonPatentFormData}
                    nplColumns={nplColumns}
                />)
            }

            <div style={{
                borderTop: '1px solid #343a40',
                borderBottom: '1px solid #343a40',
                padding: '10px',
            }}>
                <Button color="primary" onClick={toggleCanvas}>
                    View Relevant & Npl References
                </Button>

                <RelevantReferenceOffCanvas
                    isOpen={isCanvasOpen}
                    toggle={toggleCanvas}
                    data={tableData}
                    setTableData={setTableData}
                    columns={columns}
                    handleUpdate={handleRelevantAndNplCombinedSubmit}
                />
            </div>

            {/* <h4 className="mt-5 fw-bold mb-4">2. Non-Patent Literatures(NPL)</h4>
            <Form onSubmit={handleNplSubmit}>
                <Row>
                    <Col lg="4">
                        <div className="mb-3">
                            <Label for="npl-title">Title / Product Name</Label>
                            <Input
                                type="text"
                                id="npl-nplTitle"
                                className="form-control"
                                placeholder="Enter Title / Product Name"
                                value={nplPatentFormData.nplTitle}
                                onChange={handleNplChange}
                            />
                        </div>
                    </Col>

                    <Col lg="4">
                        <div className="mb-3">
                            <Label for="npl-url">URL</Label>
                            <Input
                                type="text"
                                id="npl-url"
                                className="form-control"
                                placeholder="Enter NPL URL"
                                value={nplPatentFormData.url}
                                onChange={handleNplChange}
                            />
                        </div>
                    </Col>

                    <Col lg="4">
                        <div className="mb-3">
                            <Label for="npl-pub-date">Publication Date</Label>
                            <Input
                                type="text"
                                id="npl-nplPublicationDate"
                                className="form-control"
                                placeholder="dd-mm-yyyy"
                                value={nplPatentFormData.nplPublicationDate}
                                onChange={handleNplChange}
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg="6">
                        <div className="mb-3">
                            <Label for="npl-comments">Analyst Comments</Label>
                            <textarea
                                id="npl-comments"
                                className="form-control"
                                rows="3"
                                placeholder="Enter Comments"
                                value={nplPatentFormData.comments}
                                onChange={handleNplChange}
                            />
                        </div>
                    </Col>

                    <Col lg="6">
                        <div className="mb-3">
                            <Label for="npl-excerpts">Relevant Excerpts</Label>
                            <textarea
                                id="npl-excerpts"
                                className="form-control"
                                rows="3"
                                placeholder="Enter Relevant Excerpts"
                                value={nplPatentFormData.excerpts}
                                onChange={handleNplChange}
                            />
                        </div>
                    </Col>
                </Row>
                <Col lg="2">
                    <div className="mb-3">
                        <Button color="info" className="w-100" type="submit">
                            + Non-Patent Literature
                        </Button>
                    </div>
                </Col>
            </Form>


            {!isEmptyArray(nonPatentFormData) && (
                <TableContainer
                    columns={nplColumns}
                    data={nonPatentFormData || []}
                     isPagination={true}
                        isCustomPageSize={true}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                />
            )} */}



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
            <Col lg="2">
                <div className="mb-3">
                    <Button onClick={handleOverAllSummarySave} color="warning" className="w-100">
                        Save Summary
                    </Button>
                </div>
            </Col>
        </>
    );
};

export default RelevantRefComponent;