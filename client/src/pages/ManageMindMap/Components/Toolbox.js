// import React from "react";
// import "./Toolbox.css"; // Make sure to create this CSS file

// const EditorToolbar = () => {
//     return (
//         <div className="editor-toolbar">
//             <div className="editor-button formatting" title="Text formatting"></div>
//             <div className="editor-button back" title="Back"></div>
//             <div className="editor-button bold formatting-button" title="Make text bold"></div>
//             <div className="editor-button italics formatting-button" title="Make text italic"></div>
//             <div className="editor-button alignment align-left formatting-button" title="Aligned left"></div>
//             <div className="editor-button alignment align-center formatting-button" title="Aligned center"></div>
//             <div className="editor-button alignment align-right formatting-button" title="Aligned right"></div>
//             <div className="editor-button alignment align-auto formatting-button" title="Aligned automatically"></div>
//             <div className="editor-button link" title="Link to a website"></div>

//             <div className="editor-button upload" title="Add image or attach file." style={{ display: "none" }}></div>
            
//             <form className="editor-image-attach" style={{ display: "none" }}>
//                 <input className="force-attach" type="file" accept="*" name="files[]" />
//             </form>

//             <div className="editor-button upload-button attach disabled" title="Attach a file."></div>

//             <form className="editor-image-upload" style={{ display: "none" }}>
//                 <input className="force-image" type="file" accept="image/*" name="files[]" />
//             </form>

//             <div className="editor-button upload-button image" title="Upload an image" style={{ display: "inline-block" }}></div>
//             <div className="editor-button addemoji zap" title="Search for icons."></div>
//         </div>
//     );
// };

// export default EditorToolbar;








import React from "react";
import { FiBold, FiItalic, FiUnderline, FiImage } from "react-icons/fi";
import { FaFileExcel } from "react-icons/fa";
import "./Toolbox.css";

const Toolbox = ({ textSize, setTextSize, handleFontStyleChange, handleFileUpload }) => {
    return (
        <div className="toolbox">
            <div className="toolbox-group">
                <button onClick={() => handleFontStyleChange("bold")} title="Bold"><FiBold /></button>
                <button onClick={() => handleFontStyleChange("italic")} title="Italic"><FiItalic /></button>
                <button onClick={() => handleFontStyleChange("underline")} title="Underline"><FiUnderline /></button>
            </div>

            <div className="toolbox-group">
                <select onChange={(e) => setTextSize(e.target.value)} value={textSize}>
                    <option value="12px">12px</option>
                    <option value="14px">14px</option>
                    <option value="16px">16px</option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                </select>
            </div>

            <div className="toolbox-group">
                <label className="file-upload">
                    <FiImage />
                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                </label>

                <label className="file-upload">
                    <FaFileExcel />
                    <input type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
                </label>
            </div>
        </div>
    );
};

export default Toolbox;
