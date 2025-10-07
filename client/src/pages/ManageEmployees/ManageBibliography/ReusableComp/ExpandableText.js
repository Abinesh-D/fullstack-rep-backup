import React, { useState } from 'react';

const ExpandableText = ({ text, maxLength = 250 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  if (!text) return null;

  return (
    <div>
      <p>
        {isExpanded ? text : text.substring(0, maxLength) + (text.length > maxLength ? '...' : '')}
      </p>
      {text.length > maxLength && (
        <button
          onClick={toggleText}
          className="text-blue-500 hover:underline"
        >
          {isExpanded ? 'See Less' : 'See More'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
