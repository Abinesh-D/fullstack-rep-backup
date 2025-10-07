// import React, { useState } from "react";
// import { Handle } from "@xyflow/react";

// const EditableNode = ({ data, id }) => {
//     const [label, setLabel] = useState(data.label);
//     const [isHovered, setIsHovered] = useState(false);
//     const { onDelete, onAdd, onLabelChange, isParent, edgeColor, } = data;

//     const handleChange = (event) => {
//         const pastedText = event.clipboardData?.getData("text") || event.target.value;
//         const lines = pastedText.split("\n").filter((line) => line.trim() !== "");
//         if (lines.length > 1) {
//             event.preventDefault();
//             onAdd(id, "bottom", lines);
//         } else {
//             setLabel(pastedText);
//             onLabelChange(id, pastedText);
//         }
//     };

//     return (
    //     <div
    //         // style={{ padding: "5px", border: "1px solid black", borderRadius: "5px", background: "white", textAlign: "center", width: "100px", position: "relative" }}
    //         // onMouseEnter={() => setIsHovered(true)}
    //         // onMouseLeave={() => setIsHovered(false)}
    //     >
    //         {/* <input 
    //     type="text" value={label} onPaste={handleChange} onChange={handleChange}
    //     style={{ border: "none", textAlign: "center", width: "100%", outline: "none" }} 
    //   />     */}

    //         <svg className="shapebackground" height="46" width="80" viewBox="-40 -23 80 46" xmlns="http://www.w3.org/2000/svg" style={{ margin: "-23px 0px 0px -40px" }}>
    //             <path d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z" fill="#d0d0d0" />
    //         </svg>
    //         <div
    //             className="starcbutton dragtoadd active"
    //             style={{
    //                 backgroundImage: 'url("https://static.coggle.it/img/addbutton.svg")',
    //                 backgroundColor: "#d0d0d0",
    //                 top: "25px",
    //                 left: "0px",
    //                 backgroundPosition: "50% 50%",
    //                 backgroundRepeat: "no-repeat",
    //                 backgroundSize: "20px auto",
    //                 border: "2px solid hsla(0, 0%, 100%, 0.4)",
    //                 borderRadius: "50%",
    //                 boxSizing: "content-box",
    //                 height: "24px",
    //                 left: "2px",
    //                 marginLeft: "-14px",
    //                 marginTop: "-14px",
    //                 pointerEvents: "auto",
    //                 position: "absolute",
    //                 transition: "transform 0.3s ease-out",
    //                 width: "24px",
    //                 zIndex: 3,
    //                 cursor: "pointer",
    //                 opacity: 1,
    //             }}
    //         ></div>




//             {isHovered && id !== "1" && (
//                 <button onClick={() => onDelete(id)} style={buttonStyle}>×</button>
//             )}

//             {isHovered && ["top", "right", "bottom", "left"].map((pos) => (
//                 <button key={pos} onClick={() => onAdd(id, pos)} style={getButtonStyle(pos)}>+</button>
//             ))}

//             {/* {["top", "right", "bottom", "left"].map((pos) => (
//                 <React.Fragment key={pos}>
//                     <Handle type="source" position={pos} id={pos} />
//                     <Handle type="target" position={pos} id={pos} />
//                 </React.Fragment>
//             ))} */}
//         </div>
//     );
// };

// const buttonStyle = {
//     position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white",
//     border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer",
//     display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", zIndex: 10
// };

// const getButtonStyle = (position) => {
//     const styles = {
//         top: { top: "-12px", left: "50%", transform: "translateX(-50%)" },
//         right: { top: "50%", right: "-12px", transform: "translateY(-50%)" },
//         bottom: { bottom: "-12px", left: "50%", transform: "translateX(-50%)" },
//         left: { top: "50%", left: "-12px", transform: "translateY(-50%)" },
//     };

//     return {
//         position: "absolute", background: "#28a745", color: "white", border: "none",
//         borderRadius: "50px", fontSize: "12px", cursor: "pointer", zIndex: 10, ...styles[position]
//     };
// };

// export default EditableNode;