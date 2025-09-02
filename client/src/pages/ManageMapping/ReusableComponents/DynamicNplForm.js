import React from "react";
import { Form, Row, Col, Label, Input, Button, Spinner } from "reactstrap";

const DynamicForm = ({
    fieldGroups = [],
    formData = {},
    onChange,
    onSubmit,
    submitButton,
    loading = false,
}) => {
    return (
        <Form onSubmit={onSubmit}>
            {fieldGroups.map((group, rowIndex) => (
                <Row key={rowIndex} className="align-items-end">
                    {group.map((field) => (
                        <Col key={field.id} lg={field.colSize || 6}>
                            <div className="mb-3">
                                {field.type !== "button" && (
                                    <>
                                        <Label for={field.id}>{field.label}</Label>
                                        {field.type === "textarea" ? (
                                            <textarea
                                                id={field.id}
                                                className="form-control"
                                                rows={field.rows || 3}
                                                placeholder={field.placeholder}
                                                value={formData[field.id] || ""}
                                                onChange={onChange}
                                            />
                                        ) : (
                                            <Input
                                                type={field.type}
                                                id={field.id}
                                                placeholder={field.placeholder}
                                                value={formData[field.id] || ""}
                                                onChange={onChange}
                                            />
                                        )}
                                    </>
                                )}

                                {field.type === "button" && (
                                    <Button
                                        color={field.buttonProps?.color || "primary"}
                                        className="w-100"
                                        type="button"
                                        onClick={() =>
                                            field.buttonProps?.onClick &&
                                            field.buttonProps.onClick(formData)
                                        }
                                    >
                                        {"Fetch"}
                                        <>
                                            <Spinner size="sm" className="ms-2" color="light" style={{ display: loading ? 'inline-block' : 'none' }} />
                                        </>
                                    </Button>
                                )}
                            </div>
                        </Col>
                    ))}
                </Row>
            ))}

            {submitButton && (
                <Row>
                    <Col lg="2">
                        <div className="mb-3">
                            <Button
                                color={submitButton.color || "primary"}
                                className="w-100"
                                type="submit"
                            >
                                {submitButton.label}
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}
        </Form>
    );
};

export default DynamicForm;
















// import React from "react";
// import { Form, Row, Col, Label, Input, Button } from "reactstrap";

// const DynamicForm = ({
//     fieldGroups = [],
//     formData = {},
//     onChange,
//     onSubmit,
//     submitButton,
// }) => {
//     return (
//         <Form onSubmit={onSubmit}>
//             {fieldGroups.map((group, rowIndex) => (
//                 <Row key={rowIndex} className="align-items-end">
//                     {group.map((field) => (
//                         <Col key={field.id} lg={field.colSize || 6}>
//                             <div className="mb-3">
//                                 {field.type !== "button" && (
//                                     <>
//                                         <Label for={field.id}>{field.label}</Label>
//                                         {field.type === "textarea" ? (
//                                             <textarea
//                                                 id={field.id}
//                                                 className="form-control"
//                                                 rows={field.rows || 3}
//                                                 placeholder={field.placeholder}
//                                                 value={formData[field.id] || ""}
//                                                 onChange={onChange}
//                                             />
//                                         ) : (
//                                             <Input
//                                                 type={field.type}
//                                                 id={field.id}
//                                                 placeholder={field.placeholder}
//                                                 value={formData[field.id] || ""}
//                                                 onChange={onChange}
//                                             />
//                                         )}
//                                     </>
//                                 )}

//                                 {field.type === "button" && (
//                                     <Button
//                                         color={field.buttonProps?.color || "primary"}
//                                         className="w-100"
//                                         type="button"
//                                         onClick={field.buttonProps?.onClick}
//                                     >
//                                         {field.buttonProps?.text || "Click"}
//                                     </Button>
//                                 )}
//                             </div>
//                         </Col>
//                     ))}
//                 </Row>
//             ))}

//             {submitButton && (
//                 <Row>
//                     <Col lg="2">
//                         <div className="mb-3">
//                             <Button color={submitButton.color || "primary"} className="w-100" type="submit">
//                                 {submitButton.label}
//                             </Button>
//                         </div>
//                     </Col>
//                 </Row>
//             )}
//         </Form>
//     );
// };

// export default DynamicForm;
