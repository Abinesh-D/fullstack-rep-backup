import React from "react";
import { Row, Col, Label, Input, Button, Form, Spinner } from "reactstrap";
import SavedSuccess from "../../../../components/Common/SavedSuccess";

const RelatedReferenceForm = ({
    relatedLoading,
    relatedForm,
    relatedRefSaved,
    handleRelatedSubmit,
    handleRelatedInputChange,
    handleClearInputFields,
    handleRelatedFetchPatentData,
    patentSlice
}) => {

    const relatedFormFields = [
        {
            label: "Publication Number",
            id: "publicationNumber",
            type: "text",
            col: 4,
            placeholder: "Enter Publication Number",
        },
        {
            type: "button-group",
            col: 2,
        },
        {
            label: "Publication Number (URL)",
            id: "relatedPublicationUrl",
            type: "text",
            col: 6,
            placeholder: "Enter Publication Number URL",
        },
        {
            label: "Title",
            id: "relatedTitle",
            type: "text",
            col: 6,
            placeholder: "Enter Title",
        },
        {
            label: "Assignee(s) / Inventor(s)",
            id: "relatedAssignee",
            type: "text",
            col: 6,
            placeholder: "Enter Assignees/Inventors",
            fallbackId: "relatedInventor",
        },
        {
            label: "Family Member(s)",
            id: "relatedFamilyMembers",
            type: "textarea",
            col: 6,
            placeholder: "Enter Family Members",
        },
        {
            label: "Priority Date",
            id: "relatedPriorityDate",
            type: "text",
            col: 3,
            placeholder: "dd-mm-yyyy",
            class: "align-items-end"
        },
        {
            label: "Publication Date",
            id: "relatedPublicationDate",
            type: "text",
            col: 3,
            placeholder: "dd-mm-yyyy",
        },
    ];


    const renderField = (field) => {
        if (field.type === "button-group") {
            return (
                <Col lg={field.col} className="d-grid align-items-end" key="button-group">
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
                            <Button
                                color="success"
                                onClick={() => handleRelatedFetchPatentData(relatedForm.publicationNumber)}
                                className="w-100"
                            >
                                Submit
                            </Button>
                        )}
                    </div>
                </Col>
            );
        }

        return (
            <Col lg={field.col} key={field.id}>
                <div className="mb-3">
                    <Label for={`related-${field.id}`}>{field.label}</Label>
                    {field.type === "textarea" ? (
                        <textarea
                            id={`related-${field.id}`}
                            className="form-control"
                            rows="3"
                            placeholder={field.placeholder}
                            value={relatedForm[field.id]}
                            onChange={handleRelatedInputChange}
                        />
                    ) : (
                        <Input
                            type="text"
                            id={`related-${field.id}`}
                            className="form-control"
                            placeholder={field.placeholder}
                            value={
                                field.fallbackId
                                    ? relatedForm[field.id] || relatedForm[field.fallbackId]
                                    : relatedForm[field.id]
                            }
                            onChange={handleRelatedInputChange}
                        />
                    )}
                </div>
            </Col>
        );
    };

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
                        {relatedFormFields.slice(0, 3).map(renderField)}
                    </Row>

                    <Row>
                        {relatedFormFields.slice(3, 5).map(renderField)}
                    </Row>

                    <Row>
                        {relatedFormFields.slice(5).map(renderField)}
                    </Row>

                    <Row className="align-items-center">
                        <Col lg="2">
                            <Button color="info" type="submit" className="w-100">
                                + Add Related
                            </Button>
                        </Col>
                        <Col>
                            <SavedSuccess show={relatedRefSaved} message="Related Reference Saved!" />
                        </Col>
                    </Row>
                </Form>
            )}
        </>
    );
};

export default RelatedReferenceForm;



















// import React from "react";
// import { Row, Col, Label, Input, Button, Form, Spinner } from "reactstrap";
// import SavedSuccess from "../../../../components/Common/SavedSuccess";

