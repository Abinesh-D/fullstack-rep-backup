const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const getStoredColor = (edgeId) => {
  return localStorage.getItem(`edge-color-${edgeId}`) || "#67d7c4";
};

const handleFileUpload = async (fileOrData, type, id, setNodes, setEdges, nodes, edges) => {
  if (!fileOrData) return;

  if (type === "excel") {
    handleExcelFileUpload(fileOrData, id, setNodes, setEdges, nodes, edges);
  } else if (fileOrData.type?.includes("image")) {
    const base64Image = await toBase64(fileOrData);
    const newNodeId = `img-${nodes.length + 1}`;
    const baseNode = nodes.find((node) => node.id === id) || nodes[nodes.length - 1];
    const newX = baseNode ? baseNode.position.x + 150 : 200;
    const newY = baseNode ? baseNode.position.y : 100;

    const newNode = {
      id: newNodeId,
      position: { x: newX, y: newY },
      data: { label: "Uploaded Image", image: base64Image, isImageNode: true },
      type: "editableNode",
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);

    if (baseNode) {
      const existingEdge = edges.find((edge) => edge.source === baseNode.id);
      const edgeColor = existingEdge?.data?.color || "#67d7c4";

      const newEdge = {
        id: `e${baseNode.id}-${newNodeId}`,
        source: baseNode.id,
        target: newNodeId,
        animated: true,
        type: "customEdge",
        data: { color: edgeColor, direction: "bottom", isImageNode: true, },
      };
      setEdges((prevEdges) => [...prevEdges, newEdge]);
    }
  } else {
    console.warn("Unsupported file type");
  }
};

const handleExcelFileUpload = (data, id, setNodes, setEdges, nodes, edges) => {
  const parentNode = nodes.find((n) => n.id === id);
  const edgeFromNode = edges.find((e) => e.source === id);
  const direction = edgeFromNode?.data?.direction || "right";

  const xOffset = 350;
  const edgeXOffset = -100; 

  const { parsedNodes, parsedEdges, topLevelNodeIds } = parseHierarchicalData(
    data,
    id,
    nodes,
    edges,
    xOffset,
    edgeXOffset
  );

  if (parsedNodes.length) setNodes((prev) => [...prev, ...parsedNodes]);

  const additionalEdges = topLevelNodeIds.map((targetId) => {
    const edgeId = `e${id}-${targetId}`;
    return {
      id: edgeId,
      source: id,
      target: targetId,
      currentnodeid: id,
      type: "customEdge",
      data: {
        color: getStoredColor(edgeId),
        direction,
        offsetX: edgeXOffset,
        isFromExcel: true, 
      },
      animated: true,
      style: {
        strokeWidth: 2,
        stroke: getStoredColor(edgeId),
      },
      markerEnd: { type: "arrowclosed" },
      exfileedge: true,
    };
  });
  setEdges((prev) => [...prev, ...parsedEdges, ...additionalEdges]);


};

