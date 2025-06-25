import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import IPCExcelUploader from './IPCExcelUploader';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchIpcDefinitions } from '../BibliographySLice/BibliographySlice';


const styles = {
    container: {
        maxWidth: '600px',
        margin: '2rem auto',
        padding: '2rem',
        backgroundColor: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        fontFamily: 'sans-serif',
    },
    heading: {
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
        color: '#333',
    },
    inputGroup: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    input: {
        flex: '1 1 auto',
        padding: '0.55rem 1rem',
        fontSize: '1rem',
        borderRadius: '8px',
        border: '1px solid #ccc',
        width: '100%',
        maxWidth: '350px',
    },
    button: {
        padding: '0.55rem 1rem',
        fontSize: '1rem',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

const IPCDefinition = () => {
    const [ipcCode, setIpcCode] = useState('');
    const [definition, setDefinition] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFileName, setUploadedFileName] = useState('');
    const fileInputRef = useRef(null);
    const [uploadedRows, setUploadedRows] = useState([]);



    // const rootItem = definition.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];

    // const params = definition.param;

    // function getCPCClassificationItems(rootItem, keyName) {

    //     console.log('rootItem, keyName :>> ', rootItem, keyName);
    //     const result = [];

    //     const extractTitlePart = (titlePart) => {
    //         if (!titlePart) return '';

    //         if (Array.isArray(titlePart)) {
    //             return titlePart
    //                 .map(part => {
    //                     if (typeof part === 'string') return part;
    //                     if (part?.text) return part.text;
    //                     if (part?.comment?.text) return part.comment.text;
    //                     if (Array.isArray(part['class-ref'])) {
    //                         return part['class-ref'].map(ref => ref._).join(', ');
    //                     }
    //                     if (part['class-ref']?._) {
    //                         return part['class-ref']._;
    //                     }
    //                     return '';
    //                 })
    //                 .filter(Boolean)
    //                 .join('; ');
    //         }

    //         if (typeof titlePart === 'object') {
    //             return (
    //                 titlePart.text ||
    //                 titlePart?.comment?.text ||
    //                 (Array.isArray(titlePart['class-ref']) &&
    //                     titlePart['class-ref'].map(ref => ref._).join(', ')) ||
    //                 titlePart['class-ref']?._ ||
    //                 ''
    //             );
    //         }

    //         return titlePart;
    //     };

    //     const traverse = (item) => {
    //         if (!item) return;

    //         const symbol = item['@symbol'] || item.symbol;
    //         const title = extractTitlePart(item.titlePart || item.title);

    //         if (symbol && title) {
    //             result.push({ symbol, title });
    //         }

    //         if (Array.isArray(item.classificationItem)) {
    //             item.classificationItem.forEach(traverse);
    //         }
    //     };

    //     traverse(rootItem);

    //     return result;
    // }



    // function getCPCClassificationItemsBySymbols(rootItem, symbolsArray) {
    //     const targetSymbols = symbolsArray
    //         .flatMap(s => s.split(',').map(sym => sym.trim()))
    //         .filter(sym => sym.length > 0);

    //     const result = [];

    //     targetSymbols.forEach(symbol => {
    //         result[symbol] = [
    //             {
    //                 symbol: '',
    //                 title: ''
    //             }
    //         ];
    //     });
    //     console.log('resultresult', result);

    //     const extractTitlePart = (titlePart) => {
    //         console.log('titlePart :>> ', titlePart);
    //         if (!titlePart) return '';
    //         if (Array.isArray(titlePart)) {
    //             return titlePart.map(p => p._ || '').join(' ');
    //         }
    //         return titlePart._ || '';
    //     };

    //     const traverse = (item, path = []) => {
    //         if (!item || typeof item !== 'object') return;

    //         const classification = item['classification-item'];
    //         if (classification) {
    //             const symbol = classification['classification-symbol'];
    //             const classTitle = classification['class-title'];
    //             const title = classTitle ? extractTitlePart(classTitle['title-part']) : '';
    //             const currentPath = [...path, { symbol, title }];
    //             if (targetSymbols.includes(symbol)) {

    //                 result[symbol] = currentPath;
    //             }

    //             const nested = classification['classification-item'];
    //             if (Array.isArray(nested)) {
    //                 nested.forEach(child => traverse({ 'classification-item': child }, currentPath));
    //             } else if (nested) {
    //                 traverse({ 'classification-item': nested }, currentPath);
    //             }
    //         }
    //     };


    //     traverse(rootItem);

    //     if (Array.isArray(rootItem)) {
    //         rootItem.forEach(item => traverse(item));
    //     } else {
    //         traverse(rootItem);
    //     }

    //     return result;
    // }




    // function getCPCClassificationItems(rootItem) {
    //     const result = [];

    //     const extractTitlePart = (titlePart) => {
    //         if (!titlePart) return '';

    //         if (Array.isArray(titlePart)) {
    //             return titlePart
    //                 .map(part => {
    //                     if (typeof part === 'string') return part;
    //                     if (part?.text) return part.text;
    //                     if (part?.comment?.text) return part.comment.text;
    //                     if (Array.isArray(part['class-ref'])) {
    //                         return part['class-ref'].map(ref => ref._).join(', ');
    //                     }
    //                     if (part['class-ref']?._) {
    //                         return part['class-ref']._;
    //                     }
    //                     return '';
    //                 })
    //                 .filter(Boolean)
    //                 .join('; ');
    //         }

    //         if (typeof titlePart === 'object') {
    //             const val =
    //                 titlePart.text ||
    //                 titlePart?.comment?.text ||
    //                 (Array.isArray(titlePart['class-ref'])
    //                     ? titlePart['class-ref'].map(ref => ref._).join(', ')
    //                     : titlePart['class-ref']?._);

    //             return typeof val === 'string' ? val.trim() : '';
    //         }

    //         return typeof titlePart === 'string' ? titlePart.trim() : '';
    //     };


    //     const traverse = (item) => {
    //         if (!item) return;

    //         (Array.isArray(item) ? item : [item]).forEach(node => {
    //             try {
    //                 const symbol = node['classification-symbol'] || node?.$?.['sort-key'];
    //                 const titlePart = extractTitlePart(node['class-title']?.['title-part']);

    //                 if (symbol && titlePart) {
    //                     result.push({ symbol, title: titlePart });
    //                 }

    //                 if (typeof node['classification-item']) {
    //                     traverse(node['classification-item']);
    //                 }
    //             } catch (error) {
    //                 console.warn('Error processing node:', node, error);
    //             }
    //         });
    //     };

    //     traverse(rootItem);
    //     return result;
    // }


    // function getCPCClassificationItemsBySymbols(rootItem, symbolsArray) {
    //     const targetSymbols = symbolsArray
    //         .flatMap(s => s.split(',').map(sym => sym.trim()))
    //         .filter(sym => sym.length > 0);

    //     const result = {};

    //     targetSymbols.forEach(symbol => {
    //         result[symbol] = [];
    //     });

    //     const extractTitlePart = (titlePart) => {
    //         if (!titlePart) return '';

    //         if (Array.isArray(titlePart)) {
    //             return titlePart.map(p => {
    //                 if (p.text) return p.text;
    //                 if (p.explanation?.text) return p.explanation.text;
    //                 return '';
    //             }).filter(Boolean).join('; ');
    //         }

    //         if (typeof titlePart === 'object') {
    //             if (titlePart.text) return titlePart.text;
    //             if (titlePart.explanation?.text) return titlePart.explanation.text;
    //         }

    //         return '';
    //     };

    //     const traverse = (item, path = []) => {
    //         if (!item || typeof item !== 'object') return;

    //         const classification = item['classification-item'];
    //         if (classification) {
    //             const symbol = classification['classification-symbol'];
    //             const classTitle = classification['class-title'];
    //             const title = classTitle ? extractTitlePart(classTitle['title-part']) : '';
    //             const currentPath = [...path, { symbol, title }];

    //             if (targetSymbols.includes(symbol)) {
    //                 result[symbol] = currentPath;
    //             }

    //             const nested = classification['classification-item'];
    //             if (Array.isArray(nested)) {
    //                 nested.forEach(child => traverse({ 'classification-item': child }, currentPath));
    //             } else if (nested) {
    //                 traverse({ 'classification-item': nested }, currentPath);
    //             }
    //         }
    //     };

    //     if (Array.isArray(rootItem)) {
    //         rootItem.forEach(item => traverse(item));
    //     } else {
    //         traverse(rootItem);
    //     }

    //     return result;
    // }


    // function getCPCClassificationItemsBySymbols(rootItem, symbolsArray) {
    //     const targetSymbols = symbolsArray
    //         .flatMap(s => s.split(',').map(sym => sym.trim()))
    //         .filter(sym => sym.length > 0);

    //     const result = {};

    //     const extractTitlePart = (titlePart) => {
    //         if (!titlePart) return '';
    //         if (Array.isArray(titlePart)) {
    //             return titlePart.map(p => {
    //                 if (p.text) return p.text;
    //                 if (typeof p === 'object' && p.explanation?.text) return p.explanation.text;
    //                 return '';
    //             }).join('; ');
    //         } else if (typeof titlePart === 'object') {
    //             if (titlePart.text) return titlePart.text;
    //             if (titlePart.explanation?.text) return titlePart.explanation.text;
    //         }
    //         return '';
    //     };

    //     const traverse = (item, path = []) => {
    //         if (!item || typeof item !== 'object') return;
    //         const classification = item['classification-item'];
    //         if (classification) {
    //             const symbol = item['classification-symbol'] || classification['classification-symbol'];
    //             if (!symbol) return;

    //             const classTitle = classification['class-title']  || item['class-title'];

    //             const title = classTitle ? extractTitlePart(classTitle['title-part']) : '';
    //             const currentPath = [...path, { symbol, title }];

    //             if (targetSymbols.includes(symbol)) {
    //                 result[symbol] = currentPath;
    //             }

    //             const nested = classification['classification-item'];
    //             if (Array.isArray(nested)) {
    //                 nested.forEach(child => traverse({ 'classification-item': child }, currentPath));
    //             } else if (nested) {
    //                 traverse({ 'classification-item': nested }, currentPath);
    //             }
    //         } else if (item['classification-symbol']) {
    //             const symbol = item['classification-symbol'];
    //             const classTitle = item['class-title'];

    //             const title = classTitle ? extractTitlePart(classTitle['title-part']) : '';
    //             const currentPath = [...path, { symbol, title }];

    //             if (targetSymbols.includes(symbol)) {
    //                 result[symbol] = currentPath;
    //             }

    //             const nested = item['classification-item'];
    //             if (Array.isArray(nested)) {
    //                 nested.forEach(child => traverse(child, currentPath));
    //             } else if (nested) {
    //                 traverse(nested, currentPath);
    //             }
    //         }
    //     };

    //     if (Array.isArray(rootItem)) {
    //         rootItem.forEach(item => traverse(item));
    //     } else {
    //         traverse(rootItem);
    //     }

    //     return result;
    // }







    // const getIpcClassificationTitles = (rootItem, ipcCodeString) => {
    //   const ipcCodes = ipcCodeString
    //     .split(',')
    //     .map(code => code.trim())
    //     .filter(code => code.length > 0);

    //   const allSymbols = ipcCodes.flatMap(extractIpcHierarchy);
    //   const uniqueSymbols = [...new Set(allSymbols)];

    //   const symbolMap = {};

    //   const traverse = (item) => {
    //     if (!item || typeof item !== 'object') return;

    //     const classification = item['classification-item'];
    //     if (classification) {
    //       const symbol = classification['classification-symbol'];
    //       const title = extractTitlePart(classification?.['class-title']?.['title-part']);
    //       if (uniqueSymbols.includes(symbol)) {
    //         symbolMap[symbol] = title;
    //       }

    //       const nested = classification['classification-item'];
    //       if (Array.isArray(nested)) {
    //         nested.forEach(child => traverse({ 'classification-item': child }));
    //       } else if (nested) {
    //         traverse({ 'classification-item': nested });
    //       }
    //     }
    //   };

    //   if (Array.isArray(rootItem)) {
    //     rootItem.forEach(item => traverse(item));
    //   } else {
    //     traverse(rootItem);
    //   }

    //   const result = {};
    //   ipcCodes.forEach(code => {
    //     const hierarchy = extractIpcHierarchy(code);
    //     result[code] = hierarchy
    //       .filter(sym => symbolMap[sym])
    //       .map(sym => ({ symbol: sym, title: symbolMap[sym] }));
    //   });

    //   return result;
    // };




    const extractIpcHierarchy = (ipcCode) => {
        if (!ipcCode || ipcCode.length < 1) return [];

        const level1 = ipcCode.charAt(0);
        const level2 = ipcCode.slice(0, 3);
        const level3 = ipcCode;

        if (ipcCode.length === 1) {
            return [level1];
        } else if (ipcCode.length === 3) {
            return [level1, level2];
        } else {
            return [level1, level2, level3];
        }
    };


    const extractTitlePart = (titlePart) => {
        if (!titlePart) return '';
        if (Array.isArray(titlePart)) {
            return titlePart
                .map(part => part?.text || part?.explanation?.text || '')
                .filter(Boolean)
                .join('; ');
        }
        if (typeof titlePart === 'object') {
            return titlePart.text || titlePart?.explanation?.text || '';
        }
        return '';
    };


    const getIpcClassificationTitles = (rootItem, ipcCodeInput) => {

        const ipcCodeString = Array.isArray(ipcCodeInput) ? ipcCodeInput.join(',') : ipcCodeInput;

        const ipcCodes = ipcCodeString
            .split(',')
            .map(code => code.trim())
            .filter(code => code.length > 0);

        const allSymbols = ipcCodes.flatMap(extractIpcHierarchy);
        const uniqueSymbols = [...new Set(allSymbols)];

        const symbolMap = {};

        const traverse = (item) => {
            if (!item || typeof item !== 'object') return;
            const classification = item['classification-item'];
            if (classification) {
                const symbol = item?.['classification-symbol'] || classification['classification-symbol'];
                const titlePart = item?.['class-title']?.['title-part'] || classification?.['class-title']?.['title-part'];
                const title = extractTitlePart(titlePart);

                if (uniqueSymbols.includes(symbol)) {
                    if (!symbolMap[symbol]) {
                        symbolMap[symbol] = { symbol, title };
                    }
                }

                const nested = classification['classification-item'];
                if (Array.isArray(nested)) {
                    nested.forEach(child => traverse({ 'classification-item': child }));
                } else if (nested) {
                    traverse({ 'classification-item': nested });
                }
            }
        };

        if (Array.isArray(rootItem)) {
            rootItem.forEach(traverse);
        } else {
            traverse(rootItem);
        }

        const result = {};
        for (const ipcCode of ipcCodes) {
            const hierarchy = extractIpcHierarchy(ipcCode);

            const group = hierarchy
                .map(sym => symbolMap[sym])
                .filter(Boolean);

            if (group.length) {
                result[ipcCode] = group;
            }
        }

        return result;
    };

    const rootItem = definition?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
    const params = definition?.param || [];

    
    // const cpcItems = getIpcClassificationTitles(rootItem, params);
    // console.log('cpcItems ', cpcItems,);

    // const extractIpcHierarchy = (ipcCode) => {
    //     if (!ipcCode || ipcCode.length < 1) return [];

    //     const level1 = ipcCode.charAt(0);
    //     const level2 = ipcCode.slice(0, 3);
    //     const level3 = ipcCode;

    //     return `${level1}, ${level2}, ${level3}`;
    // };

    // const ipcHierarchy = extractIpcHierarchy(ipcCode);
    // console.log('ipcHierarchy :>> ', ipcHierarchy);

    function formatIPCCodes(ipcString) {
        if (typeof ipcString !== 'string') return '';
        return ipcString.trim().split(/\s+/).join(',');
    }


    function extractTitleParts(titlePart) {
        if (!titlePart) return '';

        if (Array.isArray(titlePart)) {
            return titlePart
                .map(tp => extractSingleTitle(tp))
                .filter(Boolean)
                .join('; ');
        }

        return extractSingleTitle(titlePart);
    }

    function extractSingleTitle(tp) {
        if (!tp || typeof tp !== 'object') return '';

        const { text } = tp;

        if (Array.isArray(text)) {
            return text.map(str => str.trim()).filter(Boolean).join(' ');
        }

        if (typeof text === 'string') {
            return text.trim();
        }

        if (typeof text === 'object' && text.text) {
            return typeof text.text === 'string' ? text.text.trim() : '';
        }

        return '';
    }

    function buildIPCSymbolDefinitionMap(definition) {

        const classificationItems = definition?.['world-patent-data']?.['classification-scheme']?.cpc?.['class-scheme']?.['classification-item'];
        if (!Array.isArray(classificationItems)) return {};

        const ipcMap = {};
        classificationItems.forEach(item => {
            const ipcSymbol = item?.['classification-symbol'];
            if (!ipcSymbol) return;
            const classTitle = item['class-title'];

            let defText = '';
            if (classTitle?.['title-part']) {
                defText = extractTitleParts(classTitle['title-part']);
            }
            if (defText) {
                ipcMap[ipcSymbol] = defText;
            }
        });
        return ipcMap;
    }


    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setLoading(true);
    //     setError('');

    //     try {
            // const data = await file.arrayBuffer();

            // const workbook = await XLSX.read(data, { type: 'buffer' });

            // const sheetName = workbook.SheetNames[0];
            // const worksheet = workbook.Sheets[sheetName];

            // const jsonData = await XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // if (jsonData.length < 2) {
            //     setError('Sheet does not have enough rows.');
            //     return;
            // }

            // const header = jsonData[0];
            // const rows = jsonData.slice(1);

            // const secondColumnValues = await rows
            //     .map(row => row[1])
            //     .filter(val => val !== undefined && val !== null && val !== '');

            // const commaSeparated = secondColumnValues.join(',');
            // const response = await axios.get(`http://localhost:8080/api/ipc-definition/${commaSeparated}`);

            // const rootItem = response.data?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
            // const params = response.data?.param || [];

            // const ipcMap = await getIpcClassificationTitles(rootItem, params);
            // console.log('ipcMap :>> ', ipcMap);
            // setDefinition(ipcMap);

            // const objectRows = rows.map((row, index) => {
            //     const classCode = row[1];
            //     if (!classCode) return null;

            //     const level1 = classCode[0];
            //     const level2 = classCode.length >= 3 ? classCode.slice(0, 3) : '';
            //     const level3 = classCode.length >= 4 ? classCode : '';

            //     return {
            //         'S.No': index + 1,
            //         'Class': classCode,
            //         'Level 1 Definition': definition[level1] || '',
            //         'Level 2 Definition': definition[level2] || '',
            //         'Level 3 Definition': definition[level3] || '',
            //         'Definition of Given Class': definition[classCode] || '',
            //     };
            // }).filter(row => row !== null);

            // // const objectRows = rows.map(row => ({
            // //     [header[0]]: row[0],
            // //     [header[1]]: row[1],
            // // }));

            // setUploadedRows(objectRows);
    //     } catch (err) {
    //         console.error(err);
    //         setError('Error processing the file.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };


    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setLoading(true);
    //     setError('');

    //     try {
            // const data = await file.arrayBuffer();
            // const workbook = await XLSX.read(data, { type: 'buffer' });

            // const sheetName = workbook.SheetNames[0];
            // const worksheet = workbook.Sheets[sheetName];

            // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // if (jsonData.length < 2) {
            //     setError('Sheet does not have enough rows.');
            //     setLoading(false);
            //     return;
            // }

            // const rows = jsonData.slice(1);

            // // const classCodes = rows
            // //     .map(row => row[1])
            // //     .filter(val => val !== undefined && val !== null && val !== '')
            // //     .map(val => val.trim());

            // const classCodes = rows
            //     .map(row => row[1])
            //     .filter(val => val !== undefined && val !== null && val !== '')
            //     .map(val => val.replace(/\s+/g, '').trim());


            // const commaSeparated = classCodes.join(',');
            // const response = await axios.get(`http://localhost:8080/api/ipc-definition/${encodeURIComponent(commaSeparated)}`);

            // const rootItem = response.data?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
            // const params = response.data?.param || [];

            // const ipcMap = await getIpcClassificationTitles(rootItem, params);
            // setDefinition(ipcMap);

            // const objectRows = rows.map((row, index) => {
            //     const classCode = row[1]?.trim();
            //     if (!classCode) return null;

            //     return {
            //         'S.No': index + 1,
            //         'Class': classCode,
            //     };
            // }).filter(Boolean);

            // setUploadedRows(objectRows);
    //     } catch (error) {
    //         console.error('Error uploading or processing file:', error);
    //         setError('Failed to process the uploaded file.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');

    //     let maxLevelCount = 3;
    //     const updatedData = uploadedRows.map((row, index) => {
    //         const classCode = row.Class?.trim();
    //         if (!classCode) return null;

    //         const levels = definition[classCode] || [];
    //         maxLevelCount = Math.max(maxLevelCount, levels.length);

    //         const getTitle = (code) => {
    //             const entry = definition[code];
    //             if (Array.isArray(entry) && entry.length > 0) {
    //                 return entry[entry.length - 1].title;
    //             }
    //             return '';
    //         };

    //         const rowData = {
    //             'S.No': index + 1,
    //             'Class': classCode,
    //         };

    //         for (let i = 0; i < levels.length; i++) {
    //             rowData[`Level ${i + 1} Definition`] = levels[i]?.title || 'Definition not found';
    //         }

    //         rowData['Definition of Given Class'] = getTitle(classCode);
    //         return rowData;
    //     }).filter(Boolean);

    //     if (updatedData.length === 0) {
    //         alert('No valid rows with class codes found.');
    //         return;
    //     }

    //     const headers = ['S.No', 'Class'];
    //     for (let i = 1; i <= maxLevelCount; i++) {
    //         headers.push(`Level ${i} Definition`);
    //     }
    //     headers.push('Definition of Given Class');

    //     const normalizedData = updatedData.map(row => {
    //         const normalizedRow = {};
    //         headers.forEach(header => {
    //             normalizedRow[header] = row[header] || '';
    //         });
    //         return normalizedRow;
    //     });

    //     const newWorksheet = XLSX.utils.json_to_sheet(normalizedData, { header: headers });
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };




    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setUploadedFileName(file.name);
    //     setLoading(true);
    //     setUploadProgress(10);

    //     try {
    //         const data = await file.arrayBuffer();
    //         setUploadProgress(25);

    //         const workbook = await XLSX.read(data, { type: 'buffer' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         setUploadProgress(40);

    //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    //         if (jsonData.length < 2) {
    //             setError('Sheet does not have enough rows.');
    //             setLoading(false);
    //             return;
    //         }

    //         const rows = jsonData.slice(1);
    //         const classCodes = rows
    //             .map(row => row[1])
    //             .filter(val => val !== undefined && val !== null && val !== '')
    //             .map(val => val.replace(/\s+/g, '').trim());

    //         setUploadProgress(55);

    //         const commaSeparated = classCodes.join(',');

    //         const response = await axios.get(`http://localhost:8080/api/ipc-definition/${encodeURIComponent(commaSeparated)}`);
    //         setUploadProgress(75);

    //         const rootItem = response.data?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
    //         const params = response.data?.param || [];

    //         const ipcMap = await getIpcClassificationTitles(rootItem, params);
    //         setDefinition(ipcMap);
    //         setUploadProgress(90);

    //         const objectRows = rows.map((row, index) => {
    //             const classCode = row[1]?.trim();
    //             if (!classCode) return null;

    //             return {
    //                 'S.No': index + 1,
    //                 'Class': classCode,
    //             };
    //         }).filter(Boolean);

    //         setUploadedRows(objectRows);
    //         setUploadProgress(100);

    //     } catch (err) {
    //         console.error(err);
    //         toast.error('❌ Error processing file.');
    //     } finally {
    //         setTimeout(() => setUploadProgress(0), 1000);
    //         setLoading(false);
    //     }
    // };




//  Updated Api call
// const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setUploadedFileName(file.name);
//     setLoading(true);
//     setUploadProgress(10);

//     try {
//         const data = await file.arrayBuffer();
//         setUploadProgress(25);

//         const workbook = await XLSX.read(data, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[sheetName];
//         setUploadProgress(40);

//         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//         if (jsonData.length < 2) {
//             setError('Sheet does not have enough rows.');
//             setLoading(false);
//             toast.error("Invalid Excel file. Please check the format or download the sample file.", {
//                 position: "top-right"
//             });
//             return;
//         }

//         const rows = jsonData.slice(1);
//         const classCodes = rows
//             .map(row => row[1])
//             .filter(val => val !== undefined && val !== null && val !== '')
//             .map(val => val.replace(/\s+/g, '').trim());

//         setUploadProgress(55);

//         const commaSeparated = classCodes.join(',');

//         const response = await axios.get(`${BASE_URL}/api/ipc-definition/${encodeURIComponent(commaSeparated)}`);
//         // const response = await axios.get(`http://localhost:8080/api/ipc-definition/${encodeURIComponent(commaSeparated)}`);
//         setUploadProgress(75);

//         const rootItem = response.data?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
//         const params = response.data?.param || [];

//         const ipcMap = await getIpcClassificationTitles(rootItem, params);
//         setDefinition(ipcMap);
//         setUploadProgress(90);

//         const objectRows = rows.map((row, index) => {
//             const classCode = row[1]?.trim();
//             if (!classCode) return null;

//             return {
//                 'S.No': index + 1,
//                 'Class': classCode,
//             };
//         }).filter(Boolean);

//         setUploadedRows(objectRows);
//         setUploadProgress(100);

//         if (response.status === 200) {
//             toast.success("Correct Excel file format. File processed successfully.", {
//                 position: "top-right",
//                 autoClose: 3000,
//                 hideProgressBar: false,
//                 closeOnClick: true,
//                 pauseOnHover: true,
//                 draggable: true,
//                 progress: undefined,
//             });
//         }

//     } catch (err) {
//         console.error(err);
//         toast.error("❌ Invalid file format. Please download or view the sample file for correct structure.", {
//             position: "top-right",
//             autoClose: 5000,
//             closeOnClick: true,
//             pauseOnHover: true,
//         });
//     } finally {
//         setTimeout(() => setUploadProgress(0), 1000);
//         setLoading(false);
//     }
// };   



    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadedFileName(file.name);
        setLoading(true);
        setUploadProgress(10);

        try {
            const data = await file.arrayBuffer();
            setUploadProgress(25);

            const workbook = await XLSX.read(data, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            setUploadProgress(40);

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            if (jsonData.length < 2) {
                setError('Sheet does not have enough rows.');
                setLoading(false);
                toast.error("Invalid Excel file. Please check the format or download the sample file.", {
                    position: "top-right"
                });
                return;
            }

            const rows = jsonData.slice(1);
            const classCodes = rows
                .map(row => row[1])
                .filter(val => val !== undefined && val !== null && val !== '')
                .map(val => val.replace(/\s+/g, '').trim());

            setUploadProgress(55);

            const commaSeparated = classCodes.join(',');

            const responseData = await fetchIpcDefinitions(commaSeparated);
            setUploadProgress(75);

            const rootItem = responseData?.definition?.['world-patent-data']?.['classification-scheme']?.['cpc']?.['class-scheme']?.['classification-item'];
            const params = responseData?.param || [];

            const ipcMap = await getIpcClassificationTitles(rootItem, params);
            setDefinition(ipcMap);
            setUploadProgress(90);

            const objectRows = rows.map((row, index) => {
                const classCode = row[1]?.trim();
                if (!classCode) return null;

                return {
                    'S.No': index + 1,
                    'Class': classCode,
                };
            }).filter(Boolean);

            setUploadedRows(objectRows);
            setUploadProgress(100);

            toast.success("Correct Excel file format. File processed successfully.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });

        } catch (err) {
            console.error(err);
            toast.error("❌ Invalid file format. Please download or view the sample file for correct structure.", {
                position: "top-right",
                autoClose: 5000,
                closeOnClick: true,
                pauseOnHover: true,
            });
        } finally {
            setTimeout(() => setUploadProgress(0), 1000);
            setLoading(false);
        }
    };




    const handleClearFile = () => {
        setUploadedFileName('');
        setUploadedRows([]);
        setDefinition([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
        toast.info('📁 File removed.');
    };

    const handleDownloadExcel = () => {
        if (uploadedRows.length === 0) {
            toast.warn('⚠️ Please upload a file first.');
            return;
        }

        let maxLevelCount = 3;
        const updatedData = uploadedRows.map((row, index) => {
            const classCode = row.Class?.trim();
            const levels = definition[classCode] || [];

            maxLevelCount = Math.max(maxLevelCount, levels.length);

            const getTitle = (code) => {
                const entry = definition[code];
                return Array.isArray(entry) ? entry[entry.length - 1]?.title || '' : '';
            };

            const rowData = {
                'S.No': index + 1,
                'Class': classCode,
                'Definition of Given Class': getTitle(classCode),
            };

            for (let i = 0; i < levels.length; i++) {
                rowData[`Level ${i + 1} Definition`] = levels[i]?.title || 'Definition not found';
            }

            return rowData;
        });

        const headers = ['S.No', 'Class'];
        for (let i = 1; i <= maxLevelCount; i++) {
            headers.push(`Level ${i} Definition`);
        }
        headers.push('Definition of Given Class');

        const normalizedData = updatedData.map(row => {
            const norm = {};
            headers.forEach(h => (norm[h] = row[h] || ''));
            return norm;
        });

        const worksheet = XLSX.utils.json_to_sheet(normalizedData, { header: headers });
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Class Definitions');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, 'class_definitions.xlsx');
        toast.success('✅ Excel downloaded!');
    };




    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');
    //     console.log('uploadedRows :>> ', uploadedRows);

    //     const updatedData = uploadedRows.map((row, index) => {
    //         const classCode = row.Class?.trim();
    //         if (!classCode) return null;

    //         const level1Code = classCode.substring(0, 1);
    //         const level2Code = classCode.length >= 3 ? classCode.substring(0, 3) : '';
    //         const level3Code = classCode;

    //         const getTitle = (code) => {
    //             const entry = definition[code];
    //             if (Array.isArray(entry) && entry.length > 0) {
    //                 return entry[entry.length - 1].title;
    //             }
    //             return '';
    //         };

    //         const level = classCode.length;

    //         let level1Def = '';
    //         let level2Def = '';
    //         let level3Def = '';
    //         let givenDef = '';

    //         if (level === 1) {
    //             level1Def = getTitle(level1Code);
    //             givenDef = level1Def;
    //         } else if (level <= 3) {
    //             level1Def = getTitle(level1Code);
    //             level2Def = getTitle(level2Code);
    //             givenDef = level2Def;
    //         } else {
    //             level1Def = getTitle(level1Code);
    //             level2Def = getTitle(level2Code);
    //             level3Def = getTitle(level3Code);
    //             givenDef = level3Def;
    //         }

    //         return {
    //             'S.No': index + 1,
    //             'Class': classCode,
    //             'Level 1 Definition': level1Def,
    //             'Level 2 Definition': level2Def,
    //             'Level 3 Definition': level3Def,
    //             'Definition of Given Class': givenDef,
    //         };
    //     }).filter(Boolean);

    //     if (updatedData.length === 0) {
    //         alert('No valid rows with class codes found.');
    //         return;
    //     }

    //     const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };





    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');
    //     console.log('uploadedRows :>> ', uploadedRows);

    //     const updatedData = uploadedRows.map((row, index) => {
    //         const classCode = row.Class?.trim();
    //         if (!classCode) return null;

    //         const level1Code = classCode.substring(0, 1);
    //         const level2Code = classCode.substring(0, 3);
    //         const level3Code = classCode;

    //         const getTitle = (code) => {
    //             const entry = definition[code];
    //             if (Array.isArray(entry) && entry.length > 0) {
    //                 return entry[entry.length - 1].title;
    //             }
    //             return '';
    //         };
    //         console.log('level2Code :>> ', level2Code);
            
    //         return {
    //             'S.No': index + 1,
    //             'Class': classCode,
    //             'Level 1 Definition': getTitle(level1Code),
    //             'Level 2 Definition': getTitle(level2Code),
    //             'Level 3 Definition': getTitle(level3Code),
    //             'Definition of Given Class': getTitle(classCode),
    //         };
    //     }).filter(Boolean);

    //     if (updatedData.length === 0) {
    //         alert('No valid rows with class codes found.');
    //         return;
    //     }

    //     const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };


    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');

    //     const updatedData = uploadedRows.map((row, index) => {
    //         const classCode = row.Class?.trim();
    //         if (!classCode) return null;

    //         const level1Code = classCode.substring(0, 1);
    //         const level2Code = classCode.substring(0, 3);
    //         const level3Code = classCode;

    //         const getTitle = (code) => {
    //             const entry = definition[code];
    //             if (Array.isArray(entry) && entry.length > 0) {
    //                 return entry[entry.length - 1].title;
    //             }
    //             return '';
    //         };

    //         return {
    //             'S.No': index + 1,
    //             'Class': classCode,
    //             'Level 1 Definition': getTitle(level1Code),
    //             'Level 2 Definition': getTitle(level2Code),
    //             'Level 3 Definition': getTitle(level3Code),
    //             'Definition of Given Class': getTitle(classCode),
    //         };
    //     }).filter(Boolean);

    //     if (updatedData.length === 0) {
    //         alert('No valid rows with class codes found.');
    //         return;
    //     }

    //     const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };




    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     setLoading(true);
    //     setError('');

    //     try {
    //         const data = await file.arrayBuffer();
    //         const workbook = XLSX.read(data, { type: 'buffer' });
    //         const sheetName = workbook.SheetNames[0];
    //         const worksheet = workbook.Sheets[sheetName];
    //         const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

    //         if (jsonData.length < 2) {
    //             setError('Sheet does not have enough rows.');
    //             setLoading(false);
    //             return;
    //         }

    //         const header = jsonData[0];
    //         const rows = jsonData.slice(1);

    //         const secondColumnValues = rows
    //             .map(row => row[1])
    //             .filter(val => val !== undefined && val !== null && val !== '');

    //         const commaSeparated = secondColumnValues.join(',');

    //         const res = await axios.get(`http://localhost:8080/api/ipc-definition/${commaSeparated}`);
    //         const ipcMap = buildIPCSymbolDefinitionMap(res.data.definition);
    //         setDefinition(ipcMap);

    //         const objectRows = rows.map(row => ({
    //             [header[0]]: row[0],
    //             [header[1]]: row[1],
    //         }));

    //         setUploadedRows(objectRows);
    //     } catch (err) {
    //         console.error(err);
    //         setError('Error processing the file.');
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchDefinition = async () => {
        const classifyNumber = formatIPCCodes(ipcCode);
        if (!classifyNumber) return;

        setLoading(true);
        setError('');
        setDefinition([]);

        try {
            const res = await axios.get(`http://localhost:8080/api/ipc-definition/${ipcCode}`);
            console.log('inptData', res.data);
            // const ipcMap = buildIPCSymbolDefinitionMap(res.data.definition);

            // setDefinition(ipcMap);
            setDefinition(res.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };


    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');

    //     const updatedData = [];

    //     for (let i = 0; i < uploadedRows.length; i++) {
    //         const row = uploadedRows[i];

    //         if (!row.Class || row.Class.trim() === '') {
    //             break;
    //         }

    //         updatedData.push({
    //             'S.No': i + 1,
    //             'Class': row.Class,
    //             'Definition': definition[row?.Class] || 'No definition found',
    //         });
    //     }

    //     if (updatedData.length === 0) {
    //         alert('No valid rows with class codes found.');
    //         return;
    //     }

    //     const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };



    const ipcCodeList = ipcCode.trim().split(/\s+/);

    // const handleDownloadExcel = () => {
    //     if (uploadedRows.length === 0) return alert('Please upload a file first.');

    //     const updatedData = uploadedRows.map((row, index) => ({
    //         'S.No': index + 1,
    //         'Class': row.Class,
    //         'Definition': definition[row?.Class] || 'No definition found',
    //     }));


    //     const newWorksheet = XLSX.utils.json_to_sheet(updatedData);
    //     const newWorkbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Class Definitions');

    //     const excelBuffer = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'array' });
    //     const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    //     saveAs(blob, 'class_definitions.xlsx');
    // };



    return (
        <div style={{ padding: '2rem' }}>
            {/* <h2>IPC Definition Finder</h2>
            <input
                type="text"
                value={ipcCode}
                onChange={(e) => setIpcCode(e.target.value)}
                placeholder="Enter IPC Codes (e.g., B42C B27F B64B)"
                style={{ padding: '0.5rem', fontSize: '1rem' }}
            />
            <button onClick={fetchDefinition} style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}>
                Search
            </button> */}

            {/* <h2 style={styles.heading}>🔍 IPC Definition Finder</h2>
            <div style={styles.inputGroup}>
                <input
                    type="text"
                    value={ipcCode}
                    onChange={(e) => setIpcCode(e.target.value)}
                    placeholder="Enter IPC Codes (e.g., B42C B27F B64B)"
                    style={styles.input}
                    aria-label="IPC Code Input"
                />
                <button onClick={fetchDefinition} style={styles.button}>
                    Search
                </button>
            </div> */}


            <>
                <IPCExcelUploader
                    // definition={definition}
                    // handleFileUpload={handleFileUpload}
                    // uploadedRows={uploadedRows}
                    // handleDownloadExcel={handleDownloadExcel}
                    // loading={loading}

                    definition={definition}
                    handleFileUpload={handleFileUpload}
                    uploadedRows={uploadedRows}
                    handleDownloadExcel={handleDownloadExcel}
                    loading={loading}
                    uploadProgress={uploadProgress}
                    uploadedFileName={uploadedFileName}
                    handleClearFile={handleClearFile}
                    fileInputRef={fileInputRef}

                />
                <ToastContainer />
            </>

            {error && <p style={{ color: 'red' }}>{error}</p>}

          

            {/* {Object.keys(definition).length > 0 && (
                <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem' }}>
                    <h3>Definitions:</h3>
                    {ipcCodeList.map((code) => (
                        <div key={code} style={{ marginBottom: '0.5rem' }}>
                            <strong>{code}:</strong> {definition[ipcCodeList] || 'No definition found.'}
                        </div>
                    ))}
                </div>
            )} */}
        </div>
    );
};

export default IPCDefinition;