import {
    Document, BorderStyle, Packer, Paragraph, TextRun, Table, TableRow, AlignmentType, TableCell, VerticalAlign, WidthType, ShadingType,
    ExternalHyperlink, HeadingLevel, ImageRun, SimpleField, InternalHyperlink,
    Bookmark, Footer, PageNumber, Header,
} from "docx";
import { saveAs } from "file-saver";
import { getSearchMethodology } from "./searchMethodology";
import { fileToBase64, formatBytes } from "./base64Convertion";


const textStyle = {
    arial24: { font: "Arial", size: 48 },
    arial14: { font: "Arial", size: 28 },
    arial11: { font: "Arial", size: 22 },
    arial10: { font: "Arial", size: 20 },
};

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
const margins150 = { margins: { top: 100, bottom: 100, left: 100, right: 100, }, }

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

async function getImageArrayBufferFromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob.arrayBuffer();
}



const disclaimer = "This search report is based on the resources available in public domain such as published patents/applications, non-patent literature, products, blogs, technology news, company websites and available/accessible/downloadable. Furthermore, the report is based upon individual expert’s view/judgment & such analysis may vary from expert to expert. Kindly refrain concurring them as Molecular Connections’ views. The contents of this research is for general information purposes only. While Molecular Connections endeavor is to keep the information up to date and correct, Molecular Connections makes no representations OR warranties of any kind, express OR implied, about the completeness OR availability with respect to the contents of this research paper. Any reliance placed on such information is therefore strictly at user’s own risk."

