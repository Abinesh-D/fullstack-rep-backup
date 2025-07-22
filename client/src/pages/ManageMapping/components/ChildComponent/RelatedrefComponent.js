import React, { useMemo, useState } from "react";
import { Row, Col, Button, Card, Nav, NavLink, NavItem, TabContent, TabPane } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { isEmptyArray } from "formik";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setRelatedApiTrue, fetchBulkESPData } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import FeedbackModal from "../../ReusableComponents/FeedbackModal";
import ExcelPatentUploader from "../../../ManageBulkUpload/Components/BulkPatentExcel";
import classnames from "classnames";
import RelatedReferenceForm from "./RelatedReferenceForm";



const RelatedRefComponent = ({
    relatedLoading,
    relatedForm,
    handleRelatedSubmit,
    handleRelatedFetchPatentData,
    handleRelatedInputChange,
    relatedFormData,
    onRelatedDelete,
    setRelatedErrorValidation,
    relatedErrorValidation,
    resetRelatedForm,
    setRelatedFormData,
}) => {

    const patentSlice = useSelector(state => state.patentSlice);
    const dispatch = useDispatch();
    const [feedbackOpen, setFeedbackOpen] = useState(false);


    const relatedAssigneeOrIntentor = (relatedForm.relatedAssignee && relatedForm.relatedInventor) ?
        `${relatedForm.relatedAssignee} / ${relatedForm.relatedInventor}` : "";


    const relatedColumns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Publication Number",
            accessorKey: "publicationNumber",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Priority Date",
            accessorKey: "relatedPriorityDate",
            enableColumnFilter: false,
            enableSorting: true,
        },
        {
            header: "Publication Date",
            accessorKey: "relatedPublicationDate",
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
                            onClick={() => onRelatedDelete(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [relatedFormData]);



    // const handleBulkRelatedApiPatentData = async (patentNumbers) => {
    //     try {
    //         const ptnNumbers = patentNumbers.split(",").map(s => s.trim()).join(",")
    //         //   setLoading(true);
    //         fetchBulkESPData(ptnNumbers, dispatch, "related");
    //     } catch (error) {
    //         console.error("❌ Error fetching data:", error);
    //     } finally {
    //         //   setLoading(false);
    //         //   setSubmitDisable(true);
    //     }
    // };






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
                                            <span className="d-none d-sm-block">Excel Upload</span>
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={classnames({ active: activeTab === "3" })}
                                            onClick={() => toggleTab("3")}
                                        >
                                            <span className="d-none d-sm-block">Add Multi Patents</span>
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <TabContent activeTab={activeTab} className="p-3">
                                    <TabPane tabId="1">
                                        <RelatedReferenceForm
                                            relatedLoading={relatedLoading}
                                            relatedForm={relatedForm}
                                            handleRelatedSubmit={handleRelatedSubmit}
                                            handleRelatedInputChange={handleRelatedInputChange}
                                            handleClearInputFields={handleClearInputFields}
                                            handleRelatedFetchPatentData={handleRelatedFetchPatentData}
                                            patentSlice={patentSlice}
                                        />
                                    </TabPane>

                                    <TabPane tabId="2">
                                        {
                                            <ExcelPatentUploader setRelatedFormData={setRelatedFormData} />
                                        }
                                    </TabPane>
                                    <TabPane tabId="3">
                                        <p>Coming Soon</p>
                                    </TabPane>
                                </TabContent>
                            </>
                        </Card>
                    </Col>
                </Row>
            </div>

            

            

          


            {
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
            }

        </>
    );
};

export default RelatedRefComponent;


