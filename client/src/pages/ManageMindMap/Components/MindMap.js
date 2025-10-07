import React, { useCallback, useState, useEffect, useRef } from "react";
import { ReactFlow, Controls, applyNodeChanges, useReactFlow  } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import "./MindMap.css";

import EditableNode from "./EditableNode";
import AddNodeHandler from "./AddNodeHandler";
import DeleteNodeHandler from "./DeleteNodeHandler";
import ProcessEdges from "./ProcessEdges";
import CustomEdge from "./CustomeEdges";
import UndoRedoControls from "./KeyboardActivity/UndoRedoControls";
import { handleFileUpload } from "./Uploads/OnFileUpload";
import UpdatedNodes from "./MindMapSlice/Reusable/UpdateNode";

const LOCALSTORAGE_KEY = "FlowChartData";
const LOCALSTORAGE_EDGES_KEY = "FlowChartEdges";

const initialNodes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: {
      label: "Main",
      textStyles: { isBold: false, isItalic: false, link: "" }
    },
    type: "editableNode"
  }
];


const initialEdges = JSON.parse(localStorage.getItem(LOCALSTORAGE_EDGES_KEY)) || [];

const FlowChart = () => {
  const { setViewport } = useReactFlow();
  useEffect(() => {
    setViewport({ x: 400, y: 3000, zoom: 1 });
  }, []);

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const history = useRef([{ nodes, edges }]);
  const redoStack = useRef([]);

  useEffect(() => {
    localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
    localStorage.setItem(LOCALSTORAGE_EDGES_KEY, JSON.stringify(edges));
  }, [nodes, edges]);

  const saveState = useCallback(() => {
    const lastState = history.current[history.current.length - 1];
    if (JSON.stringify(lastState) !== JSON.stringify({ nodes, edges })) {
      history.current.push({ nodes, edges });
      redoStack.current = [];
    }
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (history.current.length > 1) {
      redoStack.current.push(history.current.pop());
      setNodes([...history.current[history.current.length - 1].nodes]);
      setEdges([...history.current[history.current.length - 1].edges]);
    }
  }, []);

  const redo = useCallback(() => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      history.current.push(nextState);
      setNodes([...nextState.nodes]);
      setEdges([...nextState.edges]);
    }
  }, []);

  const onNodesChange = useCallback((changes) => {
    saveState();
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, [saveState]);

  const onLabelChange = useCallback((nodeId, newLabel) => {
    saveState();
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
      )
    );
  }, [saveState]);

  const deleteNode = DeleteNodeHandler({ setNodes, setEdges });
  const addNode = AddNodeHandler({ nodes, setNodes, setEdges, deleteNode, onLabelChange });
  const nodeTypes = { editableNode: EditableNode };

  const processedEdges = ProcessEdges(edges);
  const edgeTypes = { customEdge: CustomEdge };
  const updatedNodes = UpdatedNodes({ nodes, edges, deleteNode, addNode, setNodes, setEdges, onLabelChange, handleFileUpload });

  return (
    <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={updatedNodes}
        edgeTypes={edgeTypes}
        edges={processedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        fitView
        minZoom={0.2}
        maxZoom={2}
        zoomOnScroll
        zoomOnPinch
        zoomOnDoubleClick
      >
       <Controls />
      </ReactFlow>
      <UndoRedoControls 
        undo={undo} 
        redo={redo} 
        canUndo={history.current.length > 1} 
        canRedo={redoStack.current.length > 0} 
      />
    </div>
  );
};

export default FlowChart;











































// procces
// const parseExcel = (file) => {
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: "array" });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = XLSX.utils.sheet_to_json(sheet);

//     const { parsedNodes, parsedEdges } = parseExcelData(jsonData);
//     setNodes(parsedNodes);
//     setEdges(parsedEdges);
//   };

//   reader.readAsArrayBuffer(file);
// };



// import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
// import { ReactFlow, Controls, applyNodeChanges } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import "./MindMap.css";
// import * as XLSX from "xlsx";

