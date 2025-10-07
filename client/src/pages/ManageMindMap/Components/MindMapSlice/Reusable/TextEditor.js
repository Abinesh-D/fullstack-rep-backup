import React from "react";
import { FaBold, FaItalic, FaLink } from "react-icons/fa";

import ImageFileUploader from "../../ImageFileUploader";
import ExcelFileUploader from "../../FileUploader";


const TextEditor = ({
  id,
  label,
  textAreaRef,
  handleChange,
  handleKeyDown,
  applyFormat,
  handleFileUpload,
  setNodes,
  setEdges,
  nodes,
  edges,
  setIsEditing,
}) => {
  return (
    <div
      className="editor-container"
      style={{ cursor: "pointer", transform: id === '1' && "translate(20px, 10px)" }}
    >
      <div className="text-editor-box">
        <div className="toolbar">
          <button title="Bold" onClick={() => applyFormat("bold")}>
            <FaBold />
          </button>
          <button title="Italic" onClick={() => applyFormat("italic")}>
            <FaItalic />
          </button>
          <button title="Insert Link" onClick={() => applyFormat("link")}>
            <FaLink />
          </button>
          <div disabled title="Upload image">
            <ImageFileUploader
              id={id}
              onFileUpload={(file, type, id) => {
                handleFileUpload(file, type, id, setNodes, setEdges, nodes, edges);
                setIsEditing(false);
              }}
            />
          </div>
          <div disabled title="Upload Excel">
            <ExcelFileUploader
              id={id}
              onFileUpload={(file, type, id) => {
                handleFileUpload(file, type, id, setNodes, setEdges, nodes, edges);
                setIsEditing(false);
              }}
            />
          </div>
        </div>

        <div className="textarea-wrapper">
          <textarea
            ref={textAreaRef}
            autoFocus
            value={label}
            onPaste={handleChange}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="custom-textarea"
            placeholder="Type here..."
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
