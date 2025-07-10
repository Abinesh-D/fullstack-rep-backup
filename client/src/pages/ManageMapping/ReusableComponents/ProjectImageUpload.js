import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Row, Col, Card, Button } from "reactstrap";
import { X } from "react-feather";
import { Image } from "antd";

const ImageUploader = ({ images, onUpload, onDelete }) => {

    const [hoveredImage, setHoveredImage] = useState(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: "image/*",
        multiple: true,
        onDrop: onUpload,
    });

    console.log("images", images);

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
                                    <Image src={img.base64Url}alt={img.name}className="rounded"onMouseEnter={() => setHoveredImage(img._id || idx)}onMouseLeave={() => setHoveredImage(null)}
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
                                    <Button size="sm" color="danger" onClick={() => onDelete(img)} className="position-absolute"
                                        style={{
                                            top: "5px",
                                            right: "5px",
                                            borderRadius: "50%",
                                            padding: "0.4rem",
                                            lineHeight: "1",
                                            zIndex: 10,
                                        }}
                                    >
                                        <X size={15} />
                                    </Button>

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
