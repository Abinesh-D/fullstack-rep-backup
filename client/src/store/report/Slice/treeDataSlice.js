// import { createSlice } from '@reduxjs/toolkit';
// import { changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath, getVisibleNodeCount } from 'react-sortable-tree';
// import {saveTreeDataApi,createPageNode} from '../../../pages/Report/Api/TreeStructure'
// // import urlSocket from 'helpers/urlSocket';.
// import { useHistory } from 'react-router-dom';
// import { setNodeInfo } from '../../report/Slice/LayoutInfoSlice';

// // import { addNodeUnderParent, removeNodeAtPath, getNodeAtPath, changeNodeAtPath, getFlatDataFromTree } from 'react-sortable-tree/dist/index.cjs.js'
// // import SortableTree, { getVisibleNodeCount, changeNodeAtPath, addNodeUnderParent, getFlatDataFromTree, getNodeAtPath, removeNodeAtPath } from "@nosferatu500/react-sortable-tree";

// const getNodeKey = ({ treeIndex }) => treeIndex;
    

// const treeDataSlice = createSlice({
//     name: 'treeData',
//     initialState: {
//         treeData: [],
//         crud: false,
//         editcrud: false,
//         crudStatus: 0,
//         path: [],
//         getNodeInfo: null,
//         getCode: null,
//         getTitle: null,
//         type: null,
//         id: null,
//         parent: null,
//         menuName: '',
//         reportName:'',
//         totalHLength: 0,
//         mainToggle: false,
//         nodeCount: 1
//     },
//     reducers: {
//         setTreeData: (state, action) => {
//             state.treeData = action.payload;
//         },
//         setState: (state, action) => {
//             Object.assign(state, action.payload);
//         },
//         setTotalHLength: (state, action) => {
//             state.totalHLength = action.payload;
//         },
//         setMenuName: (state, action) => {
//             state.menuName = action.payload;
//         },
//         setReportName:(state,action)=>{
//             state.reportName = action.payload
//         }
//     },
// });

// export const { setTreeData, setState, setTotalHLength, setMenuName,setReportName } = treeDataSlice.actions;


// const saveTreeData = (treeData, totalHLength, stateValues, history) => async (dispatch, getState) => {
//     // 
//     var flatData = await saveHStructure(treeData)
//     if(stateValues.type === 1){
//         var nodeInfo = _.filter(flatData,{id :totalHLength })
//         createPageNode(totalHLength,stateValues,getState().sessioninfo)
//         if(history !==undefined){
//         sessionStorage.setItem("pageNodeInfo", JSON.stringify(nodeInfo[0]))
//         dispatch(setNodeInfo(nodeInfo[0]))
//         history.push("/report_page")
//         }
//     }   
//     saveTreeDataApi(treeData,totalHLength,getState().sessioninfo)
// };

// //  function to get tree data from flat data
// const treeDataToFlat = (treeData) => {
//     var flatData = getFlatDataFromTree({
//         treeData: treeData,
//         getNodeKey,
//         ignoreCollapsed: false,
//     });
//     var explicitData = _.filter(flatData, (item) => {
//         return item;
//     });
//     return explicitData;
// };

// //  action to save tree structure
// const saveHStructure = (treeData) => {
//     return new Promise((resolve, reject) => {
//         try {
//             const explicitData = treeDataToFlat(treeData);
//             resolve(_.map(explicitData, 'node'))
//         } catch (error) {
//             reject(error)
//         }
//     })
// };


// //  action to add sub node
// export const addNode = (node, path, type) => (dispatch, getState) => {
//     const state = getState().treeData;
//     if (!path || path.length === 0) {
//         console.error("Path array is empty or undefined");
//         return;
//     }
//     const getNodeInfo = getNodeAtPath({
//         treeData: state.treeData,
//         path,
//         getNodeKey,
//     });

//     if (!getNodeInfo) {
//         console.error("Invalid path: getNodeInfo is null or undefined");
//         return;
//     }

//     dispatch(setState({
//         type,
//         path: path,
//         crud: true,
//         editcrud: false,
//         crudStatus: 1,
//         title: getNodeInfo.node.title,
//         getTitle: "",
//         getSubTitle: "",
//         getSubTitledd: "0",
//         id: getNodeInfo.node.children ? getNodeInfo.node.children.length + 1 : getNodeInfo.node.id,
//         parent: getNodeInfo.node.id,
//         children: getNodeInfo.node.children || state.children || []
//     }));
// };

// //  action to create parent , child, and edit node
// export const crudNode = (values,history) => (dispatch, getState) => {
//     const state = getState().treeData;
//     const { treeData, menuName, totalHLength, crudStatus } = state;

//     let updatedTreeData;

//     switch (crudStatus) {

//         case 0: // create main node
//             const parentKey = state.path && state.path.length > 0 ? state.path[state.path.length - 1] : null;
//             updatedTreeData = addNodeUnderParent({
//                 treeData,
//                 parentKey,
//                 expandParent: true,
//                 getNodeKey,
//                 newNode: {
//                     id: totalHLength + 1,
//                     parent: null,
//                     title: values.title,
//                     menuName : values.menuName,
//                     subtitle: "",
//                     type: state.type,
//                     children: []
//                 },
//                 addAsFirstChild: state.addAsFirstChild,
//             }).treeData;
//             break;

