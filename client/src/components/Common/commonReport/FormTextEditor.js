import React from "react";
import { Form, Card, CardBody, Col, Row, Container, } from "reactstrap";
import { Editor } from '@tinymce/tinymce-react';
import { TEXT_EDITOR_API_KEY } from "../../../config";


const FormTextEditor = () => {

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid={true}>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardBody>
                                    <h4 className="card-title">Tinymce wysihtml5</h4>
                                    <p className="card-title-desc">Bootstrap-wysihtml5 is a javascript
                                        plugin that makes it easy to create simple, beautiful wysiwyg editors
                                        with the help of wysihtml5 and Twitter Bootstrap.</p>
                                    <Form method="post">
                                        <Editor
                                            apiKey={TEXT_EDITOR_API_KEY}
                                            // onInit={(evt, edit or) => editorRef.current = editor}
                                            initialValue="Welcome"
                                            init={{
                                                height: 350,
                                                menubar: true,
                                                plugins: [
                                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                                ],
                                                toolbar: 'undo redo | blocks | ' +
                                                    'bold italic forecolor | alignleft aligncenter ' +
                                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                                    'removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default FormTextEditor;
