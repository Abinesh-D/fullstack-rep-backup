import { Paragraph, HeadingLevel, TextRun, UnderlineType, InternalHyperlink, Bookmark } from "docx";

const makeIndentedParagraphs = (texts, left = 880) =>
    texts.map((text) => {
        const customIndent = text.includes("To ensure search comprehensiveness") ? 520 : left;
        const parts = text.split(/(Appendix 1|Appendix 2)/);

        return new Paragraph({
            spacing: { before: 20, after: 50 },
            indent: { left: customIndent }, 
            children: parts.map((part) => {
                if (part === "Appendix 1") {
                    return new InternalHyperlink({
                        anchor: "appendix-1",
                        children: [
                            new TextRun({
                                text: part,
                                bold: true,
                                underline: { type: UnderlineType.SINGLE },
                                color: "0000FF",
                            }),
                        ],
                    });
                } else if (part === "Appendix 2") {
                    return new InternalHyperlink({
                        anchor: "appendix-2",
                        children: [
                            new TextRun({
                                text: part,
                                bold: true,
                                underline: { type: UnderlineType.SINGLE },
                                color: "0000FF",
                            }),
                        ],
                    });
                } else {
                    return new TextRun({
                        text: part,
                        color: "000000",
                    });
                }
            }),
        });
    }); 


export const getSearchMethodology = (projectTitle) => [

    projectTitle === true &&
      new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 50 },
            children: [
                new Bookmark({
                    id: "search-methodology",
                    children: [
                        new TextRun({ text: "Appendix 1", font: "Arial", size: 28, color: "000000", bold: true, }),
                    ]
                }),
            ],
            indent: { left: 880 }
        }),

    projectTitle === true ?
        new Paragraph({
            spacing: { after: 50 },
            children: [
                        new TextRun({ text: "Search Methodology", font: "Arial", size: 24, color: "000000", bold: true, }),
            ],
            indent: { left: 520 }
        })
        :
        new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 50 },
            children: [
                new Bookmark({
                    id: "search-methodology",
                    children: [new TextRun({ text: "2. Search Methodology", font: "Arial", size: 28, color: "000000", bold: true, }),
                    ]
                })
            ],
            indent: { left: 880 }
        }),



    new Paragraph({
        indent: { left: 520 },
        spacing: { after: 0, before: 100 },
        children: [
            new TextRun({
                text: "Step 1: Understanding and Making Search Strategy",
                bold: true,
                size: 22,
            })
        ]
    }),

    projectTitle === true ?
        new Paragraph({
            children: [
                new TextRun("●    In-depth understanding of domain was analyzed in terms of project requirements"),
                // new TextRun({
                //     text: projectTitle === true ? "" : projectTitle,
                //     bold: true,
                // }),
                // new TextRun("” analyzed in terms of project requirements."),
            ],
            indent: { left: 880 },
            spacing: { before: 20, after: 50 },
        })
        :
        new Paragraph({
            children: [
                new TextRun("●    In-depth understanding “"),
                new TextRun({
                    text: projectTitle,
                    bold: true,
                }),
                new TextRun("” analyzed in terms of project requirements."),
            ],
            indent: { left: 880 },
            spacing: { before: 20, after: 50 },
        }),


    ...makeIndentedParagraphs([
        "●    A thorough study on the technology domain was performed by web research to gather relevant information.",
        "●    Key concepts were identified and defined using key words and their synonyms.",
        "●    Key strings were prepared based on identified search terms, relevant patent classifications.",
    ]),

    new Paragraph({
        indent: { left: 520 },
        spacing: { after: 0, before: 100 },
        children: [
            new TextRun({
                text: "Step 2: Searching and Analysis",
                bold: true,
                size: 22
            }),
        ]
    }),
    ...makeIndentedParagraphs([
        "●    A broad to narrow search strategy (or narrow to broad) was employed using various search strings on few commercial/free databases to identify patent/applications.",
        `●    The key strings were formulated based on the identified keywords.${projectTitle === true ? "" : " For key string, refer to Appendix 1."}`,
        `●    The searches were carried on various paid and free databases.${projectTitle === true ? "" : " For list of databases, refer to Appendix 2."}`,
        "●    The extracted documents were analyzed in detail to identify potentially relevant documents which can be further segregated as relevant and related depending on number of features matching with the technical features of the study.",
        "●    For Patent literature only one member per family was considered for analysis.",
        "●    For Non-English documents, the analysis was carried out based on machine translated text available from free/commercial sources.",
    ]),

    new Paragraph({
        indent: { left: 520 },
        spacing: { after: 0, before: 100 },
        children: [
            new TextRun({
                text: "Step 3: Additional Searches",
                size: 22,
                bold: true
            })
        ]
    }),
    ...makeIndentedParagraphs([
        "To ensure search comprehensiveness, following searches were performed:",
        "●    Inventor/Assignee based search - The assignee/inventor of client’s interest or assignee/inventor from the identified relevant documents.",
        "●    IPC/CPC/ECLA search - Various classes are used with/without the combination of keywords.",
        "●    Semantic - Commercial databases are used to search on contextual meaning of terms.",
        "●    Similarity search - A similarity search of the target patent and identified relevant prior art is conducted in the commercial databases.",
        "●    Citation Search - Two level citation searches of closely identified prior arts are executed.",
    ]),

    new Paragraph({
        indent: { left: 520 },
        spacing: { after: 0, before: 100 },
        children: [
            new TextRun({
                text: "Step 4: Report",
                size: 22,
                bold: true
            })
        ]
    }),
    ...makeIndentedParagraphs([
        "●    The shortlisted relevant documents along with the bibliographic details and text mapping are provided in a user friendly, MS Word/PDF report.",
        "●    Related documents are provided in the form of list in the report.",
        "●    Bibliographic details of both relevant and related documents are provided in the report.",
        "●    All the documents are provided with hyperlink to Individual patent office site or USPTO or Espacenet.",
        "●    A tabulated summary of the relevant references is provided with executive summary.",
    ]),
];




