// const RelatedReferenceForm = ({
//     relatedLoading,
//     relatedForm,
//     relatedRefSaved,
//     handleRelatedSubmit,
//     handleRelatedInputChange,
//     handleClearInputFields,
//     handleRelatedFetchPatentData,
//     patentSlice
// }) => {
//     return (
//         <>
//             {relatedLoading ? (
//                 <div className="blur-loading-overlay text-center mt-4">
//                     <Spinner color="primary" />
//                     <p className="mt-2 text-primary">Loading Related References...</p>
//                 </div>
//             ) : (
//                 <Form onSubmit={handleRelatedSubmit} className="mb-4">
//                     <Row>
//                         <Col lg="4">
//                             <div className="mb-3">
//                                 <Label for="related-publicationNumber">Publication Number</Label>
//                                 <Input
//                                     type="text"
//                                     id="related-publicationNumber"
//                                     className="form-control"
//                                     placeholder="Enter Publication Number"
//                                     value={relatedForm.publicationNumber}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>

//                         <Col lg="2 d-grid align-items-end">
//                             <div className="mb-3">
//                                 {relatedForm.publicationNumber && patentSlice.relatedApiTrue ? (
//                                     <Button
//                                         color="danger"
//                                         onClick={handleClearInputFields}
//                                         className="w-100"
//                                     >
//                                         Clear
//                                     </Button>
//                                 ) : (
//                                     <Button color="success" onClick={() => handleRelatedFetchPatentData(relatedForm.publicationNumber)} className="w-100"> Submit</Button>
//                                 )}
//                             </div>
//                         </Col>

//                         <Col lg="6">
//                             <div className="mb-3">
//                                 <Label for="related-relatedPublicationUrl">
//                                     Publication Number (URL)
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     id="related-relatedPublicationUrl"
//                                     className="form-control"
//                                     placeholder="Enter Publication Number URL"
//                                     value={relatedForm.relatedPublicationUrl}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>
//                     </Row>

//                     <Row>
//                         <Col lg="6">
//                             <div className="mb-3">
//                                 <Label for="related-relatedTitle">Title</Label>
//                                 <Input
//                                     type="text"
//                                     id="related-relatedTitle"
//                                     className="form-control"
//                                     placeholder="Enter Title"
//                                     value={relatedForm.relatedTitle}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>

//                         <Col lg="6">
//                             <div className="mb-3">
//                                 <Label for="related-assigneeOrInventor">
//                                     Assignee(s) / Inventor(s)
//                                 </Label>
//                                 <Input
//                                     type="text"
//                                     id="related-assigneeOrInventor"
//                                     className="form-control"
//                                     placeholder="Enter Assignees/Inventors"
//                                     value={relatedForm.relatedAssignee || relatedForm.relatedInventor}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>
//                     </Row>

//                     <Row className="align-items-end">
//                         <Col lg="6">
//                             <div className="mb-3">
//                                 <Label for="related-relatedFamilyMembers">Family Member(s)</Label>
//                                 <textarea
//                                     id="related-relatedFamilyMembers"
//                                     className="form-control"
//                                     rows="3"
//                                     placeholder="Enter Family Members"
//                                     value={relatedForm.relatedFamilyMembers}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>

//                         <Col lg="3">
//                             <div className="mb-3">
//                                 <Label for="related-relatedPriorityDate">Priority Date</Label>
//                                 <Input
//                                     type="text"
//                                     id="related-relatedPriorityDate"
//                                     className="form-control"
//                                     placeholder="dd-mm-yyyy"
//                                     value={relatedForm.relatedPriorityDate}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                             </div>
//                         </Col>

//                         <Col lg="3">
//                             <div className="mb-3">
//                                 <Label for="related-relatedPublicationDate">Publication Date</Label>
//                                 <Input
//                                     type="text"
//                                     id="related-relatedPublicationDate"
//                                     className="form-control"
//                                     placeholder="dd-mm-yyyy"
//                                     value={relatedForm.relatedPublicationDate}
//                                     onChange={handleRelatedInputChange}
//                                 />
//                                 </div>
//                             </Col>

                            // <Row className="align-items-center">
                            //     <Col lg="2">
                            //         <Button color="info" type="submit" className="w-100">
                            //             + Add Related
                            //         </Button>
                            //     </Col>
                            //     <Col>
                            //         <SavedSuccess show={relatedRefSaved} message="Related Reference Saved!" />
                            //     </Col>
                            // </Row>
//                     </Row>
//                 </Form>
//             )}
//         </>
//     );
// };

// export default RelatedReferenceForm;
