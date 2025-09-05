import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const DraggableTableRow = ({ row, index, children }) => {
  return (
    <Draggable draggableId={row._id.toString()} index={index}>
      {(provided, snapshot) => {
        const isNpl = row.nplId === true;
        const baseColor = isNpl ? 'antiquewhite' : '#fafecf'; 
        const dragColor = 'white'; 

         const currentColor = snapshot.isDragging ? dragColor : baseColor;

        return (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            style={{
              ...provided.draggableProps.style,
            }}
          >
            {React.Children.map(children, (child, colIdx) =>
              React.cloneElement(child, {
                style: {
                  background: currentColor ,
                  ...(child.props.style || {}),
                },
                ...(colIdx === 0 ? { ...provided.dragHandleProps } : {}),
              })
            )}
          </tr>
        );
      }}
    </Draggable>
  );
};

export default DraggableTableRow;















// import React from 'react';
// import { Draggable } from 'react-beautiful-dnd';

// const DraggableTableRow = ({ row, index, children }) => {
//   return (
//     <Draggable draggableId={row._id.toString()} index={index}>
//       {(provided, snapshot) => {
//         const baseColor = row.nplId === true ? '#FFFBEB' : '#EFF6FF';
//         const dragColor = '#F3F4F6';

//         return (
//           <tr
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             style={{
//               ...provided.draggableProps.style,
//             }}
//           >
//             {React.Children.map(children, (child, colIdx) =>
//               React.cloneElement(child, {
//                 style: {
//                   background: snapshot.isDragging ? dragColor : baseColor,
//                   ...(child.props.style || {}),
//                 },
//                 ...(colIdx === 0 ? { ...provided.dragHandleProps } : {}),
//               })
//             )}
//           </tr>
//         );
//       }}
//     </Draggable>
//   );
// };

// export default DraggableTableRow;













// // components/DraggableTableRow.js
// import React from 'react';
// import { Draggable } from 'react-beautiful-dnd';

// const DraggableTableRow = ({ row, index, children }) => {
//   return (
//     <Draggable draggableId={row._id.toString()} index={index}>
//       {(provided, snapshot) => (

//         <tr
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           style={{
//             ...provided.draggableProps.style,
//           }}
//         >
//           {React.Children.map(children, (child, colIdx) =>
//             React.cloneElement(child, {
//               style: {
//                 background: snapshot.isDragging ? '#f0f0f0' : 'white',
//                 ...(child.props.style || {}),
//               },
//               ...(colIdx === 0 ? { ...provided.dragHandleProps } : {}),
//             })
//           )}
//         </tr>
//       )}
//     </Draggable>
//   );
// };

// export default DraggableTableRow;
