import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Form,
    FormGroup,
    Label,
    Spinner,
    Toast,
    ToastBody,
    ToastHeader,
    Fade,
} from "reactstrap";
import axios from "axios";

const FeedbackModal = ({ isOpen, toggle }) => {
    const [patentNumber, setPatentNumber] = useState("");
    const [submittedBy, setSubmittedBy] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState({});
    const [touched, setTouched] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPatentNumber("");
            setSubmittedBy("");
            setError({});
            setTouched(false);
        }
    }, [isOpen]);

    const handleSubmit = async () => {
        let newError = {};
        let hasError = false;

        if (!submittedBy.trim()) {
            newError.submittedBy = "Your name is required";
            hasError = true;
        }
        if (!patentNumber.trim()) {
            newError.patentNumber = "Patent number is required";
            hasError = true;
        }

        setError(newError);
        setTouched(true);

        if (hasError) return;

        setSubmitting(true);
        try {
            await axios.post(
                "http://localhost:8080/live/feedback/save",
                {
                    patentNumber: patentNumber.trim(),
                    submittedBy: submittedBy.trim(),
                },
                { headers: { "Content-Type": "application/json" } }
            );

            toggle();
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 4000);
        } catch (err) {
            console.error("❌ Feedback Submit Error:", err);
            setError({ api: "Failed to submit feedback. Please try again." });
        }
        setSubmitting(false);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                toggle={toggle}
                centered
                size="md"
                fade={true}
                backdrop="static"
                className="rounded-3 shadow-sm"
            >
                <ModalHeader
                    toggle={toggle}
                    className="fw-bold text-primary border-bottom-0"
                >
                    💬 Provide Feedback
                </ModalHeader>
                <ModalBody>
                    <p className="text-muted mb-3">
                        Couldn’t fetch bibliographic data for this patent. Please provide the
                        <strong> Patent Number</strong> (with country code & kind code) and your
                        name. This helps us improve the tool for future users. 🚀
                    </p>
                    <Form>
                        <FormGroup className="mb-3">
                            <Label for="submittedBy">Your Name</Label>
                            <Input
                                id="submittedBy"
                                placeholder="e.g., John Doe"
                                value={submittedBy}
                                onChange={(e) => setSubmittedBy(e.target.value)}
                                invalid={touched && !!error.submittedBy}
                                className="rounded-2 shadow-sm"
                            />
                            {touched && error.submittedBy && (
                                <small className="text-danger">{error.submittedBy}</small>
                            )}
                        </FormGroup>
                        <FormGroup className="mb-3">
                            <Label for="patentNumber">Patent Number</Label>
                            <Input
                                id="patentNumber"
                                placeholder="e.g., US1234567B2"
                                value={patentNumber}
                                onChange={(e) => setPatentNumber(e.target.value)}
                                invalid={touched && !!error.patentNumber}
                                className="rounded-2 shadow-sm"
                            />
                            {touched && error.patentNumber && (
                                <small className="text-danger">{error.patentNumber}</small>
                            )}
                        </FormGroup>
                        {error.api && (
                            <p className="text-danger mt-2">{error.api}</p>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter className="border-top-0">
                    <Button
                        color="secondary"
                        onClick={toggle}
                        disabled={submitting}
                        className="rounded-pill px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-pill px-4"
                    >
                        {submitting ? (
                            <>
                                <Spinner size="sm" /> Submitting...
                            </>
                        ) : (
                            "Submit Feedback"
                        )}
                    </Button>
                </ModalFooter>
            </Modal>

            <div
                style={{
                    position: "fixed",
                    top: "20px",
                    right: "20px",
                    zIndex: 9999,
                }}
            >
                <Fade in={toastVisible}>
                    <Toast className="rounded-3 shadow-sm border-0">
                        <ToastHeader icon="success" className="text-success">
                            🎉 Thank You!
                        </ToastHeader>
                        <ToastBody>
                            Your feedback helps us improve the tool. 🌟
                        </ToastBody>
                    </Toast>
                </Fade>
            </div>
        </>
    );
};

export default FeedbackModal;
