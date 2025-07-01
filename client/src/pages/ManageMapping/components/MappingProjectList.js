import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import withRouter from "../../../components/Common/withRouter";
import TableContainer from "../ReusableComponents/TableContainer";
import { Card, CardBody, Col, Container, Row, Modal, ModalHeader, ModalBody, Label, Input, FormGroup, Button, ModalFooter } from "reactstrap";

import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import DeleteModal from "../ReusableComponents/DeleteModal";

import { isEmpty } from "lodash";
import { useNavigate } from "react-router-dom";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Spinners from "../../../components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import ProjectModal from "../ReusableComponents/ProjectModal ";

const projectTypeOptions = [
    { value: "1", label: "Quick Patentability Report" },
    { value: "2", label: "Novelty/Patentability Report" },
    { value: "3", label: "Quick Invalidity Report" },
    { value: "4", label: "FTO Report - Chemistry" },
    { value: "5", label: "FTO Report - Life Science" },
];


const ContactsList = () => {

    //meta title
    document.title = "Project List | MCRPL";

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectType, setProjectType] = useState('');
    const [newProject, setNewProject] = useState("");


    const toggle = () => {
        setModal(!modal);
    }

    const handleCreate = () => {
        console.log("Project Name:", projectName);
        console.log("Project Type:", projectType);
        toggle();
    };

    const handleGo = (rowData) => {
        console.log(rowData, 'rowDatahandleGo')

    }

    const data = [
        {
            id: 1,
            projectName: "MindMap Visualizer",
            projectType: "Frontend",
            createdOn: "2024-11-12",
        },
        {
            id: 2,
            projectName: "Patent Scraper Tool",
            projectType: "Backend",
            createdOn: "2024-10-25",
        },
        {
            id: 3,
            projectName: "Incentive Dashboard",
            projectType: "Fullstack",
            createdOn: "2024-09-01",
        },
        {
            id: 4,
            projectName: "Image Analyzer",
            projectType: "ML Pipeline",
            createdOn: "2025-01-15",
        },
        {
            id: 5,
            projectName: "Excel Upload Processor",
            projectType: "Data Tool",
            createdOn: "2025-06-01",
        },
        // {
        //     id: 6,
        //     projectName: "Report Analyzer",
        //     projectType: "Data Tool",
        //     createdOn: "2024-08-19",
        // },
        // {
        //     id: 7,
        //     projectName: "User Management System",
        //     projectType: "Fullstack",
        //     createdOn: "2025-02-03",
        // },
        // {
        //     id: 8,
        //     projectName: "Dashboard Designer",
        //     projectType: "Frontend",
        //     createdOn: "2024-12-22",
        // },
        // {
        //     id: 9,
        //     projectName: "Log Monitoring Service",
        //     projectType: "Backend",
        //     createdOn: "2025-03-10",
        // },
        // {
        //     id: 10,
        //     projectName: "API Gateway Manager",
        //     projectType: "Backend",
        //     createdOn: "2024-11-30",
        // },
        // {
        //     id: 11,
        //     projectName: "Realtime Notification Engine",
        //     projectType: "Fullstack",
        //     createdOn: "2025-04-18",
        // },
        // {
        //     id: 12,
        //     projectName: "AI Chat Assistant",
        //     projectType: "ML Pipeline",
        //     createdOn: "2025-05-20",
        // },
        // {
        //     id: 13,
        //     projectName: "File Upload Portal",
        //     projectType: "Frontend",
        //     createdOn: "2024-07-14",
        // },
        // {
        //     id: 14,
        //     projectName: "Image Compression API",
        //     projectType: "Backend",
        //     createdOn: "2025-06-25",
        // },
        // {
        //     id: 15,
        //     projectName: "Keyword Extraction Service",
        //     projectType: "ML Pipeline",
        //     createdOn: "2025-01-05",
        // },
    ];



    const columns = useMemo(
        () => [
            {
                header: "S. No",
                accessorKey: "serial_number",
                cell: ({ row }) => <span>{row.index + 1}</span>,
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Project Name",
                accessorKey: "projectName",
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: "Project Type",
                accessorKey: "projectType",
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: "Created On",
                accessorKey: "createdOn",
                enableColumnFilter: false,
                enableSorting: true,
            },
            {
                header: "Actions",
                cell: ({ row }) => {
                    const rowData = row.original;
                    return (
                        <div className="d-flex gap-3">
                            <Link
                                to="/project-mapping-creation"
                                className="text-success"

                                onClick={() => { handleGo(rowData) }}
                            >
                                <Button
                                    size="sm"
                                    color="primary"
                                >
                                    Go &rarr;
                                </Button>
                                {/* <i className="mdi mdi-pencil font-size-18" /> */}
                            </Link>
                            <Link
                                to="#"
                                className="text-danger"
                            //   onClick={() => handleDelete(rowData)}
                            >
                                <i className="mdi mdi-delete font-size-18" />
                            </Link>
                        </div>
                    );
                },
            },
        ],
        []
    );


