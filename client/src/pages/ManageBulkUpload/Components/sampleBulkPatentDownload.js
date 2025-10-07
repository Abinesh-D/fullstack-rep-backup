import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const downloadSampleExcel = () => {
    const sampleData = [
        ["", "Patent Number"],
        ["", "(Enter patent number)"],
        ["", "(Enter patent number)"],
        ["", "(Enter patent number)"],
        ["", "(Enter patent number)"],
        ["", "etc..."],
        ["", "⚠️ Limit: Max 30 entries"]
    ];


    const worksheet = XLSX.utils.aoa_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(blob, "Sample-Patent-Numbers.xlsx");
};
