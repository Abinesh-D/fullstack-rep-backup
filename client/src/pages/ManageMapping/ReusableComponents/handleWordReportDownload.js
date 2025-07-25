import {
    Document, BorderStyle, Packer, Paragraph, TextRun, Table, TableRow, AlignmentType, TableCell, VerticalAlign, WidthType, ShadingType,
    ExternalHyperlink, HeadingLevel, ImageRun, InternalHyperlink, Bookmark, Footer, Header, TabStopPosition, TabStopType,
    UnderlineType,
    PositionalTabLeader,
} from "docx";
import { saveAs } from "file-saver";
import { getSearchMethodology } from "./searchMethodology";

const textStyle = {
    arial24: { font: "Arial", size: 48 },
    arial14: { font: "Arial", size: 28 },
    arial11: { font: "Arial", size: 22 },
    arial10: { font: "Arial", size: 20 },
    arial13: { font: "Arial", size: 26 },
};

const commonBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
};

const blackBorders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
};

const borderNone = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
};

const marginsStyle = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }
const margins150 = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }
const margins50 = { margins: { top: 50, bottom: 50, left: 50, right: 50, }, }

function formatAssigneeOrInventor(str) {
    if (!str) return "";

    if (str.includes(";")) {
        return str.toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

function toTitleCase(str) {
    if (!str) return "";
    return String(str)
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

const sanitizeText = (text) =>
    (text || "").replace(/[&<>"]/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;"
    }[c]));

function cleanListWithEtc(input) {
    const items = input.split(",").map((item) => item.trim());
    const result = [];

    for (let i = 0; i < items.length; i++) {
        if (items[i].toLowerCase() === "etc." && i > 0) {
            result[result.length - 1] += ", etc.";
        } else if (items[i].toLowerCase().endsWith("etc.")) {
            result.push(items[i]);
        } else {
            result.push(items[i]);
        }
    }

    return result;
}

// async function getImageArrayBufferFromUrl(url) {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     return blob.arrayBuffer();
// }

const borderColor = {
    top: { style: BorderStyle.SINGLE, size: 20, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 20, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 20, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 20, color: "000000" },
};

const disclaimer = "This search report is based on the resources available in public domain such as published patents/applications, non-patent literature, products, blogs, technology news, company websites and available/accessible/downloadable. Furthermore, the report is based upon individual expert’s view/judgment & such analysis may vary from expert to expert. Kindly refrain concurring them as Molecular Connections’ views. The contents of this research is for general information purposes only. While Molecular Connections endeavor is to keep the information up to date and correct, Molecular Connections makes no representations OR warranties of any kind, express OR implied, about the completeness OR availability with respect to the contents of this research paper. Any reliance placed on such information is therefore strictly at user’s own risk."

export const handleWordReportDownload = async ({
    projectTitle,
    projectSubTitle,
    searchFeatures,
    relevantReferences,
    nonPatentLiteratures,
    relatedReferences,
    appendix1,
    appendix2,
    // projectImageUrl,
    overallSummary,
    getProjectValue,
}) => {


    console.log(getProjectValue.projectTypeId, "getProjectValue.projectTypeId")

    const typeId1 = getProjectValue.projectTypeId === "0001";
    const typeId2 = getProjectValue.projectTypeId === "0002";
    const typeId3 = getProjectValue.projectTypeId === "0003";
    const typeId4 = getProjectValue.projectTypeId === "0004";

    
    const nplMap = nonPatentLiteratures.map(npl => npl.nplTitle);
    const patentMap = relevantReferences.map(ptn => ptn.patentNumber);

    const combinedUniqueArray = [...new Set([...nplMap, ...patentMap])];

    const createPageProperties = (margin = 920, orientation = "portrait") => ({
        page: {
            margin: {
                top: margin,
                bottom: margin,
                left: margin,
                right: margin,
            },
            size: {
                orientation: orientation,
                width: 15800,
                height: 11573,
            },
        },
    });

    const createTextRun = (text, style = textStyle.arial11, overrides = {}) =>
        new TextRun({ text, ...style, ...overrides });


    const createSingleColumnTableRows = (rows) =>
    rows.map(({ label, value, isParagraphChildren }) =>
        new TableRow({
            children: [
                new TableCell({
                    verticalAlign: AlignmentType.CENTER,
                    children: [
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${label}:`,
                                    bold: true,
                                }),
                            ],
                        }),
                    ],
                    borders: borderNone,
                }),
                new TableCell({
                    verticalAlign: AlignmentType.CENTER,
                    children: [
                        isParagraphChildren
                            ? new Paragraph({ children: value })
                            : new Paragraph({
                                children: [
                                    new TextRun({ text: value })
                                ]
                            }),
                    ],
                    borders: borderNone,
                }),
            ],
        })
    );




    // const createSingleColumnTableRows = (rows) =>
    //     rows.map(({ label, value, isParagraphChildren }) =>
    //         new TableRow({
    //             children: [
    //                 new TableCell({
    //                     verticalAlign: AlignmentType.CENTER,
    //                     children: [
    //                         new Paragraph({
    //                             text: `${label}:`,
    //                             bold: true,
    //                         }),
    //                     ],
    //                     borders: borderNone,
    //                 }),
    //                 new TableCell({
    //                     verticalAlign: AlignmentType.CENTER,
    //                     children: [
    //                         isParagraphChildren
    //                             ? new Paragraph({ children: value })
    //                             : new Paragraph({ text: value })
    //                     ],
    //                     borders: borderNone,
    //                 }),
    //             ],
    //         })
    //     );





    const header = new Header({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun({
                        text: "Docket No. - IDF-34131",
                        bold: true,
                        color: "000000",
                        size: 20,
                        font: "Arial",
                    }),
                ],
            }),
        ],
    });

    const footer = new Footer({
        children: [
            new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                    new TextRun("CONFIDENTIAL"),
                ],
            }),
            new Paragraph({
                alignment: AlignmentType.END,
                children: [
                    new TextRun("Page "),
                    new TextRun({
                        children: ["CURRENT"],
                        bold: true,
                    }),
                    new TextRun(" of "),
                    new TextRun({
                        children: ["TOTAL_PAGES"],
                        bold: true,
                    }),
                ],
            }),
        ],
    });

    // const cloudinaryUrls = (projectImageUrl || []).map(buf => buf?.base64Url).filter(Boolean);

    // const imageBuffers = await Promise.all(
    //     cloudinaryUrls.map(async (url) => await getImageArrayBufferFromUrl(url))
    // );
    // const IMAGES_PER_ROW = 4;

    // const imageTableRows = [];
    // for (let i = 0; i < imageBuffers.length; i += IMAGES_PER_ROW) {
    //     const rowImages = imageBuffers.slice(i, i + IMAGES_PER_ROW);

    //     const row = new TableRow({
    //         children: rowImages.map((buffer) =>
    //             new TableCell({
    //                 children: [
    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,
    //                         children: [
    //                             new ImageRun({
    //                                 data: buffer,
    //                                 transformation: {
    //                                     width: 120,
    //                                     height: 90,
    //                                 },
    //                             }),
    //                         ],
    //                     }),
    //                 ],
    //                 borders: {
    //                     top: { style: "none" },
    //                     bottom: { style: "none" },
    //                     left: { style: "none" },
    //                     right: { style: "none" },
    //                 },
    //             })
    //         ),
    //     });

    //     imageTableRows.push(row);
    // }
    // const imageGridTable = new Table({
    //     rows: imageTableRows,
    //     width: {
    //         size: 100,
    //         type: "pct",
    //     },
    //     borders: {
    //         top: { style: "none" },
    //         bottom: { style: "none" },
    //         left: { style: "none" },
    //         right: { style: "none" },
    //         insideHorizontal: { style: "none" },
    //         insideVertical: { style: "none" },
    //     },
    // });

    function getFamilyMembersParagraphChildren(data, textStyle) {
        const familyMembers = data.FamilyMembers || [];
        const displayLimit = 4;
        const totalCount = familyMembers.length;

        const displayedMembers = familyMembers.slice(0, displayLimit).join(", ");
        const remainingCount = totalCount - displayLimit;
        const remainingText = remainingCount > 0 ? `+${remainingCount} more` : null;

        const children = [
            new TextRun({
                text: sanitizeText(displayedMembers || "N/A"),
                ...textStyle.arial10,
            }),
        ];

        if (remainingText) {
            children.push(
                new ExternalHyperlink({
                    link: data.hyperLink,
                    children: [
                        new TextRun({
                            text: ` ${sanitizeText(remainingText)}`,
                            ...textStyle.arial10BoldBlue,
                            color: "0000FF",
                            underline: true,
                        }),
                    ],
                })
            );
        }

        return children;
    }



    const tocConfig = [
        { label: "1.   Search Features", anchor: "search-features", isBold: true },
        { label: "2.   Search Methodology", anchor: "search-methodology", isBold: true },
        { label: "3.   Potentially Relevant References", anchor: "potentially-relevant-references", isBold: true },
        { label: "4.   Potentially Relevant References", anchor: "potentially-relevant-references-2", isBold: true },
        ...relevantReferences.map((ref, index) => ({
            label: `${index + 1}.    ${ref.patentNumber}`,
            anchor: `patentNumberCount-${index + 1}`,
            indent: 360,
        })),
        { label: "5.   Related References", anchor: "related-references", isBold: true },
        { label: "Appendix 1", anchor: "appendix-link-1", isBold: true },
        { label: "Search Terms & Search Strings", anchor: "search-terms", indent: 720, font13: true },
        { label: "Data Availability", anchor: "data-availability", indent: 720, font13: true },
        { label: "Appendix 2", anchor: "appendix-link-2", isBold: true },
        { label: "Databases", anchor: "databases", indent: 720, font13: true },
        { label: "Disclaimer", anchor: "disclaimer", isBold: true },
    ];

      const tocConfigSummary = [
        { label: "1.   Search Features", anchor: "search-features", isBold: true },
        { label: "2.   Executive Summary", anchor: "executive-summary", isBold: true },
        { label: "3.   Potentially Relevant References", anchor: "potentially-relevant-references-2", isBold: true },

          ...nonPatentLiteratures.map((npl, index) => ({
              label: `${index + 1}.    ${npl.nplTitle}`,
              anchor: `nplNumber-${index + 1}`,
              indent: 360,
          })),

          ...relevantReferences.map((ref, index) => ({
              label: `${nonPatentLiteratures.length + index + 1}.    ${ref.patentNumber}`,
              anchor: `patentNumberCount-${nonPatentLiteratures.length + index + 1}`,
              indent: 360,
          })),
        { label: "4.   Related References", anchor: "related-references", isBold: true },
        { label: "Appendix 1", anchor: "appendix-link-1", isBold: true },
        { label: "Search Terms & Search Strings", anchor: "search-terms", indent: 720, font13: true },
        { label: "Data Availability", anchor: "data-availability", indent: 720, font13: true },
        { label: "Appendix 2", anchor: "appendix-link-2", isBold: true },
        { label: "Databases", anchor: "databases", indent: 720, font13: true },
        { label: "Disclaimer", anchor: "disclaimer", isBold: true },
    ];

    const relatedReferencesTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({
                children: [
                    "S. No",
                    "Publication Number",
                    "Title",
                    "Assignee/Inventor",
                    "Priority Date",
                    "Publication Date",
                    "Family Members",
                ].map((header) =>
                    new TableCell({
                        verticalAlign: AlignmentType.CENTER,
                        shading: {
                            fill: "A7C7E7",
                            type: ShadingType.CLEAR,
                            color: "auto",
                        },
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 20, after: 0 },
                                children: [
                                    createTextRun(header, textStyle.arial10, { bold: true }),
                                ],
                            }),
                        ],
                        borders: commonBorders,
                    })
                ),
            }),
            ...(relatedReferences || []).map((pub, index) =>
                new TableRow({
                    children: [
                        new TableCell({
                            width: { size: 5, type: WidthType.PERCENTAGE, },
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    spacing: { before: 20, after: 0 },
                                    alignment: AlignmentType.CENTER,
                                    children: [
                                        createTextRun(String(index + 1), textStyle.arial10),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    indent: { left: 20 },
                                    children: [
                                        new ExternalHyperlink({
                                            link: pub.relatedPublicationUrl,
                                            children: [
                                                createTextRun(
                                                    sanitizeText(pub.publicationNumber.toUpperCase()),
                                                    textStyle.arial10,
                                                    { style: "Hyperlink" }
                                                ),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    children: [
                                        createTextRun(
                                            sanitizeText(toTitleCase(pub.relatedTitle)),
                                            textStyle.arial10
                                        ),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    children: [
                                        createTextRun(
                                            pub.relatedAssignee?.length
                                                ? pub.relatedAssignee.map(formatAssigneeOrInventor).join('; ')
                                                : pub.relatedInventor?.map(formatAssigneeOrInventor).join('; ') || 'N/A',
                                            textStyle.arial10
                                        ),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                        new TableCell({
                            width: { size: 10, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    children: [
                                        createTextRun(
                                            sanitizeText(pub.relatedPriorityDate || "N/A"),
                                            textStyle.arial10
                                        ),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                        new TableCell({
                            width: { size: 10, type: WidthType.PERCENTAGE },
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    children: [
                                        createTextRun(
                                            sanitizeText(pub.relatedPublicationDate || "N/A"),
                                            textStyle.arial10
                                        ),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),

                        new TableCell({
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    spacing: { before: 20, after: 0 },
                                    children: getFamilyMembersParagraphChildren({ FamilyMembers: pub.relatedFamilyMembers, hyperLink: pub.relatedPublicationUrl },
                                        textStyle),
                                }),
                            ],
                            borders: commonBorders,
                        }),

                        // new TableCell({
                        //     verticalAlign: VerticalAlign.CENTER,
                        //     margins: margins150.margins,
                        //     children: [
                        //         new Paragraph({
                        //             alignment: AlignmentType.LEFT,
                        //             spacing: { before: 20, after: 0 },
                        //             children: [
                        //                 createTextRun(
                        //                     sanitizeText(
                        //                         (pub.relatedFamilyMembers || []).join(", ") || "N/A"
                        //                     ),
                        //                     textStyle.arial10
                        //                 ),
                        //             ],
                        //         }),
                        //     ],
                        //     borders: commonBorders,
                        // }),
                    ],
                })
            ),
        ],
    });



    const createTickedParagraphs = (input) => {
        const normalized = input.replace(/\n/g, ',');
        let items = normalized
            .split(',')
            .map(part => part.trim())
            .filter(Boolean);

        if (items.length > 1) {
            const last = items[items.length - 1].toLowerCase();
            if (last === 'etc' || last === 'etc.') {
                const secondLast = items[items.length - 2];
                items = items.slice(0, -2).concat(`${secondLast}, etc.`);
            }
        }

        return items.map((item) =>
            new Paragraph({
                indent: { left: 880 },
                spacing: { after: 0 },
                children: [
                    createTextRun(`✓ ${item}`, textStyle.arial10),
                ],
            })
        );
    };


    console.log('combinedUniqueArray', combinedUniqueArray)

    // Table Header Row
    const headerRow = new TableRow({
        children: [
            "S. No",
            "Patents Literatures",
            "Heading 1",
            "Heading 2",
            "Heading 3",
            "Heading 4",
            "Heading 5",
        ].map((header, index) =>
            new TableCell({
                verticalAlign: VerticalAlign.CENTER,
                shading: {
                    fill: index < 2 ? "C2D38B" : "A7C7E7",
                    type: ShadingType.CLEAR,
                    color: "auto",
                },
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 20, after: 0 },
                        children: [
                            createTextRun(header, textStyle.arial10, { bold: true }),
                        ],
                    }),
                ],
                borders: blackBorders,
            })
        ),
    });
console.log('appendix1', appendix1)
    // Table Data Rows



    const dataRows = combinedUniqueArray.map((value, index) => {
        const isNPL = nplMap.includes(value);
        const url = isNPL
            ? nonPatentLiteratures.find(npl => npl.nplTitle === value)?.url
            : relevantReferences.find(ref => ref.patentNumber === value)?.publicationUrl;

        return new TableRow({
            children: [`${index + 1}`, value, "", "", "", "", "",].map((cellText, cellIndex) =>
                new TableCell({
                    verticalAlign: VerticalAlign.CENTER,
                    children: [
                        new Paragraph({
                            alignment: AlignmentType.CENTER,
                            spacing: { before: 10, after: 10 },
                            children: cellIndex === 1 && url
                                ? [
                                    new ExternalHyperlink({
                                        children: [
                                            createTextRun(cellText, textStyle.arial10, {
                                                color: "0000FF",
                                                underline: {},
                                            }),
                                        ],
                                        link: url,
                                    }),
                                ]
                                : [
                                    createTextRun(cellText, textStyle.arial10),
                                ],
                        }),
                    ],
                    borders: commonBorders,
                })
            ),
        });
    });

    // const dataRows = combinedUniqueArray.map((value, index) => {
    //     const isNPL = nplMap.includes(value);
    //     const url = isNPL
    //         ? nonPatentLiteratures.find(npl => npl.nplTitle === value)?.url
    //         : relevantReferences.find(ref => ref.patentNumber === value)?.publicationUrl;

    //     return new TableRow({
    //         children: [`${index + 1}`, value, "", "", "", "", "",].map((cellText, cellIndex) =>
    //             new TableCell({
    //                 verticalAlign: VerticalAlign.CENTER,
    //                 children: [
    //                     new Paragraph({
    //                         alignment: AlignmentType.CENTER,
    //                         spacing: { before: 10, after: 10 },
    //                         children: cellIndex === 1 && url
    //                             ? [
    //                                 new ExternalHyperlink({
    //                                     children: [
    //                                         createTextRun(cellText, textStyle.arial10, {
    //                                             color: "0000FF",
    //                                             underline: {},
    //                                         }),
    //                                     ],
    //                                     link: url,
    //                                 }),
    //                             ]
    //                             : [
    //                                 createTextRun(cellText, textStyle.arial10),
    //                             ],
    //                     }),
    //                 ],
    //                 borders: blackBorders,
    //             })
    //         ),
    //     });
    // });

    // Executive Summary Table
    const ExecutiveSummaryTable = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [headerRow, ...dataRows],
    });

    // Summary Paragraphs
    const summaryParagraphs = [
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 100 },
            children: [
                createTextRun("The patent literatures identified through quick search disclose the features defined in the objective as summarized in the above table."),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 100 },
            children: [
                createTextRun("The shortlisted prior arts disclose a volatile composition dispenser/air freshener housing has a removable bottom portion with protrusion and replaceable cartridge."),
            ],
        }),
        new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 100 },
            children: [
                createTextRun("The shortlisted prior arts does not specifically disclose 5mm of protrusion on the exterior wall of the cartridges."),
            ],
        }),
    ];


    const relevantReferencesTable = new Table({
        width: { size: 50, type: WidthType.PERCENTAGE },
        alignment: AlignmentType.CENTER,
        borders: {
            top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        },
        rows: [
            new TableRow({
                // tableHeader: true,
                children: [
                    new TableCell({
                        verticalAlign: AlignmentType.CENTER,
                        shading: { fill: "A7C7E7" },
                        columnSpan: 2,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 30, after: 10 },
                                children: [
                                    createTextRun("Relevant Prior Arts", { bold: true }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                // tableHeader: true,
                children: [
                    new TableCell({
                        verticalAlign: AlignmentType.CENTER,
                        columnSpan: 2,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 30, after: 10 },
                                children: [
                                    createTextRun("Patent/Publications", { bold: true }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),

            ...relevantReferences.map((ref, index) =>
                new TableRow({
                    children: [
                        new TableCell({
                            verticalAlign: AlignmentType.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE },
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { before: 50 },
                                    children: [
                                        new InternalHyperlink({
                                            anchor: `patent-${ref.patentNumber}`,
                                            children: [
                                                createTextRun(`Reference ${index + 1}`, { color: "0000FF", underline: true, }),
                                            ],
                                        })
                                    ]
                                }),
                            ],
                        }),
                        new TableCell({
                            verticalAlign: AlignmentType.CENTER,
                            width: { size: 50, type: WidthType.PERCENTAGE },

                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    spacing: { before: 50 },
                                    indent: { left: 100 },
                                    children: [
                                        new ExternalHyperlink({
                                            link: ref.publicationUrl,
                                            children: [
                                                // new Bookmark({
                                                //     id: `patentNumberCount-${index + 1}`,
                                                //     children: [
                                                createTextRun(ref.patentNumber, { color: "0000FF", underline: true, }),
                                                //     ]
                                                // })
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                })
            ),
        ],
    });

    const tocTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
            new Bookmark({
                id: "back-to-table-of-content",
                children: [
                    createTextRun("Table of Contents", textStyle.arial14, { bold: true, underline: true })
                ]
            })
        ],
        spacing: { after: 200, before: 100 },
    });


    const tocTable = new Table({
        width: {
            size: 95,
            type: WidthType.PERCENTAGE,
        },
        indent: {
            size: 0,
            type: WidthType.DXA,
        },
        alignment: AlignmentType.CENTER,
        rows: ((typeId2 && tocConfigSummary) || (typeId1 && tocConfig)).map(item =>
            new TableRow({
                children: [
                    new TableCell({
                        children: [
                            new Paragraph({
                                spacing: { before: 0, after: 0 },
                                indent: item.indent ? { left: item.indent } : undefined,
                                tabStops: [
                                    {
                                        type: TabStopType.RIGHT,
                                        position: TabStopPosition.MAX,
                                        leader: "dot",
                                    },
                                ],
                                children: [
                                    createTextRun(item.label, textStyle.arial10, {
                                        bold: item.isBold || false,
                                        size: item.font13 ? 26 : 22,
                                    }),
                                ],
                            }),
                        ],
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        },
                    }),
                    new TableCell({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                tabStops: [
                                    {
                                        type: TabStopType.RIGHT,
                                        position: TabStopPosition.MAX,
                                        leader: "dot",
                                    },
                                ],

                                children: [

                                    createTextRun("0", textStyle.arial10),
                                ],
                            }),
                        ],
                        borders: {
                            top: { style: BorderStyle.NONE },
                            bottom: { style: BorderStyle.NONE },
                            left: { style: BorderStyle.NONE },
                            right: { style: BorderStyle.NONE },
                        },
                    }),
                ],
            })
        ),
        borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
        },
    });



    const appendix1Childern = []

    if (typeId2) {
        appendix1Childern.push(
            new Paragraph({
                children: [
                    new Bookmark({
                        id: "Appendix-1",
                        children: [
                            createTextRun(typeId2 ? "Appendix 2" : typeId1 ? "Appendix 1" : "", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                    }),
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.START,
                spacing: { after: 50 },
                indent: { left: 600 },
            }),

            new Paragraph({
                children: [
                    createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
                ],
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 920 },
            }),

            new Paragraph({
                children: [
                    createTextRun(
                        "The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.",
                        textStyle.arial10
                    ),
                ],
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 600 },
            }),

            // baseSearchTerms
            new Paragraph({
                children: [
                    createTextRun("Base Search Terms", textStyle.arial11, { bold: true }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 50, after: 20 },
                indent: { left: 720 },
            }),

            ...(appendix1?.baseSearchTerms?.map(term =>
                new Paragraph({
                    children: [
                        createTextRun(`●    ${term.searchTermText} – ${term.relevantWords}`, textStyle.arial10),
                    ],
                    alignment: AlignmentType.START,
                    spacing: { before: 20, after: 20 },
                    indent: { left: 880 },
                })
            ) || []),

            // Search Strings
            new Paragraph({
                children: [
                    createTextRun("Search Strings", textStyle.arial11, { bold: true }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 20 },
                indent: { left: 720 },
            }),

            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                rows: [
                    new TableRow({
                        // tableHeader: true,
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

                    ...appendix1?.keyStrings?.map((keyStr, index) =>
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
                    ),
                ],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
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
                                font: "Arial",
                            }),
                        ],
                    }),
                ],
                spacing: { before: 50, after: 0 },
            }),

            // Data Availability
            new Paragraph({
                children: [
                    createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 100 },
                indent: { left: 720 },
                heading: HeadingLevel.HEADING_2,
            }),

            ...(appendix1?.dataAvailability?.map(mapData =>
                new Paragraph({
                    children: [
                        createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
                    ],
                    alignment: AlignmentType.START,
                    spacing: { after: 100 },
                    indent: { left: 720 },
                })
            ) || [])
        );
    } else if (typeId1) {
        appendix1Childern.push(

            new Paragraph({
                children: [
                    new Bookmark({
                        id: "Appendix-1",
                        children: [
                            createTextRun("Appendix 1", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                    }),
                ],
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.START,
                spacing: { after: 50 },
                indent: { left: 600 },
            }),

            new Paragraph({
                children: [
                    createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
                ],
                heading: HeadingLevel.HEADING_2,
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 920 },
            }),

            new Paragraph({
                children: [
                    createTextRun("The search terms and key strings to extract relevant patent publications and non-patent literature are provided below.", textStyle.arial10),
                ],
                alignment: AlignmentType.START,
                spacing: { after: 30 },
                indent: { left: 600 },
            }),

            new Paragraph({
                children: [
                    createTextRun("▶ Search Terms", textStyle.arial11, { bold: true }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 50, after: 20 },
                indent: { left: 720 },
            }),

            // ✅ Search Terms Table
            new Table({
                width: { size: 92, type: WidthType.PERCENTAGE },
                alignment: AlignmentType.CENTER,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        spacing: { before: 0, after: 0 },
                                        alignment: AlignmentType.START,
                                        indent: { left: 100 },
                                        children: [
                                            createTextRun("Key words", textStyle.arial10, { bold: true, color: "000000" }),
                                        ],
                                    }),
                                ],
                                shading: { fill: "A7C7E7" },
                            }),
                            new TableCell({
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        spacing: { before: 0, after: 0 },
                                        alignment: AlignmentType.START,
                                        indent: { left: 100 },
                                        children: [
                                            createTextRun("Synonyms/Alternative terms", textStyle.arial10, { bold: true, color: "000000" }),
                                        ],
                                    }),
                                ],
                                shading: { fill: "A7C7E7" },
                            }),
                        ],
                    }),
                    ...appendix1?.baseSearchTerms?.map((keyStr) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.LEFT,
                                            spacing: { before: 20, after: 20 },
                                            indent: { left: 100 },
                                            children: [
                                                createTextRun(keyStr.searchTermText, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.LEFT,
                                            spacing: { before: 20, after: 20 },
                                            indent: { left: 100 },
                                            children: [
                                                createTextRun(keyStr.relevantWords, textStyle.arial10),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        })
                    ),
                ],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
            }),

            // ✅ Search Strings Title
            new Paragraph({
                children: [
                    createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 20 },
                indent: { left: 720 },
            }),

            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                rows: [
                    new TableRow({
                        // tableHeader: true,
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

                    ...appendix1?.keyStrings?.map((keyStr, index) =>
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
                    ),
                ],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
            }),

            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                rows: [
                    new TableRow({
                        // tableHeader: true,
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
                    ...appendix1?.keyStringsNpl?.map((keyStr, index) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: AlignmentType.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            spacing: { after: 10, before: 10 },
                                            children: [
                                                createTextRun(`${(appendix1.keyStrings.length) + (index + 1)}.`, textStyle.arial10),
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
                    ),
                ],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
            }),

            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                rows: [
                    // Table Header
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

                    // Dynamic Rows
                    ...appendix1?.keyStringsAdditional?.map((keyStr, index) =>
                        new TableRow({
                            children: [
                                new TableCell({
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            spacing: { before: 20, after: 20 },
                                            children: [
                                                createTextRun(`${(appendix1?.keyStrings.length + appendix1?.keyStringsNpl.length) + (index + 1)}.`, textStyle.arial10),
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
                    ),
                ],
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                },
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

            // ✅ Data Availability
            new Paragraph({
                children: [
                    createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 100 },
                indent: { left: 720 },
                heading: HeadingLevel.HEADING_2,
            }),
            ...appendix1.dataAvailability.map((mapData) =>
                new Paragraph({
                    children: [
                        createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
                    ],
                    alignment: AlignmentType.START,
                    spacing: { after: 100 },
                    indent: { left: 720 },
                }),
            ),
        )
    } 


    const doc = new Document({
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 20,
                    },
                    paragraph: {
                        spacing: {
                            after: 120,
                        },
                    },
                },
            },
        },
        sections: [
            // Project Title
            {
                properties: createPageProperties(),
                // headers: { default: header },
                // footers: { default: footer },
                children: [

                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 50 },
                        children: [
                            createTextRun(projectTitle, textStyle.arial24, { bold: true }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 50, after: 50 },
                        children: [
                            createTextRun(projectSubTitle, textStyle.arial24, { bold: true }),
                        ],
                    }),
                ],
            },

            // Table Content
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },

                children: [
                    tocTitle,
                    tocTable,
                    new Paragraph({
                        children: [
                            new ExternalHyperlink({
                                link: "https://par.molecularconnections.com/mc-review/form/IDF-34131Top%20Load%20Washer%20with%20Flexible%20Dispenser%20and%20Serviceable%20Dosing%20System",
                                children: [
                                    createTextRun("Please rate this search report", textStyle.arial10, { bold: true, color: "0000FF", underline: { type: UnderlineType.SINGLE }, })
                                ]
                            })
                        ],
                        spacing: { before: 100 },
                        indent: { left: 380 }
                    })
                ],
            },

            // Search Features
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            new Bookmark({
                                id: "search-features",
                                children: [
                                    createTextRun("1.  Search Features", textStyle.arial14, { bold: true, color: "000000" }),
                                ]
                            })
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 300 },
                        indent: { left: 880 },
                        heading: HeadingLevel.HEADING_1,
                    }),
                    ...searchFeatures
                        .filter((p) => p.trim() !== "")
                        .map((para) =>
                            new Paragraph({
                                children: [
                                    createTextRun(sanitizeText(para.trim() + "."), textStyle.arial10),
                                ],
                                alignment: AlignmentType.JUSTIFIED,
                                spacing: { before: 200, after: 200 },
                                indent: { left: 380, right: 380 }
                            })
                        ),
                    // imageGridTable,

                ],
            },
            // Search Methodology
            typeId1 && {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: 
                    getSearchMethodology(projectTitle)
            },

            typeId1 && {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 880 },
                        children: [
                            new Bookmark({
                                id: "potentially-relevant-references",
                                children: [
                                    createTextRun("3. Potentially Relevant References", textStyle.arial14, {
                                        bold: true,
                                        color: "000000",
                                    }),
                                ],
                            }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 400, before: 500 },
                    }),
                    relevantReferencesTable,
                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, {
                                bold: true,
                                color: "000000",
                            }),
                        ],
                        spacing: { after: 200, before: 200 },
                    }),
                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            createTextRun(overallSummary, textStyle.arial10),
                        ],
                        spacing: { after: 200 },
                    }),
                ]

            },

            (typeId2) && {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 630 },
                        spacing: { after: 50 },
                        heading: HeadingLevel.HEADING_1,
                        children: [
                            new Bookmark({
                                id: "related-references",
                                children: [
                                    createTextRun("2. Executive Summary", textStyle.arial14, {
                                        bold: true,
                                        color: "000000",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    new Paragraph({
                        indent: { left: 630 },
                        spacing: { after: 50 },
                        children: [
                            createTextRun(
                                "Feature- Mapping Summary of Potential Relevant References",
                                textStyle.arial10,
                                { italics: true }
                            ),
                        ],
                    }),
                    ExecutiveSummaryTable,
                    ...summaryParagraphs,


                    // ...(typeId2
                    //     ? [
                    //         new Paragraph({
                    //             indent: { left: 630 },
                    //             spacing: { after: 50 },
                    //             heading: HeadingLevel.HEADING_1,
                    //             children: [
                    //                 new Bookmark({
                    //                     id: "related-references",
                    //                     children: [
                    //                         createTextRun("2. Executive Summary", textStyle.arial14, {
                    //                             bold: true,
                    //                             color: "000000",
                    //                         }),
                    //                     ],
                    //                 }),
                    //             ],
                    //         }),
                    //         new Paragraph({
                    //             indent: { left: 630 },
                    //             spacing: { after: 50 },
                    //             children: [
                    //                 createTextRun(
                    //                     "Feature- Mapping Summary of Potential Relevant References",
                    //                     textStyle.arial10,
                    //                     { italics: true }
                    //                 ),
                    //             ],
                    //         }),
                    //         ExecutiveSummaryTable,
                    //         ...summaryParagraphs,
                    //     ]
                    //     : 


                    //     typeId1
                    //         ? [
                    //             new Paragraph({
                    //                 indent: { left: 880 },
                    //                 children: [
                    //                     new Bookmark({
                    //                         id: "potentially-relevant-references",
                    //                         children: [
                    //                             createTextRun("3. Potentially Relevant References", textStyle.arial14, {
                    //                                 bold: true,
                    //                                 color: "000000",
                    //                             }),
                    //                         ],
                    //                     }),
                    //                 ],
                    //                 heading: HeadingLevel.HEADING_1,
                    //                 spacing: { after: 400, before: 500 },
                    //             }),
                    //             relevantReferencesTable,
                    //             new Paragraph({
                    //                 indent: { left: 520 },
                    //                 children: [
                    //                     createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, {
                    //                         bold: true,
                    //                         color: "000000",
                    //                     }),
                    //                 ],
                    //                 spacing: { after: 200, before: 200 },
                    //             }),
                    //             new Paragraph({
                    //                 indent: { left: 520 },
                    //                 children: [
                    //                     createTextRun(overallSummary, textStyle.arial10),
                    //                 ],
                    //                 spacing: { after: 200 },
                    //             }),
                    //         ]
                    //         : []),
                ]
            },
            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [
            //         // Conditionally include Search Methodology
            //         ...(typeId1 ? getSearchMethodology(projectTitle) : []),

            //         // Executive Summary section
                    // ...(typeId2
                    //     ? [
                    //         new Paragraph({
                    //             indent: { left: 630 },
                    //             spacing: { after: 50 },
                    //             heading: HeadingLevel.HEADING_1,
                    //             children: [
                    //                 new Bookmark({
                    //                     id: "related-references",
                    //                     children: [
                    //                         createTextRun("2. Executive Summary", textStyle.arial14, {
                    //                             bold: true,
                    //                             color: "000000",
                    //                         }),
                    //                     ],
                    //                 }),
                    //             ],
                    //         }),
                    //         new Paragraph({
                    //             indent: { left: 630 },
                    //             spacing: { after: 50 },
                    //             children: [
                    //                 createTextRun(
                    //                     "Feature- Mapping Summary of Potential Relevant References",
                    //                     textStyle.arial10,
                    //                     { italics: true }
                    //                 ),
                    //             ],
                    //         }),
                    //         ExecutiveSummaryTable,
                    //         ...summaryParagraphs,
                    //     ]
                    //     : typeId1
                    //         ? [
                    //             new Paragraph({
                    //                 indent: { left: 880 },
                    //                 children: [
                    //                     new Bookmark({
                    //                         id: "potentially-relevant-references",
                    //                         children: [
                    //                             createTextRun("3. Potentially Relevant References", textStyle.arial14, {
                    //                                 bold: true,
                    //                                 color: "000000",
                    //                             }),
                    //                         ],
                    //                     }),
                    //                 ],
                    //                 heading: HeadingLevel.HEADING_1,
                    //                 spacing: { after: 400, before: 500 },
                    //             }),
                    //             relevantReferencesTable,
                    //             new Paragraph({
                    //                 indent: { left: 520 },
                    //                 children: [
                    //                     createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, {
                    //                         bold: true,
                    //                         color: "000000",
                    //                     }),
                    //                 ],
                    //                 spacing: { after: 200, before: 200 },
                    //             }),
                    //             new Paragraph({
                    //                 indent: { left: 520 },
                    //                 children: [
                    //                     createTextRun(overallSummary, textStyle.arial10),
                    //                 ],
                    //                 spacing: { after: 200 },
                    //             }),
                    //         ]
                    //         : []),
            //     ],
            // },


            




            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: typeId1 && getSearchMethodology(projectTitle),
            //      ...(typeId2
            //             ? [
            //                 new Paragraph({
            //                     indent: { left: 630 },
            //                     spacing: { after: 50 },
            //                     heading: HeadingLevel.HEADING_1,
            //                     children: [
            //                         new Bookmark({
            //                             id: "related-references",
            //                             children: [
            //                                 createTextRun("Executive Summary", textStyle.arial14, { bold: true, color: "000000" }),
            //                             ],
            //                         }),
            //                     ],
            //                 }),
            //                 new Paragraph({
            //                     indent: { left: 630 },
            //                     spacing: { after: 50 },
            //                     children: [
            //                         createTextRun("Feature- Mapping Summary of Potential Relevant References", textStyle.arial10, {
            //                             italics: true,
            //                         }),
            //                     ],
            //                 }),
            //                 ExecutiveSummaryTable,
            //                 ...summaryParagraphs,
            //             ]
            //             : typeId1 && [
            //                 new Paragraph({
            //                     indent: { left: 880 },
            //                     children: [
            //                         new Bookmark({
            //                             id: "potentially-relevant-references",
            //                             children: [
            //                                 createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
            //                             ]
            //                         })
            //                     ],
            //                     heading: HeadingLevel.HEADING_1,
            //                     spacing: { after: 400, before: 500 },
            //                 }),
            //                 relevantReferencesTable,
            //                 new Paragraph({
            //                     indent: { left: 520 },
            //                     children: [
            //                         createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, { bold: true, color: "000000" }),
            //                     ],
            //                     spacing: { after: 200, before: 200 },
            //                 }),
            //                 new Paragraph({
            //                     indent: { left: 520 },
            //                     children: [
            //                         createTextRun(overallSummary, textStyle.arial10),
            //                     ],
            //                     spacing: { after: 200 },
            //                 }),
            //             ]
            //         ),
            // },

            // Executive Summary
            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [

            //         typeId2 ? 
            //           new Paragraph({
            //             indent: { left: 630 },
            //             spacing: { after: 50 },
            //             heading: HeadingLevel.HEADING_1,
            //             children: [
            //                 new Bookmark({
            //                     id: "related-references",
            //                     children: [
            //                         createTextRun("Executive Summary", textStyle.arial14, { bold: true, color: "000000" }),
            //                     ],
            //                 }),
            //             ],
            //         }),
            //         new Paragraph({
            //             indent: { left: 630 },
            //             spacing: { after: 50 },
            //             children: [
            //                 createTextRun("Feature- Mapping Summary of Potential Relevant References", textStyle.arial10, {
            //                     italics: true,
            //                 }),
            //             ],
            //         }),
            //         ExecutiveSummaryTable,
            //         ...summaryParagraphs, 
            //         :
            //         new Paragraph({
            //             indent: { left: 880 },
            //             children: [
            //                 new Bookmark({
            //                     id: "potentially-relevant-references",
            //                     children: [
            //                         createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
            //                     ]
            //                 })
            //             ],
            //             heading: HeadingLevel.HEADING_1,
            //             spacing: { after: 400, before: 500 },
            //         }),

            //         relevantReferencesTable,

            //         new Paragraph({
            //             indent: { left: 520 },
            //             children: [
            //                 createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, { bold: true, color: "000000" }),
            //             ],
            //             spacing: { after: 200, before: 200 },
            //         }),
            //         new Paragraph({
            //             indent: { left: 520 },
            //             children: [
            //                 createTextRun(overallSummary, textStyle.arial10),
            //             ],
            //             spacing: { after: 200 },
            //         }),
            //     ],
            // },


            // Executive Summary or Relevent Reference Box
            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [
            //         ...(typeId2
            //             ? [
            //                 new Paragraph({
            //                     indent: { left: 630 },
            //                     spacing: { after: 50 },
            //                     heading: HeadingLevel.HEADING_1,
            //                     children: [
            //                         new Bookmark({
            //                             id: "related-references",
            //                             children: [
            //                                 createTextRun("Executive Summary", textStyle.arial14, { bold: true, color: "000000" }),
            //                             ],
            //                         }),
            //                     ],
            //                 }),
            //                 new Paragraph({
            //                     indent: { left: 630 },
            //                     spacing: { after: 50 },
            //                     children: [
            //                         createTextRun("Feature- Mapping Summary of Potential Relevant References", textStyle.arial10, {
            //                             italics: true,
            //                         }),
            //                     ],
            //                 }),
            //                 ExecutiveSummaryTable,
            //                 ...summaryParagraphs,
            //             ]
            //             : typeId1 && [
            //                 new Paragraph({
            //                     indent: { left: 880 },
            //                     children: [
            //                         new Bookmark({
            //                             id: "potentially-relevant-references",
            //                             children: [
            //                                 createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
            //                             ]
            //                         })
            //                     ],
            //                     heading: HeadingLevel.HEADING_1,
            //                     spacing: { after: 400, before: 500 },
            //                 }),
            //                 relevantReferencesTable,
            //                 new Paragraph({
            //                     indent: { left: 520 },
            //                     children: [
            //                         createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, { bold: true, color: "000000" }),
            //                     ],
            //                     spacing: { after: 200, before: 200 },
            //                 }),
            //                 new Paragraph({
            //                     indent: { left: 520 },
            //                     children: [
            //                         createTextRun(overallSummary, textStyle.arial10),
            //                     ],
            //                     spacing: { after: 200 },
            //                 }),
            //             ]
            //         ),
            //     ],
            // },


            // new Paragraph({
            //     indent: { left: 630 },
            //     spacing: { after: 50 },
            //     heading: HeadingLevel.HEADING_1,
            //     children: [
            //         new Bookmark({
            //             id: "related-references",
            //             children: [
            //                 createTextRun("Executive Summary", textStyle.arial14, { bold: true, color: "000000" }),
            //             ],
            //         }),
            //     ],
            // }),
            // new Paragraph({
            //     indent: { left: 630 },
            //     spacing: { after: 50 },
            //     children: [
            //         createTextRun("Feature- Mapping Summary of Potential Relevant References", textStyle.arial10, {
            //             italics: true,
            //         }),
            //     ],
            // }),
            // ExecutiveSummaryTable,
            // ...summaryParagraphs,






            // Potentially Relevant references
            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [

            //         new Paragraph({
            //             indent: { left: 880 },
            //             children: [
            //                 new Bookmark({
            //                     id: "potentially-relevant-references",
            //                     children: [
            //                         createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
            //                     ]
            //                 })
            //             ],
            //             heading: HeadingLevel.HEADING_1,
            //             spacing: { after: 400, before: 500 },
            //         }),

            //         relevantReferencesTable,

            //         new Paragraph({
            //             indent: { left: 520 },
            //             children: [
            //                 createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, { bold: true, color: "000000" }),
            //             ],
            //             spacing: { after: 200, before: 200 },
            //         }),
            //         new Paragraph({
            //             indent: { left: 520 },
            //             children: [
            //                 createTextRun(overallSummary, textStyle.arial10),
            //             ],
            //             spacing: { after: 200 },
            //         }),
            //     ],
            // },



            // Relevant
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 880 },
                        children: [
                            new Bookmark({
                                id: "potentially-relevant-references-2",
                                children: [
                                    createTextRun(`${typeId2 ? "3" : "4"}. Potentially Relevant References`, textStyle.arial14, { bold: true, color: "000000" }),
                                ]
                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 50 },
                    }),

                    ...(Array.isArray(nonPatentLiteratures) && typeId2
                        ? nonPatentLiteratures.flatMap((nplItem, index) => [
                            new Paragraph({
                                alignment: AlignmentType.START,
                                indent: { left: 1250 },
                                children: [
                                    createTextRun(`${index + 1}.       ${sanitizeText(nplItem.nplTitle)}`, textStyle.arial11, {
                                        bold: true,
                                        color: "000000",
                                    }),
                                ],
                                heading: HeadingLevel.HEADING_2,
                                spacing: { after: 20 },
                            }),

                            new Table({
                                width: { size: 100, type: WidthType.PERCENTAGE },
                                rows: [
                                    // Header row (top row)
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                columnSpan: 2,
                                                shading: {
                                                    fill: "A7C7E7",
                                                    type: ShadingType.CLEAR,
                                                    color: "auto",
                                                },
                                                verticalAlign: VerticalAlign.CENTER,
                                                children: [
                                                    new Paragraph({
                                                        alignment: AlignmentType.CENTER,
                                                        spacing: { before: 0, after: 0 },
                                                        children: [
                                                            createTextRun("Bibliographic Details", textStyle.arial10, {
                                                                bold: true,
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                                borders: {
                                                    top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                                                    left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                    right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                },
                                                margins: marginsStyle.margins,
                                            }),
                                        ],
                                    }),

                                    // Title row
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            createTextRun("Title: ", textStyle.arial10, { bold: true }),
                                                            new ExternalHyperlink({
                                                                link: nplItem.url,
                                                                children: [
                                                                    createTextRun(nplItem.nplTitle, textStyle.arial10, { color: "0000FF" }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                                borders: {
                                                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                                                    bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                                                    left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                    right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                },
                                                margins: marginsStyle.margins,
                                            }),
                                        ],
                                    }),

                                    // Source row (bottom)
                                    new TableRow({
                                        children: [
                                            new TableCell({
                                                children: [
                                                    new Paragraph({
                                                        children: [
                                                            createTextRun("Source: ", textStyle.arial10, { bold: true }),
                                                            new ExternalHyperlink({
                                                                link: nplItem.url,
                                                                children: [
                                                                    createTextRun(nplItem.url, textStyle.arial10),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                ],
                                                borders: {
                                                    top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                    left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                    right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
                                                },
                                                margins: marginsStyle.margins,
                                            }),
                                        ],
                                    }),
                                ],
                            }),

                            ...(nplItem.comments
                                ? [
                                    new Paragraph({
                                        spacing: { before: 300, after: 300 },
                                        children: [
                                            createTextRun("Analyst Comments – ", textStyle.arial10, { bold: true }),
                                            createTextRun(sanitizeText(nplItem.comments), textStyle.arial10),
                                        ],
                                    }),
                                ]
                                : []),
                            ...[
                                new Table({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    columnSpan: 2,
                                                    shading: {
                                                        fill: "A7C7E7",
                                                        type: ShadingType.CLEAR,
                                                        color: "auto",
                                                    },
                                                    verticalAlign: VerticalAlign.CENTER,
                                                    children: [
                                                        new Paragraph({
                                                            alignment: AlignmentType.CENTER,
                                                            spacing: { before: 0, after: 0 },
                                                            children: [
                                                                createTextRun("Relevant Excerpts", textStyle.arial10, { bold: true }),
                                                            ],
                                                        }),
                                                    ],
                                                    borders: commonBorders,
                                                    margins: marginsStyle.margins,
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                            ...[
                                new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    spacing: { after: 400 },
                                    children: [
                                        createTextRun("Relevant Excerpts add here....!", textStyle.arial13, {
                                            bold: true,
                                            color: "FF0000",
                                        }),
                                    ],
                                }),
                            ],

                            ...[
                                new Paragraph({
                                    children: [],
                                    spacing: { after: 400 },
                                }),
                            ]

                        ])
                        : []),

                    ...(Array.isArray(relevantReferences) && (typeId1 || typeId2)
                        ? relevantReferences.flatMap((pub, pubIndex) => {
                            const leftTableRows = [
                                {
                                    label: "Publication No",
                                    value: [
                                        new ExternalHyperlink({
                                            children: [
                                                new TextRun({
                                                    text: pub.patentNumber?.toUpperCase() || "N/A",
                                                    style: "Hyperlink",
                                                    color: "0000FF",
                                                    underline: {
                                                        type: UnderlineType.SINGLE,
                                                    },
                                                }),
                                            ],
                                            link: pub.nplUrl || "",
                                        }),
                                    ],
                                    isParagraphChildren: true,
                                },
                                {
                                    label: "Title",
                                    value: sanitizeText(pub.title),
                                },
                                {
                                    label: "Inventor",
                                    value: sanitizeText((pub.inventors || []).join(", ")),
                                },
                                {
                                    label: "Assignee",
                                    value: (pub.assignee || []).join(", "),
                                },
                            ];



                            const rightTableRows = [
                                { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
                                { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
                                { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
                                {
                                    label: "IPC/CPC Classifications",
                                    value: getFamilyMembersParagraphChildren(
                                        {
                                            FamilyMembers: pub.classifications,
                                            hyperLink: pub.publicationUrl,
                                        },
                                        textStyle
                                    ),
                                    isParagraphChildren: true,
                                },
                                {
                                    label: "Family Member",
                                    value: getFamilyMembersParagraphChildren(
                                        {
                                            FamilyMembers: pub.familyMembers,
                                            hyperLink: pub.publicationUrl,
                                        },
                                        textStyle
                                    ),
                                    isParagraphChildren: true,
                                },
                            ];

                            return [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    indent: { left: 1250 },
                                    children: [
                                        new Bookmark({
                                            id: `patent-${pub.patentNumber}`,
                                            children: [
                                                createTextRun(
                                                    `${nonPatentLiteratures.length + pubIndex + 1}.       ${pub.patentNumber}`,
                                                    textStyle.arial11,
                                                    { bold: true, color: "000000" }
                                                ),
                                            ],
                                        }),
                                    ],
                                    heading: HeadingLevel.HEADING_2,
                                    spacing: { after: 20 },
                                }),
                                new Table({
                                    width: { size: 100, type: WidthType.PERCENTAGE },
                                    rows: [
                                        new TableRow({
                                            children: [
                                                new TableCell({
                                                    columnSpan: 2,
                                                    shading: {
                                                        fill: "A7C7E7",
                                                        type: ShadingType.CLEAR,
                                                        color: "auto",
                                                    },
                                                    verticalAlign: VerticalAlign.CENTER,
                                                    children: [
                                                        new Paragraph({
                                                            alignment: AlignmentType.CENTER,
                                                            spacing: { before: 0, after: 0 },
                                                            children: [
                                                                createTextRun("Bibliographic Details", textStyle.arial10, {
                                                                    bold: true,
                                                                }),
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
                                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                                    borders: commonBorders,
                                                    margins: marginsStyle.margins,
                                                    children: [
                                                        new Table({
                                                            width: { size: 100, type: WidthType.PERCENTAGE },
                                                            rows: createSingleColumnTableRows(leftTableRows),
                                                        }),
                                                    ],
                                                }),
                                                new TableCell({
                                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                                    borders: commonBorders,
                                                    margins: marginsStyle.margins,
                                                    children: [
                                                        new Table({
                                                            width: { size: 100, type: WidthType.PERCENTAGE },
                                                            rows: createSingleColumnTableRows(rightTableRows),
                                                        }),
                                                    ],
                                                }),
                                            ],
                                        }),
                                    ],
                                }),
                                ...(pub.analystComments
                                    ? [
                                        new Paragraph({
                                            spacing: { before: 300, after: 300 },
                                            children: [
                                                createTextRun("Analyst Comments – ", textStyle.arial10, {
                                                    bold: true,
                                                }),
                                                createTextRun(sanitizeText(pub.analystComments), textStyle.arial10),
                                            ],
                                        }),
                                    ]
                                    : []),


                                ...[
                                    new Table({
                                        width: { size: 100, type: WidthType.PERCENTAGE },
                                        rows: [
                                            new TableRow({
                                                children: [
                                                    new TableCell({
                                                        columnSpan: 2,
                                                        shading: {
                                                            fill: "A7C7E7",
                                                            type: ShadingType.CLEAR,
                                                            color: "auto",
                                                        },
                                                        verticalAlign: VerticalAlign.CENTER,
                                                        children: [
                                                            new Paragraph({
                                                                alignment: AlignmentType.CENTER,
                                                                spacing: { before: 0, after: 0 },
                                                                children: [
                                                                    createTextRun("Relevant Excerpts", textStyle.arial10, { bold: true }),
                                                                ],
                                                            }),
                                                        ],
                                                        borders: commonBorders,
                                                        margins: marginsStyle.margins,
                                                    }),
                                                ],
                                            }),
                                        ],
                                    }),

                                    new Paragraph({
                                        spacing: { before: 200, after: 400 },
                                        children: [
                                            pub.relevantExcerpts
                                                ? createTextRun(sanitizeText(pub.relevantExcerpts), textStyle.arial10)
                                                : createTextRun(
                                                    '*Abstract is not available, please fill it yourself',
                                                    { ...textStyle.arial10, color: 'FF0000' }
                                                ),
                                        ],
                                        alignment: AlignmentType.LEFT,
                                    }),
                                ],


                            ];
                        })
                        : []),
                ],
            },
            // Related
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 630 },
                        children: [
                            new Bookmark({
                                id: "related-references",
                                children: [
                                    createTextRun(`${typeId2 ? "4" : "5"}.  Related References`, textStyle.arial14, { bold: true, color: "000000" }),
                                ]
                            })
                        ],
                        spacing: { after: 50 },
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        indent: { left: 630 },
                        children: [
                            createTextRun(
                                " (Note: Below references obtained from the quick search are listed as related, as these references fail to disclose at least one or more critical features)",
                                textStyle.arial10,
                                { italics: true }
                            ),
                        ],
                        spacing: { after: 50 },
                    }),
                    relatedReferencesTable
                ],
            },
            // typeId2 Search Methodology
            typeId2 && {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: getSearchMethodology(typeId2),
            },
            (typeId1 || typeId2) && {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: appendix1Childern,
            },

            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [
            //         ...(typeId2 ? getSearchMethodology(typeId2) : []),

            //         ...((typeId1 || typeId2) ? appendix1Childern : []),
            //     ],
            // },

            // Base Search Terms
            // {
            //     properties: createPageProperties(),
            //     headers: { default: header },
            //     footers: { default: footer },
            //     children: [...appendix1Childern]
            // },

            // Appendix 2
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            new Bookmark({
                                id: "Appendix-2",
                                children: [
                                    createTextRun(
                                        typeId2 ? "Appendix" : typeId1 ? "Appendix 2" : "",
                                        textStyle.arial14,
                                        { bold: true, color: "000000" }
                                    ),
                                ],

                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 30 },
                    }),

                    new Paragraph({
                        children: [
                            createTextRun("Databases", textStyle.arial11, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.START,
                        spacing: { after: 0 },
                        indent: { left: 880 },
                    }),

                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        borders: {
                            top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                            insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        },
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        verticalAlign: AlignmentType.CENTER,
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    createTextRun("Patents", textStyle.arial10, { bold: true }),
                                                ],
                                                spacing: { after: 20 },
                                                indent: { left: 880 },
                                            }),
                                          
                                        ...appendix2.patents && createTickedParagraphs(appendix2.patents),

                                        ],
                                    }),
                                    new TableCell({
                                        verticalAlign: AlignmentType.CENTER,
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                        children: [
                                            new Paragraph({
                                                indent: { left: 880 },
                                                children: [
                                                    createTextRun("Non-patent Literature", textStyle.arial10, { bold: true }),
                                                ],
                                                spacing: { after: 0 },
                                            }),
                                            
                                            ...appendix2.nonPatentLiterature && createTickedParagraphs(appendix2.nonPatentLiterature),

                                        ],
                                    }),
                                ],
                            }),
                        ],
                    })
                ],
            },
            // Disclaimer
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            createTextRun("Disclaimer", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                    }),

                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            createTextRun(disclaimer, textStyle.arial10,),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 50 },
                    }),
                ],
            },
        ].filter(Boolean),
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${projectTitle || "StaticData"}.docx`);
};