// import { Paragraph, HeadingLevel, TextRun } from "docx";

// const makeIndentedParagraphs = (texts, left = 720) =>
//     texts.map(
//         (text) =>
//             new Paragraph({
//                 children: [
//                     new TextRun({
//                         text,
//                         font: "Arial",
//                         size: 20,
//                         color: "000000",
//                     }),
//                 ],
//                 spacing: { before: 100, after: 100 },
//                 indent: { left },
//             })
//     );

// export const getSearchMethodology = (projectTitle) => [
//     new Paragraph({
//         children: [
//             new TextRun({
//                 text: "2. Search Methodology",
//                 font: "Arial",
//                 size: 28,
//                 bold: true,
//                 color: "000000",
//             }),
//         ],
//         heading: HeadingLevel.HEADING_1,
//         spacing: { after: 200 },
//     }),

//     new Paragraph({
//         children: [
//             new TextRun({
//                 text: "●    In-depth understanding “",
//                 font: "Arial",
//                 size: 20,
//                 color: "000000",
//             }),
//             new TextRun({
//                 text: projectTitle,
//                 bold: true,
//                 font: "Arial",
//                 size: 20,
//                 color: "000000",
//             }),
//             new TextRun({
//                 text: "” analyzed in terms of project requirements.",
//                 font: "Arial",
//                 size: 20,
//                 color: "000000",
//             }),
//         ],
//         indent: { left: 720 },
//         spacing: { before: 100, after: 100 },
//     }),

//     ...makeIndentedParagraphs([
//         "●    A thorough study on the technology domain was performed by web research to gather relevant information.",
//         "●    Key concepts were identified and defined using key words and their synonyms.",
//         "●    Key strings were prepared based on identified search terms, relevant patent classifications.",
//     ]),

//     ...makeIndentedParagraphs([
//         "●    A broad to narrow search strategy (or narrow to broad) was employed using various search strings on few commercial/free databases to identify patent/applications.",
//         "●    The key strings were formulated based on the identified keywords. For key string, refer to Appendix 1.",
//         "●    The searches were carried on various paid and free databases. For list of databases, refer to Appendix 2.",
//         "●    The extracted documents were analyzed in detail to identify potentially relevant documents which can be further segregated as relevant and related depending on number of features matching with the technical features of the study.",
//         "●    For Patent literature only one member per family was considered for analysis.",
//         "●    For Non-English documents, the analysis was carried out based on machine translated text available from free/commercial sources.",
//     ]),


