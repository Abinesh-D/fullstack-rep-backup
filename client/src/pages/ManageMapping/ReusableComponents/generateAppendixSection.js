import {
    AlignmentType, InternalHyperlink, Table, WidthType, Bookmark, HeadingLevel, TableRow, TableCell,
    VerticalAlign,
    Paragraph,
} from "docx";
import { createParagraph, createTextRun, textStyle, commonBorders, blackBorders, } from "./docxUtils";

export const generateAppendixSection = ({
    appendixNumber,
    appendixData = {},
    typeIdKey,
    isType1 = false,
}) => {
    const children = [];
    const label = `Appendix ${appendixNumber}`;
    const prefix = `${typeIdKey}`;

    children.push(
        createParagraph(
            new Bookmark({
                id: `${prefix}-appendix${appendixNumber}`,
                children: [
                    createTextRun(label, textStyle.arial14, {
                        bold: true,
                        color: "000000",
                    }),
                ],
            }),
            {
                alignment: AlignmentType.START,
                spacing: { after: 50 },
                indent: { left: 600 },
                paragraphOptions: {
                    heading: HeadingLevel.HEADING_1,
                },
            }
        ),

        createParagraph(
            new Bookmark({
                id: `${prefix}-search-terms`,
                children: [
                    createTextRun("Search Terms & Search Strings", textStyle.arial11, {
                        bold: true,
                        color: "000000",
                    }),
                ],
            }),
            {
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 920 },
                paragraphOptions: {
                    heading: HeadingLevel.HEADING_2,
                },
            }
        ),

        createParagraph(
            "The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.",
            {
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 600 },
                textStyleOverride: textStyle.arial10,
            }
        )
    );

    if (isType1) {
        children.push(
            createParagraph("▶ Search Terms", {
                indent: { left: 720 },
                spacing: { before: 50, after: 20 },
                textStyleOverride: { ...textStyle.arial11, bold: true },
            }),

            new Table({
                width: { size: 92, type: WidthType.PERCENTAGE },
                alignment: AlignmentType.CENTER,
                borders: blackBorders,
                rows: [
                    new TableRow({
                        children: ["Key words", "Synonyms/Alternative terms"].map(title =>
                            new TableCell({
                                shading: { fill: "A7C7E7" },
                                children: [
                                    createParagraph(title, {
                                        alignment: AlignmentType.LEFT,
                                        indent: { left: 100 },
                                        spacing: { before: 30, after: 30 },
                                        textStyleOverride: { ...textStyle.arial10, bold: true },
                                    }),
                                ],
                            })
                        ),
                    }),
                    ...(appendixData.baseSearchTerms || []).map(term =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        createParagraph(term.searchTermText, {
                                            indent: { left: 100 },
                                            spacing: { before: 30, after: 30 },
                                            textStyleOverride: textStyle.arial10,
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        createParagraph(term.relevantWords, {
                                            indent: { left: 100 },
                                            spacing: { before: 30, after: 30 },
                                            textStyleOverride: textStyle.arial10,
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ),
                ],
            })
        );
    } else {
        children.push(
            createParagraph("Base Search Terms", {
                indent: { left: 720 },
                spacing: { before: 50, after: 20 },
                textStyleOverride: { ...textStyle.arial11, bold: true },
            }),
            ...(appendixData.baseSearchTerms || []).map(term =>
                createParagraph(`●    ${term.searchTermText} – ${term.relevantWords}`, {
                    indent: { left: 880 },
                    spacing: { after: 20 },
                    textStyleOverride: textStyle.arial10,
                })
            )
        );
    }

    children.push(
        createParagraph("▶ Search Strings", {
            indent: { left: 720 },
            spacing: { before: 200, after: 20 },
            textStyleOverride: { ...textStyle.arial11, bold: true },
        }),

        // new Table({
        //     width: { size: 100, type: WidthType.PERCENTAGE },
        //     borders: commonBorders,
        //     rows: [
        //         new TableRow({
        //             children: [
        //                 "S. No.",
        //                 isType1
        //                     ? "Key strings (Patents/Patent Applications)"
        //                     : "Key Strings (Orbit, Google Patents, Google Scholar, etc.)",
        //                 ...(isType1 ? [] : ["Database", "Hits"]),
        //             ].map(title =>
        //                 new TableCell({
        //                     verticalAlign: AlignmentType.CENTER,
        //                     borders: commonBorders,
        //                     shading: { fill: "#2E2E2E" },
        //                     children: [
        //                         createParagraph(title, {
        //                             alignment: AlignmentType.CENTER,
        //                             textStyleOverride: {
        //                                 ...textStyle.arial10,
        //                                 bold: true,
        //                                 color: "FFFFFF",
        //                             },
        //                             spacing: { before: 0, after: 0 },
        //                         }),
        //                     ],
        //                 })
        //             ),
        //         }),
        //     ],
        // })


        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    spacing: { before: 0, after: 0 },
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        createTextRun("Key strings (Patents/Patent Applications)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                    ],
                }),

                ...(appendixData?.keyStrings ?
                    appendixData?.keyStrings?.map((keyStr, index) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: AlignmentType.CENTER,
                                    width: { size: 5, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                createTextRun(`${index + 1}.`, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    verticalAlign: AlignmentType.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.LEFT,
                                            spacing: { before: 20, after: 20 },
                                            indent: { left: 80 },
                                            children: [
                                                createTextRun(keyStr.keyStringsText, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ) : []),
            ],
            borders: blackBorders,
        }),
        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        createTextRun("", { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        createTextRun("Key strings (Non-Patent Literatures)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                    ],
                }),
                ...(appendixData?.keyStringsNpl ?
                    appendixData?.keyStringsNpl?.map((keyStr, index) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: AlignmentType.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            spacing: { after: 10, before: 10 },
                                            children: [
                                                createTextRun(`${(appendixData.keyStrings.length) + (index + 1)}.`, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    verticalAlign: AlignmentType.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.LEFT,
                                            indent: { left: 80 },
                                            children: [
                                                createTextRun(keyStr.keyStringsNplText, textStyle.arial10),
                                            ],
                                            spacing: { after: 10, before: 10 }
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ) : []),
            ],
            borders: blackBorders,
        }),
        new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE,
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        createTextRun("", { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 0, after: 0 },
                                    children: [
                                        createTextRun("Additional Search", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                    ],
                                }),
                            ],
                            shading: {
                                fill: "353839",
                            },
                        }),
                    ],
                }),

                ...(appendixData?.keyStringsAdditional ?
                    appendixData?.keyStringsAdditional?.map((keyStr, index) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            spacing: { before: 20, after: 20 },
                                            children: [
                                                createTextRun(`${(appendixData?.keyStrings.length + appendixData?.keyStringsNpl.length) + (index + 1)}.`, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            indent: { left: 80 },
                                            alignment: AlignmentType.LEFT,
                                            spacing: { before: 20, after: 20 },
                                            children: [
                                                createTextRun(keyStr.keyStringsAdditionalText, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ) : []),
            ],
            borders: blackBorders,
        }),
        new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [
                new InternalHyperlink({
                    anchor: "back-to-table-of-content",
                    children: [
                        createTextRun("Back to Table of Contents", {
                            color: "0000FF",
                            underline: true,
                            size: 16,
                            font: "Arial"
                        }),
                    ],
                }),
            ],
            spacing: { before: 50, after: 0 },
        }),
    );

    children.push(
        createParagraph(
            new Bookmark({
                id: `${prefix}-data-availability`,
                children: [
                    createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
                ],
            }),
            {
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 100 },
                indent: { left: 720 },
                paragraphOptions: {
                    heading: HeadingLevel.HEADING_2,
                },
            }
        ),
        ...(appendixData.dataAvailability || []).map(entry =>
            createParagraph(`✓ ${entry.dataAvailableText.trim()}`, {
                indent: { left: 720 },
                spacing: { after: 50 },
                textStyleOverride: textStyle.arial10,
            })
        )
    );



    return children;
};



















