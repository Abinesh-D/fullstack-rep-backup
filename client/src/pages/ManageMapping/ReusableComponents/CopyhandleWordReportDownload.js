
// import {
//     Document, BorderStyle, Packer, Paragraph, TextRun, Table, TableRow, AlignmentType, TableCell, VerticalAlign, WidthType, ShadingType,
//     ExternalHyperlink, HeadingLevel, ImageRun, InternalHyperlink, Bookmark, Footer, Header, TabStopPosition, TabStopType,
//     UnderlineType,
// } from "docx";
// import { saveAs } from "file-saver";
// import { getSearchMethodology } from "./searchMethodology";
// import { generateAppendixSection } from "./generateAppendixSection";
// import {
//     blackBorders,
//     borderNone,
//     commonBorders,
//     createExecutiveSummaryParagraphs,
//     createExecutiveSummaryTable,
//     createFooter,
//     createHeader,
//     createPageProperties,
//     createParagraph,
//     createRelatedReferencesTable,
//     createRelevantReferencesTable,
//     createSingleColumnTableRows,
//     createTextRun,
//     createTickedParagraphs,
//     createTocTable,
//     createTwoColumnTickTable,
//     disclaimer,
//     formatAssigneeOrInventor,
//     generateBibliographicSection,
//     getFamilyMembersParagraphChildren,
//     getTocConfig,
//     getTocConfigSummary,
//     indent380,
//     margins150,
//     marginsStyle,
//     sanitizeText,
//     textStyle,
//     toTitleCase,
// } from "./docxUtils";



// // const textStyle = {
// //     arial24: { font: "Arial", size: 48 },
// //     arial14: { font: "Arial", size: 28 },
// //     arial11: { font: "Arial", size: 22 },
// //     arial10: { font: "Arial", size: 20 },
// //     arial13: { font: "Arial", size: 26 },
// //     arial8: { font: "Arial", size: 16 },
// // };

// // const commonBorders = {
// //     top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
// //     bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
// //     left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
// //     right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
// // };

// // const blackBorders = {
// //     top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
// //     bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
// //     left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
// //     right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
// // };

// // const borderNone = {
// //     top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
// //     bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
// //     left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
// //     right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
// // };

// // const marginsStyle = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }
// // const margins150 = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }

// // const indent380 = { left: 380, right: 380 };


// // function formatAssigneeOrInventor(str) {
// //     if (!str) return "";

// //     if (str.includes(";")) {
// //         return str.toLowerCase()
// //             .replace(/\b\w/g, char => char.toUpperCase());
// //     }

// //     return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
// // }

// // function toTitleCase(str) {
// //     if (!str) return "";
// //     return String(str)
// //         .toLowerCase()
// //         .split(" ")
// //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
// //         .join(" ");
// // };

// // const sanitizeText = (text) =>
// //     (text || "").replace(/[&<>"]/g, (c) => ({
// //         "&": "&amp;",
// //         "<": "&lt;",
// //         ">": "&gt;",
// //         "\"": "&quot;"
// //     }[c]));



// // async function getImageArrayBufferFromUrl(url) {
// //     const response = await fetch(url);
// //     const blob = await response.blob();
// //     return blob.arrayBuffer();
// // }


// const fetchImageBuffer = async (imageUrl) => {
//   const response = await fetch(imageUrl);
//   const buffer = await response.arrayBuffer();
//   return buffer;
// };



// export const handleWordReportDownload = async ({
//     introduction,
//     relevantReferences,
//     relatedReferences,
//     appendix1,
//     appendix2,
//     // projectImageUrl,
//     overallSummary,
//     getProjectValue,
//     relevantAndNplCombined
// }) => {

//     const typeId1 = getProjectValue.projectTypeId === "0001";
//     const typeId2 = getProjectValue.projectTypeId === "0002";

//     const header = createHeader(introduction.projectId);
//     const footer = createFooter();

//     // const createPageProperties(920, "portrait") = (margin = 920, orientation = "portrait") => ({
//     //     page: {
//     //         margin: {
//     //             top: margin,
//     //             bottom: margin,
//     //             left: margin,
//     //             right: margin,
//     //         },
//     //         size: {
//     //             orientation: orientation,
//     //             width: 15800,
//     //             height: 11573,
//     //         },
//     //     },
//     // });

//     // const createTextRun = (text, style = textStyle.arial11, overrides = {}) =>
//     //     new TextRun({ text, ...style, ...overrides });


//     // const createSingleColumnTableRows = (rows) =>
//     // rows.map(({ label, value, isParagraphChildren }) =>
//     //     new TableRow({
//     //         children: [
//     //             new TableCell({
//     //                 verticalAlign: AlignmentType.CENTER,
//     //                 children: [
//     //                     new Paragraph({
//     //                         children: [
//     //                             new TextRun({
//     //                                 text: `${label}:`,
//     //                                 bold: true,
//     //                             }),
//     //                         ],
//     //                     }),
//     //                 ],
//     //                 borders: borderNone,
//     //             }),
//     //             new TableCell({
//     //                 verticalAlign: AlignmentType.CENTER,
//     //                 children: [
//     //                     isParagraphChildren
//     //                         ? new Paragraph({ children: value })
//     //                         : new Paragraph({
//     //                             children: [
//     //                                 new TextRun({ text: value })
//     //                             ]
//     //                         }),
//     //                 ],
//     //                 borders: borderNone,
//     //             }),
//     //         ],
//     //     })
//     // );


//     // const header = new Header({
//     //     children: [
//     //         new Paragraph({
//     //             alignment: AlignmentType.CENTER,
//     //             children: [
//     //                 createTextRun(introduction.projectId || "", textStyle.arial10, { bold: true, color: "000000" })
//     //             ],
//     //         }),
//     //     ],
//     // });    

//     // const footer = new Footer({
//     //     children: [
//     //         new Paragraph({
//     //             alignment: AlignmentType.CENTER,
//     //             children: [
//     //                 new TextRun("CONFIDENTIAL"),
//     //             ],
//     //         }),
//     //         new Paragraph({
//     //             alignment: AlignmentType.END,
//     //             children: [
//     //                 new TextRun("Page "),
//     //                 new TextRun({
//     //                     children: ["CURRENT"],
//     //                     bold: true,
//     //                 }),
//     //                 new TextRun(" of "),
//     //                 new TextRun({
//     //                     children: ["TOTAL_PAGES"],
//     //                     bold: true,
//     //                 }),
//     //             ],
//     //         }),
//     //     ],
//     // });




//     // const cloudinaryUrls = (projectImageUrl || []).map(buf => buf?.base64Url).filter(Boolean);

//     // const imageBuffers = await Promise.all(
//     //     cloudinaryUrls.map(async (url) => await getImageArrayBufferFromUrl(url))
//     // );
//     // const IMAGES_PER_ROW = 4;

//     // const imageTableRows = [];
//     // for (let i = 0; i < imageBuffers.length; i += IMAGES_PER_ROW) {
//     //     const rowImages = imageBuffers.slice(i, i + IMAGES_PER_ROW);

//     //     const row = new TableRow({
//     //         children: rowImages.map((buffer) =>
//     //             new TableCell({
//     //                 children: [
//     //                     new Paragraph({
//     //                         alignment: AlignmentType.CENTER,
//     //                         children: [
//     //                             new ImageRun({
//     //                                 data: buffer,
//     //                                 transformation: {
//     //                                     width: 120,
//     //                                     height: 90,
//     //                                 },
//     //                             }),
//     //                         ],
//     //                     }),
//     //                 ],
//     //                 borders: {
//     //                     top: { style: "none" },
//     //                     bottom: { style: "none" },
//     //                     left: { style: "none" },
//     //                     right: { style: "none" },
//     //                 },
//     //             })
//     //         ),
//     //     });

//     //     imageTableRows.push(row);
//     // }
//     // const imageGridTable = new Table({
//     //     rows: imageTableRows,
//     //     width: {
//     //         size: 100,
//     //         type: "pct",
//     //     },
//     //     borders: {
//     //         top: { style: "none" },
//     //         bottom: { style: "none" },
//     //         left: { style: "none" },
//     //         right: { style: "none" },
//     //         insideHorizontal: { style: "none" },
//     //         insideVertical: { style: "none" },
//     //     },
//     // });



//     // function getFamilyMembersParagraphChildren(data, textStyle) {
//     //     const familyMembers = data.FamilyMembers || [];
//     //     const displayLimit = 4;
//     //     const totalCount = familyMembers.length;

//     //     const displayedMembers = familyMembers.slice(0, displayLimit).join(", ");
//     //     const remainingCount = totalCount - displayLimit;
//     //     const remainingText = remainingCount > 0 ? `+${remainingCount} more` : null;

//     //     const children = [
//     //         new TextRun({
//     //             text: sanitizeText(displayedMembers || "N/A"),
//     //             ...textStyle.arial10,
//     //         }),
//     //     ];

//     //     if (remainingText) {
//     //         children.push(
//     //             new ExternalHyperlink({
//     //                 link: data.hyperLink,
//     //                 children: [
//     //                     new TextRun({
//     //                         text: ` ${sanitizeText(remainingText)}`,
//     //                         ...textStyle.arial10BoldBlue,
//     //                         color: "0000FF",
//     //                         underline: true,
//     //                     }),
//     //                 ],
//     //             })
//     //         );
//     //     }

//     //     return children;
//     // }

//     const tocConfig = getTocConfig(relevantReferences);
//     const tocConfigSummary = getTocConfigSummary(relevantAndNplCombined);




//     // [
//     //     { label: "1.   Search Features", anchor: "typeID1-search-features", isBold: true },
//     //     { label: "2.   Search Methodology", anchor: "typeID1-search-methodology", isBold: true },
//     //     { label: "3.   Potentially Relevant References", anchor: "typeID1-relevant-toc", isBold: true },
//     //     { label: "4.   Potentially Relevant References", anchor: "typeID1-relevant-biblio", isBold: true },
//     //     ...(relevantReferences || []).map((ref, index) => ({
//     //         label: `${index + 1}.    ${ref.patentNumber}`,
//     //         anchor: `typeID1-${index + 1}`,
//     //         indent: 360,
//     //     })),
//     //     { label: "5.   Related References", anchor: "typeID1-related-references", isBold: true },
//     //     { label: "Appendix 1", anchor: "typeID1-appendix1", isBold: true },
//     //     { label: "Search Terms & Search Strings", anchor: "typeID1-search-terms", indent: 720, font13: true },
//     //     { label: "Data Availability", anchor: "typeID1-data-availability", indent: 720, font13: true },
//     //     { label: "Appendix 2", anchor: "typeID1-appendix2", isBold: true },
//     //     { label: "Databases", anchor: "typeID1-databases", indent: 720, font13: true },
//     //     { label: "Disclaimer", anchor: "typeID1-disclaimer", isBold: true },
//     // ];

