import React from "react";
import { Row, Col, Label, Input, Button } from "reactstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";


const IntroductionTab = ({
    projectFormData,
    introduction,
    handleProjectChange,
    handleIntroSave,
    id,
    reportData,
}) => {
    const validID = reportData[0]?._id === id;

    return (
        <>
            {validID && (
                <>
                    <Row>
                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="project-title-input">Project Title</Label>
                                <Input
                                    type="text"
                                    name="projectTitle"
                                    className="form-control"
                                    id="project-title-input"
                                    placeholder="Enter Project Title"
                                    value={projectFormData.projectTitle || ""}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </Col>

                        <Col lg="6">
                            <div className="mb-3">
                                <Label for="project-subtitle-input">Project Sub Title</Label>
                                <Input
                                    type="text"
                                    name="projectSubTitle"
                                    className="form-control"
                                    id="project-subtitle-input"
                                    placeholder="Enter Project Sub Title"
                                    value={projectFormData.projectSubTitle || ""}
                                    onChange={handleProjectChange}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                      
                    </Row>


                    <p className="text-danger">
                        ⚠️ Please click the <strong>Save</strong> button before clicking <strong>Next</strong>. Unsaved changes will be lost.
                    </p>

                    <Col lg="2">
                        <div className="mb-3">
                            <Button color="success" onClick={handleIntroSave} className="w-100">
                                Save
                            </Button>
                        </div>
                    </Col>
                </>
            )}
        </>
    );
};

export default IntroductionTab;
