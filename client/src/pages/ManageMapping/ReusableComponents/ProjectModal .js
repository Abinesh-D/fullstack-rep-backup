import React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    FormGroup,
    Label,
    Input,
    Button,
} from "reactstrap";

const ProjectModal = ({
    isOpen,
    toggle,
    projectName,
    setProjectName,
    projectType,
    setProjectType,
    onCreate,
    projectTypeOptions
}) => {
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
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="projectType">Project Type</Label>
                    <Input
                        type="select"
                        id="projectType"
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                    >
                        <option value="">--Select Report Type--</option>
                        {projectTypeOptions.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </Input>
                </FormGroup>


            </ModalBody>
            <ModalFooter>
                 <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
                <Button color="success" onClick={onCreate}>
                    Create
                </Button>
               
            </ModalFooter>
        </Modal>
    );
};

export default ProjectModal;
