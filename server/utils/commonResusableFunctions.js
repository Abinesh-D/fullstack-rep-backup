const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const safeText = (val) => (typeof val === "string" ? val : val?._ || "");

function formatDate(dateStr) {
    return dateStr && /^\d{8}$/.test(dateStr)
        ? `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6)}`
        : "";
}

function capitalize(str) {
    return str
        .toLowerCase()
        .replace(/\b\w/g, (ch) => ch.toUpperCase())
        .trim();
}
// function convertIpc(text) {
//     const match = text?.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
//     return match ? match[0].replace(/\s+/g, '') : '';
// };

function convertIpc(text) {
  if (!text) return "";
  const match = text.match(/[A-H][0-9]{2}[A-Z]\s*\d+\/\s*\d+/);
  if (!match) return "";

  return match[0].replace(/\s+/g, "");
}

function normalizeNames(rawValue) {
  if (!rawValue) return "";

  return rawValue
    .split(";") 
    .map(name => name.replace(/,/g, " ").trim())
    .filter(Boolean)
    .map(name => {
      const parts = name.split(/\s+/);
      if (parts.length >= 2) {
        const lastName = parts[0];
        const firstNames = parts.slice(1).join(" ");
        return `${firstNames} ${lastName}`;
      }
      return name;
    })
    .join("; "); 
}


function getFilteredCPC(classifications, classificationsIPC) {
    const cpcArray = classifications?.cpc
        ? classifications.cpc.split(/[;,]/).map(item => item.trim()).filter(Boolean)
        : [];

    const ipcArray = classificationsIPC
        ? classificationsIPC.split(/[;,]/).map(item => item.trim()).filter(Boolean)
        : [];

    if (cpcArray.length === 0) {
        return "";
    }

    const normalizedIPCSet = new Set(ipcArray.map(ipc => ipc.toUpperCase()));
    const uniqueCPC = cpcArray.filter(cpc => !normalizedIPCSet.has(cpc.toUpperCase()));

    return uniqueCPC.length ? uniqueCPC.join("; ") : ipcArray.join("; ");
}





module.exports = { formatDate, capitalize, safeArray, safeText, convertIpc, getFilteredCPC, normalizeNames };