const parseHierarchicalData = (
  data,
  id,
  existingNodes = [],
  existingEdges = [],
  xOffset = 300,
  edgeXOffset = 0
) => {
  const parsedNodes = [];
  const parsedEdges = [];
  const topLevelNodeIds = [];

  const nodeMap = new Map(existingNodes.map((n) => [n.id, n]));
  const edgeSet = new Set(existingEdges.map((e) => e.id));
  // const columnNames = Object.keys(data[0]);
  const columnNames = Array.from(
    new Set(data.flatMap((row) => Object.keys(row)))
  );
  


  data.forEach((row, rowIndex) => {
    let parentNodeId = null;

    columnNames.forEach((col, colIndex) => {
      const nodeValue = row[col];
      if (!nodeValue) return;

      const nodeId = String(nodeValue).trim();

      if (!nodeMap.has(nodeId)) {
        const newNode = {
          id: nodeId,
          data: { label: nodeId },
          position: {
            x: colIndex * 200 + xOffset,
            y: rowIndex * 100,
          },
          exfilenode: true,
          currentnodeid: id,
          type: "editableNode",
        };
        parsedNodes.push(newNode);
        nodeMap.set(nodeId, newNode);
      }

      if (colIndex === 0 && !topLevelNodeIds.includes(nodeId)) {
        topLevelNodeIds.push(nodeId);
      }

      if (parentNodeId && parentNodeId !== nodeId) {
        const edgeId = `e${parentNodeId}-${nodeId}`;
        if (!edgeSet.has(edgeId)) {
          parsedEdges.push({
            id: edgeId,
            source: parentNodeId,
            target: nodeId,
            currentnodeid: id,
            type: "customEdge",
            data: {
              color: getStoredColor(edgeId),
              direction: "right",
              offsetX: edgeXOffset,
              isFromExcel: true,
            },
            animated: true,
            style: {
              strokeWidth: 2,
              stroke: getStoredColor(edgeId),
            },
            markerEnd: {
              type: "arrowclosed",
            },
            exfileedge: true,
          });
          edgeSet.add(edgeId);
        }
      }
      parentNodeId = nodeId;
    });
  });
  return { parsedNodes, parsedEdges, topLevelNodeIds };
};


export { handleFileUpload };
















// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

//   const getStoredColor = (edgeId) => {
//     return localStorage.getItem(`edge-color-${edgeId}`) || "#67d7c4";
//   };
  

//   const handleFileUpload = async (fileOrData, type, id, setNodes, setEdges, nodes, edges) => {
//     console.log('fileOrData :>> ', fileOrData, nodes);
//     if (!fileOrData) return;
  
//     if (type === "excel") {
//       handleExcelFileUpload(fileOrData, id, setNodes, setEdges, nodes, edges);
//     } else if (fileOrData.type?.includes("image")) {
//       const base64Image = await toBase64(fileOrData);
//       const newNodeId = `img-${nodes.length + 1}`;
//       const baseNode = nodes.find((node) => node.id === id) || nodes[nodes.length - 1];
//       const newX = baseNode ? baseNode.position.x + 150 : 200;
//       const newY = baseNode ? baseNode.position.y : 100;
  
//       const newNode = {
//         id: newNodeId,
//         position: { x: newX, y: newY },
//         data: { label: "Uploaded Image", image: base64Image, isImageNode: true },
//         type: "editableNode",
//       };
  
//       setNodes((prevNodes) => [...prevNodes, newNode]);
  
//       if (baseNode) {
//         const existingEdge = edges.find((edge) => edge.source === baseNode.id);
//         const edgeColor = existingEdge?.data?.color || "#67d7c4";
  
//         const newEdge = {
//           id: `e${baseNode.id}-${newNodeId}`,
//           source: baseNode.id,
//           target: newNodeId,
//           animated: true,
//           type: "customEdge",
//           data: { color: edgeColor, direction: "bottom" },
//         };
//         setEdges((prevEdges) => [...prevEdges, newEdge]);
//       }
//     } else {
//       console.warn("Unsupported file type");
//     }
//   };
  

//   const handleExcelFileUpload = (data, id, setNodes, setEdges, nodes, edges) => {
//     console.log(id, 'iddddddd', edges)
//     const parentNode = nodes.find((n) => n.id === id); // this line fails if nodes is undefined
  
//     const edgeFromNode = edges.find((e) => e.source === id);
//     const direction = edgeFromNode?.data?.direction || "right";
  
//     // const { parsedNodes, parsedEdges, topLevelNodeIds } = parseHierarchicalData(
//     //   data,
//     //   id,
//     //   nodes,
//     //   edges,
//       // parentNode,
//       // direction,
//     // );
  

//     const { parsedNodes, parsedEdges, topLevelNodeIds } = parseHierarchicalData(
//       data,
//       id,
//       nodes,
//       edges,
//       350 // This value pushes all nodes 300px to the right
//     );
    
