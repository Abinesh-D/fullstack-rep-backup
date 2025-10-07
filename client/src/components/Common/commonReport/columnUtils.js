

// import React, { useState } from "react";
// import { Link } from "react-router-dom";

// export const TextCell = ({ text = "", sliceLength = 30 }) => {
//   const [expanded, setExpanded] = useState(false);
//   const isLong = text.length > sliceLength;
//   const displayedText = expanded || !isLong ? text : text.slice(0, sliceLength) + " ...";

//   return (
//     <div>
//       <span>{displayedText}</span>
//       {isLong && (
//         <button
//           onClick={() => setExpanded((prev) => !prev)}
//           style={{
//             border: "none",
//             background: "none",
//             color: "blue",
//             cursor: "pointer",
//             padding: 0,
//             marginLeft: "5px",
//           }}
//         >
//           {expanded ? "show less" : "more"}
//         </button>
//       )}
//     </div>
//   );
// };

// export const generateTableColumns = ({
//   columnsConfig = [],
//   includeSerialNo = true,
//   includeActions = false,
//   onDeleteClick = () => {},
//   deleteTooltip = "Delete",
//   isCell = false,
// }) => {
//   const columns = [];

//   if (includeSerialNo) {
//     columns.push({
//       header: "S. No.",
//       accessorKey: "serial_number",
//       cell: ({ row }) => <span>{row.index + 1}</span>,
//       enableColumnFilter: false,
//       enableSorting: false,
//     });
//   }

//   columns.push(
//     ...columnsConfig.map((col) => {
//       const columnDef = {
//         header: col.header,
//         accessorKey: col.accessorKey,
//         enableColumnFilter: col.enableColumnFilter ?? false,
//         enableSorting: col.enableSorting ?? true,
//       };

//       if (!col.skipTextCell) {
//         // columnDef.cell = ({ row }) => {
//         //   const rowData = row.original;
//         //   const text = rowData[col.accessorKey] || "";
//         //   const sliceLength = false ? 80 : 30;
//         //   return <TextCell text={text} sliceLength={sliceLength} />;
//         // };
//         columnDef.cell = ({ row }) => {
//           const rowData = row.original;
//           let text = rowData[col.accessorKey] || "";

//           if (Array.isArray(text)) {
//             text = text.join(", ");
//           }

//           const sliceLength = isCell ? 80 : 20;
//           return <TextCell text={text} sliceLength={sliceLength} />;
//         };

//       }

//       return columnDef;
//     })
//   );

//   if (includeActions) {
//     columns.push({
//       header: "Actions",
//       cell: ({ row }) => {
//         const rowData = row.original;
//         return (
//           <div className="d-flex justify-content-center align-items-center gap-3">
//             <Link
//               to="#"
//               data-bs-toggle="tooltip"
//               data-bs-placement="top"
//               title={deleteTooltip}
//               onClick={() => onDeleteClick(rowData)}
//             >
//               <i className="mdi mdi-delete text-danger font-size-18"></i>
//             </Link>
//           </div>
//         );
//       },
//     });
//   }

//   return columns;
// };
















import React, { useState } from "react";
import { Link } from "react-router-dom";

const TextCell = ({ text, relatedRef, isCell }) => {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 50;
  const value = isCell ? 30 : 80;

  const displayedText = expanded || !isLong? text : text.slice(0, relatedRef ? value : value * 2) + " ...";


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
    setSelectedRows,
    allRows = [],
    isCell = false,
    relatedRef= false,
}) => {
    const columns = [];

  if (relatedRef) {
    columns.push({
      id: "select",
      header: () => {
        const allSelected = selectedRows.length === allRows.length && allRows.length > 0;
        const indeterminate = selectedRows.length > 0 && selectedRows.length < allRows.length;

        return (
          <input
            type="checkbox"
            defaultChecked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = indeterminate;
            }}
            onChange={(e) => {
              console.log("allRowsallRows", allRows)
              if (e.target.checked) {
                setSelectedRows(allRows.map((row) => row._id)); 
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
            defaultChecked={selectedRows.includes(rowData._id)} 
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows((prev) => [...prev, rowData._id]);
              } else {
                setSelectedRows((prev) =>
                  prev.filter((id) => id !== rowData._id)
                );
              }
            }}
          />
        );
      },
    });

  }

    

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
          return <TextCell text={text} relatedRef={relatedRef} isCell={isCell} />;
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
