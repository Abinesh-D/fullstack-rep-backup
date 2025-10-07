import React, { useMemo, useState, useEffect, useRef } from "react";
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
import NonPatentLiteratureForm from "./NonPatentLiteratureForm";
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomOffCanvas from "../../../../components/Common/commonReport/CustomOffCanvas";
import { normalizeField } from "../../StaticValues/StaticData";



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

    nplPublicationFormData,
    handleNplPublicationChange,
    handleNplSubmit,
    nonPublicationFormData,
    setNplPublicationFormData,
    onNplPublicationDeleteClick,
    relatedAndNplCombined,
    onRelatedAndNplDelete,
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

    const [tableData, setTableData] = useState([]);
    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const toggleCanvas = () => setIsCanvasOpen(!isCanvasOpen);

    const prevRelatedRef = useRef([]);
    const prevNonPatentRef = useRef([]);
    const nonPatentModified = nonPublicationFormData.map((item) => ({
        _id: item._id,
        publicationNumber: item.nplTitle,
        relatedPublicationUrl: item.nplPublicationUrl,
        relatedTitle:  normalizeField(item.excerpts),
        relatedAssignee: [item.url],
        relatedInventor: item.comments,
        relatedFamilyMembers: [],
        relatedPublicationDate: item.nplPublicationDate,
        relatedPriorityDate: "",
        nplId: true,
    }));

    const combinedDataValue = useMemo(() => {
        const currentCombined = [...relatedFormData, ...nonPatentModified];

        const hasChanged = (
            prevRelatedRef.current.length !== relatedFormData.length ||
            prevNonPatentRef.current.length !== nonPatentModified.length ||
            JSON.stringify(prevRelatedRef.current) !== JSON.stringify(relatedFormData) ||
            JSON.stringify(prevNonPatentRef.current) !== JSON.stringify(nonPatentModified)
        );

        if (relatedAndNplCombined?.length > 0 && !hasChanged) {
            return [...relatedAndNplCombined];
        } else {
            return currentCombined;
        }
    }, [relatedFormData, nonPublicationFormData, relatedAndNplCombined]);

    useEffect(() => {
        prevRelatedRef.current = relatedFormData;
        prevNonPatentRef.current = nonPatentModified;
    }, [relatedFormData, nonPublicationFormData]);

    useEffect(() => {
        setTableData(combinedDataValue);
    }, [combinedDataValue]);




    const handleRelatedAndNplCombinedSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/add-relatedandnpl-data/${patentSlice.singleProject._id}`,
                { tableData },
                { headers: { "Content-Type": "application/json" } }
            );
            if (response.status === 200) {
                const updatedDetails = response.data.stages.relatedReferences.relatedAndNplCombined;
                setTableData(updatedDetails);
                toggleCanvas();
                toast.success("Order Saved");
            }

        } catch (error) {
            console.error("❌ Error saving publication detail:", error);
        }
    };





    const nplColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Title / Product Name", accessorKey: "nplTitle" },
                { header: "Source / Author(s)", accessorKey: "url" },
                { header: "Publication Date", accessorKey: "nplPublicationDate" },
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onNplPublicationDeleteClick,
            deleteTooltip: "Delete Non-Patent",
            isCell: true
        })
        , [nonPublicationFormData]);


    const relatedAndNplColumns = useMemo(
        () =>
            generateTableColumns({
                columnsConfig: [
                    { header: "Publication Number / Title", accessorKey: "publicationNumber" },
                    { header: "Publication Date", accessorKey: "relatedPublicationDate" },
                    { header: "Author(s) / Assignee(s)", accessorKey: "relatedAssignee" },
                ],
                includeSerialNo: true,
                includeActions: false,
                onDeleteClick: onRelatedAndNplDelete,
                selectedRows,
                setSelectedRows,
                allRows: relatedFormData,
            }),
        [relatedAndNplCombined, selectedRows]
    );



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
                { header: "Title", accessorKey: "relatedTitle" },
                // { header: "Priority Date", accessorKey: "relatedPriorityDate" },
                { header: "Assignee", accessorKey: "relatedAssignee" },
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



    // const bulkmappedValue = mappedValue(patentSlice.multiRelated, famId);

    const bulkmappedValue = useMemo(
      () => mappedValue(patentSlice.multiRelated, famId),
      [patentSlice.multiRelated, famId]
    );



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
            <div>
                {selectedRows.length > 0 && (
                    <button
                        onClick={onRelatedDelete }
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


            <NonPatentLiteratureForm
                nplPatentFormData={nplPublicationFormData}
                handleNplChange={handleNplPublicationChange}
                handleNplSubmit={handleNplSubmit}
                nonPatentFormData={nonPublicationFormData}
                nplColumns={nplColumns}
                setNplPatentFormData={setNplPublicationFormData}
                relatedTrue={true}
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
                            ⚠️ Don't forget to <strong>Reorder</strong> — otherwise your <strong>Related</strong> and <strong>NPL</strong>
                            reference will not appear in the generated Word report.
                        </div>
                    </Col>
                </Row>
            </>

            <CustomOffCanvas
                isOpen={isCanvasOpen}
                toggle={toggleCanvas}
                title="Related References & NPL"
                subtitle={
                    <>
                        Reorder to assign roll numbers for <strong>Related and NPL References.</strong>
                    </>
                }
                legendItems={[
                    { label: "Related Reference", color: "#fafecf" },
                    { label: "NPL Reference", color: "antiquewhite" },
                    { label: "Dragging", color: "white" },
                ]}
                data={tableData}
                columns={relatedAndNplColumns}
                setTableData={setTableData}
                handleUpdate={handleRelatedAndNplCombinedSubmit}
            />
        </>
    );
};

export default RelatedRefComponent;