//   const [contact, setContact] = useState();

//   const validation = useFormik({
//     enableReinitialize: true,

//     initialValues: {
//       name: (contact && contact.name) || "",
//       designation: (contact && contact.designation) || "",
//       tags: (contact && contact.tags) || "",
//       email: (contact && contact.email) || "",
//       projects: (contact && contact.projects) || "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("Please Enter Your Name"),
//       designation: Yup.string().required("Please Enter Your Designation"),
//       tags: Yup.array().required("Please Enter Tag"),
//       email: Yup.string().matches(
//         /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
//         "Please Enter Valid Email"
//       ).required("Please Enter Your Email"),
//       projects: Yup.string().required("Please Enter Your Project"),
//     }),
//     onSubmit: values => {
//       if (isEdit) {
//         const updateUser = {
//           id: contact.id,
//           name: values.name,
//           designation: values.designation,
//           tags: values.tags,
//           email: values.email,
//           projects: values.projects,
//         };
//         // update user
//         setIsEdit(false);
//         validation.resetForm();
//       } else {
//         const newUser = {
//           id: Math.floor(Math.random() * (30 - 20)) + 20,
//           name: values["name"],
//           designation: values["designation"],
//           email: values["email"],
//           tags: values["tags"],
//           projects: values["projects"],
//         };
//         // save new user
//         validation.resetForm();
//       }
//       toggle();
//     },
//   });

//   const ContactsProperties = createSelector(
//     (state) => state.contacts,
//     (Contacts) => ({
//       users: Contacts.users,
//       loading: Contacts.loading
//     })
//   );

//   const {
//     users, loading
//   } = useSelector(ContactsProperties);

//   const [modal, setModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [isLoading, setLoading] = useState(loading)

//   useEffect(() => {
//     if (users && !users.length) {
//       setIsEdit(false);
//     }
//   }, [dispatch, users]);

//   useEffect(() => {
//     setContact(users);
//     setIsEdit(false);
//   }, [users]);

//   useEffect(() => {
//     if (!isEmpty(users) && !!isEdit) {
//       setContact(users);
//       setIsEdit(false);
//     }
//   }, [users]);

//   const toggle = () => {
//     setModal(!modal);
//   };

//   const handleUserClick = arg => {
//     const user = arg;

//     setContact({
//       id: user.id,
//       name: user.name,
//       designation: user.designation,
//       email: user.email,
//       tags: user.tags,
//       projects: user.projects,
//     });
//     setIsEdit(true);

//     toggle();
//   };

//   //delete customer
//   const [deleteModal, setDeleteModal] = useState(false);

//   const onClickDelete = (users) => {
//     setContact(users.id);
//     setDeleteModal(true);
//   };