//     if (parsedNodes.length) setNodes((prev) => [...prev, ...parsedNodes]);
  
//     const additionalEdges = topLevelNodeIds.map((targetId) => {
//       const edgeId = `e${id}-${targetId}`;
//       return {
//         id: edgeId,
//         source: id,
//         target: targetId,
//         currentnodeid: id,
//         type: "customEdge",
//         data: { color: getStoredColor(edgeId), direction },
//         animated: true,
//         style: {
//           strokeWidth: 2,
//           stroke: getStoredColor(edgeId),
//         },
//         markerEnd: { type: "arrowclosed" },
//         exfileedge: true,
//       };
//     });
  
//     setEdges((prev) => [...prev, ...parsedEdges, ...additionalEdges]);
//   };
  

//   const parseHierarchicalData = (
//     data,
//     id,
//     existingNodes = [],
//     existingEdges = [],
//     xOffset = 300 // You can tweak this value to move more or less to the right
//   ) => {
//     const parsedNodes = [];
//     const parsedEdges = [];
//     const topLevelNodeIds = [];
  
//     const nodeMap = new Map(existingNodes.map((n) => [n.id, n]));
//     const edgeSet = new Set(existingEdges.map((e) => e.id));
//     const columnNames = Object.keys(data[0]);
  
//     data.forEach((row, rowIndex) => {
//       let parentNodeId = null;
  
//       columnNames.forEach((col, colIndex) => {
//         const nodeValue = row[col];
//         if (!nodeValue) return;
  
//         const nodeId = String(nodeValue).trim();
  
//         if (!nodeMap.has(nodeId)) {
//           const newNode = {
//             id: nodeId,
//             data: { label: nodeId },
//             position: {
//               x: colIndex * 200 + xOffset, // 💡 shifted to the right
//               y: rowIndex * 100,
//             },
//             exfilenode: true,
//             currentnodeid: id,
//             type: "editableNode",
//           };
//           parsedNodes.push(newNode);
//           nodeMap.set(nodeId, newNode);
//         }
  
//         if (colIndex === 0 && !topLevelNodeIds.includes(nodeId)) {
//           topLevelNodeIds.push(nodeId);
//         }
  
//         if (parentNodeId && parentNodeId !== nodeId) {
//           const edgeId = `e${parentNodeId}-${nodeId}`;
//           if (!edgeSet.has(edgeId)) {
//             parsedEdges.push({
//               id: edgeId,
//               source: parentNodeId,
//               target: nodeId,
//               currentnodeid: id,
//               type: "customEdge",
//               data: {
//                 color: getStoredColor(edgeId),
//                 direction: "right",
//               },
//               animated: true,
//               style: {
//                 strokeWidth: 2,
//                 stroke: getStoredColor(edgeId),
//               },
//               markerEnd: {
//                 type: "arrowclosed",
//               },
//               exfileedge: true,
//             });
//             edgeSet.add(edgeId);
//           }
//         }
  
//         parentNodeId = nodeId;
//       });
//     });
  
//     return { parsedNodes, parsedEdges, topLevelNodeIds };
//   };

