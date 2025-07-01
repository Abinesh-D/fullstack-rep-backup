import React, { useState } from "react";
import { Card, CardBody, Col, Container, Form, Input, Label, NavItem, NavLink, Row, TabContent, TabPane, Button } from "reactstrap";
import classnames from "classnames";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../../components/Common/Breadcrumb";

const MappingProjectCreation = () => {

    //meta title

    document.title = "Project Form | MCRPL";

    const [activeTab, setactiveTab] = useState(1)

    const [passedSteps, setPassedSteps] = useState([1])

    function toggleTab(tab) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab]
            if (tab >= 1 && tab <= 5) {
                setactiveTab(tab)
                setPassedSteps(modifiedSteps)
            }
        }
    }



    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Breadcrumbs title="Creating Mapping Project" breadcrumbItem="Form Wizard" />
                    <Row >
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <h4 className="card-title mb-4">Project Creation</h4>
                                    <div className="wizard clearfix">
                                        <div className="steps clearfix">
                                            <ul>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 1 })}
                                                >
                                                    <NavLink
                                                        className={classnames({ current: activeTab === 1 })}
                                                        onClick={() => {
                                                            setactiveTab(1)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(1)}>
                                                        <span className="number">1.</span> Introduction
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 2 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 2 })}
                                                        onClick={() => {
                                                            setactiveTab(2)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(2)}>
                                                        <span className="number">2.</span> Relevant Ref
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 3 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 3 })}
                                                        onClick={() => {
                                                            setactiveTab(3)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(3)}>
                                                        <span className="number">3.</span> Related Ref
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 4 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 4 })}
                                                        onClick={() => {
                                                            setactiveTab(4)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(4)}>
                                                        <span className="number">4.</span> Appendix 1
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem
                                                    className={classnames({ current: activeTab === 5 })}>
                                                    <NavLink
                                                        className={classnames({ active: activeTab === 5 })}
                                                        onClick={() => {
                                                            setactiveTab(5)
                                                        }}
                                                        disabled={!(passedSteps || []).includes(5)}
                                                    >
                                                        <span className="number">5.</span> Appendix 2
                                                    </NavLink>
                                                </NavItem>

                                            </ul>
                                        </div>

                                        <div className="content clearfix">
                                            <TabContent activeTab={activeTab} className="body">
                                                
                                                <TabPane tabId={1}>
                                                    <Row>
                                                        <Col lg="6">
                                                            <div className="mb-3">
                                                                <Label for="project-title-input">Project Title</Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="project-title-input"
                                                                    placeholder="Enter Project Title"
                                                                />
                                                            </div>
                                                        </Col>

                                                        <Col lg="6">
                                                            <div className="mb-3">
                                                                <Label for="project-subtitle-input">Project Sub Title</Label>
                                                                <Input
                                                                    type="text"
                                                                    className="form-control"
                                                                    id="project-subtitle-input"
                                                                    placeholder="Enter Project Sub Title"
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
                                                                    placeholder="Describe search features here"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>


                                                </TabPane>

                                                <TabPane tabId={2}>
                                                    <h4 className="fw-bold mb-4">1. Publication Details</h4>
                                                    <Form>
                                                        <Row>
                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="publication-number">Publication Number</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="publication-number"
                                                                        className="form-control"
                                                                        placeholder="Enter Publication Number"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col lg="2 d-grid align-items-end">
                                                                <div className="mb-3">
                                                                    <Button color="success" className="w-100">Submit</Button>
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="publication-url">Publication Number (URL)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="publication-url"
                                                                        className="form-control"
                                                                        placeholder="Enter Publication Number URL"
                                                                    />
                                                                </div>
                                                            </Col>

                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="title">Title</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="title"
                                                                        className="form-control"
                                                                        placeholder="Enter Title"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="filing-date">Filing/Application Date (Optional)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="filing-date"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="assignees">Assignee(s)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="assignees"
                                                                        className="form-control"
                                                                        placeholder="Enter Assignees: Comma(,) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="grant-date">Grant/Publication Date</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="grant-date"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="inventors">Inventor(s)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="inventors"
                                                                        className="form-control"
                                                                        placeholder="Enter Inventors: Semicolon(;) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="priority-date">Priority Date (Optional)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="priority-date"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="ipc-cpc">IPC/CPC Classification</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="ipc-cpc"
                                                                        className="form-control"
                                                                        placeholder="Enter IPC/CPC Classification: Comma(,) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="us-classification">US Classification (Optional)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="us-classification"
                                                                        className="form-control"
                                                                        placeholder="Enter US Classification: Comma(,) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="family-members">Family Member(s)</Label>
                                                                    <textarea
                                                                        id="family-members"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Family Members: Comma(,) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="analyst-comments">Analyst Comments</Label>
                                                                    <textarea
                                                                        id="analyst-comments"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Comments"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>

                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="relevant-excerpts">Relevant Excerpts</Label>
                                                                    <textarea
                                                                        id="relevant-excerpts"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Relevant Excerpts"
                                                                    />
                                                                </div>
                                                            </Col>

                                                        </Row>
                                                        <Col lg="2">
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100">+ Add Relevant </Button>
                                                            </div>
                                                        </Col>
                                                    </Form>
                                                    <p>TableContainer for relevant</p>


                                                    <h4 className="fw-bold mb-4">2. Non-Patent Literatures(NPL)</h4>

                                                    <Form>
                                                        <Row>
                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-title">Title / Product Name</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-title"
                                                                        className="form-control"
                                                                        placeholder="Enter Title / Product Name"
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-url">URL</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-url"
                                                                        className="form-control"
                                                                        placeholder="Enter NPL URL"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="npl-pub-date">Publication Date</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="npl-pub-date"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
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
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Col lg="2">
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100">+ Non-Patent Literature </Button>
                                                            </div>
                                                        </Col>
                                                    </Form>

                                                    <p>TableContainer for Npl</p>


                                                    <h4 className="fw-bold mb-4">2. Overall Summary of Search and Prior Arts</h4>
                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="npl-excerpts">Overall Summary</Label>
                                                                <textarea
                                                                    id="npl-excerpts"
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder="Enter Overall Summary"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="warning" className="w-100">Save Summary</Button>
                                                        </div>
                                                    </Col>




                                                </TabPane>

                                                <TabPane tabId={3}>

                                                    <h4 className="fw-bold mb-3">Related References</h4>
                                                    <p className="text-muted mb-4">
                                                        <i> <strong>Note:</strong> Below references are listed as related references as these references fail to disclose at least one or more features of the objective.</i>
                                                    </p>

                                                    <Form>
                                                        <Row>
                                                            <Col lg="4">
                                                                <div className="mb-3">
                                                                    <Label for="related-publication-number">Publication Number</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="related-publication-number"
                                                                        className="form-control"
                                                                        placeholder="Enter Publication Number"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col lg="2 d-grid align-items-end">
                                                                <div className="mb-3">
                                                                    <Button color="success" className="w-100">Submit</Button>
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="related-publication-url">Publication Number (URL)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="related-publication-url"
                                                                        className="form-control"
                                                                        placeholder="Enter Publication Number URL"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="related-title">Title</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="related-title"
                                                                        className="form-control"
                                                                        placeholder="Enter Title"
                                                                    />
                                                                </div>
                                                            </Col>

                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="related-assignee-inventor">Assignee(s) / Inventor(s)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="related-assignee-inventor"
                                                                        className="form-control"
                                                                        placeholder="Enter Assignees/Inventors: Semicolon(;) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="related-family-members">Family Member(s)</Label>
                                                                    <textarea
                                                                        id="related-family-members"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter Family Members: Comma(,) Separated Values"
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col lg="6">
                                                                <div className="mb-3">
                                                                    <Label for="related-pub-date">Publication Date (Optional)</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="related-pub-date"
                                                                        className="form-control"
                                                                        placeholder="dd-mm-yyyy"
                                                                    />
                                                                </div>
                                                                <div className="">
                                                                    <Button color="info" className="w-100">+ Add Realated </Button>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </Form>
                                                    <p>TableContainer for Related</p>

                                                </TabPane>

                                                <TabPane tabId={4}>
                                                    <h4 className="fw-bold mb-3">Appendix 1</h4>
                                                    <p className="text-muted mb-4">
                                                        <i>The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.</i>
                                                    </p>

                                                    <Form>
                                                        <h5 className="fw-semibold">1. Base Search Terms</h5>
                                                        <Row>
                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="base-search-terms">Enter Terms</Label>
                                                                    <textarea
                                                                        id="base-search-terms"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter search terms like: patents, live, alive, etc."
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Col lg={2}>
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100">+ Base Search Terms </Button>
                                                            </div>
                                                        </Col>
                                                        <p>TableContainer for Base Search Terms</p>

                                                        <h5 className="fw-semibold">2. Search Strings</h5>
                                                        <Row>
                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="key-strings">Key Strings</Label>
                                                                    <textarea
                                                                        id="key-strings"
                                                                        className="form-control"
                                                                        rows="3"
                                                                        placeholder="Enter key strings (Orbit, USPTO, PatSeer, Google Patent, Scholar, IEEE, etc.)"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Col lg={2}>
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100">+ Key Strings </Button>
                                                            </div>
                                                        </Col>
                                                        <p>TableContainer for Search Strings</p>


                                                        <h5 className="fw-semibold">3. Data Availability</h5>
                                                        <Row>
                                                            <Col lg="12">
                                                                <div className="mb-3">
                                                                    <Label for="data-availability-value">Value</Label>
                                                                    <Input
                                                                        type="text"
                                                                        id="data-availability-value"
                                                                        className="form-control"
                                                                        placeholder="Enter value"
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                        <Col lg={2}>
                                                            <div className="mb-3">
                                                                <Button color="info" className="w-100">+ Add Value </Button>
                                                            </div>
                                                        </Col>
                                                        <p>TableContainer for Data Availability</p>

                                                    </Form>

                                                </TabPane>

                                                <TabPane tabId={5}>
                                                    <h4 className="fw-bold mb-3">Appendix 2</h4>

                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="appendix2-patents">Patents</Label>
                                                                <textarea
                                                                    id="appendix2-patents"
                                                                    className="form-control"
                                                                    rows="4"
                                                                    placeholder="Enter relevant patent references or notes here"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="warning" className="w-100">Save Summary</Button>
                                                        </div>
                                                    </Col>

                                                    <Row>
                                                        <Col lg="12">
                                                            <div className="mb-3">
                                                                <Label for="appendix2-npl">Non-Patent Literature</Label>
                                                                <textarea
                                                                    id="appendix2-npl"
                                                                    className="form-control"
                                                                    rows="4"
                                                                    placeholder="Enter non-patent literature references or notes here"
                                                                />
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Col lg="2">
                                                        <div className="mb-3">
                                                            <Button color="warning" className="w-100">Save Summary</Button>
                                                        </div>
                                                    </Col>

                                                </TabPane>

                                            </TabContent>
                                        </div>

                                        <div className="actions clearfix">
                                            <ul>
                                                <li
                                                    className={
                                                        activeTab === 1 ? "previous disabled" : "previous"
                                                    }
                                                >
                                                    <Link
                                                        to="#"
                                                        onClick={() => {
                                                            toggleTab(activeTab - 1)
                                                        }}
                                                    >
                                                        Previous
                                                    </Link>
                                                </li>
                                                <li
                                                    className={activeTab === 5 ? "next disabled" : "next"}
                                                >
                                                    <Link
                                                        to="#"
                                                        onClick={() => {
                                                            toggleTab(activeTab + 1)
                                                        }}
                                                    >
                                                        Next
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>

                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default MappingProjectCreation;