// import {
//     AlignmentType, InternalHyperlink, Table,
//     WidthType, Bookmark, HeadingLevel,
//     TableRow,
//     TableCell,
//     Paragraph,
// } from "docx";
// import { createTextRun, textStyle, commonBorders } from "./docxUtils";




// export const generateAppendixSection = ({
//     appendixNumber,
//     appendixData = {},
//     typeIdKey,
//     isType1 = false,
// }) => {
//     const children = [];

//     const label = `Appendix ${appendixNumber}`;
//     const prefix = `${typeIdKey}`;

//     children.push(
//         new Paragraph({
//             children: [
//                 new Bookmark({
//                     id: `${prefix}-appendix${appendixNumber}`,
//                     children: [
//                         createTextRun(label, textStyle.arial14, { bold: true, color: "000000" }),
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
//                     id: `${prefix}-search-terms`,
//                     children: [
//                         createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
//                     ],
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
//         })
//     );

//     // Search Terms
//     if (isType1) {
//         // ▶ Search Terms
//         children.push(
//             new Paragraph({
//                 children: [
//                     createTextRun("▶ Search Terms", textStyle.arial11, { bold: true }),
//                 ],
//                 alignment: AlignmentType.START,
//                 spacing: { before: 50, after: 20 },
//                 indent: { left: 720 },
//             }),