//     //  [
//     //     { label: "1.   Search Features", anchor: "typeID2-search-features", isBold: true },
//     //     { label: "2.   Executive Summary", anchor: "typeID2-executive-summary", isBold: true },
//     //     { label: "3.   Potentially Relevant References", anchor: "typeID2-potentially-relevant-references", isBold: true },

//     //     ...(relevantAndNplCombined || [])?.map((map, index) => ({
//     //         label: `${index + 1}.    ${map.patentNumber}`,
//     //         anchor: `typeID2-${index + 1}`,
//     //         indent: 360,
//     //     })),
//     //     { label: "4.   Related References", anchor: "typeID2-related-references", isBold: true },
//     //     { label: "Appendix 1", anchor: "typeID2-appendix1", isBold: true },
//     //     { label: "Appendix 2", anchor: "typeID2-appendix2", isBold: true },
//     //     { label: "Search Terms & Search Strings", anchor: "typeID2-search-terms", indent: 720, font13: true },
//     //     { label: "Data Availability", anchor: "typeID2-data-availability", indent: 720, font13: true },
//     //     { label: "Appendix", anchor: "typeID2-appendix", isBold: true },
//     //     { label: "Databases", anchor: "typeID2-databases", indent: 720, font13: true },
//     //     { label: "Disclaimer", anchor: "typeID2-disclaimer", isBold: true },
//     //   ];

//     const relatedReferencesTable = createRelatedReferencesTable(relatedReferences);
    
