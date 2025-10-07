
const ProcessEdges = (edges) => {
  if (!Array.isArray(edges)) return [];

  return edges.map((edge) => {
    return {
      ...edge,
      type: "customEdge",
      animated: true,
      // style: { stroke: randomColor, }, 
    };
  });
};

export default ProcessEdges;









// const ProcessEdges = ({ connections = [] }) => { // ✅ Default to an empty array
//   return (
//     <svg width="400" height="400" viewBox="0 0 400 400">
//       {connections.map(({ from, to, direction }, index) => {
//         const color = "#9ed56b";

//         let pathData = "";
//         let transformTo = "";
//         let transformFrom = "translate(0,0)";

//         if (direction === "bottom") {
//           pathData = `M 0 0 C 70 0 50 100 100 100`;
//           transformTo = "translate(100,100)";
//         } else if (direction === "right") {
//           pathData = `M 0 0 C 100 0 100 50 100 100`;
//           transformTo = "translate(100,50)";
//         } else if (direction === "top") {
//           pathData = `M 0 0 C 70 0 50 -100 100 -100`;
//           transformTo = "translate(100,-100)";
//         } else if (direction === "left") {
//           pathData = `M 0 0 C -100 0 -100 50 -100 100`;
//           transformTo = "translate(-100,50)";
//         }

//         return (
//           <g key={index} data-nodeid={to} className="node-connection" transform={transformFrom}>
//             <path d="M 0 -4 6 0 0 4 6 4 6 -4 z" fill={color} stroke="none" />
//             <path d="M -0.2 -4 0.1 -4 6 0 0.1 4 -0.2 4" transform={transformTo} fill={color} stroke="none" />
//             <path fill="none" strokeLinejoin="round" strokeWidth="8" d={pathData} stroke={color} />
//           </g>
//         );
//       })}
//     </svg>
//   );
// };

// export default ProcessEdges;














// const ProcessEdges = (edges) => {
//     const colors = ["#9ed56b", "#ff5733", "#4287f5", "#f542d4", "#42f584"];
//     const styles = ["solid", "dotted", "dashed"];
  
//     return edges.map((edge) => {
//       const edgeColor = colors[parseInt(edge.source, 10) % colors.length];
//       const edgeStyle = styles[parseInt(edge.target, 10) % styles.length];
  
//       return {
//         ...edge,
//         type: "gradientBezier",
//         animated: true,
//         style: {
//           stroke: edgeColor,
//           strokeWidth: 3,
//           strokeDasharray: "15 15",
//         },
//       };
//     });
//   };
  
//   export default ProcessEdges;
  