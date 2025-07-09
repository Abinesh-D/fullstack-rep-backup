import { saveAs } from "file-saver";
import {
    Document, Packer, Paragraph, TextRun, HeadingLevel,
    Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
    AlignmentType, Footer,
} from "docx";


const defaultFont = { font: "Arial", size: 20, };

const commonBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
};

const borderNone = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
};

const marginsStyle = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }

export const generateWordDoc = ({
    publicationNumber, publicationUrl, title, inventors, assignees,
    publicationDate, applicationDate, priorityDate, ipcCpcClassification,
    usClassification, familyMembers, abstract, filteredDescriptions
}) => {

    const analystComments = `This patent discloses a battery-operated handheld dispenser that comprises a novel nozzle design for low-pressure liquid spraying and an ergonomic handle for ease of use, which includes its pump mechanism integrating a flexible diaphragm and coplanar flapper valves, enhancing dispensing efficiency and reliability, which include the bottle's slope matches the handle's angle and slope which causes the trigger to activate (consider based on figure).

However, this patent does not explicitly disclose the bottle's slope matches the handle's angle and slope which causes the trigger to activate (consider based on figure).

However, this patent explicitly discloses the top mount of the dispenser is twisted to 90 degrees to mount and/or unmount from a bottle.`;

    const capitalizeWords = (str) => str ? str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : "Nil";

    const leftTableRows = [
        { label: "Publication No.", value: publicationNumber },
        { label: "Title", value: capitalizeWords(title) },
        { label: "Inventor", value: capitalizeWords(inventors) },
        { label: "Assignee", value: capitalizeWords(assignees) },
    ];

    const rightTableRows = [
        { label: "Grant/Publication Date", value: publicationDate },
        { label: "Filing/Application Date", value: applicationDate },
        { label: "Priority Date", value: priorityDate },
        { label: "IPC/CPC Classifications", value: ipcCpcClassification },
        { label: "Family Member", value: familyMembers },
        // { label: "US Classification", value: usClassification },
    ];
    const safeText = (text) => (text && text.trim() ? text : "Nil");
    const createTextRun = (text, options = {}) =>
        new TextRun({ text, ...defaultFont, ...options });
    
    const createParagraph = (label, value) =>
        new Paragraph({
            children: [
                createTextRun(`${label} – `, { bold: true }),
                createTextRun(safeText(value)),
            ],
        });
    const createTableEntry = (label, value, hasBottomBorder = false) =>
        new TableCell({
            children: [createParagraph(label, value)],
            margins: marginsStyle.margins,
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                bottom: {
                    style: BorderStyle.SINGLE,
                    size: 1,
                    color: hasBottomBorder ? "FFFFFF" : "FFFFFF",
                },
                left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
            },
            width: {
                size: 50,
                type: WidthType.PERCENTAGE,
            },
        });
    const createSingleColumnTableRows = (rows) =>
        rows.map(({ label, value }) =>
            new TableRow({
                children: [
                    createTableEntry(label, value, false),
                ],
            })
        );
    const isValidDescription = filteredDescriptions && typeof filteredDescriptions === 'object' && Object.keys(filteredDescriptions).length > 0;
    const descriptionTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: isValidDescription ?
            Object.entries(filteredDescriptions).map(([key, value]) =>
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 2,
                            children: [
                                new Paragraph({
                                    spacing: { after: 100 },
                                    children: [createTextRun(`[${key}]`, { bold: true })],
                                }),
                                new Paragraph({
                                    spacing: { after: 200 },
                                    children: [createTextRun(safeText(value), { bold: true })],
                                }),
                            ],
                            borders: borderNone,
                            margins: marginsStyle.margins,
                        }),
                    ],
                })
            )
            : [
                new TableRow({
                    children: [
                        new TableCell({
                            columnSpan: 2,
                            children: [
                                new Paragraph({
                                    children: [createTextRun("", { bold: true, color: typeof filteredDescriptions === 'object' && "FF0000" })],
                                    // children: [createTextRun("*Description not available please fill manually..!", { bold: true, color: typeof filteredDescriptions === 'object' && "FF0000" })],
                                }),
                            ],
                            borders: borderNone,
                            margins: marginsStyle.margins,
                        }),
                    ],
                }),
            ],
    });

    const doc = new Document({
        styles: {
            paragraphStyles: [
                {
                    id: "Quick_Novelty",
                    name: "Quick Novelty Search Report",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        color: "0563C1",
                        underline: { type: "single" },
                        font: "Arial",
                        size: 10,
                    },
                },
            ],
        },
        sections: [
            {
                properties: {
                    page: {
                        margin: {
                            top: 720,
                            right: 720,
                            bottom: 720,
                            left: 720,
                        },
                        size: {
                            orientation: "portrait",
                            width: 12240,
                            height: 15840,
                        },
                    },
                },
                children: [
                    new Paragraph({
                        text: "Potentially Relevant References",
                        heading: HeadingLevel.HEADING_2,
                        spacing: { after: 300 },
                    }),

                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        columnSpan: 2,
                                        shading: {
                                            fill: "BDD7EE",
                                            type: ShadingType.CLEAR,
                                            color: "auto",
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    createTextRun("Bibliographic Details", { bold: true }),
                                                ],
                                            }),
                                        ],
                                        borders: commonBorders,
                                        margins: marginsStyle.margins,
                                    }),
                                ],
                            }),

                            new TableRow({
                                children: [
                                    // Left Table
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        borders: commonBorders,
                                        children: [
                                            new Table({
                                                width: { size: 100, type: WidthType.PERCENTAGE },
                                                rows: [
                                                    ...createSingleColumnTableRows(leftTableRows),
                                                ],
                                            }),
                                        ],
                                    }),

                                    // Right Table
                                    new TableCell({
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                        borders: commonBorders,
                                        children: [
                                            new Table({
                                                width: { size: 100, type: WidthType.PERCENTAGE },

                                                rows: [
                                                    ...createSingleColumnTableRows(rightTableRows),
                                                ],
                                            }),
                                        ],
                                    }),
                                ],
                            }),
                        ],
                    }),

                    new Paragraph({
                        spacing: {
                            before: marginsStyle.margins.top || 0,
                            after: marginsStyle.margins.bottom || 0,
                        },
                        indent: {
                            left: marginsStyle.margins.left || 0,
                            right: marginsStyle.margins.right || 0,
                        },
                        children: [
                            createTextRun("Analyst Comments – ", { bold: true }),
                            createTextRun(safeText(analystComments), { italics: true }),
                        ],
                    }),



                    
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        columnSpan: 2,
                                        shading: {
                                            fill: "BDD7EE",
                                            type: ShadingType.CLEAR,
                                            color: "auto",
                                        },
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    createTextRun("Relevant Excerpts", { bold: true }),
                                                ],
                                            }),
                                        ],
                                        borders: commonBorders,
                                        margins: marginsStyle.margins,
                                    }),
                                ],
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        columnSpan: 2,
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.START,
                                                children: [
                                                    createTextRun("[Abstract]", { bold: true })
                                                ]

                                            })
                                        ],
                                        borders: borderNone,
                                        margins: marginsStyle.margins,
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        columnSpan: 2,
                                        children: [
                                            new Paragraph({
                                                spacing: { after: 200 },
                                                children: [
                                                    createTextRun(safeText(abstract === null ? '*Abstract not available please fill manually..!' : abstract),
                                                        { bold: true, color: abstract === null && "FF0000" })
                                                ]
                                            })
                                        ],
                                        borders: borderNone,
                                        margins: marginsStyle.margins,
                                    })
                                ]
                            }),
                        ],
                    }),
                    descriptionTable
                ],
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    createTextRun("Quick Novelty Search Report", {
                                        italics: true,
                                        size: 16,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
            },
        ],
    });
    Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Quick_Novelty_Search_Report.docx");
    });
};













