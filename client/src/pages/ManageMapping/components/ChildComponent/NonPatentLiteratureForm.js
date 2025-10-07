import React, { useState } from "react";
import TableContainer from "../../ReusableComponents/TableContainer";
import { nplReusableDataFetch } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";
import DynamicForm from "../../ReusableComponents/DynamicNplForm";

const NonPatentLiteratureForm = ({
    nplPatentFormData,
    handleNplChange,
    handleNplSubmit,
    nonPatentFormData,
    nplColumns,
    setNplPatentFormData,
    relatedTrue,
}) => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCrossrefSuccess = (data) => {
        setNplPatentFormData((prev) => ({
            ...prev,
            nplTitle: data.title || "",
            url: data.authors?.join(", ") || "",
            nplPublicationDate: data.publishedDate
                ? new Date(data.publishedDate).toLocaleDateString("en-GB")
                : "",
            nplPublicationUrl: data.URL || "",
            excerpts: data.abstract || "",
        }));
    };

    const handleFetch = async (formData) => {
      if(!formData.nplDoi) return ;
        setLoading(true);
        await nplReusableDataFetch({
            endpoint: "nplcorssref",
            queryParam: (formData?.nplDoi || "").trim(),
            setError,
            onSuccess: handleCrossrefSuccess,
            loadingSetter: setLoading,
        });
    };

    const fieldGroups = [
      [
        {
          id: "nplDoi",
          label: "DOI",
          placeholder: "Enter DOI Number",
          type: "text",
          colSize: 4,
        },
        {
          id: "fetchButton",
          label: "",
          type: "button",
          colSize: 2,
          buttonProps: {
            color: "success",
            text: "Fetch",
            onClick: handleFetch,
          },
        },
        {
          id: "nplTitle",
          label: "Title / Product Name",
          placeholder: "Enter Title / Product Name",
          type: "text",
          colSize: 6,
        },
      ],
      [
        {
          id: "url",
          label: "Source/Author(s)",
          placeholder: "Enter Source",
          type: "text",
          colSize: 4,
        },
        {
          id: "nplPublicationDate",
          label: "Publication Date",
          placeholder: "dd-mm-yyyy",
          type: "text",
          colSize: 2,
        },
        {
          id: "nplPublicationUrl",
          label: "Url",
          placeholder: "Enter URL",
          type: "text",
          colSize: 6,
        },
      ],
      ...(!relatedTrue
        ? [
            [
              {
                id: "comments",
                label: "Analyst Comments",
                placeholder: "Enter Comments",
                type: "textarea",
                rows: 3,
                colSize: 12,
              },
              {
                id: "excerpts",
                label: "Relevant Excerpts",
                placeholder: "Enter Relevant Excerpts",
                type: "textarea",
                rows: 3,
                colSize: 12,
              },
            ],
          ]
        : []),
    ];

    return (
        <>
            <h4 className="mt-3 fw-bold mb-3">Non-Patent Literatures (NPL)</h4>

            <DynamicForm
                fieldGroups={fieldGroups}
                formData={nplPatentFormData}
                onChange={handleNplChange}
                onSubmit={handleNplSubmit}
                submitButton={{ label: "+ NPL", color: "info" }}
                loading={loading}
            />

            {Array.isArray(nonPatentFormData) && nonPatentFormData.length > 0 && (
                <TableContainer
                    columns={nplColumns}
                    data={nonPatentFormData || []}
                    isPagination={true}
                    isCustomPageSize={true}
                    SearchPlaceholder="Search..."
                    tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                    theadClass="table-light"
                    paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    pagination="pagination"
                />
            )}
        </>
    );
};

export default NonPatentLiteratureForm;















// import React, { useState } from "react";
// import TableContainer from "../../ReusableComponents/TableContainer";
// import axios from "axios";
// import DynamicForm from "../../ReusableComponents/DynamicNplForm";
// import { nplReusableDataFetch } from "../../../ManageEmployees/ManageBibliography/BibliographySLice/BibliographySlice";

// const NonPatentLiteratureForm = ({
//     nplPatentFormData,
//     handleNplChange,
//     handleNplSubmit,
//     nonPatentFormData,
//     nplColumns,
//     setNplPatentFormData,
// }) => {
//     const [error, setError] = useState("");

