import React, { useState } from "react";
import { Row, Col, Label, Input, Button, Spinner, Toast, ToastBody, ToastHeader } from "reactstrap";
import ImageUploader from "../../ReusableComponents/ProjectImageUpload";

const IntroductionTab = ({
    projectFormData,
    setProjectFormData,
    handleProjectChange,
    handleIntroSave,
    id,
    handleUploadImage,
    handleProjectImageDelete,
}) => {
    const [saveLoading, setSaveLoading] = useState(false);

    const [toast, setToast] = useState({ visible: false, type: "", message: "" });

    const showToast = (type, message) => {
        setToast({ visible: true, type, message });
        setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
    };

    const onSave = async () => {
        setSaveLoading(true);
        try {
            await handleIntroSave();
            showToast("success", "✅ Saved successfully!");
        } catch (error) {
            showToast("danger", "❌ Save failed. Try again.");
        }
        setSaveLoading(false);
    };

    const onImageUpload = async (file) => {
        try {
            await handleUploadImage(file);
            showToast("success", "📤 Image uploaded successfully!");
        } catch (error) {
            showToast("danger", "❌ Upload failed.");
        }
    };

    const onImageDelete = async (img) => {
        try {
            await handleProjectImageDelete(img);
            showToast("success", "🗑️ Image deleted successfully!");
        } catch (error) {
            showToast("danger", "❌ Delete failed.");
        }
    };

    return (
        <>
            <Row>
                <Col lg="6">
                    <div className="mb-3">
                        <Label for="project-title-input">Project Title</Label>
                        <Input
                            type="text"
                            name="projectTitle"
                            className="form-control"
                            id="project-title-input"
                            placeholder="Enter Project Title"
                            value={projectFormData.projectTitle}
                            onChange={handleProjectChange}
                        />
                    </div>
                </Col>
                <Col lg="6">
                    <div className="mb-3">
                        <Label for="project-subtitle-input">Project Sub Title</Label>
                        <Input
                            type="text"
                            name="projectSubTitle"
                            className="form-control"
                            id="project-subtitle-input"
                            placeholder="Enter Project Sub Title"
                            value={projectFormData.projectSubTitle}
                            onChange={handleProjectChange}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label for="search-features">Search Features</Label>
                        <Input
                            type="textarea"
                            rows="10"
                            name="searchFeatures"
                            className="form-control"
                            id="search-features"
                            placeholder="Enter Project Search Features"
                            value={projectFormData.searchFeatures}
                            onChange={handleProjectChange}
                        />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg="12">
                    <div className="mb-3">
                        <Label className="fw-bold">Upload Project Images</Label>
                        <ImageUploader
                            images={projectFormData.projectImageUrl}
                            onUpload={onImageUpload}
                            onDelete={onImageDelete}
                        />
                    </div>
                </Col>
            </Row>

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
                        onClick={onSave}
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
                        💾 Don’t forget to save! Make sure all fields are filled and an image is uploaded before saving. Otherwise, your changes won’t be stored.
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











// import React, { useEffect } from "react";
// import { Row, Col, Label, Input, Button } from "reactstrap";
// import ImageUploader from "../../ReusableComponents/ProjectImageUpload";

// const IntroductionTab = ({
//     projectFormData,
//     setProjectFormData,
//     handleProjectChange,
//     handleIntroSave,
//     id,
//     handleUploadImage,
//     handleProjectImageDelete,
// }) => {

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
//                 <Col lg="6">
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

//             <Row>
//                 <Col lg="12">
//                     <div className="mb-3">
//                         <Label className="fw-bold">Upload Project Images</Label>
//                         <ImageUploader
//                             images={projectFormData.projectImageUrl}
//                             onUpload={handleUploadImage}
//                             onDelete={handleProjectImageDelete}
//                         />
//                     </div>
//                 </Col>
//             </Row>

//             <Row style={{ backgroundColor: "#fff3cd", border: "1px solid #ffeeba", borderRadius: "8px", padding: "0.5rem", alignItems: "center" }}>
//                 <Col lg="2" className="mt-3 mt-lg-0">
//                     <Button color="success" onClick={handleIntroSave} className="w-100"
//                         style={{ fontWeight: 600, padding: "0.6rem 1rem", borderRadius: "6px", }}
//                     >
//                         Save
//                     </Button>
//                 </Col>
//                 <Col lg="10">
//                     <p style={{ margin: 0, color: "#856404", fontWeight: 500, fontSize: "0.8rem", display: "flex", alignItems: "center", }}>
//                         💾 Don’t forget to save! Make sure all fields are filled and an image is uploaded before saving. Otherwise, your changes won’t be stored.
//                     </p>
//                 </Col>
               
//             </Row>

//         </>
//     );
// };

// export default IntroductionTab;












// // import React, { useState, useCallback } from "react";
// // import { useDropzone } from "react-dropzone";
// // import { Row, Col, Label, Input, Button, Card } from "reactstrap";
// // import ImageUploader from "../../ReusableComponents/ProjectImageUpload";


// // const IntroductionTab = ({
// //     projectFormData,
// //     handleProjectChange,
// //     handleIntroSave,
// //     reportData,
// //     id,
// //     handleUploadImage,
// //     setProjectFormData,
// //     handleProjectImageDelete,
    
// // }) => {

// //     const validID = reportData[0]?._id === id;

// //     return (
// //         <>
// //             {validID && (
// //                 <>
// //                     <Row>
// //                         <Col lg="6">
// //                             <div className="mb-3">
// //                                 <Label for="project-title-input">Project Title</Label>
// //                                 <Input
// //                                     type="text"
// //                                     name="projectTitle"
// //                                     className="form-control"
// //                                     id="project-title-input"
// //                                     placeholder="Enter Project Title"
// //                                     value={projectFormData.projectTitle || ""}
// //                                     onChange={handleProjectChange}
// //                                 />
// //                             </div>
// //                         </Col>
// //                         <Col lg="6">
// //                             <div className="mb-3">
// //                                 <Label for="project-subtitle-input">Project Sub Title</Label>
// //                                 <Input
// //                                     type="text"
// //                                     name="projectSubTitle"
// //                                     className="form-control"
// //                                     id="project-subtitle-input"
// //                                     placeholder="Enter Project Sub Title"
// //                                     value={projectFormData.projectSubTitle || ""}
// //                                     onChange={handleProjectChange}
// //                                 />
// //                             </div>
// //                         </Col>
// //                     </Row>

// //                     <Row>
// //                         <Col lg="12">
// //                             <div className="mb-3">
// //                                 <Label for="search-features">Search Features</Label>
// //                                 <Input
// //                                     type="textarea"
// //                                     rows="10"
// //                                     name="searchFeatures"
// //                                     className="form-control"
// //                                     id="search-features"
// //                                     placeholder="Enter Project Search Features"
// //                                     value={projectFormData.searchFeatures || ""}
// //                                     onChange={handleProjectChange}
// //                                 />
// //                             </div>
// //                         </Col>                      
// //                     </Row>
// //                     <Row>
// //                         <Col lg="12">
// //                             <div className="mb-3">
// //                                 <Label className="fw-bold">Upload Project Images</Label>
// //                                 <ImageUploader
// //                                     images={projectFormData.projectImageUrl}
// //                                     onUpload={handleUploadImage}
// //                                     onDelete={(img) =>  handleProjectImageDelete(img) }
// //                                 />
// //                             </div>
// //                         </Col>
// //                     </Row>

// //                     <Row>
// //                         <Col lg="2" className="mt-3">
// //                             <Button color="success" onClick={handleIntroSave} className="w-100">
// //                                 Save
// //                             </Button>
// //                         </Col>
// //                     </Row>
// //                 </>
// //             )}
// //         </>
// //     );
// // };

// // export default IntroductionTab;
