import React, { useState, useEffect, useRef } from "react";
import { Handle } from "@xyflow/react";
import "./EditableNode.css";
import ViewContent from "./MindMapSlice/Reusable/ViewContent";
import TextEditor from "./MindMapSlice/Reusable/TextEditor";

const buttonPositions = {
  top: { top: "-5px", left: "50%", transform: "translateX(-50%)" },
  right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
  bottom: { bottom: "-5px", left: "50%", transform: "translateX(-50%)" },
  left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
};

const EditableNode = ({ data, id }) => {

  const textAreaRef = useRef(null);
  const storedLabel = localStorage.getItem(`node_${id}`) || data.label;
  const storedBold = JSON.parse(localStorage.getItem(`bold_${id}`)) || false;
  const storedItalic = JSON.parse(localStorage.getItem(`italic_${id}`)) || false;
  const storedLink = localStorage.getItem(`link_${id}`) || '';

  const [label, setLabel] = useState(storedLabel);
  const [isBold, setIsBold] = useState(storedBold);
  const [isItalic, setIsItalic] = useState(storedItalic);
  const [link, setLink] = useState(storedLink);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const directions = ["right", "top", "bottom", "left"];
  const { onAdd, onLabelChange, handleFileUpload, setNodes, setEdges, nodes, edges } = data;

  useEffect(() => {
    localStorage.setItem(`node_${id}`, label);
    localStorage.setItem(`bold_${id}`, JSON.stringify(isBold));
    localStorage.setItem(`italic_${id}`, JSON.stringify(isItalic));
    localStorage.setItem(`link_${id}`, link);
  }, [label, isBold, isItalic, link, id]);
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    localStorage.setItem(`node_${id}`, label);
  }, [label, id]);

  const handleChange = (e) => {
    const pastedText = e.clipboardData?.getData("text") || e.target.value;
    const lines = pastedText.split("\n").filter((line) => line.trim());
    if (lines.length > 1) {
      e.preventDefault();
      onAdd(id, directions[Math.floor(Math.random() * directions.length)], lines);
    } else {
      setLabel(pastedText);
      onLabelChange(id, pastedText);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onLabelChange(id, label);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleBlur();
    }
  };

  const handleAddClick = (dir) => onAdd(id, dir, true);

  useEffect(() => {
    localStorage.setItem(`node_${id}`, label);
  }, [label, id]);

  const applyFormat = (format) => {
    if (format === "bold") {
      setIsBold((prev) => {
        localStorage.setItem(`bold_${id}`, JSON.stringify(!prev));
        return !prev;
      });
    }
    if (format === "italic") {
      setIsItalic((prev) => {
        localStorage.setItem(`italic_${id}`, JSON.stringify(!prev));
        return !prev;
      });
    }
    if (format === "link") {

      const newLink = prompt("Enter the link:", link);
      if (newLink) {
        setLink(newLink);
        localStorage.setItem(`link_${id}`, newLink);
      }
    }
  };
  
  const editingContent = <TextEditor
    id={id}
    label={label}
    textAreaRef={textAreaRef}
    handleChange={handleChange}
    handleKeyDown={handleKeyDown}
    applyFormat={applyFormat}
    handleFileUpload={handleFileUpload}
    setNodes={setNodes}
    setEdges={setEdges}
    nodes={nodes}
    edges={edges}
    setIsEditing={setIsEditing}
  />

  const viewContent = <ViewContent
    id={id}
    data={data}
    label={label}
    link={link}
    isBold={isBold}
    isItalic={isItalic}
    setIsEditing={setIsEditing}
    isHovered={isHovered}
    isEditing={isEditing}
    directions={directions}
    handleAddClick={handleAddClick}
    buttonPositions={buttonPositions}
    addNode={handleAddClick}
  />

  return (
    <div
      className={!isEditing && id === '1' ? "editable-node" : ""}
      {...(id === "1" && {
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
      })}
    >
      {isEditing ? editingContent : viewContent}
      {
        data.isImageNode ? (
          <>
            <Handle type="source" position="left" id="parent-left" />
            <Handle type="target" position="left" id="parent-left" />
            <Handle type="source" position="right" id="img-right" />
            <Handle type="target" position="right" id="img-right" />
          </>
        ) : (
          directions.map((pos) => (
            <React.Fragment key={pos}>
              <Handle type="source" position={pos} id={pos} />
              <Handle type="target" position={pos} id={pos} />
            </React.Fragment>
          ))
        )
      }
    </div>
  );
};
export default EditableNode;



























