import {
    Document, Packer, InternalHyperlink, Paragraph, TextRun, AlignmentType, ExternalHyperlink, HeadingLevel, Bookmark, UnderlineType,
    TableCell, VerticalAlign, TableRow, Table, WidthType, TableOfContents, BorderStyle, ImageRun, Footer,
    Header, Drawing, TextWrappingType, TextWrappingSide, VerticalPositionRelativeFrom, VerticalPositionAlign,
    HorizontalPositionAlign, HorizontalPositionRelativeFrom,Media, 
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
    capitalizeEachWord,
    createFirstHeader,
    createFirstFooter,
} from "./docxUtils";
import HtmlDocx from "html-docx-js/dist/html-docx";
import { normalizeField } from "../StaticValues/StaticData";

// import myImageHeader from '../../../assets/images/MCRPL/header-img-rpt.png';
// import myImageFooter from '../../../assets/images/MCRPL/footer-img-rpt.png';
// import myMcrplImageFooter from '../../../assets/images/MCRPL/mcrpl-main-logo.png';




  const getUint8Array = async (src) => {
    const res = await fetch(src);
    const buf = await res.arrayBuffer();
    return new Uint8Array(buf);
  };



const bigHtmlString = `
  <div style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5;">
    <h1 style="color: #003366; text-align: center;">Project Report</h1>
    <h2 style="color: #006699;">1. Introduction</h2>
    <p>
      This document provides an overview of the <b>current project status</b>,
      including <i>completed tasks</i>, <u>ongoing work</u>, and <span style="color:red;">pending issues</span>.
    </p>

    <h2 style="color: #006699;">2. Completed Tasks</h2>
    <ul>
      <li>Requirement gathering and analysis completed</li>
      <li>User Interface wireframes approved</li>
      <li>Database schema finalized</li>
      <li>Authentication module implemented</li>
    </ul>

    <h2 style="color: #006699;">3. Ongoing Work</h2>
    <ol>
      <li>Integration of REST APIs</li>
      <li>Frontend development using <b>React.js</b></li>
      <li>Backend development using <b>Node.js</b> & <b>Express</b></li>
      <li>Testing with <i>Jest</i> framework</li>
    </ol>

    <h2 style="color: #006699;">4. Pending Items</h2>
    <p>
      Some tasks are still in the pipeline and need to be addressed in the upcoming sprint:
    </p>
    <ul>
      <li>Performance optimization</li>
      <li>Final deployment setup</li>
      <li>Security audit</li>
    </ul>

    <h2 style="color: #006699;">5. Team Members</h2>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead style="background-color: #e6f2ff;">
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Abinesh</td>
          <td>Frontend Developer</td>
          <td>Ongoing</td>
        </tr>
        <tr>
          <td>Santosh</td>
          <td>Backend Developer</td>
          <td>Completed</td>
        </tr>
        <tr>
          <td>Azhar</td>
          <td>QA Engineer</td>
          <td>Pending</td>
        </tr>
      </tbody>
    </table>

    <h2 style="color: #006699;">6. Conclusion</h2>
    <p>
      Overall, the project is <b style="color:green;">on track</b> with minor pending items.
      The next sprint will focus on <i>final testing</i> and <u>deployment readiness</u>.
    </p>

    <p style="margin-top:40px; text-align:right;">
      <b>Prepared By:</b> Project Management Team
    </p>
  </div>
`;

