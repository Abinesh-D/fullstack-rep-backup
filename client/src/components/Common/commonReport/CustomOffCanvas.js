import React from "react";
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Alert,
} from "reactstrap";
import DraggableTable from "./DraggableTable";

const CustomOffCanvas = ({
  isOpen,
  toggle,
  title = "OffCanvas Title",
  subtitle,
  legendItems = [],
  data = [],
  columns,
  setTableData,
  handleUpdate,
  emptyMessage = "No data available.",
  showSaveButton = true,
  children,
}) => {
  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="start"
      className="w-100"
      style={{ maxWidth: "60vw", height: "100vh", overflow: "hidden" }}
    >
      <OffcanvasHeader toggle={toggle} className="bg-secondary text-white p-3">
        {title}
      </OffcanvasHeader>

      <OffcanvasBody
        style={{
          height: "calc(100vh - 65px)",
          overflowY: "auto",
          scrollBehavior: "smooth",
          padding: "1rem",
        }}
      >
        {subtitle && (
          <Alert color="info" className="d-flex justify-content-center mb-3">
            {subtitle}
          </Alert>
        )}

        {legendItems.length > 0 && (
          <div
            className="mb-4 px-3 py-2 rounded border"
            style={{
              backgroundColor: "#f8f9fa",
              display: "flex",
              gap: "25px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {legendItems.map((item, idx) => (
              <LegendItem key={idx} label={item.label} color={item.color} />
            ))}
          </div>
        )}

        <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 260px)" }}>
          {data && data.length > 0 ? (
            children ? (
              children
            ) : (
              <DraggableTable data={data} setData={setTableData} columns={columns} />
            )
          ) : (
            <p className="text-center text-muted">{emptyMessage}</p>
          )}
        </div>

        {showSaveButton && (
          <div className="d-flex justify-content-end mt-3">
            <Button disabled={data.length === 0} color="success" onClick={handleUpdate}>
              Save Order
            </Button>
          </div>
        )}
      </OffcanvasBody>
    </Offcanvas>
  );
};

const LegendItem = ({ label, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
    <span>{label}</span>
    <div
      style={{
        width: "14px",
        height: "14px",
        backgroundColor: color,
        border: "1px solid #ccc",
        borderRadius: "3px",
      }}
    />
  </div>
);

export default CustomOffCanvas;
















// import React from 'react';
// import {
//   Offcanvas,
//   OffcanvasHeader,
//   OffcanvasBody,
//   Button,
//   Alert,
// } from 'reactstrap';
// import DraggableTable from './DraggableTable';


// const CustomOffCanvas = ({
//   isOpen,
//   toggle,
//   data,
//   columns,
//   setTableData,
//   handleUpdate,
// }) => {
//   return (
//     <Offcanvas
//       isOpen={isOpen}
//       toggle={toggle}
//       direction="start"
//       className="w-100"
//       style={{ maxWidth: '60vw', height: '100vh', overflow: 'hidden' }}
//     >
//       <OffcanvasHeader toggle={toggle} className="bg-secondary text-white p-3">
//         Relevant References & Non-Patent Literature
//       </OffcanvasHeader>

//       <OffcanvasBody
//         style={{
//           height: 'calc(100vh - 65px)',
//           overflowY: 'auto',
//           scrollBehavior: 'smooth',
//           padding: '1rem',
//         }}
//       >
//         <Alert color="info" className="d-flex justify-content-center mb-3">
//           Reorder to assign roll numbers for&nbsp;
//           <strong>Relevant and NPL References.</strong>
//         </Alert>

//         <div className="mb-3">
//           <p className="text-muted text-center" style={{ fontSize: '0.9rem' }}>
//             💡 Move your cursor over the <strong>S. No</strong> and drag it to reorder.
//           </p>
//         </div>

//         <div
//           className="mb-4 px-3 py-2 rounded border"
//           style={{
//             backgroundColor: '#f8f9fa',
//             display: 'flex',
//             gap: '25px',
//             justifyContent: 'center',
//             flexWrap: 'wrap',
//           }}
//         >
//           <LegendItem label="Relevant Reference" color="#fafecf" />
//           <LegendItem label="NPL Reference" color="antiquewhite" />
//           <LegendItem label="Dragging" color="white" />
//         </div>

//         <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 260px)' }}>
//           {data && data.length > 0 ? (
//             <DraggableTable data={data} setData={setTableData} columns={columns} />
//           ) : (
//             <p className="text-center text-muted">No relevant references or non-patent literature available.</p>
//           )}
//         </div>

//         <div className="d-flex justify-content-end mt-3">
//           <Button disabled={data.length === 0} color="success" onClick={handleUpdate}>
//             Save Order
//           </Button>
//         </div>
//       </OffcanvasBody>
//     </Offcanvas>
    
//   );
// };

// const LegendItem = ({ label, color }) => (
//   <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//     <span>{label}</span>
//     <div
//       style={{
//         width: '14px',
//         height: '14px',
//         backgroundColor: color,
//         border: '1px solid #ccc',
//         borderRadius: '3px',
//       }}
//     />
//   </div>
// );

// export default CustomOffCanvas;















// import React from 'react';
// import { Offcanvas, OffcanvasHeader, OffcanvasBody, Button, Alert, } from 'reactstrap';
// import DraggableTable from './DraggableTable';

// const CustomOffCanvas = ({ isOpen, toggle, data, columns, setTableData, handleUpdate }) => {

//   return (
//     <Offcanvas isOpen={isOpen} toggle={toggle} direction="start" className="w-100" style={{ maxWidth: '60vw' }}>
//       <OffcanvasHeader toggle={toggle} className="bg-secondary text-white p-3">
//         Relevant References & Non-Patent Literature
//       </OffcanvasHeader>

//       <OffcanvasBody>
//         <Alert color="info d-flex justify-content-center">
//           Reorder to assign roll numbers for&nbsp;<strong>Relevant and NPL References.</strong>
//         </Alert>
//         <div style={{ marginBottom: '10px' }}>
//           <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//               <span>Relevant Reference</span>
//               <div style={{ width: '12px', height: '12px', backgroundColor: '#fafecf', border: '1px solid #ccc' }} />
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//               <span>NPL Reference</span>
//               <div style={{ width: '12px', height: '12px', backgroundColor: 'antiquewhite', border: '1px solid #ccc' }} />
//             </div>
//             <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
//               <span>Dragging</span>
//               <div style={{ width: '12px', height: '12px', backgroundColor: 'white', border: '1px solid #ccc' }} />
//             </div>
//           </div>
//         </div>

//         <div className="overflow-auto mb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//           {data && data.length > 0 ? (
//             <DraggableTable data={data} setData={setTableData} columns={columns} />
//           ) : (
//             <p>No relevant references or non-patent literature available.</p>
//           )}
//         </div>

//         <div className="d-flex justify-content-end">
//           <Button color="success" onClick={handleUpdate}>
//             Save Order
//           </Button>
//         </div>
//       </OffcanvasBody>
//     </Offcanvas>
//   );
// };

// export default CustomOffCanvas;