//     ...makeIndentedParagraphs([
//         "To ensure search comprehensiveness, following searches were performed:",
//         "●    Inventor/Assignee based search - The assignee/inventor of client’s interest or assignee/inventor from the identified relevant documents.",
//         "●    IPC/CPC/ECLA search - Various classes are used with/without the combination of keywords.",
//         "●    Semantic - Commercial databases are used to search on contextual meaning of terms.",
//         "●    Similarity search - A similarity search of the target patent and identified relevant prior art is conducted in the commercial databases.",
//         "●    Citation Search - Two level citation searches of closely identified prior arts are executed.",
//     ]),

//     ...makeIndentedParagraphs([
//         "●    The shortlisted relevant documents along with the bibliographic details and text mapping are provided in a user friendly, MS Word/PDF report.",
//         "●    Related documents are provided in the form of list in the report.",
//         "●    Bibliographic details of both relevant and related documents are provided in the report.",
//         "●    All the documents are provided with hyperlink to Individual patent office site or USPTO or Espacenet.",
//         "●    A tabulated summary of the relevant references is provided with executive summary.",
//     ]),
// ];

























// import { Paragraph, HeadingLevel } from "docx";

// export const getSearchMethodology = (projectTitle) => [
//     new Paragraph({
//         text: "2. Search Methodology",
//         heading: HeadingLevel.HEADING_1,
//         spacing: { after: 200 },
//         indent: { left: 720 }
//     }),
//     new Paragraph({
//         text: "Step 1: Understanding and Making Search Strategy",
//         heading: HeadingLevel.HEADING_2
//     }),
//     new Paragraph(`●    In-depth understanding “${projectTitle}” analyzed in terms of project requirements.`),
//     new Paragraph("●    A thorough study on the technology domain was performed by web research to gather relevant information."),
//     new Paragraph("●    Key concepts were identified and defined using key words and their synonyms."),
//     new Paragraph("●    Key strings were prepared based on identified search terms, relevant patent classifications."),

//     new Paragraph({
//         text: "Step 2: Searching and Analysis",
//         heading: HeadingLevel.HEADING_2
//     }),
//     new Paragraph("●    A broad to narrow search strategy (or narrow to broad) was employed using various search strings on few commercial/free databases to identify patent/applications."),
//     new Paragraph("●    The key strings were formulated based on the identified keywords. For key string, refer to Appendix 1."),
//     new Paragraph("●    The searches were carried on various paid and free databases. For list of databases, refer to Appendix 2."),
//     new Paragraph("●    The extracted documents were analyzed in detail to identify potentially relevant documents which can be further segregated as relevant and related depending on number of features matching with the technical features of the study."),
//     new Paragraph("●    For Patent literature only one member per family was considered for analysis."),
//     new Paragraph("●    For Non-English documents, the analysis was carried out based on machine translated text available from free/commercial sources."),

//     new Paragraph({
//         text: "Step 3: Additional Searches",
//         heading: HeadingLevel.HEADING_2
//     }),
//     new Paragraph("To ensure search comprehensiveness, following searches were performed:"),
//     new Paragraph("●    Inventor/Assignee based search - The assignee/inventor of client’s interest or assignee/inventor from the identified relevant documents."),
//     new Paragraph("●    IPC/CPC/ECLA search - Various classes are used with/without the combination of keywords."),
//     new Paragraph("●    Semantic - Commercial databases are used to search on contextual meaning of terms."),
//     new Paragraph("●    Similarity search - A similarity search of the target patent and identified relevant prior art is conducted in the commercial databases."),
//     new Paragraph("●    Citation Search - Two level citation searches of closely identified prior arts are executed."),

//     new Paragraph({
//         text: "Step 4: Report",
//         heading: HeadingLevel.HEADING_2
//     }),
//     new Paragraph("●    The shortlisted relevant documents along with the bibliographic details and text mapping are provided in a user friendly, MS Word/PDF report."),
//     new Paragraph("●    Related documents are provided in the form of list in the report."),
//     new Paragraph("●    Bibliographic details of both relevant and related documents are provided in the report."),
//     new Paragraph("●    All the documents are provided with hyperlink to Individual patent office site or USPTO or Espacenet."),
//     new Paragraph("●    A tabulated summary of the relevant references is provided with executive summary."),
// ];