// import EditableNode from "./EditableNode";
// import AddNodeHandler from "./AddNodeHandler";
// import DeleteNodeHandler from "./DeleteNodeHandler";
// import ProcessEdges from "./ProcessEdges";
// import CustomEdge from "./CustomeEdges";
// import UndoRedoControls from "./KeyboardActivity/UndoRedoControls";
// import ExcelFileUploader from "./FileUploader";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" }
// ];

// const initialEdges = [];

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(() => {
//     const storedEdges = localStorage.getItem(`${LOCALSTORAGE_KEY}_edges`);
//     return storedEdges ? JSON.parse(storedEdges) : initialEdges;
//   });

//   const history = useRef([{ nodes, edges }]);
//   const redoStack = useRef([]);

//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//     localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(edges));
//   }, [nodes, edges]);


//   const saveState = useCallback(() => {
//     const lastState = history.current[history.current.length - 1];
//     if (JSON.stringify(lastState) !== JSON.stringify({ nodes, edges })) {
//       history.current.push({ nodes, edges });
//       redoStack.current = [];
//     }
//   }, [nodes, edges]);

//   const undo = useCallback(() => {
//     if (history.current.length > 1) {
//       redoStack.current.push(history.current.pop());
//       setNodes(() => [...history.current[history.current.length - 1].nodes]);
//       setEdges(() => [...history.current[history.current.length - 1].edges]);
//     }
//   }, []);
  
//   const redo = useCallback(() => {
//     if (redoStack.current.length > 0) {
//       const nextState = redoStack.current.pop();
//       history.current.push(nextState);
//       setNodes(() => [...nextState.nodes]);
//       setEdges(() => [...nextState.edges]);
//     }
//   }, []);

//   const onNodesChange = useCallback((changes) => {
//     saveState();
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, [saveState]);

//   const onLabelChange = useCallback((nodeId, newLabel) => {
//     saveState();
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   }, [saveState]);

//   const deleteNode = DeleteNodeHandler({ setNodes, setEdges });

//   const addNode = AddNodeHandler({ nodes, setNodes, setEdges, deleteNode, onLabelChange });

//   const nodeTypes = { editableNode: EditableNode };

//   const processedEdges = ProcessEdges(edges);

//   const edgeTypes = {
//     customEdge: CustomEdge,
//   };



//   const handleFileUpload = (file) => {
//     if (!file) return;
//     const fileType = file.type;
//     if (fileType.includes("image")) {
//       const imageUrl = URL.createObjectURL(file);
//       const newNodeId = `img-${nodes.length + 1}`;
//       const lastNode = nodes[nodes.length - 1];
//       const newX = lastNode ? lastNode.position.x + 150 : 200;
//       const newY = lastNode ? lastNode.position.y : 100;
  
//       const newNode = {
//         id: newNodeId,
//         position: { x: newX, y: newY },
//         data: {
//           label: "Uploaded Image",
//           image: imageUrl, 
//           isImageNode: true, 
//         },
//         type: "editableNode",
//       };
  
//       if (lastNode) {
//         const newEdge = {
//           id: `e${lastNode.id}-${newNodeId}`,
//           source: lastNode.id,
//           target: newNodeId,
//           animated: true,
//           type: "customEdge",
//           data: { color: "#67d7c4" }, 
//         };
//         setEdges((prevEdges) => [...prevEdges, newEdge]);
//       }
  
//       setNodes((prevNodes) => [...prevNodes, newNode]);
//     } else if (fileType.includes("sheet") || fileType.includes("excel")) {
//       parseExcel(file); 
//     } else {
//       console.warn("Unsupported file type");
//     }
//   };

  // const parseExcel = (file) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: "array" });
  //     const sheetName = workbook.SheetNames[0];
  //     const sheet = workbook.Sheets[sheetName];
  //     const jsonData = XLSX.utils.sheet_to_json(sheet);
  
  //     const { parsedNodes, parsedEdges } = parseExcelData(jsonData);
  //     setNodes(parsedNodes);
  //     setEdges(parsedEdges);
  //   };
  
  //   reader.readAsArrayBuffer(file);
  // };
  
  // const parseExcelData = (data) => {
  //   if (!Array.isArray(data)) {
  //     console.error("Invalid Excel Data", data);
  //     return { parsedNodes: [], parsedEdges: [] };
  //   }
  //   const parsedNodes = [];
  //   const parsedEdges = [];
  //   data.forEach((row, index) => {
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
  //         animated: row.animated === "true",
  //       });
  //     }
  //   });
  
  //   return { parsedNodes, parsedEdges };
  // };


