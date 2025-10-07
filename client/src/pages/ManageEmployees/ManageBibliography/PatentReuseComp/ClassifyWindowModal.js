import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClassifyWindowModal = ({ cpcItems = [], classificationSymbol }) => {

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="mb-3">
      <div className="row align-items-center justify-content-between">
        <div className="col-auto">
          <h5 className="text-primary fw-bold mb-0">CPC Classification Info</h5>
        </div>
        <div className="col-auto">
          <button
            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
            onClick={() => setShowInfo(!showInfo)}
          >
            {showInfo ? "Hide Info" : "More Info"}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {showInfo && (
          <motion.div
            key="cpc-info"
            layout
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
            className="mt-3"
          >
            <motion.ul
              className="list-group list-group-flush"
              layout
              transition={{ duration: 0.3 }}
            >
              {cpcItems.map((item, index) => (
                <motion.li
                  key={index}
                  className="list-group-item px-3 py-2"
                  style={{
                    borderLeft: item.symbol === classificationSymbol ? "4px solid #5cb85c" : "4px solid #0d6efd",
                    fontSize: "0.8rem",
                    lineHeight: "1.2",
                    marginBottom: "0.25rem",
                    backgroundColor: item.symbol === classificationSymbol ? "white" : "#f8f9fa",
                    borderRadius: "4px",
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div><strong className={ item.symbol === classificationSymbol ? "text-success" : "text-primary"}>{item.symbol}</strong></div>
                  <div>{item.title}</div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassifyWindowModal;














// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const ClassifyWindowModal = ({ cpcItems = [] }) => {
//   const [showInfo, setShowInfo] = useState(false);

//   return (
//     <div className="row align-items-center justify-content-between mb-3">
//       <div className="col-auto">
//         <h5 className="text-primary fw-bold mb-0">CPC Classification Info</h5>
//       </div>
//       <div className="col-auto">
//         <button
//           className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
//           onClick={() => setShowInfo(!showInfo)}
//         >
//           {showInfo ? "Hide Info" : "More Info"}
//         </button>
//       </div>

//       <AnimatePresence>
//         {showInfo && (
//           <motion.section
//             key="cpc-info"
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.98 }}
//             transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
//             className="mt-3"
//             layout
//           >
//             <motion.ul
//               className="list-group list-group-flush mt-2"
//               layout
//               transition={{ duration: 0.3 }}
//             >
//               {cpcItems.map((item, index) => (
//                 <motion.li
//                   key={index}
//                   className="list-group-item px-3 py-2"
//                   style={{
//                     borderLeft: "4px solid #0d6efd",
//                     fontSize: "0.7rem",
//                     lineHeight: "1",
//                     marginBottom: "0.25rem",
//                     backgroundColor: "#f8f9fa",
//                     borderRadius: "4px",
//                   }}
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                 >
//                   <div><strong className="text-primary">{item.symbol}</strong></div>
//                   <div>{item.title}</div>
//                 </motion.li>
//               ))}
//             </motion.ul>
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ClassifyWindowModal;













// import React, { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';

// const ClassifyWindowModal = ({ cpcItems = [] }) => {
//   const [showInfo, setShowInfo] = useState(false);

//   return (
//     <div className="row align-items-center justify-content-between mb-3">
//       <div className="col-auto">
//         <h5 className="text-primary fw-bold mb-0">CPC Classification Info</h5>
//       </div>
//       <div className="col-auto">
//         <button
//           className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
//           onClick={() => setShowInfo(!showInfo)}
//         >
//           {showInfo ? "Hide Info" : "More Info"}
//         </button>
//       </div>

//       <AnimatePresence>
//         {showInfo && (
//           <motion.section
//             key="cpc-info"
//             initial={{ opacity: 0, y: -10, scale: 0.98 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -10, scale: 0.98 }}
//             transition={{ duration: 0.4, ease: [0.25, 0.8, 0.25, 1] }}
//             className="mt-3"
//             layout
//           >
//             <motion.ul
//               className="list-group list-group-flush mt-2"
//               layout
//               transition={{ duration: 0.3 }}
//             >
//               {cpcItems.map((item, index) => (
//                 <motion.li
//                   key={index}
//                   className="list-group-item px-2 py-1 small"
//                   style={{ borderLeft: "3px solid #0d6efd" }}
//                   initial={{ opacity: 0, x: -10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.3, delay: index * 0.05 }}
//                 >
//                   <strong>{item.symbol}</strong>: {item.title}
//                 </motion.li>
//               ))}
//             </motion.ul>
//           </motion.section>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ClassifyWindowModal;