// const positionStyles = {
//   top: {
//     top: "-18px",
//     left: "50%",
//     transform: "translateX(-50%)",
//   },
//   bottom: {
//     bottom: "-18px",
//     left: "50%",
//     transform: "translateX(-50%)",
//   },
//   left: {
//     left: "-31px",
//     top: "50%",
//     transform: "translateY(-50%)",
//   },
//   right: {
//     right: "-31px",
//     top: "50%",
//     transform: "translateY(-50%)",
//   },
// };

// const textPositionStyles = {
//   top: { top: "25px", left: "50%", transform: "translateX(-50%)" },
//   bottom: { top: "-7px", left: "20px", transform: "translateX(-50%)" },
//   left: { left: "40px", top: "50%", transform: "translateY(-50%)" },
//   right: { right: "40px", top: "49%", transform: "translateY(-50%)" },
// };





    {/* <div
      className="starcbutton"
      style={{
        backgroundSize: "10px auto",
        height: "14px",
        width: "14px",
        backgroundColor: "#ebd95f",
        position: "absolute",
        ...positionStyle, // Dynamically applied style
      }}
    ></div> */}

  


  // const childNodes = (
  //   <div style={{ position: "relative" }} onClick={() => setIsEditing(true)}>
  //     <div
  //       style={{
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         minHeight: "60px",
  //         minWidth: "100px",
  //       }}
  //     >
  //       {data.isImageNode ? (
  //         <div
  //           style={{
  //             width: "100px",
  //             height: "60px",
  //             display: "flex",
  //             justifyContent: "center",
  //             alignItems: "center",
  //             overflow: "hidden",
  //           }}
  //         >
  //           <img
  //             src={data.image}
  //             alt="Preview"
  //             style={{
  //               maxWidth: "100px",
  //               maxHeight: "60px",
  //               minWidth: "50px",
  //               minHeight: "30px",
  //               objectFit: "contain",
  //               borderRadius: "5px",
  //             }}
  //           />
  //         </div>
  //       ) : (
  //         <>
  //           <span
  //             style={{
  //               position: "absolute",
  //               top: "100px",
  //               whiteSpace: "nowrap",
  //               textAlign: "center",
  //               fontSize: "7px",
  //               color: "#333",
  //               ...textPositionStyles[direction],
  //             }}
  //           >
  //             {data.label}
  //           </span>
  //         </>
  //       )}
  //     </div>
  
  //     <div
  //       className="starcbutton"
  //       style={{
  //         backgroundSize: "10px auto",
  //         height: "14px",
  //         width: "14px",
  //         backgroundColor: "#ebd95f",
  //         position: "absolute",
  //         ...positionStyles[edgeDirections],
  //       }}
  //     ></div>
  //   </div>
  // );




  // const childNodes = (
  //   <div className="" style={{ position: "relative" }} onClick={() => setIsEditing(true)}>
  //     <div 
  //       style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60px", minWidth: "100px" }}
  //     >
  //       {data.isImageNode ? (
  //         <div style={{
  //           width: "100px", height: "60px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"
  //         }}>
  //           <img src={data.image} alt="Preview" style={{ maxWidth: "100px", maxHeight: "60px", minWidth: "50px", minHeight: "30px", objectFit: "contain", borderRadius: "5px", }} />
  //         </div>
  //       ) : (
  //         <>
  //         <span style={{ textAlign: "center", whiteSpace: "nowrap" }}>{data.label}</span>

  //         </>
  //       )}
  //     </div>
  
  //     <div 
  //       className="starcbutton right" 
  //       style={{ 
  //         backgroundSize: '10px auto', 
  //         height: '14px', 
  //         width: '14px', 
  //         backgroundColor: '#ebd95f', 
  //         position: "absolute", 
  //         right: "-31px", 
  //         top: "50%", 
  //         transform: "translateY(-50%)"
  //       }}
  //     ></div>
  //   </div>
  // );




  
  // const applyFormat = (format) => {
  //   if (format === "bold") setIsBold(!isBold);
  //   if (format === "italic") setIsItalic(!isItalic);
  //   if (format === "link") setLink(!link); 
  // };






  {/* <div onClick={() => setIsEditing(true)} style={{fontWeight:'bold'}} className="edit-text"> {data.label}</div> */}

                {/* <div
                  onClick={() => setIsEditing(true)}
                  style={{
                    fontWeight: isBold ? "bold" : "normal",
                    fontStyle: isItalic ? "italic" : "normal",
                  }}
                  className="edit-text"
                >
                  {link ? (
                    <a href={link} target="_blank">
                      {label}
                    </a>
                  ) : (
                    label
                  )}
                </div> */}






// import React, { useState, useEffect } from "react";
// import "./EditableNode.css";
// import EditingContent from "./EditableComponent/EditingContent";
// import ViewContent from "./EditableComponent/ViewContent";