// import { saveAs } from "file-saver";
// import {
//     Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink,
//     Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
//     AlignmentType, Header, Footer
// } from "docx";

// const capitalizeWords = (str) =>
//     str ? str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) : "Nil";

// const safeText = (text) => (text && text.trim() ? text : "Nil");

// const defaultFont = {
//     font: "Arial",
//     size: 20,
// };

// const createParagraph = (label, value) =>
//     new Paragraph({
//         children: [
//             new TextRun({ text: `${label} – `, bold: true, ...defaultFont }),
//             new TextRun({ text: safeText(value), ...defaultFont }),
//         ],
//     });

// const createTableCell = (paragraph) =>
//     new TableCell({
//         children: [paragraph],
//         borders: {
//             top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
//             bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
//             left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//             right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//         },
//         width: {
//             size: 50,
//             type: WidthType.PERCENTAGE,
//         },
//     });

// export const generateWordDoc = ({
//     publicationNumber, publicationUrl, title, inventors, assignees,
//     publicationDate, applicationDate, priorityDate, ipcCpcClassification,
//     usClassification, familyMembers, analystComments,
// }) => {
//     const capitalizedTitle = capitalizeWords(title);
//     const capitalizedInventors = capitalizeWords(inventors);
//     const capitalizedAssignees = capitalizeWords(assignees);