// const updatedNodes = useMemo(() =>
//   nodes.map((node) => ({
//     ...node,
//     draggable: node.id !== "1",
//     data: {
//       ...node.data,
//       onDelete: deleteNode,
//       onAdd: addNode,
//       onLabelChange: onLabelChange,
//       pastedNodes: nodes.filter((fill) => fill.createdByPaste === true),
//       handleFileUpload: handleFileUpload,
//     },
//   })), [nodes, deleteNode, addNode, onLabelChange, handleFileUpload]
// );

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
//       <ExcelFileUploader onFileUpload={handleFileUpload} />
//       <ReactFlow
//       nodes={updatedNodes}
//         edgeTypes={edgeTypes}
//         edges={processedEdges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         fitView
//         minZoom={0.2}
//         maxZoom={2}
//         zoomOnScroll
//         zoomOnPinch
//         zoomOnDoubleClick
//       >
//         <Controls />
//       </ReactFlow>
//       <UndoRedoControls 
//         undo={undo} 
//         redo={redo} 
//         canUndo={history.current.length > 1} 
//         canRedo={redoStack.current.length > 0} 
//       />
//     </div>
//   );
// };

// export default FlowChart;











  


  // const handleFileUpload = (file) => {
  //   if (!file) return;
  
  //   const fileType = file.type;
  
  //   if (fileType.includes("image")) {
  //     // If the uploaded file is an image, set it in the node
  //     const imageUrl = URL.createObjectURL(file);
  //     setNodes((prevNodes) =>
  //       prevNodes.map((node, index) =>
  //         index === prevNodes.length - 1
  //           ? { ...node, data: { ...node.data, image: imageUrl } }
  //           : node
  //       )
  //     );
  //   } else if (fileType.includes("sheet") || fileType.includes("excel")) {
  //     // If it's an Excel file, parse the data
  //     parseExcel(file);
  //   } else {
  //     console.warn("Unsupported file type");
  //   }
  // };
  
  // Function to parse Excel file







  
  // const handleFileUpload = (data) => {
  //   const { parsedNodes, parsedEdges } = parseExcelData(data);
  //   setNodes(parsedNodes);
  //   setEdges(parsedEdges);
  // }

  // console.log('edges, nodes :>> ', edges, nodes);

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



  // const handleFileUpload = (data) => {
  //   let newNodes = [];
  //   let newEdges = [];

  //   data.forEach((row, rowIndex) => {
  //     if (rowIndex === 0) return; 

  //     let prevNodeId = "1";
  //     row.forEach((cell, colIndex) => {
  //       if (cell) {
  //         const nodeId = `${rowIndex}-${colIndex}`;
  //         newNodes.push({
  //           id: nodeId,
  //           position: { x: colIndex * 150, y: rowIndex * 100 },
  //           data: { label: cell },
  //           type: "editableNode"
  //         });

  //         if (prevNodeId !== "1") {
  //           newEdges.push({ id: `e${prevNodeId}-${nodeId}`, source: prevNodeId, target: nodeId });
  //         }
  //         prevNodeId = nodeId;
  //       }
  //     });
  //   });

  //   setNodes((nds) => [...nds, ...newNodes]);
  //   setEdges((eds) => [...eds, ...newEdges]);
  // };






// import React, { useCallback, useState, useEffect, useRef } from "react";
// import { ReactFlow, Controls, applyNodeChanges } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import "./MindMap.css";

// import EditableNode from "./EditableNode";
// import AddNodeHandler from "./AddNodeHandler";
// import DeleteNodeHandler from "./DeleteNodeHandler";
// import ProcessEdges from "./ProcessEdges";
// import CustomEdge from "./CustomeEdges";
// import UndoRedoControls from "./KeyboardActivity/UndoRedoControls";
// import FileUploader from "./FileUploader";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" }
// ];

