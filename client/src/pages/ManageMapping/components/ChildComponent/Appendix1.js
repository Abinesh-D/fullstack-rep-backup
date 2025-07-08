import { isEmptyArray } from "formik";
import React, { useMemo } from "react";
import { Row, Col, Button, Label, Input } from "reactstrap";
import TableContainer from "../../ReusableComponents/TableContainer";
import { Link } from "react-router-dom";


const Appendix1 = ({
    baseSearchTerm,
    setBaseSearchTerm,
    baseSearchTermsList,
    handleSaveBaseSearchTerm,
    onSearchTermDelete,


    keyString,
    setKeyString,
    keyStringsList,
    handleSaveKeyString,
    onKeyStringsDelete,

    dataAvailability,
    setDataAvailability,
    dataAvailabilityValue,
    handleSaveDataAvailability,
    onDataAvailabilityDelete,

}) => {


    const baseSearchColumns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Search Terms",
            accessorKey: "searchTermText",
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
                            title="Delete Publication"
                            onClick={() => onSearchTermDelete(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [baseSearchTermsList]);


    const keyStringsColumns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Key Strings",
            accessorKey: "keyStringsText",
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
                            title="Delete Publication"
                            onClick={() => onKeyStringsDelete(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [keyStringsList]);


    const availabilityColumns = useMemo(() => [
        {
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        },
        {
            header: "Data Availability Value",
            accessorKey: "dataAvailableText",
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
                            title="Delete Publication"
                            onClick={() => onDataAvailabilityDelete(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        },
    ], [dataAvailabilityValue]);

    return (
        <>
            <h4 className="fw-bold mb-3">Appendix 1</h4>
            <p className="text-muted mb-4">
                <i>The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.</i>
            </p>

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
                            value={baseSearchTerm}
                            onChange={(e) => setBaseSearchTerm(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Col lg={2}>
                <div className="mb-3">
                    <Button color="info" className="w-100" onClick={handleSaveBaseSearchTerm}>
                        + Base Search Terms
                    </Button>
                </div>
            </Col>

            {
                !isEmptyArray(baseSearchTermsList) && (
                    <TableContainer
                        columns={baseSearchColumns}
                        data={baseSearchTermsList || []}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                    />
                )
            }

            <h5 className="fw-semibold mt-5">2. Search Strings</h5>
            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="key-strings">Key Strings</Label>
                        <textarea
                            id="key-strings"
                            className="form-control"
                            rows="3"
                            placeholder="Enter key strings (Orbit, USPTO, PatSeer, Google Patent, Scholar, IEEE, etc.)"
                            value={keyString}
                            onChange={(e) => setKeyString(e.target.value)}
                        />
                    </div>
                </Col>
            </Row>
            <Col lg={2}>
                <div className="mb-3">
                    <Button color="info" className="w-100" onClick={handleSaveKeyString}>
                        + Key Strings
                    </Button>
                </div>
            </Col>
            {
                !isEmptyArray(keyStringsList) && (
                    <TableContainer
                        columns={keyStringsColumns}
                        data={keyStringsList || []}
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                    />
                )
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
                        SearchPlaceholder="Search..."
                        tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                        theadClass="table-light"
                    />
                )
            }
        </>
    );
};

export default Appendix1;
