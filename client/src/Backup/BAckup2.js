// import React, { useCallback, useState, useEffect } from "react";
// import { applyEdgeChanges,applyNodeChanges,addEdge,Controls,Background,ReactFlow,Handle} from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "node1" }, type: "editableNode" },
// ];

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];


// const EditableNode = ({ data, id }) => {
//   console.log('data, id :>> ', data, id);
//   const [label, setLabel] = useState(data.label);
//   const [isHovered, setIsHovered] = useState(false);

//   const { onDelete } = data;

//   const handleChange = (event) => {
//     setLabel(event.target.value);
//     data.label = event.target.value;
//     updateNodeInLocalStorage(id, event.target.value);
//   };

//   return (
//     <div style={{
//       padding: "10px", border: "1px solid black", borderRadius: "5px", background: "white",
//       textAlign: "center", minWidth: "120px", position: "relative",
//     }}>
//       <input type="text" value={label} onChange={handleChange} onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => setIsHovered(false)}
//         style={{
//           border: "none", textAlign: "center", width: "100%", outline: "none",
//         }} />
//       {/* Delete button */}
//       {isHovered && id !== "1" && (
//         <button
//           onClick={() => onDelete(id)}
//           style={{
//             position: "absolute", top: "-10px", right: "-10px", background: "red", color: "white", border: "none", borderRadius: "50%", width: "20px",
//             height: "20px", cursor: "pointer",
//           }}>
//           ×
//         </button>        
//       )}


//       <Handle type="source" position="right" />
//       <Handle type="target" position="left" />
//     </div>
//   );
// };

// // Helper function to update node label in localStorage
// const updateNodeInLocalStorage = (id, newLabel) => {
//   const storedNodes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
//   const updatedNodes = storedNodes.map((node) =>
//     node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
//   );
//   localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedNodes));
// };

// const nodeTypes = {
//   editableNode: (props) => <EditableNode {...props} onDelete={props.onDelete} />,
// };

// const FlowChart = () => {
  // const [nodes, setNodes] = useState(() => {
  //   const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
  //   return storedNodes ? JSON.parse(storedNodes) : initialNodes;
  // });

//   const [edges, setEdges] = useState(initialEdges);

//   // Save nodes to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//   }, [nodes]);

//   const onNodesChange = useCallback((changes) => {
//     setNodes((nds) =>
//       applyNodeChanges(changes, nds).map((node) => {
//         const change = changes.find((change) => change.id === node.id);
//         if (change && change.type === "select") {
//           console.log("Node Changed:", node.id, change);
//         }
//         return node;
//       })
//     );
//   }, []);

//   const onEdgesChange = useCallback((changes) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds));
//   }, []);

//   const onConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     []
//   );

//   const addNode = () => {
//     const newNode = {
//       id: (nodes.length + 1).toString(),
//       position: {
//         x: Math.random() * 400,
//         y: Math.random() * 400,
//       },
//       data: { label: `Node ${nodes.length + 1}` },
//       type: "editableNode",
//     };
  
//     const updatedNodes = [...nodes, newNode];
//     setNodes(updatedNodes);
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedNodes));
//   };


//   const deleteNode = (nodeId) => {
//     const updatedNodes = nodes.filter((node) => node.id !== nodeId);
//     setNodes(updatedNodes);
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedNodes));
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
     

//      <button
//         onClick={addNode}
//         style={{
//           position: "absolute",
//           top: 30,
//           left: 275,
//           zIndex: 99999,
//           padding: "8px 12px",
//           background: "#007bff",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Add Node
//       </button>
//       <ReactFlow
        // nodes={nodes.map((node) => ({ ...node, data: { ...node.data, onDelete: deleteNode } }))}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;











// import React, { useCallback, useState, useEffect } from "react";
// import {
//   applyEdgeChanges,
//   applyNodeChanges,
//   addEdge,
//   Controls,
//   Background,
//   ReactFlow,
//   Handle,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "node1" }, type: "editableNode" },
// ];

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

// const EditableNode = ({ data, id }) => {
//   const [label, setLabel] = useState(data.label);

//   const handleChange = (event) => {
//     setLabel(event.target.value);
//     data.label = event.target.value;
//     updateNodeInLocalStorage(id, event.target.value);
//   };

//   return (
//     <div
//       style={{
//         padding: "10px",
//         border: "1px solid black",
//         borderRadius: "5px",
//         background: "white",
//         textAlign: "center",
//         minWidth: "100px",
//       }}
//     >
//       <input
//         type="text"
//         value={label}
//         onChange={handleChange}
//         style={{
//           border: "none",
//           textAlign: "center",
//           width: "100%",
//           outline: "none",
//         }}
//       />
//       <Handle type="source" position="right" />
//       <Handle type="target" position="left" />
//     </div>
//   );
// };