//         case 1: // Create sub-node
//             const newNode = {
//                 id: totalHLength + 1,
//                 parent: state.parent,
//                 title: values.title,
//                 menuName : values.menuName,
//                 subtitle: "",
//                 type: state.type,
//             };

//             updatedTreeData = addNodeUnderParent({
//                 treeData,
//                 parentKey: state.path[state.path.length - 1],
//                 expandParent: true,
//                 getNodeKey,
//                 newNode,
//                 addAsFirstChild: state.addAsFirstChild,
//             }).treeData;

//             break;

//         default:
//             console.error("Invalid crudStatus value:", crudStatus);
//             return;
//     }

//     // Dispatch action to update treeData in Redux store
//     dispatch(setTreeData(updatedTreeData));
//     dispatch(saveTreeData(updatedTreeData, crudStatus === 2 ? totalHLength : totalHLength + 1,getState().treeData,history))

//     // Dispatch action to update state
//     dispatch(setState({
//         crud: false,
//         editcrud: false,
//         childToggle: false,
//         mainToggle: false,
//         dataLoaded: true,
//         totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
//     }));
// };

// export const editNode = (path, node) => (dispatch, getState) => {
//     const state = getState().treeData;

//     const getNodeInfo = getNodeAtPath({
//         treeData: state.treeData,
//         path,
//         getNodeKey,
//     });

//     dispatch(setState({
//         crud: false,
//         editcrud: true,
//         crudStatus: 2,
//         path: path,
//         getNodeInfo: getNodeInfo.node,
//         getCode: getNodeInfo.node.code,
//         getTitle: getNodeInfo.node.title,
//         type: getNodeInfo.node.type,
//         id: getNodeInfo.node.id,
//         parent: getNodeInfo.node.parent,
//         menuName: node.title,
//     }));
// };

// //  action to edit and update a node
// export const updateNode = (values) => (dispatch, getState,history) => {
//     const state = getState().treeData;
//     const { treeData, menuName, totalHLength, crudStatus } = state;

//     let updatedTreeData;

//     switch (crudStatus) {
//         case 2: // Edit node
//             updatedTreeData = changeNodeAtPath({
//                 treeData,
//                 path: state.path,
//                 expandParent: true,
//                 getNodeKey,
//                 newNode: {
//                     ...state.getNodeInfo,
//                     title: menuName,
//                 },
//             });
//             break;

//         default:
//             console.error("Invalid crudStatus value:", crudStatus);
//             return;
//     }

//     // Dispatch action to update treeData in Redux store
//     dispatch(setTreeData(updatedTreeData));
//     dispatch(saveTreeData(updatedTreeData, totalHLength,getState().treeData,history));

//     // Dispatch action to update state
//     dispatch(setState({
//         crud: false,
//         editcrud: false,
//         childToggle: false,
//         mainToggle: false,
//         dataLoaded: true,
//         totalHLength: crudStatus === 2 ? totalHLength : totalHLength + 1,
//     }));
// };

// //  action to delete node
// export const deleteNode = (node, path) => (dispatch, getState) => {
//     // Assuming you have imported the necessary functions like removeNodeAtPath and saveHStructure
//     var totalHLength = getState().treeData.totalHLength
//     dispatch(setTreeData(removeNodeAtPath({
//         treeData: getState().treeData.treeData, // Accessing the treeData from Redux state
//         path,
//         getNodeKey,
//     })));
//     dispatch(setState({ crud: false }))
//     dispatch(saveTreeData(getState().treeData.treeData, totalHLength,getState().treeData))
// };

// //  action to drag and drop  nodes
// export const dndNode = (droppedNode) => async (dispatch, getState) => {
//     try {
//         const parentId = droppedNode.nextParentNode ? droppedNode.nextParentNode.id : null;

//         const updatedTreeData = changeNodeAtPath({
//             treeData: getState().treeData.treeData,
//             path: droppedNode.path,
//             getNodeKey: getNodeKey,
//             newNode: {
//                 parent: parentId,
//                 id: droppedNode.node.id,
//                 title: droppedNode.node.title,
//                 subtitle: droppedNode.node.subtitle,
//                 type: droppedNode.node.type,
//                 children: droppedNode.node.children || [],
//             },
//         });

//         dispatch(setTreeData(updatedTreeData));
//         await dispatch(saveTreeData(updatedTreeData, getState().treeData.totalHLength,getState().treeData));
//     } catch (error) {
//         console.error('Error occurred while performing DND operation:', error);
//         // Handle the error gracefully, e.g., show a message to the user or perform fallback actions
//         // Optionally, re-throw the error if you need to propagate it further
//         throw error;
//     }
// };
// //  action to select node
// export const getNodeData = (nodeData) => (dispatch, getState) => {
//     const { type, title, children } = nodeData;

// };

// //  action to Expand button
// export const onTreeChange = (newTreeData, dispatch) => {
//     // Dispatch the setTreeData action to update the Redux store with the new tree data
//     dispatch(setTreeData(newTreeData));
//     dispatch(setState({
//         nodeCount: getVisibleNodeCount({ treeData: newTreeData })
//     }));
// };


// // export default treeDataSlice.reducer;
// export const updateTreeData = (state) => (state.treeData.treeData)
// export const treeDataSliceReducer = treeDataSlice.reducer;