import React, { useState } from "react";

const CPCParser = () => {


  return (
    <div className="container mt-4">
      
    </div>
  );
};

export default CPCParser;


















// import React, { useState } from "react";

// const CPCParser = () => {
//   const [definitions, setDefinitions] = useState([]);
//   const [error, setError] = useState("");

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const textContent = event.target.result;
//         const parsedData = extractCPCDefinitionsFromText(textContent);
//         setDefinitions(parsedData);
//         setError("");
//       } catch (err) {
//         setError("Failed to parse text file.");
//         console.error(err);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const extractCPCDefinitionsFromText = (text) => {
//     const lines = text.trim().split(/\r?\n/);

//     return lines
//       .map((line) => line.split("\t").filter(Boolean))
//       .filter((parts) => parts.length >= 3)
//       .map(([code, level, title]) => ({
//         code: code.trim(),
//         level: level.trim(),
//         title: title.trim(),
//       }));
//   };

//   return (
//     <div className="container mt-4">
//       <h5>📄 CPC Text File Parser</h5>
//       <input
//         type="file"
//         accept=".txt"
//         onChange={handleFileUpload}
//         className="form-control my-3"
//       />
//       {error && <div className="text-danger">{error}</div>}
//       <div className="mt-4">
//         {definitions.map((item, idx) => (
//           <div key={idx} className="card mb-2 shadow-sm">
//             <div className="card-body">
//               <h6 className="text-primary mb-1">{item.code} <small className="text-muted">(Level {item.level})</small></h6>
//               <p className="mb-1">{item.title}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CPCParser;












// // CPCParser.jsx
// import React, { useState } from "react";
// import { XMLParser } from "fast-xml-parser";

// const CPCParser = () => {
//   const [definitions, setDefinitions] = useState([]);
//   const [error, setError] = useState("");

//   console.log('definitions', definitions)

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       try {
//         const xmlContent = event.target.result;
//         const parser = new XMLParser({
//           ignoreAttributes: false,
//           ignoreDeclaration: true,
//         });
//         const jsonObj = parser.parse(xmlContent);
//         const parsedData = extractCPCDefinitions(jsonObj);
//         setDefinitions(parsedData);
//       } catch (err) {
//         setError("Failed to parse XML.");
//         console.error(err);
//       }
//     };
//     reader.readAsText(file);
//   };

//   const extractCPCDefinitions = (jsonObj) => {
//     const items = jsonObj?.definitions?.["definition-item"];
//     if (!items) return [];

//     const array = Array.isArray(items) ? items : [items];

//     return array.map((item) => {
//       const symbol = item["classification-symbol"];
//       const title =
//         item["definition-title"]?.["text"] ||
//         item["definition-title"]?.["paragraph-text"] ||
//         "";
//       const glossary = item["glossary-of-terms"]?.["section-body"]?.["table"]?.["table-row"]?.["table-column"]?.["paragraph-text"] || "";

//       return {
//         code: symbol,
//         title: Array.isArray(title) ? title.join(" ") : title,
//         glossary: typeof glossary === "string" ? glossary : (glossary?.["#text"] || ""),
//       };
//     });
//   };

//   return (
//     <div className="container mt-4">
//       <h5>📄 CPC XML Definition Parser</h5>
//       <input type="file" onChange={handleFileUpload} className="form-control my-3" />
//       {error && <div className="text-danger">{error}</div>}
//       <div className="mt-4">
//         {definitions.map((item, idx) => (
//           <div key={idx} className="card mb-3 shadow-sm">
//             <div className="card-body">
//               <h6 className="text-primary mb-1">{item.code}</h6>
//               <p className="mb-1">{item.title}</p>
//               {item.glossary && <small className="text-muted">Glossary: {item.glossary}</small>}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CPCParser;










// import React, { useState } from 'react';
// import { parseCPCXML } from './parseCPCXML';

// const CPCUpload = () => {
//     const [definitions, setDefinitions] = useState([]);

//     const handleFile = async (e) => {
//         const file = e.target.files[0];
//         if (!file) return;

//         const reader = new FileReader();
//         reader.onload = async (e) => {
//             const xmlText = e.target.result;
//             const parsed = await parseCPCXML(xmlText);
//             setDefinitions(parsed);
//             console.log('Parsed Data:', parsed);
//         };
//         reader.readAsText(file);
//     };

//     return (
//         <div>
//             <h4>Upload CPC XML</h4>
//             <input type="file" accept=".xml" onChange={handleFile} />
//             <pre>{JSON.stringify(definitions, null, 2)}</pre>
//         </div>
//     );
// };

// export default CPCUpload;