// // Helper function to update node label in localStorage
// const updateNodeInLocalStorage = (id, newLabel) => {
//   const storedNodes = JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [];
//   const updatedNodes = storedNodes.map((node) =>
//     node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
//   );
//   localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedNodes));
// };

// const nodeTypes = { editableNode: EditableNode };

// const FlowChart = () => {
//   const [nodes, setNodes] = useState(() => {
//     const storedNodes = localStorage.getItem(LOCALSTORAGE_KEY);
//     return storedNodes ? JSON.parse(storedNodes) : initialNodes;
//   });

//   const [edges, setEdges] = useState(initialEdges);

//   // Save nodes to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(nodes));
//   }, [nodes]);

//   const onNodesChange = useCallback((changes) => {
//     setNodes((nds) =>
//       applyNodeChanges(changes, nds).map((node) => {
//         const change = changes.find((change) => change.id === node.id);
//         if (change && change.type === "select") {
//           console.log("Node Changed:", node.id, change);
//         }
//         return node;
//       })
//     );
//   }, []);

//   const onEdgesChange = useCallback((changes) => {
//     setEdges((eds) => applyEdgeChanges(changes, eds));
//   }, []);

//   const onConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     []
//   );

//   const addNode = () => {
//     const newNode = {
//       id: (nodes.length + 1).toString(),
//       position: {
//         x: Math.random() * 400,
//         y: Math.random() * 400,
//       },
//       data: { label: `Node ${nodes.length + 1}` },
//       type: "editableNode",
//     };

//     const updatedNodes = [...nodes, newNode];
//     setNodes(updatedNodes);
//     localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(updatedNodes));
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
//       <button
//         onClick={addNode}
//         style={{
//           position: "absolute",
//           top: 30,
//           left: 275,
//           zIndex: 199990,
//           padding: "8px 12px",
//           background: "#007bff",
//           color: "#fff",
//           border: "none",
//           borderRadius: "5px",
//           cursor: "pointer",
//         }}
//       >
//         Add Node
//       </button>

//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;











// import React, { useCallback, useState, useEffect } from "react";
// import {
//   applyEdgeChanges,
//   applyNodeChanges,
//   addEdge,
//   Controls,
//   Background,
//   ReactFlow,
//   Handle,
// } from "@xyflow/react";
// import "@xyflow/react/dist/style.css";

// const initialNodes = [
//   { id: "1", position: { x: 100, y: 100 }, data: { label: "node1" }, type: "editableNode" },
// ];

// const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

// const EditableNode = ({ data, id }) => {
//   const [label, setLabel] = useState(data.label);

//   const handleChange = (event) => { 
//     setLabel(event.target.value);
//     data.label = event.target.value;
//   };

//   return (
//     <div
//       style={{
//         padding: "10px",
//         border: "1px solid black",
//         borderRadius: "5px",
//         background: "white",
//         textAlign: "center",
//         minWidth: "100px",
//       }}
//     >
//       <input
//         type="text"
//         value={label}
//         onChange={handleChange}
//         style={{
//           border: "none",
//           textAlign: "center",
//           width: "100%",
//           outline: "none",
//         }}
//       />
//       <Handle type="source" position="right" />
//       <Handle type="target" position="left" />
//     </div>
//   );
// };

// const nodeTypes = { editableNode: EditableNode };

// const FlowChart = () => {


//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges] = useState(initialEdges);


//   const onNodesChange = useCallback((changes) => {
//     setNodes((nds) =>
//       applyNodeChanges(changes, nds).map((node) => {
//         const change = changes.find((change) => change.id === node.id);

//         if (change && change.type === "select") {
//           console.log("Node Changed:", node.id, change);
//         }
//         return node;
//       })
//     );
//   }, []);
  

//   const onEdgesChange = useCallback((changes) =>
//     setEdges((eds) => {
//       applyEdgeChanges(changes, eds)
//     }),
//     []
//   );

//   const onConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     []
//   );

//   const addNode = () => {
//     const newNode = {
//       id: (nodes.length + 1).toString(),
//       position: {
//         x: Math.random() * 400,
//         y: Math.random() * 400,
//       },
//       data: { label: `Node ${nodes.length + 1}` },
//       type: "editableNode",
//     };
//     setNodes((prevNodes) => [...prevNodes, newNode]);
//   };

