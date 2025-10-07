// CopyableField.js
import React, { useState } from 'react';
import { Copy } from 'lucide-react';

const CopyableField = ({ label, text, field }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <p
      className="relative group flex flex-wrap gap-1 items-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <strong>{label}:</strong>&nbsp;
      <span className="inline">{text}</span>
      {isHovered && (
        <span
          className="ml-2 text-blue-600 cursor-pointer inline-flex items-center"
          onClick={handleCopy}
          title={`Copy ${field}`}
          style={{ cursor:'pointer' }}
        >
          <Copy size={16} />
          {copied && <span className="text-green-600 text-xs ml-1">Copied!</span>}
        </span>
      )}
    </p>
  );
};

export default CopyableField;
