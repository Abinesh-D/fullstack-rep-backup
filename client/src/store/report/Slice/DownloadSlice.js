import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';

const initialState = {
};
export const downloadSlice = createSlice({
    name: 'download',
    initialState,
    reducers: {
        }
});

export const { } = downloadSlice.actions;

export const handleDownload_bar = (value,datakeys_name,datakeys,data) => {
    let url;
    const newKeys = {
        label: datakeys_name,
        value: datakeys,
    };
    const renamedData = data.map(obj => renameKeys(obj, newKeys));
    if (value === "0") {
        const datas = renamedData.map(obj => {
            const { _id, ...rest } = obj;
            return rest
        })
        const csv = convertToCSV(datas);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
    else {
        const data1 = data.filter(item => item !== null);
        const data = data1;
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'table.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
}

export const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
    return header + rows;
}

export const renameKeys = (obj, newKeys) => {
    const keyEntries = Object.entries(obj);
    const renamedObj = keyEntries.reduce((acc, [key, value]) => {
        const newKey = newKeys[key] || key;
        acc[newKey] = value;
        return acc;
    }, {});
    return renamedObj;
};

export const img_download_svg = (id) => {
    const svgElement = document.getElementById(id)
    if (!svgElement) {
        console.error("SVG element not found");
        return;
    }
    const svgString = new XMLSerializer().serializeToString(svgElement);
    if (!svgString) {
        console.error("Failed to serialize SVG content");
        return;
    }
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "chart.svg";
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
};

export const img_download_png_mod = async (i) => {
    const chartContainer = document.getElementById(`my_dataviz${i}`);
    if (!chartContainer) {
        console.error("Chart container not found");
        return;
    }
   const chartWidth = chartContainer.scrollWidth;
    const chartHeight = chartContainer.offsetHeight;
    const chartCanvas = await html2canvas(chartContainer, {
        width: chartWidth,
        height: chartHeight,
    });
    const pngData = chartCanvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngData;
    link.download = "chart.png";
    link.click();
   };
export default downloadSlice.reducer;