//     const handleCrossrefSuccess = (data) => {
//         setNplPatentFormData((prev) => ({
//             ...prev,
//             nplTitle: data.title || "",
//             url: data.authors?.join(", ") || "",
//             nplPublicationDate: data.publishedDate
//                 ? new Date(data.publishedDate).toLocaleDateString("en-GB")
//                 : "",
//             nplPublicationUrl: data.URL || "",
//             excerpts: data.abstract || "",
//         }));
//     };


//     const fieldGroups = [
//         [
//             {
//                 id: "nplDoi",
//                 label: "DOI",
//                 placeholder: "Enter DOI Number",
//                 type: "text",
//                 colSize: 4,
//             },
//             {
//                 id: "fetchButton",
//                 label: "",
//                 type: "button",
//                 colSize: 2,
//                 buttonProps: { color: "success", text: "Fetch", onClick: nplReusableDataFetch },
//             },
//             {
//                 id: "nplTitle",
//                 label: "Title / Product Name",
//                 placeholder: "Enter Title / Product Name",
//                 type: "text",
//                 colSize: 6,
//             },
//         ],
//         [
//             {
//                 id: "url",
//                 label: "Source/Author(s)",
//                 placeholder: "Enter Source",
//                 type: "text",
//                 colSize: 4,
//             },
//             {
//                 id: "nplPublicationDate",
//                 label: "Publication Date",
//                 placeholder: "dd-mm-yyyy",
//                 type: "text",
//                 colSize: 2,
//             },
//             {
//                 id: "nplPublicationUrl",
//                 label: "Url",
//                 placeholder: "Enter URL",
//                 type: "text",
//                 colSize: 6,
//             },
//         ],
//         [
//             {
//                 id: "comments",
//                 label: "Analyst Comments",
//                 placeholder: "Enter Comments",
//                 type: "textarea",
//                 rows: 3,
//                 colSize: 12,
//             },
//             {
//                 id: "excerpts",
//                 label: "Relevant Excerpts",
//                 placeholder: "Enter Relevant Excerpts",
//                 type: "textarea",
//                 rows: 3,
//                 colSize: 12,
//             },
//         ],
//     ];

//     return (
//         <>
//             <h4 className="mt-3 fw-bold mb-3">Non-Patent Literatures (NPL)</h4>
//             <DynamicForm
//                 fieldGroups={fieldGroups}
//                 formData={nplPatentFormData}
//                 onChange={handleNplChange}
//                 onSubmit={handleNplSubmit}
//                 submitButton={{ label: "+ NPL", color: "info" }}
//             />

//             {!(!Array.isArray(nonPatentFormData) || nonPatentFormData.length === 0) && (
//                 <TableContainer
//                     columns={nplColumns}
//                     data={nonPatentFormData || []}
//                     isPagination={true}
//                     isCustomPageSize={true}
//                     SearchPlaceholder="Search..."
//                     tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
//                     theadClass="table-light"
//                     paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                     pagination="pagination"
//                 />
//             )}
//         </>
//     );
// };

// export default NonPatentLiteratureForm;













//   const fetchCrossref = async () => {
//         const doiNumber = (nplPatentFormData["nplDoi"] || "").trim();
//         if (!doiNumber) return;
//         try {
//             setError("");
//             const response = await axios.get(
//                 `http://localhost:8080/live/projectname/nplcorssref/${encodeURIComponent(doiNumber)}`
//             );
//             const data = response.data.data;
//             if (handleCrossrefSuccess) handleCrossrefSuccess(data);
//         } catch (err) {
//             setError("Failed to fetch data. Please check DOI.");
//         }
//     };




// import React, { useState } from "react";
// import { Form, Row, Col, Label, Input, Button } from "reactstrap";
// import TableContainer from "../../ReusableComponents/TableContainer";
// import axios from "axios";

// const NonPatentLiteratureForm = ({
//     nplPatentFormData,
//     handleNplChange,
//     handleNplSubmit,
//     nonPatentFormData,
//     nplColumns,
//     setNplPatentFormData,
// }) => {
//     const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0;

