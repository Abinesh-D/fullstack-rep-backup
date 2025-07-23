import React, { useState, useEffect } from "react";

const ViewContent = ({
  id,
  label,
  link,
  data,
  isBold,
  isItalic,
  setIsEditing,
  isHovered,
  isEditing,
  directions,
  handleAddClick,
  buttonPositions,
  addNode
}) => {
  const [excelFileNodeData, setExcelFileNodeData] = useState([]);


  useEffect(() => {
    if (data.nodes && Array.isArray(data.nodes)) {
      const exfileNodes = data.nodes.filter((node) => node.exfilenode === true);
      const mapData = exfileNodes.map((node) => node.label);
      setExcelFileNodeData(mapData);
    }
  }, [data.nodes]);

  const textStyles = {
    fontSize: "8px",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
  };

  const positionStyles = {
    top: { top: "-30px", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "30px", left: "50%", transform: "translateX(-50%)" },
    left: { left: "-40px", top: "50%", transform: "translateY(-50%)" },
    right: { left: "20px", top: "47%", transform: "translateY(-50%)" },
  };

  const isDefaultNode = id === "6616c2e8c5043c003ad731ae";
  const textPosition = positionStyles[data.direction] || positionStyles.right;

  const childNodes = (
    <div style={{ position: "relative" }} onClick={() => setIsEditing(true)}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60px",
          minWidth: "100px",
        }}
      >
        {data.isImageNode ? (
          <img
            src={data.image}
            alt="Preview"
            style={{
              maxWidth: "100px",
              maxHeight: "60px",
              minWidth: "50px",
              minHeight: "30px",
              objectFit: "contain",
              borderRadius: "5px",
            }}
          />
        ) : data.exfilenode ? (
          <span
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: "10px",
              color: "#333",
              backgroundColor: "#f0f0f0",
              padding: "4px 8px",
              borderRadius: "6px",
              boxShadow: "0px 1px 2px rgba(226, 30, 30, 0.1)",
              ...textPosition,
            }}
          >
            {excelFileNodeData.join(", ")}
          </span>
        ) : (
          <span
            style={{
              position: "absolute",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSize: "7px",
              color: "#333",
              backgroundColor: data.exfilenode ? "#e0f7fa" : "transparent",
              borderRadius: data.exfilenode ? "4px" : "0",
              padding: data.exfilenode ? "2px 6px" : "0",
              ...textPosition,
            }}
          >
            {data.data.label}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ ...textStyles, cursor: "pointer" }} draggable={!isDefaultNode}>
      <div>
        {isDefaultNode ? (
          <>
            <div
              onClick={() => setIsEditing(true)}
              style={{
                fontWeight: data.data.bold ? "bold" : "normal",
                fontStyle: data.data.italic ? "italic" : "normal",
                textDecoration: data.data.link ? "underline" : "none",
                cursor: "pointer",
              }}
              className="edit-text"
            >
              {data.link ? (
                <a href={data.data.link} target="_blank" rel="noopener noreferrer">
                  {data.data.label}
                </a>
              ) : (
                data.data.label
              )}
            </div>

            <svg
              onClick={() => setIsEditing(true)}
              height="27"
              width="38"
              viewBox="-40 -23 80 46"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z"
                fill="#d0d0d0"
              />
            </svg>
          </>
        ) : (
          childNodes
        )}
      </div>

      {isHovered &&
        !isEditing &&
        directions.map((dir) => (
          <div
            key={dir}
            onClick={() => handleAddClick(dir)}
            className={`starcbutton ${dir}`}
            style={buttonPositions[dir]}
          ></div>
        ))}
    </div>
  );
};

export default ViewContent;








// import React, { useState, useEffect } from "react";

// const ViewContent = ({
//     id,
//     label,
//     link,
//     data,
//     isBold,
//     isItalic,
//     setIsEditing,
//     isHovered,
//     isEditing,
//     directions,
//     handleAddClick,
//     buttonPositions,
//     addNode
// }) => {

//     const [excelFileNodeData, setexcelFileNodeData] = useState([]);

//     console.log('ViewContent', data );

//     useEffect(() => {
//         const exfileNodes = data.nodes.filter((node) => node.exfilenode === true);
//         const mapData = exfileNodes.map((node) => node.data?.label);
//         setexcelFileNodeData(mapData);
//     }, [data.nodes]);

