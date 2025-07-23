import React, { useEffect, useRef } from 'react';
import { decode } from 'tiff';

const TiffViewer = ({ base64Data }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!base64Data) return;

    try {
      const cleanBase64 = base64Data.replace(/^data:image\/tiff;base64,/, '');
      const byteCharacters = atob(cleanBase64);
      const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);

      const images = decode(byteArray);
      if (!images || images.length === 0) throw new Error("No images decoded");

      const image = images[0];
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      canvas.width = image.width;
      canvas.height = image.height;

      const imageData = ctx.createImageData(image.width, image.height);
      imageData.data.set(image.data);
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('TIFF render error:', error);
    }
  }, [base64Data]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid #ccc', maxWidth: '100%' }} />
    </div>
  );
};

export default TiffViewer;