//   const handleDeleteUser = () => {
//     if (contact && contact.id) {
//     }
//     setDeleteModal(false);
//   };




  return (
    <React.Fragment>
      {/* <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteUser}
        onCloseClick={() => setDeleteModal(false)}
      /> */}
      <div className="">
        <Container fluid>
          {/* <Breadcrumbs title="Contacts" breadcrumbItem="User List" /> */}
                  <Row>
                      {
                          //   isLoading ? <Spinners setLoading={setLoading} />
                          true ?
                              <Col lg="12">
                                  <Card>
                                      <CardBody>
                                          <TableContainer
                                              columns={columns}
                                              data={data || []}
                                              isGlobalFilter={true}
                                              isPagination={true}
                                              SearchPlaceholder="Search..."
                                              isCustomPageSize={true}
                                              isAddButton={true}
                                              handleCreate={handleCreate}
                                              buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
                                              buttonName="New Project"
                                              tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
                                              theadClass="table-light"
                                              paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                                              pagination="pagination"
                                          />
                                      </CardBody>
                                  </Card>
                              </Col>
                              : <>Else</>

                      }

                      {
                          < ProjectModal
                              isOpen={modal}
                              toggle={toggle}
                              projectName={projectName}
                              setProjectName={setProjectName}
                              projectType={projectType}
                              setProjectType={setProjectType}
                              onCreate={handleCreate}
                              type={newProject}
                              projectTypeOptions={projectTypeOptions}
                          />
                      }
                  </Row>
              </Container>
          </div>
          <ToastContainer />
    </React.Fragment>
  );
};

export default withRouter(ContactsList);



















// import React, { useEffect, useState, useMemo } from "react";
// import { Link } from "react-router-dom";
// import withRouter from "../../../components/Common/withRouter";
// import TableContainer from "../ReusableComponents/TableContainer";
// import {
//   Card,
//   CardBody,
//   Col,
//   Container,
//   Row,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   Label,
//   FormFeedback,
//   Input,
//   Form,
// } from "reactstrap";
// import * as Yup from "yup";
// import { useFormik } from "formik";

// //Import Breadcrumb
// import Breadcrumbs from "../../../components/Common/Breadcrumb";
// import DeleteModal from "../ReusableComponents/DeleteModal";

// import { isEmpty } from "lodash";

// //redux
// import { useSelector, useDispatch } from "react-redux";
// import { createSelector } from "reselect";
// import Spinners from "../../../components/Common/Spinner";
// import { ToastContainer } from "react-toastify";

// const ContactsList = () => {

//   //meta title
//   document.title = "User List | Skote - React Admin & Dashboard Template";

//   const dispatch = useDispatch();
//   const [contact, setContact] = useState();

//   const validation = useFormik({
//     enableReinitialize: true,

//     initialValues: {
//       name: (contact && contact.name) || "",
//       designation: (contact && contact.designation) || "",
//       tags: (contact && contact.tags) || "",
//       email: (contact && contact.email) || "",
//       projects: (contact && contact.projects) || "",
//     },
//     validationSchema: Yup.object({
//       name: Yup.string().required("Please Enter Your Name"),
//       designation: Yup.string().required("Please Enter Your Designation"),
//       tags: Yup.array().required("Please Enter Tag"),
//       email: Yup.string().matches(
//         /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
//         "Please Enter Valid Email"
//       ).required("Please Enter Your Email"),
//       projects: Yup.string().required("Please Enter Your Project"),
//     }),
//     onSubmit: values => {
//       if (isEdit) {
//         const updateUser = {
//           id: contact.id,
//           name: values.name,
//           designation: values.designation,
//           tags: values.tags,
//           email: values.email,
//           projects: values.projects,
//         };
//         // update user
//         setIsEdit(false);
//         validation.resetForm();
//       } else {
//         const newUser = {
//           id: Math.floor(Math.random() * (30 - 20)) + 20,
//           name: values["name"],
//           designation: values["designation"],
//           email: values["email"],
//           tags: values["tags"],
//           projects: values["projects"],
//         };
//         // save new user
//         validation.resetForm();
//       }
//       toggle();
//     },
//   });

//   const ContactsProperties = createSelector(
//     (state) => state.contacts,
//     (Contacts) => ({
//       users: Contacts.users,
//       loading: Contacts.loading
//     })
//   );

//   const {
//     users, loading
//   } = useSelector(ContactsProperties);

//   const [modal, setModal] = useState(false);
//   const [isEdit, setIsEdit] = useState(false);
//   const [isLoading, setLoading] = useState(loading)

//   useEffect(() => {
//     if (users && !users.length) {
//       setIsEdit(false);
//     }
//   }, [dispatch, users]);

//   useEffect(() => {
//     setContact(users);
//     setIsEdit(false);
//   }, [users]);

