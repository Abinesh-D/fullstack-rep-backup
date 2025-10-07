import { useCallback, useEffect } from "react";
import { getRandomColor, oppositeHandle } from "./MindMapSlice/Reusable/EdgeUtlis"; 

const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange, type, excelFileData, nodeId, nodeType }) => {

  const addNode = useCallback(
    (parentId, direction, lines = ["Click to edit"]) => {

      if (!Array.isArray(lines)) lines = [lines];

      const parentNode = nodes.find((node) => node.id === parentId);
      if (!parentNode) {
        console.warn("Parent node not found!");
        return;
      }
      const parentX = parentNode.position.x;
      const parentY = parentNode.position.y;
      const baseSpacing = 80;
      const offset = 150;

      let startX = parentX;
      let startY = parentY;
      let axis = direction === "top" || direction === "bottom" ? "x" : "y";

      if (direction === "top") startY -= offset;
      if (direction === "bottom") startY += offset;
      if (direction === "left") startX -= offset;
      if (direction === "right") startX += offset;

      const newNodes = [];
      const newEdges = [];
      const existingNodes = nodes.filter((node) =>
        axis === "x" ? node.position.y === startY : node.position.x === startX
      );

      let spread = 0;
      const newChildIds = [];

      lines.forEach((line, index) => {
        const newNodeId = (nodes.length + index + 1).toString();

        while (existingNodes.some((node) =>
          node.position.x === (axis === "x" ? startX + spread : startX) &&
          node.position.y === (axis === "y" ? startY + spread : startY)
        )) {
          spread += baseSpacing;
        }

        const newX = axis === "x" ? startX + spread : startX;
        const newY = axis === "y" ? startY + spread : startY;

        const newNode = {
          id: newNodeId,
          position: { x: newX, y: newY }, 
          data: {
            label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
            onDelete: deleteNode,
            onAdd: addNode,
            onLabelChange: onLabelChange,
          },
          type: "editableNode",
          createdByPaste: lines.length > 1,
          children: [],
          exfiledata: true,
        };

        const edgeColor = getRandomColor();

        const newEdge = {
          id: `e${parentId}-${newNodeId}`,
          source: parentId,
          sourceHandle: direction,
          target: newNodeId,
          targetHandle: oppositeHandle(direction),
          animated: true,
          type: "smoothstep",
          data: { direction },
          style: { stroke: edgeColor, strokeWidth: 2 },
          markerEnd: { type: "arrowclosed" },
        };

        newNodes.push(newNode);
        newEdges.push(newEdge);
        newChildIds.push(newNodeId);
        existingNodes.push(newNode);
      });

      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === parentId
            ? { ...node, children: [...(node.children || []), ...newChildIds] }
            : node
        ).concat(newNodes)
      );

      setEdges((prevEdges) => [...prevEdges, ...newEdges]);
    },
    [nodes, setNodes, setEdges, deleteNode, onLabelChange]
  );

  return addNode;
};
export default AddNodeHandler;










// import { useCallback } from "react";
// import { getRandomColor, oppositeHandle } from "./MindMapSlice/Reusable/EdgeUtlis"; 


// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   console.log('datadatadatadata')
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {

//       if (!Array.isArray(lines)) lines = [lines];

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const baseSpacing = 80;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];
//       const existingNodes = nodes.filter((node) =>
//         axis === "x" ? node.position.y === startY : node.position.x === startX
//       );

//       let spread = 0;
//       const newChildIds = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         while (existingNodes.some((node) =>
//           node.position.x === (axis === "x" ? startX + spread : startX) &&
//           node.position.y === (axis === "y" ? startY + spread : startY)
//         )) {
//           spread += baseSpacing;
//         }

//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY }, 
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1,
//           children: [],
//         };

//         const edgeColor = getRandomColor();

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "smoothstep",
//           data: { direction },
//           style: { stroke: edgeColor, strokeWidth: 2 },
//           markerEnd: { type: "arrowclosed" },
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//         newChildIds.push(newNodeId);
//         existingNodes.push(newNode);
//       });

