import React, { Fragment, useEffect, useState } from "react";
import { Row, Table, Button, Col } from "reactstrap";
import { Link } from "react-router-dom";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';

import { rankItem } from '@tanstack/match-sorter-utils';
import JobListGlobalFilter from "../../tableContainer/GlobalSearchFilter";

// Column Filter
const Filter = ({
  column
}) => {
  const columnFilterValue = column.getFilterValue();

  return (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '')}
        onChange={value => column.setFilterValue(value)}
        placeholder="Search..."
        className="w-36 border shadow rounded"
        list={column.id + 'list'}
      />
      <div className="h-1" />
    </>
  );
};

// Global Filter
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <React.Fragment>
      <Col sm={4}>
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
      </Col>
    </React.Fragment>
  );
};

const TableContainer = ({
  columns,
  data,
  tableClass,
  theadClass,
  divClassName,
  isBordered,
  isPagination,
  isGlobalFilter,
  paginationWrapper,
  SearchPlaceholder,
  pagination,
  buttonClass,
  buttonName,
  isAddButton,
  isCustomPageSize,
  handleCreate,
  isJobListGlobalFilter,
  related,
}) => {

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({
      itemRank
    });
    return itemRank.passed;
  };

  const table = useReactTable({
    columns,
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const {
    getHeaderGroups,
    getRowModel,
    getCanPreviousPage,
    getCanNextPage,
    getPageOptions,
    setPageIndex,
    nextPage,
    previousPage,
    // setPageSize,
    getState
  } = table;

  // useEffect(() => {
  //   Number(customPageSize) && setPageSize(Number(customPageSize));
  // }, [customPageSize, setPageSize]);


  return (
    <Fragment>

      <Row className="mb-2">
        {isCustomPageSize && (
          <Col sm={2}>
            <select
              className="form-select pageSize mb-2"
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        )}

        {isGlobalFilter && <DebouncedInput
          value={globalFilter ?? ''}
          onChange={value => setGlobalFilter(String(value))}
          className="form-control search-box me-2 mb-2 d-inline-block"
          placeholder={SearchPlaceholder}
        />}

        {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}

        {isAddButton && <Col sm={6}>
          <div className="text-sm-end">
            <Button type="button" className={buttonClass} onClick={ () => handleCreate("0")}>
              <i className="mdi mdi-plus me-1"></i> {buttonName}</Button>
          </div>
        </Col>}
      </Row>

      <div className={divClassName ? divClassName : "table-responsive"}>
        <Table hover className={tableClass} bordered={isBordered} >
          <thead className={theadClass}>
            {getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th key={header.id} colSpan={header.colSpan} className={`${header.column.columnDef.enableSorting ? "sorting sorting_desc" : ""}`}>
                      {header.isPlaceholder ? null : (
                        <React.Fragment>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? 'cursor-pointer select-none'
                                : '',
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {
                              {
                                asc: '',
                                desc: '',
                              }
                              [header.column.getIsSorted()] ?? null}
                          </div>
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </React.Fragment>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {getRowModel().rows.map(row => {
              return (
                <tr key={row.id} className="trowbg">
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>


      {
        isPagination && (
          <Row>
            <Col sm={12} md={5}>
              {/* <div className="dataTables_info">Showing {getState().pagination.pageSize} of {data.length} Results</div> */}
            </Col>
            <Col sm={12} md={7}>
              <div className={paginationWrapper}>
                <ul className={pagination}>
                  <li className={`paginate_button page-item previous ${!getCanPreviousPage() ? "disabled" : ""}`}>
                    <Link to="#" className="page-link" onClick={previousPage}><i className="mdi mdi-chevron-left"></i></Link>
                  </li>
                  {getPageOptions().map((item, key) => (
                    <li key={key} className={`paginate_button page-item ${getState().pagination.pageIndex === item ? "active" : ""}`}>
                      <Link to="#" className="page-link" onClick={() => setPageIndex(item)}>{item + 1}</Link>
                    </li>
                  ))}
                  <li className={`paginate_button page-item next ${!getCanNextPage() ? "disabled" : ""}`}>
                    <Link to="#" className="page-link" onClick={nextPage}><i className="mdi mdi-chevron-right"></i></Link>
                  </li>
                </ul>
              </div>
            </Col>
          </Row>
        )
      }
    </Fragment>
  );
};

export default TableContainer;














// import React, { Fragment, useState } from "react"
// import PropTypes from "prop-types"
// import {
//     useTable,
//     useGlobalFilter,
//     useAsyncDebounce,
//     useSortBy,
//     useExpanded,
//     usePagination,
// } from "react-table"
// import { Table, Row, Col } from "reactstrap"
// import JobListGlobalFilter from "../../tableContainer/GlobalSearchFilter"
// import { Link } from "react-router-dom"
// import 'react-datepicker/dist/react-datepicker.css';
// import Select from 'react-select';
// // import MClogo from "../../../assets/images/mytool-logo-transparent.png"


// function GlobalFilter({
//     preGlobalFilteredRows,
//     globalFilter,
//     setGlobalFilter,
//     isJobListGlobalFilter,
// }) {
//     const count = preGlobalFilteredRows.length
//     const [value, setValue] = React.useState(globalFilter)

//     const onChange = useAsyncDebounce(value => {
//         setGlobalFilter(value || undefined)
//     }, 200)


//     return (
//         <React.Fragment>
//             <Col>
//                 <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${count} records...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
//             </Col>
//             {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
//         </React.Fragment>
//     )
// }

// const TableContainer = ({
//     columns,
//     data,
//     isGlobalFilter,
//     isJobListGlobalFilter,
//     handleUserClick,
//     customPageSize,
//     iscustomPageSizeOptions,
//     isPagination,
//     isShowingPageLength,
//     paginationDiv,
//     pagination,
//     tableClass,
//     theadClass,
//     getDateRange,
//     handleCompareProfiles,
//     selectedRowIds,

//     mappedOptions,
//     filteredValue,
//     setFilter,
//     options,
//     onRemove,
//     selectedValues,



// }) => {
//     const {
//         getTableProps,
//         getTableBodyProps,
//         headerGroups,
//         page,
//         prepareRow,
//         canPreviousPage,
//         canNextPage,
//         pageOptions,
//         gotoPage,
//         nextPage,
//         previousPage,
//         setPageSize,
//         state,
//         preGlobalFilteredRows,
//         setGlobalFilter,
//         state: { pageIndex, pageSize },
//     } = useTable(
//         {
//             columns,
//             data,
//             initialState: {
//                 pageIndex: 0,
//                 pageSize: customPageSize,
//                 sortBy: [
//                     {
//                         desc: true,
//                     },
//                 ],
//             },
//         },
//         useGlobalFilter,
//         useSortBy,
//         useExpanded,
//         usePagination
//     )

//     const onChangeInSelect = event => {
//         setPageSize(Number(event.target.value))
//     }


//     return (
//         <Fragment>

//             <Row className="mb-2 d-flex align-items-center justify-content-between">
//                 <Col md={10}>
//                     <Row className="g-2">


//                         {iscustomPageSizeOptions && (
//                             <Col xs="12" sm="6" md="4" lg="3" xl="2" className="d-flex align-items-center my-1">
//                                 <select className="form-select w-100" value={pageSize} onChange={onChangeInSelect}>
//                                     {[10, 20, 30, 40, 50].map(size => (
//                                         <option key={size} value={size}>
//                                             Show {size}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </Col>
//                         )}

//                         {isGlobalFilter && (
//                             <Col xs="12" sm="6" md="4" lg="3" xl="2" className="d-flex align-items-center my-1">
//                                 <GlobalFilter
//                                     preGlobalFilteredRows={preGlobalFilteredRows}
//                                     globalFilter={state.globalFilter}
//                                     setGlobalFilter={setGlobalFilter}
//                                     isJobListGlobalFilter={isJobListGlobalFilter}
//                                 />
//                             </Col>
//                         )}

//                         <Col xs="12" sm="6" md="4" lg="3" xl="3" className="my-1">
//                             {/* <Multiselect
//                 options={employeeTypeOptions}
//                 displayValue="value"
//                 closeOnSelect={false}
//                 selectedValues={employeeTypeFilter}
//                 onSelect={handleEmployeeTypeChange}
//                 onRemove={handleOptionRemove}
//                 placeholder='Select Employee Type' 
//                 /> */}


//                             <Select
//                                 isMulti
//                                 options={mappedOptions}
//                                 value={filteredValue}
//                                 onChange={setFilter}
//                                 placeholder="Select filter..."
//                             />
//                         </Col>


//                     </Row>
//                 </Col>


//             </Row>

//             {true ?
//                 <>
//                     <div className="table-responsive">
//                         <Table
//                             // {...getTableProps()} 
//                             className={tableClass}>
//                             <thead className={theadClass}>
//                                 {headerGroups.map(headerGroup => (
//                                     <tr key={headerGroup.id}
//                                     // {...headerGroup.getHeaderGroupProps()

//                                     // }
//                                     >
//                                         {headerGroup.headers.map(column => (
//                                             <th key={column.id} className={column.isSort ? "sorting" : ''}>
//                                                 <div className="m-0"
//                                                 // {...column.getSortByToggleProps()}
//                                                 >
//                                                     {column.render("Header")}
//                                                 </div>
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 ))}
//                             </thead>

//                             <tbody {...getTableBodyProps()}>
//                                 {page.map(row => {
//                                     prepareRow(row)
//                                     const { disable } = row.original;
//                                     return (
//                                         <Fragment key={row.getRowProps().key}>
//                                             <tr {...row.getRowProps()}
//                                             >
//                                                 {row.cells.map(cell => {
//                                                     return (
//                                                         <td key={cell.id} {...cell.getCellProps()}
//                                                             style={{
//                                                                 background: disable ? 'aliceblue' : '',   // Light red for disabled rows
//                                                                 color: disable ? '#6c757d' : 'inherit',           // Gray text for disabled rows
//                                                                 // opacity: disable ? 0.6 : 1,                        // Decrease opacity for disabled rows
//                                                                 filter: disable ? 'blur(0.5px)' : 'none',           // Apply blur effect for disabled rows
//                                                             }}
//                                                         //  style={{ background: disable ? '#f8d7da' : 'transparent', color: disable ? '#6c757d' : 'inherit', }}
//                                                         >
//                                                             {cell.render("Cell")}
//                                                         </td>
//                                                     )
//                                                 })}
//                                             </tr>
//                                         </Fragment>
//                                     )
//                                 })}
//                             </tbody>
//                         </Table>
//                     </div>
//                 </>
//                 :
//                 <>
//                     <div className="empty-tag-container">
//                         <div className="empty-tag-message">
//                             <h5>No Data Found</h5>
//                         </div>
//                     </div>
//                 </>
//             }




//             {
//                 isPagination && (
//                     <Row className="justify-content-between align-items-center">
//                         {isShowingPageLength && (
//                             <div className="col-sm">
//                                 <div className="text-muted">
//                                     Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries
//                                 </div>
//                             </div>
//                         )}
//                         <div className={paginationDiv} style={{ overflowX: 'auto', whiteSpace: 'nowrap', textAlign: 'right' }}>
//                             <ul className={pagination} style={{ display: 'inline-flex', listStyle: 'none' }}>
//                                 <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
//                                     <Link to="#" className="page-link" onClick={previousPage}>
//                                         <i className="mdi mdi-chevron-left"></i>
//                                     </Link>
//                                 </li>
//                                 {pageOptions.map((item, key) => (
//                                     <React.Fragment key={key}>
//                                         <li className={pageIndex === item ? "page-item active" : "page-item"}>
//                                             <Link to="#" className="page-link" onClick={() => gotoPage(item)}>{item + 1}</Link>
//                                         </li>
//                                     </React.Fragment>
//                                 ))}
//                                 <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
//                                     <Link to="#" className="page-link" onClick={nextPage}>
//                                         <i className="mdi mdi-chevron-right"></i>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </Row>
//                 )
//             }

//             {/* {
//         isPagination && (
//           <Row className="justify-content-between align-items-center">
//             {isShowingPageLength && <div className="col-sm">
//               <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries</div>
//             </div>}
//             <div className={paginationDiv} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
//               <ul className={pagination}>
//                 <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
//                   <Link to="#" className="page-link" onClick={previousPage}>
//                     <i className="mdi mdi-chevron-left"></i>
//                   </Link>
//                 </li>
//                 {pageOptions.map((item, key) => ( 
//                   <React.Fragment key={key}>
//                     <li className={pageIndex === item ? "page-item active" : "page-item"}>
//                       <Link to="#" className="page-link"  onClick={() => gotoPage(item)}>{item + 1}</Link>
//                     </li>
//                   </React.Fragment>
//                 ))}
//                 <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
//                   <Link to="#" className="page-link" onClick={nextPage}>
//                     <i className="mdi mdi-chevron-right"></i>
//                   </Link>
//                 </li>
//               </ul>
//             </div>
//           </Row>
//         )
//       } */}
//         </Fragment>
//     )
// }

// TableContainer.propTypes = {
//     preGlobalFilteredRows: PropTypes.any,
// }

// export default TableContainer