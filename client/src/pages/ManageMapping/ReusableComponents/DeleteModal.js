import React from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from "reactstrap";

const DeleteModal = ({
    isOpen,
    toggle,
    onConfirm,
    projectName
}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
            <ModalBody>
                Are you sure you want to delete <strong className="text-danger font-size-13">{projectName}</strong>?
                This action cannot be undone.
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    Cancel
                </Button>
                <Button color="danger" onClick={onConfirm}>
                    Delete
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default DeleteModal;