// const EditableNode = ({ data, id }) => {
//   const storedLabel = localStorage.getItem(`node_${id}`) || data.label;
//   const [label, setLabel] = useState(storedLabel);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isHovered, setIsHovered] = useState(false);

//   const { onDelete, onAdd, onLabelChange, handleFileUpload, setNodes, setEdges, nodes, edges } = data;
//   const directions = ["top", "right", "bottom", "left"];

//   useEffect(() => {
//     localStorage.setItem(`node_${id}`, label);
//   }, [label, id]);

//   const handleChange = (e) => {
//     const pastedText = e.clipboardData?.getData("text") || e.target.value;
//     const lines = pastedText.split("\n").filter((line) => line.trim());

//     if (lines.length > 1) {
//       e.preventDefault();
//       onAdd(id, directions[Math.floor(Math.random() * directions.length)], lines);
//     } else {
//       setLabel(pastedText);
//       onLabelChange(id, pastedText);
//     }
//   };

//   const handleBlur = () => {
//     setIsEditing(false);
//     onLabelChange(id, label);
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       handleBlur();
//     }
//   };

//   const handleAddClick = (dir) => onAdd(id, dir, true);

//   return (
//     <div
//       className={!isEditing && id === "1" ? "editable-node" : ""}
//       {...(id === "1" && {
//         onMouseEnter: () => setIsHovered(true),
//         onMouseLeave: () => setIsHovered(false),
//       })}
//     >
//       {isEditing ? (
//         <EditingContent
//           label={label}
//           setLabel={setLabel}
//           handleChange={handleChange}
//           handleBlur={handleBlur}
//           handleKeyDown={handleKeyDown}
//           handleFileUpload={handleFileUpload}
//           id={id}
//           nodes={nodes}
//           edges={edges}
//           setNodes={setNodes}
//           setEdges={setEdges}
//         />
//       ) : (
//         <ViewContent id={id} data={data} isHovered={isHovered} setIsHovered={setIsHovered} setIsEditing={setIsEditing} handleAddClick={handleAddClick} onDelete={onDelete} directions={directions} />
//       )}
//     </div>
//   );
// };

// export default EditableNode;







































// const handleFileUpload = (event) => {
//   const file = event.target.files[0];
//   console.log(file, 'file')
//   if (file) {
//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheetName = workbook.SheetNames[0];
//       const sheet = workbook.Sheets[sheetName];
//       const jsonData = XLSX.utils.sheet_to_json(sheet);

//       jsonData.forEach((row, index) => {
//         const nodeId = `node_${id}_${index}`;
//         const nodeLabel = row.Name || `Node ${index + 1}`;
//         onAdd(id, directions[index % directions.length], nodeLabel);
//       });
//     };
//     reader.readAsArrayBuffer(file);
//   }
// };




// <div className="starcbutton top"></div>

      // <div className="starcbutton right"></div>

      // <div className="starcbutton bottom"></div>

      // <div className="starcbutton left"></div>
    
    // <div
    //   className="editable-label"
      // style={{ ...textStyles, cursor: "pointer" }}
      // onClick={() => setIsEditing(true)}
      // draggable={id !== "1"}
    // >
    //   {data.label}
    // </div>



   {/* { isHovered && !isEditing &&
        directions.map((dir) => (
          <button key={dir} onClick={() => handleAddClick(dir)} className="add-btn" style={buttonPositions[dir]}>
            +
          </button>
        ))} */}





  // const viewContent = (
  //   <div className="" style={{ ...textStyles, cursor: "pointer" }} draggable={id !== "1"}>
  //     <div className="edit-text">{data.label}</div>
  //     {
  //       <svg
  //         onClick={() => setIsEditing(true)}
  //         className="shapebackground"
  //         height="46"
  //         width="80"
  //         viewBox="-40 -23 80 46"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <path
  //           d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z"
  //           fill="#d0d0d0"
  //         />
  //       </svg>
  //     }

  //     {isHovered && !isEditing &&
  //       directions.map((dir) => (
  //         <div key={dir} onClick={() => handleAddClick(dir)} className={`starcbutton ${dir}`} style={buttonPositions[dir]}>
  //         </div>
  //       ))}
  //   </div>
  // );





  {/* <textarea
        ref={textAreaRef}
        autoFocus
        value={label}
        onPaste={handleChange}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="editable-textarea"
        style={textStyles}
      /> */}


