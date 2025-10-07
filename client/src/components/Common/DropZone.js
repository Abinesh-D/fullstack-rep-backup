import React from 'react';
import Dropzone from 'react-dropzone';
import { Button, Row, Col } from 'reactstrap';
import { Image, Popconfirm, Progress } from 'antd';

const CustomDropzone = ({ disabled, files, onDrop, onDelete, index, uploadProgress, onUpload, upload_btn, baseUrl }) => {
    return (
        <div className="custom-dropzone">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed lightgrey', marginBottom: '10px' }}>
                {!files.length ? (
                    <Dropzone
                        onDrop={acceptedFiles => onDrop(acceptedFiles, index)}
                        accept={[".jpg", ".jpeg", ".png"]}
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '5px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div>
                                    <div className="mb-3"><i className="display-4 text-muted bx bxs-cloud-upload" /></div>
                                    <h7>Drop here</h7>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                ) : (
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100px', overflow: 'hidden' }}>
                        {files.map((file, fileIndex) => (
                            <div key={fileIndex} >
                                {file.output_url !== '' && file.output_url !== undefined ?
                                    <Image src={baseUrl + file.output_url} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '5px' }} />
                                    :
                                    <img src={file.preview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100px', marginBottom: '5px' }} />
                                }
                                {uploadProgress > 0 && <Progress percent={uploadProgress} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Row className='my-3'>
                <Col className='text-center'>                
                    {files.length !== 0 && 
                    <Popconfirm placement="leftBottom" title={`Are You sure to delete ?`} onConfirm={() => onDelete(index)}>
                        <Button color="danger" size="sm" >Delete</Button>
                    </Popconfirm>
                    }
                    {upload_btn && !uploadProgress &&
                        <Button color="success" className='me-2 mx-2' size="sm" onClick={() => onUpload(index)}>Upload</Button>
                    }
                </Col>
            </Row>
        </div>
    );
};

export default CustomDropzone;