//     // new Table({
//     //     width: { size: 100, type: WidthType.PERCENTAGE },
//     //     rows: [
//     //         new TableRow({
//     //             children: [
//     //                 "S. No",
//     //                 "Publication Number",
//     //                 "Title",
//     //                 "Assignee/Inventor",
//     //                 "Priority Date",
//     //                 "Publication Date",
//     //                 "Family Members",
//     //             ].map((header) =>
//     //                 new TableCell({
//     //                     verticalAlign: AlignmentType.CENTER,
//     //                     shading: {
//     //                         fill: "A7C7E7",
//     //                         type: ShadingType.CLEAR,
//     //                         color: "auto",
//     //                     },
//     //                     children: [
//     //                         new Paragraph({
//     //                             alignment: AlignmentType.CENTER,
//     //                             spacing: { before: 20, after: 0 },
//     //                             children: [
//     //                                 createTextRun(header, textStyle.arial10, { bold: true }),
//     //                             ],
//     //                         }),
//     //                     ],
//     //                     borders: commonBorders,
//     //                 })
//     //             ),
//     //         }),
//     //         ...(relatedReferences || []).map((pub, index) =>
//     //             new TableRow({
//     //                 children: [
//     //                     new TableCell({
//     //                         width: { size: 5, type: WidthType.PERCENTAGE, },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 alignment: AlignmentType.CENTER,
//     //                                 children: [
//     //                                     createTextRun(String(index + 1), textStyle.arial10),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                     new TableCell({
//     //                         width: { size: 15, type: WidthType.PERCENTAGE, },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 indent: { left: 50 },
//     //                                 children: [
//     //                                     new ExternalHyperlink({
//     //                                         link: pub.relatedPublicationUrl,
//     //                                         children: [
//     //                                             createTextRun(
//     //                                                 sanitizeText(pub.publicationNumber.toUpperCase()),
//     //                                                 textStyle.arial10,
//     //                                                 { style: "Hyperlink" }
//     //                                             ),
//     //                                         ],
//     //                                     }),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                     new TableCell({
//     //                         width: { size: 20, type: WidthType.PERCENTAGE, },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         margins: margins150.margins,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 children: [
//     //                                     createTextRun(
//     //                                         sanitizeText(toTitleCase(pub.relatedTitle)),
//     //                                         textStyle.arial10
//     //                                     ),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                     new TableCell({
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         margins: margins150.margins,
//     //                         width: { size: 20, type: WidthType.PERCENTAGE, },
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 children: [
//     //                                     createTextRun(
//     //                                         pub.relatedAssignee?.length
//     //                                             ? pub.relatedAssignee.map(formatAssigneeOrInventor).join('; ')
//     //                                             : pub.relatedInventor?.map(formatAssigneeOrInventor).join('; ') || 'N/A',
//     //                                         textStyle.arial10
//     //                                     ),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                     new TableCell({
//     //                         width: { size: 10, type: WidthType.PERCENTAGE },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         margins: margins150.margins,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 children: [
//     //                                     createTextRun(
//     //                                         sanitizeText(pub.relatedPriorityDate || "N/A"),
//     //                                         textStyle.arial10
//     //                                     ),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                     new TableCell({
//     //                         width: { size: 10, type: WidthType.PERCENTAGE },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         margins: margins150.margins,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 children: [
//     //                                     createTextRun(
//     //                                         sanitizeText(pub.relatedPublicationDate || "N/A"),
//     //                                         textStyle.arial10
//     //                                     ),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),

//     //                     new TableCell({
//     //                         width: { size: 20, type: WidthType.PERCENTAGE },
//     //                         verticalAlign: VerticalAlign.CENTER,
//     //                         margins: margins150.margins,
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.LEFT,
//     //                                 spacing: { before: 20, after: 0 },
//     //                                 children: getFamilyMembersParagraphChildren({ FamilyMembers: pub.relatedFamilyMembers, hyperLink: pub.relatedPublicationUrl },
//     //                                     textStyle),
//     //                             }),
//     //                         ],
//     //                         borders: commonBorders,
//     //                     }),
//     //                 ],
//     //             }),
//     //         ),
//     //         new TableRow({
//     //             children: [
//     //                 new TableCell({
//     //                     columnSpan: 7,
//     //                     borders: borderNone,
//     //                     children: [
//     //                         new Paragraph({
//     //                             alignment: AlignmentType.RIGHT,
//     //                             spacing: { before: 50, after: 0 },
//     //                             children: [
//     //                                 new InternalHyperlink({
//     //                                     anchor: "back-to-table-of-content",
//     //                                     children: [
//     //                                         createTextRun("Back to Table of Contents", textStyle.arial8, {
//     //                                             color: "0000FF",
//     //                                             underline: { type: UnderlineType.SINGLE }
//     //                                         }),
//     //                                     ],
//     //                                 }),
//     //                             ],
//     //                         }),
//     //                     ],
//     //                 }),
//     //             ],
//     //         })
//     //     ],
//     // });

//     // const createTickedParagraphs = (input) => {
//     //     const normalized = input.replace(/\n/g, ',');
//     //     let items = normalized
//     //         .split(',')
//     //         .map(part => part.trim())
//     //         .filter(Boolean);

//     //     if (items.length > 1) {
//     //         const last = items[items.length - 1].toLowerCase();
//     //         if (last === 'etc' || last === 'etc.') {
//     //             const secondLast = items[items.length - 2];
//     //             items = items.slice(0, -2).concat(`${secondLast}, etc.`);
//     //         }
//     //     }

//     //     return items.map((item) =>
//     //         new Paragraph({
//     //             indent: { left: 880 },
//     //             spacing: { after: 0 },
//     //             children: [
//     //                 createTextRun(`✓ ${item}`, textStyle.arial10),
//     //             ],
//     //         })
//     //     );
//     // };

//      // Table Header Row
//     // const headerRow = new TableRow({
//     //     children: [
//     //         "S. No",
//     //         "Patents Literatures",
//     //         "Heading 1",
//     //         "Heading 2",
//     //         "Heading 3",
//     //         "Heading 4",
//     //         "Heading 5",
//     //     ].map((header, index) =>
//     //         new TableCell({
//     //             verticalAlign: VerticalAlign.CENTER,
//     //             shading: {
//     //                 fill: index < 2 ? "C2D38B" : "A7C7E7",
//     //                 type: ShadingType.CLEAR,
//     //                 color: "auto",
//     //             },
//     //             children: [
//     //                 new Paragraph({
//     //                     alignment: AlignmentType.CENTER,
//     //                     spacing: { before: 20, after: 0 },
//     //                     children: [
//     //                         createTextRun(header, textStyle.arial10, { bold: true }),
//     //                     ],
//     //                 }),
//     //             ],
//     //             borders: blackBorders,
//     //         })
//     //     ),
//     // });

//     // const dataRows = relevantAndNplCombined.map((value, index) => {
//     //     return new TableRow({
//     //         children: [
//     //             new TableCell({
//     //                 verticalAlign: VerticalAlign.CENTER,
//     //                 children: [
//     //                     new Paragraph({
//     //                         text: String(index + 1),
//     //                         alignment: AlignmentType.CENTER,
//     //                     }),
//     //                 ],
//     //                 borders: commonBorders,
//     //             }),

//     //             new TableCell({
//     //                 verticalAlign: VerticalAlign.CENTER,
//     //                 children: [
//     //                     new Paragraph({
//     //                         alignment: AlignmentType.START,
//     //                         spacing: { before: 10, after: 10 },
//     //                         indent: { left: 50 },
//     //                         children: value.publicationUrl
//     //                             ? [
//     //                                 new ExternalHyperlink({
//     //                                     children: [
//     //                                         createTextRun(value.patentNumber, textStyle.arial10, {
//     //                                             color: "0000FF",
//     //                                             underline: {},
//     //                                         }),
//     //                                     ],
//     //                                     link: value.publicationUrl,
//     //                                 }),
//     //                             ]
//     //                             : [createTextRun(value.patentNumber, textStyle.arial10)],
//     //                     }),
//     //                 ],
//     //                 borders: commonBorders,
//     //             }),
//     //             // Placeholder empty cells
//     //             ...Array(5).fill("").map(() =>
//     //                 new TableCell({
//     //                     verticalAlign: VerticalAlign.CENTER,
//     //                     children: [new Paragraph("")],
//     //                     borders: commonBorders,
//     //                 })
//     //             ),
//     //         ],
//     //     });
//     // });

//     // Executive Summary Table
//     const ExecutiveSummaryTable = createExecutiveSummaryTable({
//         data: relevantAndNplCombined,
//         dynamicHeadings: ["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"],
//     });
    
//     // new Table({
//     //     width: { size: 80, type: WidthType.PERCENTAGE },
//     //     alignment: AlignmentType.CENTER,
//     //     rows: [headerRow, ...dataRows],
//     // });

//     // Summary Paragraphs
//     const summaryParagraphs = createExecutiveSummaryParagraphs();


//     // [
//     //     new Paragraph({
//     //         alignment: AlignmentType.LEFT,
//     //         spacing: { before: 100, after: 100 },
//     //         indent: indent380,
//     //         children: [
//     //             createTextRun("The patent literatures identified through quick search disclose the features defined in the objective as summarized in the above table."),
//     //         ],
//     //     }),
//     //     new Paragraph({
//     //         alignment: AlignmentType.LEFT,
//     //         spacing: { before: 100, after: 100 },
//     //         indent: indent380,
//     //         children: [
//     //             createTextRun("The shortlisted prior arts disclose a volatile composition dispenser/air freshener housing has a removable bottom portion with protrusion and replaceable cartridge."),
//     //         ],
//     //     }),
//     //     new Paragraph({
//     //         alignment: AlignmentType.LEFT,
//     //         spacing: { before: 100, after: 100 },
//     //         indent: indent380,
//     //         children: [
//     //             createTextRun("The shortlisted prior arts does not specifically disclose 5mm of protrusion on the exterior wall of the cartridges."),
//     //         ],
//     //     }),
//     // ];




// // const tocTitle = new Paragraph({
// //   alignment: AlignmentType.CENTER,
// //   children: [
// //     new Bookmark({
// //       id: "back-to-table-of-content",
// //       children: [
// //         createTextRun("Table of Contents", textStyle.arial14, { bold: true, underline: true }),
// //       ],
// //     }),
// //   ],
// //   spacing: { after: 200, before: 100 },
// // });

// // const tocTitle = new Paragraph({
// //             alignment: AlignmentType.CENTER,
// //             children: [
// //                 new Bookmark({
// //                     id: "back-to-table-of-content",
// //                     children: [
// //                         createTextRun("Table of Contents", textStyle.arial14, { bold: true, underline: true })
// //                     ]
// //                 })
// //             ],
// //             spacing: { after: 200, before: 100 },
// //         });



//     const tocTitle = createParagraph(
//         new Bookmark({
//             id: "back-to-table-of-content",
//             children: [
//                 createTextRun("Table of Contents", textStyle.arial14, { bold: true, underline: true }),
//             ],
//         }),
//         {
//             alignment: AlignmentType.CENTER,
//             spacing: { after: 200, before: 100 },
//         }
//     );
//     const tocItems = (typeId2 && tocConfigSummary) || (typeId1 && tocConfig);
//     const tocTable = createTocTable(tocItems);
//     const relevantReferencesTable = createRelevantReferencesTable(relevantReferences, typeId1 ? "typeId1" : "typeId2");




//     // new Table({
//     //     width: { size: 50, type: WidthType.PERCENTAGE },
//     //     alignment: AlignmentType.CENTER,
//     //     borders: {
//     //         top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //         bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //         left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //         right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //         insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //         insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//     //     },
//     //     rows: [
//     //         new TableRow({
//     //             children: [
//     //                 new TableCell({
//     //                     verticalAlign: AlignmentType.CENTER,
//     //                     shading: { fill: "A7C7E7" },
//     //                     columnSpan: 2,
//     //                     children: [
//     //                         new Paragraph({
//     //                             alignment: AlignmentType.CENTER,
//     //                             spacing: { before: 30, after: 10 },
//     //                             children: [
//     //                                 createTextRun("Relevant Prior Arts", { bold: true }),
//     //                             ],
//     //                         }),
//     //                     ],
//     //                 }),
//     //             ],
//     //         }),
//     //         new TableRow({
//     //             children: [
//     //                 new TableCell({
//     //                     verticalAlign: AlignmentType.CENTER,
//     //                     columnSpan: 2,
//     //                     children: [
//     //                         new Paragraph({
//     //                             alignment: AlignmentType.CENTER,
//     //                             spacing: { before: 30, after: 10 },
//     //                             children: [
//     //                                 createTextRun("Patent/Publications", { bold: true }),
//     //                             ],
//     //                         }),
//     //                     ],
//     //                 }),
//     //             ],
//     //         }),

//     //         ...(relevantReferences ? relevantReferences.map((ref, index) =>
//     //             new TableRow({
//     //                 children: [
//     //                     new TableCell({
//     //                         verticalAlign: AlignmentType.CENTER,
//     //                         width: { size: 50, type: WidthType.PERCENTAGE },
//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.CENTER,
//     //                                 spacing: { before: 50 },
//     //                                 children: [
//     //                                     new InternalHyperlink({
//     //                                         anchor: `typeId1-${ref.patentNumber}`,
//     //                                         children: [
//     //                                             createTextRun(`Reference ${index + 1}`, { color: "0000FF", underline: true, }),
//     //                                         ],
//     //                                     })
//     //                                 ]
//     //                             }),
//     //                         ],
//     //                     }),
//     //                     new TableCell({
//     //                         verticalAlign: AlignmentType.CENTER,
//     //                         width: { size: 50, type: WidthType.PERCENTAGE },

//     //                         children: [
//     //                             new Paragraph({
//     //                                 alignment: AlignmentType.START,
//     //                                 spacing: { before: 50 },
//     //                                 indent: { left: 100 },
//     //                                 children: [
//     //                                     new ExternalHyperlink({
//     //                                         link: ref.publicationUrl,
//     //                                         children: [
//     //                                             createTextRun(ref.patentNumber, { color: "0000FF", underline: true, }),
//     //                                         ],
//     //                                     }),
//     //                                 ],
//     //                             }),
//     //                         ],
//     //                     }),
//     //                 ],
//     //             })
//     //         ) : []),
//     //     ],
//     // });

        

//         // const tocTable = new Table({
//         //     width: {
//         //         size: 95,
//         //         type: WidthType.PERCENTAGE,
//         //     },
//         //     indent: {
//         //         size: 0,
//         //         type: WidthType.DXA,
//         //     },
//         //     alignment: AlignmentType.CENTER,
//         //     rows: ((typeId2 && tocConfigSummary) || (typeId1 && tocConfig)).map(item =>
//         //         new TableRow({
//         //             children: [
//         //                 new TableCell({
//         //                     children: [
//         //                         new Paragraph({
//         //                             spacing: { before: 0, after: 0 },
//         //                             indent: item.indent ? { left: item.indent } : undefined,
//         //                             tabStops: [
//         //                                 {
//         //                                     type: TabStopType.RIGHT,
//         //                                     position: TabStopPosition.MAX,
//         //                                     leader: "dot",
//         //                                 },
//         //                             ],
//         //                             children: [
//         //                                 new InternalHyperlink({
//         //                                     anchor: item.anchor,
//         //                                     children: [
//         //                                         createTextRun(item.label, textStyle.arial10, {
//         //                                             bold: item.isBold || false,
//         //                                             size: item.font13 ? 26 : 22,
//         //                                         }),
//         //                                     ],
//         //                                 }),
//         //                             ],
//         //                         }),
//         //                     ],
//         //                     borders: {
//         //                         top: { style: BorderStyle.NONE },
//         //                         bottom: { style: BorderStyle.NONE },
//         //                         left: { style: BorderStyle.NONE },
//         //                         right: { style: BorderStyle.NONE },
//         //                     },
//         //                 }),
//         //                 new TableCell({
//         //                     children: [
//         //                         new Paragraph({
//         //                             alignment: AlignmentType.RIGHT,
//         //                             tabStops: [
//         //                                 {
//         //                                     type: TabStopType.RIGHT,
//         //                                     position: TabStopPosition.MAX,
//         //                                     leader: "dot",
//         //                                 },
//         //                             ],

//         //                             children: [

//         //                                 createTextRun("0", textStyle.arial10),
//         //                             ],
//         //                         }),
//         //                     ],
//         //                     borders: {
//         //                         top: { style: BorderStyle.NONE },
//         //                         bottom: { style: BorderStyle.NONE },
//         //                         left: { style: BorderStyle.NONE },
//         //                         right: { style: BorderStyle.NONE },
//         //                     },
//         //                 }),
//         //             ],
//         //         })
//         //     ),
//         //     borders: {
//         //         top: { style: BorderStyle.NONE },
//         //         bottom: { style: BorderStyle.NONE },
//         //         left: { style: BorderStyle.NONE },
//         //         right: { style: BorderStyle.NONE },
//         //         insideHorizontal: { style: BorderStyle.NONE },
//         //         insideVertical: { style: BorderStyle.NONE },
//         //     },
//         // });







    // const appendix1Childern = []

    // if (typeId2) {
    //     appendix1Childern.push(
    //         ...generateAppendixSection({
    //             appendixNumber: 2,
    //             appendixData: appendix1,
    //             typeIdKey: "typeID2",
    //             isType1: false
    //         })
    //     );
    // } else if (typeId1) {
    //     appendix1Childern.push(
    //         ...generateAppendixSection({
    //             appendixNumber: 1,
    //             appendixData: appendix1,
    //             typeIdKey: "typeID1",
    //             isType1: true
    //         })
    //     );
    // }



    // if (typeId2) {
    //     appendix1Childern.push(
    //         new Paragraph({
    //             children: [
    //                 new Bookmark({
    //                     id: typeId2 ? "typeID2-appendix2" : "typeID1-appendix1",
    //                     children: [
    //                         createTextRun(typeId2 ? "Appendix 2" : typeId1 ? "Appendix 1" : "", textStyle.arial14, { bold: true, color: "000000" }),
    //                     ],
    //                 }),
    //             ],
    //             heading: HeadingLevel.HEADING_1,
    //             alignment: AlignmentType.START,
    //             spacing: { after: 50 },
    //             indent: { left: 600 },
    //         }),

    //         new Paragraph({
    //             children: [
    //                 new Bookmark({
    //                     id: "typeID2-search-terms",
    //                     children: [
    //                         createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
    //                     ]
    //                 }),
    //             ],
    //             heading: HeadingLevel.HEADING_2,
    //             alignment: AlignmentType.START,
    //             spacing: { after: 30 },
    //             indent: { left: 920 },
    //         }),

    //         new Paragraph({
    //             children: [
    //                 createTextRun(
    //                     "The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.",
    //                     textStyle.arial10
    //                 ),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { after: 30 },
    //             indent: { left: 600 },
    //         }),

    //         // baseSearchTerms
    //         new Paragraph({
    //             children: [
    //                 createTextRun("Base Search Terms", textStyle.arial11, { bold: true }),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { before: 50, after: 20 },
    //             indent: { left: 720 },
    //         }),
    //         ...(appendix1?.baseSearchTerms ?
    //             appendix1?.baseSearchTerms?.map(term =>
    //                 new Paragraph({
    //                     children: [
    //                         createTextRun(`●    ${term.searchTermText} – ${term.relevantWords}`, textStyle.arial10),
    //                     ],
    //                     alignment: AlignmentType.START,
    //                     spacing: { before: 20, after: 20 },
    //                     indent: { left: 880 },
    //                 })
    //             ) : []),

    //         // Search Strings
    //         new Paragraph({
    //             children: [
    //                 createTextRun("Search Strings", textStyle.arial11, { bold: true }),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { before: 200, after: 20 },
    //             indent: { left: 720 },
    //         }),
    //         // Key Search Strings
    //         new Table({
    //             width: {
    //                 size: 100,
    //                 type: WidthType.PERCENTAGE,
    //             },
    //             rows: [
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             width: { size: 5, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             shading: { fill: "353839" },
    //                             children: [
    //                                 new Paragraph({
    //                                     spacing: { before: 30, after: 30 },
    //                                     alignment: AlignmentType.CENTER,
    //                                     children: [
    //                                         createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                         new TableCell({
    //                             width: { size: 80, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             shading: { fill: "353839" },
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 30, after: 30 },
    //                                     children: [
    //                                         createTextRun("Key Strings (Orbit, Google Patents, Google Scholar, etc.)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                         new TableCell({
    //                             width: { size: 10, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             shading: { fill: "353839" },
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 30, after: 30 },
    //                                     children: [
    //                                         createTextRun("Database", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                         new TableCell({
    //                             width: { size: 5, type: WidthType.PERCENTAGE },
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             shading: { fill: "353839" },
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 30, after: 30 },
    //                                     children: [
    //                                         createTextRun("Hits", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                     ],
    //                 }),
    //                 // Data Rows
    //                 ...appendix1?.keyStrings?.map((keyStr, index) =>
    //                     new TableRow({
    //                         children: [
    //                             new TableCell({
    //                                 width: { size: 5, type: WidthType.PERCENTAGE },
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.CENTER,
    //                                         children: [
    //                                             createTextRun(`${index + 1}.`, textStyle.arial10),
    //                                         ],
    //                                     }),
    //                                 ],
    //                             }),
    //                             new TableCell({
    //                                 width: { size: 80, type: WidthType.PERCENTAGE },
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.LEFT,
    //                                         spacing: { before: 20, after: 20 },
    //                                         indent: { left: 80 },
    //                                         children: [
    //                                             createTextRun(keyStr.keyStringsText, textStyle.arial10),
    //                                         ],
    //                                     }),
    //                                 ],
    //                             }),
    //                             new TableCell({
    //                                 width: { size: 10, type: WidthType.PERCENTAGE },
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.CENTER,
    //                                         children: [
    //                                             createTextRun("", textStyle.arial10), 
    //                                         ],
    //                                     }),
    //                                 ],
    //                             }),
    //                             new TableCell({
    //                                 width: { size: 5, type: WidthType.PERCENTAGE },
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.CENTER,
    //                                         children: [
    //                                             createTextRun("", textStyle.arial10),
    //                                         ],
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     })
    //                 ),
    //             ],
    //             borders: {
    //                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //             },
    //         }),
    //         new Paragraph({
    //             alignment: AlignmentType.RIGHT,
    //             children: [
    //                 new InternalHyperlink({
    //                     anchor: "back-to-table-of-content",
    //                     children: [
    //                         createTextRun("Back to Table of Contents", {
    //                             color: "0000FF",
    //                             underline: true,
    //                             size: 16,
    //                             font: "Arial",
    //                         }),
    //                     ],
    //                 }),
    //             ],
    //             spacing: { before: 50, after: 0 },
    //         }),

    //         // Data Availability
    //         new Paragraph({ 
    //             children: [
    //                 new Bookmark({
    //                     id: "typeID2-data-availability",
    //                     children: [
    //                         createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
    //                     ]
    //                 })
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { before: 200, after: 100 },
    //             indent: { left: 720 },
    //             heading: HeadingLevel.HEADING_2,
    //         }),

    //         ...(appendix1?.dataAvailability ?
    //             appendix1?.dataAvailability?.map(mapData =>
    //                 new Paragraph({
    //                     children: [
    //                         createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
    //                     ],
    //                     alignment: AlignmentType.START,
    //                     spacing: { after: 50 },
    //                     indent: { left: 720 },
    //                 })
    //             ) : [])
    //     );
    // } else if (typeId1) {
    //     appendix1Childern.push(
    //         new Paragraph({
    //             children: [
    //                 new Bookmark({
    //                     id: "typeID1-appendix1",
    //                     children: [
    //                         createTextRun("Appendix 1", textStyle.arial14, { bold: true, color: "000000" }),
    //                     ],
    //                 }),
    //             ],
    //             heading: HeadingLevel.HEADING_1,
    //             alignment: AlignmentType.START,
    //             spacing: { after: 50 },
    //             indent: { left: 600 },
    //         }),
    //         // Search Terms & Search Strings
    //         new Paragraph({
    //             children: [
    //                    new Bookmark({
    //                     id: "typeID1-search-terms",
    //                     children: [
    //                         createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
    //                     ]
    //                 }),
    //             ],
    //             heading: HeadingLevel.HEADING_2,
    //             alignment: AlignmentType.START,
    //             spacing: { after: 30 },
    //             indent: { left: 920 },
    //         }),
    //         new Paragraph({
    //             children: [
    //                 createTextRun("The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.", textStyle.arial10),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { after: 30 },
    //             indent: { left: 600 },
    //         }),
    //         new Paragraph({
    //             children: [
    //                 createTextRun("▶ Search Terms", textStyle.arial11, { bold: true }),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { before: 50, after: 20 },
    //             indent: { left: 720 },
    //         }),
    //         // Search Terms Table
    //         new Table({
    //             width: { size: 92, type: WidthType.PERCENTAGE },
    //             alignment: AlignmentType.CENTER,
    //             rows: [
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     spacing: { before: 0, after: 0 },
    //                                     alignment: AlignmentType.START,
    //                                     indent: { left: 100 },
    //                                     children: [
    //                                         createTextRun("Key words", textStyle.arial10, { bold: true, color: "000000" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: { fill: "A7C7E7" },
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     spacing: { before: 0, after: 0 },
    //                                     alignment: AlignmentType.START,
    //                                     indent: { left: 100 },
    //                                     children: [
    //                                         createTextRun("Synonyms/Alternative terms", textStyle.arial10, { bold: true, color: "000000" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: { fill: "A7C7E7" },
    //                         }),
    //                     ],
    //                 }),

    //                 ...(appendix1?.baseSearchTerms
    //                     ? appendix1.baseSearchTerms.map((keyStr) =>
    //                         new TableRow({
    //                             children: [
    //                                 new TableCell({
    //                                     verticalAlign: VerticalAlign.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.LEFT,
    //                                             spacing: { before: 20, after: 20 },
    //                                             indent: { left: 100 },
    //                                             children: [
    //                                                 createTextRun(keyStr.searchTermText, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                                 new TableCell({
    //                                     verticalAlign: VerticalAlign.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.LEFT,
    //                                             spacing: { before: 20, after: 20 },
    //                                             indent: { left: 100 },
    //                                             children: [
    //                                                 createTextRun(keyStr.relevantWords, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         })
    //                     )
    //                     : [])

    //             ],
    //             borders: {
    //                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //             },
    //         }),
    //         // Search Strings Title
    //         new Paragraph({
    //             children: [
    //                 createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
    //             ],
    //             alignment: AlignmentType.START,
    //             spacing: { before: 200, after: 20 },
    //             indent: { left: 720 },
    //         }),
    //         // Key strings (Patents/Patent Applications)
    //         new Table({
    //             width: {
    //                 size: 100,
    //                 type: WidthType.PERCENTAGE,
    //             },
    //             rows: [
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     spacing: { before: 0, after: 0 },
    //                                     alignment: AlignmentType.CENTER,
    //                                     children: [
    //                                         createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 0, after: 0 },
    //                                     children: [
    //                                         createTextRun("Key strings (Patents/Patent Applications)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                     ],
    //                 }),

    //                 ...(appendix1?.keyStrings ?
    //                     appendix1?.keyStrings?.map((keyStr, index) =>
    //                         new TableRow({
    //                             children: [
    //                                 new TableCell({
    //                                     verticalAlign: AlignmentType.CENTER,
    //                                     width: { size: 5, type: WidthType.PERCENTAGE },
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.CENTER,
    //                                             children: [
    //                                                 createTextRun(`${index + 1}.`, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                                 new TableCell({
    //                                     verticalAlign: AlignmentType.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.LEFT,
    //                                             spacing: { before: 20, after: 20 },
    //                                             indent: { left: 80 },
    //                                             children: [
    //                                                 createTextRun(keyStr.keyStringsText, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         })
    //                     ) : []),
    //             ],
    //             borders: {
    //                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //             },
    //         }),
    //         // Key strings (Non-Patent Literatures)
    //         new Table({
    //             width: {
    //                 size: 100,
    //                 type: WidthType.PERCENTAGE,
    //             },
    //             rows: [
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     children: [
    //                                         createTextRun("", { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 0, after: 0 },
    //                                     children: [
    //                                         createTextRun("Key strings (Non-Patent Literatures)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                     ],
    //                 }),
    //                 ...(appendix1?.keyStringsNpl ?
    //                     appendix1?.keyStringsNpl?.map((keyStr, index) =>
    //                         new TableRow({
    //                             children: [
    //                                 new TableCell({
    //                                     verticalAlign: AlignmentType.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.CENTER,
    //                                             spacing: { after: 10, before: 10 },
    //                                             children: [
    //                                                 createTextRun(`${(appendix1.keyStrings.length) + (index + 1)}.`, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                                 new TableCell({
    //                                     verticalAlign: AlignmentType.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.LEFT,
    //                                             indent: { left: 80 },
    //                                             children: [
    //                                                 createTextRun(keyStr.keyStringsNplText, textStyle.arial10),
    //                                             ],
    //                                             spacing: { after: 10, before: 10 }
    //                                         }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         })
    //                     ) : []),
    //             ],
    //             borders: {
    //                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //             },
    //         }),
    //         // Additional Search
    //         new Table({
    //             width: {
    //                 size: 100,
    //                 type: WidthType.PERCENTAGE,
    //             },
    //             rows: [
    //                 new TableRow({
    //                     children: [
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     children: [
    //                                         createTextRun("", { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                         new TableCell({
    //                             verticalAlign: VerticalAlign.CENTER,
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     spacing: { before: 0, after: 0 },
    //                                     children: [
    //                                         createTextRun("Additional Search", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                     ],
    //                                 }),
    //                             ],
    //                             shading: {
    //                                 fill: "353839",
    //                             },
    //                         }),
    //                     ],
    //                 }),

    //                 // Dynamic Rows
    //                 ...(appendix1?.keyStringsAdditional ?
    //                     appendix1?.keyStringsAdditional?.map((keyStr, index) =>
    //                         new TableRow({
    //                             children: [
    //                                 new TableCell({
    //                                     verticalAlign: VerticalAlign.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             alignment: AlignmentType.CENTER,
    //                                             spacing: { before: 20, after: 20 },
    //                                             children: [
    //                                                 createTextRun(`${(appendix1?.keyStrings.length + appendix1?.keyStringsNpl.length) + (index + 1)}.`, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                                 new TableCell({
    //                                     verticalAlign: VerticalAlign.CENTER,
    //                                     children: [
    //                                         new Paragraph({
    //                                             indent: { left: 80 },
    //                                             alignment: AlignmentType.LEFT,
    //                                             spacing: { before: 20, after: 20 },
    //                                             children: [
    //                                                 createTextRun(keyStr.keyStringsAdditionalText, textStyle.arial10),
    //                                             ],
    //                                         }),
    //                                     ],
    //                                 }),
    //                             ],
    //                         })
    //                     ) : []),
    //             ],
    //             borders: {
    //                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //                 insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    //             },
    //         }),
    //         // back-to-table-of-content
    //         new Paragraph({
    //             alignment: AlignmentType.RIGHT,
    //             children: [
    //                 new InternalHyperlink({
    //                     anchor: "back-to-table-of-content",
    //                     children: [
    //                         createTextRun("Back to Table of Contents", {
    //                             color: "0000FF",
    //                             underline: true,
    //                             size: 16,
    //                             font: "Arial"
    //                         }),
    //                     ],
    //                 }),
    //             ],
    //             spacing: { before: 50, after: 0 },
    //         }),
    // //         // Data Availability
    // //         new Paragraph({
    // //             children: [
    // //                 new Bookmark({
    // //                     id: "typeID1-data-availability",
    // //                     children: [
    // //                         createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
    // //                     ]
    // //                 })
    // //             ],
    // //             alignment: AlignmentType.START,
    // //             spacing: { before: 200, after: 100 },
    // //             indent: { left: 720 },
    // //             heading: HeadingLevel.HEADING_2,
    // //         }),
    // //         ...(appendix1.dataAvailability ?
    // //             appendix1.dataAvailability.map((mapData) =>
    // //                 new Paragraph({
    // //                     children: [
    // //                         createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
    // //                     ],
    // //                     alignment: AlignmentType.START,
    // //                     spacing: { after: 50 },
    // //                     indent: { left: 720 },
    // //                 }),
    // //             ) : []),
    // //     )
    // // } 

//      const publications = typeId2 ? relevantAndNplCombined : relevantReferences;

//     const appendixTable = createTwoColumnTickTable({
//         leftTitle: "Patents",
//         rightTitle: "Non-patent Literature",
//         leftData: appendix2?.patents || [],
//         rightData: appendix2?.nonPatentLiterature || [],
//         textStyle: textStyle.arial10,
//     });



//     const doc = new Document({
//         styles: {
//             default: {
//                 document: {
//                     run: {
//                         font: "Arial",
//                         size: 20,
//                     },
//                     paragraph: {
//                         spacing: {
//                             after: 120,
//                         },
//                     },
//                 },
//             },
//         },
//         sections: [
//             // Project Title
//             // {
//             //     properties: createPageProperties(920, "portrait"),
//             //     children: [
//             //         new Paragraph({
//             //             alignment: AlignmentType.CENTER,
//             //             spacing: { after: 50 },
//             //             children: [
//             //                 createTextRun(introduction.projectTitle, textStyle.arial24, { bold: true }),
//             //             ],
//             //         }),
//             //         new Paragraph({
//             //             alignment: AlignmentType.CENTER,
//             //             spacing: { before: 50, after: 50 },
//             //             children: [
//             //                 createTextRun(introduction.projectSubTitle, textStyle.arial24, { bold: true }),
//             //             ],
//             //         }),
//             //     ],
//             // },

//             {
//                 properties: createPageProperties(920, "portrait"),
//                 children: [
//                     createParagraph(introduction.projectTitle, {
//                         alignment: AlignmentType.CENTER,
//                         spacing: { after: 50 },
//                         textStyleOverride: { bold: true, ...textStyle.arial24 },
//                     }),
//                     createParagraph(introduction.projectSubTitle, {
//                         alignment: AlignmentType.CENTER,
//                         spacing: { before: 50, after: 50 },
//                         textStyleOverride: { bold: true, ...textStyle.arial24 },
//                     }),
//                 ],
//             },


//             // Table Content
//             // {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },

//             //     children: [
//             //         tocTitle,
//             //         tocTable,
//             //         new Paragraph({
//             //             children: [
//             //                 new ExternalHyperlink({
//             //                     link: "https://par.molecularconnections.com/mc-review/form/IDF-34131Top%20Load%20Washer%20with%20Flexible%20Dispenser%20and%20Serviceable%20Dosing%20System",
//             //                     children: [
//             //                         createTextRun("Please rate this search report", textStyle.arial10, { bold: true, color: "0000FF", underline: { type: UnderlineType.SINGLE }, })
//             //                     ]
//             //                 })
//             //             ],
//             //             spacing: { before: 100 },
//             //             indent: { left: 380 }
//             //         })
//             //     ],
//             // },
//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     tocTitle,
//                     tocTable,
//                     createParagraph([
//                         new ExternalHyperlink({
//                             link: "https://par.molecularconnections.com/mc-review/form/IDF-34131Top%20Load%20Washer%20with%20Flexible%20Dispenser%20and%20Serviceable%20Dosing%20System",
//                             children: [
//                                 createTextRun("Please rate this search report", textStyle.arial10, {
//                                     bold: true,
//                                     color: "0000FF",
//                                     underline: { type: UnderlineType.SINGLE },
//                                 }),
//                             ],
//                         }),
//                     ], {
//                         spacing: { before: 100 },
//                         indent: { left: 380 },
//                     }),
//                 ],
//             },

//             // Search Features
//             // {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },
//             //     children: [
//             //         new Paragraph({
//             //             children: [
//             //                 new Bookmark({
//             //                     id: typeId2 ? "typeID2-search-features" : "typeID1-search-features",
//             //                     children: [
//             //                         createTextRun("1.  Search Features", textStyle.arial14, { bold: true, color: "000000" }),
//             //                     ]
//             //                 })
//             //             ],
//             //             alignment: AlignmentType.LEFT,
//             //             spacing: { before: 200, after: 300 },
//             //             indent: { left: 880 },
//             //             heading: HeadingLevel.HEADING_1,
//             //         }),
//             //         ...(introduction.searchFeatures ?
//             //             introduction.searchFeatures.filter((p) => p.trim() !== "").map((para) =>
//             //                 new Paragraph({
//             //                     children: [
//             //                         createTextRun(sanitizeText(para.trim() + "."), textStyle.arial10),
//             //                     ],
//             //                     alignment: AlignmentType.JUSTIFIED,
//             //                     spacing: { before: 200, after: 200 },
//             //                     indent: { left: 380, right: 380 }
//             //                 })
//             //             ) : []),

//             //         // imageGridTable,

//             //     ],
//             // },

//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     createParagraph(
//                         new Bookmark({
//                             id: typeId2 ? "typeID2-search-features" : "typeID1-search-features",
//                             children: [
//                                 createTextRun("1.  Search Features", textStyle.arial14, {
//                                     bold: true,
//                                     color: "000000",
//                                 }),
//                             ],
//                         }),
//                         {
//                             alignment: AlignmentType.LEFT,
//                             spacing: { before: 200, after: 300 },
//                             indent: { left: 880 },
//                             paragraphOptions: {
//                                 heading: HeadingLevel.HEADING_1,
//                             },
//                         }
//                     ),

//                     ...(introduction.searchFeatures || [])
//                         .filter((p) => p.trim() !== "")
//                         .map((para) =>
//                             createParagraph(sanitizeText(`${para.trim()}.`), {
//                                 alignment: AlignmentType.JUSTIFIED,
//                                 spacing: { before: 200, after: 200 },
//                                 indent: { left: 380, right: 380 },
//                                 textStyleOverride: { ...textStyle.arial10 }
//                             })
//                         ),
//                 ],
//             },

//             // Search Mathedology
//             ...(typeId1
//                 ? [
//                     {
//                         properties: createPageProperties(920, "portrait"),
//                         headers: { default: header },
//                         footers: { default: footer },
//                         children: [
//                             new Paragraph({ text: "", pageBreakBefore: true }),
//                             ...getSearchMethodology(introduction.projectTitle),
//                         ],
//                     },
//                 ]
//                 : []),

//             // Relevant Reference
//             // typeId1 && {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },
//             //     children: [
//             //         new Paragraph({
//             //             indent: { left: 880 },
//             //             children: [
//             //                 new Bookmark({
//             //                     id: "typeID1-relevant-toc",
//             //                     children: [
//             //                         createTextRun("3. Potentially Relevant References", textStyle.arial14, {
//             //                             bold: true,
//             //                             color: "000000",
//             //                         }),
//             //                     ],
//             //                 }),
//             //             ],
//             //             heading: HeadingLevel.HEADING_1,
//             //             spacing: { after: 400, before: 500 },
//             //         }),
//             //         relevantReferencesTable,
//             //         new Paragraph({
//             //             indent: { left: 520 },
//             //             children: [
//             //                 createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, {
//             //                     bold: true,
//             //                     color: "000000",
//             //                 }),
//             //             ],
//             //             spacing: { after: 200, before: 200 },
//             //         }),
//             //         new Paragraph({
//             //             indent: { left: 520 },
//             //             children: [
//             //                 createTextRun(overallSummary, textStyle.arial10),
//             //             ],
//             //             spacing: { after: 200 },
//             //         }),
//             //     ]

//             // },

//             typeId1 && {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     // createParagraph("3. Potentially Relevant References", {
//                     //     indent: { left: 880 },
//                     //     alignment: AlignmentType.LEFT,
//                     //     spacing: { after: 400, before: 500 },
//                     //     paragraphOptions: { heading: HeadingLevel.HEADING_1 },
//                     //     textStyleOverride: {
//                     //         ...textStyle.arial14,
//                     //         bold: true,
//                     //         color: "000000",
//                     //     },
//                     //     content: new Bookmark({
//                     //         id: "typeID1-relevant-toc",
//                     //         children: [
//                     //             createTextRun("3. Potentially Relevant References", textStyle.arial14, {
//                     //                 bold: true,
//                     //                 color: "000000",
//                     //             }),
//                     //         ],
//                     //     }),
//                     // }),



//                     new Paragraph({
//                         indent: { left: 880 },
//                         heading: HeadingLevel.HEADING_1,
//                         spacing: { after: 400, before: 500 },
//                         children: [
//                             new Bookmark({
//                                 id: "typeID1-relevant-toc",
//                                 children: [
//                                     createTextRun("3. Potentially Relevant References", textStyle.arial14, {
//                                         bold: true,
//                                         color: "000000",
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),




//                     relevantReferencesTable,



//                     createParagraph("Overall Summary of Search and Prior Arts:", {
//                         indent: { left: 520 },
//                         spacing: { after: 200, before: 200 },
//                         textStyleOverride: {
//                             ...textStyle.arial10,
//                             bold: true,
//                             color: "000000",
//                         },
//                     }),

//                     createParagraph(overallSummary, {
//                         indent: { left: 520 },
//                         spacing: { after: 200 },
//                         textStyleOverride: textStyle.arial10,
//                     }),
//                 ],
//             },




//             // Executive Summary
//             // (typeId2) && {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },
//             //     children: [
//             //         new Paragraph({
//             //             indent: { left: 630 },
//             //             spacing: { after: 50 },
//             //             heading: HeadingLevel.HEADING_1,
//             //             children: [
//             //                 new Bookmark({
//             //                     id: "typeID2-executive-summary",
//             //                     children: [
//             //                         createTextRun("2. Executive Summary", textStyle.arial14, {
//             //                             bold: true,
//             //                             color: "000000",
//             //                         }),
//             //                     ],
//             //                 }),
//             //             ],
//             //         }),
//             //         new Paragraph({
//             //             indent: indent380,
//             //             spacing: { after: 50 },
//             //             children: [
//             //                 createTextRun(
//             //                     "Feature- Mapping Summary of Potential Relevant References",
//             //                     textStyle.arial10,
//             //                     { italics: true }
//             //                 ),
//             //             ],
//             //         }),
//             //         ExecutiveSummaryTable,
//             //         ...summaryParagraphs,
//             //     ],
//             // },

//             typeId2 && {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     createParagraph(new Bookmark({
//                         id: "typeID2-executive-summary",
//                         children: [
//                             createTextRun("2. Executive Summary", textStyle.arial14, {
//                                 bold: true,
//                                 color: "000000",
//                             }),
//                         ],
//                     }), {
//                         indent: { left: 630 },
//                         spacing: { after: 50 },
//                         paragraphOptions: { heading: HeadingLevel.HEADING_1 },
//                     }),

//                     createParagraph("Feature- Mapping Summary of Potential Relevant References", {
//                         indent: indent380,
//                         spacing: { after: 50 },
//                         textStyleOverride: {
//                             ...textStyle.arial10,
//                             italics: true,
//                         },
//                     }),

//                     ExecutiveSummaryTable,
//                     ...summaryParagraphs,
//                 ],
//             },



//             // Relevant
//             // {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },
//             //     children: [
//             //         new Paragraph({
//             //             indent: { left: 880 },
//             //             children: [
//             //                 new Bookmark({
//             //                     id: typeId2 ? "typeID2-potentially-relevant-references" : "typeID1-relevant-biblio",
//             //                     children: [
//             //                         createTextRun(`${typeId2 ? "3" : "4"}. Potentially Relevant References`, textStyle.arial14, { bold: true, color: "000000" }),
//             //                     ]
//             //                 })
//             //             ],
//             //             heading: HeadingLevel.HEADING_1,
//             //             spacing: { after: 50 },
//             //         }),

//             //         ...(Array.isArray( typeId2 ? relevantAndNplCombined : relevantReferences )
//             //             ? (typeId2 ? relevantAndNplCombined : relevantReferences).flatMap((pub, pubIndex) => {
//             //                 const isNpl = pub.nplId === true;
//             //                 const usClass = {
//             //                     label: "US Classifications",
//             //                     value: getFamilyMembersParagraphChildren(
//             //                         {
//             //                             FamilyMembers: pub.usClassification,
//             //                             hyperLink: pub.publicationUrl,
//             //                         },
//             //                         textStyle
//             //                     ),
//             //                     isParagraphChildren: true,
//             //                 }
//             //                 const leftTableRows = [
//             //                     {
//             //                         label: "Publication No",
//             //                         value: [
//             //                             new ExternalHyperlink({
//             //                                 link: pub.nplPublicationUrl || "",
//             //                                 children: [
//             //                                     new TextRun({
//             //                                         text: pub.patentNumber?.toUpperCase() || "N/A",
//             //                                         style: "Hyperlink",
//             //                                         color: "0000FF",
//             //                                         underline: {
//             //                                             type: UnderlineType.SINGLE,
//             //                                         },
//             //                                     }),
//             //                                 ],
//             //                             }),

//             //                             new TextRun({ text: "  " }),

//             //                             new TextRun({
//             //                                 text: "[Google Patents Link: ",
//             //                                 bold: true,
//             //                             }),

//             //                             new ExternalHyperlink({
//             //                                 link: pub.googlePublicationUrl || "",
//             //                                 children: [
//             //                                     new TextRun({
//             //                                         text: pub.patentNumber?.toUpperCase() || "N/A",
//             //                                         style: "Hyperlink",
//             //                                         color: "0000FF",
//             //                                         underline: {
//             //                                             type: UnderlineType.SINGLE,
//             //                                         },
//             //                                     }),
//             //                                 ],
//             //                             }),

//             //                             new TextRun({
//             //                                 text: "]",
//             //                                 bold: true,
//             //                             }),
//             //                         ],
//             //                         isParagraphChildren: true,
//             //                     },


//             //                     {
//             //                         label: "Title",
//             //                         value: sanitizeText(pub.title),
//             //                     },
//             //                     {
//             //                         label: "Inventor",
//             //                         value: sanitizeText((pub.inventors || []).join(", ")),
//             //                     },
//             //                     {
//             //                         label: "Assignee",
//             //                         value: (pub.assignee || []).join(", "),
//             //                     },
//             //                     {
//             //                         label: "Family Member",
//             //                         value: getFamilyMembersParagraphChildren(
//             //                             {
//             //                                 FamilyMembers: pub.familyMembers,
//             //                                 hyperLink: pub.publicationUrl,
//             //                             },
//             //                             textStyle
//             //                         ),
//             //                         isParagraphChildren: true,
//             //                     },
//             //                     usClass,
//             //                 ];
//             //                 const rightTableRows = [
//             //                     { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
//             //                     { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
//             //                     { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
//             //                     // {
//             //                     //     label: "IPC/CPC Classifications",
//             //                     //     value: getFamilyMembersParagraphChildren(
//             //                     //         {
//             //                     //             FamilyMembers: pub.classifications,
//             //                     //             hyperLink: pub.publicationUrl,
//             //                     //         },
//             //                     //         textStyle
//             //                     //     ),
//             //                     //     isParagraphChildren: true,
//             //                     // },
//             //                     { label: "Classification(IPC)", 
//             //                         value: getFamilyMembersParagraphChildren(
//             //                             {
//             //                                 FamilyMembers: pub.ipcClassifications,
//             //                                 hyperLink: pub.publicationUrl,
//             //                             },
//             //                             textStyle
//             //                         ),
//             //                         isParagraphChildren: true,
//             //                         // value: (pub.ipcClassifications || []).join(", ")
//             //                     },

//             //                     { label: "Classification(CPC)", 

//             //                          value: getFamilyMembersParagraphChildren(
//             //                             {
//             //                                 FamilyMembers: pub.cpcClassifications,
//             //                                 hyperLink: pub.publicationUrl,
//             //                             },
//             //                             textStyle
//             //                         ),
//             //                         isParagraphChildren: true,
//             //                         // value: (pub.cpcClassifications || []).join(", ")

//             //                     },


//             //                 ];
//             //                 return [
//             //                     new Paragraph({
//             //                         alignment: AlignmentType.START,
//             //                         indent: { left: 1250 },
//             //                         children: [
//             //                             new Bookmark({
//             //                                 id: typeId2 ? `typeID2-${pubIndex + 1}` : `typeID1-${pubIndex + 1}`,
//             //                                 children: [
//             //                                     createTextRun(
//             //                                         `${pubIndex + 1}.       ${pub.patentNumber}`,
//             //                                         textStyle.arial11,
//             //                                         { bold: true, color: "000000" }
//             //                                     ),
//             //                                 ],
//             //                             }),
//             //                         ],
//             //                         heading: HeadingLevel.HEADING_2,
//             //                         spacing: { after: 20 },
//             //                     }),



//             //                     // ...(isNpl ?
//             //                     //     [new Table({
//             //                     //         width: { size: 100, type: WidthType.PERCENTAGE },
//             //                     //         rows: [
//             //                     //             new TableRow({
//             //                     //                 children: [
//             //                     //                     new TableCell({
//             //                     //                         columnSpan: 2,
//             //                     //                         shading: {
//             //                     //                             fill: "A7C7E7",
//             //                     //                             type: ShadingType.CLEAR,
//             //                     //                             color: "auto",
//             //                     //                         },
//             //                     //                         verticalAlign: VerticalAlign.CENTER,
//             //                     //                         children: [
//             //                     //                             new Paragraph({
//             //                     //                                 alignment: AlignmentType.CENTER,
//             //                     //                                 spacing: { before: 0, after: 0 },
//             //                     //                                 children: [
//             //                     //                                     createTextRun("Bibliographic Details", textStyle.arial10, {
//             //                     //                                         bold: true,
//             //                     //                                     }),
//             //                     //                                 ],
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                         borders: {
//             //                     //                             top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                             bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//             //                     //                             left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                             right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                         },
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                     }),
//             //                     //                 ],
//             //                     //             }),
//             //                     //             new TableRow({
//             //                     //                 children: [
//             //                     //                     new TableCell({
//             //                     //                         children: [
//             //                     //                             new Paragraph({
//             //                     //                                 children: [
//             //                     //                                     createTextRun("Title: ", textStyle.arial10, { bold: true }),
//             //                     //                                     new ExternalHyperlink({
//             //                     //                                         link: pub.publicationUrl,
//             //                     //                                         children: [
//             //                     //                                             createTextRun(pub.patentNumber, textStyle.arial10, { color: "0000FF" }),
//             //                     //                                         ],
//             //                     //                                     }),
//             //                     //                                 ],
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                         borders: {
//             //                     //                             top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//             //                     //                             bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//             //                     //                             left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                             right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                         },
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                     }),
//             //                     //                 ],
//             //                     //             }),
//             //                     //             new TableRow({
//             //                     //                 children: [
//             //                     //                     new TableCell({
//             //                     //                         children: [
//             //                     //                             new Paragraph({
//             //                     //                                 children: [
//             //                     //                                     createTextRun("Source: ", textStyle.arial10, { bold: true }),
//             //                     //                                     new ExternalHyperlink({
//             //                     //                                         link: pub.publicationUrl,
//             //                     //                                         children: [
//             //                     //                                             createTextRun(pub.publicationUrl, textStyle.arial10),
//             //                     //                                         ],
//             //                     //                                     }),
//             //                     //                                 ],
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                         borders: {
//             //                     //                             top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//             //                     //                             bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                             left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                             right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             //                     //                         },
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                     }),
//             //                     //                 ],
//             //                     //             }),
//             //                     //         ],
//             //                     //     })]
//             //                     //     :
//             //                     //     [new Table({
//             //                     //         width: { size: 100, type: WidthType.PERCENTAGE },
//             //                     //         rows: [
//             //                     //             new TableRow({
//             //                     //                 children: [
//             //                     //                     new TableCell({
//             //                     //                         columnSpan: 2,
//             //                     //                         shading: {
//             //                     //                             fill: "A7C7E7",
//             //                     //                             type: ShadingType.CLEAR,
//             //                     //                             color: "auto",
//             //                     //                         },
//             //                     //                         verticalAlign: VerticalAlign.CENTER,
//             //                     //                         children: [
//             //                     //                             new Paragraph({
//             //                     //                                 alignment: AlignmentType.CENTER,
//             //                     //                                 spacing: { before: 0, after: 0 },
//             //                     //                                 children: [
//             //                     //                                     createTextRun("Bibliographic Details", textStyle.arial10, {
//             //                     //                                         bold: true,
//             //                     //                                     }),
//             //                     //                                 ],
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                         borders: commonBorders,
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                     }),
//             //                     //                 ],
//             //                     //             }),
//             //                     //             new TableRow({
//             //                     //                 children: [
//             //                     //                     new TableCell({
//             //                     //                         width: { size: 50, type: WidthType.PERCENTAGE },
//             //                     //                         borders: commonBorders,
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                         children: [
//             //                     //                             new Table({
//             //                     //                                 width: { size: 100, type: WidthType.PERCENTAGE },
//             //                     //                                 rows: createSingleColumnTableRows(leftTableRows),
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                     }),
//             //                     //                     new TableCell({
//             //                     //                         width: { size: 50, type: WidthType.PERCENTAGE },
//             //                     //                         borders: commonBorders,
//             //                     //                         margins: marginsStyle.margins,
//             //                     //                         children: [
//             //                     //                             new Table({
//             //                     //                                 width: { size: 100, type: WidthType.PERCENTAGE },
//             //                     //                                 rows: createSingleColumnTableRows(rightTableRows),
//             //                     //                             }),
//             //                     //                         ],
//             //                     //                     }),
//             //                     //                 ],
//             //                     //             }),
//             //                     //         ],
//             //                     //     }),
//             //                     //     ]),
//             //                     // new Table({
//             //                     //     width: {
//             //                     //         size: 100,
//             //                     //         type: WidthType.PERCENTAGE,
//             //                     //     },
//             //                     //     rows: [
//             //                     //         new TableRow({
//             //                     //             children: [
//             //                     //                 new TableCell({
//             //                     //                     columnSpan: 2,
//             //                     //                     borders: commonBorders,
//             //                     //                     margins: marginsStyle.margins,
//             //                     //                     children: [
//             //                     //                         new Paragraph({
//             //                     //                             spacing: { before: 0, after: 0 },
//             //                     //                             alignment: AlignmentType.LEFT,
//             //                     //                             children: [
//             //                     //                                 createTextRun("Analyst Comments – ", textStyle.arial10, {
//             //                     //                                     bold: true,
//             //                     //                                 }),
//             //                     //                                 createTextRun(
//             //                     //                                     pub.analystComments
//             //                     //                                         ? sanitizeText(pub.analystComments)
//             //                     //                                         : '*No analyst comments available',
//             //                     //                                     textStyle.arial10
//             //                     //                                 ),
//             //                     //                             ],
//             //                     //                         })
//             //                     //                     ]
//             //                     //                 }),
//             //                     //             ]
//             //                     //         }),
//             //                     //     ],
//             //                     // }),
//             //                     // new Table({
//             //                     //     width: { size: 100, type: WidthType.PERCENTAGE },
//             //                     //     rows: [
//             //                     //         new TableRow({
//             //                     //             children: [
//             //                     //                 new TableCell({
//             //                     //                     columnSpan: 2,
//             //                     //                     shading: {
//             //                     //                         fill: "A7C7E7",
//             //                     //                         type: ShadingType.CLEAR,
//             //                     //                         color: "auto",
//             //                     //                     },
//             //                     //                     verticalAlign: VerticalAlign.CENTER,
//             //                     //                     children: [
//             //                     //                         new Paragraph({
//             //                     //                             alignment: AlignmentType.CENTER,
//             //                     //                             spacing: { before: 0, after: 0 },
//             //                     //                             children: [
//             //                     //                                 createTextRun("Relevant Excerpts ", textStyle.arial10, { bold: true }),
//             //                     //                                 !typeId2 &&
//             //                     //                                 createTextRun("[Translate Text from Description]", textStyle.arial10, {
//             //                     //                                     italics: true, bold: true
//             //                     //                                 }),
//             //                     //                             ].filter(Boolean),
//             //                     //                         })
//             //                     //                     ],
//             //                     //                     borders: commonBorders,
//             //                     //                     margins: marginsStyle.margins,
//             //                     //                 }),
//             //                     //             ],
//             //                     //         }),
//             //                     //         new TableRow({
//             //                     //             children: [
//             //                     //                 new TableCell({
//             //                     //                     columnSpan: 2,
//             //                     //                     borders: commonBorders,
//             //                     //                     margins: marginsStyle.margins,
//             //                     //                     children: [
//             //                     //                         isNpl ?
//             //                     //                             new Paragraph({
//             //                     //                                 alignment: AlignmentType.CENTER,
//             //                     //                                 spacing: { after: 100 },
//             //                     //                                 children: [
//             //                     //                                     createTextRun(
//             //                     //                                         'Relevant Excerpts add here....!',
//             //                     //                                         textStyle.arial13,
//             //                     //                                         { bold: true, color: 'FF0000' }
//             //                     //                                     ),
//             //                     //                                 ],
//             //                     //                             })
//             //                     //                             : new Paragraph({
//             //                     //                                 spacing: { before: 0, after: 0 },
//             //                     //                                 alignment: AlignmentType.LEFT,
//             //                     //                                 children: [
//             //                     //                                     pub.relevantExcerpts
//             //                     //                                         ? createTextRun(sanitizeText(pub.relevantExcerpts), textStyle.arial10)
//             //                     //                                         : createTextRun(
//             //                     //                                             '*Abstract is not available, please fill it yourself',
//             //                     //                                             { ...textStyle.arial10, color: 'FF0000' }
//             //                     //                                         ),
//             //                     //                                 ],
//             //                     //                             }),
//             //                     //                     ],
//             //                     //                 }),
//             //                     //             ],
//             //                     //         })