//       setNodes((prevNodes) =>
//         prevNodes.map((node) =>
//           node.id === parentId
//             ? { ...node, children: [...(node.children || []), ...newChildIds] }
//             : node
//         ).concat(newNodes)
//       );

//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;




























































        
        // const newEdge = {
        //   id: `e${parentId}-${newNodeId}`,
        //   source: parentId,
        //   sourceHandle: direction,
        //   target: newNodeId,
        //   targetHandle: oppositeHandle(direction),
        //   animated: true,
        //   type: "customEdge",
        //   style: { stroke: edgeColor, strokeWidth: 2 },
        //   markerEnd: { type: "arrowclosed" },
        // };


// import { useCallback } from "react";


// // const edgeColors = [
// //   "#FF6B6B", "#FF9F68", "#FFA07A", "#FFD166", "#F4A261",
// //   "#E9C46A", "#B8DE6F", "#67D7C4", "#43AA8B", "#2A9D8F",
// //   "#A1C4FD", "#6A82FB", "#6C5CE7", "#A29BFE", "#845EC2",
// //   "#F78FB3", "#C06C84", "#9B5DE5", "#FF477E", "#FF85A1"
// // ];

// // const getRandomColor = () => edgeColors[Math.floor(Math.random() * edgeColors.length)];

// // const oppositeHandle = (direction) => {
// //   switch (direction) {
// //     case "top": return "bottom";
// //     case "right": return "left";
// //     case "bottom": return "top";
// //     case "left": return "right";
// //     default: return "right";
// //   }
// // };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {
//       if (!Array.isArray(lines)) lines = [lines];

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const baseSpacing = 80;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];
//       const existingNodes = nodes.filter((node) =>
//         axis === "x" ? node.position.y === startY : node.position.x === startX
//       );

//       let spread = 0;
//       const newChildIds = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         while (existingNodes.some((node) =>
//           node.position.x === (axis === "x" ? startX + spread : startX) &&
//           node.position.y === (axis === "y" ? startY + spread : startY)
//         )) {
//           spread += baseSpacing;
//         }

//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY }, 
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1,
//           children: [],
//         };
        

//         const edgeColor = getRandomColor(); 

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "smoothstep",
//           style: { stroke: edgeColor, strokeWidth: 2 }, // Apply random color to edge stroke
//           markerEnd: { type: "arrowclosed" },
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//         newChildIds.push(newNodeId);
//         existingNodes.push(newNode);
//       });

//       setNodes((prevNodes) =>
//         prevNodes.map((node) =>
//           node.id === parentId
//             ? { ...node, children: [...(node.children || []), ...newChildIds] }
//             : node
//         ).concat(newNodes)
//       );

//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;











// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return direction;
//   }
// };

// const edgeColors = [
//   "#FF6B6B", "#FF9F68", "#FFA07A", "#FFD166", "#F4A261",
//   "#E9C46A", "#B8DE6F", "#67D7C4", "#43AA8B", "#2A9D8F",
//   "#A1C4FD", "#6A82FB", "#6C5CE7", "#A29BFE", "#845EC2",
//   "#F78FB3", "#C06C84", "#9B5DE5", "#FF477E", "#FF85A1"
// ];

// const getRandomColor = () => edgeColors[Math.floor(Math.random() * edgeColors.length)];
// const pasteEdgeColor = getRandomColor(); 

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {
//       if (!Array.isArray(lines)) lines = [lines];

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const baseSpacing = 80;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];
//       const existingNodes = nodes.filter((node) =>
//         axis === "x" ? node.position.y === startY : node.position.x === startX
//       );

//       let spread = 0;
//       const newChildIds = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         while (existingNodes.some((node) =>
//           node.position.x === (axis === "x" ? startX + spread : startX) &&
//           node.position.y === (axis === "y" ? startY + spread : startY)
//         )) {
//           spread += baseSpacing;
//         }

//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1,
//           children: [],
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "smoothstep",
//           style: { stroke: pasteEdgeColor, strokeWidth: 2 }, // Ensure dynamic color change
//           markerEnd: { type: "arrowclosed" },
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//         newChildIds.push(newNodeId);
//         existingNodes.push(newNode);
//       });

