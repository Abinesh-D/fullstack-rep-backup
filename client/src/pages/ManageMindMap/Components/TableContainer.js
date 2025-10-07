import React, { Fragment, useState } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useExpanded,
  usePagination,
} from "react-table"
import { Table, Row, Col } from "reactstrap"
import JobListGlobalFilter from "../../tableContainer/GlobalSearchFilter"
import { Link } from "react-router-dom"
import Select from 'react-select';


function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)

  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)


  return (
    <React.Fragment>
      <Col>
        <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${count} records...`} onChange={e => { setValue(e.target.value); onChange(e.target.value) }} />
      </Col>
      {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
    </React.Fragment>
  )
}

const TableContainer = ({
  columns,
  data,
  isGlobalFilter,
  isJobListGlobalFilter,
  handleUserClick,
  customPageSize,
  iscustomPageSizeOptions,
  isPagination,
  isShowingPageLength,
  paginationDiv,
  pagination,
  tableClass,
  theadClass,
  getDateRange,
  handleCompareProfiles,
  selectedRowIds,

  mappedOptions,
  filteredValue,
  setFilter,
  options,
  onRemove,
  selectedValues,



}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: customPageSize,
        sortBy: [
          {
            desc: true,
          },
        ],
      },
    },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination
  )

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
  }


  return (
    <Fragment>

        <Row className="mb-2 d-flex align-items-center justify-content-between">
            <Col md={10}>
                <Row className="g-2">


                    {iscustomPageSizeOptions && (
                        <Col xs="12" sm="6" md="4" lg="3" xl="2" className="d-flex align-items-center my-1">
                            <select className="form-select w-100" value={pageSize} onChange={onChangeInSelect}>
                                {[10, 20, 30, 40, 50].map(size => (
                                    <option key={size} value={size}>
                                        Show {size}
                                    </option>
                                ))}
                            </select>
                        </Col>
                    )}

                    {isGlobalFilter && (
                        <Col xs="12" sm="6" md="4" lg="3" xl="2" className="d-flex align-items-center my-1">
                            <GlobalFilter
                                preGlobalFilteredRows={preGlobalFilteredRows}
                                globalFilter={state.globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                isJobListGlobalFilter={isJobListGlobalFilter}
                            />
                        </Col>
                    )}

                    <Col xs="12" sm="6" md="4" lg="3" xl="3" className="my-1">

                        <Select
                            isMulti
                            options={mappedOptions}
                            value={filteredValue}
                            onChange={setFilter}
                            placeholder="Select filter..."
                        />
                    </Col>

                  
                </Row>
            </Col>


        </Row>
    
      {data.length > 0 ?
        <>
          <div className="table-responsive">
            <Table
              // {...getTableProps()} 
              className={tableClass}>
              <thead className={theadClass}>
                {headerGroups.map(headerGroup => (
                  <tr key={headerGroup.id}
                  // {...headerGroup.getHeaderGroupProps()

                  // }
                  >
                    {headerGroup.headers.map(column => (
                      <th key={column.id} className={column.isSort ? "sorting" : ''}>
                        <div className="m-0"
                        // {...column.getSortByToggleProps()}
                        >
                          {column.render("Header")}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  const { disable } = row.original;
                  return (
                    <Fragment key={row.getRowProps().key}>
                      <tr {...row.getRowProps()}
                      >
                        {row.cells.map(cell => {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}
                              style={{
                                background: disable ? 'aliceblue' : '', 
                                color: disable ? '#6c757d' : 'inherit',           // Gray text for disabled rows
                                filter: disable ? 'blur(0.5px)' : 'none',           // Apply blur effect for disabled rows
                              }}
                            >
                              {cell.render("Cell")}
                            </td>
                          )
                        })}
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </Table>
          </div>
        </>
        :
        <>
          <div className="empty-tag-container">
            <div className="empty-tag-message">
              {/* <img src={MClogo} alt="No Data" className="no-data-logo" style={{ maxHeight: '7vh', maxWidth: '100%', objectFit: 'contain' }} /> */}
              <h5>No Charts are Found</h5>
              <p>Please create a flow chart</p>
            </div>
          </div>
        </>
      }

    


      {
        isPagination && (
          <Row className="justify-content-between align-items-center">
            {isShowingPageLength && (
              <div className="col-sm">
                <div className="text-muted">
                  Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries
                </div>
              </div>
            )}
            <div className={paginationDiv} style={{ overflowX: 'auto', whiteSpace: 'nowrap', textAlign: 'right' }}>
              <ul className={pagination} style={{ display: 'inline-flex', listStyle: 'none' }}>
                <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
                  <Link to="#" className="page-link" onClick={previousPage}>
                    <i className="mdi mdi-chevron-left"></i>
                  </Link>
                </li>
                {pageOptions.map((item, key) => (
                  <React.Fragment key={key}>
                    <li className={pageIndex === item ? "page-item active" : "page-item"}>
                      <Link to="#" className="page-link" onClick={() => gotoPage(item)}>{item + 1}</Link>
                    </li>
                  </React.Fragment>
                ))}
                <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
                  <Link to="#" className="page-link" onClick={nextPage}>
                    <i className="mdi mdi-chevron-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </Row>
        )
      }

    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TableContainer