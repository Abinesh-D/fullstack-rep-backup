import { useState } from "react";
import { FaFileImage } from "react-icons/fa";

const ImageFileUploader = ({ onFileUpload, id }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      if (onFileUpload) onFileUpload(file, 'Image', id);
    }
  };

  return (
      <div >
          <label title="Upload Image" style={{ cursor: "pointer" }}>
              <FaFileImage style={{ color: "blue", fontSize: "11px", marginTop: '9px' }} />
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
      </div>
  );
};

export default ImageFileUploader;