//       setNodes((prevNodes) =>
//         prevNodes.map((node) =>
//           node.id === parentId
//             ? { ...node, children: [...(node.children || []), ...newChildIds] }
//             : node
//         ).concat(newNodes)
//       );

//       setEdges((prevEdges) => [...prevEdges, ...newEdges.map(edge => ({
//         ...edge,
//         style: { stroke: pasteEdgeColor, strokeWidth: 2 } // Reapply random color on update
//       }))]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;











// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return direction;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {
//       if (!Array.isArray(lines)) lines = [lines];

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const spacing = 80; 
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];

//       const edgeColors = [
//         "#FF6B6B", "#FF9F68", "#FFA07A", "#FFD166", "#F4A261", 
//         "#E9C46A", "#B8DE6F", "#67D7C4", "#43AA8B", "#2A9D8F",
//         "#A1C4FD", "#6A82FB", "#6C5CE7", "#A29BFE", "#845EC2",
//         "#F78FB3", "#C06C84", "#9B5DE5", "#FF477E", "#FF85A1"
//       ];
      
//       const getRandomColor = () => edgeColors[Math.floor(Math.random() * edgeColors.length)];
      
//       const newChildIds = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();
//         let spread = (index - (lines.length - 1) / 2) * spacing;
//         let newX = axis === "x" ? startX + spread : startX;
//         let newY = axis === "y" ? startY + spread : startY;

//         // 🟢 Check if a node already exists at the new position
//         const positionExists = nodes.some((node) => node.position.x === newX && node.position.y === newY);

//         if (positionExists) {
//           // 🔄 Adjust position to avoid overlap
//           if (axis === "x") newX += spacing; 
//           else newY += spacing;
//         }

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1,
//           children: [],
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "smoothstep",
//           style: { stroke: getRandomColor(), strokeWidth: 2 },
//           markerEnd: { type: "arrowclosed" },
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//         newChildIds.push(newNodeId);
//       });

//       setNodes((prevNodes) =>
//         prevNodes.map((node) =>
//           node.id === parentId
//             ? { ...node, children: [...(node.children || []), ...newChildIds] }
//             : node
//         ).concat(newNodes)
//       );

//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;









// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return direction;
//   }
// };
// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {
//       if (!Array.isArray(lines)) {
//         lines = [lines];
//       }

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const spacing = 50;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];
//       const edgeColor = [
//         "#FF6B6B", "#FF9F68", "#FFA07A", "#FFD166", "#F4A261", 
//         "#E9C46A", "#B8DE6F", "#67D7C4", "#43AA8B", "#2A9D8F",
//         "#A1C4FD", "#6A82FB", "#6C5CE7", "#A29BFE", "#845EC2",
//         "#F78FB3", "#C06C84", "#9B5DE5", "#FF477E", "#FF85A1"
//       ];
//             const getRandomColor = () => edgeColor[Math.floor(Math.random() * edgeColor.length)];
//             const pasteEdgeColor = getRandomColor(); 

//       const newChildIds = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();
//         const spread = (index - (lines.length - 1) / 2) * spacing;
//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1,
//           children: [],
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "customEdge",
//           data: { color: pasteEdgeColor, direction }, 
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//         newChildIds.push(newNodeId);
//       });

//       setNodes((prevNodes) =>
//         prevNodes.map((node) =>
//           node.id === parentId
//             ? { ...node, children: [...(node.children || []), ...newChildIds] }
//             : node
//         ).concat(newNodes)
//       );

//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;









// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return direction;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["Click to edit"]) => {
//       if (!Array.isArray(lines)) {
//         lines = [lines];
//       }

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const spacing = 50;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];