// const initialEdges = [];

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(() => {
//     const storedEdges = localStorage.getItem(`${LOCALSTORAGE_KEY}_edges`);
//     return storedEdges ? JSON.parse(storedEdges) : initialEdges;
//   });

//   const history = useRef([{ nodes, edges }]);
//   const redoStack = useRef([]);

//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//     localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(edges));
//   }, [nodes, edges]);

//   const saveState = useCallback(() => {
//     history.current.push({ nodes, edges });
//     redoStack.current = [];
//   }, [nodes, edges]);

//   const undo = useCallback(() => {
//     if (history.current.length > 1) {
//       redoStack.current.push(history.current.pop());
//       const prevState = history.current[history.current.length - 1];
//       setNodes(prevState.nodes);
//       setEdges(prevState.edges);
//     }
//   }, []);

//   const redo = useCallback(() => {
//     if (redoStack.current.length > 0) {
//       const nextState = redoStack.current.pop();
//       history.current.push(nextState);
//       setNodes(nextState.nodes);
//       setEdges(nextState.edges);
//     }
//   }, []);

//   const onNodesChange = useCallback((changes) => {
//     saveState();
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, [saveState]);

//   const onLabelChange = useCallback((nodeId, newLabel) => {
//     saveState();
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   }, [saveState]);

//   const deleteNode = DeleteNodeHandler({ setNodes, setEdges });

//   const addNode = AddNodeHandler({ nodes, setNodes, setEdges, deleteNode, onLabelChange });

//   const nodeTypes = { editableNode: EditableNode };

//   const processedEdges = ProcessEdges(edges);

//   const edgeTypes = {
//     customEdge: CustomEdge,
//   };

//   const handleFileUpload = (data) => {
//     let newNodes = [];
//     let newEdges = [];

//     data.forEach((row, rowIndex) => {
//       if (rowIndex === 0) return; // Skip headers

//       let prevNodeId = "1"; // Start from Root Node
//       row.forEach((cell, colIndex) => {
//         if (cell) {
//           const nodeId = `${rowIndex}-${colIndex}`;
//           newNodes.push({ id: nodeId, position: { x: colIndex * 150, y: rowIndex * 100 }, data: { label: cell } });

//           if (prevNodeId !== "1") {
//             newEdges.push({ id: `e${prevNodeId}-${nodeId}`, source: prevNodeId, target: nodeId });
//           }
//           prevNodeId = nodeId;
//         }
//       });
//     });

//     setNodes((nds) => [...nds, ...newNodes]);
//     setEdges((eds) => [...eds, ...newEdges]);
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>

// <FileUploader onFileUpload={handleFileUpload} />

//       <ReactFlow
//         nodes={nodes.map((node) => ({
//           ...node,
//           data: {
//             ...node.data,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//             pastedNodes: nodes.filter((fill) => fill.createdByPaste === true),
//           },
//         }))}
//         edgeTypes={edgeTypes}
//         edges={processedEdges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         fitView
//         minZoom={0.2}
//         maxZoom={2}
//         zoomOnScroll
//         zoomOnPinch
//         zoomOnDoubleClick
//       >
//         <Controls />
//       </ReactFlow>
//       <UndoRedoControls 
//         undo={undo} 
//         redo={redo} 
//         canUndo={history.current.length > 1} 
//         canRedo={redoStack.current.length > 0} 
//       />
//     </div>
//   );
// };

// export default FlowChart;













// import React, { useCallback, useState, useEffect, useRef   } from "react";
// import { ReactFlow, Controls, applyNodeChanges } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";
// import "./MindMap.css"

