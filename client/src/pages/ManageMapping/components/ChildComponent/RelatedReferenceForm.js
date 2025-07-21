import React from "react";
import { Row, Col, Label, Input, Button, Form, Spinner } from "reactstrap";

const RelatedReferenceForm = ({
    relatedLoading,
    relatedForm,
    handleRelatedSubmit,
    handleRelatedInputChange,
    handleClearInputFields,
    handleRelatedFetchPatentData,
    patentSlice
}) => {
    return (
        <>
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
                                {relatedForm.publicationNumber && patentSlice.relatedApiTrue ? (
                                    <Button
                                        color="danger"
                                        onClick={handleClearInputFields}
                                        className="w-100"
                                    >
                                        Clear
                                    </Button>
                                ) : (
                                    <Button color="success" onClick={() => handleRelatedFetchPatentData(relatedForm.publicationNumber) } className="w-100"> Submit</Button>
                                )}
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="related-relatedPublicationUrl">
                                    Publication Number (URL)
                                </Label>
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
                                <Label for="related-assigneeOrInventor">
                                    Assignee(s) / Inventor(s)
                                </Label>
                                <Input
                                    type="text"
                                    id="related-assigneeOrInventor"
                                    className="form-control"
                                    placeholder="Enter Assignees/Inventors"
                                    value={relatedForm.relatedAssignee || relatedForm.relatedInventor}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="align-items-end">
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

                        <Col lg="3">
                            <div className="mb-3">
                                <Label for="related-relatedPriorityDate">Priority Date</Label>
                                <Input
                                    type="text"
                                    id="related-relatedPriorityDate"
                                    className="form-control"
                                    placeholder="dd-mm-yyyy"
                                    value={relatedForm.relatedPriorityDate}
                                    onChange={handleRelatedInputChange}
                                />
                            </div>
                        </Col>

                        <Col lg="3">
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
                        </Col>

                        <Col lg="auto">
                            <div className="mb-3">
                                <Button color="info" type="submit" className="mt-2">
                                    + Add Related
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
};

export default RelatedReferenceForm;
