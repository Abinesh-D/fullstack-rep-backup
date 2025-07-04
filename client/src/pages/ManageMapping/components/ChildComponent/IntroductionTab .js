import React from "react";
import { Row, Col, Label, Input, Button } from "reactstrap";

const IntroductionTab = ({
    projectFormData,
    introduction,
    handleRelevantChange,
    handleIntroSave,
    id,
    reportData,
}) => {

    const valid = introduction.length === 0;

    const validID = reportData[0]?._id === id;

    return (
        <>
            {
                validID && (
                    <>
                        <Row>
                            <Col lg="6">
                                <div className="mb-3">
                                    <Label for="project-title-input">Project Title</Label>
                                    {console.log(introduction[0], "projectFormData.projectTitle", projectFormData)}
                                    <Input
                                        type="text"
                                        name="projectTitle"
                                        className="form-control"
                                        id="project-title-input"
                                        placeholder="Enter Project Title"
                                        value={valid ? projectFormData?.projectTitle : introduction[0]?.projectTitle}
                                        onChange={handleRelevantChange}
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
                                        value={valid ? projectFormData?.projectSubTitle : introduction[0]?.projectSubTitle}
                                        onChange={handleRelevantChange}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col lg="12">
                                <div className="mb-3">
                                    <Label for="search-features-input">Search Features</Label>
                                    <textarea
                                        id="search-features-input"
                                        className="form-control"
                                        rows="3"
                                        name="searchFeatures"
                                        placeholder="Describe search features here"
                                        value={valid ? projectFormData?.searchFeatures : introduction[0]?.searchFeatures}
                                        onChange={handleRelevantChange}
                                    />
                                </div>
                            </Col>
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
                )
            }

        </>
    );
};

export default IntroductionTab;