//             //                     //     ],
//             //                     // }),




//             //                     ...[
//             //                         new Paragraph({
//             //                             children: [],
//             //                             spacing: { after: 200 },
//             //                         }),
//             //                     ]
//             //                 ];

//             //             }) : []),
//             //     ],
//             // },


//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     // Section heading
//                   new Paragraph({
//                         indent: { left: 880 },
//                         children: [
//                             new Bookmark({
//                                 id: typeId2 ? "typeID2-potentially-relevant-references" : "typeID1-relevant-biblio",
//                                 children: [
//                                     createTextRun(`${typeId2 ? "3" : "4"}. Potentially Relevant References`, textStyle.arial14, { bold: true, color: "000000" }),
//                                 ]
//                             })
//                         ],
//                         heading: HeadingLevel.HEADING_1,
//                         spacing: { after: 50 },
//                     }),
//                     // Dynamic publications list
//                     ...(Array.isArray(publications)
//                         ? publications.flatMap((pub, pubIndex) => {
//                             const isNpl = pub.nplId === true;

//                             const usClass = {
//                                 label: "US Classifications",
//                                 value: getFamilyMembersParagraphChildren(
//                                     {
//                                         FamilyMembers: pub.usClassification,
//                                         hyperLink: pub.publicationUrl,
//                                     },
//                                     textStyle
//                                 ),
//                                 isParagraphChildren: true,
//                             };
//                             const leftTableRows = [
//                                 {
//                                     label: "Publication No",
//                                     value: [
//                                         new ExternalHyperlink({
//                                             link: pub.nplPublicationUrl || "",
//                                             children: [
//                                                 new TextRun({
//                                                     text: pub.patentNumber?.toUpperCase() || "N/A",
//                                                     style: "Hyperlink",
//                                                     color: "0000FF",
//                                                     underline: { type: UnderlineType.SINGLE },
//                                                 }),
//                                             ],
//                                         }),
//                                         new TextRun({ text: "  " }),
//                                         new TextRun({ text: "[Google Patents Link: ", bold: true }),
//                                         new ExternalHyperlink({
//                                             link: pub.googlePublicationUrl || "",
//                                             children: [
//                                                 new TextRun({
//                                                     text: pub.patentNumber?.toUpperCase() || "N/A",
//                                                     style: "Hyperlink",
//                                                     color: "0000FF",
//                                                     underline: { type: UnderlineType.SINGLE },
//                                                 }),
//                                             ],
//                                         }),
//                                         new TextRun({ text: "]", bold: true }),
//                                     ],
//                                     isParagraphChildren: true,
//                                 },
//                                 { label: "Title", value: sanitizeText(pub.title) },
//                                 { label: "Inventor", value: sanitizeText((pub.inventors || []).join(", ")) },
//                                 { label: "Assignee", value: (pub.assignee || []).join(", ") },
//                                 {
//                                     label: "Family Member",
//                                     value: getFamilyMembersParagraphChildren(
//                                         {
//                                             FamilyMembers: pub.familyMembers,
//                                             hyperLink: pub.publicationUrl,
//                                         },
//                                         textStyle
//                                     ),
//                                     isParagraphChildren: true,
//                                 },
//                                 usClass,
//                             ];
//                             const rightTableRows = [
//                                 { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
//                                 { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
//                                 { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
//                                 {
//                                     label: "Classification(IPC)",
//                                     value: getFamilyMembersParagraphChildren(
//                                         {
//                                             FamilyMembers: pub.ipcClassifications,
//                                             hyperLink: pub.publicationUrl,
//                                         },
//                                         textStyle
//                                     ),
//                                     isParagraphChildren: true,
//                                 },
//                                 {
//                                     label: "Classification(CPC)",
//                                     value: getFamilyMembersParagraphChildren(
//                                         {
//                                             FamilyMembers: pub.cpcClassifications,
//                                             hyperLink: pub.publicationUrl,
//                                         },
//                                         textStyle
//                                     ),
//                                     isParagraphChildren: true,
//                                 },
//                             ];

