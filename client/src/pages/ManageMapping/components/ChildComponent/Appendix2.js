import React from "react";
import { Row, Col, Label, Button } from "reactstrap";
import SavedSuccess from "../../../../components/Common/SavedSuccess";
import { useSelector } from "react-redux";

const Appendix2 = ({
    appendix2Patents,
    appendix2PatentsSaved,
    setAppendix2Patents,
    handleSaveAppendix2Patents,
    appendix2NPL,
    setAppendix2NPL,
    appendix2NPLSaved,
    handleSaveAppendix2NPL,

}) => {

    const singleProject = useSelector(state => state.patentSlice.singleProject);

    return (
        <>
            <h4 className="fw-bold mb-3">{singleProject.projectTypeId === "0002" ? "Appendix" : "Appendix 2"} (Databases)</h4>

            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="appendix2-patents">Patents</Label>
                        <textarea
                            id="appendix2-patents"
                            className="form-control"
                            rows="4"
                            placeholder="Enter relevant patent references or notes here"
                            value={appendix2Patents || ""}
                            onChange={(e) => setAppendix2Patents(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="2">
                    <div className="mb-3">
                        <Button
                            color="warning"
                            className="w-100"
                            onClick={handleSaveAppendix2Patents}
                        >
                            Save Summary
                        </Button>
                    </div>
                </Col>

                <Col>
                    <SavedSuccess show={appendix2PatentsSaved} />
                </Col>

            </Row>

            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="appendix2-npl">Non-Patent Literature</Label>
                        <textarea
                            id="appendix2-npl"
                            className="form-control"
                            rows="4"
                            placeholder="Enter non-patent literature references or notes here"
                            value={appendix2NPL || ""}
                            onChange={(e) => setAppendix2NPL(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg="2">
                    <div className="mb-3">
                        <Button
                            color="warning"
                            className="w-100"
                            onClick={handleSaveAppendix2NPL}
                        >
                            Save Summary
                        </Button>
                    </div>
                </Col>
                <Col>
                    <SavedSuccess show={appendix2NPLSaved} />
                </Col>
            </Row>

        </>
    );
};

export default Appendix2;
