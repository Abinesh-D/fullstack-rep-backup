import { useMemo } from "react";

const UpdatedNodes = ({ nodes, deleteNode, edges, addNode, setNodes, setEdges, onLabelChange, handleFileUpload }) => {
  return useMemo(
    () =>
      nodes.map((node) => {
        const nodeData = node.data || {};
        
        return {
          ...node,
          draggable: node.id !== "1",
          data: {
            ...nodeData,
            image: nodeData.image || null,
            onDelete: deleteNode,
            onAdd: addNode,
            setNodes: setNodes,
            setEdges: setEdges,
            nodes: nodes,
            edges: edges,
            onLabelChange: onLabelChange,
            handleFileUpload: (file, type, id) => handleFileUpload(file, type, id, setNodes, setEdges, nodes, edges),
          },
        };
      }),
    [nodes, deleteNode, addNode, onLabelChange, handleFileUpload, setNodes, setEdges]
  );
};

export default UpdatedNodes;
