import React, { useEffect } from "react";

const UndoRedoControls = ({ undo, redo, canUndo, canRedo }) => {
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === "z") {
        event.preventDefault();
        if (canUndo) undo();
      }
      if (event.ctrlKey && event.key === "y") {
        event.preventDefault();
        if (canRedo) redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div className="undo-redo-buttons">
      <button onClick={undo} disabled={!canUndo}>Undo (Ctrl + Z)</button>
      <button onClick={redo} disabled={!canRedo}>Redo (Ctrl + Y)</button>
    </div>
  );
};

export default UndoRedoControls;










// import React, { useEffect } from "react";

// const UndoRedoControls = ({ undo, redo, canUndo, canRedo }) => {
//   // Handle keyboard shortcuts for Undo (Ctrl + Z) and Redo (Ctrl + Y)
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (event.ctrlKey && event.key === "z") {
//         event.preventDefault();
//         if (canUndo) undo();
//       }
//       if (event.ctrlKey && event.key === "y") {
//         event.preventDefault();
//         if (canRedo) redo();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, [undo, redo, canUndo, canRedo]);

//   return (
//     <div className="undo-redo-buttons">
//       <button onClick={undo} disabled={!canUndo}>Undo (Ctrl + Z)</button>
//       <button onClick={redo} disabled={!canRedo}>Redo (Ctrl + Y)</button>
//     </div>
//   );
// };

// export default UndoRedoControls;