// export { handleFileUpload };







 // const parseHierarchicalData = (data, id, existingNodes = [], existingEdges = []) => {
  //   const parsedNodes = [];
  //   const parsedEdges = [];
  //   const topLevelNodeIds = [];
  
  //   const nodeMap = new Map(existingNodes.map((n) => [n.id, n]));
  //   const edgeSet = new Set(existingEdges.map((e) => e.id));
  //   const columnNames = Object.keys(data[0]);
  
  //   data.forEach((row, rowIndex) => {
  //     let parentNodeId = null;
  
  //     columnNames.forEach((col, colIndex) => {
  //       const nodeValue = row[col];
  //       if (!nodeValue) return;
  
  //       const nodeId = String(nodeValue).trim();
  
  //       if (!nodeMap.has(nodeId)) {
  //         const newNode = {
  //           id: nodeId,
  //           data: { label: nodeId },
  //           position: { x: colIndex * 200, y: rowIndex * 100 },
  //           exfilenode: true,
  //           currentnodeid: id,
  //           type: "editableNode",
  //         };
  //         parsedNodes.push(newNode);
  //         nodeMap.set(nodeId, newNode);
  //       }
  
  //       // track top-level (first column) node
  //       if (colIndex === 0 && !topLevelNodeIds.includes(nodeId)) {
  //         topLevelNodeIds.push(nodeId);
  //       }
  
  //       // create edge from previous column node
  //       if (parentNodeId && parentNodeId !== nodeId) {
  //         const edgeId = `e${parentNodeId}-${nodeId}`;
  //         if (!edgeSet.has(edgeId)) {
  //           parsedEdges.push({
  //             id: edgeId,
  //             source: parentNodeId,
  //             target: nodeId,
  //             currentnodeid: id,
  //             type: "customEdge",
  //             data: {
  //               color: getStoredColor(edgeId),
  //               direction: "right",
  //             },
  //             animated: true,
  //             style: {
  //               strokeWidth: 2,
  //               stroke: getStoredColor(edgeId),
  //             },
  //             markerEnd: {
  //               type: "arrowclosed",
  //             },
  //             exfileedge: true,
  //           });
  //           edgeSet.add(edgeId);
  //         }
  //       }
  
  //       parentNodeId = nodeId;
  //     });
  //   });
  
  //   return { parsedNodes, parsedEdges, topLevelNodeIds };
  // };



  // const handleExcelFileUpload = (data, id, setNodes, setEdges, nodes) => {
  //   const { parsedNodes, parsedEdges } = parseHierarchicalData(data, id, setNodes, setEdges, nodes);

  //   console.log('parsedNodes, parsedEdges :>> ', parsedNodes, parsedEdges);
  
  //   if (parsedNodes && parsedNodes.length > 0) {
  //     setNodes((prevNodes) => [...prevNodes, ...parsedNodes]);
  //   }
  
  //   if (parsedEdges && parsedEdges.length > 0) {
  //     setEdges((prevEdges) => [...prevEdges, ...parsedEdges]);
  //   }
  // };
  

  // const handleExcelFileUpload = (data, id, setNodes, setEdges, nodes, edges) => {
  //   const { parsedNodes, parsedEdges, topLevelNodeIds } = parseHierarchicalData(data, id, nodes, edges);
  
  //   if (parsedNodes.length) {
  //     setNodes((prev) => [...prev, ...parsedNodes]);
  //   }
  
  //   const additionalEdges = topLevelNodeIds.map((targetId) => {
  //     const edgeId = `e${id}-${targetId}`;
  //     return {
  //       id: edgeId,
  //       source: id,
  //       target: targetId,
  //       currentnodeid: id,
  //       type: "customEdge",
  //       data: {
  //         color: getStoredColor(edgeId),
  //         direction: "right",
  //       },
  //       animated: true,
  //       style: {
  //         strokeWidth: 2,
  //         stroke: getStoredColor(edgeId),
  //       },
  //       markerEnd: {
  //         type: "arrowclosed",
  //       },
  //       exfileedge: true,
  //     };
  //   });
  
  //   if (parsedEdges.length || additionalEdges.length) {
  //     setEdges((prev) => [...prev, ...parsedEdges, ...additionalEdges]);
  //   }
  // };
  

  // const parseHierarchicalData = (data, id, existingNodes = [], existingEdges = []) => {
  //   const parsedNodes = [];
  //   const parsedEdges = [];
  //   const topLevelNodeIds = [];
  
  //   const nodeMap = new Map(existingNodes.map((n) => [n.id, n]));
  //   const edgeSet = new Set(existingEdges.map((e) => e.id));
  //   const columnNames = Object.keys(data[0]);
  
  //   data.forEach((row, rowIndex) => {
  //     let parentNodeId = null;
  
  //     columnNames.forEach((col, colIndex) => {
  //       const nodeValue = row[col];
  //       if (!nodeValue) return;
  
  //       const nodeId = String(nodeValue).trim();
  
  //       if (!nodeMap.has(nodeId)) {
  //         const newNode = {
  //           id: nodeId,
  //           data: { label: nodeId },
  //           position: { x: colIndex * 200, y: rowIndex * 100 },
  //           exfilenode: true,
  //           currentnodeid: id,
  //           type: "editableNode",
  //         };
  //         parsedNodes.push(newNode);
  //         nodeMap.set(nodeId, newNode);
  //       }
  
  //       // track top-level (first column) node
  //       if (colIndex === 0 && !topLevelNodeIds.includes(nodeId)) {
  //         topLevelNodeIds.push(nodeId);
  //       }
  
  //       // create edge from previous column node
  //       if (parentNodeId && parentNodeId !== nodeId) {
  //         const edgeId = `e${parentNodeId}-${nodeId}`;
  //         if (!edgeSet.has(edgeId)) {
  //           parsedEdges.push({
  //             id: edgeId,
  //             source: parentNodeId,
  //             target: nodeId,
  //             currentnodeid: id,
  //             type: "customEdge",
  //             data: {
  //               color: getStoredColor(edgeId),
  //               direction: "right",
  //             },
  //             animated: true,
  //             style: {
  //               strokeWidth: 2,
  //               stroke: getStoredColor(edgeId),
  //             },
  //             markerEnd: {
  //               type: "arrowclosed",
  //             },
  //             exfileedge: true,
  //           });
  //           edgeSet.add(edgeId);
  //         }
  //       }
  
  //       parentNodeId = nodeId;
  //     });
  //   });
  
  //   return { parsedNodes, parsedEdges, topLevelNodeIds };
  // };
  
  

  // const parseHierarchicalData = (data, id, setNodes, setEdges, existingNodes = [], existingEdges = []) => {
  //   const parsedNodes = [];
  //   const parsedEdges = [];
  //   const nodeMap = new Map(existingNodes.map((n) => [n.id, n])); // prevent duplicates
  //   const edgeSet = new Set(existingEdges.map((e) => e.id));
  //   const columnNames = Object.keys(data[0]);
  
  //   data.forEach((row, rowIndex) => {
  //     let parentNodeId = null;
  
  //     columnNames.forEach((col, colIndex) => {
  //       const nodeValue = row[col];
  //       if (!nodeValue) return;
  
  //       const nodeId = String(nodeValue).trim();
  
  //       // Create node if not exists
  //       if (!nodeMap.has(nodeId)) {
  //         const newNode = {
  //           id: nodeId,
  //           data: { label: nodeId },
  //           position: { x: colIndex * 200, y: rowIndex * 100 },
  //           exfilenode: true,
  //           currentnodeid: id,
  //           type: "editableNode",
  //         };
  //         parsedNodes.push(newNode);
  //         nodeMap.set(nodeId, newNode);
  //       }
  
  //       // Create edge to parent
  //       if (parentNodeId && parentNodeId !== nodeId) {
  //         const edgeId = `e${parentNodeId}-${nodeId}`;
  //         if (!edgeSet.has(edgeId)) {
  //           parsedEdges.push({
  //             id: edgeId,
  //             source: parentNodeId,
  //             target: nodeId,
  //             currentnodeid: id,
  //             type: "customEdge",
  //             data: {
  //               color: getStoredColor(edgeId),
  //               direction: "right", // you can adjust based on your design
  //             },
  //             animated: true,
  //             style: {
  //               strokeWidth: 2,
  //               stroke: getStoredColor(edgeId),
  //             },
  //             markerEnd: {
  //               type: "arrowclosed",
  //             },
  //             exfileedge: true,
  //           });
  //           edgeSet.add(edgeId);
  //         }
  //       }
  
  //       parentNodeId = nodeId;
  //     });
  //   });
  
  //   return { parsedNodes, parsedEdges };
  // };
  

  // const parseHierarchicalData = (data, id, setNodes, setEdges, nodes) => {
  //   const parsedNodes = [];
  //   const parsedEdges = [];
  //   const nodeMap = new Map();
  //   const columnNames = Object.keys(data[0]);
  
  //   data.forEach((row, rowIndex) => {
  //     let parentNodeId = null;
  
  //     columnNames.forEach((col, colIndex) => {
  //       const nodeValue = row[col];
  //       if (!nodeValue) return;
  
  //       const nodeId = String(nodeValue).trim();
  
  //       if (!nodeMap.has(nodeId)) {
  //         const newNode = {
  //           id: nodeId,
  //           data: { label: nodeId, },
  //           position: { x: colIndex * 200, y: rowIndex * 80 },
  //           exfilenode: true,
  //           currentnodeid: id,

  //         };
  //         parsedNodes.push(newNode);
  //         nodeMap.set(nodeId, newNode);
  //       }
  
  //       if (parentNodeId && parentNodeId !== nodeId) {
  //         const edgeId = `e${parentNodeId}-${nodeId}`;
  //         if (!parsedEdges.some((edge) => edge.id === edgeId)) {
  //           parsedEdges.push({
  //             id: edgeId,
  //             source: parentNodeId,
  //             target: nodeId,
  //             currentnodeid: id,
  //             animated: true,
  //             exfileedge: true,

  //           });
  //         }
  //       }
  
  //       parentNodeId = nodeId;
  //     });
  //   });
  
  //   return { parsedNodes, parsedEdges };
  // };
  