//                             return [
//                                 new Paragraph({
//                                     alignment: AlignmentType.START,
//                                     indent: { left: 1250 },
//                                     children: [
//                                         new Bookmark({
//                                             id: typeId2 ? `typeID2-${pubIndex + 1}` : `typeID1-${pubIndex + 1}`,
//                                             children: [
//                                                 createTextRun(
//                                                     `${pubIndex + 1}.       ${pub.patentNumber}`,
//                                                     textStyle.arial11,
//                                                     { bold: true, color: "000000" }
//                                                 ),
//                                             ],
//                                         }),
//                                     ],
//                                     heading: HeadingLevel.HEADING_2,
//                                     spacing: { after: 20 },
//                                 }),


//                                 ...generateBibliographicSection({
//                                     pub,
//                                     isNpl,
//                                     typeId2,
//                                     leftTableRows,
//                                     rightTableRows,
//                                     createSingleColumnTableRows,
//                                 }),

//                                 new Paragraph({ children: [], spacing: { after: 200 } }),
//                             ];
//                         })
//                         : []),
//                 ],
//             },

//             // Related
//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     new Paragraph({
//                         indent: { left: 630 },
//                         children: [
//                             new Bookmark({
//                                 id: typeId2 ? "typeID2-related-references" : "typeID1-related-references",
//                                 children: [
//                                     createTextRun(`${typeId2 ? "4" : "5"}.  Related References`, textStyle.arial14, { bold: true, color: "000000" }),
//                                 ]
//                             })
//                         ],
//                         spacing: { after: 50 },
//                         heading: HeadingLevel.HEADING_1,
//                     }),
//                     new Paragraph({
//                         indent: { left: 630 },
//                         children: [
//                             createTextRun(
//                                 " (Note: Below references obtained from the quick search are listed as related, as these references fail to disclose at least one or more critical features)",
//                                 textStyle.arial10,
//                                 { italics: true }
//                             ),
//                         ],
//                         spacing: { after: 50 },
//                     }),
//                     relatedReferencesTable
//                 ],
//             },
//             // typeId2 Search Methodology
//             typeId2 && {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: getSearchMethodology(typeId2),
//             },
            // (typeId1 || typeId2) && {
            //     properties: createPageProperties(920, "portrait"),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: appendix1Childern,
            // },

