import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { edgeColors } from "./MindMapSlice/Reusable/EdgeUtlis";

const directionConfigs = {
  top: [{ transform: "translate(0,-19.0357)", pathD: "M 0 -25 C 0 -102.7696 -86.7339 -269.2915 -8.9643 -269.2915", arrowTransform: "translate(-8.9743,-269.2915)" }],
  bottom: [{ transform: "translate(0,19.0357) rotate(180)", pathD: "M 0 25 C 0 102.7067 -86.6710 269.0818 -8.9643 269.0818", arrowTransform: "translate(-8.9743,269.0818)" }],
  left: [{ transform: "translate(-39.0357,0) scale(-1, 1) rotate(90)", pathD: "M -45 0 C -194.7341 0 -151.9529 0.0000 -258.9058 0.0000", arrowTransform: "translate(-262.4158, -2) rotate(60)" }],
  right: [{ transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(259.1081,0)", pathD: "M 45 0 C 194.8827 0 152.0590 0 259.1181 0" }],
};

const getStoredColor = (id) => {
  const storedColors = JSON.parse(localStorage.getItem("EdgeColors")) || {};
  if (storedColors[id]) return storedColors[id];

  const newColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
  storedColors[id] = newColor;
  localStorage.setItem("EdgeColors", JSON.stringify(storedColors));
  return newColor;
};

const CustomEdge = ({ id, data, sourceX, sourceY, targetX, targetY }) => {
  const pathRef = useRef(null);
  const isFromExcel = data?.isFromExcel;

  const strokeColor = useMemo(() => getStoredColor(id), [id]);

  useEffect(() => {
    if ((!isFromExcel || !data?.isImageNode) || !pathRef.current) return;

    const path = d3.select(pathRef.current);
    path
      .attr("stroke-dasharray", "10, 8")
      .attr("stroke-dashoffset", "18")
      .transition()
      .duration(1500)
      .ease(d3.easeLinear)
      .attr("stroke-dashoffset", "0")
      .on("end", function repeat() {
        d3.select(this)
          .attr("stroke-dashoffset", "18")
          .transition()
          .duration(1500)
          .ease(d3.easeLinear)
          .attr("stroke-dashoffset", "0")
          .on("end", repeat);
      });
  }, [isFromExcel, sourceX, sourceY, targetX, targetY, data?.isImageNode]);

  if (isFromExcel || data?.isImageNode) {
    const offsetX = data?.offsetX || 0;
    const adjustedTargetX = targetX + offsetX;

    const controlX1 = sourceX + (adjustedTargetX - sourceX) * 0.3;
    const controlY1 = sourceY;
    const controlX2 = sourceX + (adjustedTargetX - sourceX) * 0.7;
    const controlY2 = targetY;
    const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${adjustedTargetX},${targetY}`;

    return (
      <g className="custom-d3-edge">
        <motion.path
          ref={pathRef}
          d={edgePath}
          fill="none"
          stroke={data?.color || "#ebd95f"}
          strokeWidth={data?.strokeWidth || 4}
          strokeLinecap="round"
        />
      </g>
    );
  }

  const { direction = "right", index = 0 } = data || {};
  const config = directionConfigs[direction]?.[index] || {};

  return (
    <svg width="100%" height="100%" viewBox="0 -227 124 300">



    

      <g key={id} className="node-connection">
        <path
          d="M -4.595 0 0 -6.9643 4.595 0 4.595 -6.9643 -4.595 -6.9643 z"
          transform={config.transform}
          fill={strokeColor}
          stroke="none"
        />
        <path
          d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
          transform={config.arrowTransform}
          fill={strokeColor}
          stroke="none"
        />
        <path
          fill="none"
          strokeLinejoin="round"
          strokeWidth="9.17"
          d={config.pathD}
          stroke={strokeColor}
        />
      </g>

    </svg>
  );
};

export default CustomEdge;






// <g data-nodeid="c6132f5c6f5fd4b8d9644779" className="node-connection"transform="translate(-270.0020,0.0000)">


// <path
//   d="M 0 -4.2264 6.4057 0 0 4.2264 6.4057 4.2264 6.4057 -4.2264 z"
//   transform="translate(6.4057,0) scale(-1, 1)"
//   fill="#9cd563"
//   stroke="none"
// />
// <path
//   d="M 0.2 -4.0764 -0.1 -4.0764 -6.1808 0 -0.1 4.0764 0.2 4.0764"
//   transform="translate(-100.6043,0)"
//   fill="#9cd563"
//   stroke="none"
// />
// <path
//   fill="none"
//   strokeLinejoin="round"
//   strokeWidth="8.4529"
//   d="M 1 0 C -70.1160 0 -49.7971 0 -100.5943 0"
//   stroke="#9cd563"
// />
// </g>

// <g data-nodeid="01f2feb232dc163dba65f8b2" className="node-connection" transform="translate(-270.0020,0.0000)">
// <path
//   d="M 0 -4.2264 6.4057 0 0 4.2264 6.4057 4.2264 6.4057 -4.2264 z"
//   transform="translate(6.4057,0) scale(-1, 1)"
//   fill="#a3d670"
//   stroke="none"
// />
// <path
//   d="M 0.2 -4.0764 -0.1 -4.0764 -6.1808 0 -0.1 4.0764 0.2 4.0764"
//   transform="translate(-100.6043,32.0000)"
//   fill="#a3d670"
//   stroke="none"
// />
// <path
//   fill="none"
//   strokeLinejoin="round"
//   strokeWidth="8.4529"
//   d="M 1 0 C -72.6760 0 -40.1971 32.0000 -100.5943 32.0000"
//   stroke="#a3d670"
// />
// </g>

// <g data-nodeid="2b1e09d49fa4b57f0254e7b3" className="node-connection" transform="translate(-270.0020,0.0000)">
// <path
//   d="M 0 -4.2264 6.4057 0 0 4.2264 6.4057 4.2264 6.4057 -4.2264 z"
//   transform="translate(6.4057,0) scale(-1, 1)"
//   fill="#a3d76f"
//   stroke="none"
// />
// <path
//   d="M 0.2 -4.0764 -0.1 -4.0764 -6.1808 0 -0.1 4.0764 0.2 4.0764"
//   transform="translate(-100.6043,64)"
//   fill="#a3d76f"
//   stroke="none"
// />
// <path
//   fill="none"
//   strokeLinejoin="round"
//   strokeWidth="8.4529"
//   d="M 1 0 C -75.2360 0 -30.5971 64 -100.5943 64"
//   stroke="#a3d76f"
// />
// </g>



// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);

//   // Apply only to targetX to pull the edge left
//   const offsetX = data?.offsetX || 0;

//   const adjustedTargetX = targetX + offsetX;

//   useEffect(() => {
//     if (pathRef.current) {
//       const path = d3.select(pathRef.current);
//       path
//         .attr("stroke-dasharray", "10, 8")
//         .attr("stroke-dashoffset", "18")
//         .transition()
//         .duration(1500)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", "0")
//         .on("end", function repeat() {
//           d3.select(this)
//             .attr("stroke-dashoffset", "18")
//             .transition()
//             .duration(1500)
//             .ease(d3.easeLinear)
//             .attr("stroke-dashoffset", "0")
//             .on("end", repeat);
//         });
//     }
//   }, [sourceX, sourceY, adjustedTargetX, targetY]);

//   // New Bezier control points
//   const controlX1 = sourceX + (adjustedTargetX - sourceX) * 0.3;
//   const controlY1 = sourceY;
//   const controlX2 = sourceX + (adjustedTargetX - sourceX) * 0.7;
//   const controlY2 = targetY;

//   const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${adjustedTargetX},${targetY}`;

//   return (
//     <g className="custom-d3-edge">
//       <motion.path
//         ref={pathRef}
//         d={edgePath}
//         fill="none"
//         stroke={data?.color || "#ebd95f"}
//         strokeWidth={data?.strokeWidth || 4}
//         strokeLinecap="round"
//       />
//     </g>
//   );
// };

// export default CustomEdge;








// import { useState, useEffect, useMemo } from "react";
// import { edgeColors } from "./MindMapSlice/Reusable/EdgeUtlis";

// const getStoredColor = (id) => {
//   const storedColors = JSON.parse(localStorage.getItem("EdgeColors")) || {};
//   if (storedColors[id]) return storedColors[id];

//   const newColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
//   storedColors[id] = newColor;
//   localStorage.setItem("EdgeColors", JSON.stringify(storedColors));
//   return newColor;
// };

// // Function to get the next available index for right-direction edges
// const getNextRightIndex = () => {
//   let index = parseInt(localStorage.getItem("rightEdgeIndex"), 10) || 0;
//   const maxIndex = directionConfigs.right.length - 1;

//   if (index > maxIndex) index = maxIndex; // Prevent out-of-bounds
//   localStorage.setItem("rightEdgeIndex", index + 1); // Store next index
//   return index;
// };

// const directionConfigs = {
//   top: [{ transform: "translate(0,-19.0357)", pathD: "M 0 -25 C 0 -102.7696 -86.7339 -269.2915 -8.9643 -269.2915", arrowTransform: "translate(-8.9743,-269.2915)" }],
//   bottom: [{ transform: "translate(0,19.0357) rotate(180)", pathD: "M 0 25 C 0 102.7067 -86.6710 269.0818 -8.9643 269.0818", arrowTransform: "translate(-8.9743,269.0818)" }],
//   left: [{ transform: "translate(-39.0357,0) scale(-1, 1) rotate(90)", pathD: "M -45 0 C -194.7341 0 -151.9529 0.0000 -258.9058 0.0000", arrowTransform: "translate(-262.4158, -2) rotate(60)" }],
//   right: [
//     { id: "0", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(259.1081,0)", pathD: "M 45 0 C 194.8827 0 152.0590 0 259.1181 0" },
//     // { id: "1", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(235.2488,-48.6505)", pathD: "M 45 0 C 182.0732 0 125.5343 -48.6505 235.2588 -48.6505" },
//     // { id: "2", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(235.2488,48.6505)", pathD: "M 45 0 C 182.0732 0 125.5343 48.6505 235.2588 48.6505" },
//     // { id: "3", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(167.1574,-176.4246)", pathD: "M 45 0 C 144.6311 0 53.1563 -176.4246 167.1674 -176.4246" },
//     // { id: "4", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(167.1574,176.4246)", pathD: "M 45 0 C 144.6311 0 53.1563 176.4246 167.1674 176.4246" },
//     // { id: "5", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(221.0934,-95.4408)", pathD: "M 45 0 C 175.9077 0 104.4195 -95.4408 221.1034 -95.4408" },
//     // { id: "6", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(221.0934,95.4408)", pathD: "M 45 0 C 175.9077 0 104.4195 95.4408 221.1034 95.4408" },
//     // { id: "7", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(198.1033,-138.5820)", pathD: "M 45 0 C 163.2659 0 79.9820 -138.5820 198.1133 -138.5820" },
//     // { id: "8", transform: "translate(39.0357,0) rotate(90)", arrowTransform: "translate(198.1033,138.582)", pathD: "M 45 0 C 163.2659 0 79.982 138.582 198.1133 138.582" }
//   ]
// };

// const CustomEdge = ({ id, data }) => {
//   const strokeColor = useMemo(() => getStoredColor(id), [id]);

//   const { direction } = data || {};
//   let index = data?.index ?? 0;

//   if (direction === "right") {
//     index = getNextRightIndex(); // Get next available right-edge index
//   }

//   const config = directionConfigs[direction]?.[index] || {};

//   return (
//     <svg width="100%" height="100%" viewBox="0 -227 124 300">
//       <g key={id} className="node-connection">
//         <path
//           d="M -4.595 0 0 -6.9643 4.595 0 4.595 -6.9643 -4.595 -6.9643 z"
//           transform={config.transform}
//           fill={strokeColor}
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform={config.arrowTransform}
//           fill={strokeColor}
//           stroke="none"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.17"
//           d={config.pathD}
//           stroke={strokeColor}
//         />
//       </g>
//     </svg>
//   );
// };

// export default CustomEdge;






// import { useRef } from "react";
// import { edgeColors } from "./MindMapSlice/Reusable/EdgeUtlis";

// const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);
//   const prevCoords = useRef({ sourceX, sourceY, targetX, targetY });

//   console.log('datadatatattatata ', data);

//   const getStoredColor = () => {
//     const storedColors = JSON.parse(localStorage.getItem("EdgeColors")) || {};
//     if (storedColors[id]) return storedColors[id];

//     const newColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
//     storedColors[id] = newColor;
//     localStorage.setItem("EdgeColors", JSON.stringify(storedColors));
//     return newColor;
//   };

//   const strokeColor = getStoredColor();

//   const directionConfigs = {
//     top: {
//       transform: "translate(0,-19.0357)",
//       pathD: "M 0 -25 C 0 -102.7696 -86.7339 -269.2915 -8.9643 -269.2915",
//       arrowTransform: "translate(-8.9743,-269.2915)",
//       rotation: "rotate(0)"
//     },
//     bottom: {
//       transform: "translate(0,19.0357) rotate(180)",
//       pathD: "M 0 25 C 0 102.7067 -86.6710 269.0818 -8.9643 269.0818",
//       arrowTransform: "translate(-8.9743,269.0818)",
//       rotation: "rotate(60)"
//     },
//     left: {
//       transform: "translate(-39.0357,0) scale(-1, 1) rotate(90)",
//       pathD: "M -45 0 C -194.7341 0 -151.9529 0.0000 -258.9058 0.0000",
//       arrowTransform: "translate(-262.4158, -2) rotate(60)",
//       rotation: "rotate(60)"
//     },
//     right: {
//       transform: "translate(39.0357,0) rotate(90)",
//       pathD: "M 45 0 C 194.8827 0 152.0590 0 259.1181 0",
//       arrowTransform: "translate(259.1081,0)",
//       rotation: "rotate(60)"
//     },
//   };

//   const config = directionConfigs[data?.direction] || directionConfigs.right;

//   return (
//     <svg width="100%" height="100%" viewBox="0 -227 124 300" >
//       <g className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M -4.595 0 0 -6.9643 4.595 0 4.595 -6.9643 -4.595 -6.9643 z"
//           transform={`${config.transform}`}
//           fill={strokeColor}
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform={config.arrowTransform}
//           fill={strokeColor}
//           stroke="none"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d={config.pathD}
//           stroke={strokeColor}
//         />
//       </g>




//       <g data-nodeid="56272af083c2312b92ac09d9" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#67d7c4"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(235.2488,-48.6505)"
//           fill="#67d7c4"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 182.0732 0 125.5343 -48.6505 235.2588 -48.6505"
//           stroke="#67d7c4"
//         />
//       </g>
//       <g data-nodeid="40696248920893d57a282c0d" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#7aa3e5"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(235.2488,48.6505)"
//           fill="#7aa3e5"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 182.0732 0 125.5343 48.6505 235.2588 48.6505"
//           stroke="#7aa3e5"
//         />
//       </g>
//       <g data-nodeid="79659b8eddb7d6e2f889c0bc" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#efa670"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(167.1574,-176.4246)"
//           fill="#efa670"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 144.6311 0 53.1563 -176.4246 167.1674 -176.4246"
//           stroke="#efa670"
//         />
//       </g>
//       <g data-nodeid="1a26b2c9409820919c0e8862" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#e096e9"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(167.1574,176.4246)"
//           fill="#e096e9"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 144.6311 0 53.1563 176.4246 167.1674 176.4246"
//           stroke="#e096e9"
//         />
//       </g>
//       <g data-nodeid="e93e89215e50818274d9b1ef" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#e68782"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(221.0934,-95.4408)"
//           fill="#e68782"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 175.9077 0 104.4195 -95.4408 221.1034 -95.4408"
//           stroke="#e68782"
//         />
//       </g>
//       <g data-nodeid="206b4535de40e2eeb9a9db5b" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#988ee3"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(221.0934,95.4408)"
//           fill="#988ee3"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 175.9077 0 104.4195 95.4408 221.1034 95.4408"
//           stroke="#988ee3"
//         />
//       </g>
//       <g data-nodeid="368d2ee57b0f3b4085927b47" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#ebd95f"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//           transform="translate(198.1033,-138.5820)"
//           fill="#ebd95f"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 163.2659 0 79.9820 -138.5820 198.1133 -138.5820"
//           stroke="#ebd95f"
//         />
//       </g>
//       <g data-nodeid="56464d28074f9e7bc476981b" className="node-connection" transform="translate(0, 0)">
//         <path
//           d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//           transform="translate(39.0357,0)"
//           fill="#9ed56b"
//           stroke="none"
//         />
//         <path
//           d="M -0.2 -4.445 0.1 -4.445 6.7396 0 0.1 4.445 -0.2 4.445"
//           transform="translate(198.1033,138.582)"
//           fill="#9ed56b"
//           stroke="none"
//           opacity="1"
//         />
//         <path
//           fill="none"
//           strokeLinejoin="round"
//           strokeWidth="9.19"
//           d="M 45 0 C 163.2659 0 79.982 138.582 198.1133 138.582"
//           stroke="#9ed56b"
//         />
//       </g>
//     </svg>
//   );
// };

// export default CustomEdge;



//   <g data-nodeid="56272af083c2312b92ac09d9" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#67d7c4"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(235.2488,-48.6505)"
//     fill="#67d7c4"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 182.0732 0 125.5343 -48.6505 235.2588 -48.6505"
//     stroke="#67d7c4"
//   />
// </g>
// <g data-nodeid="40696248920893d57a282c0d" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#7aa3e5"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(235.2488,48.6505)"
//     fill="#7aa3e5"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 182.0732 0 125.5343 48.6505 235.2588 48.6505"
//     stroke="#7aa3e5"
//   />
// </g>
// <g data-nodeid="79659b8eddb7d6e2f889c0bc" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#efa670"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(167.1574,-176.4246)"
//     fill="#efa670"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 144.6311 0 53.1563 -176.4246 167.1674 -176.4246"
//     stroke="#efa670"
//   />
// </g>
// <g data-nodeid="1a26b2c9409820919c0e8862" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#e096e9"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(167.1574,176.4246)"
//     fill="#e096e9"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 144.6311 0 53.1563 176.4246 167.1674 176.4246"
//     stroke="#e096e9"
//   />
// </g>
// <g data-nodeid="e93e89215e50818274d9b1ef" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#e68782"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(221.0934,-95.4408)"
//     fill="#e68782"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 175.9077 0 104.4195 -95.4408 221.1034 -95.4408"
//     stroke="#e68782"
//   />
// </g>
// <g data-nodeid="206b4535de40e2eeb9a9db5b" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#988ee3"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(221.0934,95.4408)"
//     fill="#988ee3"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 175.9077 0 104.4195 95.4408 221.1034 95.4408"
//     stroke="#988ee3"
//   />
// </g>
// <g data-nodeid="368d2ee57b0f3b4085927b47" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#ebd95f"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(198.1033,-138.5820)"
//     fill="#ebd95f"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 163.2659 0 79.9820 -138.5820 198.1133 -138.5820"
//     stroke="#ebd95f"
//   />
// </g>
// <g data-nodeid="56464d28074f9e7bc476981b" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(39.0357,0)"
//     fill="#9ed56b"
//     stroke="none"
//   />
//   <path
//     d="M -0.2 -4.445 0.1 -4.445 6.7396 0 0.1 4.445 -0.2 4.445"
//     transform="translate(198.1033,138.582)"
//     fill="#9ed56b"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 45 0 C 163.2659 0 79.982 138.582 198.1133 138.582"
//     stroke="#9ed56b"
//   />
// </g>
























// <g data-nodeid="da0e9b38f1a2d72cbabcb0dd" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#efa670"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-166.8245,176.7782)"
//     fill="#efa670"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -144.4124 0 -52.8738 176.7782 -166.8145 176.7782"
//     stroke="#efa670"
//   />
// </g>
// <g data-nodeid="b87d26dfbdbdd0f2e7bd3007" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#e68782"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-221.018,95.6716)"
//     fill="#e68782"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -175.8593 0 -104.3025 95.6716 -221.008 95.6716"
//     stroke="#e68782"
//   />
// </g>
// <g data-nodeid="b87d26dfbdbdd0f2e7bd3007" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#e68782"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-221.018,95.6716)"
//     fill="#e68782"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -175.8593 0 -104.3025 95.6716 -221.008 95.6716"
//     stroke="#e68782"
//   />
// </g>
// <g data-nodeid="c82c83145050aab668cd270b" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#7aa3e5"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-235.2445,48.773)"
//     fill="#7aa3e5"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -182.066 0 -125.4854 48.773 -235.2345 48.773"
//     stroke="#7aa3e5"
//   />
// </g>
// <g data-nodeid="b39492c540ad06bc78cb6540" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#67d7c4"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-235.2445,-48.773)"
//     fill="#67d7c4"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -182.066 0 -125.4854 -48.773 -235.2345 -48.773"
//     stroke="#67d7c4"
//   />
// </g>
// <g data-nodeid="fa7323a5a45cc0d4ec3fdf28" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#9ed56b"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-197.9154,-138.8937)"
//     fill="#9ed56b"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -163.1452 0 -79.7846 -138.8937 -197.9054 -138.8937"
//     stroke="#9ed56b"
//   />
// </g>
// <g data-nodeid="f1235c15307b534671094880" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#ebd95f"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.445 -0.1 -4.445 -6.7396 0 -0.1 4.445 0.2 4.445"
//     transform="translate(-197.9154,138.8937)"
//     fill="#ebd95f"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -163.1452 0 -79.7846 138.8937 -197.9054 138.8937"
//     stroke="#ebd95f"
//   />
// </g>
// <g data-nodeid="b53b634e6b5bef33b24aa9f0" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#e096e9"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.4450 -0.1 -4.4450 -6.7396 0 -0.1 4.4450 0.2 4.4450"
//     transform="translate(-166.8245,-176.7782)"
//     fill="#e096e9"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -144.4124 0 -52.8738 -176.7782 -166.8145 -176.7782"
//     stroke="#e096e9"
//   />
// </g>
// <g data-nodeid="10dd44d5a09fcbed91023ee3" className="node-connection" transform="translate(0, 0)">
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(-39.0357,0) scale(-1, 1)"
//     fill="#988ee3"
//     stroke="none"
//   />
//   <path
//     d="M 0.2 -4.4450 -0.1 -4.4450 -6.7396 0 -0.1 4.4450 0.2 4.4450"
//     transform="translate(-221.0180,-95.6716)"
//     fill="#988ee3"
//     stroke="none"
//     opacity="1"
//   />
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M -45 0 C -175.8593 0 -104.3025 -95.6716 -221.0080 -95.6716"
//     stroke="#988ee3"
//   />
// </g>




































































// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);
//   const prevCoords = useRef({ sourceX, sourceY, targetX, targetY });
  

//   useEffect(() => {
//     if (
//       prevCoords.current.sourceX === sourceX &&
//       prevCoords.current.sourceY === sourceY &&
//       prevCoords.current.targetX === targetX &&
//       prevCoords.current.targetY === targetY
//     ) {
//       return;
//     }

//     prevCoords.current = { sourceX, sourceY, targetX, targetY };

//     if (pathRef.current) {
//       const path = d3.select(pathRef.current);
//       path
//         // .attr("stroke-dasharray", "10, 8")
//         .attr("stroke-dashoffset", "18")
//         .transition()
//         .duration(1500)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", "0")
//         .on("end", function repeat() {
//           d3.select(this)
//             .attr("stroke-dashoffset", "18")
//             .transition()
//             .duration(1500)
//             .ease(d3.easeLinear)
//             .attr("stroke-dashoffset", "0")
//             .on("end", repeat);
//         });
//     }
//   }, [sourceX, sourceY, targetX, targetY]);

//   const controlX1 = sourceX + (targetX - sourceX) * 0.3;
//   const controlY1 = sourceY;
//   const controlX2 = sourceX + (targetX - sourceX) * 0.7;
//   const controlY2 = targetY;
//   const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;

//   return (
//     <g className="custom-d3-edge">
//       <motion.path
//         ref={pathRef}
//         d={edgePath}
//         fill="none"
//         stroke={data?.color || "#ebd95f"}
//         strokeWidth={data?.strokeWidth || 6}
//         strokeLinecap="round"
//       />



//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX},${targetY}) rotate(${Math.atan2(
//           targetY - sourceY,
//           targetX - sourceX
//         ) * (180 / Math.PI)})`}
//         fill="#ebd95f"
//         stroke="none"
//         opacity="1"
//       />
//     </g>
//   );
// };

// export default CustomEdge;











// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";
// import { edgeColors } from "./MindMapSlice/Reusable/EdgeUtlis";

// const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
//   console.log('direction :>> ', data);

//   const pathRef = useRef(null);
//   const prevCoords = useRef({ sourceX, sourceY, targetX, targetY });

//   const getStoredColor = () => {
//     const storedColors = JSON.parse(localStorage.getItem("EdgeColors")) || {};
//     if (storedColors[id]) return storedColors[id];
//     const newColor = edgeColors[Math.floor(Math.random() * edgeColors.length)];
//     storedColors[id] = newColor;
//     localStorage.setItem("EdgeColors", JSON.stringify(storedColors));
//     return newColor;
//   };

//   const strokeColor = getStoredColor();

//   return (
//     <>
//       {
//         data?.direction === 'top' ? (
//           <svg width="100%" height="100%" viewBox="0 0 200 300">
//             <g data-nodeid="598fdddac40a8881f36f81b4" className="node-connection" transform="translate(0, 0)">
//               <path
//                 d="M -4.595 0 0 -6.9643 4.595 0 4.595 -6.9643 -4.595 -6.9643 z"
//                 transform="translate(0,-19.0357)"
//                 fill={strokeColor}
//                 stroke="none"
//               />

//               <path
//                 d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450 "
//                 transform="translate(-8.9743,-269.2915)"
//                 fill={strokeColor}
//                 stroke="none"
//               />

//               <path
//                 fill="none"
//                 strokeLinejoin="round"
//                 strokeWidth="9.19"
//                 d="M 0 -25 C 0 -102.7696 -86.7339 -269.2915 -8.9643 -269.2915"
//                 stroke={strokeColor}
//               />
//             </g>
//           </svg>
//         ) : (
//           data?.direction === 'bottom' ? (
//             <svg width="100%" height="100%" viewBox="0 0 200 300">
//               <g data-nodeid="e31c3e6503fa15103a111703" className="node-connection" transform="translate(0, 0)">
//                 <path
//                   d="M -4.595 0 0 6.9643 4.595 0 4.595 6.9643 -4.595 6.9643 z"
//                   transform="translate(0,19.0357)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />

//                 <path
//                   d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450 "
//                   transform="translate(-8.9743,269.0818)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />

//                 <path
//                   fill="none"
//                   strokeLinejoin="round"
//                   strokeWidth="9.19"
//                   d="M 0 25 C 0 102.7067 -86.6710 269.0818 -8.9643 269.0818"
//                   stroke={strokeColor}
//                 />
//               </g>
//             </svg>
//           ) : (
//             data?.direction === 'left' ? (
//               <g
//               //  data-nodeid={nodeId}
//                className="node-connection" transform="translate(0, 0)">
//                 <path
//                   d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//                   transform="translate(-39.0357,0) scale(-1, 1)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />
//                 <path
//                   d="M 0.2 -4.4450 -0.1 -4.4450 -6.7396 0 -0.1 4.4450 0.2 4.4450 "
//                   transform="translate(-258.9158,0.0000)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />
//                 <path
//                   fill="none"
//                   strokeLinejoin="round"
//                   strokeWidth="9.19"
//                   d="M -45 0 C -194.7341 0 -151.9529 0.0000 -258.9058 0.0000 "
//                   stroke={strokeColor}
//                 />
//               </g>

//             ) : (
//               <g
//               //  data-nodeid={nodeId} 
//               className="node-connection" transform="translate(0, 0)">
//                 <path
//                   d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//                   transform="translate(39.0357,0)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />
//                 <path
//                   d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//                   transform="translate(259.1081,0)"
//                   fill={strokeColor}
//                   stroke="none"
//                 />
//                 <path
//                   fill="none"
//                   strokeLinejoin="round"
//                   strokeWidth="9.19"
//                   d="M 45 0 C 194.8827 0 152.0590 0 259.1181 0"
//                   stroke={strokeColor}
//                 />
//               </g>)
//           )

//         )}
//     </>
//   );
// };

// export default CustomEdge;






















{/* <g className="custom-d3-edge">
      <motion.path
        ref={pathRef}
        d={edgePath}
        fill="none"
        stroke={data?.color || "#ebd95f"}
        strokeWidth={data?.strokeWidth || 4}
        strokeLinecap="round"
      />

      <circle cx={sourceX} cy={sourceY} r="4" fill={data?.color || "#ebd95f"} />

      <path
        d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
        transform={`translate(${targetX},${targetY}) rotate(${Math.atan2(
          targetY - sourceY,
          targetX - sourceX
        ) * (180 / Math.PI)})`}
        fill={ data?.color || "#ebd95f"}
        stroke="none"
        opacity="1"
      />
    </g> */}


// useEffect(() => {
//   if (
//     prevCoords.current.sourceX === sourceX &&
//     prevCoords.current.sourceY === sourceY &&
//     prevCoords.current.targetX === targetX &&
//     prevCoords.current.targetY === targetY
//   ) {
//     return;
//   }

//   prevCoords.current = { sourceX, sourceY, targetX, targetY };

//   if (pathRef.current) {
//     const path = d3.select(pathRef.current);
//     path
//       .transition()
//       .duration(1500)
//       .ease(d3.easeLinear)
//       .attr("stroke-dashoffset", "0")
//       .on("end", function repeat() {
//         d3.select(this)
//           .transition()
//           .duration(1500)
//           .ease(d3.easeLinear)
//           .attr("stroke-dashoffset", "0")
//           .on("end", repeat);
//       });
//   }
// }, [sourceX, sourceY, targetX, targetY]);

// const controlX1 = sourceX + (targetX - sourceX) * 0.3;
// const controlY1 = sourceY;
// const controlX2 = sourceX + (targetX - sourceX) * 0.7;
// const controlY2 = targetY;
// const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;









{/* <path
d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
transform={`translate(${sourceX },${sourceY }) rotate(${Math.atan2(
  targetY - sourceY,
  targetX - sourceX
) * (180 / Math.PI)})`}
fill="#ebd95f"
stroke="none"
/> */}





// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);

//   useEffect(() => {
//     if (pathRef.current) {
//       const path = d3.select(pathRef.current);
//       path
//         .attr("stroke-dasharray", "10, 8")
//         .attr("stroke-dashoffset", "18")
//         .transition()
//         .duration(1500)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", "0")
//         .on("end", function repeat() {
//           d3.select(this)
//             .attr("stroke-dashoffset", "18")
//             .transition()
//             .duration(1500)
//             .ease(d3.easeLinear)
//             .attr("stroke-dashoffset", "0")
//             .on("end", repeat);
//         });
//     }
//   }, [sourceX, sourceY, targetX, targetY]);

//   // Calculate control points for a smooth Bezier curve
//   const controlX1 = sourceX + (targetX - sourceX) * 0.3;
//   const controlY1 = sourceY;
//   const controlX2 = sourceX + (targetX - sourceX) * 0.7;
//   const controlY2 = targetY;

//   const edgePath = `M ${sourceX},${sourceY} C ${controlX1},${controlY1} ${controlX2},${controlY2} ${targetX},${targetY}`;

//   return (
//     <g className="custom-d3-edge">
//       {/* Edge Path */}
//       <motion.path
//         ref={pathRef}
//         d={edgePath}
//         fill="none"
//         stroke={data?.color || "#ebd95f"}
//         strokeWidth={data?.strokeWidth || 6}
//         strokeLinecap="round"
//       />

//       {/* Arrow at start */}
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform={`translate(${sourceX},${sourceY})`}
//         fill="#ebd95f"
//         stroke="none"
//       />

// <path
//   d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//   transform={`translate(${targetX},${targetY}) rotate(${Math.atan2(
//     targetY - sourceY,
//     targetX - sourceX
//   ) * (180 / Math.PI)})`}
//   fill="#ebd95f"
//   stroke="none"
//   opacity="1"
// />


//     </g>
//   );
// };

// export default CustomEdge;







// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);

//   useEffect(() => {
//     if (pathRef.current) {
//       const path = d3.select(pathRef.current);

//       path
//         .attr("stroke-dasharray", "10, 8")
//         .attr("stroke-dashoffset", "18")
//         .transition()
//         .duration(1500)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", "0")
//         .on("end", function repeat() {
//           d3.select(this)
//             .attr("stroke-dashoffset", "18")
//             .transition()
//             .duration(1500)
//             .ease(d3.easeLinear)
//             .attr("stroke-dashoffset", "0")
//             .on("end", repeat);
//         });
//     }
//   }, [sourceX, sourceY, targetX, targetY]);

//   const dx = targetX - sourceX;
//   const dy = targetY - sourceY;
//   const isVertical = Math.abs(dy) > Math.abs(dx);

//   let edgePath;
//   const lineGenerator = d3.line().curve(d3.curveBasis);

//   if (isVertical) {
//     edgePath = lineGenerator([
//       [sourceX, sourceY],
//       [sourceX, (sourceY + targetY) / 2],
//       [targetX, (sourceY + targetY) / 2],
//       [targetX, targetY],
//     ]);
//   } else {
//     edgePath = lineGenerator([
//       [sourceX, sourceY],
//       [(sourceX + targetX) / 2, sourceY],
//       [(sourceX + targetX) / 2, targetY],
//       [targetX, targetY],
//     ]);
//   }

//   return (

//     <g className="custom-d3-edge">
//       <motion.path
//         ref={pathRef}
//         d={edgePath}
//         fill="none"
//         stroke={data?.color || "#efa670"}
//         strokeWidth={data?.strokeWidth || 4}
//         strokeLinecap="round"
//       />
//     </g>
//   );
// };

// export default CustomEdge;










// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion";
// import * as d3 from "d3";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const pathRef = useRef(null);

//   useEffect(() => {
//     if (pathRef.current) {
//       const path = d3.select(pathRef.current);

//       path
//         .attr("stroke-dasharray", "10, 8")
//         .attr("stroke-dashoffset", "18")
//         .transition()
//         .duration(1500)
//         .ease(d3.easeLinear)
//         .attr("stroke-dashoffset", "0")
//         .on("end", function repeat() {
//           d3.select(this)
//             .attr("stroke-dashoffset", "18")
//             .transition()
//             .duration(1500)
//             .ease(d3.easeLinear)
//             .attr("stroke-dashoffset", "0")
//             .on("end", repeat);
//         });
//     }
//   }, [sourceX, sourceY, targetX, targetY]);

//   const lineGenerator = d3.line().curve(d3.curveBasis); 
//   const edgePath = lineGenerator([
//     [sourceX, sourceY],
//     [(sourceX + targetX) / 2, sourceY], 
//     [(sourceX + targetX) / 2, targetY], 
//     [targetX, targetY],
//   ]);

//   return (
//     <g className="custom-d3-edge">
//       <motion.path
//         ref={pathRef}
//         d={edgePath}
//         fill="none"
//         stroke={data?.color || "#efa670"}
//         strokeWidth={data?.strokeWidth || 6}
//         strokeLinecap="round"
//       />
//     </g>

//   );
// };

// export default CustomEdge;










// import { motion } from "framer-motion";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {

//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 6;
//   const dashArray = "10, 8"; 
//   const animationSpeed = 1.5;

//   const controlOffset = 40; 
//   const controlX1 = sourceX + (targetX - sourceX) / 2 + controlOffset;
//   const controlY1 = sourceY;
//   const controlX2 = targetX - (targetX - sourceX) / 2 - controlOffset;
//   const controlY2 = targetY;

//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   return (
//     <g className="floating-animated-edge">
//       <motion.path
//         d={edgePath}
//         fill="none"
//         stroke={strokeColor}
//         strokeWidth={strokeWidth}
//         strokeDasharray={dashArray}
//         strokeLinecap="round"
//         animate={{ strokeDashoffset: [0, 18] }}
//         transition={{ repeat: Infinity, duration: animationSpeed, ease: "linear" }}
//       />
//     </g>
//   );
// };

// export default CustomEdge;











// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const shortenedFactor = 0.85;
//   const lengthReduction = 4;
//   const curveFactor = 0.4; 

//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 6;

//   const adjustedSourceX = sourceX;
//   const adjustedSourceY = sourceY + Math.sign(targetY - sourceY) * lengthReduction;
//   const adjustedTargetX = sourceX + (targetX - sourceX) * shortenedFactor;
//   const adjustedTargetY = targetY - Math.sign(targetY - sourceY) * lengthReduction;

//   const controlX1 = adjustedSourceX + (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY1 = adjustedSourceY + (adjustedTargetY - adjustedSourceY) * curveFactor;
//   const controlX2 = adjustedTargetX - (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY2 = adjustedTargetY - (adjustedTargetY - adjustedSourceY) * curveFactor;

//   const edgePath = `M ${adjustedSourceX} ${adjustedSourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedTargetX} ${adjustedTargetY}`;

//   const angleTarget = Math.atan2(adjustedTargetY - controlY2, adjustedTargetX - controlX2) * (180 / Math.PI);

//   return (
//     <g className="node-connection">
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//       <path
//         d="M -0.2 -4 0.1 -4 6.5 0 0.1 4 -0.2 4"
//         transform={`translate(${adjustedTargetX},${adjustedTargetY}) rotate(${angleTarget})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />
      
//     </g>
//   );
// };

// export default CustomEdge;







// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const shortenedFactor = 0.9;
//   const lengthReduction = 2;

//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 6;
//   const curveFactor = 0.3;

//   const adjustedSourceX = sourceX;
//   const adjustedSourceY = sourceY + Math.sign(targetY - sourceY) * lengthReduction;
//   const adjustedTargetX = sourceX + (targetX - sourceX) * shortenedFactor;
//   const adjustedTargetY = targetY - Math.sign(targetY - sourceY) * lengthReduction;

//   const controlX1 = adjustedSourceX + (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY1 = adjustedSourceY;
//   const controlX2 = adjustedTargetX - (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY2 = adjustedTargetY;

//   const edgePath = `M ${adjustedSourceX} ${adjustedSourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedTargetX} ${adjustedTargetY}`;

//   const angleSource = Math.atan2(adjustedTargetY - adjustedSourceY, adjustedTargetX - adjustedSourceX) * (180 / Math.PI);
//   const angleTarget = Math.atan2(adjustedTargetY - controlY2, adjustedTargetX - controlX2) * (180 / Math.PI);

//   return (
//     <g className="node-connection">
//       {/* <path
//         d="M 0 -4 6 0 0 4 6 4 6 -4 z"
//         transform={`translate(${adjustedSourceX -5},${adjustedSourceY -1 }) rotate(${angleSource + 350})`}
//         fill={strokeColor}
//         stroke="none"
//       /> */}

//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />

//       <path
//         d="M -0.2 -4 0.1 -4 6.5 0 0.1 4 -0.2 4"
//         transform={`translate(${adjustedTargetX},${adjustedTargetY}) rotate(${angleTarget })`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />
//     </g>
//   );
// };

// export default CustomEdge;









// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const shortenedFactor = 0.9;
//   const lengthReduction = 2;

//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 6;
//   const curveFactor = 0.3;

//   // Adjust source & target positions to shorten edge length
//   const adjustedSourceX = sourceX;
//   const adjustedSourceY = sourceY + Math.sign(targetY - sourceY) * lengthReduction;
//   const adjustedTargetX = sourceX + (targetX - sourceX) * shortenedFactor;
//   const adjustedTargetY = targetY - Math.sign(targetY - sourceY) * lengthReduction;

//   // Control points for smooth curve
//   const controlX1 = adjustedSourceX + (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY1 = adjustedSourceY;
//   const controlX2 = adjustedTargetX - (adjustedTargetX - adjustedSourceX) * curveFactor;
//   const controlY2 = adjustedTargetY;

//   // Edge path for smooth curve
//   const edgePath = `M ${adjustedSourceX} ${adjustedSourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedTargetX} ${adjustedTargetY}`;

//   // **Dynamically calculate angle for proper arrow rotation**
//   const angleSource = Math.atan2(controlY1 - adjustedSourceY, controlX1 - adjustedSourceX) * (180 / Math.PI);
//   const angleTarget = Math.atan2(adjustedTargetY - controlY2, adjustedTargetX - controlX2) * (180 / Math.PI);

//   return (
//     <g className="node-connection">
//       {/* Source Arrowhead (Dynamically Rotates & Moves) */}
//       <path
//         d="M 0 -4 6 0 0 4 6 4 6 -4 z"
//         transform={`translate(${adjustedSourceX},${adjustedSourceY}) rotate(${angleSource})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Main Edge Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />

//       {/* Target Arrowhead (Dynamically Rotates & Moves) */}
//       <path
//         d="M -0.2 -4 0.1 -4 6.5 0 0.1 4 -0.2 4"
//         transform={`translate(${adjustedTargetX},${adjustedTargetY}) rotate(${angleTarget})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />
//     </g>
//   );
// };

// export default CustomEdge;









// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const shortenedFactor = 0.9;
//   const lengthReduction = 2;
  
//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 6;
//   const curveFactor = 0.3;

//   const adjustedSourceY = sourceY + Math.sign(targetY - sourceY) * lengthReduction;
//   const adjustedTargetY = targetY - Math.sign(targetY - sourceY) * lengthReduction;

//   const adjustedTargetX = sourceX + (targetX - sourceX) * shortenedFactor;

//   const controlX1 = sourceX + (adjustedTargetX - sourceX) * curveFactor;
//   const controlY1 = adjustedSourceY;
//   const controlX2 = adjustedTargetX - (adjustedTargetX - sourceX) * curveFactor;
//   const controlY2 = adjustedTargetY;

//   const angleSource = Math.atan2(controlY1 - adjustedSourceY, controlX1 - sourceX) * (180 / Math.PI);
//   const angleTarget = Math.atan2(adjustedTargetY - controlY2, targetX - controlX2) * (180 / Math.PI);

//   const edgePath = `M ${sourceX} ${adjustedSourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${adjustedTargetX} ${adjustedTargetY}`;

//   return (
//     <g className="node-connection">
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform={`translate(${sourceX},${adjustedSourceY + 7}) rotate(${angleSource - 90})`}
//         fill={strokeColor}
//         stroke="none"
//       />
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX},${adjustedTargetY + 2}) rotate(${angleTarget - 90})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />
//     </g>
//   );
// };

// export default CustomEdge;












// Live
// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data, }) => {
//   const strokeColor = data?.color || "#efa670";
//   const strokeWidth = data?.strokeWidth || 8; 
//   const curveFactor = 0.3; 

//   const controlX1 = sourceX + (targetX - sourceX) * curveFactor;
//   const controlY1 = sourceY;
//   const controlX2 = targetX - (targetX - sourceX) * curveFactor;
//   const controlY2 = targetY;

//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   const angleSource = Math.atan2(controlY1 - sourceY, controlX1 - sourceX) * (180 / Math.PI);
//   const angleTarget = Math.atan2(targetY - controlY2, targetX - controlX2) * (180 / Math.PI);

//   return (
//     <g className="node-connection">
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform={`translate(${sourceX},${sourceY}) rotate(${angleSource})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />

//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX},${targetY}) rotate(${angleTarget})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />
//     </g>
//   );
// };

// export default CustomEdge;













// import React from "react";
// import { getBezierPath, getSimpleBezierPath } from "@xyflow/react";

// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
// }) => {
//   const trimLength = 5; // Reduce edge length by 5px on both ends

//   // Compute the angle of the edge (initial straight angle)
//   const angle = Math.atan2(targetY - sourceY, targetX - sourceX);

//   // Adjust source and target positions to shorten the edge
//   const newSourceX = sourceX + trimLength * Math.cos(angle);
//   const newSourceY = sourceY + trimLength * Math.sin(angle);
//   const newTargetX = targetX - trimLength * Math.cos(angle);
//   const newTargetY = targetY - trimLength * Math.sin(angle);

//   // Get the updated bezier path and curve points
//   const [edgePath, labelX, labelY, targetX1, targetY1] = getBezierPath({
//     sourceX: newSourceX,
//     sourceY: newSourceY,
//     targetX: newTargetX,
//     targetY: newTargetY,
//     sourcePosition,
//     targetPosition,
//   });

//   // Calculate tangent angle at the target point (curve-following angle)
//   const curveAngle = Math.atan2(newTargetY - targetY1, newTargetX - targetX1);

//   // Arrowhead adjustments based on curve
//   const arrowSize = 8;
//   const arrowOffsetX = 2; // Move right
//   const arrowOffsetY = -5; // Move up
//   const arrowX = newTargetX + arrowOffsetX;
//   const arrowY = newTargetY + arrowOffsetY;

//   return (
//     <g>
//       {/* Curved Edge Path */}
//       <path d={edgePath} fill="none" stroke="#8BC34A" strokeWidth={6} />

//       {/* Middle Circle */}
//       <circle cx={labelX} cy={labelY} r="5" fill="white" stroke="#8BC34A" strokeWidth={2} />

//       {/* Arrowhead Following the Curve */}
//       <polygon
//         points={`
//           ${arrowX},${arrowY}
//           ${arrowX - arrowSize * Math.cos(curveAngle - Math.PI / 6)},${arrowY - arrowSize * Math.sin(curveAngle - Math.PI / 6)}
//           ${arrowX - arrowSize * Math.cos(curveAngle + Math.PI / 6)},${arrowY - arrowSize * Math.sin(curveAngle + Math.PI / 6)}
//         `}
//         fill="#8BC34A"
//       />
//     </g>
//   );
// };

// export default CustomEdge;












// import React from "react";
// import { getBezierPath } from "@xyflow/react";

// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
// }) => {
//   // Get edge path using bezier curve
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition,
//     targetPosition,
//   });

//   // Arrowhead adjustments
//   const arrowSize = 10;
//   const arrowOffsetY = 18; // Move arrow 10px upwards
//   const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
//   const arrowX = targetX - Math.cos(angle) * arrowSize;
//   const arrowY = targetY - Math.sin(angle) * arrowSize - arrowOffsetY; // Move upwards

//   return (
//     <g>
//       {/* Main Line */}
//       <path d={edgePath} fill="none" stroke="#8BC34A" strokeWidth={6} />

//       {/* Middle Circle */}
//       <circle cx={labelX} cy={labelY} r="5" fill="white" stroke="#8BC34A" strokeWidth={2} />

//       {/* Arrowhead (Moved Upwards) */}
//       <polygon
//         points={`
//           ${arrowX},${arrowY}
//           ${arrowX - 10 * Math.cos(angle - Math.PI / 6)},${arrowY - 10 * Math.sin(angle - Math.PI / 6)}
//           ${arrowX - 10 * Math.cos(angle + Math.PI / 6)},${arrowY - 10 * Math.sin(angle + Math.PI / 6)}
//         `}
//         fill="#8BC34A"
//       />
//     </g>
//   );
// };

// export default CustomEdge;










// import React from "react";
// import { getBezierPath } from "@xyflow/react";

// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
// }) => {
//   // Get edge path using bezier curve
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition,
//     targetPosition,
//   });

//   // Calculate arrowhead position (Now at the target end)
//   const arrowSize = 10;
//   const angle = Math.atan2(targetY - sourceY, targetX - sourceX);
//   const arrowX = targetX - Math.cos(angle) * arrowSize; // Adjust to target
//   const arrowY = targetY - Math.sin(angle) * arrowSize;

//   return (
//     <g>
//       {/* Main Line */}
//       <path d={edgePath} fill="none" stroke="#8BC34A" strokeWidth={6} />

//       {/* Middle Circle */}
//       <circle cx={labelX} cy={labelY} r="5" fill="white" stroke="#8BC34A" strokeWidth={2} />

//       {/* Arrowhead (Now correctly at target end) */}
//       <polygon
//         points={`
//           ${arrowX},${arrowY}
//           ${arrowX - 10 * Math.cos(angle - Math.PI / 6)},${arrowY - 10 * Math.sin(angle - Math.PI / 6)}
//           ${arrowX - 10 * Math.cos(angle + Math.PI / 6)},${arrowY - 10 * Math.sin(angle + Math.PI / 6)}
//         `}
//         fill="#8BC34A"
//       />
//     </g>
//   );
// };

// export default CustomEdge;















// import React from "react";

// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, data }) => {
//   const strokeColor = data?.color || "#8B75D7"; // Matching your reference color
//   const strokeWidth = data?.strokeWidth || 8;
//   const curveFactor = 0.4; // Adjusted for smoother curves

//   const controlX1 = sourceX + (targetX - sourceX) * curveFactor;
//   const controlY1 = sourceY + (targetY - sourceY) * curveFactor;
//   const controlX2 = targetX - (targetX - sourceX) * curveFactor;
//   const controlY2 = targetY - (targetY - sourceY) * curveFactor;

//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   // Compute angle for the target arrow
//   const angleTarget = Math.atan2(targetY - controlY2, targetX - controlX2) * (180 / Math.PI);

//   return (
//     <g className="node-connection">
//       {/* Edge Path */}
//       <path
//         d={edgePath}
//         fill="none"
//         stroke={strokeColor}
//         strokeWidth={strokeWidth}
//         strokeLinecap="round"
//       />

//       {/* Target Arrow (Only at Child Side) */}
//       <polygon
//         points="0,-6 12,0 0,6"
//         transform={`translate(${targetX},${targetY}) rotate(${angleTarget})`}
//         fill={strokeColor}
//       />
//     </g>
//   );
// };

// export default CustomEdge;

















// Top node connection
// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, strokeColor = "#e68782", strokeWidth = 9.19 }) => {
//   // Calculate control points for curved path
//   const curveFactor = 0.5;
//   const controlX1 = sourceX + (targetX - sourceX) * curveFactor;
//   const controlY1 = sourceY;
//   const controlX2 = targetX - (targetX - sourceX) * curveFactor;
//   const controlY2 = targetY;

//   // Edge path for smooth curve
//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   return (
//     <g className="node-connection">
//       {/* Source Arrow */}
//       <path
//         d="M -4.595 0 0 -6.9643 4.595 0 4.595 -6.9643 -4.595 -6.9643 z"
//         transform={`translate(${sourceX},${sourceY - 14.0357})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Target Arrow */}
//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX - 8.9743},${targetY - 119.7514})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />

//       {/* Curved Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//     </g>
//   );
// };

// export default CustomEdge;

// Bottom node connection
// const CustomEdge = ({ sourceX, sourceY, targetX, targetY, strokeColor = "#efa670", strokeWidth = 9.19 }) => {
//   // Calculate control points for curved path
//   const curveFactor = 0.5;
//   const controlX1 = sourceX;
//   const controlY1 = sourceY + (targetY - sourceY) * curveFactor;
//   const controlX2 = targetX;
//   const controlY2 = targetY - (targetY - sourceY) * curveFactor;

//   // Edge path for smooth curve
//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   return (
//     <g className="node-connection">
//       {/* Source Arrow */}
//       <path
//         d="M -4.595 0 0 6.9643 4.595 0 4.595 6.9643 -4.595 6.9643 z"
//         transform={`translate(${sourceX},${sourceY + 14.0357})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Target Arrow */}
//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX - 8.9743},${targetY + 119.75})`}
//         fill={strokeColor}
//         stroke="none"
//         opacity="1"
//       />

//       {/* Curved Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//     </g>
//   );
// };

// export default CustomEdge;

// right node connection
// const CustomEdge = ({ sourceX = 36.0357, sourceY = 0, targetX = 97.5257, targetY = 0, strokeColor = "#9ed56b", strokeWidth = 9.19 }) => {
//   // Edge path for a smooth straight connection
//   const edgePath = `M 42 0 C 79.3416 0 70.8632 0 ${targetX} ${targetY}`;

//   return (
//     <g className="node-connection">
//       {/* Source Arrow */}
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform={`translate(${sourceX},${sourceY})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Target Arrow */}
//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform={`translate(${targetX},${targetY})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Edge Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//     </g>
//   );
// };

// export default CustomEdge;

// left node connection
// const CustomEdge = ({ sourceX = -36.0357, sourceY = 0, targetX = -85.01, targetY = 0, strokeColor = "#ebd95f", strokeWidth = 9.19 }) => {
//   // Edge path for a smooth left-direction connection
//   const edgePath = `M -42 0 C -69.0135 0 -65.7046 0 ${targetX} ${targetY}`;

//   return (
//     <g className="node-connection">
//       {/* Source Arrow (Flipped for Left Direction) */}
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform={`translate(${sourceX},${sourceY}) scale(-1,1)`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Target Arrow */}
//       <path
//         d="M 0.2 -4.4450 -0.1 -4.4450 -6.7396 0 -0.1 4.4450 0.2 4.4450"
//         transform={`translate(${targetX},${targetY})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Edge Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />
//     </g>
//   );
// };

// export default CustomEdge;































// const CustomEdge = () => {
//   return (
//     <g data-nodeid="519abf0b052f1d3dce2a9995" className="node-connection" transform="translate(0, 0)">
//       {/* Source Arrow */}
//       <path
//         d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//         transform="translate(36.0357,0)"
//         fill="#efa670"
//         stroke="none"
//       />

//       {/* Target Arrow */}
//       <path
//         d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//         transform="translate(66.0398,76.0138)"
//         fill="#efa670"
//         stroke="none"
//         opacity="1"
//       />

//       {/* Curved Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth="9.19"
//         d="M 42 0 C 64.9160 0 31.2207 76.0138 66.0498 76.0138"
//         stroke="#efa670"
//       />
//     </g>
//   );
// };

// export default CustomEdge;










// const CustomEdge = ({
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   strokeColor = "#9ed56b",
//   strokeWidth = 8,
//   curveFactor = 0.5, // Adjusts the curvature of the path
//   arrowSize = 6, // Size of arrowheads
// }) => {
//   // Calculate control points for a smooth curved path
//   const controlX1 = sourceX + (targetX - sourceX) * curveFactor;
//   const controlY1 = sourceY;
//   const controlX2 = targetX - (targetX - sourceX) * curveFactor;
//   const controlY2 = targetY;

//   // Path for connection with smooth curve
//   const edgePath = `M ${sourceX} ${sourceY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${targetX} ${targetY}`;

//   // Calculate angle for the arrows
//   const angleSource = Math.atan2(controlY1 - sourceY, controlX1 - sourceX) * (180 / Math.PI);
//   const angleTarget = Math.atan2(targetY - controlY2, targetX - controlX2) * (180 / Math.PI);

//   // Offsets for better arrow alignment
//   const arrowOffset = arrowSize * 1.5; // Adjust arrow positioning
//   const offsetSourceX = sourceX - Math.cos(angleSource * (Math.PI / 180)) * arrowOffset;
//   const offsetSourceY = sourceY - Math.sin(angleSource * (Math.PI / 180)) * arrowOffset;
//   const offsetTargetX = targetX - Math.cos(angleTarget * (Math.PI / 180)) * arrowOffset;
//   const offsetTargetY = targetY - Math.sin(angleTarget * (Math.PI / 180)) * arrowOffset;

//   return (
//     <g className="node-connection">
//       {/* Source Arrow */}
//       <path
//         d={`M 0 -${arrowSize} ${arrowSize} 0 0 ${arrowSize} ${arrowSize} ${arrowSize} ${arrowSize} -${arrowSize} z`}
//         transform={`translate(${offsetSourceX},${offsetSourceY}) rotate(${angleSource})`}
//         fill={strokeColor}
//         stroke="none"
//       />

//       {/* Main Path */}
//       <path
//         fill="none"
//         strokeLinejoin="round"
//         strokeWidth={strokeWidth}
//         d={edgePath}
//         stroke={strokeColor}
//       />

//       {/* Target Arrow */}
//       <path
//         d={`M -${arrowSize} -${arrowSize} 0 0 -${arrowSize} ${arrowSize} ${arrowSize} ${arrowSize} ${arrowSize} -${arrowSize} z`}
//         transform={`translate(${offsetTargetX},${offsetTargetY}) rotate(${angleTarget})`}
//         fill={strokeColor}
//         stroke="none"
//       />
//     </g>
//   );
// };

// export default CustomEdge;










// import React from "react";
// import { BaseEdge, getBezierPath } from "@xyflow/react";

// const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
//   const color = data?.color || "#9ed56b";

//   const [edgePath] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//   });

//   return (
// <g data-nodeid="0a3d40c000212f013e00077e" className="node-connection" transform="translate(0, 0)">
//   {/* Source Arrow */}
//   <path
//     d="M 0 -4.595 6.9643 0 0 4.595 6.9643 4.595 6.9643 -4.595 z"
//     transform="translate(36.0357,0)"
//     fill="#9ed56b"
//     stroke="none"
//   />
  
//   {/* Target Arrow */}
//   <path
//     d="M -0.2 -4.4450 0.1 -4.4450 6.7396 0 0.1 4.4450 -0.2 4.4450"
//     transform="translate(97.5257,0)"
//     fill="#9ed56b"
//     stroke="none"
//   />
  
//   {/* Main Path */}
//   <path
//     fill="none"
//     strokeLinejoin="round"
//     strokeWidth="9.19"
//     d="M 42 0 C 79.3416 0 70.8632 0 97.5357 0"
//     stroke="#9ed56b"
//   />
// </g>




//     // <g data-nodeid={id} className="node-connection">
//     //   <path fill="none" strokeLinejoin="round" strokeWidth="8" d={edgePath} stroke={color} />
//     //   <path d="M 0 -4 6 0 0 4 6 4 6 -4 z" transform={`translate(${sourceX},${sourceY})`} fill={color} stroke="none" />
//     //   <path d="M -0.2 -4 0.1 -4 6 0 0.1 4 -0.2 4" transform={`translate(${targetX},${targetY})`} fill={color} stroke="none" />
//     // </g>
//   );
// };

// export default CustomEdge;










// import React from "react";
// import { BaseEdge, getBezierPath } from "@xyflow/react";

// const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, style }) => {
//   const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

//   const color = style?.stroke || "#9ed56b";

//   return (
//     <g className="custom-edge">
//       <BaseEdge id={id} path={edgePath} style={style} />

//       <g transform={`translate(${targetX},${targetY})`}>
//         <path d="M 0 -4 6 0 0 4 6 4 6 -4 z" fill={color} stroke="none" />
//         <path d="M -0.2 -4 0.1 -4 6 0 0.1 4 -0.2 4" fill={color} stroke="none" />
//         <path fill="none" strokeLinejoin="round" strokeWidth="8" d={edgePath} stroke={color} />
//       </g>
//     </g>
//   );
// };

// export default CustomEdge;
