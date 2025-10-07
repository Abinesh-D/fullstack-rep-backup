
import { Container } from "reactstrap";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import TabContainer from './ManageBibliography/TabContainer';

export default function index() {

    return (
        <div className='page-content'>
             <Breadcrumbs title="Patent Search"/>
            <Container fluid>
                <TabContainer />
            </Container>
        </div>
    )
}
















// import React, { useState, useCallback } from 'react';
// import {
//   Background,
//   ReactFlow,
//   Controls,
//   MiniMap,
//   applyNodeChanges,
//   applyEdgeChanges,
//   addEdge,
// } from '@xyflow/react';
// import * as XLSX from 'xlsx';
// import * as d3 from 'd3';
// import '@xyflow/react/dist/style.css';

// const Index = () => {
//   const [nodes, setNodes] = useState([]);
//   const [edges, setEdges] = useState([]);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const binaryStr = event.target.result;
//       const workbook = XLSX.read(binaryStr, { type: 'binary' });
//       const sheetName = workbook.SheetNames[0];
//       const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//       const { parsedNodes, parsedEdges } = parseHierarchicalData(sheetData);
//       setNodes(parsedNodes);
//       setEdges(parsedEdges);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const parseHierarchicalData = (data) => {
//     const parsedNodes = [];
//     const parsedEdges = [];
//     const nodeMap = new Map();
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
//             position: { x: colIndex * 200, y: rowIndex * 80 },
//           };
//           parsedNodes.push(newNode);
//           nodeMap.set(nodeId, newNode);
//         }

//         if (parentNodeId && parentNodeId !== nodeId) {
//           const edgeId = `e${parentNodeId}-${nodeId}`;
//           if (!parsedEdges.some((edge) => edge.id === edgeId)) {
//             parsedEdges.push({
//               id: edgeId,
//               source: parentNodeId,
//               target: nodeId,
//               animated: true,
//               data: { strokeColor: getRandomColor() },
//             });
//           }
//         }
//         parentNodeId = nodeId;
//       });
//     });
//     return { parsedNodes, parsedEdges };
//   };

//   const getRandomColor = () => {
//     const colors = ["#FF6B6B", "#FF9F68", "#FFA07A", "#FFD166", "#F4A261", "#E9C46A", "#B8DE6F"];
//     return colors[Math.floor(Math.random() * colors.length)];
//   };

//   const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//     const line = d3.line().curve(d3.curveBasis);
//     const edgePath = line([
//       [sourceX, sourceY],
//       [(sourceX + targetX) / 2, (sourceY + targetY) / 2],
//       [targetX, targetY],
//     ]);

//     return (
//       <path
//         d={edgePath}
//         fill="none"
//         stroke={data?.strokeColor || "#efa670"}
//         strokeWidth={4}
//         strokeLinecap="round"
//       />
//     );
//   };

//   const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
//   const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);
//   const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

//   return (
//     <div className='page-content' style={{ width: '100vw', height: '100vh' }}>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ marginBottom: 10 }} />
//       <ReactFlow
//         nodes={nodes}
//         edges={edges}
//         onNodesChange={onNodesChange}
//         onEdgesChange={onEdgesChange}
//         onConnect={onConnect}
//         edgeTypes={{ custom: CustomEdge }}
//         fitView
//       >
//         <Background />
//         <Controls />
//         <MiniMap />
//       </ReactFlow>
//     </div>
//   );
// };

// export default Index;



























// import React, { useEffect } from 'react'
// import { Container } from "reactstrap";
// import { useDispatch } from "react-redux";
// import HS_Employees from './Component/HS_Employees';
// // import { retrieveEmployeeListAPI, setSameCaptainAndWaiter, retrieveCaptainData } from 'Slice/incentiveSlice';
// import Breadcrumbs from '../../components/Common/Breadcrumb';

// export default function index() {



//     // useEffect(() => {
//     //     fetchIncentives();
//     //     fetchCaptainMappings();
//     // }, []);


//     // const fetchIncentives = async () => {
//     //     try {
//     //         const response = await dispatch(retrieveEmployeeListAPI());
//     //         if (response) {

//     //         }
//     //     } catch (error) {
//     //         console.error('Error fetching incentives:', error);
//     //     }
//     // };

//     // const fetchCaptainMappings = async () => {
//     //     try {
//     //         const formData = { "action": "readAll", };
//     //         const data = await dispatch(retrieveCaptainData(formData));
//     //         if (data) {
//     //             dispatch(setSameCaptainAndWaiter(data));
//     //         }
//     //     } catch (error) {
//     //         console.error('Failed to fetch captain mappings:', error);
//     //     }
//     // };

//     return (
//         <div className='page-content'>
//              <Breadcrumbs title="Employee Deatails"/>
//             <Container fluid>
//                 {/* <HS_Employees /> */}
//             </Container>
//         </div>
//     )
// }
