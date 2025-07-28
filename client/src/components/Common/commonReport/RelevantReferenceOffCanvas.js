import React from 'react';
import {
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Alert,
  Row,
} from 'reactstrap';
import DraggableTable from './DraggableTable';

const RelevantReferenceOffCanvas = ({ isOpen, toggle, data, columns, setTableData, handleUpdate }) => {
 

  return (
    <Offcanvas
      isOpen={isOpen}
      toggle={toggle}
      direction="start"
      className="w-100"
      style={{ maxWidth: '60vw' }}
    >
      <OffcanvasHeader toggle={toggle} className="bg-secondary text-white p-3">
        Relevant References & Non-Patent Literature
      </OffcanvasHeader>

      <OffcanvasBody>
        <Alert color="info d-flex justify-content-center">
          Reorder to assign roll numbers for <strong>Relevant and NPL References.</strong>
        </Alert>
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Relevant Reference</span>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#fafecf', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>NPL Reference</span>
              <div style={{ width: '12px', height: '12px', backgroundColor: 'antiquewhite', border: '1px solid #ccc' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span>Dragging</span>
              <div style={{ width: '12px', height: '12px', backgroundColor: 'white', border: '1px solid #ccc' }} />
            </div>
          </div>
        </div>



        <div className="overflow-auto mb-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {data && data.length > 0 ? (
            <DraggableTable
              data={data}
              setData={setTableData}
              columns={columns}
            />
          ) : (
            <p>No relevant references or non-patent literature available.</p>
          )}
        </div>

        <div className="d-flex justify-content-end">
          <Button color="success" onClick={handleUpdate}>
            Save Order
          </Button>
        </div>
      </OffcanvasBody>
    </Offcanvas>
  );
};

export default RelevantReferenceOffCanvas;
