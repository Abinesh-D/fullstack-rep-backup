import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionBody
} from 'reactstrap';
import { useState } from 'react';

const renderValue = (value) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v, i) => (
      <div key={i} style={{ paddingLeft: '1rem' }}>{renderValue(v)}</div>
    ));
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div style={{ paddingLeft: '1rem' }}>
        {value.$?.desc && <em>{value.$.desc}: </em>}
        {value._ ?? Object.entries(value).map(([k, v], i) => (
          <div key={i}><strong>{k}:</strong> {renderValue(v)}</div>
        ))}
      </div>
    );
  }

  return 'N/A';
};

const LegalStatusModal = ({ isOpen, toggle, legalStatusData }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    // <Modal isOpen={isOpen} toggle={toggle} backdrop={false} size="lg">
    //   <ModalHeader toggle={toggle}>Legal Status</ModalHeader>
    //   <ModalBody style={{ maxHeight: '60vh', overflowY: 'auto' }}>
    <>
    
        {Array.isArray(legalStatusData) && legalStatusData.length > 0 ? (
          <Accordion open={openIndex} toggle={toggleAccordion}>
            {legalStatusData.map((item, index) => (
              <AccordionItem key={index}>
                <AccordionHeader targetId={String(index)}>
                  Legal Status Entry {index + 1}
                </AccordionHeader>
                <AccordionBody accordionId={String(index)}>
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: '8px' }}>
                      <strong>{key}:</strong> {renderValue(value)}
                    </div>
                  ))}
                </AccordionBody>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p>No legal status data available.</p>
        )}
        </>
        
    //   </ModalBody>
    //   <ModalFooter>
    //     <Button color="secondary" onClick={toggle}>Close</Button>
    //   </ModalFooter>
    // </Modal>
  );
};

export default LegalStatusModal;