//       const edgeColor = [
//         "#efa670", "#ebd95f", "#e68782", "#e096e9", "#988ee3", "#7aa3e5", "#67d7c4",
//         "#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#a833ff", "#33fff5", "#ffdf33",
//         "#ff914d", "#91ff4d", "#4d91ff", "#ff4d91", "#914dff", "#4dff91", "#ffcc00",
//         "#ff6699", "#99ff66", "#6699ff", "#ff9966", "#66ff99", "#9966ff", "#ccff00",
//         "#00ccff", "#ff6600", "#ff3300", "#ff0033", "#cc33ff", "#66ffcc", "#ffccff",
//         "#00ffcc", "#ff99cc", "#ccff99", "#99ccff", "#cc99ff", "#99ffcc", "#ffcc66"
//       ];

//       const getRandomColor = () => edgeColor[Math.floor(Math.random() * edgeColor.length)];
//       const pasteEdgeColor = getRandomColor(); 

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();
//         const spread = (index - (lines.length - 1) / 2) * spacing;
//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: lines.length === 1 && lines[0] === true ? "Click to edit" : line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: lines.length > 1, 
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "customEdge",
//           data: { color: pasteEdgeColor, direction }, 
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//       });

//       setNodes((prevNodes) => [...prevNodes, ...newNodes]);
//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;








// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return null;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["New Node"]) => {
//       if (!Array.isArray(lines)) {
//         lines = [lines]; // Convert to array if it's a string or undefined
//       }

//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const spacing = 50;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];

//       const edgeColor = [
//         "#efa670", "#ebd95f", "#e68782", "#e096e9", "#988ee3", "#7aa3e5", "#67d7c4",
//         "#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#a833ff", "#33fff5", "#ffdf33",
//         "#ff914d", "#91ff4d", "#4d91ff", "#ff4d91", "#914dff", "#4dff91", "#ffcc00",
//         "#ff6699", "#99ff66", "#6699ff", "#ff9966", "#66ff99", "#9966ff", "#ccff00",
//         "#00ccff", "#ff6600", "#ff3300", "#ff0033", "#cc33ff", "#66ffcc", "#ffccff",
//         "#00ffcc", "#ff99cc", "#ccff99", "#99ccff", "#cc99ff", "#99ffcc", "#ffcc66"
//       ];

//       // 🔹 Assign a single color for all edges when pasting multiple lines
//       const getRandomColor = () => edgeColor[Math.floor(Math.random() * edgeColor.length)];
//       const pasteEdgeColor = getRandomColor(); // Single color for all edges in this paste

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();
//         const spread = (index - (lines.length - 1) / 2) * spacing;
//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//           createdByPaste: true,
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "customEdge",
//           data: { color: pasteEdgeColor, direction }, // 🔹 Use the same color for all edges
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//       });

//       setNodes((prevNodes) => [...prevNodes, ...newNodes]);
//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;







// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return null;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {

//  const addNode = useCallback(
//   (parentId, direction, lines = ["New Node"]) => {
//     if (!Array.isArray(lines)) {
//       lines = [lines]; // Convert to array if it's a string or undefined
//     }

//     const parentNode = nodes.find((node) => node.id === parentId);
//     if (!parentNode) {
//       console.warn("Parent node not found!");
//       return;
//     }

//     const parentX = parentNode.position.x;
//     const parentY = parentNode.position.y;
//     const spacing = 50;
//     const offset = 150;

//     let startX = parentX;
//     let startY = parentY;
//     let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//     if (direction === "top") startY -= offset;
//     if (direction === "bottom") startY += offset;
//     if (direction === "left") startX -= offset;
//     if (direction === "right") startX += offset;

//     const newNodes = [];
//     const newEdges = [];

//     const edgeColor = [
//       "#efa670", "#ebd95f", "#e68782", "#e096e9", "#988ee3", "#7aa3e5", "#67d7c4",
//       "#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#a833ff", "#33fff5", "#ffdf33",
//       "#ff914d", "#91ff4d", "#4d91ff", "#ff4d91", "#914dff", "#4dff91", "#ffcc00",
//       "#ff6699", "#99ff66", "#6699ff", "#ff9966", "#66ff99", "#9966ff", "#ccff00",
//       "#00ccff", "#ff6600", "#ff3300", "#ff0033", "#cc33ff", "#66ffcc", "#ffccff",
//       "#00ffcc", "#ff99cc", "#ccff99", "#99ccff", "#cc99ff", "#99ffcc", "#ffcc66"
//     ];



