import React from "react";
// import "./NodeStyles.css"; 



const nodesData = [
  {
    id: "67d7b5cbdd5a91b426b36f06",
    label: "main",
    position: { left: "-26px", top: "0px" },
    textColor: "rgb(65, 65, 65)",
    bgColor: "#d0d0d0",
  },
];

const NodeComponent = () => {
  return (
    <div className="nodes" style={{ left: "6224px", top: "2816px" }}>
      {nodesData.map((node) => (
        <div
          key={node.id}
          className="node-container shape lr-center tb-middle"
          data-nodeid={node.id}
          style={{ color: node.textColor, ...node.position, fontSize: "8px" }}
        >
          <div className="node-content" dir="auto" tabIndex="1" style={{ fontSize: "8px", width: "40px" }}>
            <div className="text-content">
              <p><span>{node.label}</span></p>
            </div>
          </div>
          <div className="comment-count" style={{ background: node.bgColor }}></div>
          <svg
            className="shapebackground"
            height="36"
            width="80"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-40 -18 80 36"
            style={{ margin: "-18px 0px 0px -40px" }}
          >
            <path
              d="M -33,4.9 L -40,0,-33,-4.9,-33,-8.5 A 2.5,2.5,0,0,1,-30.5,-11 L -4.9,-11,0,-18,4.9,-11,30.5,-11 A 2.5,2.5,0,0,1,33,-8.5 L 33,-4.9,40,0,33,4.9,33,8.5 A 2.5,2.5,0,0,1,30.5,11 L 4.9,11,0,18,-4.9,11,-30.5,11 A 2.5,2.5,0,0,1,-33,8.5 Z"
              fill={node.bgColor}
            ></path>

          </svg>
          
        </div>
      ))}
    </div>
  );
};

export default NodeComponent;
