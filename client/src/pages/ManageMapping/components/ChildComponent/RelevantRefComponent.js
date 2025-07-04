import React, {useMemo} from "react";
import { Row, Col, Button, Label, Input, Form, Spinner } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { Link } from "react-router-dom";




const RelevantRefComponent = ({
    loading,
    patentNumber,
    setPatentNumber,
    errorValidation,
    setErrorValidation,
    handleFetchPatentData,
    handleRelevantSubmit,
    title,
    aplDate,
    applicantNames,
    pubDate,
    inventorNames,
    priorityDates,
    classificationsSymbol,
    googleClassCPC,
    usClassification,
    setUsClassification,
    familyMemData,
    analystComments,
    setAnalystComments,
    relevantExcerpts,
    setRelevantExcerpts,
    releventBiblioGoogleData,
    handleNplSubmit,
    handleNplChange,
    nplPatentFormData,
    overallSummary,
    setOverallSummary,
    handleOverAllSummarySave,
    famId,
    relevantFormData,
}) => {

    const mappedData = relevantFormData;

    const columns = useMemo(
        () => [
            {
                header: "S. No.",
                accessorKey: "serial_number",
                cell: ({ row }) => <span>{row.index + 1}</span>,
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Publication Number",
                accessorKey: "patentNumber",
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
                                title="Edit Publication"
                            // onClick={() => handlePublicationEdit(rowData)}
                            >
                                <i className="mdi mdi-pencil text-success font-size-18"></i>
                            </Link>

                            <Link
                                to="#"
                                data-bs-toggle="tooltip"
                                data-bs-placement="top"
                                title="Delete Publication"
                            // onClick={() => handlePublicationDelete(rowData)}
                            >
                                <i className="mdi mdi-delete text-danger font-size-18"></i>
                            </Link>
                        </div>
                    );
                },
            },
        ],
        [mappedData]
    );



    return (
        <>
            <h4 className="fw-bold mb-4">1. Publication Details</h4>
            {loading ? (
                <div className="blur-loading-overlay text-center mt-4">
                    <Spinner color="primary" />
                    <p className="mt-2 text-primary">Loading Relevant References...</p>
                </div>
            ) : (
                <Form onSubmit={handleRelevantSubmit}>
                    <Row>
                        <p className="text-info">
                            ℹ️ Enter the <strong>Patent Number</strong> and click <strong>Submit</strong> to auto fetch bibliographic info.
                        </p>
                        <Col lg="4">
                            <div className="mb-3">
                                <Label for="publication-number">Publication Number</Label>
                                <Input
                                    type="text"
                                    id="publication-number"
                                    className="form-control"
                                    placeholder="Enter Publication Number"
                                    value={patentNumber || mappedData[0]?.patentNumber}
                                    onChange={(e) => { setPatentNumber(e.target.value); setErrorValidation(false); }}
                                    style={{ border: errorValidation ? '1px solid red' : '' }}
                                />
                            </div>
                        </Col>
                        <Col className="d-grid align-items-end">
                            <div className="mb-3">
                                <Button color="success" onClick={handleFetchPatentData} className="w-100">Submit</Button>
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
                                    value={(famId || releventBiblioGoogleData.pageUrl) || mappedData[0]?.publicationUrl}
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
                                    value={(title || releventBiblioGoogleData.title?.trim()) || mappedData[0]?.title}
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
                                    value={(aplDate || releventBiblioGoogleData.applicationDate) || mappedData[0]?.filingDate}
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
                                    value={(applicantNames || releventBiblioGoogleData.assignees) || mappedData[0]?.assignee}
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
                                    value={(pubDate || releventBiblioGoogleData.publicationDate) || mappedData[0]?.grantDate}
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
                                    value={(inventorNames || releventBiblioGoogleData.inventors) || mappedData[0]?.inventors}
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
                                    value={(priorityDates || releventBiblioGoogleData.priorityDate) || mappedData[0]?.priorityDate}
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
                                    value={(classificationsSymbol || googleClassCPC) || mappedData[0]?.classifications}
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
                                    value={usClassification || mappedData[0]?.usClassification}
                                    onChange={(e) => setUsClassification(e.target.value)}
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
                                    value={familyMemData || mappedData[0]?.familyMembers}
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
                                    value={analystComments || mappedData[0]?.analystComments}
                                    onChange={(e) => setAnalystComments(e.target.value)}
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
                                    value={relevantExcerpts || mappedData[0]?.relevantExcerpts}
                                    onChange={(e) => setRelevantExcerpts(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg="2">
                            <div className="mb-3">
                                <Button color="info" type="submit" className="w-100">+ Add Relevant</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            )}

            {
                <>
                    <TableContainer
                        columns={columns}
                        data={mappedData || []}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                    />
                </>
            }

            <h4 className="mt-5 fw-bold mb-4">2. Non-Patent Literatures(NPL)</h4>
            <Form onSubmit={handleNplSubmit}>
                <Row>
                    <Col lg="4">
                        <div className="mb-3">
                            <Label for="npl-title">Title / Product Name</Label>
                            <Input
                                type="text"
                                id="npl-title"
                                className="form-control"
                                placeholder="Enter Title / Product Name"
                                value={nplPatentFormData.title}
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
                                className="form-control"
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
                                id="npl-publicationDate"
                                className="form-control"
                                placeholder="dd-mm-yyyy"
                                value={nplPatentFormData.publicationDate}
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


            <p>TableContainer for Npl</p>



            <h4 className="fw-bold mb-4">3. Overall Summary of Search and Prior Arts</h4>
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="overall-summary">Overall Summary</Label>
                        <textarea
                            id="overall-summary"
                            className="form-control"
                            rows="3"
                            placeholder="Enter Overall Summary"
                            value={overallSummary}
                            onChange={(e) => setOverallSummary(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Col lg="2">
                <div className="mb-3">
                    <Button onClick={handleOverAllSummarySave} color="warning" className="w-100">
                        Save Summary
                    </Button>
                </div>
            </Col>
        </>
    );
};

export default RelevantRefComponent;
