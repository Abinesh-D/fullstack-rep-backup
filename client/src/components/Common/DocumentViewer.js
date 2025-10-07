import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
const DocumentViewer = ({ outputUrl, mimeType, fileName }) => {
  const [fileType, setFileType] = useState(null);
  const [activeDocument, setActiveDocument] = useState(null);
  const [hideDownload, setHideDownload] = useState(false);

  useEffect(() => {
    const mapMimeTypeToFileType = async (mimeType) => {
      switch (mimeType) {
        case 'application/pdf':
          return 'pdf';
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'docx';
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'pptx';
        case 'application/vnd.ms-powerpoint':
          return 'ppt';
        case 'application/msword':
          return 'doc';
        case 'text/plain':
          return 'txt';
        case 'application/vnd.ms-excel':
          return 'xls';
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'xlsx';
        default:
          return 'unknown';
      }
    };

    const fetchFileType = async () => {
      const type = await mapMimeTypeToFileType(mimeType);
      setFileType(type);
    };

    if (mimeType) {
      fetchFileType();
    }
  }, [mimeType]);

  useEffect(() => {
    if (fileType) {
      const docs = [
        {
          uri: outputUrl,
          fileType: fileType,
          fileName: fileName
        }
      ];
      setActiveDocument(docs[0]);
    }
  }, [fileType, outputUrl, fileName]);

  const config = {
    header: {
      disableHeader: false,
      disableFileName: false,
      retainURLParams: false,
      showSidebar: true,
    },
    pdfZoom: {
      defaultZoom: 1.0,
      zoomStep: 0.1,
    },
    sidebar: {
      showSidebar: true,
    },
    theme: {
      darkMode: false,
    },
  };
  

  const handleDocumentChange = (document) => {
    setActiveDocument(document);
  };

  return (
    <div>
      <style>
        {`
          #pdf-download {
            display: ${hideDownload ? '' : 'none'} !important; 
          }          
        `}
        
      </style>

      <DocViewer
        documents={activeDocument ? [activeDocument] : []}
        pluginRenderers={DocViewerRenderers}
        style={{ height: 500 }}
        onDocumentChange={handleDocumentChange}
        activeDocument={activeDocument}
        config={config}
      />
    </div>
  );
};

export default DocumentViewer;
