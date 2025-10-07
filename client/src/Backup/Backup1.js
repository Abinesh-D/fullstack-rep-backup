

//   const addNode = (parentId, direction, lines) => {
//     console.log("addNode called with:", { parentId, direction, lines });

//     const parentNode = nodes.find(node => node.id === parentId);
//     if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//     }

//     if (!lines || lines.length === 0) {
//         console.warn("No lines provided!");
//         return;
//     }

//     const offset = 250;
//     let newX = parentNode.position.x;
//     let newY = parentNode.position.y;

//     const sourceHandle = direction;
//     const targetHandle = oppositeHandle(direction);

//     // Create multiple nodes
//     const newNodes = [];
//     const newEdges = [];

//     lines.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         switch (direction) {
//             case "top":
//                 newY -= offset - 100;
//                 break;
//             case "right":
//                 newX += offset;
//                 break;
//             case "bottom":
//                 newY += offset - 100;
//                 break;
//             case "left":
//                 newX -= offset;
//                 break;
//             default:
//                 break;
//         }

//         console.log(`Creating node ${newNodeId} at x:${newX}, y:${newY}`);

//         const newNode = {
//             id: newNodeId,
//             position: { x: newX, y: newY },
//             data: {
//                 label: line, // Set label from lines array
//                 onDelete: deleteNode,
//                 onAdd: addNode,
//                 onLabelChange: onLabelChange,
//             },
//             type: "editableNode",
//         };

//         const newEdge = {
//             id: `e${parentId}-${newNodeId}`,
//             source: parentId,
//             sourceHandle,
//             target: newNodeId,
//             targetHandle,
//             animated: true,
//             type: "smoothstep",
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//     });

//     console.log("New nodes:", newNodes);
//     console.log("New edges:", newEdges);

//     setNodes(prevNodes => [...prevNodes, ...newNodes]);
//     setEdges(prevEdges => [...prevEdges, ...newEdges]);
// };




//   const addNode = (parentId, direction, lines) => {
//     const parentNode = nodes.find(node => node.id === parentId);
//     if (!parentNode || lines && lines.length === 0) return;

//     const offset = 250;
//     let newX = parentNode.position.x;
//     let newY = parentNode.position.y;

//     const sourceHandle = direction;
//     const targetHandle = oppositeHandle(direction);

//     // Create multiple nodes
//     const newNodes = [];
//     const newEdges = [];

//     lines?.forEach((line, index) => {
//         const newNodeId = (nodes.length + index + 1).toString();

//         switch (direction) {
//             case "top":
//                 newY -= offset - 100;
//                 break;
//             case "right":
//                 newX += offset;
//                 break;
//             case "bottom":
//                 newY += offset - 100;
//                 break;
//             case "left":
//                 newX -= offset;
//                 break;
//             default:
//                 break;
//         }

//         const newNode = {
//             id: newNodeId,
//             position: { x: newX, y: newY },
//             data: {
//                 label: line,
//                 onDelete: deleteNode,  
//                 onAdd: addNode,        
//                 onLabelChange: onLabelChange, 
//             },
//             type: "editableNode",
//         };

//         const newEdge = {
//             id: `e${parentId}-${newNodeId}`,
//             source: parentId,
//             sourceHandle,
//             target: newNodeId,
//             targetHandle,
//             animated: true,
//             type: "smoothstep",
//         };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//     });

//     setNodes(prevNodes => [...prevNodes, ...newNodes]);
//     setEdges(prevEdges => [...prevEdges, ...newEdges]);
// };



//   const addNode = (parentId, direction, lines) => {
//     console.log('parentId, direction :>> ', parentId, direction, lines.length);
//     const parentNode = nodes.find(node => node.id === parentId);
//     if (!parentNode) return;
  
//     const newNodeId = (nodes.length + 1).toString();
//     let newX = parentNode.position.x;
//     let newY = parentNode.position.y;
  
//     const offset = 250;
  
//     let sourceHandle = direction;
//     let targetHandle = oppositeHandle(direction);
  
//     switch (direction) {
//       case "top":
//         newY -= offset - 100;
//         break;
//       case "right":
//         newX += offset;
//         break;
//       case "bottom":
//         newY += offset - 100;
//         break;
//       case "left":
//         newX -= offset;
//         break;
//       default:
//         break;
//     }
  
//     const newNode = {
//       id: newNodeId,
//       position: { x: newX, y: newY },
//       data: { 
//         label: `Node ${nodes.length + 1}`,
//         onDelete: deleteNode,  // Pass deleteNode function
//         onAdd: addNode,        // Pass addNode function
//         onLabelChange: onLabelChange, // Pass label change function
//       },
//       type: "editableNode",
//     };
  
//     const newEdge = {
//       id: `e${parentId}-${newNodeId}`,
//       source: parentId,
//       sourceHandle, // Dynamic source handle
//       target: newNodeId,
//       targetHandle, // Dynamic target handle
//       animated: true,
//       type: "smoothstep",
//     };
  
//     setNodes((prevNodes) => [...prevNodes, newNode]);
//     setEdges((prevEdges) => [...prevEdges, newEdge]);
//   };