//   useEffect(() => {
//     if (!isEmpty(users) && !!isEdit) {
//       setContact(users);
//       setIsEdit(false);
//     }
//   }, [users]);

//   const toggle = () => {
//     setModal(!modal);
//   };

//   const handleUserClick = arg => {
//     const user = arg;

//     setContact({
//       id: user.id,
//       name: user.name,
//       designation: user.designation,
//       email: user.email,
//       tags: user.tags,
//       projects: user.projects,
//     });
//     setIsEdit(true);

//     toggle();
//   };

//   //delete customer
//   const [deleteModal, setDeleteModal] = useState(false);

//   const onClickDelete = (users) => {
//     setContact(users.id);
//     setDeleteModal(true);
//   };

//   const handleDeleteUser = () => {
//     if (contact && contact.id) {
//     }
//     setDeleteModal(false);
//   };

//   const handleUserClicks = () => {
//     setContact("");
//     setIsEdit(false);
//     toggle();
//   };

//   const columns = useMemo(
//     () => [
//       {
//         header: "#",
//         accessorKey: "img",
//         cell: (cell) => (
//           <>
//             {!cell.getValue() ? (
//               <div className="avatar-xs">
//                 <span className="avatar-title rounded-circle">{cell.row.original.name.charAt(0)} </span>
//               </div>
//             ) : (
//               <div>
//                 <img className="rounded-circle avatar-xs" src={cell.getValue()} alt="" />
//               </div>
//             )}
//           </>
//         ),
//         enableColumnFilter: false,
//         enableSorting: true,
//       },
//       {
//         header: 'Name',
//         accessorKey: 'name',
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cell) => {
//           return (
//             <>
//               <h5 className='font-size-14 mb-1'>
//                 <Link to='#' className='text-dark'>{cell.getValue()}</Link>
//               </h5>
//               <p className="text-muted mb-0">{cell.row.original.designation}</p>
//             </>
//           )
//         }
//       },
//       {
//         header: 'Email',
//         accessorKey: 'email',
//         enableColumnFilter: false,
//         enableSorting: true,
//       },
//       {
//         header: 'Tags',
//         accessorKey: 'tags',
//         enableColumnFilter: false,
//         enableSorting: true,
//         cell: (cell) => {
//           return (
//             <div>
//               {
//                 cell.getValue()?.map((item, index) => (
//                   <Link to="#1" className="badge badge-soft-primary font-size-11 m-1" key={index}>{item}</Link>
//                 ))
//               }
//             </div>
//           );
//         },
//       },
//       {
//         header: 'Projects',
//         accessorKey: 'projects',
//         enableColumnFilter: false,
//         enableSorting: true,
//       },
//       {
//         header: 'Action',
//         cell: (cellProps) => {
//           return (
//             <div className="d-flex gap-3">
//               <Link
//                 to="#"
//                 className="text-success"
//                 onClick={() => {
//                   const userData = cellProps.row.original;
//                   handleUserClick(userData);
//                 }}
//               >
//                 <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
//               </Link>
//               <Link
//                 to="#"
//                 className="text-danger"
//                 onClick={() => {
//                   const userData = cellProps.row.original; onClickDelete(userData);
//                 }}>
//                 <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
//               </Link>
//             </div>
//           );
//         }
//       },
//     ],
//     []
//   );

//   return (
//     <React.Fragment>
//       <DeleteModal
//         show={deleteModal}
//         onDeleteClick={handleDeleteUser}
//         onCloseClick={() => setDeleteModal(false)}
//       />
//       <div className="page-content">
//         <Container fluid>
//           {/* Render Breadcrumbs */}
//           <Breadcrumbs title="Contacts" breadcrumbItem="User List" />
//           <Row>
//             {
//               isLoading ? <Spinners setLoading={setLoading} />
//                 :
//                 <Col lg="12">
//                   <Card>
//                     <CardBody>
//                       <TableContainer
//                         columns={columns}
//                         data={users || []}
//                         isGlobalFilter={true}
//                         isPagination={true}
//                         SearchPlaceholder="Search..."
//                         isCustomPageSize={true}
//                         isAddButton={true}
//                         handleUserClick={handleUserClicks}
//                         buttonClass="btn btn-success btn-rounded waves-effect waves-light addContact-modal mb-2"
//                         buttonName="New Contact"
//                         tableClass="align-middle table-nowrap table-hover dt-responsive nowrap w-100 dataTable no-footer dtr-inline"
//                         theadClass="table-light"
//                         paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
//                         pagination="pagination"
//                       />
//                     </CardBody>
//                   </Card>
//                 </Col>
//             }

//             <Modal isOpen={modal} toggle={toggle}>
//               <ModalHeader toggle={toggle} tag="h4">
//                 {!!isEdit ? "Edit User" : "Add User"}
//               </ModalHeader>
//               <ModalBody>
//                 <Form
//                   onSubmit={e => {
//                     e.preventDefault();
//                     validation.handleSubmit();
//                     return false;
//                   }}
//                 >
//                   <Row>
//                     <Col xs={12}>
//                       <div className="mb-3">
//                         <Label className="form-label">Name</Label>
//                         <Input
//                           name="name"
//                           type="text"
//                           placeholder="Insert Name"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.name || ""}
//                           invalid={
//                             validation.touched.name &&
//                               validation.errors.name
//                               ? true
//                               : false
//                           }
//                         />
//                         {validation.touched.name &&
//                           validation.errors.name ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.name}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                       <div className="mb-3">
//                         <Label className="form-label">Designation</Label>
//                         <Input
//                           name="designation"
//                           label="Designation"
//                           placeholder="Insert Designation"
//                           type="text"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.designation || ""}
//                           invalid={
//                             validation.touched.designation &&
//                               validation.errors.designation
//                               ? true
//                               : false
//                           }
//                         />
//                         {validation.touched.designation &&
//                           validation.errors.designation ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.designation}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                       <div className="mb-3">
//                         <Label className="form-label">Email</Label>
//                         <Input
//                           name="email"
//                           label="Email"
//                           type="email"
//                           placeholder="Insert Email"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.email || ""}
//                           invalid={
//                             validation.touched.email &&
//                               validation.errors.email
//                               ? true
//                               : false
//                           }
//                         />
//                         {validation.touched.email &&
//                           validation.errors.email ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.email}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                       <div className="mb-3">
//                         <Label className="form-label">Option</Label>
//                         <Input
//                           type="select"
//                           name="tags"
//                           className="form-select"
//                           multiple={true}
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.tags || []}
//                           invalid={
//                             validation.touched.tags &&
//                               validation.errors.tags
//                               ? true
//                               : false
//                           }
//                         >
//                           <option>Photoshop</option>
//                           <option>illustrator</option>
//                           <option>Html</option>
//                           <option>Php</option>
//                           <option>Java</option>
//                           <option>Python</option>
//                           <option>UI/UX Designer</option>
//                           <option>Ruby</option>
//                           <option>Css</option>
//                         </Input>
//                         {validation.touched.tags &&
//                           validation.errors.tags ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.tags}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                       <div className="mb-3">
//                         <Label className="form-label">Projects</Label>
//                         <Input
//                           name="projects"
//                           label="Projects"
//                           type="text"
//                           placeholder="Insert Projects"
//                           onChange={validation.handleChange}
//                           onBlur={validation.handleBlur}
//                           value={validation.values.projects || ""}
//                           invalid={
//                             validation.touched.projects &&
//                               validation.errors.projects
//                               ? true
//                               : false
//                           }
//                         />
//                         {validation.touched.projects &&
//                           validation.errors.projects ? (
//                           <FormFeedback type="invalid">
//                             {validation.errors.projects}
//                           </FormFeedback>
//                         ) : null}
//                       </div>
//                     </Col>
//                   </Row>
//                   <Row>
//                     <Col>
//                       <div className="text-end">
//                         <button
//                           type="submit"
//                           className="btn btn-success save-user"
//                         >
//                           Save
//                         </button>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Form>
//               </ModalBody>
//             </Modal>
//           </Row>
//         </Container>
//       </div>
//       <ToastContainer />
//     </React.Fragment>
//   );
// };

// export default withRouter(ContactsList);
