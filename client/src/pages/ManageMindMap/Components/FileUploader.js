import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa";

const ExcelFileUploader = ({ onFileUpload, id }) => {
  const fileInputRef = useRef(null);



   const handleFileChange = async (e, id) => {
      const file = e.target.files[0];
      if (!file) return;
  
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
        onFileUpload(sheetData, "excel", id);
      };
      reader.readAsBinaryString(file);
    };


  return (
    <div>
      <input
        type="file"
        accept=".xls,.xlsx"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileChange(e, id) }
      />
      <button
        onClick={() => fileInputRef.current.click()}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: "11px",
          color: "#107C41",
        }}
        title="Upload Excel File"
      >
        <FaFileExcel />
      </button>
    </div>
  );
};

export default ExcelFileUploader;










  // const handleFileChange = (event, id) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     processExcelFile(file, id);
  //   }
  // };

  // const processExcelFile = (file, id) => {
  //   const reader = new FileReader();
  //   reader.onload = (event) => {
  //     const arrayBuffer = event.target.result;
  //     const workbook = XLSX.read(arrayBuffer, { type: "array" });

  //     const sheetName = workbook.SheetNames[0];
  //     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  //     onFileUpload(sheetData, "excel", id);
  //   };

  //   reader.readAsArrayBuffer(file); 
  // };


// import React, { useRef } from "react";
// import * as XLSX from "xlsx";
// import { FaFileExcel } from "react-icons/fa";

// const ExcelFileUploader = ({ onFileUpload }) => {
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       processExcelFile(file);
//     }
//   };

//   const processExcelFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: "binary" });

//       const sheetName = workbook.SheetNames[0];
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//       onFileUpload(sheetData, "excel"); 
//     };
//     reader.readAsBinaryString(file);
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//       />
//       <button
//         onClick={() => fileInputRef.current.click()}
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "13px",
//           color: "#107C41", 
//         }}
//         title="Upload Excel File"
//       >
//         <FaFileExcel />
//       </button>
//     </div>
//   );
// };

// export default ExcelFileUploader;









// import React, { useState, useRef } from "react";
// import * as XLSX from "xlsx";
// import { FaFileExcel } from "react-icons/fa"; // Excel icon

// const ExcelFileUploader = ({ onFileUpload }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       handleUpload(file); // Automatically upload after selecting
//     }
//   };


//     const handleUpload = async (file) => {
//       // const file = e.target.files[0];
//       if (!file) return;
  
//       // Read Excel File
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         const binaryStr = event.target.result;
//         const workbook = XLSX.read(binaryStr, { type: 'binary' });
  
//         // Read first sheet
//         const sheetName = workbook.SheetNames[0];
//         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
//         console.log('sheetData :>> ', sheetData);
//         onFileUpload(sheetData, "excel");
  
//         // const { parsedNodes, parsedEdges } = parseExcelData(sheetData);
  
//         // console.log('parsedNodes, parsedEdges :>> ', parsedNodes, parsedEdges);
//         // // Update Nodes and Edges
//         // setNodes(parsedNodes);
//         // setEdges(parsedEdges);
//       };
//       reader.readAsBinaryString(file);
//     };
  



//   // const handleUpload = (file) => {
//   //   const reader = new FileReader();
//   //   reader.onload = (e) => {
//   //     const data = new Uint8Array(e.target.result);
//   //     const workbook = XLSX.read(data, { type: "array" });
//   //     const sheetName = workbook.SheetNames[0];
//   //     const sheet = workbook.Sheets[sheetName];
//   //     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//   //     console.log('jsonData :>> ', jsonData);

//   //     onFileUpload(jsonData); // Pass extracted data to the parent component
//   //   };

//   //   reader.readAsArrayBuffer(file);
//   // };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//       />
//       <button
//         onClick={() => fileInputRef.current.click()}
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "24px",
//           color: "#107C41", // Excel green color
//         }}
//         title="Upload Excel File"
//       >
//         <FaFileExcel />
//       </button>
//     </div>
//   );
// };

// export default ExcelFileUploader;












// import React, { useState, useRef } from "react";
// import * as XLSX from "xlsx";
// import { FaFileExcel } from "react-icons/fa"; // Import Excel Icon

// const FileUploader = ({ onFileUpload }) => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       handleUpload(file); // Automatically upload after selecting
//     }
//   };

//   const handleUpload = (file) => {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       onFileUpload(jsonData); // Pass extracted data to create nodes
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         accept=".xls,.xlsx"
//         ref={fileInputRef}
//         style={{ display: "none" }}
//         onChange={handleFileChange}
//       />
//       <button
//         onClick={() => fileInputRef.current.click()}
//         style={{
//           background: "transparent",
//           border: "none",
//           cursor: "pointer",
//           fontSize: "24px",
//           color: "#107C41", // Excel green color
//         }}
//         title="Upload Excel File"
//       >
//         <FaFileExcel />
//       </button>
//     </div>
//   );
// };

// export default FileUploader;
















// import React, { useState } from "react";
// import * as XLSX from "xlsx";

// const FileUploader = ({ onFileUpload }) => {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleUpload = async () => {
//     if (!selectedFile) return;

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//       onFileUpload(jsonData); // Pass extracted data to create nodes
//     };

//     reader.readAsArrayBuffer(selectedFile);
//   };

//   return (
//     <div>
//       <input type="file" accept=".xls,.xlsx" onChange={handleFileChange} />
//       {selectedFile && <button onClick={handleUpload}>Upload</button>}
//     </div>
//   );
// };

// export default FileUploader;
