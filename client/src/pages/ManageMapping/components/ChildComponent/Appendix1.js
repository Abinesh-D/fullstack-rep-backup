import { isEmptyArray } from "formik";
import React, { useMemo, useState } from "react";
import { Row, Col, Button, Label, Input, Spinner } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { generateTableColumns } from "../../../../components/Common/commonReport/columnUtils";
import { appendixSectionsConfig } from "./appendixSectionsConfig";


const Appendix1 = ({
    baseSearchTerm,
    setBaseSearchTerm,
    baseSearchTermsList,
    handleSaveBaseSearchTerm,
    onSearchTermDelete,
    relevantWords,
    setRelevantWords,
    handleFindRelevantWord,
    handleAddSearchTerms,
    findLoading,
    relevantWordsList,
    onRelevantWordsDelete,

    keyString,
    setKeyString,
    keyStringsList,
    handleSaveKeyString,
    onKeyStringsDelete,

    keyStringNpl,
    setKeyStringNpl,
    keyStringsNplList,
    handleSaveKeyStringNpl,
    onKeyStringsNplDelete,

    keyStringAdditional,
    setKeyStringAdditional,
    handleSaveKeyStringAdditional,
    onKeyStringsAdditionalDelete,
    keyStringsAdditionalList,

    dataAvailability,
    setDataAvailability,
    dataAvailabilityValue,
    handleSaveDataAvailability,
    onDataAvailabilityDelete,

}) => {


    const singleProject = useSelector(state => state.patentSlice.singleProject);


    const baseSearchTermsColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Key Word", accessorKey: "searchTermText" },
                { header: "Relevant Words", accessorKey: "relevantWords" }
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onRelevantWordsDelete,
            deleteTooltip: "Delete Search Term"
        }), [relevantWordsList]);

    const keyStringsColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Key Strings", accessorKey: "keyStringsText" }
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onKeyStringsDelete,
            deleteTooltip: "Delete Key String"
        }), [keyStringsList]);

    const keyStringsNplColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Key Strings(Npl)", accessorKey: "keyStringsNplText" }
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onKeyStringsNplDelete,
            deleteTooltip: "Delete NPL Key String"
        }), [keyStringsNplList]);

    const keyStringsAdditionalColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Additional Search", accessorKey: "keyStringsAdditionalText" }
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onKeyStringsAdditionalDelete,
            deleteTooltip: "Delete Additional Search"
        }), [keyStringsAdditionalList]);

    const availabilityColumns = useMemo(() =>
        generateTableColumns({
            columnsConfig: [
                { header: "Data Availability Value", accessorKey: "dataAvailableText" }
            ],
            includeSerialNo: true,
            includeActions: true,
            onDeleteClick: onDataAvailabilityDelete,
            deleteTooltip: "Delete Data Availability"
        }), [dataAvailabilityValue]);



    // const baseSearchTermsColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Key Word",
    //         accessorKey: "searchTermText",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Relevant Words",
    //         accessorKey: "relevantWords",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Search Term"
    //                         onClick={() => onRelevantWordsDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [relevantWordsList]);


    // const keyStringsColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Key Strings",
    //         accessorKey: "keyStringsText",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Publication"
    //                         onClick={() => onKeyStringsDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [keyStringsList]);

    // const keyStringsNplColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Key Strings(Npl)",
    //         accessorKey: "keyStringsNplText",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Publication"
    //                         onClick={() => onKeyStringsNplDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [keyStringsNplList]);


    //  const keyStringsAdditionalColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Additional Search",
    //         accessorKey: "keyStringsAdditionalText",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Publication"
    //                         onClick={() => onKeyStringsAdditionalDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [keyStringsAdditionalList]);


    // const availabilityColumns = useMemo(() => [
    //     {
    //         header: "S. No.",
    //         accessorKey: "serial_number",
    //         cell: ({ row }) => <span>{row.index + 1}</span>,
    //         enableColumnFilter: false,
    //         enableSorting: false,
    //     },
    //     {
    //         header: "Data Availability Value",
    //         accessorKey: "dataAvailableText",
    //         enableColumnFilter: false,
    //         enableSorting: true,
    //     },
    //     {
    //         header: "Actions",
    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             return (
    //                 <div className="d-flex justify-content-center align-items-center gap-3">
    //                     <Link
    //                         to="#"
    //                         data-bs-toggle="tooltip"
    //                         data-bs-placement="top"
    //                         title="Delete Publication"
    //                         onClick={() => onDataAvailabilityDelete(rowData)}
    //                     >
    //                         <i className="mdi mdi-delete text-danger font-size-18"></i>
    //                     </Link>
    //                 </div>
    //             );
    //         },
    //     },
    // ], [dataAvailabilityValue]);

    return (
        // <>
        //     <h4 className="fw-bold mb-3">
        //         {singleProject.projectTypeId === "0002" ? "Appendix 2" : "Appendix 1"}
        //     </h4>
        //     <p className="text-muted mb-4">
        //         <i>
        //             The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.
        //         </i>
        //     </p>

        //     {appendixSectionsConfig({
        //         handlers: {
        //             setBaseSearchTerm,
        //             setRelevantWords,
        //             setKeyString,
        //             setKeyStringNpl,
        //             setKeyStringAdditional,
        //             setDataAvailability,
        //             handleFindRelevantWord,
        //             handleAddSearchTerms,
        //             handleSaveKeyString,
        //             handleSaveKeyStringNpl,
        //             handleSaveKeyStringAdditional,
        //             handleSaveDataAvailability,
        //         },
        //         values: {
        //             baseSearchTerm,
        //             relevantWords,
        //             keyString,
        //             keyStringNpl,
        //             keyStringAdditional,
        //             dataAvailability,
        //             relevantWordsList,
        //             keyStringsList,
        //             keyStringsNplList,
        //             keyStringsAdditionalList,
        //             dataAvailabilityValue,
        //             findLoading,
        //         },
        //         columns: {
        //             baseSearchTermsColumns,
        //             keyStringsColumns,
        //             keyStringsNplColumns,
        //             keyStringsAdditionalColumns,
        //             availabilityColumns,
        //         },
        //         projectTypeId: singleProject.projectTypeId,
        //     }).map((section, index) => (
        //         section.show && (
        //             <div key={index} className="mt-4">
        //                 <h5 className="fw-semibold">{section.sectionTitle}</h5>

        //                 <Row>
        //                     {section.fields.map((field, idx) => (
        //                         <Col lg={field.col} key={idx}>
        //                             <div className="mb-3">
        //                                 <Label for={field.id}>{field.label}</Label>
        //                                 {field.type === "textarea" ? (
        //                                     <textarea
        //                                         id={field.id}
        //                                         className="form-control"
        //                                         rows={field.rows}
        //                                         placeholder={field.placeholder}
        //                                         value={field.value}
        //                                         onChange={field.onChange}
        //                                     />
        //                                 ) : (
        //                                     <>
        //                                         <Input
        //                                             type="text"
        //                                             id={field.id}
        //                                             className="form-control"
        //                                             placeholder={field.placeholder}
        //                                             value={field.value}
        //                                             onChange={field.onChange}
        //                                         />
        //                                         <div className="mt-3 d-flex gap-2">
        //                                             <Button
        //                                                 color="success"
        //                                                 type="button"
        //                                                 onClick={handleFindRelevantWord}
        //                                                 className="flex-fill"
        //                                             >
        //                                                 {findLoading ? (
        //                                                     <>
        //                                                         <Spinner size="sm" /> Loading...
        //                                                     </>
        //                                                 ) : (
        //                                                     "Find"
        //                                                 )}
        //                                             </Button>

        //                                             <Button
        //                                                 color="primary"
        //                                                 type="button"
        //                                                 onClick={handleAddSearchTerms}
        //                                                 className="flex-fill"
        //                                             >
        //                                                 + Add Search Terms
        //                                             </Button>
        //                                         </div>
        //                                     </>
        //                                 )}
        //                             </div>
        //                         </Col>
        //                     ))}
        //                 </Row>

        //                 {!isEmptyArray(section.table.data) && (
        //                     <TableContainer
        //                         columns={section.table.columns}
        //                         data={section.table.data || []}
        //                         isPagination={true}
        //                         isCustomPageSize={true}
        //                         SearchPlaceholder="Search..."
        //                         tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
        //                         theadClass="table-light"
        //                         paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
        //                         pagination="pagination"
        //                     />
        //                 )}
        //             </div>
        //         )
        //     ))}
        // </>

        <>
            <h4 className="fw-bold mb-3">{ singleProject.projectTypeId === "0002" ? "Appendix 2" : "Appendix 1"}</h4>
            <p className="text-muted mb-4">
                <i>The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.</i>
            </p>

            <h5 className="fw-semibold">1. Base Search Terms</h5>

            {
                <>
                    <Row>
                        <Col lg="4">
                            <div className="mb-3">
                                <Label for="base-search-terms">Key Word</Label>
                                <Input
                                    type="text"
                                    id="base-search-terms"
                                    className="form-control"
                                    placeholder="Enter Key Word"
                                    value={baseSearchTerm}
                                    onChange={e => setBaseSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="mb-3 d-flex gap-2">
                                <Button
                                    color="success"
                                    type="button"
                                    onClick={handleFindRelevantWord}
                                    className="flex-fill"
                                >
                                    {findLoading ? (
                                        <>
                                            <Spinner size="sm" /> Loading...
                                        </>
                                    ) : (
                                        "Find"
                                    )}
                                </Button>

                                <Button
                                    color="primary"
                                    type="button"
                                    onClick={handleAddSearchTerms}
                                    className="flex-fill"
                                >
                                    + Add Search Terms
                                </Button>
                            </div>
                        </Col>

                        <Col lg="8">
                            <div className="mb-3">
                                <Label for="relevantapiword">Relevant Words</Label>
                                <textarea
                                    id="relevantapiword"
                                    className="form-control"
                                    rows="4"
                                    placeholder="Relevant Words."
                                    value={relevantWords}
                                    onChange={(e) => setRelevantWords(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>

                    {
                        !isEmptyArray(relevantWordsList) && (
                            <TableContainer
                                columns={baseSearchTermsColumns}
                                data={relevantWordsList || []}
                                isPagination={true}
                                isCustomPageSize={true}
                                tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                                theadClass="table-light"
                                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                pagination="pagination"
                            />
                        )
                    }
                </>
            }

            <h5 className="fw-semibold mt-5">2. Search Strings</h5>
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="key-strings">Key Strings (Patents/Patent Applications)</Label>
                        <textarea
                            id="key-strings"
                            className="form-control"
                            rows="3"
                            placeholder="Enter key strings for patent"
                            value={keyString}
                            onChange={(e) => setKeyString(e.target.value)}
                        />
                    </div>
                </Col>               
            </Row>
            <Col lg={2}>
                <div className="mb-3">
                    <Button color="info" className="w-100" onClick={handleSaveKeyString}>
                        + Strings(patent)
                    </Button>
                </div>
            </Col>
            
            {
                !isEmptyArray(keyStringsList) && (
                    <TableContainer
                        columns={keyStringsColumns}
                        data={keyStringsList || []}
                        isPagination={true}
                        isCustomPageSize={true}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                        
                    />
                )
            }

            {singleProject.projectTypeId === "0001" &&
                <>
                    <Row className="mt-4">
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="key-strings-npl">Key Strings (Non-Patent Literatures)</Label>
                                <textarea
                                    id="key-strings-npl"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter key strings for (Npl)"
                                    value={keyStringNpl}
                                    onChange={(e) => setKeyStringNpl(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Col lg={2}>
                        <div className="mb-3">
                            <Button color="info" className="w-100" onClick={handleSaveKeyStringNpl}>
                                + Strings(NPL)
                            </Button>
                        </div>
                    </Col>

                    {
                        !isEmptyArray(keyStringsNplList) && (
                            <TableContainer
                                columns={keyStringsNplColumns}
                                data={keyStringsNplList || []}
                                isPagination={true}
                                isCustomPageSize={true}
                                SearchPlaceholder="Search..."
                                tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                                theadClass="table-light"
                                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                pagination="pagination"
                            />
                        )
                    }

                    <Row className="mt-4">
                        <Col lg="12">
                            <div className="mb-3">
                                <Label for="additional-key-strings">Additional Search</Label>
                                <textarea
                                    id="additional-key-strings"
                                    className="form-control"
                                    rows="3"
                                    placeholder="Enter Additional Search"
                                    value={keyStringAdditional}
                                    onChange={(e) => setKeyStringAdditional(e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Col lg={2}>
                        <div className="mb-3">
                            <Button color="info" className="w-100 d-flex justify-content-center align-items-center" onClick={handleSaveKeyStringAdditional}>
                                + Additional <i style={{ margin: "auto" }} className="bx bx-search-alt-2"></i>
                            </Button>
                        </div>
                    </Col>

                    {
                        !isEmptyArray(keyStringsAdditionalList) && (
                            <TableContainer
                                columns={keyStringsAdditionalColumns}
                                data={keyStringsAdditionalList || []}
                                isPagination={true}
                                isCustomPageSize={true}
                                SearchPlaceholder="Search..."
                                tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                                theadClass="table-light"
                                paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                pagination="pagination"
                            />
                        )
                    }
                </>
            }

            <h5 className="fw-semibold mt-5">3. Data Availability</h5>
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="data-availability-value">Value</Label>
                        <textarea
                            id="data-availability-value"
                            className="form-control"
                            rows="3"
                            placeholder="Enter value"
                            value={dataAvailability}
                            onChange={(e) => setDataAvailability(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Col lg={2}>
                <div className="mb-3">
                    <Button color="info" className="w-100" onClick={handleSaveDataAvailability}>
                        + Add Value
                    </Button>
                </div>
            </Col>
            {
                !isEmptyArray(dataAvailabilityValue) && (
                    <TableContainer
                        columns={availabilityColumns}
                        data={dataAvailabilityValue || []}
                        isPagination={true}
                        isCustomPageSize={true}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        pagination="pagination"
                    />
                )
            }
        </>
    );
};

export default Appendix1;