//   return (
//     <div className="page-content" style={{ width: "100vw", height: "100vh" }}>
//       <button
//         onClick={addNode} style={{
//           position: "absolute", top: 30, left: 275, zIndex: 199990, padding: "8px 12px", background: "#007bff",
//           color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer",
//         }}>Add Node</button>
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         nodeTypes={nodeTypes}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         fitView
//       >
//         <Controls />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// };

// export default FlowChart;













// import React, { useState, useCallback, useMemo } from 'react';
// import { ReactFlow, applyEdgeChanges, applyNodeChanges, addEdge, Controls, Background } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';
// import { initialNodes } from './nodes';
// import CustomNode from './CustomeNode';


// function MindMap() {
//   const [nodes, setNodes] = useState(initialNodes);
//   const [edges, setEdges] = useState([]);

//   const onNodesChange = useCallback(
//     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     []
//   );

//   const onEdgesChange = useCallback(
//     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     []
//   );

//   const onConnect = useCallback(
//     (connection) => setEdges((eds) => addEdge(connection, eds)),
//     []
//   );

//   const handleLabelChange = (nodeId, newLabel) => {
//     setNodes((nds) =>
//       nds.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       )
//     );
//   };

// const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);



//   const handleAddNode = (parentNodeId) => {
//     const newNodeId = String(nodes.length + 1);
//     const newNode = {
//       id: newNodeId,
//       position: { x: Math.random() * 500, y: Math.random() * 500 },
//       data: {
//         label: '',
//         onLabelChange: (newLabel) => handleLabelChange(newNodeId, newLabel),
//         onAddNode: () => handleAddNode(newNodeId),
//       },
//       type: 'custom',
//     };
//     setNodes((nds) => [...nds, newNode]);
//   };

//   const updatedNodes = nodes.map((node) => ({
//     ...node,
//     data: {
//       ...node.data,
//       onAddNode: () => handleAddNode(node.id),
//     },
//   }));

//   const reactFlowStyle = {
//     backgroundColor: '#CBC3E3',
 
//   }

//   return (
//     <div style={{ height: '100vh' }}>
//       <ReactFlow
//         nodes={updatedNodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         nodeTypes={nodeTypes}
//         fitView
//         style={reactFlowStyle}
        
//       >
//         <Controls
//          style={{ marginBottom:"70px" }}
//         />
//         <Background />
//       </ReactFlow>
//     </div>
//   );
// }

// export default MindMap;

















// // import React, { useState, useCallback } from 'react';
// // import { ReactFlow, applyEdgeChanges, applyNodeChanges, addEdge, Controls, Background } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';
// // import { initialNodes } from './nodes';
// // import { initialEdges } from './edges';
// // import CustomNode from './CustomeNode';




// // function MindMap() {
// //   const [nodes, setNodes] = useState(initialNodes);
// //   const [edges, setEdges] = useState(initialEdges);

// //   const onNodesChange = useCallback(
// //     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
// //     []
// //   );

// //   const onEdgesChange = useCallback(
// //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
// //     []
// //   );

// //   const onConnect = useCallback(
// //     (connection) => setEdges((eds) => addEdge(connection, eds)),
// //     []
// //   );

// //   const handleLabelChange = (nodeId, newLabel) => {
// //     setNodes((nds) =>
// //       nds.map((node) =>
// //         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
// //       )
// //     );
// //   };

// //   return (
// //     <div style={{ height: '100vh' }}>
// //       <ReactFlow
// //         nodes={nodes}
// //         edges={edges}
// //         onNodesChange={onNodesChange}
// //         onEdgesChange={onEdgesChange}
// //         onConnect={onConnect}
// //         nodeTypes={{ custom: CustomNode }}
// //         fitView
// //       >
// //         <Controls />
// //         <Background />
// //       </ReactFlow>
// //     </div>
// //   );
// // }

// // export default MindMap;

















// // import { useState } from 'react';
// // import { ReactFlow, Controls, Background } from '@xyflow/react';
// // import '@xyflow/react/dist/style.css';

// // const nodes = [
// //   {
// //     id: '1',
// //     position: { x: 0, y: 0 },
// //     data: { label: 'MIndMap' },
// //   },
// // ];

// // function MindMap() {
// //   return (
// //     <div style={{ height: '500px', width: '100%' }}>
// //       <ReactFlow nodes={nodes}>
// //         <Background />
// //         <Controls />
// //       </ReactFlow>
// //     </div>
// //   );
// // }

// // export default MindMap;