// const parseHierarchicalData = (data) => {
//   const parsedNodes = [];
//   const parsedEdges = [];
//   const nodeMap = new Map();
//   const columnNames = Object.keys(data[0]);

//   data.forEach((row, rowIndex) => {
//     let parentNodeId = null; // Track last parent

//     columnNames.forEach((col, colIndex) => {
//       const nodeId = row[col]?.trim();
//       if (!nodeId) return; // Skip empty cells

//       // Create node if not exists
//       if (!nodeMap.has(nodeId)) {
//         const newNode = {
//           id: nodeId,
//           data: { label: nodeId },
//           position: { x: colIndex * 200, y: rowIndex * 80 },
//         };
//         parsedNodes.push(newNode);
//         nodeMap.set(nodeId, newNode);
//       }

//       // Ensure last known parent-child relationship is maintained
//       if (parentNodeId && parentNodeId !== nodeId) {
//         const edgeId = `e${parentNodeId}-${nodeId}`;
//         if (!parsedEdges.some((edge) => edge.id === edgeId)) {
//           parsedEdges.push({
//             id: edgeId,
//             source: parentNodeId,
//             target: nodeId,
//             animated: true,
//           });
//         }
//       }

//       parentNodeId = nodeId;
//     });
//   });

//   return { parsedNodes, parsedEdges };
// };


