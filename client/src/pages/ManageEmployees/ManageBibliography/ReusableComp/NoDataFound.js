import { motion } from "framer-motion";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";

const NoDataFound = ({type}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex justify-center items-center min-h-[300px]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div
        className={`max-w-md w-full p-6 shadow-xl border border-yellow-300 bg-yellow-50 rounded-2xl transition-all duration-300 ${hovered ? "transform scale-105 shadow-2xl" : ""
          }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-col items-center text-center space-y-6 m-2">
          <AlertTriangle className="text-red-500 mr-2" size={40} />

          <motion.h3
            className="text-2xl font-semibold text-yellow-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            whileHover={{ color: "#F59E0B" }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            N<i className="bx bx-buoy bx-spin text-primary display-10" />&nbsp;Data&nbsp;F<i className="bx bx-buoy bx-spin text-primary display-10" /> und!
          </motion.h3>
          <motion.p
            className="text-gray-600 text-sm text-danger"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ color: "#F59E0B" }}
          >
           {`This patent number is not available in the ${type === 'gle' && "Google Search" || type === 'esp' && "Espacenet" || type === 'lens' && 'Lens' } platform. Please check the patent number or try another one.`} 
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default NoDataFound;
