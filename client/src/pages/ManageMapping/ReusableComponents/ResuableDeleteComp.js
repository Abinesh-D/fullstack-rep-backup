import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

const DeleteModal = ({ show, toggle, message, onConfirm, dataName }) => {
    return (
        <Modal isOpen={show} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>
                Confirm Deletion
            </ModalHeader>
            <ModalBody>
                <p>{message}</p>
                <p><strong>{dataName}</strong></p>
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












// import React from "react";
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

// const DeleteModal = ({ show, toggle, message, onConfirm }) => {
//     return (
//         <Modal isOpen={show} toggle={toggle} centered>
//             <ModalHeader toggle={toggle}>
//                 Confirm Deletion
//             </ModalHeader>
//             <ModalBody>
//                 {message}
//             </ModalBody>
//             <ModalFooter>
//                 <Button color="secondary" onClick={toggle}>
//                     Cancel
//                 </Button>
//                 <Button color="danger" onClick={onConfirm}>
//                     Delete
//                 </Button>
//             </ModalFooter>
//         </Modal>
//     );
// };

// export default DeleteModal;