// import EditableNode from "./EditableNode";
// import AddNodeHandler from "./AddNodeHandler";
// import DeleteNodeHandler from "./DeleteNodeHandler";
// import ProcessEdges from './ProcessEdges';
// import CustomEdge from "./CustomeEdges";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" }
// ];
// const initialEdges = [];

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(() => {
//     const storedEdges = localStorage.getItem(`${LOCALSTORAGE_KEY}_edges`);
//     return storedEdges ? JSON.parse(storedEdges) : initialEdges;
//   });

  

//   const history = useRef([{ nodes, edges }]);
//   const redoStack = useRef([]);
  
//   const saveState = useCallback(() => {
//     history.current.push({ nodes, edges });
//     redoStack.current = []; // Clear redo stack on new changes
//   }, [nodes, edges]);



//   const undo = useCallback(() => {
//     if (history.current.length > 1) {
//       redoStack.current.push(history.current.pop());
//       const prevState = history.current[history.current.length - 1];
//       setNodes(prevState.nodes);
//       setEdges(prevState.edges);
//     }
//   }, []);

//   const redo = useCallback(() => {
//     if (redoStack.current.length > 0) {
//       const nextState = redoStack.current.pop();
//       history.current.push(nextState);
//       setNodes(nextState.nodes);
//       setEdges(nextState.edges);
//     }
//   }, []);

//   // Handle Node Change (Ensure changes are saved)
//   const onNodesChange = useCallback((changes) => {
//     saveState();
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, [saveState]);

//   const onLabelChange = useCallback((nodeId, newLabel) => {
//     saveState();
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   }, [saveState]);



//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.ctrlKey && event.key === "z") {
//         event.preventDefault();
//         undo();
//       }
//       if (event.ctrlKey && event.key === "y") {
//         event.preventDefault();
//         redo();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [undo, redo]);




//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//     localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(edges));
//   }, [nodes, edges]);

//   // const onNodesChange = useCallback((changes) => {
//   //   setNodes((nds) => applyNodeChanges(changes, nds));
//   // }, []);

//   // const onLabelChange = useCallback((nodeId, newLabel) => {
//   //   setNodes((prevNodes) =>
//   //     prevNodes.map((node) =>
//   //       node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//   //     )
//   //   );
//   // }, []);

//   const deleteNode = DeleteNodeHandler({ setNodes, setEdges });

//   const addNode = AddNodeHandler({ nodes, setNodes, setEdges, deleteNode, onLabelChange });

//   const nodeTypes = { editableNode: EditableNode };
  
//   const processedEdges = ProcessEdges(edges);
  
//   const edgeTypes = {
//     customEdge: CustomEdge
//     ,
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
     
//       <ReactFlow
//         nodes={nodes.map((node) => ({
//           ...node,
//           data: {
//             ...node.data,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//             pastedNodes: nodes.filter(fill => fill.createdByPaste === true),
//           },
//         }))}
//         edgeTypes={edgeTypes}
        
//         edges={processedEdges}

//         nodeTypes= {nodeTypes}
//         onNodesChange={onNodesChange}
//         fitView
//         minZoom={0.2}
//         maxZoom={2}
//         zoomOnScroll={true}
//         zoomOnPinch={true}
//         zoomOnDoubleClick={true}
//       >


//         <Controls />
//       </ReactFlow>


//       <div className="undo-redo-buttons">
//         <button onClick={undo} disabled={history.current.length <= 1}>Undo (Ctrl + Z)</button>
//         <button onClick={redo} disabled={redoStack.current.length === 0}>Redo (Ctrl + Y)</button>
//       </div>
//     </div>
//   );
// };

// export default FlowChart;









// import React, { useCallback, useState, useEffect } from "react";
// import { applyEdgeChanges, applyNodeChanges, addEdge } from "@xyflow/react";
// import { ReactFlow, Controls, Background } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// import EditableNode from "./EditableNode";
// import AddNodeHandler from "./AddNodeHandler";
// import DeleteNodeHandler from "./DeleteNodeHandler";
// import ProcessEdges from './ProcessEdges'
// import CustomEdge from "./CustomeEdges"; 
// import SvgComponent from "./SvgComponent";



// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" }
// ];
// const initialEdges = [];

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(() => {
//     const storedEdges = localStorage.getItem(`${LOCALSTORAGE_KEY}_edges`);
//     return storedEdges ? JSON.parse(storedEdges) : initialEdges;
//   });

//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//     localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(edges));
//   }, [nodes, edges]);

//   const onNodesChange = useCallback((changes) => {
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, []);

//   const onEdgesChange = useCallback((changes) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds));
//   }, []);

//   const onConnect = useCallback((connection) => {
//     setEdges((eds) => [...eds, addEdge(connection, eds)]);
//   }, []);

//   const onLabelChange = useCallback((nodeId, newLabel) => {
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   }, []);

