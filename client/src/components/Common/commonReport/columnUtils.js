import React, { useState } from "react";
import { Link } from "react-router-dom";



export const TextCell = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 50;
  const displayedText = expanded || !isLong ? text : text.slice(0, 80) + " ...";

  return (
    <div>
      <span>{displayedText}</span>
      {isLong && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            border: "none",
            background: "none",
            color: "blue",
            cursor: "pointer",
            padding: 0,
            marginLeft: "5px",
          }}
        >
          {expanded ? "show less" : "more"}
        </button>
      )}
    </div>
  );
};



export const generateTableColumns = ({
    columnsConfig = [],
    includeSerialNo = true,
    includeActions = false,
    onDeleteClick = () => { },
    onDeleteSelected = () => { },
    deleteTooltip = "Delete",
    selectedRows = [],
    setSelectedRows = () => { },
    allRows = [],
    isCell = false,
}) => {
    const columns = [];

    // columns.push({
    //     id: "select",
    //     header: ({ table }) => {
    //         const allSelected = selectedRows.length === allRows.length && allRows.length > 0;
    //         const indeterminate =
    //             selectedRows.length > 0 && selectedRows.length < allRows.length;

    //         return (
    //             <input
    //                 type="checkbox"
    //                 checked={allSelected}
    //                 ref={(el) => {
    //                     if (el) el.indeterminate = indeterminate;
    //                 }}
    //                 onChange={(e) => {
    //                     if (e.target.checked) {
    //                         setSelectedRows(allRows.map((row) => row.patentNumber));
    //                     } else {
    //                         setSelectedRows([]);
    //                     }
    //                 }}
    //             />
    //         );
    //     },
    //     cell: ({ row }) => {
    //         const rowData = row.original;
    //         return (
    //             <input
    //                 type="checkbox"
    //                 checked={selectedRows.includes(rowData.patentNumber)}
    //                 onChange={(e) => {
    //                     if (e.target.checked) {
    //                         setSelectedRows((prev) => [...prev, rowData.patentNumber]);
    //                     } else {
    //                         setSelectedRows((prev) =>
    //                             prev.filter((id) => id !== rowData.patentNumber)
    //                         );
    //                     }
    //                 }}
    //             />
    //         );
    //     },
    // });

    if (includeSerialNo) {
        columns.push({
            header: "S. No.",
            accessorKey: "serial_number",
            cell: ({ row }) => <span>{row.index + 1}</span>,
            enableColumnFilter: false,
            enableSorting: false,
        });
    }

    // columns.push(
    //     ...columnsConfig.map((col) => ({
    //         header: col.header,
    //         accessorKey: col.accessorKey,
    //         enableColumnFilter: col.enableColumnFilter ?? false,
    //         enableSorting: col.enableSorting ?? true,
    //     }))
    // );

    // columns.push(
    //     ...columnsConfig.map((col) => ({
    //         header: col.header,
    //         accessorKey: col.accessorKey,
    //         enableColumnFilter: col.enableColumnFilter ?? false,
    //         enableSorting: col.enableSorting ?? true,

    //         cell: ({ row }) => {
    //             const rowData = row.original;
    //             const text = rowData[col.accessorKey] || "";
    //              return <TextCell text={text} />
    //         },
    //     }))
    // );



  columns.push(
    ...columnsConfig.map((col) => {
      const columnDef = {
        header: col.header,
        accessorKey: col.accessorKey,
        enableColumnFilter: col.enableColumnFilter ?? false,
        enableSorting: col.enableSorting ?? true,
      };

      if (isCell) {
        columnDef.cell = ({ row }) => {
          const rowData = row.original;
          const text = rowData[col.accessorKey] || "";
          return <TextCell text={text} />;
        };
      }

      return columnDef;
    })
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