export const handleWordReportDownload = async ({
    introduction,
    relevantReferences,
    relatedReferences,
    appendix1,
    appendix2,
    projectTypeId,
}) => {
let relevantReferencesTableData = [];

if (
  Array.isArray(relevantReferences.relevantAndNplCombined) &&
  relevantReferences.relevantAndNplCombined.length > 0
) {
  relevantReferencesTableData = relevantReferences.relevantAndNplCombined;
} else if (
  Array.isArray(relevantReferences.publicationDetails) &&
  relevantReferences.publicationDetails.length > 0 &&
  Array.isArray(relevantReferences.nonPatentLiteratures) &&
  relevantReferences.nonPatentLiteratures.length > 0
) {
  const nonPatentModified = relevantReferences.nonPatentLiteratures.map(
    (item) => ({
      _id: item._id,
      nplId: true,
      patentNumber: item.nplTitle || "",
      publicationUrl: item.nplPublicationUrl || "",
      googlePublicationUrl: item.nplPublicationUrl || "",
      title: "",
      source: "",
      abstract: "",
      filingDate: item.nplPublicationDate || "",
      priorityDate: "",
      grantDate: "",
      assignee: item.url ? item.url : [],
      inventors: [],
      classifications: [],
      ipcClassifications: [],
      cpcClassifications: [],
      usClassification: [],
      familyMembers: [],
      analystComments: item.comments ? item.comments : [],
      relevantExcerpts: item.excerpts || [],
    })
  );

  relevantReferencesTableData = [
    ...relevantReferences.publicationDetails,
    ...nonPatentModified,
  ];
} else if (
  Array.isArray(relevantReferences.publicationDetails) &&
  relevantReferences.publicationDetails.length > 0
) {
  relevantReferencesTableData = relevantReferences.publicationDetails;
} else if (
  Array.isArray(relevantReferences.nonPatentLiteratures) &&
  relevantReferences.nonPatentLiteratures.length > 0
) {
  relevantReferencesTableData = relevantReferences.nonPatentLiteratures.map(
    (item) => ({
      _id: item._id,
      nplId: true,
      patentNumber: item.nplTitle || "",
      publicationUrl: item.nplPublicationUrl || "",
      googlePublicationUrl: item.nplPublicationUrl || "",
      title: "",
      source: "",
      abstract: "",
      filingDate: item.nplPublicationDate || "",
      priorityDate: "",
      grantDate: "",
      assignee: item.url ? item.url : [],
      inventors: [],
      classifications: [],
      ipcClassifications: [],
      cpcClassifications: [],
      usClassification: [],
      familyMembers: [],
      analystComments: item.comments ? item.comments : [],
      relevantExcerpts: item.excerpts || [],
    })
  );
} else {
  relevantReferencesTableData = [];
}

    const flatFormatedmap = appendix1.keyStrings.slice(1).filter(ft => ft.keyStrings.length > 0);

    const typeId1 = projectTypeId === "0001";
    const typeId2 = projectTypeId === "0002";

    const header = createHeader(introduction.projectId);
    const footer = createFooter();

    const firstHeader = await createFirstHeader();
    const firstFooter = await createFirstFooter();

    const tocConfig = getTocConfig(relevantReferencesTableData);
    // const tocConfigSummary = getTocConfigSummary(relevantAndNplCombined);
    const tocConfigSummary = getTocConfigSummary(relevantReferencesTableData);

    // Related Ref Condional Logics
    let relatedReferencesTableData = [];

    if (
      Array.isArray(relatedReferences.relatedAndNplCombined) &&
      relatedReferences.relatedAndNplCombined.length > 0
    ) {
      relatedReferencesTableData = relatedReferences.relatedAndNplCombined;
    } else if (
      Array.isArray(relatedReferences.publicationDetails) &&
      relatedReferences.publicationDetails.length > 0 &&
      Array.isArray(relatedReferences.nonPatentLiteratures) &&
      relatedReferences.nonPatentLiteratures.length > 0
    ) {
      const nonPatentModified = relatedReferences.nonPatentLiteratures.map(
        (item) => ({
          _id: item._id,
          publicationNumber: item.nplTitle,
          relatedPublicationUrl: item.nplPublicationUrl,
          relatedTitle: normalizeField(item.excerpts),
          relatedAssignee: [item.url],
          relatedInventor: item.comments,
          relatedFamilyMembers: [],
          relatedPublicationDate: item.nplPublicationDate,
          relatedPriorityDate: "",
          nplId: true,
        })
      );

      relatedReferencesTableData = [
        ...relatedReferences.publicationDetails,
        ...nonPatentModified,
      ];
    } else if (
      Array.isArray(relatedReferences.publicationDetails) &&
      relatedReferences.publicationDetails.length > 0
    ) {
      relatedReferencesTableData = relatedReferences.publicationDetails;
    } else if (
      Array.isArray(relatedReferences.nonPatentLiteratures) &&
      relatedReferences.nonPatentLiteratures.length > 0
    ) {
      relatedReferencesTableData = relatedReferences.nonPatentLiteratures.map(
        (item) => ({
          _id: item._id,
          publicationNumber: item.nplTitle,
          relatedPublicationUrl: item.nplPublicationUrl,
          relatedTitle: normalizeField(item.excerpts),
          relatedAssignee: [item.url],
          relatedInventor: item.comments,
          relatedFamilyMembers: [],
          relatedPublicationDate: item.nplPublicationDate,
          relatedPriorityDate: "",
          nplId: true,
        })
      );
    } else {
      relatedReferencesTableData = [];
    }

    const relatedReferencesTable = createRelatedReferencesTable(relatedReferencesTableData);

    const totalColumns = introduction?.executiveSummaryTotalColumn ?? 0;

    const dynamicHeadings = Array.from(
        { length: totalColumns },
        (_, i) => `Heading ${i + 1}`
    );

    const ExecutiveSummaryTable = createExecutiveSummaryTable({
        // data: relevantAndNplCombined,
        data: relevantReferencesTableData,
        dynamicHeadings,
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


    
    // const tocItems = (typeId2 && tocConfigSummary) || (typeId1 && tocConfig);
    // const tocTable = createTocTable(tocItems);



    const relevantReferencesTable = createRelevantReferencesTable(relevantReferencesTableData, typeId1 ? "typeId1" : "typeId2");

    const autoToc = new TableOfContents("Table of Contents", {
        hyperlink: true,
        headingStyleRange: "1-3",
    });

    // const createKeyStringsTables = (dbList = []) => {
    //     if (!dbList || dbList.length === 0) return [];

    //     return dbList
    //         .filter(db => Array.isArray(db.keyStrings) && db.keyStrings.length > 0)
    //         .map((db) => {
    //             let localIndex = 1;
    //             const headerRow = new TableRow({
    //                 children: [
    //                       new TableCell({
    //                         borders: commonBorders,
    //                         shading: { fill: "353839" },
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 spacing: { before: 30, after: 30 },
    //                                 children: [
    //                                     createTextRun("S No", textStyle.arial10, {
    //                                         bold: true,
    //                                         color: "FFFFFF",
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     }),
    //                     new TableCell({
    //                         borders: commonBorders,
    //                         shading: { fill: "353839" },
    //                         columnSpan: 3,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 spacing: { before: 30, after: 30 },
    //                                 children: [
    //                                     createTextRun(`Key Strings – ${db.databaseName}`, textStyle.arial10, {
    //                                         bold: true,
    //                                         color: "FFFFFF",
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     }),
    //                 ],
    //             });

    //             const rows = db.keyStrings.map((keyStr) => {
    //                 const row = new TableRow({
    //                     children: [
    //                         // S.No.
    //                         new TableCell({
    //                             borders: commonBorders,
    //                             width: { size: 5, type: WidthType.PERCENTAGE },
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.CENTER,
    //                                     children: [
    //                                         createTextRun(`${localIndex}.`, textStyle.arial10),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                         // Key String
    //                         new TableCell({
    //                             borders: commonBorders,
    //                             width: { size: 70, type: WidthType.PERCENTAGE },
    //                             children: [
    //                                 new Paragraph({
    //                                     alignment: AlignmentType.LEFT,
    //                                     indent: { left: 80 },
    //                                     spacing: { before: 20, after: 20 },
    //                                     children: [
    //                                         createTextRun(keyStr.keyString || "", textStyle.arial10),
    //                                     ],
    //                                 }),
    //                             ],
    //                         }),
    //                     ],
    //                 });

    //                 localIndex++;
    //                 return row;
    //             });

    //             return new Table({
    //                 width: { size: 100, type: WidthType.PERCENTAGE },
    //                 borders: commonBorders,
    //                 rows: [headerRow, ...rows],
    //             });
    //         });
    // };

    const createKeyStringsTables = (dbList = []) => {
        if (!dbList || dbList.length === 0) return [];

        const sortedList = [
            ...dbList.filter(db => db.databaseName !== "Others"),
            ...dbList.filter(db => db.databaseName === "Others")
        ];

        let globalIndex = 1;

        return sortedList
            .filter(db => Array.isArray(db.keyStrings) && db.keyStrings.length > 0)
            .map((db) => {
                const headerRow = new TableRow({
                  children: [
                    new TableCell({
                      // borders: commonBorders,
                      borders: commonBorders,
                      shading: { fill: "353839" },
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 30, after: 30 },
                          children: [
                            createTextRun("S No", textStyle.arial10, {
                              bold: true,
                              color: "FFFFFF",
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      borders: commonBorders,
                      shading: { fill: "353839" },
                      columnSpan: 3,
                      children: [
                        new Paragraph({
                          alignment: AlignmentType.CENTER,
                          spacing: { before: 30, after: 30 },
                          children: [
                            createTextRun(
                              `Key Strings – ${db.databaseName}`,
                              textStyle.arial10,
                              {
                                bold: true,
                                color: "FFFFFF",
                              }
                            ),
                          ],
                        }),
                      ],
                    }),

                    // new TableCell({
                    //     borders: commonBorders,
                    //     shading: { fill: "353839" },
                    //     columnSpan: 3,
                    //     children: [
                    //         new Paragraph({
                    //             alignment: AlignmentType.CENTER,
                    //             spacing: { before: 30, after: 30 },
                    //             children: [
                    //                 createTextRun("Database", textStyle.arial10, {
                    //                     bold: true,
                    //                     color: "FFFFFF",
                    //                 }),
                    //             ],
                    //         }),
                    //     ],
                    // }),
                    //  new TableCell({
                    //     borders: commonBorders,
                    //     shading: { fill: "353839" },
                    //     columnSpan: 3,
                    //     children: [
                    //         new Paragraph({
                    //             alignment: AlignmentType.CENTER,
                    //             spacing: { before: 30, after: 30 },
                    //             children: [
                    //                 createTextRun("Hits", textStyle.arial10, {
                    //                     bold: true,
                    //                     color: "FFFFFF",
                    //                 }),
                    //             ],
                    //         }),
                    //     ],
                    // }),
                  ],
                });

                const rows = db.keyStrings.map((keyStr) => {
                    const row = new TableRow({
                        children: [
                            // S.No.
                            new TableCell({
                                borders: commonBorders,
                                width: { size: 5, type: WidthType.PERCENTAGE },
                                verticalAlign: AlignmentType.CENTER,
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.CENTER,
                                        children: [
                                            createTextRun(`${globalIndex}.`, textStyle.arial10),
                                        ],
                                        spacing: { after: 0 }
                                    }),
                                ],
                            }),
                            // Key String
                            new TableCell({
                                borders: commonBorders,
                                width: { size: 80, type: WidthType.PERCENTAGE },
                                children: [
                                    new Paragraph({
                                        alignment: AlignmentType.LEFT,
                                        indent: { left: 80 },
                                        spacing: { before: 20, after: 20 },
                                        children: [
                                            createTextRun(keyStr.keyString || "", textStyle.arial10),
                                        ],
                                    }),
                                ],
                            }),
                            // new TableCell({
                            //     borders: commonBorders,
                            //     width: { size: 10, type: WidthType.PERCENTAGE },
                            //     children: [
                            //         new Paragraph({
                            //             alignment: AlignmentType.LEFT,
                            //             indent: { left: 80 },
                            //             spacing: { before: 20, after: 20 },
                            //             children: [
                            //                 createTextRun(keyStr.databaseName || "", textStyle.arial10),
                            //             ],
                            //         }),
                            //     ],
                            // }),

                            // new TableCell({
                            //     borders: commonBorders,
                            //     width: { size: 5, type: WidthType.PERCENTAGE },
                            //     children: [
                            //         new Paragraph({
                            //             alignment: AlignmentType.LEFT,
                            //             indent: { left: 80 },
                            //             spacing: { before: 20, after: 20 },
                            //             children: [
                            //                 createTextRun(keyStr.hitCount || "", textStyle.arial10),
                            //             ],
                            //         }),
                            //     ],
                            // }),

                        ],
                    });

                    globalIndex++;
                    return row;
                });

                return new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: commonBorders,
                    rows: [headerRow, ...rows],
                });
            });
    };

    const tables = [
        ...createKeyStringsTables(flatFormatedmap),
    ];

    // ---- NPL ----
    // tables.push(
    //     new Table({
    //         width: { size: 100, type: WidthType.PERCENTAGE },
    //         borders: commonBorders,
    //         rows: [
    //             new TableRow({
    //                 children: [
    //                     new TableCell({
    //                         borders: commonBorders,
    //                         verticalAlign: VerticalAlign.CENTER,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 children: [createTextRun("", { bold: true, color: "FFFFFF" })],
    //                             }),
    //                         ],
    //                         shading: { fill: "353839" },
    //                     }),
    //                     new TableCell({
    //                         borders: commonBorders,
    //                         verticalAlign: VerticalAlign.CENTER,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 spacing: { before: 0, after: 0 },
    //                                 children: [
    //                                     createTextRun("Key strings (Non-Patent Literatures)", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                 ],
    //                             }),
    //                         ],
    //                         shading: { fill: "353839" },
    //                     }),
    //                 ],
    //             }),
    //             ...(appendix1?.keyStringsNpl
    //                 ? appendix1.keyStringsNpl.map((keyStr, index) => {
    //                     const row = new TableRow({
    //                         children: [
    //                             new TableCell({
    //                                 borders: commonBorders,
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.CENTER,
    //                                         spacing: { after: 10, before: 10 },
    //                                         children: [createTextRun(`${dynamicIndex + index + 1}.`, textStyle.arial10)],
    //                                     }),
    //                                 ],
    //                             }),
    //                             new TableCell({
    //                                 borders: commonBorders,
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.LEFT,
    //                                         indent: { left: 80 },
    //                                         spacing: { after: 10, before: 10 },
    //                                         children: [createTextRun(keyStr.keyStringsNplText, textStyle.arial10)],
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     });
    //                     return row;
    //                 })
    //                 : []),
    //         ],
    //     })
    // );

    // ---- Additional Search ----
    // tables.push(
    //     new Table({
    //         width: { size: 100, type: WidthType.PERCENTAGE },
    //         borders: commonBorders,
    //         rows: [
    //             new TableRow({
    //                 children: [
    //                     new TableCell({
    //                         borders: commonBorders,
    //                         verticalAlign: VerticalAlign.CENTER,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 children: [createTextRun("", { bold: true, color: "FFFFFF" })],
    //                             }),
    //                         ],
    //                         shading: { fill: "353839" },
    //                     }),
    //                     new TableCell({
    //                         borders: commonBorders,
    //                         verticalAlign: VerticalAlign.CENTER,
    //                         children: [
    //                             new Paragraph({
    //                                 alignment: AlignmentType.CENTER,
    //                                 spacing: { before: 0, after: 0 },
    //                                 children: [
    //                                     createTextRun("Additional Search", textStyle.arial10, { bold: true, color: "FFFFFF" }),
    //                                 ],
    //                             }),
    //                         ],
    //                         shading: { fill: "353839" },
    //                     }),
    //                 ],
    //             }),
    //             ...(appendix1?.keyStringsAdditional
    //                 ? appendix1.keyStringsAdditional.map((keyStr, index) => {
    //                     const row = new TableRow({
    //                         children: [
    //                             new TableCell({
    //                                 borders: commonBorders,
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         alignment: AlignmentType.CENTER,
    //                                         spacing: { before: 20, after: 20 },
    //                                         children: [createTextRun(`${dynamicIndex + appendix1.keyStringsNpl.length + index + 1}.`, textStyle.arial10)],
    //                                     }),
    //                                 ],
    //                             }),
    //                             new TableCell({
    //                                 borders: commonBorders,
    //                                 verticalAlign: VerticalAlign.CENTER,
    //                                 children: [
    //                                     new Paragraph({
    //                                         indent: { left: 80 },
    //                                         alignment: AlignmentType.LEFT,
    //                                         spacing: { before: 20, after: 20 },
    //                                         children: [createTextRun(keyStr.keyStringsAdditionalText, textStyle.arial10)],
    //                                     }),
    //                                 ],
    //                             }),
    //                         ],
    //                     });
    //                     return row;
    //                 })
    //                 : []),
    //         ],
    //     })
    // );

    const dyKeyInd = flatFormatedmap.flatMap(f => f.keyStrings).length;
    const dyNplInd = appendix1?.keyStringsNpl.length;

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

            // Dynamic Database Table
            ...tables,

            // // Key strings (Non-Patent Literatures)
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
                                            createTextRun("S No", { bold: true, color: "FFFFFF" }),
                                        ],
                                        spacing: { before: 20, after: 30 }
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
                                        spacing: { before: 20, after: 30 },
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
                                                    createTextRun(`${dyKeyInd + (index + 1)}.`, textStyle.arial10),
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
                                            createTextRun("S No", { bold: true, color: "FFFFFF" }),
                                        ],
                                        spacing: { before: 20, after: 30 }
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
                                        spacing: { before: 20, after: 30 },
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
                                                    createTextRun(`${(dyKeyInd + dyNplInd) + (index + 1)}.`, textStyle.arial10),
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

    // const publications = typeId2 ? relevantAndNplCombined : relevantReferences;
    // const publications = (Array.isArray(relevantAndNplCombined) && relevantAndNplCombined.length > 0)
    //     ? relevantAndNplCombined
    //     : relevantReferences;

    const appendixTable = createTwoColumnTickTable({
        leftTitle: "Patents" || "",
        rightTitle: "Non-patent Literature" || "",
        leftData: appendix2?.patents || "",
        rightData: appendix2?.nonPatentLiterature || "",
        textStyle: textStyle.arial10,
    });

    const handleDownload = () => {
        const htmlString = `
      <h1 style="color:blue;">Hello from HTML String</h1>
      <p><b>This text is bold</b> and <i>this is italic</i></p>
      <ul>
        <li>Point One</li>
        <li>Point Two</li>
      </ul>
    `;

        const dynamicContent = `
      <h2>Report Generated on: ${new Date().toLocaleString()}</h2>
      <p>Status: <span style="color:green;">Completed</span></p>
    `;

        const fullHTML = `
      <html>
        <head><meta charset="utf-8"></head>
        <body>
          ${dynamicContent}
          <hr/>
          ${htmlString}
        </body>
      </html>
    `;

        return HtmlDocx.asBlob(fullHTML);
    };



  // const headerArray = await getUint8Array(myImageHeader);
  // const footerArray = await getUint8Array(myImageFooter);
  // const footerMcrplArray = await getUint8Array(myMcrplImageFooter);

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
        properties: createPageProperties("portrait"),
        // headers: {
        //   default: new Header({
        //     // children: [
        //     //   new Paragraph({
        //     //     alignment: AlignmentType.CENTER,
        //     //     children: [
        //     //       new ImageRun({
        //     //         // data: headerArray,
        //     //         transformation: {
        //     //           width: (3.38 * 96) / 2.54,
        //     //           height: (19.72 * 96) / 2.54,
        //     //           rotation: 45 * 60000,
        //     //         },
        //     //         floating: {
        //     //           horizontalPosition: {
        //     //             relative: HorizontalPositionRelativeFrom.PAGE,
        //     //             offset: 340000,
        //     //           },
        //     //           verticalPosition: {
        //     //             relative: VerticalPositionRelativeFrom.PAGE,
        //     //             offset: 340000,
        //     //           },
        //     //           wrap: {
        //     //             type: TextWrappingType.BEHIND_TEXT,
        //     //             side: TextWrappingSide.BOTH_SIDES,
        //     //           },
        //     //           allowOverlap: true,
        //     //           layoutInTableCell: false,
        //     //         },
        //     //       }),
        //     //     ],
        //     //   }),
        //     // ],
        //   }),
        // },
        // footers: {
        //   default: new Footer({
        //     children: [
        //       new Paragraph({
        //         alignment: AlignmentType.CENTER,
        //         spacing: { before: 0, after: 0, line: 240 }, // keep tight
        //         children: [
        //           new TextRun({
        //             size: 28,
        //             text: "Prepared by,",
        //             color: "000000",
        //             bold: true,
        //           }),
        //         ],
        //       }),

        //       // new Paragraph({
        //       //   alignment: AlignmentType.CENTER,
        //       //   spacing: { before: 0, after: 0, line: 240 },
        //       //   children: [
        //       //     new ImageRun({
        //       //       // data: footerMcrplArray,
        //       //       transformation: {
        //       //         width: (6.25 * 96) / 2.54,
        //       //         height: (1.81 * 96) / 2.54,
        //       //       },
        //       //     }),
        //       //   ],
        //       // }),

        //       new Paragraph({
        //         alignment: AlignmentType.END,
        //         spacing: { before: 0, after: 0, line: 240 },
        //         children: [
        //           new TextRun({
        //             size: 20,
        //             text: "Date: ",
        //             color: "000000",
        //             bold: true,
        //           }),
        //           new TextRun({
        //             size: 20,
        //             text: "MM DD, YY",
        //             color: "000000",
        //           }),
        //         ],
        //       }),

        //       // new Paragraph({
        //       //   spacing: { before: 0, after: 0, line: 240 },
        //       //   children: [
        //       //     new ImageRun({
        //       //       // data: footerArray,
        //       //       transformation: {
        //       //         width: (25.88 * 96) / 2.54,
        //       //         height: (1.33 * 96) / 2.54,
        //       //       },
        //       //       floating: {
        //       //         horizontalPosition: {
        //       //           relative: HorizontalPositionRelativeFrom.PAGE,
        //       //           align: HorizontalPositionAlign.CENTER,
        //       //         },
        //       //         verticalPosition: {
        //       //           relative: VerticalPositionRelativeFrom.PAGE,
        //       //           offset: 6950000,
        //       //         },
        //       //         behindDocument: true,
        //       //       },
        //       //     }),
        //       //   ],
        //       // }),

        //       new Paragraph({
        //         alignment: AlignmentType.CENTER,
        //         spacing: { before: 0, after: 0, line: 240 },
        //         indent: { left: 200, right: 30 },
        //         children: [
        //           new TextRun({
        //             text: "Heritage Building, #59/2, Kaderanahalli, 100 Feet Rd, Banashankari 2nd Stage, Bangalore - 560070, INDIA, Ph: +91 80 40907929 / 40939955 / 40939693,",
        //             size: 20,
        //             color: "FFFFFF",
        //           }),
        //         ],
        //       }),

        //       new Paragraph({
        //         alignment: AlignmentType.CENTER,
        //         spacing: { before: 0, after: 0, line: 240 },
        //         indent: { left: 100, right: 30 },
        //         children: [
        //           new TextRun({
        //             size: 20,
        //             text: "https://ipr.molecularconnections.co/ | ",
        //             color: "FFFFFF",
        //           }),
        //           new TextRun({
        //             text: "Follow us on ",
        //             color: "FFFFFF",
        //             size: 20,
        //           }),
        //           new TextRun({
        //             text: "LinkedIn",
        //             color: "FFFFFF",
        //             size: 20,
        //             underline: { type: "single", color: "FFFFFF" },
        //           }),
        //         ],
        //       }),
        //     ],
        //   }),
        // },


          // footers: {
          //   default: new Footer({
          //     children: [
          //       new Paragraph({
          //         alignment: AlignmentType.CENTER,
          //         spacing: { after: 0, before: 0 },
          //         children: [
          //           new TextRun({
          //             size: 28,
          //             text: "Prepared by,",
          //             color: "000000",
          //             bold: true,
          //           }),
          //         ],
          //       }),

          //       new Paragraph({
          //         alignment: AlignmentType.CENTER,
          //         spacing: { after: 0, before: 0 },
          //         children: [
          //           new ImageRun({
          //             data: footerMcrplArray,
          //             transformation: {
          //               width: (6.25 * 96) / 2.54,
          //               height: (1.81 * 96) / 2.54,
          //             },
          //           }),
          //         ],
          //       }),
          //       new Paragraph({
          //         alignment: AlignmentType.END,
          //         children: [
          //           new TextRun({
          //             size: 20,
          //             text: "Date: ",
          //             color: "000000",
          //             bold: true,
          //           }),
          //           new TextRun({
          //             size: 20,
          //             text: "MM DD, YY",
          //             color: "000000",
          //             bold: false,
          //           }),
          //         ],
          //       }),

          //       new Paragraph({
          //         spacing: { after: 0, before: 0 },
          //         children: [
          //           new ImageRun({
          //             data: footerArray,
          //             transformation: {
          //               width: (25.88 * 96) / 2.54,
          //               height: (1.33 * 96) / 2.54,
          //             },
          //             floating: {
          //               horizontalPosition: {
          //                 relative: HorizontalPositionRelativeFrom.PAGE,
          //                 align: HorizontalPositionAlign.CENTER,
          //               },
          //               verticalPosition: {
          //                 relative: VerticalPositionRelativeFrom.PAGE,
          //                 offset: 6950000,
          //               },
          //               behindDocument: true,
          //             },
          //           }),
          //         ],
          //       }),

          //       new Paragraph({
          //         alignment: AlignmentType.CENTER,
          //         spacing: { before: 10, after: 30 },
          //         indent: { left: 200, right: 30 },
          //         children: [
          //           new TextRun({
          //             text: "Heritage Building, #59/2, Kaderanahalli, 100 Feet Rd, Banashankari 2nd Stage, Bangalore - 560070, INDIA, Ph: +91 80 40907929 / 40939955 / 40939693,",
          //             size: 20,
          //             color: "FFFFFF",
          //           }),
          //         ],
          //       }),
          //       new Paragraph({
          //         alignment: AlignmentType.CENTER,
          //         spacing: { after: 0, before: 0 },
          //         indent: { left: 100, right: 30 },
          //         children: [
          //           new TextRun({
          //             size: 20,
          //             text: "https://ipr.molecularconnections.co/ | ",
          //             color: "FFFFFF",
          //           }),
          //           new TextRun({
          //             text: "Follow us on ",
          //             color: "FFFFFF",
          //             size: 20,
          //           }),
          //           new TextRun({
          //             text: "LinkedIn",
          //             color: "FFFFFF",
          //             size: 20,
          //             underline: { type: "single", color: "FFFFFF" },
          //           }),
          //         ],
          //       }),
          //     ],
          //   }),
          // },

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
            createParagraph(introduction.projectId, {
              alignment: AlignmentType.CENTER,
              spacing: { before: 50, after: 50 },
              textStyleOverride: { bold: true, ...textStyle.arial24 },
            }),
          ],
        },
        // Table Content
        {
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: [
            tocTitle,
            // tocTable,
            // tocTitle,
            autoToc,
            createParagraph(
              [
                new ExternalHyperlink({
                  link: "https://par.molecularconnections.com/mc-review/form/IDF-34131Top%20Load%20Washer%20with%20Flexible%20Dispenser%20and%20Serviceable%20Dosing%20System",
                  children: [
                    createTextRun(
                      "Please rate this search report",
                      textStyle.arial10,
                      {
                        bold: true,
                        color: "0000FF",
                        underline: { type: UnderlineType.SINGLE },
                      }
                    ),
                  ],
                }),
              ],
              {
                spacing: { before: 100 },
                indent: { left: 380 },
              }
            ),
          ],
        },

        // Search Features
        {
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: [
            createParagraph(
              new Bookmark({
                id: typeId2
                  ? "typeID2-search-features"
                  : "typeID1-search-features",
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
                para.split("\n").map((line) =>
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
                properties: createPageProperties("portrait"),
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
          properties: createPageProperties("portrait"),
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
                    createTextRun(
                      "3. Potentially Relevant References",
                      textStyle.arial14,
                      {
                        bold: true,
                        color: "000000",
                      }
                    ),
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

            ...(relevantReferences.overallSummary &&
            relevantReferences.overallSummary.length
              ? relevantReferences.overallSummary.flatMap((item) =>
                  item.split("\n").map(
                    (line) =>
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
                ]),
          ],
        },
        typeId2 && {
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: [
            createParagraph(
              new Bookmark({
                id: "typeID2-executive-summary",
                children: [
                  createTextRun("2. Executive Summary", textStyle.arial14, {
                    bold: true,
                    color: "000000",
                  }),
                ],
              }),
              {
                indent: { left: 630 },
                spacing: { after: 50 },
                paragraphOptions: { heading: HeadingLevel.HEADING_1 },
              }
            ),

            createParagraph(
              "Feature- Mapping Summary of Potential Relevant References",
              {
                indent: indent380,
                spacing: { after: 50 },
                textStyleOverride: {
                  ...textStyle.arial10,
                  italics: true,
                },
              }
            ),

            ExecutiveSummaryTable,
            ...summaryParagraphs,
          ],
        },
        // Relevant
        {
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: [
            // Section heading
            new Paragraph({
              indent: { left: 880 },
              children: [
                new Bookmark({
                  id: typeId2
                    ? "typeID2-potentially-relevant-references"
                    : "typeID1-relevant-biblio",
                  children: [
                    createTextRun(
                      `${typeId2 ? "3" : "4"}. Potentially Relevant References`,
                      textStyle.arial14,
                      { bold: true, color: "000000" }
                    ),
                  ],
                }),
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 50 },
            }),
            // Dynamic publications list
            ...(Array.isArray(relevantReferencesTableData) &&
            relevantReferencesTableData.length > 0
              ? relevantReferencesTableData.flatMap((pub, pubIndex) => {
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

                        new TextRun({ text: "  " }),
                        new TextRun({
                          text: "[Google Patents Link: ",
                          bold: true,
                        }),
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

                        // ...(typeId1
                        //     ? [
                        //         new TextRun({ text: "  " }),
                        //         new TextRun({ text: "[Google Patents Link: ", bold: true }),
                        //         new ExternalHyperlink({
                        //             link: pub.googlePublicationUrl || "",
                        //             children: [
                        //                 new TextRun({
                        //                     text: pub.patentNumber?.toUpperCase() || "N/A",
                        //                     style: "Hyperlink",
                        //                     color: "0000FF",
                        //                     underline: { type: UnderlineType.SINGLE },
                        //                 }),
                        //             ],
                        //         }),
                        //         new TextRun({ text: "]", bold: true }),
                        //     ]
                        //     : []),
                      ],
                      isParagraphChildren: true,
                    },
                    { label: "Title", value: capitalizeEachWord(pub.title) },
                    {
                      label: "Inventor(s)",
                      value: capitalizeEachWord(
                        (pub.inventors || []).join("; ")
                      ),
                    },
                    {
                      label: "Assignee(s)",
                      value: capitalizeEachWord(
                        (pub.assignee
                          ? Array.isArray(pub.assignee)
                            ? pub.assignee
                            : [pub.assignee]
                          : []
                        ).join("; ")
                      ),
                    },
                    {
                      label: "Family Members",
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
                    {
                      label: "Publication Date",
                      value: sanitizeText(pub.grantDate),
                    },
                    {
                      label: "Application Date",
                      value: sanitizeText(pub.filingDate),
                    },
                    {
                      label: "Priority Date",
                      value: sanitizeText(pub.priorityDate),
                    },
                    {
                      label: "IPC",
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
                      label: "CPC",
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
                          id: typeId2
                            ? `typeID2-${pubIndex + 1}`
                            : `typeID1-${pubIndex + 1}`,
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
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: [
            new Paragraph({
              indent: { left: 630 },
              children: [
                new Bookmark({
                  id: typeId2
                    ? "typeID2-related-references"
                    : "typeID1-related-references",
                  children: [
                    createTextRun(
                      `${typeId2 ? "4" : "5"}.  Related References`,
                      textStyle.arial14,
                      { bold: true, color: "000000" }
                    ),
                  ],
                }),
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
            relatedReferencesTable,
          ],
        },
        // typeId2 Search Methodology
        typeId2 && {
          properties: createPageProperties("portrait"),

          headers: { default: header },
          footers: { default: footer },
          children: getSearchMethodology(typeId2),
        },
        (typeId1 || typeId2) && {
          properties: createPageProperties("portrait"),
          headers: { default: header },
          footers: { default: footer },
          children: appendix1Childern,
        },
        // Appendix 2
        {
          properties: createPageProperties("portrait"),
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
                }),
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
                    createTextRun("Databases", textStyle.arial11, {
                      bold: true,
                      color: "000000",
                    }),
                  ],
                }),
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
          properties: createPageProperties("portrait"),
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
              ? disclaimer.map(
                  (line) =>
                    new Paragraph({
                      indent: { left: 520 },
                      alignment: AlignmentType.START,
                      spacing: { after: 50 },
                      children: [createTextRun(line, textStyle.arial10)],
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
                ]),
          ],
        },
      ].filter(Boolean),
    });

const blob = await Packer.toBlob(doc);
saveAs(blob, `${introduction.projectTitle || "StaticData"}.docx`);
};