//             // Appendix 2
//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     new Paragraph({
//                         indent: { left: 520 },
//                         children: [
//                             new Bookmark({
//                                 id: typeId1 ? "typeID1-appendix2" : "typeID2-appendix",
//                                 children: [
//                                     createTextRun(
//                                         typeId2 ? "Appendix" : typeId1 ? "Appendix 2" : "",
//                                         textStyle.arial14,
//                                         { bold: true, color: "000000" }
//                                     ),
//                                 ],

//                             })
//                         ],
//                         heading: HeadingLevel.HEADING_1,
//                         alignment: AlignmentType.START,
//                         spacing: { after: 30 },
//                     }),

//                     new Paragraph({
//                         children: [
//                             new Bookmark({
//                                 id: typeId2 ? "typeID2-databases" : "typeID1-databases",
//                                 children: [
//                                     createTextRun("Databases", textStyle.arial11, { bold: true, color: "000000" }),
//                                 ]
//                             })
//                         ],
//                         heading: HeadingLevel.HEADING_2,
//                         alignment: AlignmentType.START,
//                         spacing: { after: 0 },
//                         indent: { left: 880 },
//                     }),
//                     appendixTable,

//                     // new Table({
//                     //     width: {
//                     //         size: 100,
//                     //         type: WidthType.PERCENTAGE,
//                     //     },
//                     //     borders: {
//                     //         top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //         bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //         left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //         right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //         insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //         insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                     //     },
//                     //     rows: [
//                     //         new TableRow({
//                     //             children: [
//                     //                 new TableCell({
//                     //                     verticalAlign: AlignmentType.CENTER,
//                     //                     borders: {
//                     //                         top: { style: BorderStyle.NONE },
//                     //                         bottom: { style: BorderStyle.NONE },
//                     //                         left: { style: BorderStyle.NONE },
//                     //                         right: { style: BorderStyle.NONE },
//                     //                     },
//                     //                     children: [
//                     //                         new Paragraph({
//                     //                             children: [
//                     //                                 createTextRun("Patents", textStyle.arial10, { bold: true }),
//                     //                             ],
//                     //                             spacing: { after: 20 },
//                     //                             indent: { left: 880 },
//                     //                         }),
                                          
