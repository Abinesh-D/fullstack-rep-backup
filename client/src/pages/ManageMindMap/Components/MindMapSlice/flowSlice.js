// import { createSlice } from "@reduxjs/toolkit";

// const LOCALSTORAGE_KEY = "FlowChartData";

// const initialState = {
//   nodes: JSON.parse(localStorage.getItem(LOCALSTORAGE_KEY)) || [
//     { id: "1", position: { x: 100, y: 100 }, data: { label: "Node 1" }, type: "editableNode" },
//   ],
//   edges: JSON.parse(localStorage.getItem(`${LOCALSTORAGE_KEY}_edges`)) || [],
// };

// const flowSlice = createSlice({
//   name: "flow",
//   initialState,
//   reducers: {
//     setNodes: (state, action) => {
//       state.nodes = action.payload;
//       localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state.nodes));
//     },
//     setEdges: (state, action) => {
//       state.edges = action.payload;
//       localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(state.edges));
//     },
//     addNode: (state, action) => {
//       state.nodes.push(action.payload);
//       localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state.nodes));
//     },
//     deleteNode: (state, action) => {
//       state.nodes = state.nodes.filter((node) => node.id !== action.payload);
//       state.edges = state.edges.filter(
//         (edge) => edge.source !== action.payload && edge.target !== action.payload
//       );
//       localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state.nodes));
//       localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(state.edges));
//     },
//     updateNodeLabel: (state, action) => {
//       const { nodeId, newLabel } = action.payload;
//       state.nodes = state.nodes.map((node) =>
//         node.id === nodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
//       );
//       localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(state.nodes));
//     },
//     addEdge: (state, action) => {
//       state.edges.push(action.payload);
//       localStorage.setItem(`${LOCALSTORAGE_KEY}_edges`, JSON.stringify(state.edges));
//     },
//   },
// });

// export const { setNodes, setEdges, addNode, deleteNode, updateNodeLabel, addEdge } = flowSlice.actions;
// export default flowSlice.reducer;