export const handleWordReportDownload = async ({
    projectTitle,
    projectSubTitle,
    searchFeatures,
    relevantReferences,
    relatedReferences,
    appendix1,
    appendix2,
    projectImageUrl,
    overallSummary,
}) => {


    const createPageProperties = (margin = 720, orientation = "portrait") => ({
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
        rows.map(({ label, value }) =>
            new TableRow({
                children: [
                    new TableCell({
                        children: [new Paragraph({ text: `${label}:`, bold: true })],
                        borders: borderNone,
                    }),
                    new TableCell({
                        children: [new Paragraph(value)],
                        borders: borderNone,
                    }),
                ],
            })
        );

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


    const cloudinaryUrls = projectImageUrl.map(buf => buf.base64Url);

    const imageBuffers = await Promise.all(
        cloudinaryUrls.map(async (url) => await getImageArrayBufferFromUrl(url))
    );

    const tableOfContentsTitle = new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 300, before: 300 },
        children: [
            createTextRun("Table of Contents", textStyle.arial14, {
                bold: true, underline: { type: "single", color: "000000", },
            })
        ],
    });


    const tocField = new Paragraph({
        children: [
            new SimpleField({
                instruction: "TOC \\o \"1-3\" \\h \\z \\u",
                dirty: true,
            }),
        ],
        spacing: { after: 400 },
    });


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
                        shading: {
                            fill: "BDD7EE",
                            type: ShadingType.CLEAR,
                            color: "auto",
                        },
                        verticalAlign: VerticalAlign.CENTER,
                        margins: margins150.margins,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
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
                            verticalAlign: VerticalAlign.CENTER,
                            margins: margins150.margins,
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        createTextRun(String(index + 1), textStyle.arial10),
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
                                    children: [
                                        createTextRun(
                                            sanitizeText(
                                                (pub.relatedFamilyMembers || []).join(", ") || "N/A"
                                            ),
                                            textStyle.arial10
                                        ),
                                    ],
                                }),
                            ],
                            borders: commonBorders,
                        }),
                    ],
                })
            ),
        ],
    });


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
                tableHeader: true,
                children: [
                    new TableCell({
                        shading: { fill: "BDD7EE" },
                        columnSpan: 2,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 100 },
                                children: [
                                    createTextRun("Relevant Prior Arts", { bold: true }),
                                ],
                            }),
                        ],
                    }),
                ],
            }),
            new TableRow({
                tableHeader: true,
                children: [
                    new TableCell({
                        columnSpan: 2,
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { before: 100 },
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
                            children: [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    spacing: { before: 50 },
                                    indent: { left: 100 },
                                    children: [
                                        new ExternalHyperlink({
                                            link: ref.publicationUrl,
                                            children: [
                                                createTextRun(ref.patentNumber, { color: "0000FF", underline: true, }),
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
                        children: [
                            createTextRun(projectTitle, textStyle.arial24, { bold: true }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 300 },
                    }),
                    new Paragraph({
                        children: [
                            createTextRun(projectSubTitle, textStyle.arial14, { bold: true }),
                        ],
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 400, after: 800 },
                    }),
                ],
            },
            // Table Content
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    tableOfContentsTitle,
                    tocField,
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
                            createTextRun("1. Search Features", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 200, after: 400 },
                        indent: { left: 720 },
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
                            })
                        ),

                    // ...imageBuffers.map((buffer) =>
                    //     new Paragraph({
                    //         children: [
                    //             new ImageRun({
                    //                 data: buffer,
                    //                 transformation: {
                    //                     width: 200,
                    //                     height: 150,
                    //                 },
                    //             }),
                    //         ],
                    //         alignment: AlignmentType.CENTER,
                    //         spacing: { after: 300 },
                    //     })
                    // ),
                ],
            },
            // Search Methodology
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: getSearchMethodology(projectTitle),
            },
            // Potentially Relevant references
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            createTextRun("3. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 400 },
                    }),

                    relevantReferencesTable,

                    new Paragraph({
                        children: [
                            createTextRun("Overall Summary of Search and Prior Arts:", textStyle.arial10, { bold: true, color: "000000" }),
                        ],
                        spacing: { after: 200, before: 200 },
                    }),
                    new Paragraph({
                        children: [
                            createTextRun(overallSummary, textStyle.arial10),
                        ],
                        spacing: { after: 200 },
                    }),
                ],
            },
            // Relevant
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            createTextRun("4. Potentially Relevant References", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 400 },
                    }),

                    ...(Array.isArray(relevantReferences)
                        ? relevantReferences.flatMap((pub, pubIndex) => {
                            const leftTableRows = [
                                { label: "Publication No", value: pub.patentNumber.toUpperCase() },
                                { label: "Title", value: sanitizeText(pub.title) },
                                { label: "Inventor", value: sanitizeText((pub.inventors || []).join(", ")) },
                                { label: "Assignee", value: (pub.assignee || []).join(", ") },
                            ];

                            const rightTableRows = [
                                { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
                                { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
                                { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
                                { label: "IPC/CPC Classifications", value: sanitizeText((pub.classifications || []).join(", ")) },
                                { label: "Family Member", value: sanitizeText((pub.familyMembers || []).join(", ")) },
                            ];

                            const ptnNumber = new Paragraph({
                                alignment: AlignmentType.START,
                                children: [
                                    new Bookmark({
                                        id: `patent-${pub.patentNumber}`,
                                        children: [
                                            createTextRun(` ${pubIndex + 1}. ${pub.patentNumber}`, textStyle.arial11, { bold: true, color: "000000" })
                                        ],
                                    }),
                                ],

                                heading: HeadingLevel.HEADING_2,
                                spacing: { after: 200 },
                            });

                            const table = new Table({
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
                                                verticalAlign: VerticalAlign.CENTER,
                                                children: [
                                                    new Paragraph({
                                                        alignment: AlignmentType.CENTER,
                                                        children: [
                                                            createTextRun("Bibliographic Details", textStyle.arial10, { bold: true }),
                                                        ],
                                                    }),
                                                ],
                                                borders: commonBorders,
                                                margins: marginsStyle.margins,
                                            }),

                                        ],
                                    }),
                                    new TableRow({
                                        margins: marginsStyle.margins,
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
                            });

                            const analystComment = pub.analystComments
                                ? new Paragraph({
                                    spacing: { before: 300, after: 300 },
                                    children: [
                                        createTextRun("Analyst Comments – ", textStyle.arial10, { bold: true }),
                                        createTextRun(sanitizeText(pub.analystComments), textStyle.arial10, { italics: true }),
                                    ],
                                })
                                : null;

                            const relevantExcerpts = [
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
                                                    verticalAlign: VerticalAlign.CENTER,
                                                    children: [
                                                        new Paragraph({
                                                            alignment: AlignmentType.CENTER,
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
                                        createTextRun(sanitizeText("[Abstract]"), textStyle.arial10, { bold: true }),
                                    ],
                                    alignment: AlignmentType.LEFT,
                                }),
                                new Paragraph({
                                    spacing: { before: 200, after: 400 },
                                    children: [
                                        (pub.abstract || pub.relevantExcerpts) ?
                                            createTextRun(sanitizeText(pub.abstract || pub.relevantExcerpts), textStyle.arial10)
                                            :
                                            createTextRun(
                                                '*Abstract is not available, please fill it yourself',
                                                { ...textStyle.arial10, color: 'FF0000' }
                                            ),
                                    ],
                                    alignment: AlignmentType.LEFT,
                                }),
                            ].filter(Boolean);
                            return [ptnNumber, table, ...(analystComment ? [analystComment] : []), ...relevantExcerpts];
                        })
                        : []
                    ),
                ],
            },
            // Related
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            createTextRun("5. Related References", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        spacing: { after: 400 },
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        children: [
                            createTextRun(
                                " (Note: Below references obtained from the quick search are listed as related, as these references fail to disclose at least one or more critical features)",
                                textStyle.arial10,
                                { italics: true }
                            ),
                        ],
                        spacing: { after: 400 },
                    }),
                    relatedReferencesTable
                ],
            },
            // Appendix 1
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            new Bookmark({
                                id: "Appendix-1",
                                children: [
                                    createTextRun("Appendix 1", textStyle.arial14, { bold: true, color: "000000" }),
                                ],
                            })
                        ],

                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 50 },
                    }),

                    new Paragraph({
                        children: [
                            createTextRun("Search Terms & Search Strings", textStyle.arial10, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.START,
                        spacing: { after: 30 },
                        indent: { left: 520 },
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
                    }),

                    new Paragraph({
                        children: [
                            createTextRun("▶ Search Terms", textStyle.arial11, { bold: true }),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                        indent: { left: 720 },
                    }),

                    new Paragraph({
                        children: [
                            createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                        indent: { left: 720 },
                    }),

                    new Table({
                        width: {
                            size: 100,
                            type: WidthType.PERCENTAGE,
                        },
                        rows: [
                            new TableRow({
                                tableHeader: true,
                                children: [
                                    new TableCell({
                                        verticalAlign: VerticalAlign.CENTER,
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    createTextRun("S. No.", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                                ],
                                            }),
                                        ],
                                        shading: {
                                            fill: "000000",
                                        },
                                    }),
                                    new TableCell({
                                        verticalAlign: VerticalAlign.CENTER,
                                        children: [
                                            new Paragraph({
                                                alignment: AlignmentType.CENTER,
                                                children: [
                                                    createTextRun("Key strings (Patents/Patent Applications)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
                                                ],
                                            }),
                                        ],
                                        shading: {
                                            fill: "000000",
                                        },
                                    }),
                                ],
                            }),

                            ...appendix1?.keyStrings?.map((keyStr, index) =>
                                new TableRow({
                                    children: [
                                        new TableCell({
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
                                            children: [
                                                new Paragraph({
                                                    alignment: AlignmentType.LEFT,
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
                        children: [
                            createTextRun("Data Availability", textStyle.arial11, { bold: true }),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                        indent: { left: 520 },
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
                    )
                ],
            },
            // Appendix 2
            {
                properties: createPageProperties(),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        children: [
                            new Bookmark({
                                id: "Appendix-2",
                                children: [
                                    createTextRun("Appendix 2", textStyle.arial14, { bold: true, color: "000000" }),
                                ],
                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                    }),

                    new Paragraph({
                        children: [
                            createTextRun("Databases", textStyle.arial11, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.START,
                        spacing: { after: 200 },
                        indent: { left: 520 },
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
                                                spacing: { after: 100 },
                                                indent: { left: 520 }
                                            }),
                                            ...cleanListWithEtc(appendix2.patents)
                                                .map((item) =>
                                                    new Paragraph({
                                                        children: [
                                                            createTextRun(`✓ ${item.trim()}`, textStyle.arial10),
                                                        ],
                                                        indent: { left: 520 }
                                                    })
                                                ),
                                        ],
                                    }),
                                    new TableCell({
                                        borders: {
                                            top: { style: BorderStyle.NONE },
                                            bottom: { style: BorderStyle.NONE },
                                            left: { style: BorderStyle.NONE },
                                            right: { style: BorderStyle.NONE },
                                        },
                                        children: [
                                            new Paragraph({
                                                children: [
                                                    createTextRun("Non-patent Literature", textStyle.arial10, { bold: true }),
                                                ],
                                                spacing: { after: 100 },
                                            }),
                                            ...appendix2.nonPatentLiterature
                                                .split("\n")
                                                .map((item) =>
                                                    new Paragraph({
                                                        children: [
                                                            createTextRun(`✓ ${item.trim()}`, textStyle.arial10),
                                                        ],
                                                    })
                                                ),
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
                        children: [
                            createTextRun("Disclaimer", textStyle.arial14, { bold: true, color: "000000" }),
                        ],
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                    }),

                    new Paragraph({
                        children: [
                            createTextRun(disclaimer, textStyle.arial10,),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 200 },
                    }),
                ],
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${projectTitle || "StaticData"}.docx`);
};