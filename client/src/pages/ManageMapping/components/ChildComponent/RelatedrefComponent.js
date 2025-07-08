import React, { useMemo } from "react";
import { Row, Col, Button, Label, Input, Form, Spinner, } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { isEmptyArray } from "formik";
import { Link } from "react-router-dom";


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
}) => {

    const relatedAssigneeOrIntentor = (relatedForm.relatedAssignee && relatedForm.relatedAssignee) ?
        `${relatedForm.relatedAssignee} / ${relatedForm.relatedAssignee}` : "";


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


            

    return (
        <>
            <h4 className="fw-bold mb-3">Related References</h4>
            <p className="text-muted mb-4">
                <i><strong>Note:</strong> Below references are listed as related references as these references fail to disclose at least one or more features of the objective.</i>
            </p>

            {relatedLoading ? (
                <div className="blur-loading-overlay text-center mt-4">
                    <Spinner color="primary" />
                    <p className="mt-2 text-primary">Loading Related References...</p>
                </div>
            ) : (
                <Form onSubmit={handleRelatedSubmit} className="mb-4">
                    <Row>
                        <Col lg="4">
                            <div className="mb-3">
                                <Label for="related-publicationNumber">Publication Number</Label>
                                <Input
                                    type="text"
                                    id="related-publicationNumber"
                                    className="form-control"
                                    placeholder="Enter Publication Number"
                                    value={relatedForm.publicationNumber}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="2 d-grid align-items-end">
                            <div className="mb-3">
                                <Button color="success" className="w-100" onClick={handleRelatedFetchPatentData}>
                                    Submit
                                </Button>
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-relatedPublicationUrl">Publication Number (URL)</Label>
                                <Input
                                    type="text"
                                    id="related-relatedPublicationUrl"
                                    className="form-control"
                                    placeholder="Enter Publication Number URL"
                                    value={relatedForm.relatedPublicationUrl}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-relatedTitle">Title</Label>
                                <Input
                                    type="text"
                                    id="related-relatedTitle"
                                    className="form-control"
                                    placeholder="Enter Title"
                                    value={relatedForm.relatedTitle}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-assigneeOrInventor">Assignee(s) / Inventor(s)</Label>
                                <Input
                                    type="text"
                                    id="related-assigneeOrInventor"
                                    className="form-control"
                                    placeholder="Enter Assignees/Inventors"
                                    value={relatedAssigneeOrIntentor}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-relatedFamilyMembers">Family Member(s)</Label>
                                <textarea
                                    id="related-relatedFamilyMembers"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Family Members"
                                    value={relatedForm.relatedFamilyMembers}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-relatedPublicationDate">Publication Date</Label>
                                <Input
                                    type="text"
                                    id="related-relatedPublicationDate"
                                    className="form-control"
                                    placeholder="dd-mm-yyyy"
                                    value={relatedForm.relatedPublicationDate}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                            <div className="">
                                <Button color="info" type="submit" className="w-100">+ Add Related</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            )}


            {
                !isEmptyArray(relatedFormData) && (
                    <TableContainer
                        columns={relatedColumns}
                        data={relatedFormData || []}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"

                    />
                )
            }

        </>
    );
};

export default RelatedRefComponent;