//                     //                     ...(appendix2.patents ? createTickedParagraphs(appendix2.patents) : []),

//                     //                     ],
//                     //                 }),
//                     //                 new TableCell({
//                     //                     verticalAlign: AlignmentType.CENTER,
//                     //                     borders: {
//                     //                         top: { style: BorderStyle.NONE },
//                     //                         bottom: { style: BorderStyle.NONE },
//                     //                         left: { style: BorderStyle.NONE },
//                     //                         right: { style: BorderStyle.NONE },
//                     //                     },
//                     //                     children: [
//                     //                         new Paragraph({
//                     //                             indent: { left: 880 },
//                     //                             children: [
//                     //                                 createTextRun("Non-patent Literature", textStyle.arial10, { bold: true }),
//                     //                             ],
//                     //                             spacing: { after: 0 },
//                     //                         }),
                                            
//                     //                         ...(appendix2.nonPatentLiterature ? createTickedParagraphs(appendix2.nonPatentLiterature): []),

//                     //                     ],
//                     //                 }),
//                     //             ],
//                     //         }),
//                     //     ],
//                     // })
//                 ],
//             },
//             // Disclaimer
//             // {
//             //     properties: createPageProperties(920, "portrait"),
//             //     headers: { default: header },
//             //     footers: { default: footer },
//             //     children: [
//             //         new Paragraph({
//             //             indent: { left: 520 },
//             //             children: [
//             //                 new Bookmark({
//             //                     id: typeId1 ? "typeID1-disclaimer" : "typeID2-disclaimer",
//             //                     children: [
//             //                         createTextRun("Disclaimer", textStyle.arial14, { bold: true, color: "000000" }),
//             //                     ]
//             //                 })
//             //             ],
//             //             heading: HeadingLevel.HEADING_1,
//             //             alignment: AlignmentType.START,
//             //             spacing: { after: 100 },
//             //         }),

