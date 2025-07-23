import React from "react";
import { Form, Row, Col, Label, Input, Button } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";

const NonPatentLiteratureForm = ({
    nplPatentFormData,
    handleNplChange,
    handleNplSubmit,
    nonPatentFormData,
    nplColumns
}) => {
    const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0;

    return (
        <>
            <h4 className="mt-5 fw-bold mb-4">Non-Patent Literatures (NPL)</h4>
            <Form onSubmit={handleNplSubmit}>
                <Row>
                    <Col lg="4">
                        <div className="mb-3">
                            <Label for="npl-title">Title / Product Name</Label>
                            <Input
                                type="text"
                                id="npl-nplTitle"
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
            )}
        </>
    );
};

export default NonPatentLiteratureForm;
