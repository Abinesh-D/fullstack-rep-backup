import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Card } from "reactstrap";
import { Image } from "antd";
import { Trash } from "lucide-react";


const ImageUploader = ({ images, onUpload, onDelete, onRemove }) => {

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        multiple: true,
        onDrop: onUpload,
    });

    return (
        <div>
            <div {...getRootProps()} style={{ border: "2px dashed #ccc", borderRadius: "10px", padding: "30px", textAlign: "center", backgroundColor: isDragActive ? "#f1f1f1" : "#fafafa", cursor: "pointer", transition: "background-color 0.3s ease", }}>
                <input {...getInputProps()} />
                <p className="mb-2"> 📂 <strong>Drag & drop</strong> or <strong>click</strong> to select images </p>
                <small className="text-muted">Supports PNG, JPG, JPEG (Max 5MB)</small>
            </div>

            {images?.length > 0 && (
                <div className="mt-3">
                    <Row className="g-3">
                        {images.map((img, idx) => (
                            <Col key={idx} xxl="2" xl="2" lg="3" md="4" sm="6" xs="12">

                                <Card className="shadow-sm position-relative image-card">
                                    <Image src={img.base64Url} alt={img.name} className="rounded"
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            aspectRatio: "4 / 3",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            backgroundColor: "#f5f5f5",
                                            display: "block",
                                        }}
                                    />
                                    <span
                                        onClick={() =>
                                            img.public_id ? onDelete(img) : onRemove(img)
                                        }
                                        style={{
                                            position: "absolute",
                                            top: "5px",
                                            right: "5px",
                                            zIndex: 10,
                                            cursor: "pointer",
                                            color: img.public_id ? "red" : "#6c757d",
                                        }}
                                    >
                                        {img.public_id ? <Trash size={16} /> : <i className="mdi mdi-close fs-3 text-dark" />}
                                    </span>
                                    <div className="p-2">
                                        <p className="fw-bold mb-1 text-truncate">{img.name}</p>
                                        <p className="text-muted small mb-0">{img.formattedSize}</p>
                                    </div>
                                </Card>
                            </Col>

                        ))}
                    </Row>
                </div>

            )}
        </div>
    );
};

export default ImageUploader;
