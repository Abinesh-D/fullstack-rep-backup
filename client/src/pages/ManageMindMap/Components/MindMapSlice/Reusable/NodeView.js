import React from "react";
import "../../EditableNode.css";

const NodeView = ({ label, isBold, isItalic, link, data, setIsEditing, id }) => {
    return (
        <div className="shapebackground" onClick={() => setIsEditing(true)}>
            {data.isImageNode ? (
                <div style={{ width: "100px", height: "60px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                    <img src={data.image} alt="Preview" style={{ maxWidth: "100px", maxHeight: "60px", borderRadius: "5px" }} />
                </div>
            ) : (
                <div style={{ fontWeight: isBold ? "bold" : "normal", fontStyle: isItalic ? "italic" : "normal", textDecoration: link ? "underline" : "none" }}>
                    {link ? <a href={link} target="_blank" rel="noopener noreferrer">{label}</a> : label}
                </div>
            )}
        </div>
    );
};

export default NodeView;
