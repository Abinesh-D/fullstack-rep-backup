import React from "react";

const LinkComponent = ({ data }) => {
  const label = data.label;

  // Regular expression to extract [Link Title](URL)
  const match = label.match(/\[(.*?)\]\((.*?)\)/);

  // Extract title and URL from the match
  const linkTitle = match ? match[1] : label;
  const linkUrl = match ? match[2] : "#";

  return (
    <span>
      {linkTitle}:{" "}
      <a href={linkUrl} target="_blank" rel="noopener noreferrer">
        {linkUrl}
      </a>
    </span>
  );
};

// Example usage
const App = () => {
  return <LinkComponent data={{ label: "[Link Title](https://example.com)" }} />;
};

export default App;
