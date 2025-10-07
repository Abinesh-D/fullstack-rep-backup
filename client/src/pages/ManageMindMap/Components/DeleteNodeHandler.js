const DeleteNodeHandler = ({ setNodes, setEdges }) => (nodeId) => {
    setNodes((prev) => prev.filter((node) => node.id !== nodeId));
    setEdges((prev) => prev.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    localStorage.removeItem(`node_${nodeId}`);

  };
  

  export default DeleteNodeHandler;
  