//         const [error, setError] = useState("");
//     const handleCrossrefSuccess = (data) => {
//         console.log('data', data)
//         setNplPatentFormData((prev) => ({
//             ...prev,
//             nplTitle: data.title || "",
//             url: data.authors?.join(", ") || "",
//             nplPublicationDate: data.publishedDate
//                 ? new Date(data.publishedDate).toLocaleDateString("en-GB")
//                 : "",
//             nplPublicationUrl: data.URL || "",
//             excerpts: data.abstract || "",
//         }));
//     };

//     const fetchCrossref = async () => {
//         const doiNumber = (nplPatentFormData["nplDoi"] || "").trim();
//         if (!doiNumber) return;

//         try {
//             setError("");
//             const response = await axios.get(
//                 `http://localhost:8080/live/projectname/nplcorssref/${encodeURIComponent(doiNumber)}`
//             );
//             const data = response.data.data;
//             if (handleCrossrefSuccess) handleCrossrefSuccess(data);
//         } catch (err) {
//             setError("Failed to fetch data. Please check DOI.");
//         }
//     };

//     const titleFieldConfig = [
//         {
//             id: "nplDoi",
//             label: "DOI",
//             placeholder: "Enter DOI Number",
//             type: "text",
//             colSize: 4,
//         },
//         {
//             id: "fetchButton",
//             label: "",
//             type: "button",
//             colSize: 2,
//             buttonProps: {
//                 color: "success",
//                 text: "Fetch",
//                 onClick: fetchCrossref,
//             },
//         },
//         {
//             id: "nplTitle",
//             label: "Title / Product Name",
//             placeholder: "Enter Title / Product Name",
//             type: "text",
//             colSize: 6,
//         },
//     ];

//     const fieldConfig = [
//         {
//             id: "url",
//             label: "Source/Author(s)",
//             placeholder: "Enter Source",
//             type: "text",
//             colSize: 4,
//         },
//         {
//             id: "nplPublicationDate",
//             label: "Publication Date",
//             placeholder: "dd-mm-yyyy",
//             type: "text",
//             colSize: 2,
//         },

//         {
//             id: "nplPublicationUrl",
//             label: "Url",
//             placeholder: "Enter URL",
//             type: "text",
//             colSize: 6,
//         },
//     ];

//     const textareaFields = [
//         {
//             id: "comments",
//             label: "Analyst Comments",
//             placeholder: "Enter Comments",
//             rows: 3,
//             colSize: 12,
//         },
//         {
//             id: "excerpts",
//             label: "Relevant Excerpts",
//             placeholder: "Enter Relevant Excerpts",
//             rows: 3,
//             colSize: 12,
//         },
//     ];

//     return (
//         <>
//             <h4 className="mt-3 fw-bold mb-3">Non-Patent Literatures (NPL)</h4>
//             <Form onSubmit={handleNplSubmit}>
//                 <Row className="align-items-end">
//                     {titleFieldConfig.map((field) => (
//                         <Col key={field.id} lg={field.colSize}>
//                             <div className="mb-3">
//                                 {field.type === "text" && (
//                                     <>
//                                         <Label for={`npl-${field.id}`}>{field.label}</Label>
//                                         <Input
//                                             type="text"
//                                             id={`npl-${field.id}`}
//                                             placeholder={field.placeholder}
//                                             value={nplPatentFormData[field.id] || ""}
//                                             onChange={handleNplChange}
//                                         />
//                                     </>
//                                 )}
//                                 {field.type === "button" && (
//                                     <Button
//                                         color={field.buttonProps.color}
//                                         className="w-100"
//                                         type="button"
//                                         onClick={field.buttonProps.onClick}
//                                     >
//                                         {field.buttonProps.text}
//                                     </Button>
//                                 )}
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>
//                 <Row>
//                     {fieldConfig.map((field) => (
//                         <Col key={field.id} lg={field.colSize}>
//                             <div className="mb-3">
//                                 <Label for={`npl-${field.id}`}>{field.label}</Label>
//                                 <Input
//                                     type={field.type}
//                                     id={`npl-${field.id}`}
//                                     placeholder={field.placeholder}
//                                     value={nplPatentFormData[field.id] || ""}
//                                     onChange={handleNplChange}
//                                 />
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>