//     lines.forEach((line, index) => { // This will now always work!
//       const newNodeId = (nodes.length + index + 1).toString();
//       const spread = (index - (lines.length - 1) / 2) * spacing;
//       const newX = axis === "x" ? startX + spread : startX;
//       const newY = axis === "y" ? startY + spread : startY;

//       const newNode = {
//         id: newNodeId,
//         position: { x: newX, y: newY },
//         data: {
//           label: line,
//           onDelete: deleteNode,
//           onAdd: addNode,
//           onLabelChange: onLabelChange,
//         },
//         type: "editableNode",
//         createdByPaste: true,
//       };

//       const getRandomColor = () => edgeColor[Math.floor(Math.random() * edgeColor.length)];

//       const newEdge = {
//         id: `e${parentId}-${newNodeId}`,
//         source: parentId,
//         sourceHandle: direction,
//         target: newNodeId,
//         targetHandle: oppositeHandle(direction),
//         animated: true,
//         type: "customEdge",
//         data: { color: getRandomColor(), direction },
//       };

//       newNodes.push(newNode);
//       newEdges.push(newEdge);
//     });

//     setNodes((prevNodes) => [...prevNodes, ...newNodes]);
//     setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//   },
//   [nodes, setNodes, setEdges, deleteNode, onLabelChange]
// );

//   return addNode;
// };

// export default AddNodeHandler;






  // const addNode = useCallback(
  //   (parentId, direction, lines = ["New Node"]) => {
  //     const parentNode = nodes.find((node) => node.id === parentId);
  //     if (!parentNode) {
  //       console.warn("Parent node not found!");
  //       return;
  //     }

  //     const parentX = parentNode.position.x;
  //     const parentY = parentNode.position.y;
  //     const spacing = 50;
  //     const offset = 150;

  //     let startX = parentX;
  //     let startY = parentY;
  //     let axis = direction === "top" || direction === "bottom" ? "x" : "y";

  //     if (direction === "top") startY -= offset;
  //     if (direction === "bottom") startY += offset;
  //     if (direction === "left") startX -= offset;
  //     if (direction === "right") startX += offset;

  //     const newNodes = [];
  //     const newEdges = [];

  //     lines?.forEach((line, index) => {
  //       const newNodeId = (nodes.length + index + 1).toString();

  //       const spread = (index - (lines.length - 1) / 2) * spacing;
  //       const newX = axis === "x" ? startX + spread : startX;
  //       const newY = axis === "y" ? startY + spread : startY;

  //       const newNode = {
  //         id: newNodeId,
  //         position: { x: newX, y: newY },
  //         data: {
  //           label: line,
  //           onDelete: deleteNode,
  //           onAdd: addNode,
  //           onLabelChange: onLabelChange,
  //         },
  //         type: "editableNode",
  //         createdByPaste: true,
  //       };
        
        // const edgeColor = [
        //   "#efa670", "#ebd95f", "#e68782", "#e096e9", "#988ee3", "#7aa3e5", "#67d7c4",
        //   "#ff5733", "#33ff57", "#3357ff", "#ff33a8", "#a833ff", "#33fff5", "#ffdf33",
        //   "#ff914d", "#91ff4d", "#4d91ff", "#ff4d91", "#914dff", "#4dff91", "#ffcc00",
        //   "#ff6699", "#99ff66", "#6699ff", "#ff9966", "#66ff99", "#9966ff", "#ccff00",
        //   "#00ccff", "#ff6600", "#ff3300", "#ff0033", "#cc33ff", "#66ffcc", "#ffccff",
        //   "#00ffcc", "#ff99cc", "#ccff99", "#99ccff", "#cc99ff", "#99ffcc", "#ffcc66"
        // ];

        
        // const getRandomColor = () => edgeColor[Math.floor(Math.random() * edgeColor.length)];
        
  //       const newEdge = {
  //         id: `e${parentId}-${newNodeId}`,
  //         source: parentId,
  //         sourceHandle: direction,
  //         target: newNodeId,
  //         targetHandle: oppositeHandle(direction),
  //         animated: true,
  //         type: "customEdge",
  //         data: { color: getRandomColor(), direction: direction,  }, 
  //       };
        

  //       newNodes.push(newNode);
  //       newEdges.push(newEdge);
  //     });

  //     setNodes((prevNodes) => [...prevNodes, ...newNodes]);

  //     setEdges((prevEdges) => [...prevEdges, ...newEdges]);
  //   },
  //   [nodes, setNodes, setEdges, deleteNode, onLabelChange]
  // );


  




