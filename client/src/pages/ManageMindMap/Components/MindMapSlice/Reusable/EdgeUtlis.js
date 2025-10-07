export const edgeColors = [
  "#FF4F5E", "#FF6B35", "#FF9F1C", "#F4D35E", "#EE964B", // Warm & Energetic
  "#2EC4B6", "#00A896", "#028090", "#05668D", "#427AA1", // Cool & Calm
  "#6A0572", "#AB83A1", "#C86FC9", "#6D597A", "#B56576", // Elegant & Royal
  "#3A86FF", "#8338EC", "#FF006E", "#FB5607", "#FFBE0B", // Bold & Vivid
  "#FF9F68", "#FFA07A", "#FFD166", "#F4A261", "#E9C46A",
  "#B8DE6F", "#67D7C4", "#43AA8B", "#2A9D8F", "#A1C4FD",
  "#6A82FB", "#6C5CE7", "#A29BFE", "#845EC2", "#F78FB3",
  "#C06C84", "#9B5DE5", "#FF477E", "#FF85A1"
];

  export const getRandomColor = () => edgeColors[Math.floor(Math.random() * edgeColors.length)];

  export const oppositeHandle = (direction) => {
    switch (direction) {
      case "top": return "bottom";
      case "right": return "left";
      case "bottom": return "top";
      case "left": return "right";
      default: return "right";
    }
  };
  