//     const updData = data.nodes.map(nde => nde.exfilenode === true)
//     const textStyles = { fontSize: "8px", fontWeight: "normal", fontStyle: "normal", textDecoration: "none", };
//     const positionStyles = {
//         top: { top: "-30px", left: "50%", transform: "translateX(-50%)" },
//         bottom: { top: "30px", left: "50%", transform: "translateX(-50%)" },
//         left: { left: "-40px", top: "50%", transform: "translateY(-50%)" },
//         right: { left: "20px", top: "47%", transform: "translateY(-50%)" },
//     };

//     const textPosition = data._id !== "6616c2e8c5043c003ad731ae" && positionStyles[data.direction] || data._id !== '6616c2e8c5043c003ad731ae' && positionStyles.right;

//     const childNodes = (
//         <>
//             <div style={{ position: "relative" }} onClick={() => setIsEditing(true)}>
//                 <div
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         minHeight: "60px",
//                         minWidth: "100px",
//                     }}
//                 >
//                     {data.isImageNode ? (
//                         <img
//                             src={data.image}
//                             alt="Preview"
//                             style={{
//                                 maxWidth: "100px",
//                                 maxHeight: "60px",
//                                 minWidth: "50px",
//                                 minHeight: "30px",
//                                 objectFit: "contain",
//                                 borderRadius: "5px",
//                             }}
//                         />
//                     ) : (data.exfilenode ? (
//                         <span
//                             style={{
//                                 position: "absolute",
//                                 whiteSpace: "nowrap",
//                                 textAlign: "center",
//                                 fontSize: "10px",
//                                 color: "#333",
//                                 backgroundColor: "#f0f0f0",
//                                 padding: "4px 8px",
//                                 borderRadius: "6px",
//                                 boxShadow: "0px 1px 2px rgba(226, 30, 30, 0.1)",
//                                 ...textPosition,
//                             }}
//                         >
//                             {excelFileNodeData}
//                         </span>

//                     ) : (
//                         <span
//                             style={{
//                                 position: "absolute",
//                                 whiteSpace: "nowrap",
//                                 textAlign: "center",
//                                 fontSize: "7px",
//                                 color: "#333",
//                                 backgroundColor: updData ? "#e0f7fa" : "transparent",
//                                 borderRadius: updData ? "4px" : "0",
//                                 padding: updData ? "2px 6px" : "0",
//                                 ...textPosition,
//                             }}
//                         >
//                             {data.label}
//                         </span>
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
//     return (

//         <>
//             <div className="" style={{ ...textStyles, cursor: "pointer" }} draggable={data._id !== "6616c2e8c5043c003ad731ae"}>
//                 <div className="">
//                     {data._id === "6616c2e8c5043c003ad731ae" ? (
//                         <>
//                             <div
//                                 onClick={() => setIsEditing(true)}
//                                 style={{
//                                     fontWeight: isBold ? "bold" : "normal",
//                                     fontStyle: isItalic ? "italic" : "normal",
//                                     textDecoration: link ? "underline" : "none",
//                                     cursor: "pointer",
//                                 }}
//                                 className="edit-text"
//                             >
//                                 {link ? (
//                                     <a href={link} target="_blank" rel="noopener noreferrer">
//                                         {label}
//                                     </a>
//                                 ) : (
//                                     data.data.label
//                                 )}
//                             </div>
                            
//                             <svg onClick={() => setIsEditing(true)} height="27" width="38" viewBox="-40 -23 80 46" xmlns="http://www.w3.org/2000/svg">
//                                 <path
//                                     d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z"
//                                     fill="#d0d0d0"
//                                 />
//                             </svg>
//                         </>
//                     ) : (
//                         childNodes
//                     )}
//                 </div>
//                 {isHovered &&
//                     !isEditing &&
//                     directions.map((dir) => (
//                         <div key={dir} onClick={() => handleAddClick(dir)} className={`starcbutton ${dir}`} style={buttonPositions[dir]}></div>
//                     ))}
//             </div>
//         </>

//     );
// };

// export default ViewContent;


 {/* <div
                className="starcbutton"
                style={{
                    backgroundSize: "10px auto",
                    height: "14px",
                    width: "14px",
                    backgroundColor: "#ebd95f",
                    position: "absolute",
                    ...positionStyles,
                }}
                onClick={() => { addNode(id, ) }}
            ></div> */}