// import { useCallback } from "react";
// import { getBezierPath } from "reactflow";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top": return "bottom";
//     case "right": return "left";
//     case "bottom": return "top";
//     case "left": return "right";
//     default: return null;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["New Node"]) => {
//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const parentX = parentNode.position.x;
//       const parentY = parentNode.position.y;
//       const spacing = 50;
//       const offset = 150;

//       let startX = parentX;
//       let startY = parentY;
//       let axis = direction === "top" || direction === "bottom" ? "x" : "y";

//       if (direction === "top") startY -= offset;
//       if (direction === "bottom") startY += offset;
//       if (direction === "left") startX -= offset;
//       if (direction === "right") startX += offset;

//       const newNodes = [];
//       const newEdges = [];

//       lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         const spread = (index - (lines.length - 1) / 2) * spacing;
//         const newX = axis === "x" ? startX + spread : startX;
//         const newY = axis === "y" ? startY + spread : startY;

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//         };

//         const edgePath = getBezierPath({
//           sourceX: parentX,
//           sourceY: parentY,
//           targetX: newX,
//           targetY: newY,
//         });

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle: direction,
//           target: newNodeId,
//           targetHandle: oppositeHandle(direction),
//           animated: true,
//           type: "smoothstep",
//           style: { stroke: "#6BAE4F", strokeWidth: 4 },
//           path: edgePath,
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//       });

//       setNodes((prevNodes) => [...prevNodes, ...newNodes]);
//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode;
// };

// export default AddNodeHandler;










// import { useCallback } from "react";

// const oppositeHandle = (direction) => {
//   switch (direction) {
//     case "top":
//       return "bottom";
//     case "right":
//       return "left";
//     case "bottom":
//       return "top";
//     case "left":
//       return "right";
//     default:
//       return null;
//   }
// };

// const AddNodeHandler = ({ nodes, setNodes, setEdges, deleteNode, onLabelChange }) => {
//   const addNode = useCallback(
//     (parentId, direction, lines = ["New Node"]) => {
//       const parentNode = nodes.find((node) => node.id === parentId);
//       if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//       }

//       const offset = 250;
//       let newX = parentNode.position.x;
//       let newY = parentNode.position.y;

//       const sourceHandle = direction;
//       const targetHandle = oppositeHandle(direction);

//       const nodeLines = Array.isArray(lines) && lines.length > 0 ? lines : ["New Node"];

//       const newNodes = [];
//       const newEdges = [];

//       nodeLines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         switch (direction) {
//           case "top":
//             newY -= offset - 100;
//             break;
//           case "right":
//             newX += offset;
//             break;
//           case "bottom":
//             newY += offset - 100;
//             break;
//           case "left":
//             newX -= offset;
//             break;
//           default:
//             break;
//         }

//         console.log(`Creating node ${newNodeId} at x:${newX}, y:${newY}`);

//         const newNode = {
//           id: newNodeId,
//           position: { x: newX, y: newY },
//           data: {
//             label: line,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           },
//           type: "editableNode",
//         };

//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle,
//           target: newNodeId,
//           targetHandle,
//           animated: true,
//           style: { stroke: "#9370DB", strokeWidth: 4 },
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//       });
//       setNodes((prevNodes) => [...prevNodes, ...newNodes]);
//       setEdges((prevEdges) => [...prevEdges, ...newEdges]);
//     },
//     [nodes, setNodes, setEdges, deleteNode, onLabelChange]
//   );

//   return addNode; 
// };

// export default AddNodeHandler;
