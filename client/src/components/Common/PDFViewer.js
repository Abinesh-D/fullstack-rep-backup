
import React from 'react';
import { PDFViewer } from 'react-view-pdf';

const MyPDFViewer = ({ pdfUrl }) => {
  if (!pdfUrl) {
    return <div>No PDF URL provided.</div>;
  }

  return (
      <PDFViewer url={pdfUrl} />
  );
};

export default MyPDFViewer;
