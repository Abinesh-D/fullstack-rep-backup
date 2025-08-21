import React, { useMemo, useState, useEffect } from "react";
import { Row, Col, Button, Card, Nav, NavLink, NavItem, TabContent, TabPane, Label, Spinner } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { isEmptyArray } from "formik";
import { useSelector, useDispatch } from "react-redux";
import { setRelatedApiTrue, fetchBulkESPData, saveExcelRelatedReferences } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import FeedbackModal from "../../ReusableComponents/FeedbackModal";
import ExcelPatentUploader from "../../../ManageBulkUpload/Components/BulkPatentExcel";
import classnames from "classnames";
import RelatedReferenceForm from "./RelatedReferenceForm";
import { computeFamId, mappedValue, mapRelatedData } from "../../../ManageBulkUpload/Components/BulkResponseMap";
import { generateTableColumns } from "../../../../components/Common/commonReport/columnUtils";
import axios from "axios";

const RelatedRefComponent = ({
    relatedLoading,
    relatedForm,
    relatedRefSaved,
    handleRelatedSubmit,
    handleRelatedFetchPatentData,
    handleRelatedInputChange,
    relatedFormData,
    onRelatedDelete,
    setRelatedErrorValidation,
    relatedErrorValidation,
    resetRelatedForm,
    setRelatedFormData,

    selectedRows,
    setSelectedRows,


}) => {

    const id = sessionStorage.getItem("_id");

    const patentSlice = useSelector(state => state.patentSlice);
    const dispatch = useDispatch();
    const [feedbackOpen, setFeedbackOpen] = useState(false);

    const [patentNumbers, setPatentNumbers] = useState("");
    const [famId, setfamId] = useState([]);
    const [apiResponseReceived, setApiResponseReceived] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [generateLoading, setGenerateLoading] = useState(false);


    useEffect(() => {
        if (!Array.isArray(patentSlice.multiRelated)) return;

        const famIdResult = computeFamId(patentSlice.multiRelated,);
        setfamId(famIdResult);
    }, [patentSlice.multiRelated]);

    const bulkBiblioApiCall = async (patentNumbers) => {
        try {
            setGenerateLoading(true);
            await fetchBulkESPData(patentNumbers, dispatch, "multiRelated");
            setApiResponseReceived(true);
        } catch (error) {
            console.error("❌ Error fetching data:", error);
        } finally {
            setGenerateLoading(false);
        }
    };

    const handleSubmitPatentNumbers = async () => {
        setSubmitLoading(true);
        try {
            const relatedData = await mapRelatedData(bulkmappedValue);
            const response = await saveExcelRelatedReferences(id, relatedData);
            setRelatedFormData(response);
            setApiResponseReceived(false);
        } catch (error) {
            console.log(error, "error")
        } finally {
            setSubmitLoading(false);
            setPatentNumbers("");
        }
    };


    const handleGenerate = async () => {
        if (!patentNumbers.trim()) return;

        const cleanedArray = patentNumbers
            .split(/[\s,]+/)
            .filter((item) => item.trim() !== "");

        const commaSeparated = cleanedArray.join(", ");
        await bulkBiblioApiCall(commaSeparated);
    };


    const relatedColumns = useMemo(() => {
        return generateTableColumns({
            columnsConfig: [
                { header: "Publication Number", accessorKey: "publicationNumber" },
                // { header: "Priority Date", accessorKey: "relatedPriorityDate" },
                { header: "Assignee", accessorKey: "relatedAssignee" },
                { header: "Title", accessorKey: "relatedTitle" },
                { header: "Publication Date", accessorKey: "relatedPublicationDate" },

            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onRelatedDelete,
            deleteTooltip: "Delete Publication",
            relatedRef: true,
            allRows: relatedFormData,
            selectedRows,
            setSelectedRows,
            isCell: true,

        });
    }, [relatedFormData, selectedRows]);



    // const relatedColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Publication Number",
    //         accessorKey: "publicationNumber",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Priority Date",
    //         accessorKey: "relatedPriorityDate",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Publication Date",
    //         accessorKey: "relatedPublicationDate",
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
    //                         onClick={() => onRelatedDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [relatedFormData]);



    const bulkmappedValue = mappedValue(patentSlice.multiRelated, famId);


    const handleClearInputFields = () => {
        resetRelatedForm();
        dispatch(setRelatedApiTrue(false));
    };

    const [activeTab, setActiveTab] = useState("1");

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };



    return (
        <>
            <Row className="align-items-center mb-2">
                <Col className="d-flex align-items-center">
                    <h4 className="fw-bold m-0">Related References</h4>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button color="warning" onClick={() => setFeedbackOpen(true)} className="d-flex align-items-center">
                        💬 Feedback
                    </Button>
                </Col>
            </Row>
            <p className="text-muted mb-3">
                <i><strong>Note:</strong> Below references are listed as related references as these references fail to disclose at least one or more features of the objective.</i>
            </p>
            {
                <FeedbackModal
                    isOpen={feedbackOpen}
                    toggle={() => setFeedbackOpen(!feedbackOpen)}
                />
            }

            <div>
                <Row className="justify-content-center">
                    <Col xl={12}>
                        <Card className="">
                            <>
                                <Nav pills className="navtab-bg nav-justified my-1">
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({ active: activeTab === "1" })}
                                            onClick={() => toggleTab("1")}
                                        >
                                            <span className="d-none d-sm-block">Add Patents</span>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({ active: activeTab === "2" })}
                                            onClick={() => toggleTab("2")}
                                        >
                                            <span className="d-none d-sm-block">Add Multi Patents</span>
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({ active: activeTab === "3" })}
                                            onClick={() => toggleTab("3")}
                                        >
                                            <span className="d-none d-sm-block">Excel Upload</span>
                                        </NavLink>
                                    </NavItem>

                                </Nav>

                                <TabContent activeTab={activeTab} className="p-3">
                                    <TabPane tabId="1">
                                        <RelatedReferenceForm
                                            relatedLoading={relatedLoading}
                                            relatedForm={relatedForm}
                                            relatedRefSaved={relatedRefSaved}
                                            handleRelatedSubmit={handleRelatedSubmit}
                                            handleRelatedInputChange={handleRelatedInputChange}
                                            handleClearInputFields={handleClearInputFields}
                                            handleRelatedFetchPatentData={handleRelatedFetchPatentData}
                                            patentSlice={patentSlice}
                                        />
                                    </TabPane>

                                    <TabPane tabId="2">
                                        <Row>
                                            <Col lg="12">
                                                <div className="">
                                                    <div>
                                                        <Label
                                                            for="related-patentnumbers"
                                                            className="fw-semibold fs-5 text-secondary mb-2 d-block"
                                                        >
                                                            Enter Patent Numbers
                                                        </Label>
                                                        <textarea
                                                            id="related-patentnumbers"
                                                            className="form-control rounded-2 border-secondary"
                                                            rows="4"
                                                            placeholder={`Example: US1234567A EP2345678B1 JP3456789C
(Paste patent numbers from Excel separated by space or comma)`}
                                                            value={patentNumbers}
                                                            onChange={(e) => setPatentNumbers(e.target.value)}
                                                        />

                                                        {apiResponseReceived ? (
                                                            <div className="mt-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-success btn-md w-100"
                                                                    onClick={handleSubmitPatentNumbers}
                                                                >
                                                                    {submitLoading ? (
                                                                        <>
                                                                            <Spinner size="sm" className="me-2" />
                                                                            Submitting...
                                                                        </>
                                                                    ) : (
                                                                        "Submit"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-end mt-2">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary shadow"
                                                                    onClick={handleGenerate}
                                                                >
                                                                    {generateLoading ? (
                                                                        <>
                                                                            <Spinner size="sm" className="me-2" />
                                                                            Generating...
                                                                        </>
                                                                    ) : (
                                                                        "Generate"
                                                                    )}
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            </Col>

                                        </Row>
                                    </TabPane>

                                    <TabPane tabId="3">
                                        {
                                            <ExcelPatentUploader setRelatedFormData={setRelatedFormData} />
                                        }
                                    </TabPane>

                                </TabContent>
                            </>
                        </Card>
                    </Col>
                </Row>
            </div>

            {/* {
                !isEmptyArray(relatedFormData) && (
                    <TableContainer
                        columns={relatedColumns}
                        data={relatedFormData || []}
                        isPagination={true}
                        isCustomPageSize={true}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                        related={true}
                    />
                )
            } */}

            <div>
                {selectedRows.length > 0 && (
                    <button
                        onClick={onRelatedDelete}
                        className="btn btn-danger mb-2"
                    >
                        Delete Selected ({selectedRows.length})
                    </button>
                )}

                {!isEmptyArray(relatedFormData) && (
                    <TableContainer
                        columns={relatedColumns}
                        data={relatedFormData}
                        isPagination={true}
                        isCustomPageSize={true}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                        related={true}
                    />
                )}
            </div>

        </>
    );
};

export default RelatedRefComponent;