//     const doc = new Document({
//         styles: {
//             paragraphStyles: [
//                 {
//                     id: "Hyperlink",
//                     name: "Hyperlink",
//                     basedOn: "Normal",
//                     next: "Normal",
//                     quickFormat: true,
//                     run: {
//                         color: "0563C1",
//                         underline: { type: "single" },
//                         font: "Arial",
//                         size: 10,
//                     },
//                 },
//             ],
//         },
//         sections: [
//             {
//                 headers: {
//                     default: new Header({
//                         children: [
//                             new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     new TextRun({
//                                         text: "Patent Document",
//                                         bold: true,
//                                         ...defaultFont,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),
//                 },
//                 footers: {
//                     default: new Footer({
//                         children: [
//                             new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     new TextRun({
//                                         text: "Generated using Patent Tool",
//                                         italics: true,
//                                         size: 16,
//                                         font: "Arial",
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),
//                 },
//                 children: [
//                     new Paragraph({
//                         text: "Potentially Relevant References",
//                         heading: HeadingLevel.HEADING_2,
//                         spacing: { after: 300 },
//                     }),

//                     new Paragraph({
//                         spacing: { after: 200 },
//                         children: [
//                             new TextRun({ text: "1. ", bold: true, ...defaultFont }),
//                             new ExternalHyperlink({
//                                 link: publicationUrl,
//                                 children: [
//                                     new TextRun({
//                                         text: publicationNumber,
//                                         style: "Hyperlink",
//                                         ...defaultFont,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Table({
//                         width: {
//                             size: 100,
//                             type: WidthType.PERCENTAGE,
//                         },
//                         rows: [
//                             new TableRow({
//                                 children: [
//                                     new TableCell({
//                                         columnSpan: 2,
//                                         shading: {
//                                             fill: "BDD7EE",
//                                             type: ShadingType.CLEAR,
//                                             color: "auto",
//                                         },
//                                         children: [
//                                             new Paragraph({
//                                                 alignment: AlignmentType.CENTER,
//                                                 children: [
//                                                     new TextRun({
//                                                         text: "Bibliographic Details",
//                                                         bold: true,
//                                                         ...defaultFont,
//                                                     }),
//                                                 ],
//                                             }),
//                                         ],
//                                         borders: {
//                                             top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//                                             bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//                                             left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//                                             right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//                                         },
//                                     }),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Publication No.", publicationNumber)),
//                                     createTableCell(createParagraph("Grant/Publication Date", publicationDate)),
//                                 ],
//                             }),
//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Title", capitalizedTitle)),
//                                     createTableCell(createParagraph("Filing/Application Date", applicationDate)),
//                                 ],
//                             }),
//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Inventor", capitalizedInventors)),
//                                     createTableCell(createParagraph("Priority Date", priorityDate)),
//                                 ],
//                             }),
//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Assignee", capitalizedAssignees)),
//                                     createTableCell(createParagraph("IPC/CPC Classifications", ipcCpcClassification)),
//                                 ],
//                             }),
//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Family Member", familyMembers)),
//                                     createTableCell(createParagraph("US Classification", usClassification)),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Paragraph({
//                         spacing: { before: 300 },
//                         children: [
//                             new TextRun({
//                                 text: "Analyst Comments – ",
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                             new TextRun({
//                                 text: safeText(analystComments),
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                         ],
//                     }),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "PatentDetails.docx");
//     });
// };




















// import { saveAs } from "file-saver";
// import {
//     Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink,
//     Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
//     AlignmentType, Header, Footer
// } from "docx";

// export const generateWordDoc = ({
//     publicationNumber, publicationUrl, title, inventors, assignees,
//     publicationDate, applicationDate, priorityDate, ipcCpcClassification,
//     usClassification, familyMembers, analystComments
// }) => {
    
//     const safeText = (text) => (text && text.trim() ? text : "Nil");

//     const defaultFont = {
//         font: "Arial",
//         size: 20,
//     };

//     const createParagraph = (label, value) =>
//         new Paragraph({
//             children: [
//                 new TextRun({ text: `${label} – `, bold: true, ...defaultFont }),
//                 new TextRun({ text: safeText(value), ...defaultFont }),
//             ],
//         });

//     const createTableCell = (paragraph, addRightBorder = false) =>
//         new TableCell({
//             children: [paragraph],
//             borders: {
//                 top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                 bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                 left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                 right: addRightBorder
//                     ? { style: BorderStyle.SINGLE, size: 1, color: "000000" }
//                     : { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//             },
//             width: {
//                 size: 50,
//                 type: WidthType.PERCENTAGE,
//             },
//         });

//     const doc = new Document({
//         styles: {
//             paragraphStyles: [
//                 {
//                     id: "Hyperlink",
//                     name: "Hyperlink",
//                     basedOn: "Normal",
//                     next: "Normal",
//                     quickFormat: true,
//                     run: {
//                         color: "0563C1",
//                         underline: { type: "single" },
//                         font: "Arial",
//                         size: 10,
//                     },
//                 },
//             ],
//         },
//         sections: [
//             {
//                 headers: {
//                     default: new Header({
//                         children: [
//                             new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     new TextRun({
//                                         text: "Patent Document",
//                                         bold: true,
//                                         font: "Arial",
//                                         size: 24,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),
//                 },
//                 footers: {
//                     default: new Footer({
//                         children: [
//                             new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     new TextRun({
//                                         text: "Confidential",
//                                         italics: true,
//                                         font: "Arial",
//                                         size: 20,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),
//                 },
//                 children: [
//                     new Paragraph({
//                         text: "Potentially Relevant References",
//                         heading: HeadingLevel.HEADING_2,
//                         spacing: { after: 300 },
//                     }),
//                     new Paragraph({
//                         spacing: { after: 200 },
//                         children: [
//                             new TextRun({ text: "1. ", bold: true, ...defaultFont }),
//                             new ExternalHyperlink({
//                                 link: publicationUrl,
//                                 children: [
//                                     new TextRun({
//                                         text: publicationNumber,
//                                         style: "Hyperlink",
//                                         ...defaultFont,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Table({
//                         width: {
//                             size: 100,
//                             type: WidthType.PERCENTAGE,
//                         },
//                         rows: [
//                             new TableRow({
//                                 children: [
//                                     new TableCell({
//                                         columnSpan: 2,
//                                         shading: {
//                                             fill: "BDD7EE",
//                                             type: ShadingType.CLEAR,
//                                             color: "auto",
//                                         },
//                                         children: [
//                                             new Paragraph({
//                                                 alignment: AlignmentType.CENTER,
//                                                 children: [
//                                                     new TextRun({
//                                                         text: "Bibliographic Details",
//                                                         bold: true,
//                                                         ...defaultFont,
//                                                     }),
//                                                 ],
//                                             }),
//                                         ],
//                                         borders: {
//                                             top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                                             bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                                             left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                                             right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//                                         },
//                                         width: {
//                                             size: 100,
//                                             type: WidthType.PERCENTAGE,
//                                         },
//                                     }),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Publication No.", publicationNumber), true),
//                                     createTableCell(createParagraph("Grant/Publication Date", publicationDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Title", title), true),
//                                     createTableCell(createParagraph("Filing/Application Date", applicationDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Inventor", inventors), true),
//                                     createTableCell(createParagraph("Priority Date", priorityDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Assignee", assignees), true),
//                                     createTableCell(createParagraph("IPC/CPC Classifications", ipcCpcClassification)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Family Member", familyMembers), true),
//                                     createTableCell(createParagraph("US Classification", usClassification)),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Paragraph({
//                         spacing: { before: 300 },
//                         children: [
//                             new TextRun({
//                                 text: "Analyst Comments – ",
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                             new TextRun({
//                                 text: safeText(analystComments),
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                         ],
//                     }),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "PatentDetails.docx");
//     });
// };





















// import { saveAs } from "file-saver";
// import {
//     Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, Table, TableRow,
//     TableCell, WidthType, ShadingType, BorderStyle, AlignmentType,
// } from "docx";
// export const generateWordDoc = ({ publicationNumber, publicationUrl, title, inventors, assignees, publicationDate, applicationDate,
//     priorityDate, ipcCpcClassification, usClassification, familyMembers, analystComments,
// }) => {
//     const safeText = (text) => (text && text.trim() ? text : "Nil");

//     const defaultFont = {
//         font: "Arial",
//         size: 20,
//     };

//     const createParagraph = (label, value) =>
//         new Paragraph({
//             children: [
//                 new TextRun({ text: `${label} – `, bold: true, ...defaultFont }),
//                 new TextRun({ text: safeText(value), ...defaultFont }),
//             ],
//         });

//     const createTableCell = (paragraph) =>
//         new TableCell({
//             children: [paragraph],
//             borders: {
//                 top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                 bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                 left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                 right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//             },
//             width: {
//                 size: 50,
//                 type: WidthType.PERCENTAGE,
//             },
//         });

//     const doc = new Document({
//         styles: {
//             paragraphStyles: [
//                 {
//                     id: "Hyperlink",
//                     name: "Hyperlink",
//                     basedOn: "Normal",
//                     next: "Normal",
//                     quickFormat: true,
//                     run: {
//                         color: "0563C1",
//                         underline: {
//                             type: "single",
//                         },
//                         font: "Arial",
//                         size: 10,
//                     },
//                 },
//             ],
//         },
//         sections: [
//             {
//                 children: [
//                     new Paragraph({
//                         text: "Potentially Relevant References",
//                         heading: HeadingLevel.HEADING_2,
//                         spacing: { after: 300 },
//                     }),
//                     new Paragraph({
//                         spacing: { after: 200 },
//                         children: [
//                             new TextRun({ text: "1. ", bold: true, ...defaultFont }),
//                             new ExternalHyperlink({
//                                 link: publicationUrl,
//                                 children: [
//                                     new TextRun({
//                                         text: publicationNumber,
//                                         style: "Hyperlink",
//                                         ...defaultFont,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Table({
//                         width: {
//                             size: 100,
//                             type: WidthType.PERCENTAGE,
//                         },
//                         rows: [
//                             new TableRow({
//                                 children: [
//                                     new TableCell({
//                                         columnSpan: 2,
//                                         shading: {
//                                             fill: "BDD7EE",
//                                             type: ShadingType.CLEAR,
//                                             color: "auto",
//                                         },
//                                         children: [
//                                             new Paragraph({
//                                                 alignment: AlignmentType.CENTER,
//                                                 children: [
//                                                     new TextRun({
//                                                         text: "Bibliographic Details",
//                                                         bold: true,
//                                                         ...defaultFont,
//                                                     }),
//                                                 ],
//                                             }),
//                                         ],
//                                         borders: {
//                                             top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                                             bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                                             left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                                             right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
//                                         },
//                                     }),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Publication No.", publicationNumber)),
//                                     createTableCell(createParagraph("Grant/Publication Date", publicationDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Title", title)),
//                                     createTableCell(createParagraph("Filing/Application Date", applicationDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Inventor", inventors)),
//                                     createTableCell(createParagraph("Priority Date", priorityDate)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Assignee", assignees)),
//                                     createTableCell(createParagraph("IPC/CPC Classifications", ipcCpcClassification)),
//                                 ],
//                             }),

//                             new TableRow({
//                                 children: [
//                                     createTableCell(createParagraph("Family Member", familyMembers)),
//                                     createTableCell(createParagraph("US Classification", usClassification)),
//                                 ],
//                             }),
//                         ],
//                     }),

//                     new Paragraph({
//                         spacing: { before: 300 },
//                         children: [
//                             new TextRun({
//                                 text: "Analyst Comments – ",
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                             new TextRun({
//                                 text: safeText(analystComments),
//                                 italics: true,
//                                 ...defaultFont,
//                             }),
//                         ],
//                     }),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "PatentDetails.docx");
//     });
// };











// import { saveAs } from "file-saver";
// import {
//     Document,
//     Packer,
//     Paragraph,
//     TextRun,
//     HeadingLevel,
//     AlignmentType,
//     ExternalHyperlink,
// } from "docx";

// export const generateWordDoc = ({
//     publicationNumber,
//     publicationUrl,
//     title,
//     inventors,
//     assignees,
//     publicationDate,
//     applicationDate,
//     priorityDate,
//     ipcCpcClassification,
//     usClassification,
//     familyMembers,
// }) => {
//     const createField = (label, value, color = "2E74B5") => {
//         return new Paragraph({
//             spacing: { after: 150 },
//             children: [
//                 new TextRun({ text: `${label}: `, bold: true, color }),
//                 new TextRun({ text: value || "—", color: "000000" }),
//             ],
//         });
//     };

//     const createHyperlinkField = (label, url, color = "2E74B5") => {
//         const link = new ExternalHyperlink({
//             children: [
//                 new TextRun({
//                     text: url,
//                     style: "Hyperlink",
//                     color: "0563C1",
//                     underline: {},
//                 }),
//             ],
//             link: url,
//         });

//         return new Paragraph({
//             spacing: { after: 150 },
//             children: [
//                 new TextRun({ text: `${label}: `, bold: true, color }),
//                 link,
//             ],
//         });
//     };

//     const doc = new Document({
//         styles: {
//             paragraphStyles: [
//                 {
//                     id: "Hyperlink",
//                     name: "Hyperlink",
//                     basedOn: "Normal",
//                     next: "Normal",
//                     quickFormat: true,
//                     run: {
//                         color: "0563C1",
//                         underline: {
//                             type: "single",
//                         },
//                     },
//                 },
//             ],
//         },
//         sections: [
//             {
//                 children: [
//                     // Title
//                     new Paragraph({
//                         text: "Patent Information",
//                         heading: HeadingLevel.HEADING_1,
//                         alignment: AlignmentType.CENTER,
//                         spacing: { after: 300 },
//                     }),

//                     // Subheading
//                     new Paragraph({
//                         text: "Bibliography Details",
//                         heading: HeadingLevel.HEADING_2,
//                         spacing: { after: 250 },
//                     }),

//                     // Fields
//                     createField("Publication Number", publicationNumber),
//                     createHyperlinkField("Publication Number (URL)", publicationUrl),
//                     createField("Title", title),
//                     createField("Inventor(s)", inventors),
//                     createField("Assignee(s)", assignees),
//                     createField("Grant/Publication Date", publicationDate),
//                     createField("Filing/Application Date", applicationDate),
//                     createField("Priority Date", priorityDate),
//                     createField("IPC/CPC Classification", ipcCpcClassification),
//                     createField("US Classification", usClassification),
//                     createField("Family Member(s)", familyMembers),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "PatentDetails.docx");
//     });
// };



















// import { saveAs } from "file-saver";
// import {
//     Document,
//     Packer,
//     Paragraph,
//     TextRun,
//     HeadingLevel,
//     AlignmentType,
// } from "docx";

// export const generateWordDoc = ({
//     publicationNumber,
//     publicationUrl,
//     title,
//     inventors,
//     assignees,
//     publicationDate,
//     applicationDate,
//     priorityDate,
//     ipcCpcClassification,
//     usClassification,
//     familyMembers
// }) => {
//     const createLabelValue = (label, value) => (
//         new Paragraph({
//             spacing: { after: 200 },
//             children: [
//                 new TextRun({ text: `${label}: `, bold: true }),
//                 new TextRun({ text: value || "—" }),
//             ],
//         })
//     );

//     const doc = new Document({
//         sections: [
//             {
//                 properties: {},
//                 children: [
//                     // Header
//                     new Paragraph({
//                         text: "Patent Information",
//                         heading: HeadingLevel.HEADING_1,
//                         alignment: AlignmentType.CENTER,
//                         spacing: { after: 400 },
//                     }),

//                     createLabelValue("Publication Number", publicationNumber),
//                     createLabelValue("Publication Number (URL)", publicationUrl),
//                     createLabelValue("Title", title),
//                     createLabelValue("Inventor(s)", inventors),
//                     createLabelValue("Assignee(s)", assignees),
//                     createLabelValue("Grant/Publication Date", publicationDate),
//                     createLabelValue("Filing/Application Date", applicationDate),
//                     createLabelValue("Priority Date", priorityDate),
//                     createLabelValue("IPC/CPC Classification", ipcCpcClassification),
//                     createLabelValue("US Classification", usClassification),
//                     createLabelValue("Family Member(s)", familyMembers),
//                 ],
//             },
//         ],
//     });

//     Packer.toBlob(doc).then((blob) => {
//         saveAs(blob, "PatentDetails.docx");
//     });
// };
