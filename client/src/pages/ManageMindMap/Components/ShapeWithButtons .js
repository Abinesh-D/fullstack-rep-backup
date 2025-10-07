import { useState, useRef } from "react";

const ShapeWithButtons = ({ id, toggleConnection }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [nearestButton, setNearestButton] = useState(null);
  const containerRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const distances = {
      top: Math.abs(mouseY - top),
      right: Math.abs(mouseX - (left + width)),
      bottom: Math.abs(mouseY - (top + height)),
      left: Math.abs(mouseX - left),
    };

    const closest = Object.entries(distances).reduce((a, b) => (a[1] < b[1] ? a : b))[0];
    setNearestButton(closest);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setNearestButton(null);
      }}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", display: "inline-block", cursor: nearestButton ? "pointer" : "default" }}
    >
      {/* SVG Shape */}
      <svg className="shapebackground" height="46" width="80" viewBox="-40 -23 80 46" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M -33,4.9 L -40,0,-33,-4.9,-33,-13.5 A 2.5,2.5,0,0,1,-30.5,-16 L -4.9,-16,0,-23,4.9,-16,30.5,-16 A 2.5,2.5,0,0,1,33,-13.5 L 33,-4.9,40,0,33,4.9,33,13.5 A 2.5,2.5,0,0,1,30.5,16 L 4.9,16,0,23,-4.9,16,-30.5,16 A 2.5,2.5,0,0,1,-33,13.5 Z"
          fill="#d0d0d0"
        />
      </svg>

      {/* Show only the closest button */}
      {isHovered && nearestButton === "top" && (
        <div className="starcbutton top" onClick={() => toggleConnection(id, "top")}></div>
      )}
      {isHovered && nearestButton === "right" && (
        <div className="starcbutton right" onClick={() => toggleConnection(id, "right")}></div>
      )}
      {isHovered && nearestButton === "bottom" && (
        <div className="starcbutton bottom" onClick={() => toggleConnection(id, "bottom")}></div>
      )}
      {isHovered && nearestButton === "left" && (
        <div className="starcbutton left" onClick={() => toggleConnection(id, "left")}></div>
      )}
    </div>
  );
};

export default ShapeWithButtons;
