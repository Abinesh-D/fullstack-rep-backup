import React, { useState } from "react";
import { Row, Col, Label, Input, Button, Spinner, Toast, ToastBody, ToastHeader, } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
import ImageUploader from "../../ReusableComponents/ProjectImageUpload";
import RichTextEditor from "../../../../components/Common/commonReport/RichTextEditor";


const IntroductionTab = ({
    projectFormData,
    setProjectFormData,
    handleProjectChange,
    id,
}) => {
    

    const singleProject = useSelector(state => state.patentSlice.singleProject);


    const [saveLoading, setSaveLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, type: "", message: "" });

    const showToast = (type, message) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
    };

    const handleIntroSave = async () => {
        setSaveLoading(true);

        const formData = {
            projectTitle: projectFormData.projectTitle || "",
            projectSubTitle: projectFormData.projectSubTitle || "",
            projectId: projectFormData.projectId || "",
            executiveSummaryTotalColumn: projectFormData.executiveSummaryTotalColumn || "",
            searchFeatures: projectFormData.searchFeatures || "",
            textEditor: projectFormData.textEditor || "",

        };
        try {
            const response = await axios.post(
                `http://localhost:8080/live/projectname/update-introduction/${id}`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status === 200) {
                setProjectFormData((prev) => ({
                    ...prev,
                    ...(response.data.data.stages.introduction?.[0] || {}),
                }));
                showToast("success", "Saved successfully!");
            }
        } catch (error) {
            console.error("❌ Error saving introduction:", error);
            showToast("danger", "❌ Save failed. Try again.");
        } finally {
            setSaveLoading(false);
        }
    };

    const handleProjectImageDelete = async (img) => {
        try {
            await axios.delete(
                `http://localhost:8080/live/projectname/delete-image/${id}/${img._id}`
            );
            showToast("success", "🗑️ Image deleted successfully!");
            setProjectFormData((prev) => ({
                ...prev,
                projectImageUrl: prev.projectImageUrl.filter((i) => i._id !== img._id),
            }));
        } catch (error) {
            showToast("danger", "❌ Delete failed.");
            console.error("❌ Delete Error:", error.response?.data || error.message);
        }
    };

    const handleUploadImage = (acceptedFiles) => {
        const newImages = acceptedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            formattedSize: `${(file.size / 1024).toFixed(2)} KB`,
            type: file.type,
            base64Url: URL.createObjectURL(file),
            file,
            uploadedAt: new Date(),
        }));

        setProjectFormData((prev) => ({
            ...prev,
            projectImageUrl: [...prev.projectImageUrl, ...newImages],
        }));
    };

    const handleRemoveLocalImage = (img) => {
        setProjectFormData((prev) => ({
            ...prev,
            projectImageUrl: prev.projectImageUrl.filter((i) => i._id !== img._id),
        }));
    };

    const formFields = [
        {
            label: "Project Title",
            name: "projectTitle",
            type: "text",
            lg: 6,
        },
        {
            label: "Project Sub Title",
            name: "projectSubTitle",
            type: "text",
            lg: 4,
        },
        {
            label: "Project ID",
            name: "projectId",
            type: "text",
            lg: 2,
        },
        ...(singleProject?.projectTypeId === "0002"
            ? [
                {
                    label: "ExecutiveSummary Total Column Number", 
                    name: "executiveSummaryTotalColumn", 
                    type: "number", 
                    rows: 10, 
                    lg: 12,
                },
            ]
            : []),
        {
            label: "Search Features",
            name: "searchFeatures",
            type: "textarea",
            rows: 10,
            lg: 12,
        },
    ];



    const [content, setContent] = useState("");

    const handleSelectionChange = (range, source, editor) => {
    };

    return (
        <>
            <Row>

                {/* <Row>
                    <Col lg="12">
                        <div
                            style={{
                                padding: "20px",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            }}
                        >
                            <RichTextEditor
                                value={projectFormData.textEditor}
                                onChange={(value, delta, source, editor) => {
                                    setProjectFormData({
                                        textEditor: value,
                                    });
                                }}
                                onChangeSelection={handleSelectionChange}
                                onFocus={() => console.log("Editor focused")}
                                onBlur={() => console.log("Editor blurred")}
                                style={{
                                    minHeight: "250px",
                                }}
                            />

                            <style>
                                {`
                                    .ql-container {
                                        resize: vertical;
                                        overflow: auto;
                                    }
                                    .ql-editor {
                                        min-height: 200px;
                                        max-height: 400px;
                                    }
                                    .ql-toolbar {
                                        border-radius: 6px 6px 0 0;
                                    }
                                    .ql-container.ql-snow {
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                    }
                                        .ql-toolbar {
                                        background-color: #f8f9fa;
                                        border-radius: 8px 8px 0 0;
                                        border: none;
                                        padding: 6px;
                                        box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.06);
                                    }

                                    .ql-container {
                                        border-radius: 0 0 8px 8px;
                                        border: 1px solid #ddd;
                                        resize: vertical;
                                    }

                                    .ql-editor {
                                        min-height: 250px;
                                        padding: 12px;
                                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                    }

                                    .ql-container:focus-within {
                                        border-color: #007bff;
                                        box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.15);
                                    }
                                `}
                            </style>

                            <button
                                className="btn btn-primary px-4"
                                style={{ marginTop: "15px" }}
                                onClick={() => console.log("Saved HTML:", content)}
                            >
                                Save
                            </button>

                        </div>

                    </Col>
                </Row> */}








                {/* <div
                    style={{
                        maxWidth: "800px",
                        margin: "40px auto",
                        padding: "20px",
                        backgroundColor: "#ffffff",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                >
                    <RichTextEditor
                        value={content}
                        onChange={(value, delta, source, editor) => {
                            setContent(value);
                            console.log(delta, source, editor, "HTML output:", value);
                        }}
                        onChangeSelection={handleSelectionChange}
                        onFocus={() => console.log("Editor focused")}
                        onBlur={() => console.log("Editor blurred")}
                        style={{
                            minHeight: "250px",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "8px",
                            backgroundColor: "#fafafa",
                        }}
                    />

                    <button
                        style={{
                            marginTop: "15px",
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "background-color 0.2s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
                        onClick={() => console.log("Saved HTML:", content)}
                    >
                        Save
                    </button>
                </div> */}



                {formFields.map((field) => (
                    <Col key={field.name} lg={field.lg || 12}>
                        <div className="mb-3">
                            <Label for={field.name}>{field.label}</Label>
                            {field.type === "textarea" ? (
                                <Input
                                    type="textarea"
                                    rows={field.rows || 3}
                                    name={field.name}
                                    id={field.name}
                                    placeholder={`Enter ${field.label}`}
                                    className="form-control"
                                    value={projectFormData[field.name]}
                                    onChange={handleProjectChange}
                                />
                            ) : (
                                // <Input
                                //     type={field.type}
                                //     name={field.name}
                                //     id={field.name}
                                //     placeholder={`Enter ${field.label}`}
                                //     className="form-control"
                                //     value={projectFormData[field.name]}
                                    //     onChange={handleProjectChange}
                                    // />

                                    <Input
                                        type={field.type}
                                        name={field.name}
                                        id={field.name}
                                        placeholder={`Enter ${field.label}`}
                                        className="form-control"
                                        value={projectFormData[field.name]}
                                        min={field.type === "number" ? 0 : undefined}
                                        onChange={(e) => {
                                            if (field.type === "number" && e.target.value < 0) {
                                                e.target.value = 0;
                                            }
                                            handleProjectChange(e);
                                        }}
                                    />

                            )}
                        </div>
                    </Col>
                ))}
            </Row>

            {/* <Row>
        <Col lg="12">
          <div className="mb-3">
            <Label className="fw-bold">Upload Project Images</Label>
            <ImageUploader
              images={projectFormData.projectImageUrl}
              onUpload={handleUploadImage}
              onDelete={handleProjectImageDelete}
              onRemove={handleRemoveLocalImage}
            />
          </div>
        </Col>
      </Row> */}

            <Row
                style={{
                    backgroundColor: "#fff3cd",
                    border: "1px solid #ffeeba",
                    borderRadius: "8px",
                    padding: "0.5rem",
                    alignItems: "center",
                }}
            >
                <Col lg="2" className="mt-3 mt-lg-0">
                    <Button
                        color="success"
                        onClick={handleIntroSave}
                        className="w-100"
                        style={{ fontWeight: 600, padding: "0.6rem 1rem", borderRadius: "6px" }}
                        disabled={saveLoading}
                    >
                        {saveLoading ? <Spinner size="sm" /> : "Save"}
                    </Button>
                </Col>
                <Col lg="10">
                    <p
                        style={{
                            margin: 0,
                            color: "#856404",
                            fontWeight: 500,
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        💾 Don’t forget to save! Make sure all fields are filled before saving.
                        Otherwise, your changes won’t be stored.
                    </p>
                </Col>
            </Row>

            {toast.visible && (
                <div
                    style={{
                        position: "fixed",
                        top: "1rem",
                        right: "1rem",
                        zIndex: 9999,
                    }}
                >
                    <Toast isOpen={toast.visible} className={`bg-${toast.type} text-white`}>
                        <ToastHeader icon={toast.type}>
                            {toast.type === "success" ? "Success" : "Error"}
                        </ToastHeader>
                        <ToastBody>{toast.message}</ToastBody>
                    </Toast>
                </div>
            )}
        </>
    );
};

export default IntroductionTab;























// import React, { useState } from "react";
// import { Row, Col, Label, Input, Button, Spinner, Toast, ToastBody, ToastHeader } from "reactstrap";
// import ImageUploader from "../../ReusableComponents/ProjectImageUpload";
// import axios from "axios"

// const IntroductionTab = ({
//     projectFormData,
//     setProjectFormData,
//     handleProjectChange,
//     // handleIntroSave,
//     id,
//     // handleUploadImage,
//     // handleProjectImageDelete,
// }) => {
//     const [saveLoading, setSaveLoading] = useState(false);

//     const [toast, setToast] = useState({ visible: false, type: "", message: "" });

//     const showToast = (type, message) => {
//         setToast({ visible: true, type, message });
//         setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
//     };


//     const handleIntroSave = async () => {
//         setSaveLoading(true);

//         const formData = {
//             projectTitle: projectFormData.projectTitle || "",
//             projectSubTitle: projectFormData.projectSubTitle || "",
//             projectId: projectFormData.projectId || "",
//             searchFeatures: projectFormData.searchFeatures || "",
//         };

//         try {
//             const response = await axios.post(
//                 `http://localhost:8080/live/projectname/update-introduction/${id}`,
//                 formData,
//                 { headers: { "Content-Type": "application/json" } }
//             );

//             if (response.status === 200) {
//                 setProjectFormData((prev) => ({
//                     ...prev,
//                     ...(response.data.data.stages.introduction?.[0] || {}),
//                 }));
//                 showToast("success", "✅ Saved successfully!");
//             }
//         } catch (error) {
//             console.error("❌ Error saving introduction:", error);
//             showToast("danger", "❌ Save failed. Try again.");
//         } finally {
//             setSaveLoading(false);
//         }
//     };




//     // const handleIntroSave = async () => {
//     //     setSaveLoading(true);
//     //     const formData = {
//     //         projectTitl: projectFormData.projectTitle || "",
//     //         projectSubTitle: projectFormData.projectSubTitle || "",
//     //         searchFeatures: projectFormData.searchFeatures || "",
//     //     }


//     //     // projectFormData.projectImageUrl?.forEach((img) => {
//     //     //     if (img.file) {
//     //     //         formData.append("images", img.file);
//     //     //     }
//     //     // });

//     //     try {
//     //         console.log('formData', formData)
//     //         const response = await axios.post(`http://localhost:8080/live/projectname/update-introduction/${id}`,
//     //             formData,
//     //             { headers: { "Content-Type": "application/json" } }
//     //         );

//     //         console.log('response.data.introduction', response.data)
//     //         if (response.status === 200) {
//                 // setProjectFormData((prev) => ({
//                 //     ...prev,
//                 //     ...response.data.data.stages.introduction[0],
//                 // }));
//     //         }            

//     //         showToast("success", "✅ Saved successfully!");
//     //     } catch (error) {
//     //         console.error("❌ Error saving introduction:", error);
//     //         showToast("danger", "❌ Save failed. Try again.");
//     //     } finally {
//     //         setSaveLoading(false);

//     //     }
//     // };



//     const handleProjectImageDelete = async (img) => {
//         try {
//             await axios.delete(
//                 `http://localhost:8080/live/projectname/delete-image/${id}/${img._id}`
//             );
//             showToast("success", "🗑️ Image deleted successfully!");
//             setProjectFormData((prev) => ({
//                 ...prev,
//                 projectImageUrl: prev.projectImageUrl.filter(
//                     (i) => i._id !== img._id
//                 ),
//             }));
//         } catch (error) {
//              showToast("danger", "❌ Delete failed.");
//             console.error("❌ Delete Error:", error.response?.data || error.message);
//         }
//     };


//     const handleUploadImage = (acceptedFiles) => {
//         const newImages = acceptedFiles.map((file) => ({
//             name: file.name,
//             size: file.size,
//             formattedSize: `${(file.size / 1024).toFixed(2)} KB`,
//             type: file.type,
//             base64Url: URL.createObjectURL(file),
//             file,
//             uploadedAt: new Date(),
//         }));

//         setProjectFormData((prev) => ({
//             ...prev,
//             projectImageUrl: [...prev.projectImageUrl, ...newImages],
//         }));
//     };



//     const handleRemoveLocalImage = (img) => {
//         setProjectFormData((prev) => ({
//             ...prev,
//             projectImageUrl: prev.projectImageUrl.filter(
//                 (i) => i._id !== img._id
//             ),
//         }));
//     };

//     return (
//         <>
//             <Row>
//                 <Col lg="6">
//                     <div className="mb-3">
//                         <Label for="project-title-input">Project Title</Label>
//                         <Input
//                             type="text"
//                             name="projectTitle"
//                             className="form-control"
//                             id="project-title-input"
//                             placeholder="Enter Project Title"
//                             value={projectFormData.projectTitle}
//                             onChange={handleProjectChange}
//                         />
//                     </div>
//                 </Col>
//                 <Col lg="4">
//                     <div className="mb-3">
//                         <Label for="project-subtitle-input">Project Sub Title</Label>
//                         <Input
//                             type="text"
//                             name="projectSubTitle"
//                             className="form-control"
//                             id="project-subtitle-input"
//                             placeholder="Enter Project Sub Title"
//                             value={projectFormData.projectSubTitle}
//                             onChange={handleProjectChange}
//                         />
//                     </div>
//                 </Col>
//                  <Col lg="2">
//                     <div className="mb-3">
//                         <Label for="project-id-input">Project ID</Label>
//                         <Input
//                             type="text"
//                             name="projectId"
//                             className="form-control"
//                             id="project-id-input"
//                             placeholder="Enter Project ID"
//                             value={projectFormData.projectId}
//                             onChange={handleProjectChange}
//                         />
//                     </div>
//                 </Col>
//             </Row>

//             <Row>
//                 <Col lg="12">
//                     <div className="mb-3">
//                         <Label for="search-features">Search Features</Label>
//                         <Input
//                             type="textarea"
//                             rows="10"
//                             name="searchFeatures"
//                             className="form-control"
//                             id="search-features"
//                             placeholder="Enter Project Search Features"
//                             value={projectFormData.searchFeatures}
//                             onChange={handleProjectChange}
//                         />
//                     </div>
//                 </Col>
//             </Row>

//             {/* <Row>
//                 <Col lg="12">
//                     <div className="mb-3">
//                         <Label className="fw-bold">Upload Project Images</Label>
//                         <ImageUploader
//                             images={projectFormData.projectImageUrl}
//                             onUpload={handleUploadImage}
//                             onDelete={handleProjectImageDelete}
//                             onRemove={handleRemoveLocalImage}
//                         />
//                     </div>
//                 </Col>
//             </Row> */}

//             <Row
//                 style={{
//                     backgroundColor: "#fff3cd",
//                     border: "1px solid #ffeeba",
//                     borderRadius: "8px",
//                     padding: "0.5rem",
//                     alignItems: "center",
//                 }}
//             >
//                 <Col lg="2" className="mt-3 mt-lg-0">
//                     <Button
//                         color="success"
//                         onClick={handleIntroSave}
//                         className="w-100"
//                         style={{ fontWeight: 600, padding: "0.6rem 1rem", borderRadius: "6px" }}
//                         disabled={saveLoading}
//                     >
//                         {saveLoading ? <Spinner size="sm" /> : "Save"}
//                     </Button>
//                 </Col>
//                 <Col lg="10">
//                     <p
//                         style={{
//                             margin: 0,
//                             color: "#856404",
//                             fontWeight: 500,
//                             fontSize: "0.8rem",
//                             display: "flex",
//                             alignItems: "center",
//                         }}
//                     >
//                         💾 Don’t forget to save! Make sure all fields are filled 
//                         before saving. Otherwise, your changes won’t be stored.
//                     </p>
//                 </Col>
//             </Row>

//             {toast.visible && (
//                 <div
//                     style={{
//                         position: "fixed",
//                         top: "1rem",
//                         right: "1rem",
//                         zIndex: 9999,
//                     }}
//                 >
//                     <Toast isOpen={toast.visible} className={`bg-${toast.type} text-white`}>
//                         <ToastHeader icon={toast.type}>
//                             {toast.type === "success" ? "Success" : "Error"}
//                         </ToastHeader>
//                         <ToastBody>{toast.message}</ToastBody>
//                     </Toast>
//                 </div>
//             )}
//         </>
//     );
// };

// export default IntroductionTab;