//   const deleteNode = DeleteNodeHandler({ setNodes, setEdges });

//   const addNode = AddNodeHandler({ nodes, setNodes, setEdges, deleteNode, onLabelChange });

//   const nodeTypes = { editableNode: EditableNode,  };

//  const processedEdges = ProcessEdges(edges); 
//  const edgeTypes = {
//   customEdge: CustomEdge,
// };


//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
//       <ReactFlow
//         nodes={nodes.map((node) => ({
//           ...node, data: {
//             ...node.data,
//             onDelete: deleteNode,
//             onAdd: addNode,
//             onLabelChange: onLabelChange,
//           }
//         }))}
//         // edgeTypes={edgeTypes}
//         // edges={processedEdges}
//         edges={<SvgComponent/>}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//         minZoom={0.2}
//         maxZoom={2}
//         zoomOnScroll={true}
//         zoomOnPinch={true}
//         zoomOnDoubleClick={true}
//       >
//         <Controls />
//         <Background gap={16} size={1} />
//       </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;












// import React, { useCallback, useState, useEffect } from "react";
// import { applyEdgeChanges, applyNodeChanges, addEdge, Controls, Background, ReactFlow, Handle, useReactFlow } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [{ id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" }];
// const initialEdges = [];

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
//     style={{ padding: "5px", border: "1px solid black", borderRadius: "5px", background: "white", textAlign: "center", width: "100px", position: "relative" }}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <input type="text" value={label} onPaste={handleChange} onChange={handleChange} 
//       style={{ border: "none", textAlign: "center", width: "100%", outline: "none" }} 
//       />



    
//       {isHovered && id !== "1" && (
//         <button onClick={() => onDelete(id)} style={{ position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold", zIndex: 10 }}>
//           ×
//         </button>
//       )}

//     {isHovered && (
//         <>
//           <button onClick={() => onAdd(id, "top")} 
//             style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", 
//               background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//               fontSize: "12px", cursor: "pointer", zIndex: 10 }}>+
//           </button>

//           <button onClick={() => onAdd(id, "right")} 
//             style={{ position: "absolute", top: "50%", right: "-12px", transform: "translateY(-50%)", 
//               background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//               fontSize: "12px", cursor: "pointer", zIndex: 10 }}>+
//           </button>

//           <button onClick={() => onAdd(id, "bottom")} 
//             style={{ position: "absolute", bottom: "-12px", left: "50%", transform: "translateX(-50%)", 
//               background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//               fontSize: "12px", cursor: "pointer", zIndex: 10 }}>+
//           </button>

//           <button onClick={() => onAdd(id, "left")} 
//             style={{ position: "absolute", top: "50%", left: "-12px", transform: "translateY(-50%)", 
//               background: "#28a745", color: "white", border: "none", borderRadius: "50px", 
//               fontSize: "12px", cursor: "pointer", zIndex: 10 }}>+
//           </button>
//         </>
//       )}

      
//       <Handle type="source" position="top" id="top" />
//       <Handle type="source" position="right" id="right" />
//       <Handle type="source" position="bottom" id="bottom" />
//       <Handle type="source" position="left" id="left" />

//       <Handle type="target" position="top" id="top" />
//       <Handle type="target" position="right" id="right" />
//       <Handle type="target" position="bottom" id="bottom" />
//       <Handle type="target" position="left" id="left" />
//     </div>
//   );
// };