//             //         new Paragraph({
//             //             indent: { left: 520 },
//             //             children: [
//             //                 createTextRun(disclaimer, textStyle.arial10,),
//             //             ],
//             //             alignment: AlignmentType.START,
//             //             spacing: { after: 50 },
//             //         }),
//             //     ],
//             // },


//             {
//                 properties: createPageProperties(920, "portrait"),
//                 headers: { default: header },
//                 footers: { default: footer },
//                 children: [
//                     // Heading paragraph with bookmark
//                     new Paragraph({
//                         indent: { left: 520 },
//                         heading: HeadingLevel.HEADING_1,
//                         alignment: AlignmentType.START,
//                         spacing: { after: 100 },
//                         children: [
//                             new Bookmark({
//                                 id: typeId1 ? "typeID1-disclaimer" : "typeID2-disclaimer",
//                                 children: [
//                                     createTextRun("Disclaimer", textStyle.arial14, {
//                                         bold: true,
//                                         color: "000000",
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     // Disclaimer content paragraph
//                     ...(Array.isArray(disclaimer)
//                         ? disclaimer.map((line) =>
//                             new Paragraph({
//                                 indent: { left: 520 },
//                                 alignment: AlignmentType.START,
//                                 spacing: { after: 50 },
//                                 children: [
//                                     createTextRun(line, textStyle.arial10),
//                                 ],
//                             })
//                         )
//                         : [
//                             new Paragraph({
//                                 indent: { left: 520 },
//                                 alignment: AlignmentType.START,
//                                 spacing: { after: 50 },
//                                 children: [
//                                     createTextRun(disclaimer || "N/A", textStyle.arial10),
//                                 ],
//                             }),
//                         ]
//                     ),
//                 ],
//             },
//         ].filter(Boolean),
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `${introduction.projectTitle || "StaticData"}.docx`);
// };