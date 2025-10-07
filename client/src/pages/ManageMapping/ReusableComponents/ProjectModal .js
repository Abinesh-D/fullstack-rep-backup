import React, { useState } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Button,
    FormFeedback,
    Spinner
} from "reactstrap";

const ProjectModal = ({
    mode,
    isOpen,
    toggle,
    loading,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    onCreate,
    projectTypeOptions,
    setProjectTypeId,
}) => {
    const [errors, setErrors] = useState({ name: "", type: "" });
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const validateForm = () => {
        let nameError = "";
        let typeError = "";

        if (projectName.trim().length < 4) {
            nameError = "Project name must be at least 4 characters.";
        }

        if (!projectType || projectType === "") {
            typeError = "Please select a project type.";
        }

        setErrors({ name: nameError, type: typeError });

        return !(nameError || typeError);
    };

    const handleCreate = () => {
        setHasSubmitted(true); 
        const isValid = validateForm();

        if (isValid) {
            onCreate(); 
        }
    };

    const handleProjectTypeChange = (e) => {
        const selectedLabel = e.target.value;
        setProjectType(selectedLabel);
        const selectedOption = projectTypeOptions.find(
            (type) => type.label === selectedLabel
        );
        setProjectTypeId(selectedOption ? selectedOption.value : null);
    };




    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="projectName">Project Name</Label>
                    <Input
                        id="projectName"
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Enter project name"
                        invalid={hasSubmitted && errors.name ? true : false}
                    />
                    {hasSubmitted && errors.name && (
                        <FormFeedback>{errors.name}</FormFeedback>
                    )}
                </FormGroup>

                <FormGroup>
                    <Label for="projectType">Project Type</Label>
                    <Input
                        type="select"
                        id="projectType"
                        value={projectType}
                        // onChange={(e) => setProjectType(e.target.value)}
                        onChange={handleProjectTypeChange}
                        invalid={hasSubmitted && errors.type ? true : false}
                    >
                        <option value="">--Select Report Type--</option>
                        {projectTypeOptions.map((type) => (
                            <option key={type.value} value={type.label}>
                                {type.label}
                            </option>
                        ))}
                    </Input>
                    {hasSubmitted && errors.type && (
                        <FormFeedback>{errors.type}</FormFeedback>
                    )}
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
                <Button
                    color="success"
                    onClick={() => handleCreate()}
                >
                    {loading ? (
                        <>
                            <Spinner size="sm" color="light" className="me-2" />
                            {mode === "1" ? "Updating..." : "Creating..."}
                        </>
                    ) : (
                        mode === "1" ? "Update" : "Create"
                    )}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ProjectModal;












// import React from "react";
// import {
//     Modal,
//     ModalHeader,
//     ModalBody,
//     ModalFooter,
//     FormGroup,
//     Label,
//     Input,
//     Button,
// } from "reactstrap";

// const ProjectModal = ({
//     isOpen,
//     toggle,
//     projectName,
//     setProjectName,
//     projectType,
//     setProjectType,
//     onCreate,
//     projectTypeOptions
// }) => {



//     return (
//         <Modal isOpen={isOpen} toggle={toggle} centered>
//             <ModalHeader toggle={toggle}>Create New Project</ModalHeader>
//             <ModalBody>
//                 <FormGroup>
//                     <Label for="projectName">Project Name</Label>
//                     <Input
//                         id="projectName"
//                         type="text"
//                         value={projectName}
//                         onChange={(e) => setProjectName(e.target.value)}
//                         placeholder="Enter project name"
//                     />
//                 </FormGroup>

//                 <FormGroup>
//                     <Label for="projectType">Project Type</Label>
//                     <Input
//                         type="select"
//                         id="projectType"
//                         value={projectType}
//                         onChange={(e) => setProjectType(e.target.value)}
//                     >
//                         <option value="">--Select Report Type--</option>
//                         {projectTypeOptions.map((type) => (
//                             <option key={type.value} value={type.label}>
//                                 {type.label}
//                             </option>
//                         ))}
//                     </Input>
//                 </FormGroup>


//             </ModalBody>
//             <ModalFooter>
//                  <Button color="secondary" onClick={toggle}>
//                     Cancel
//                 </Button>
//                 <Button color="success" onClick={onCreate}>
//                     Create
//                 </Button>
               
//             </ModalFooter>
//         </Modal>
//     );
// };

// export default ProjectModal;