// const parseExcelData = (data, id) => {
//   const parsedNodes = [];
//   const parsedEdges = [];

//   data?.forEach((row, index) => {
//     parsedNodes.push({
//       id: String(row.id || index + 1),
//       data: { label: row.label || `Node ${index + 1}` },
//       position: { x: row.x || 100 * (index + 1), y: row.y || 100 },
//     });

//     if (row.source && row.target) {
//       parsedEdges.push({
//         id: `e${row.source}-${row.target}`,
//         source: String(row.source),
//         target: String(row.target),
//         animated: row.animated === 'true',
//       });
//     }
//   });

//   return { parsedNodes, parsedEdges };
// };




// const parseExcelData = (data, id, setNodes, setEdges, nodes) => {
//   const parsedNodes = [];
//   const parsedEdges = [];
  
//   const baseNode = nodes?.find((node) => node.id === id) || { id: "1", position: { x: 200, y: 100 } };
  
//   data?.forEach((row, index) => {
//     const newNodeId = row.id ? String(row.id) : `node-${nodes.length + index + 1}`;
//     const newX = baseNode.position.x + 150 * (index + 1);
//     const newY = baseNode.position.y + 100;
    
    // const newNode = {
    //   id: newNodeId,
    //   position: { x: newX, y: newY },
    //   data: { label: row.label || `Node ${nodes.length + index + 1}` },
    //   type: "editableNode",
    // };

    // parsedNodes.push(newNode);

    // if (index === 0) {
    //   parsedEdges.push({
    //     id: `e${baseNode.id}-${newNodeId}`,
    //     source: baseNode.id,
    //     target: newNodeId,
    //     animated: row.animated === "true" || true,
    //     type: "customEdge",
    //     data: { color: "#67d7c4" },
    //   });
    // } else {
    //   const prevNode = parsedNodes[index - 1];
    //   parsedEdges.push({
    //     id: `e${prevNode.id}-${newNodeId}`,
    //     source: prevNode.id,
    //     target: newNodeId,
    //     animated: row.animated === "true" || true,
    //     type: "customEdge",
    //     data: { color: "#67d7c4" },
    //   });