// const nodeTypes = {
//   editableNode: (props) => <EditableNode {...props} onDelete={props.onDelete} onAdd={props.onAdd} />,
// };

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(() => {
//     const storedEdges = localStorage.getItem(LOCALSTORAGE_KEY + "_edges");
//     return storedEdges ? JSON.parse(storedEdges) : initialEdges;
//   });

//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//     localStorage.setItem(LOCALSTORAGE_KEY + "_edges", JSON.stringify(edges));
//   }, [nodes, edges]);


//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//   }, [nodes]);

//   const onNodesChange = useCallback((changes) => {
//     setNodes((nds) => applyNodeChanges(changes, nds));
//   }, []);

//   const onEdgesChange = useCallback((changes) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds));
//   }, []);

//   const onConnect = useCallback((connection) => {
//     const colors = ["red", "blue", "green", "purple", "orange", "cyan"];

//     const sourceId = connection.source;
//     const edgeColor = colors[parseInt(sourceId, 10) % colors.length];

//     const newEdge = {
//       ...connection,
//       animated: true,
//       type: "bezier", 
//       style: { stroke: edgeColor, strokeWidth: 3 },
//     };

//     setEdges((eds) => [...eds, newEdge]);
// }, []);

  // const processedEdges = edges.map((edge) => {
  //   const colors = ["#9ed56b", "#ff5733", "#4287f5", "#f542d4", "#42f584"];
  //   const styles = ["solid", "dotted", "dashed"];
    
  //   const edgeColor = colors[parseInt(edge.source, 10) % colors.length];
  //   const edgeStyle = styles[parseInt(edge.target, 10) % styles.length];
  
  //   return {
  //     ...edge,
  //     type: "gradientBezier",
  //     animated: true,
  //     style: {
  //       stroke: edgeColor,
  //       strokeWidth: 3,
  //       strokeDasharray: "15 15",
  //     },
  //   };
  // });

  
//   const onLabelChange = (nodeId, newLabel) => {
//     setNodes((prevNodes) =>
//       prevNodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   };

//   const addNode = (parentId, direction, lines = ["New Node"]) => {
//     console.log("addNode called with:", { parentId, direction, lines });

//     const parentNode = nodes.find(node => node.id === parentId);
//     if (!parentNode) {
//         console.warn("Parent node not found!");
//         return;
//     }

//     const offset = 250;
//     let newX = parentNode.position.x;
//     let newY = parentNode.position.y;

//     const sourceHandle = direction;
//     const targetHandle = oppositeHandle(direction);

//     const nodeLines = Array.isArray(lines) && lines.length > 0 ? lines : ["New Node"];

//     const newNodes = [];
//     const newEdges = [];

//     nodeLines.forEach((line, index) => {
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
//                 label: line, // Use either provided name or "New Node"
//                 onDelete: deleteNode,
//                 onAdd: addNode,
//                 onLabelChange: onLabelChange,
//             },
//             type: "editableNode",
//         };


//         const newEdge = {
//           id: `e${parentId}-${newNodeId}`,
//           source: parentId,
//           sourceHandle,
//           target: newNodeId,
//           targetHandle,
//           animated: true,
//           style: { stroke: "#9370DB", strokeWidth: 4 }
//       };

//         newNodes.push(newNode);
//         newEdges.push(newEdge);
//     });

//     console.log("New nodes:", newNodes);
//     console.log("New edges:", newEdges);

//     setNodes(prevNodes => [...prevNodes, ...newNodes]);
//     setEdges(prevEdges => [...prevEdges, ...newEdges]);
// };

  
//   const oppositeHandle = (handle) => {
//     const opposites = { top: "bottom", bottom: "top", left: "right", right: "left" };
//     return opposites[handle] || "top"; 
//   };
  
//   const deleteNode = (nodeId) => {
//     setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
//     setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes.filter((node) => node.id !== nodeId)));
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
      
      // <ReactFlow
      //   nodes={nodes.map((node) => ({
      //     ...node, data: {
      //       ...node.data,
      //       onDelete: deleteNode,
      //       onAdd: addNode,
      //       onLabelChange: onLabelChange,
      //     }
      //   }))}
        // edges={processedEdges}
      //   nodeTypes={nodeTypes}
      //   onNodesChange={onNodesChange}
      //   onEdgesChange={onEdgesChange}
      //   onConnect={onConnect}
      //   fitView
      //   minZoom={0.2}
      //   maxZoom={2}
      //   zoomOnScroll={true}
      //   zoomOnPinch={true}
      //   zoomOnDoubleClick={true}
      // >
      //   <Controls />
      //   <Background gap={16} size={1} />
      // </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;