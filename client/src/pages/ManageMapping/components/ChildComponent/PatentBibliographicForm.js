import React from "react";
import { Row, Col, Input, Label, Button, Form } from "reactstrap";
import SavedSuccess from "../../../../components/Common/SavedSuccess";

const PatentBibliographicForm = ({
    formState,
    onInputChange,
    onSubmit,
    onClear,
    onFetch,
    showSaved,
    handleValidationError,
    relevantApiTrue
}) => {

    const filteredCPC = (formState?.cpcClassifications || []).filter(
        cpc => !(formState?.ipcClassifications || []).includes(cpc)
    );


    return (
        <Form onSubmit={onSubmit}>
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
                            placeholder={handleValidationError ? "Please check the Patent Number" : "Enter Publication Number"}
                            value={formState.patentNumber}
                            onChange={(e) => {
                                onInputChange(e);
                                handleValidationError(false);
                            }}
                        />
                    </div>
                </Col>
                <Col className="d-grid align-items-end">
                    <div className="mb-3">
                        {formState.patentNumber && relevantApiTrue ? (
                            <Button color="danger" onClick={onClear} className="w-100">Clear</Button>
                        ) : (
                            <Button color="success" onClick={onFetch} className="w-100">Submit</Button>
                        )}
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
                            value={formState.publicationUrl}
                            onChange={onInputChange}
                        />
                    </div>
                </Col>
            </Row>

            {[
                { id: "title", label: "Title" },
                { id: "filingDate", label: "Filing/Application Date (Optional)", placeholder: "dd-mm-yyyy" },
                { id: "assignee", label: "Assignee(s)", placeholder: "Comma(,) Separated" },
                { id: "grantDate", label: "Grant/Publication Date", placeholder: "dd-mm-yyyy" },
                { id: "inventors", label: "Inventor(s)", placeholder: "Semicolon(;) Separated" },
                { id: "priorityDate", label: "Priority Date (Optional)", placeholder: "dd-mm-yyyy" },
                { id: "ipcClassifications", label: "Classification(IPC)", placeholder: "Comma(,) Separated" },
                { id: "usClassification", label: "US Classification (Optional)", placeholder: "Comma(,) Separated" },
            ].reduce((acc, curr, index, arr) => {
                if (index % 2 === 0) acc.push(arr.slice(index, index + 2));
                return acc;
            }, []).map((pair, rowIndex) => (
                <Row key={rowIndex}>
                    {pair.map((field) => (
                        <Col lg="6" key={field.id}>
                            <div className="mb-3">
                                <Label for={field.id}>{field.label}</Label>
                                <Input
                                    type="text"
                                    id={field.id}
                                    className="form-control"
                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                    value={formState[field.id]}
                                    onChange={onInputChange}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>
            ))}


            {[
                { id: "cpcClassifications", label: "Classification(CPC)", placeholder: "Comma(,) Separated", rows: 2 },
                {
                    id: "familyMembers",
                    label: "Family Member(s)",
                    placeholder: "Enter Family Members: Comma(,) Separated Values",
                    rows: 3,
                },
                {
                    id: "analystComments",
                    label: "Analyst Comments",
                    placeholder: "Enter Comments",
                    rows: 3,
                },
                {
                    id: "relevantExcerpts",
                    label: "Relevant Excerpts",
                    placeholder: "Enter Relevant Excerpts",
                    rows: 3,
                },
            ].map((field) => (
                <Row key={field.id}>
                    <Col lg="12">
                        <div className="mb-3">
                            <Label for={field.id}>{field.label}</Label>
                            <textarea
                                id={field.id}
                                className="form-control"
                                rows={field.rows}
                                placeholder={field.placeholder}
                                value={formState[field.id]}
                                onChange={onInputChange}
                            />
                        </div>
                    </Col>
                </Row>
            ))}


            <Row>
                <Col lg="2">
                    <div className="mb-3">
                        <Button color="info" type="submit" className="w-100">+ Add Relevant</Button>
                    </div>
                </Col>
                <Col>
                    <SavedSuccess show={showSaved} message="Relevant Reference Saved!" />
                </Col>
            </Row>
        </Form>
    );
};

export default PatentBibliographicForm;
