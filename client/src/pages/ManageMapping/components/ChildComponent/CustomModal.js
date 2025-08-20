import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, FormFeedback } from "reactstrap";

const CustomModal = ({
    isOpen,
    toggle,
    title,
    onSubmit,
    inputError,
    submitLabel = "Submit",
    inputProps
}) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle} size="md">
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
                {inputProps ? (
                    <>
                        <Input {...inputProps} invalid={!!inputError} />
                        {inputError && <FormFeedback>{inputError}</FormFeedback>}
                    </>
                ) : null}
            </ModalBody>
            <ModalFooter>
                <Button
                    color="primary"
                    onClick={onSubmit}
                    disabled={!!inputError || !inputProps.value.trim()}
                >
                    {submitLabel}
                </Button>{" "}
            </ModalFooter>
        </Modal>
    );
};

export default CustomModal;