//     }
//   });

//   return { parsedNodes, parsedEdges };
// };






// const toBase64 = (file) =>
//   new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = () => resolve(reader.result);
//     reader.onerror = (error) => reject(error);
//   });

// const handleFileUpload = async (fileOrData, type, nodes, edges, setNodes, setEdges) => {
//     console.log(edges, 'edges', nodes)
//   if (!fileOrData) return;

//   if (type === "excel") {
//     handleExcelFileUpload(fileOrData, setNodes, setEdges);
//   } else if (fileOrData.type?.includes("image")) {
//     const base64Image = await toBase64(fileOrData);
//     const newNodeId = `img-${nodes.length + 1}`;
//     const lastNode = nodes[nodes.length - 1];
//     const newX = lastNode ? lastNode.position.x + 150 : 200;
//     const newY = lastNode ? lastNode.position.y : 100;

//     const newNode = {
//       id: newNodeId,
//       position: { x: newX, y: newY },
//       data: {
//         label: "Uploaded Image",
//         image: base64Image,
//         isImageNode: true,
//       },
//       type: "editableNode",
//     };

//     setNodes((prevNodes) => [...prevNodes, newNode]);

//     if (lastNode) {
//       const newEdge = {
//         id: `e${lastNode.id}-${newNodeId}`,
//         source: lastNode.id,
//         target: newNodeId,
//         animated: true,
//         type: "customEdge",
//         data: { color: "#67d7c4" },
//       };
//       setEdges((prevEdges) => [...prevEdges, newEdge]);
//     }
//   } else {
//     console.warn("Unsupported file type");
//   }
// };

// const handleExcelFileUpload = (data, setNodes, setEdges) => {
//   const { parsedNodes, parsedEdges } = parseExcelData(data);
//   setNodes((prevNodes) => [...prevNodes, parsedNodes]);
//   setEdges((prevEdges) => [...prevEdges, parsedEdges]);
// };

// const parseExcelData = (data) => {
//   const parsedNodes = [];
//   const parsedEdges = [];

//   data?.forEach((row, index) => {
//     parsedNodes.push({
//       id: String(row.id || index + 1),
//       data: { label: row.label || `Node ${index + 1}` },
//       position: { x: row.x || 100 * (index + 1), y: row.y || 100 },
//     });

//     if (row.source && row.target) {
      // parsedEdges.push({
      //   id: `e${row.source}-${row.target}`,
      //   source: String(row.source),
      //   target: String(row.target),
      //   animated: row.animated === 'true',
      // });
//     }
//   });

//   return { parsedNodes, parsedEdges };
// };

// export { handleFileUpload };