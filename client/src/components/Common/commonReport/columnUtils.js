import React, { useState } from "react";
import { Link } from "react-router-dom";

export const generateTableColumns = ({
    columnsConfig = [],
    includeSerialNo = true,
    includeActions = false,
    onDeleteClick = () => { },
    onDeleteSelected = () => { }, // ✅ callback for bulk delete
    deleteTooltip = "Delete",
    selectedRows = [], // ✅ controlled state from parent
    setSelectedRows = () => { }, // ✅ state updater
    allRows = [], // ✅ for "select all"
}) => {
    const columns = [];

    // ✅ Checkbox Column
    columns.push({
        id: "select",
        header: ({ table }) => {
            const allSelected = selectedRows.length === allRows.length && allRows.length > 0;
            const indeterminate =
                selectedRows.length > 0 && selectedRows.length < allRows.length;

            return (
                <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => {
                        if (el) el.indeterminate = indeterminate;
                    }}
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRows(allRows.map((row) => row.patentNumber)); // or unique id
                        } else {
                            setSelectedRows([]);
                        }
                    }}
                />
            );
        },
        cell: ({ row }) => {
            const rowData = row.original;
            return (
                <input
                    type="checkbox"
                    checked={selectedRows.includes(rowData.patentNumber)} // or unique id
                    onChange={(e) => {
                        if (e.target.checked) {
                            setSelectedRows((prev) => [...prev, rowData.patentNumber]);
                        } else {
                            setSelectedRows((prev) =>
                                prev.filter((id) => id !== rowData.patentNumber)
                            );
                        }
                    }}
                />
            );
        },
    });

    // ✅ Serial Number Column
    if (includeSerialNo) {
        columns.push({
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        });
    }

    // ✅ Custom Configured Columns
    columns.push(
        ...columnsConfig.map((col) => ({
            header: col.header,
            accessorKey: col.accessorKey,
            enableColumnFilter: col.enableColumnFilter ?? false,
            enableSorting: col.enableSorting ?? true,
        }))
    );

    // ✅ Actions Column
    if (includeActions) {
        columns.push({
            header: "Actions",
            cell: ({ row }) => {
                const rowData = row.original;
                return (
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <Link
                            to="#"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title={deleteTooltip}
                            onClick={() => onDeleteClick(rowData)}
                        >
                            <i className="mdi mdi-delete text-danger font-size-18"></i>
                        </Link>
                    </div>
                );
            },
        });
    }

    return columns;
};














// import React from "react";
// import { Link } from "react-router-dom";

// export const generateTableColumns = ({
//     columnsConfig = [],
//     includeSerialNo = true,
//     includeActions = false,
//     onDeleteClick = () => { },
//     deleteTooltip = "Delete",
// }) => {
//     const columns = [];

//     if (includeSerialNo) {
//         columns.push({
//             header: "S. No.",
//             accessorKey: "serial_number",
//             cell: ({ row }) => <span>{row.index + 1}</span>,
//             enableColumnFilter: false,
//             enableSorting: false,
//         });
//     }

//     columns.push(
//         ...columnsConfig.map((col) => ({
//             header: col.header,
//             accessorKey: col.accessorKey,
//             enableColumnFilter: col.enableColumnFilter ?? false,
//             enableSorting: col.enableSorting ?? true,
//         }))
//     );

//     if (includeActions) {
//         columns.push({
//             header: "Actions",
//             cell: ({ row }) => {
//                 const rowData = row.original;
//                 return (
//                     <div className="d-flex justify-content-center align-items-center gap-3">
//                         <Link
//                             to="#"
//                             data-bs-toggle="tooltip"
//                             data-bs-placement="top"
//                             title={deleteTooltip}
//                             onClick={() => onDeleteClick(rowData)}
//                         >
//                             <i className="mdi mdi-delete text-danger font-size-18"></i>
//                         </Link>
//                     </div>
//                 );
//             },
//         });
//     }

//     return columns;
// };