//             new Table({
//                 width: { size: 92, type: WidthType.PERCENTAGE },
//                 alignment: AlignmentType.CENTER,
//                 rows: [
//                     new TableRow({
//                         children: [
//                             new TableCell({
//                                 shading: { fill: "A7C7E7" },
//                                 children: [new Paragraph({
//                                     alignment: AlignmentType.LEFT,
//                                     indent: { left: 100 },
//                                     children: [createTextRun("Key words", textStyle.arial10, { bold: true })],
//                                 })],
//                             }),
//                             new TableCell({
//                                 shading: { fill: "A7C7E7" },
//                                 children: [new Paragraph({
//                                     alignment: AlignmentType.LEFT,
//                                     indent: { left: 100 },
//                                     children: [createTextRun("Synonyms/Alternative terms", textStyle.arial10, { bold: true })],
//                                 })],
//                             }),
//                         ],
//                     }),
//                     ...(appendixData.baseSearchTerms || []).map((term) =>
//                         new TableRow({
//                             children: [
//                                 new TableCell({
//                                     children: [new Paragraph({
//                                         indent: { left: 100 },
//                                         children: [createTextRun(term.searchTermText, textStyle.arial10)],
//                                     })],
//                                 }),
//                                 new TableCell({
//                                     children: [new Paragraph({
//                                         indent: { left: 100 },
//                                         children: [createTextRun(term.relevantWords, textStyle.arial10)],
//                                     })],
//                                 }),
//                             ],
//                         })
//                     )
//                 ],
//                 borders: commonBorders,
//             })
//         );
//     } else {
//         // Base Search Terms as bullet points
//         children.push(
//             new Paragraph({
//                 children: [
//                     createTextRun("Base Search Terms", textStyle.arial11, { bold: true }),
//                 ],
//                 alignment: AlignmentType.START,
//                 spacing: { before: 50, after: 20 },
//                 indent: { left: 720 },
//             }),
//             ...(appendixData?.baseSearchTerms || []).map(term =>
//                 new Paragraph({
//                     children: [
//                         createTextRun(`●    ${term.searchTermText} – ${term.relevantWords}`, textStyle.arial10),
//                     ],
//                     indent: { left: 880 },
//                     spacing: { after: 20 },
//                 })
//             )
//         );
//     }

//     // Search Strings Title
//     children.push(
//         new Paragraph({
//             children: [
//                 createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
//             ],
//             alignment: AlignmentType.START,
//             spacing: { before: 200, after: 20 },
//             indent: { left: 720 },
//         }),

//         new Table({
//             width: { size: 100, type: WidthType.PERCENTAGE },
//             rows: [
//                 new TableRow({
//                     children: [
//                         new TableCell({
//                             shading: { fill: "353839" },
//                             children: [new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" })],
//                             })],
//                         }),
//                         new TableCell({
//                             shading: { fill: "353839" },
//                             children: [new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     createTextRun(
//                                         isType1
//                                             ? "Key strings (Patents/Patent Applications)"
//                                             : "Key Strings (Orbit, Google Patents, Google Scholar, etc.)",
//                                         textStyle.arial10,
//                                         { bold: true, color: "FFFFFF" }
//                                     )
//                                 ],
//                             })],
//                         }),
//                         ...(isType1 ? [] : [
//                             ...["Database", "Hits"].map(title =>
//                                 new TableCell({
//                                     shading: { fill: "353839" },
//                                     children: [new Paragraph({
//                                         alignment: AlignmentType.CENTER,
//                                         children: [createTextRun(title, textStyle.arial10, { bold: true, color: "FFFFFF" })],
//                                     })],
//                                 })
//                             )
//                         ]),
//                     ],
//                 }),
//                 ...(appendixData.keyStrings || []).map((keyStr, index) =>
//                     new TableRow({
//                         children: [
//                             new TableCell({
//                                 children: [new Paragraph({
//                                     alignment: AlignmentType.CENTER,
//                                     children: [createTextRun(`${index + 1}.`, textStyle.arial10)],
//                                 })],
//                             }),
//                             new TableCell({
//                                 children: [new Paragraph({
//                                     indent: { left: 80 },
//                                     spacing: { before: 20, after: 20 },
//                                     children: [createTextRun(keyStr.keyStringsText, textStyle.arial10)],
//                                 })],
//                             }),
//                             ...(isType1 ? [] : [
//                                 ...[0, 0].map(() =>
//                                     new TableCell({
//                                         children: [new Paragraph({
//                                             alignment: AlignmentType.CENTER,
//                                             children: [createTextRun("", textStyle.arial10)],
//                                         })],
//                                     })
//                                 )
//                             ])
//                         ]
//                     })
//                 )
//             ],
//             borders: commonBorders,
//         })
//     );

//     // Data Availability
//     children.push(
//         new Paragraph({
//             children: [
//                 new Bookmark({
//                     id: `${prefix}-data-availability`,
//                     children: [
//                         createTextRun("Data Availability", textStyle.arial11, { bold: true }),
//                     ]
//                 })
//             ],
//             alignment: AlignmentType.START,
//             spacing: { before: 200, after: 100 },
//             indent: { left: 720 },
//             heading: HeadingLevel.HEADING_2,
//         }),
//         ...(appendixData?.dataAvailability || []).map((entry) =>
//             new Paragraph({
//                 children: [createTextRun(`✓ ${entry.dataAvailableText.trim()}`, textStyle.arial10)],
//                 indent: { left: 720 },
//                 spacing: { after: 50 },
//             })
//         )
//     );

//     // Back to TOC
//     children.push(
//         new Paragraph({
//             alignment: AlignmentType.RIGHT,
//             spacing: { before: 50 },
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
//         })
//     );

//     return children;
// };