// import React, { useState, useEffect, useRef } from "react";
// import { Handle } from "@xyflow/react";
// import Toolbox from "./Toolbox";
// import "./EditableNode.css";

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id, isNewNode = false }) => {
//     const textAreaRef = useRef(null);
//     const storedLabel = localStorage.getItem(`node_${id}`) || data.label;
//     const [label, setLabel] = useState(storedLabel);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const [isHidden, setIsHidden] = useState(isNewNode);
//     const [textSize, setTextSize] = useState("10px");
//     const [fontWeight, setFontWeight] = useState("normal");
//     const [fontStyle, setFontStyle] = useState("normal");
//     const [textDecoration, setTextDecoration] = useState("none");

//     const { onDelete, onAdd, onLabelChange } = data;
//     const directions = ["top", "right", "bottom", "left"];

//     useEffect(() => {
//         if (isEditing && textAreaRef.current) {
//             textAreaRef.current.focus();
//             textAreaRef.current.select();
//         }
//     }, [isEditing]);

//     useEffect(() => {
//         localStorage.setItem(`node_${id}`, label);
//     }, [label, id]);

//     const handleChange = (event) => {
//         const pastedText = event.clipboardData?.getData("text") || event.target.value;
//         const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//         const randomDirection = directions[Math.floor(Math.random() * directions.length)];

//         if (lines.length > 1) {
//             event.preventDefault();
//             onAdd(id, randomDirection, lines);
//         } else {
//             setLabel(pastedText);
//             onLabelChange(id, pastedText);
//         }
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         onLabelChange(id, label);
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === "Enter") {
//             handleBlur();
//         }
//     };

//     const handleAddClick = (dir) => {
//         onAdd(id, dir, true);
//     };

//     const handleFontStyleChange = (style) => {
//         switch (style) {
//             case "bold":
//                 setFontWeight(fontWeight === "bold" ? "normal" : "bold");
//                 break;
//             case "italic":
//                 setFontStyle(fontStyle === "italic" ? "normal" : "italic");
//                 break;
//             case "underline":
//                 setTextDecoration(textDecoration === "underline" ? "none" : "underline");
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleFileUpload = (event) => {
//         console.log("File Uploaded:", event.target.files[0]);
//     };

//     return (
//         <div
//             className={!isHidden ? "editable-node" : ""}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {isEditing ? (
//                 <div className="editable-container">

                   
//                     <textarea
//                         ref={textAreaRef}
//                         autoFocus
//                         value={label}
//                         onPaste={handleChange}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         onKeyDown={handleKeyDown}
//                         className="editable-textarea"
//                         style={{ fontSize: textSize, fontWeight, fontStyle, textDecoration }}
//                     />
//                      <Toolbox
//                         textSize={textSize}
//                         setTextSize={setTextSize}
//                         handleFontStyleChange={handleFontStyleChange}
//                         handleFileUpload={handleFileUpload}
//                     />
//                 </div>
//             ) : (
//                 <>

//                     <div
//                         className="editable-label"
//                         style={{ fontSize: textSize, fontWeight, fontStyle, textDecoration, cursor: "pointer" }}
//                         onClick={() => setIsEditing(true)}
//                     >
//                         {data.label}
//                     </div>
//                 </>



//             )}

//             {isHovered && id !== "1" && <button className="delete-btn" onClick={() => onDelete(id)}>×</button>}
//             {isHovered &&
//                 directions.map((dir) => (
//                     <button
//                         key={dir}
//                         onClick={() => handleAddClick(dir)}
//                         className="add-btn"
//                         style={buttonPositions[dir]}
//                     >
//                         +
//                     </button>
//                 ))}

//             {!isHidden &&
//                 directions.map((pos) => (
//                     <React.Fragment key={pos}>
//                         <Handle type="source" position={pos} id={pos} />
//                         <Handle type="target" position={pos} id={pos} />
//                     </React.Fragment>
//                 ))}
//         </div>
//     );
// };

// export default EditableNode;






// import React, { useState, useEffect, useRef } from "react";
// import { Handle } from "@xyflow/react";
// import { FiBold, FiItalic, FiUnderline, FiImage } from "react-icons/fi";
// import { FaFileExcel } from "react-icons/fa";
// import "./EditableNode.css";
// import Toolbox from "./Toolbox";

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id, isNewNode = false }) => {
//     const textAreaRef = useRef(null);
//     const storedLabel = localStorage.getItem(`node_${id}`) || data.label;
//     const [label, setLabel] = useState(storedLabel);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const [isHidden, setIsHidden] = useState(isNewNode);
//     const [textSize, setTextSize] = useState("16px");
//     const [fontWeight, setFontWeight] = useState("normal");
//     const [fontStyle, setFontStyle] = useState("normal");
//     const [textDecoration, setTextDecoration] = useState("none");

//     const { onDelete, onAdd, onLabelChange } = data;
//     const directions = ["top", "right", "bottom", "left"];

//     useEffect(() => {
//         if (isEditing && textAreaRef.current) {
//             textAreaRef.current.focus();
//             textAreaRef.current.select();
//         }
//     }, [isEditing]);

//     useEffect(() => {
//         localStorage.setItem(`node_${id}`, label);
//     }, [label, id]);

//     const handleChange = (event) => {
//         const pastedText = event.clipboardData?.getData("text") || event.target.value;
//         const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//         const randomDirection = directions[Math.floor(Math.random() * directions.length)];

//         if (lines.length > 1) {
//             event.preventDefault();
//             onAdd(id, randomDirection, lines);
//         } else {
//             setLabel(pastedText);
//             onLabelChange(id, pastedText);
//         }
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         onLabelChange(id, label);
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === "Enter") {
//             handleBlur();
//         }
//     };

//     const handleAddClick = (dir) => {
//         onAdd(id, dir, true);
//     };

//     const handleFontStyleChange = (style) => {
//         switch (style) {
//             case "bold":
//                 setFontWeight(fontWeight === "bold" ? "normal" : "bold");
//                 break;
//             case "italic":
//                 setFontStyle(fontStyle === "italic" ? "normal" : "italic");
//                 break;
//             case "underline":
//                 setTextDecoration(textDecoration === "underline" ? "none" : "underline");
//                 break;
//             default:
//                 break;
//         }
//     };

//     const handleFileUpload = (event) => {
//         console.log("File Uploaded:", event.target.files[0]);
//     };

//     return (
//         <div
//             className={!isHidden ? "editable-node" : ""}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >

//             {isEditing ? (
//                 <>
// <div className="toolbox">
//                 <button onClick={() => handleFontStyleChange("bold")}><FiBold /></button>
//                 <button onClick={() => handleFontStyleChange("italic")}><FiItalic /></button>
//                 <button onClick={() => handleFontStyleChange("underline")}><FiUnderline /></button>
//                 <select onChange={(e) => setTextSize(e.target.value)} value={textSize}>
//                     <option value="12px">12px</option>
//                     <option value="14px">14px</option>
//                     <option value="16px">16px</option>
//                     <option value="18px">18px</option>
//                     <option value="20px">20px</option>
//                 </select>
//                 <label>
//                     <FiImage />
//                     <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: "none" }} />
//                 </label>
//                 <label>
//                     <FaFileExcel />
//                     <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} style={{ display: "none" }} />
//                 </label>
//                 <textarea
//                     ref={textAreaRef}
//                     autoFocus
//                     value={label}
//                     onPaste={handleChange}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     onKeyDown={handleKeyDown}
//                     className="editable-textarea"
//                     style={{ fontSize: textSize, fontWeight, fontStyle, textDecoration }}
//                 />
//             </div>
//                 </>
                
//             ) : (
//                 <div
//                     className="editable-label"
//                     style={{ fontSize: textSize, fontWeight, fontStyle, textDecoration, cursor: "pointer" }}
//                     onClick={() => setIsEditing(true)}
//                 >
//                     {data.label}
//                 </div>
//             )}

//             {isHovered && id !== "1" && <button className="delete-btn" onClick={() => onDelete(id)}>×</button>}
//             {isHovered &&
//                 directions.map((dir) => (
//                     <button
//                         key={dir}
//                         onClick={() => handleAddClick(dir)}
//                         className="add-btn"
//                         style={buttonPositions[dir]}
//                     >
//                         +
//                     </button>
//                 ))}

//             {!isHidden &&
//                 directions.map((pos) => (
//                     <React.Fragment key={pos}>
//                         <Handle type="source" position={pos} id={pos} />
//                         <Handle type="target" position={pos} id={pos} />
//                     </React.Fragment>
//                 ))}
//         </div>
//     );
// };

// export default EditableNode;













// import React, { useState, useEffect, useRef } from "react";
// import { Handle } from "@xyflow/react";
// import "./EditableNode.css";

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id, isNewNode = false }) => {
//     const textAreaRef = useRef(null);
//     const storedLabel = localStorage.getItem(`node_${id}`) || data.label;
//     const [label, setLabel] = useState(storedLabel);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);
//     const [isHidden, setIsHidden] = useState(isNewNode);

//     const { onDelete, onAdd, onLabelChange } = data;
//     const directions = ["top", "right", "bottom", "left"];

//     useEffect(() => {
//         if (isEditing && textAreaRef.current) {
//             textAreaRef.current.focus();
//             textAreaRef.current.select();
//         }
//     }, [isEditing]);

//     useEffect(() => {
//         localStorage.setItem(`node_${id}`, label);
//     }, [label, id]);

//     const handleChange = (event) => {
//         const pastedText = event.clipboardData?.getData("text") || event.target.value;
//         const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//         const randomDirection = directions[Math.floor(Math.random() * directions.length)];

//         if (lines.length > 1) {
//             event.preventDefault();
//             onAdd(id, randomDirection, lines);
//         } else {
//             setLabel(pastedText);
//             onLabelChange(id, pastedText);
//         }
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         onLabelChange(id, label);
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === "Enter") {
//             handleBlur();
//         }
//     };

//     const handleAddClick = (dir) => {
//         onAdd(id, dir, true); 
//     };

//     return (
//         <>       
//         <div
//             className={!isHidden  ? "editable-node" : ""}
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {isEditing ? (
//                 <div>                    
//                 <textarea
//                     ref={textAreaRef}
//                     autoFocus
//                     value={label}
//                     onPaste={handleChange}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     onKeyDown={handleKeyDown}
//                     className="editable-textarea"
//                 />
//                 </div>
//             ) : (
//                 <div style={{ cursor: "pointer" }} className="editable-label" onClick={() => setIsEditing(true)}>
//                     {data.label}
//                 </div>
//             )}
//             {isHovered && id !== "1" && (
//                 <button className="delete-btn" onClick={() => onDelete(id)}>×</button>
//             )}
//             {isHovered &&
//                 directions.map((dir) => (
//                     <button
//                         key={dir}
//                         onClick={() => handleAddClick(dir)}
//                         className="add-btn"
//                         style={buttonPositions[dir]}
//                     >
//                         +
//                     </button>
//                 ))}
//             {!isHidden &&
//                 directions.map((pos) => (
//                     <React.Fragment key={pos}>
//                         <Handle type="source" position={pos} id={pos} />
//                         <Handle type="target" position={pos} id={pos} />
//                     </React.Fragment>
//                 ))}                
//         </div>
//         </>
//     );
// };
// export default EditableNode;






// MAin ui 
{/* <div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}>

    <svg className="shapebackground" style={{ cursor: "text" }} height="46" width="80" viewBox="-40 -23 80 46" xmlns="http://www.w3.org/2000/svg">
        <path d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z" fill="#d0d0d0" />
    </svg>

</div>

{
    isHovered && (
        <>
            <div className="starcbutton top" onClick={() => toggleConnection(id, "top")}></div>
            <div className="starcbutton right" onClick={() => toggleConnection(id, "right")}></div>
            <div className="starcbutton bottom" onClick={() => toggleConnection(id, "bottom")}></div>
            <div className="starcbutton left" onClick={() => toggleConnection(id, "left")}></div>

        </>
    )
}

        </div > */}




// import React, { useState, useEffect, useRef } from "react";
// import { Handle } from "@xyflow/react";
// import "./EditableNode.css";

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id }) => {

//     const textAreaRef = useRef(null);

//     const storedLabel = localStorage.getItem(`node_${id}`) || "Click to edit";
//     const [label, setLabel] = useState(storedLabel);
//     const [isEditing, setIsEditing] = useState(false);
//     const [isHovered, setIsHovered] = useState(false);

//     const { onDelete, onAdd, onLabelChange } = data;
//     const directions = ["top", "right", "bottom", "left"];

  
//     useEffect(() => {
//         if (isEditing && textAreaRef.current) {
//             textAreaRef.current.focus();
//             textAreaRef.current.select();
//         }
//     }, [isEditing]); 
    

//     useEffect(() => {
//         localStorage.setItem(`node_${id}`, label);
//     }, [label, id]);

//     const handleChange = (event) => {
//         setLabel(event.target.value);
//     };

//     const handleBlur = () => {
//         setIsEditing(false);
//         onLabelChange(id, label);
//     };

//     const handleKeyDown = (event) => {
//         if (event.key === "Enter") {
//             handleBlur();
//         }
//     };

//     return (
//         <div
//             className="editable-node"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             {isEditing ? (
//                 <textarea
//                 ref={textAreaRef}
//                     autoFocus
//                     value={label}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     onKeyDown={handleKeyDown}
//                     className="editable-textarea"
//                 />
//             ) : (
//                 <div style={{ cursor:"pointer" }} className="editable-label" onClick={() => setIsEditing(true)}>
//                     {label}
//                 </div>
//             )}

//             {isHovered && id !== "1" && (
//                 <button className="delete-btn" onClick={() => onDelete(id)}>×</button>
//             )}

//             {isHovered &&
//                 directions.map((dir) => (
//                     <button
//                         key={dir}
//                         onClick={() => onAdd(id, dir)}
//                         className="add-btn"
//                         style={buttonPositions[dir]}
//                     >
//                         +
//                     </button>
//                 ))}

//             {directions.map((pos) => (
//                 <React.Fragment key={pos}>
//                     <Handle type="source" position={pos} id={pos} />
//                     <Handle type="target" position={pos} id={pos} />
//                 </React.Fragment>
//             ))}
//         </div>
//     );
// };

// export default EditableNode;



















// import React, { useState } from "react";
// import { Handle } from "@xyflow/react";
// import "./EditableNode.css"; // Importing the CSS file

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id }) => {
//     const [label, setLabel] = useState(data.label);
//     const [isHovered, setIsHovered] = useState(false);

//     const { onDelete, onAdd, onLabelChange } = data;
//     const directions = ["top", "right", "bottom", "left"];

    // const handleChange = (event) => {
    //     const pastedText = event.clipboardData?.getData("text") || event.target.value;
    //     const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

    //     const randomDirection = directions[Math.floor(Math.random() * directions.length)];

    //     if (lines.length > 1) {
    //         event.preventDefault();
    //         onAdd(id, randomDirection, lines);
    //     } else {
    //         setLabel(pastedText);
    //         onLabelChange(id, pastedText);
    //     }
    // };

//     return (
//         <div
//             className="editable-node"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//         >
//             <input
//                 type="text"
//                 value={label}
//                 onPaste={handleChange}
//                 onChange={handleChange}
//                 className="editable-input"
//             />

//             {isHovered && id !== "1" && (
//                 <button className="delete-btn" onClick={() => onDelete(id)}>×</button>
//             )}

//             {isHovered &&
//                 directions.map((dir) => (
//                     <button
//                         key={dir}
//                         onClick={() => onAdd(id, dir)}
//                         className="add-btn"
//                         style={buttonPositions[dir]}
//                     >
//                         +
//                     </button>
//                 ))}

//             {directions.map((pos) => (
//                 <React.Fragment key={pos}>
//                     <Handle type="source" position={pos} id={pos} />
//                     <Handle type="target" position={pos} id={pos} />
//                 </React.Fragment>
//             ))}
//         </div>
//     );
// };

// export default EditableNode;








// import React, { useState } from "react";
// import { Handle } from "@xyflow/react";

// const buttonPositions = {
//     top: { top: "-10px", left: "50%", transform: "translateX(-50%)" },
//     right: { right: "-10px", top: "50%", transform: "translateY(-50%)" },
//     bottom: { bottom: "-10px", left: "50%", transform: "translateX(-50%)" },
//     left: { left: "-10px", top: "50%", transform: "translateY(-50%)" },
// };

// const EditableNode = ({ data, id }) => {

//     const [label, setLabel] = useState(data.label);
//     const [isHovered, setIsHovered] = useState(false);

//     const { onDelete, onAdd, onLabelChange, pastedNodes } = data;

//     const directions = ["top", "right", "bottom", "left"];

//     const handleChange = (event) => {
//         const pastedText = event.clipboardData?.getData("text") || event.target.value;
//         const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//         const randomDirection = directions[Math.floor(Math.random() * directions.length)];

//         if (lines.length > 1) {
//             event.preventDefault();
//             onAdd(id, randomDirection, lines);

//         } else {
//             setLabel(pastedText);
//             onLabelChange(id, pastedText);
//         }
//     };

//     return (
//         <>
//             <div
//                 style={{
//                     padding: "10px",
//                     border: "1px solid black",
//                     borderRadius: "5px",
//                     background: "white",
//                     textAlign: "center",
//                     width: "120px",
//                     position: "relative",
//                 }}
//                 onMouseEnter={() => setIsHovered(true)}
//                 onMouseLeave={() => setIsHovered(false)}
//             >

//                 <input
//                     type="text"
//                     value={label}
//                     onPaste={handleChange}
//                     onChange={handleChange}
//                     style={{
//                         border: "none",
//                         textAlign: "center",
//                         width: "100%",
//                         outline: "none",
//                         background: "transparent",
//                     }}
//                 />
//                 {isHovered && id !== "1" && (
//                     <button
//                         onClick={() => onDelete(id)}
//                         style={{
//                             position: "absolute",
//                             top: "-12px",
//                             right: "-12px",
//                             background: "red",
//                             color: "white",
//                             border: "none",
//                             borderRadius: "50%",
//                             width: "20px",
//                             height: "20px",
//                             cursor: "pointer",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             fontSize: "12px",
//                             fontWeight: "bold",
//                             zIndex: 10,
//                         }}
//                     >
//                         ×
//                     </button>
//                 )}

//                 {isHovered &&
//                     ["top", "right", "bottom", "left"].map((dir) => (
//                         <button
//                             key={dir}
//                             onClick={() => onAdd(id, dir)}
//                             style={{
//                                 position: "absolute",
//                                 ...buttonPositions[dir],
//                                 background: "#28a745",
//                                 color: "white",
//                                 border: "none",
//                                 borderRadius: "50%",
//                                 fontSize: "14px",
//                                 cursor: "pointer",
//                                 width: "20px",
//                                 height: "20px",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 fontWeight: "bold",
//                                 zIndex: 10,
//                             }}
//                         >
//                             +
//                         </button>
//                     ))}


//                 {["top", "right", "bottom", "left"].map((pos) => (
//                     <React.Fragment key={pos}>
//                         <Handle type="source" position={pos} id={pos} />
//                         <Handle type="target" position={pos} id={pos} />
//                     </React.Fragment>
//                 ))}


//             </div>
//         </>
//     );
// };

// export default EditableNode;














// import React, { useState } from "react";
// import { Handle } from "@xyflow/react";

// const EditableNode = ({ data, id }) => {
//   const [label, setLabel] = useState(data.label);
//   const [isHovered, setIsHovered] = useState(false);
//   const { onDelete, onAdd, onLabelChange } = data;

//   const handleChange = (event) => {
//     const pastedText = event.clipboardData?.getData("text") || event.target.value;
//     const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//     if (lines.length > 1) {
//       event.preventDefault();
//       onAdd(id, "bottom", lines);
//     } else {
//       setLabel(pastedText);
//       onLabelChange(id, pastedText);
//     }
//   };

//   return (
//     <div 
//       style={{ padding: "5px", border: "1px solid black", borderRadius: "5px", background: "white", textAlign: "center", width: "100px", position: "relative" }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <input type="text" value={label} onPaste={handleChange} onChange={handleChange} 
//         style={{ border: "none", textAlign: "center", width: "100%", outline: "none" }} 
//       />

//       {isHovered && id !== "1" && (
//         <button onClick={() => onDelete(id)} 
//           style={{ position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
//           ×
//         </button>
//       )}

//       {isHovered && (
//         <>
//           {["top", "right", "bottom", "left"].map((dir) => (
//             <button key={dir} onClick={() => onAdd(id, dir)}
//               style={{
//                 position: "absolute",
//                 [dir]: "-12px",
//                 left: dir === "top" || dir === "bottom" ? "50%" : undefined,
//                 top: dir === "left" || dir === "right" ? "50%" : undefined,
//                 transform: dir === "top" || dir === "bottom" ? "translateX(-50%)" : "translateY(-50%)",
//                 background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//                 fontSize: "12px", cursor: "pointer", zIndex: 10 
//               }}>+
//             </button>
//           ))}
//         </>
//       )}

    //   {["top", "right", "bottom", "left"].map((pos) => (
    //     <React.Fragment key={pos}>
    //       <Handle type="source" position={pos} id={pos} />
    //       <Handle type="target" position={pos} id={pos} />
    //     </React.Fragment>
    //   ))}
//     </div>
//   );
// };

// export default EditableNode;







// import React, { useState } from "react";
// import { Handle } from "@xyflow/react";

// const EditableNode = ({ data, id }) => {
//   const [label, setLabel] = useState(data.label);
//   const [isHovered, setIsHovered] = useState(false);
//   const { onDelete, onAdd, onLabelChange } = data;

//   const handleChange = (event) => {
//     const pastedText = event.clipboardData?.getData("text") || event.target.value;
//     const lines = pastedText.split("\n").filter((line) => line.trim() !== "");

//     if (lines.length > 1) {
//       event.preventDefault();
//       onAdd(id, "bottom", lines);
//     } else {
//       setLabel(pastedText);
//       onLabelChange(id, pastedText);
//     }
//   };

//   return (
//     <div 
//       style={{ padding: "5px", border: "1px solid black", borderRadius: "5px", background: "white", textAlign: "center", width: "100px", position: "relative" }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <input type="text" value={label} onPaste={handleChange} onChange={handleChange} 
//         style={{ border: "none", textAlign: "center", width: "100%", outline: "none" }} 
//       />

//       {isHovered && id !== "1" && (
//         <button onClick={() => onDelete(id)} 
//           style={{ position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
//           ×
//         </button>
//       )}

//       {isHovered && (
//         <>
//           {["top", "right", "bottom", "left"].map((dir) => (
//             <button key={dir} onClick={() => onAdd(id, dir)}
//               style={{
//                 position: "absolute",
//                 [dir]: "-12px",
//                 left: dir === "top" || dir === "bottom" ? "50%" : undefined,
//                 top: dir === "left" || dir === "right" ? "50%" : undefined,
//                 transform: dir === "top" || dir === "bottom" ? "translateX(-50%)" : "translateY(-50%)",
//                 background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//                 fontSize: "12px", cursor: "pointer", zIndex: 10 
//               }}>+
//             </button>
//           ))}
//         </>
//       )}

//       {["top", "right", "bottom", "left"].map((pos) => (
//         <React.Fragment key={pos}>
//           <Handle type="source" position={pos} id={pos} />
//           <Handle type="target" position={pos} id={pos} />
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default EditableNode;
