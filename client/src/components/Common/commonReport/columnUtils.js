import React from "react";
import { Link } from "react-router-dom";

export const generateTableColumns = ({
    columnsConfig = [],
    includeSerialNo = true,
    includeActions = false,
    onDeleteClick = () => { },
    deleteTooltip = "Delete",
}) => {
    const columns = [];

    if (includeSerialNo) {
        columns.push({
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        });
    }

    columns.push(
        ...columnsConfig.map((col) => ({
            header: col.header,
            accessorKey: col.accessorKey,
            enableColumnFilter: col.enableColumnFilter ?? false,
            enableSorting: col.enableSorting ?? true,
        }))
    );

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
