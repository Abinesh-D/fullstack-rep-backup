import React, { useState } from "react";
import { Row, Col, Label, Input, Button, Spinner, Toast, ToastBody, ToastHeader } from "reactstrap";
import ImageUploader from "../../ReusableComponents/ProjectImageUpload";
import axios from "axios"

const IntroductionTab = ({
    projectFormData,
    setProjectFormData,
    handleProjectChange,
    // handleIntroSave,
    id,
    // handleUploadImage,
    // handleProjectImageDelete,
}) => {
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
            searchFeatures: projectFormData.searchFeatures || "",
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
                showToast("success", "✅ Saved successfully!");
            }
        } catch (error) {
            console.error("❌ Error saving introduction:", error);
            showToast("danger", "❌ Save failed. Try again.");
        } finally {
            setSaveLoading(false);
        }
    };




    // const handleIntroSave = async () => {
    //     setSaveLoading(true);
    //     const formData = {
    //         projectTitl: projectFormData.projectTitle || "",
    //         projectSubTitle: projectFormData.projectSubTitle || "",
    //         searchFeatures: projectFormData.searchFeatures || "",
    //     }


    //     // projectFormData.projectImageUrl?.forEach((img) => {
    //     //     if (img.file) {
    //     //         formData.append("images", img.file);
    //     //     }
    //     // });

    //     try {
    //         console.log('formData', formData)
    //         const response = await axios.post(`http://localhost:8080/live/projectname/update-introduction/${id}`,
    //             formData,
    //             { headers: { "Content-Type": "application/json" } }
    //         );

    //         console.log('response.data.introduction', response.data)
    //         if (response.status === 200) {
                // setProjectFormData((prev) => ({
                //     ...prev,
                //     ...response.data.data.stages.introduction[0],
                // }));
    //         }            

    //         showToast("success", "✅ Saved successfully!");
    //     } catch (error) {
    //         console.error("❌ Error saving introduction:", error);
    //         showToast("danger", "❌ Save failed. Try again.");
    //     } finally {
    //         setSaveLoading(false);

    //     }
    // };



    const handleProjectImageDelete = async (img) => {
        try {
            await axios.delete(
                `http://localhost:8080/live/projectname/delete-image/${id}/${img._id}`
            );
            showToast("success", "🗑️ Image deleted successfully!");
            setProjectFormData((prev) => ({
                ...prev,
                projectImageUrl: prev.projectImageUrl.filter(
                    (i) => i._id !== img._id
                ),
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
            projectImageUrl: prev.projectImageUrl.filter(
                (i) => i._id !== img._id
            ),
        }));
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
                <Col lg="4">
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
                 <Col lg="2">
                    <div className="mb-3">
                        <Label for="project-id-input">Project ID</Label>
                        <Input
                            type="text"
                            name="projectId"
                            className="form-control"
                            id="project-id-input"
                            placeholder="Enter Project ID"
                            value={projectFormData.projectId}
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
                        💾 Don’t forget to save! Make sure all fields are filled 
                        before saving. Otherwise, your changes won’t be stored.
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