//                 <Row>
//                     {textareaFields.map((field) => (
//                         <Col key={field.id} lg={field.colSize}>
//                             <div className="mb-3">
//                                 <Label for={`npl-${field.id}`}>{field.label}</Label>
//                                 <textarea
//                                     id={`npl-${field.id}`}
//                                     className="form-control"
//                                     rows={field.rows}
//                                     placeholder={field.placeholder}
//                                     value={nplPatentFormData[field.id] || ""}
//                                     onChange={handleNplChange}
//                                 />
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>

//                 <Row>
//                     <Col lg="2">
//                         <div className="mb-3">
//                             <Button color="info" className="w-100" type="submit">
//                                 + NPL
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             </Form>
//             {!isEmptyArray(nonPatentFormData) && (
//                 <TableContainer
//                     columns={nplColumns}
//                     data={nonPatentFormData || []}
//                     isPagination={true}
//                     isCustomPageSize={true}
//                     SearchPlaceholder="Search..."
//                     tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
//                     theadClass="table-light"
//                     paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                     pagination="pagination"
//                 />
//             )}
//         </>
//     );
// };

// export default NonPatentLiteratureForm;













// import React from "react";
// import { Form, Row, Col, Label, Input, Button } from "reactstrap";
// import TableContainer from "../../ReusableComponents/TableContainer";
// import NplCrossRef from "./NplCrossRef";

// const NonPatentLiteratureForm = ({
//     nplPatentFormData,
//     handleNplChange,
//     handleNplSubmit,
//     nonPatentFormData,
//     nplColumns,
// }) => {
//     const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0;

//     const fieldConfig = [
//         {
//             id: "nplTitle",
//             label: "Title / Product Name",
//             placeholder: "Enter Title / Product Name",
//             type: "text",
//             colSize: 4,
//         },
//         {
//             id: "url",
//             label: "Source",
//             placeholder: "Enter Source",
//             type: "text",
//             colSize: 4,
//         },
//         {
//             id: "nplPublicationDate",
//             label: "Publication Date",
//             placeholder: "dd-mm-yyyy",
//             type: "text",
//             colSize: 4,
//         },
//         {
//             id: "nplPublicationUrl",
//             label: "Url",
//             placeholder: "Enter URL",
//             type: "text",
//             colSize: 12,
//         },
//     ];

//     const textareaFields = [
//         {
//             id: "comments",
//             label: "Analyst Comments",
//             placeholder: "Enter Comments",
//             rows: 3,
//             colSize: 12,
//         },
//         {
//           id: "excerpts",
//           label: "Relevant Excerpts",
//           placeholder: "Enter Relevant Excerpts",
//           rows: 3,
//           colSize: 12,
//         },
//     ];

//     return (
//         <>
//         <NplCrossRef />

//             <h4 className="mt-3 fw-bold mb-3">Non-Patent Literatures (NPL)</h4>
//             <Form onSubmit={handleNplSubmit}>
//                 <Row>
//                     {fieldConfig.map((field) => (
//                         <Col key={field.id} lg={field.colSize}>
//                             <div className="mb-3">
//                                 <Label for={`npl-${field.id}`}>{field.label}</Label>
//                                 <Input
//                                     type={field.type}
//                                     id={`npl-${field.id}`}
//                                     placeholder={field.placeholder}
//                                     value={nplPatentFormData[field.id] || ""}
//                                     onChange={handleNplChange}
//                                 />
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>

//                 <Row>
//                     {textareaFields.map((field) => (
//                         <Col key={field.id} lg={field.colSize}>
//                             <div className="mb-3">
//                                 <Label for={`npl-${field.id}`}>{field.label}</Label>
//                                 <textarea
//                                     id={`npl-${field.id}`}
//                                     className="form-control"
//                                     rows={field.rows}
//                                     placeholder={field.placeholder}
//                                     value={nplPatentFormData[field.id] || ""}
//                                     onChange={handleNplChange}
//                                 />
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>

