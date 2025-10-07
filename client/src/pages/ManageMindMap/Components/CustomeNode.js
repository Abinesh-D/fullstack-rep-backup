import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';

function CustomNode({ data }) {

  const { label, onLabelChange, handleStyles } = data;

  const [mainName, setMainName] = useState(() => {
    const savedName = localStorage.getItem('mainName');
    return savedName ? savedName : '';
  });

  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (mainName) {
      localStorage.setItem('mainName', mainName);
    }
  }, [mainName]);

  const handleChange = (e) => {
    setMainName(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const generateHandleStyle = (position) => {
    if (handleStyles && handleStyles[position]) {
      return handleStyles[position];
    }
    return { backgroundColor: '#f7f7f7', width: 10, height: 10 };
  };
  

  
  return (
    <div>     
      <input
        type="text"
        value={mainName}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder="Main Content..."
        style={{
          width: '100%',
          // padding: 5,
          border: isFocused || mainName ? 'none' : '1px solid #ccc',
        }}
      />

    </div>
  );
}

export default CustomNode;















// import React from 'react';
// import { Handle, Position } from '@xyflow/react';

// function CustomNode({ data }) {
//   const { label, onLabelChange, onAddNode } = data;

//   const handleChange = (e) => {
//     if (onLabelChange) {
//       onLabelChange(e.target.value);
//     }
//   };

//   return (
//     <div
//       style={{
//         padding: 10,
//         border: '1px solid #ddd',
//         borderRadius: 5,
//         backgroundColor: '#fff',
//         position: 'relative',
//       }}
//     >
//       <Handle type="target" position={Position.Top} />
//       <input
//         type="text"
//         value={label}
//         onChange={handleChange}
//         placeholder="Enter label"
//         style={{ width: '100%', padding: 5, marginBottom: 10 }}
//       />
//       <Handle type="source" position={Position.Bottom} />
//       <Handle type='target' position={Position.Right} /> 
//       <Handle type='source' position={Position.Left} /> 
      
//       {onAddNode && (
//         <button
//           onClick={onAddNode}
//           style={{
//             position: 'absolute',
//             top: 0,
//             right: 0,
//             border: 'none',
//             background: 'transparent',
//             cursor: 'pointer',
//           }}
//         >
//           +
//         </button>
//       )}
//     </div>
//   );
// }

// export default CustomNode;












// import React from 'react';
// import { Handle, Position } from '@xyflow/react';

// function CustomNode({ data }) {
//   const { label, onLabelChange } = data;

//   const handleChange = (e) => {
//     if (onLabelChange) {
//       onLabelChange(e.target.value);
//     }
//   };

//   return (
//     <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5, backgroundColor: '#fff' }}>
//       <Handle type="target" position={Position.Top} />
//       <input
//         type="text"
//         value={label}
//         onChange={handleChange}
//         style={{
//           width: '80%',
//           border: 'none',
//           outline: 'none',
//           textAlign: 'center',
//           fontSize: '14px',
//         }}
//       />
//       <Handle type="source" position={Position.Bottom} />
//     </div>
//   );
// }

// export default CustomNode;
