import {
    Document, Packer, InternalHyperlink, Paragraph, TextRun, AlignmentType, ExternalHyperlink, HeadingLevel, Bookmark, UnderlineType,
    TableCell, VerticalAlign, TableRow, Table, WidthType, TableOfContents,
} from "docx";
import { saveAs } from "file-saver";
import { getSearchMethodology } from "./searchMethodology";
import {
    blackBorders,
    buildAppendix1,
    commonBorders,
    createExecutiveSummaryParagraphs,
    createExecutiveSummaryTable,
    createFooter,
    createHeader,
    createPageProperties,
    createParagraph,
    createRelatedReferencesTable,
    createRelevantReferencesTable,
    createSingleColumnTableRows,
    createTextRun,
    createTocTable,
    createTwoColumnTickTable,
    disclaimer,
    generateBibliographicSection,
    getFamilyMembersParagraphChildren,
    getTocConfig,
    getTocConfigSummary,
    indent380,
    sanitizeText,
    textStyle,
} from "./docxUtils";

export const handleWordReportDownload = async ({
    introduction,
    relevantReferences,
    relatedReferences,
    appendix1,
    appendix2,
    overallSummary,
    getProjectValue,
    relevantAndNplCombined
}) => {

    const typeId1 = getProjectValue.projectTypeId === "0001";
    const typeId2 = getProjectValue.projectTypeId === "0002";

    const header = createHeader(introduction.projectId);
    const footer = createFooter();

    const tocConfig = getTocConfig(relevantReferences);
    const tocConfigSummary = getTocConfigSummary(relevantAndNplCombined);

    const relatedReferencesTable = createRelatedReferencesTable(relatedReferences);

    const ExecutiveSummaryTable = createExecutiveSummaryTable({
        data: relevantAndNplCombined,
        dynamicHeadings: ["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5"],
    });

    const summaryParagraphs = createExecutiveSummaryParagraphs();

    const tocTitle = createParagraph(
        new Bookmark({
            id: "back-to-table-of-content",
            children: [
                createTextRun("Table of Contents", textStyle.arial14, { bold: true, underline: true }),
            ],
        }),
        {
            alignment: AlignmentType.CENTER,
            spacing: { after: 200, before: 100 },
        }
    );
    const tocItems = (typeId2 && tocConfigSummary) || (typeId1 && tocConfig);
    const tocTable = createTocTable(tocItems);
    const relevantReferencesTable = createRelevantReferencesTable(relevantReferences, typeId1 ? "typeId1" : "typeId2");


    const autoToc = new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
    });



    const appendix1Childern = [];

    if (typeId2) {
        appendix1Childern.push(...buildAppendix1({ typeId1, typeId2, appendix1 }));

    } else if
        (typeId1) {
        appendix1Childern.push(
            new Paragraph({
                children: [
                    new Bookmark({
                        id: "typeID1-appendix1",
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
            // Search Terms & Search Strings
            new Paragraph({
                children: [
                    new Bookmark({
                        id: "typeID1-search-terms",
                        children: [
                            createTextRun("Search Terms & Search Strings", textStyle.arial11, { bold: true, color: "000000" }),
                        ]
                    }),
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
            // Search Terms Table
            new Table({
                width: { size: 92, type: WidthType.PERCENTAGE },
                alignment: AlignmentType.CENTER,
                borders: blackBorders,
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

                    ...(appendix1?.baseSearchTerms
                        ? appendix1.baseSearchTerms.map((keyStr) =>
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
                        )
                        : [])

                ],
            }),
            // Search Strings Title
            new Paragraph({
                children: [
                    createTextRun("▶ Search Strings", textStyle.arial11, { bold: true }),
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 20 },
                indent: { left: 720 },
            }),
            // Key strings (Patents/Patent Applications)
            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                borders: commonBorders,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: commonBorders,
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
                                borders: commonBorders,
                                verticalAlign: VerticalAlign.CENTER,
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        spacing: { before: 30, after: 30 },
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

                    ...(appendix1?.keyStrings ?
                        appendix1?.keyStrings?.map((keyStr, index) =>
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: commonBorders,
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
                                        borders: commonBorders,
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
            }),
            // Key strings (Non-Patent Literatures)
            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                borders: commonBorders,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: commonBorders,
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
                                borders: commonBorders,
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
                    ...(appendix1?.keyStringsNpl ?
                        appendix1?.keyStringsNpl?.map((keyStr, index) =>
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: commonBorders,
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
                                        borders: commonBorders,
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
            }),
            // Additional Search
            new Table({
                width: {
                    size: 100,
                    type: WidthType.PERCENTAGE,
                },
                borders: commonBorders,
                rows: [
                    new TableRow({
                        children: [
                            new TableCell({
                                borders: commonBorders,
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
                                borders: commonBorders,
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
                    ...(appendix1?.keyStringsAdditional ?
                        appendix1?.keyStringsAdditional?.map((keyStr, index) =>
                            new TableRow({
                                children: [
                                    new TableCell({
                                        borders: commonBorders,
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
                                        borders: commonBorders,
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
            }),
            // back-to-table-of-content
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
            // Data Availability
            new Paragraph({
                children: [
                    new Bookmark({
                        id: "typeID1-data-availability",
                        children: [
                            createTextRun("Data Availability", textStyle.arial11, { bold: true, color: "000000" }),
                        ]
                    })
                ],
                alignment: AlignmentType.START,
                spacing: { before: 200, after: 100 },
                indent: { left: 720 },
                heading: HeadingLevel.HEADING_2,
            }),
            ...(appendix1.dataAvailability ?
                appendix1.dataAvailability.map((mapData) =>
                    new Paragraph({
                        children: [
                            createTextRun(`✓ ${mapData.dataAvailableText.trim()}`, textStyle.arial10),
                        ],
                        alignment: AlignmentType.START,
                        spacing: { after: 50 },
                        indent: { left: 720 },
                    }),
                ) : []),
        )
    };

    const publications = typeId2 ? relevantAndNplCombined : relevantReferences;
    console.log('publications', publications)

    const appendixTable = createTwoColumnTickTable({
        leftTitle: "Patents" || "",
        rightTitle: "Non-patent Literature" || "",
        leftData: appendix2?.patents || "",
        rightData: appendix2?.nonPatentLiterature || "",
        textStyle: textStyle.arial10,
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
                properties: createPageProperties(920, "portrait"),
                children: [
                    createParagraph(introduction.projectTitle, {
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 50 },
                        textStyleOverride: { bold: true, ...textStyle.arial24 },
                    }),
                    createParagraph(introduction.projectSubTitle, {
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 50, after: 50 },
                        textStyleOverride: { bold: true, ...textStyle.arial24 },
                    }),
                ],
            },
            // Table Content
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    tocTitle,
                    // tocTable,
                    // tocTitle,
                    autoToc,
                    createParagraph([
                        new ExternalHyperlink({
                            link: "https://par.molecularconnections.com/mc-review/form/IDF-34131Top%20Load%20Washer%20with%20Flexible%20Dispenser%20and%20Serviceable%20Dosing%20System",
                            children: [
                                createTextRun("Please rate this search report", textStyle.arial10, {
                                    bold: true,
                                    color: "0000FF",
                                    underline: { type: UnderlineType.SINGLE },
                                }),
                            ],
                        }),
                    ], {
                        spacing: { before: 100 },
                        indent: { left: 380 },
                    }),
                ],
            },
            // Search Features
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    createParagraph(
                        new Bookmark({
                            id: typeId2 ? "typeID2-search-features" : "typeID1-search-features",
                            children: [
                                createTextRun("1.  Search Features", textStyle.arial14, {
                                    bold: true,
                                    color: "000000",
                                }),
                            ],
                        }),
                        {
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 200, after: 300 },
                            indent: { left: 880 },
                            paragraphOptions: {
                                heading: HeadingLevel.HEADING_1,
                            },
                        }
                    ),

                    // ...(introduction.searchFeatures || [])
                    //     .filter((p) => p.trim() !== "")
                    //     .map((para) =>
                    //         createParagraph(sanitizeText(`${para.trim()}.`), {
                    //             alignment: AlignmentType.JUSTIFIED,
                    //             spacing: { before: 200, after: 200 },
                    //             indent: { left: 380, right: 380 },
                    //             textStyleOverride: { ...textStyle.arial10 }
                    //         })
                    //     ),

                    ...(introduction.searchFeatures || [])
                        .filter((p) => p.trim() !== "")
                        .flatMap((para) =>
                            para.split("\n").map(line =>
                                createParagraph(
                                    new TextRun({
                                        text: sanitizeText(line),
                                        preserveLeadingSpaces: true,
                                        preserveTrailingSpaces: true,
                                    }),
                                    {
                                        alignment: AlignmentType.LEFT,
                                        spacing: { before: 20, after: 20 },
                                        indent: { left: 380, right: 380 },
                                        textStyleOverride: { ...textStyle.arial10 },
                                    }
                                )
                            )
                        ),

                ],
            },
            // Search Mathedology
            ...(typeId1
                ? [
                    {
                        properties: createPageProperties(920, "portrait"),
                        headers: { default: header },
                        footers: { default: footer },
                        children: [
                            new Paragraph({ text: "", pageBreakBefore: true }),
                            ...getSearchMethodology(introduction.projectTitle),
                        ],
                    },
                ]
                : []),
            typeId1 && {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 880 },
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 400, before: 500 },
                        children: [
                            new Bookmark({
                                id: "typeID1-relevant-toc",
                                children: [
                                    createTextRun("3. Potentially Relevant References", textStyle.arial14, {
                                        bold: true,
                                        color: "000000",
                                    }),
                                ],
                            }),
                        ],
                    }),
                    relevantReferencesTable,
                    createParagraph("Overall Summary of Search and Prior Arts:", {
                        indent: { left: 520 },
                        spacing: { after: 200, before: 200 },
                        textStyleOverride: {
                            ...textStyle.arial10,
                            bold: true,
                            color: "000000",
                        },
                    }),

                    ...(overallSummary && overallSummary.length
                        ? overallSummary.flatMap(item =>
                            item.split("\n").map(line =>
                                new Paragraph({
                                    indent: { left: 520 },
                                    spacing: { after: 20 },
                                    alignment: AlignmentType.LEFT,
                                    children: [
                                        new TextRun({
                                            text: sanitizeText(line),
                                            preserveLeadingSpaces: true,
                                            preserveTrailingSpaces: true,
                                            ...textStyle.arial10,
                                        }),
                                    ],
                                })
                            )
                        )
                        : [
                            new Paragraph({
                                indent: { left: 520 },
                                spacing: { after: 20 },
                                alignment: AlignmentType.LEFT,
                                children: [
                                    new TextRun({
                                        text: "*No summary available",
                                        color: "FF0000",
                                        ...textStyle.arial10,
                                    }),
                                ],
                            }),
                        ]
                    ),
                ],
            },
            typeId2 && {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    createParagraph(new Bookmark({
                        id: "typeID2-executive-summary",
                        children: [
                            createTextRun("2. Executive Summary", textStyle.arial14, {
                                bold: true,
                                color: "000000",
                            }),
                        ],
                    }), {
                        indent: { left: 630 },
                        spacing: { after: 50 },
                        paragraphOptions: { heading: HeadingLevel.HEADING_1 },
                    }),

                    createParagraph("Feature- Mapping Summary of Potential Relevant References", {
                        indent: indent380,
                        spacing: { after: 50 },
                        textStyleOverride: {
                            ...textStyle.arial10,
                            italics: true,
                        },
                    }),

                    ExecutiveSummaryTable,
                    ...summaryParagraphs,
                ],
            },
            // Relevant
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    // Section heading
                    new Paragraph({
                        indent: { left: 880 },
                        children: [
                            new Bookmark({
                                id: typeId2 ? "typeID2-potentially-relevant-references" : "typeID1-relevant-biblio",
                                children: [
                                    createTextRun(`${typeId2 ? "3" : "4"}. Potentially Relevant References`, textStyle.arial14, { bold: true, color: "000000" }),
                                ]
                            })
                        ],
                        heading: HeadingLevel.HEADING_1,
                        spacing: { after: 50 },
                    }),
                    // Dynamic publications list
                    ...(Array.isArray(publications)
                        ? publications.flatMap((pub, pubIndex) => {
                            const isNpl = pub.nplId === true;

                            const usClass = {
                                label: "US Classifications",
                                value: getFamilyMembersParagraphChildren(
                                    {
                                        FamilyMembers: pub.usClassification,
                                        hyperLink: pub.publicationUrl,
                                    },
                                    textStyle
                                ),
                                isParagraphChildren: true,
                            };
                            const leftTableRows = [
                                {
                                    label: "Publication No",
                                    value: [
                                        new ExternalHyperlink({
                                            link: pub.publicationUrl || "",
                                            children: [
                                                new TextRun({
                                                    text: pub.patentNumber?.toUpperCase() || "N/A",
                                                    style: "Hyperlink",
                                                    color: "0000FF",
                                                    underline: { type: UnderlineType.SINGLE },
                                                }),
                                            ],
                                        }),

                                        ...(typeId1
                                            ? [
                                                new TextRun({ text: "  " }),
                                                new TextRun({ text: "[Google Patents Link: ", bold: true }),
                                                new ExternalHyperlink({
                                                    link: pub.googlePublicationUrl || "",
                                                    children: [
                                                        new TextRun({
                                                            text: pub.patentNumber?.toUpperCase() || "N/A",
                                                            style: "Hyperlink",
                                                            color: "0000FF",
                                                            underline: { type: UnderlineType.SINGLE },
                                                        }),
                                                    ],
                                                }),
                                                new TextRun({ text: "]", bold: true }),
                                            ]
                                            : []),


                                    ],
                                    isParagraphChildren: true,
                                },
                                { label: "Title", value: sanitizeText(pub.title) },
                                { label: "Inventor", value: sanitizeText((pub.inventors || []).join(", ")) },
                                { label: "Assignee", value: (pub.assignee || []).join(", ") },
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
                                // usClass,
                            ];
                            const rightTableRows = [
                                { label: "Grant/Publication Date", value: sanitizeText(pub.grantDate) },
                                { label: "Filing/Application Date", value: sanitizeText(pub.filingDate) },
                                { label: "Priority Date", value: sanitizeText(pub.priorityDate) },
                                {
                                    label: "Classification(IPC)",
                                    value: getFamilyMembersParagraphChildren(
                                        {
                                            FamilyMembers: pub.ipcClassifications,
                                            hyperLink: pub.publicationUrl,
                                        },
                                        textStyle
                                    ),
                                    isParagraphChildren: true,
                                },
                                {
                                    label: "Classification(CPC)",
                                    value: getFamilyMembersParagraphChildren(
                                        {
                                            FamilyMembers: pub.cpcClassifications,
                                            hyperLink: pub.publicationUrl,
                                        },
                                        textStyle
                                    ),
                                    isParagraphChildren: true,
                                },
                                usClass,
                            ];

                            return [
                                new Paragraph({
                                    alignment: AlignmentType.START,
                                    indent: { left: 1250 },
                                    children: [
                                        new Bookmark({
                                            id: typeId2 ? `typeID2-${pubIndex + 1}` : `typeID1-${pubIndex + 1}`,
                                            children: [
                                                createTextRun(
                                                    `${pubIndex + 1}.       ${pub.patentNumber}`,
                                                    textStyle.arial11,
                                                    { bold: true, color: "000000" }
                                                ),
                                            ],
                                        }),
                                    ],
                                    heading: HeadingLevel.HEADING_2,
                                    spacing: { after: 20 },
                                }),


                                ...generateBibliographicSection({
                                    pub,
                                    isNpl,
                                    typeId2,
                                    leftTableRows,
                                    rightTableRows,
                                    createSingleColumnTableRows,
                                }),

                                // new Paragraph({ children: [], spacing: { after: 200 } }),
                            ];
                        })
                        : []),
                ],
            },
            // Related
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 630 },
                        children: [
                            new Bookmark({
                                id: typeId2 ? "typeID2-related-references" : "typeID1-related-references",
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
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: getSearchMethodology(typeId2),
            },
            (typeId1 || typeId2) && {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: appendix1Childern,
            },
            // Appendix 2
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 520 },
                        children: [
                            new Bookmark({
                                id: typeId1 ? "typeID1-appendix2" : "typeID2-appendix",
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
                            new Bookmark({
                                id: typeId2 ? "typeID2-databases" : "typeID1-databases",
                                children: [
                                    createTextRun("Databases", textStyle.arial11, { bold: true, color: "000000" }),
                                ]
                            })
                        ],
                        heading: HeadingLevel.HEADING_2,
                        alignment: AlignmentType.START,
                        spacing: { after: 0 },
                        indent: { left: 880 },
                    }),
                    appendixTable,
                ],
            },
            // Disclaimer
            {
                properties: createPageProperties(920, "portrait"),
                headers: { default: header },
                footers: { default: footer },
                children: [
                    new Paragraph({
                        indent: { left: 520 },
                        heading: HeadingLevel.HEADING_1,
                        alignment: AlignmentType.START,
                        spacing: { after: 100 },
                        children: [
                            new Bookmark({
                                id: typeId1 ? "typeID1-disclaimer" : "typeID2-disclaimer",
                                children: [
                                    createTextRun("Disclaimer", textStyle.arial14, {
                                        bold: true,
                                        color: "000000",
                                    }),
                                ],
                            }),
                        ],
                    }),

                    // Disclaimer content paragraph
                    ...(Array.isArray(disclaimer)
                        ? disclaimer.map((line) =>
                            new Paragraph({
                                indent: { left: 520 },
                                alignment: AlignmentType.START,
                                spacing: { after: 50 },
                                children: [
                                    createTextRun(line, textStyle.arial10),
                                ],
                            })
                        )
                        : [
                            new Paragraph({
                                indent: { left: 520 },
                                alignment: AlignmentType.START,
                                spacing: { after: 50 },
                                children: [
                                    createTextRun(disclaimer || "N/A", textStyle.arial10),
                                ],
                            }),
                        ]
                    ),
                ],
            },
            
        ].filter(Boolean),
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${introduction.projectTitle || "StaticData"}.docx`);
};