//                 <Row>
//                     <Col lg="2">
//                         <div className="mb-3">
//                             <Button color="info" className="w-100" type="submit">
//                                 + NPL
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             </Form>

//             {!isEmptyArray(nonPatentFormData) && (
//                 <TableContainer
//                     columns={nplColumns}
//                     data={nonPatentFormData || []}
//                     isPagination={true}
//                     isCustomPageSize={true}
//                     SearchPlaceholder="Search..."
//                     tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
//                     theadClass="table-light"
//                     paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                     pagination="pagination"
//                 />
//             )}
//         </>
//     );
// };

// export default NonPatentLiteratureForm;
















// import React from "react";
// import { Form, Row, Col, Label, Input, Button } from "reactstrap";
// import TableContainer from "../../ReusableComponents/TableContainer";

// const NonPatentLiteratureForm = ({
//     nplPatentFormData,
//     handleNplChange,
//     handleNplSubmit,
//     nonPatentFormData,
//     nplColumns
// }) => {
//     const isEmptyArray = (arr) => !Array.isArray(arr) || arr.length === 0;

//     return (
//         <>
//             <h4 className="mt-5 fw-bold mb-4">Non-Patent Literatures (NPL)</h4>
//             <Form onSubmit={handleNplSubmit}>
//                 <Row>
//                     <Col lg="4">
//                         <div className="mb-3">
//                             <Label for="npl-title">Title / Product Name</Label>
//                             <Input
//                                 type="text"
//                                 id="npl-nplTitle"
//                                 placeholder="Enter Title / Product Name"
//                                 value={nplPatentFormData.nplTitle}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col>

//                     <Col lg="4">
//                         <div className="mb-3">
//                             <Label for="npl-url">Source</Label>
//                             <Input
//                                 type="text"
//                                 id="npl-url"
//                                 placeholder="Enter NPL URL"
//                                 value={nplPatentFormData.url}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col>

//                     <Col lg="4">
//                         <div className="mb-3">
//                             <Label for="npl-pub-date">Publication Date</Label>
//                             <Input
//                                 type="text"
//                                 id="npl-nplPublicationDate"
//                                 placeholder="dd-mm-yyyy"
//                                 value={nplPatentFormData.nplPublicationDate}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col>
//                 </Row>
//                 <Row>
//                     <Col lg="12">
//                         <div className="mb-3">
//                             <Label for="npl-nplPublicationUrl">Url</Label>
//                             <Input
//                                 type="text"
//                                 id="npl-nplPublicationUrl"
//                                 placeholder="Enter url"
//                                 value={nplPatentFormData.nplPublicationUrl}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col>
//                 </Row>

//                 <Row>
//                     <Col lg="12">
//                         <div className="mb-3">
//                             <Label for="npl-comments">Analyst Comments</Label>
//                             <textarea
//                                 id="npl-comments"
//                                 className="form-control"
//                                 rows="3"
//                                 placeholder="Enter Comments"
//                                 value={nplPatentFormData.comments}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col>

//                     {/* <Col lg="6">
//                         <div className="mb-3">
//                             <Label for="npl-excerpts">Relevant Excerpts</Label>
//                             <textarea
//                                 id="npl-excerpts"
//                                 className="form-control"
//                                 rows="3"
//                                 placeholder="Enter Relevant Excerpts"
//                                 value={nplPatentFormData.excerpts}
//                                 onChange={handleNplChange}
//                             />
//                         </div>
//                     </Col> */}
//                 </Row>

//                 <Col lg="2">
//                     <div className="mb-3">
//                         <Button color="info" className="w-100" type="submit">
//                             + Non-Patent Literature
//                         </Button>
//                     </div>
//                 </Col>
//             </Form>

//             {!isEmptyArray(nonPatentFormData) && (
//                 <TableContainer
//                     columns={nplColumns}
//                     data={nonPatentFormData || []}
//                     isPagination={true}
//                     isCustomPageSize={true}
//                     SearchPlaceholder="Search..."
//                     tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
//                     theadClass="table-light"
//                     paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                     pagination="pagination"
//                 />
//             )}
//         </>
//     );
// };

// export default NonPatentLiteratureForm;
