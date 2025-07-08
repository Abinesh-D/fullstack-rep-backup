import { saveAs } from "file-saver";
import {
    Document,
    Packer,
    Paragraph,
    TextRun,
    PageBreak,
    AlignmentType,
    Footer,
} from "docx";
import { getSearchMethodology } from "./searchMethodology";

const defaultFont = { font: "Calibri", size: 24 }; // 12pt

const createTextRun = (text, options = {}) =>
    new TextRun({ text: text || "", ...defaultFont, ...options });

const createParagraph = (text, heading = false) =>
    new Paragraph({
        children: [createTextRun(text, heading ? { bold: true, size: 30 } : {})],
        spacing: { after: 200 },
        alignment: heading ? AlignmentType.CENTER : AlignmentType.LEFT,
    });

export const handleWordReportDownload = (getProjectValue) => {
    console.log("Generating Word Report...", getProjectValue);

    const introData = getProjectValue.stages.introduction?.[0] || {};
    console.log('introData', introData)

    // PAGE 1: Project Title & Subtitle
    const page1 = [
        createParagraph(introData.projectTitle, true),
        createParagraph(introData.projectSubTitle
 || "", false),
        new PageBreak(),
    ];

    // PAGE 2: Search Features
    const page2 = [
        createParagraph("1. Search Features", true),
        createParagraph(introData.searchFeatures || "No search features provided."),
        new PageBreak(),
    ];

    // PAGE 3: Search Methodology (Static)
    const page3 = getSearchMethodology();

    /*
    // PAGE 4: Publication Details
    const publicationSection = [
        createParagraph("2. Publication Details", true),
        ...(getProjectValue.publicationDetails || []).flatMap((patent, index) => [
            ...createPatentDetails(patent, index),
            new PageBreak(),
        ]),
    ];

    // PAGE 5: Non-Patent Literature
    const nplSection = [
        createParagraph("3. Non-Patent Literature", true),
        ...(getProjectValue.nonPatentLiteratures || []).flatMap((npl, index) => [
            ...createNonPatentDetails(npl, index),
            new PageBreak(),
        ]),
    ];

    // PAGE 6: Related References
    const relatedRefSection = [
        createParagraph("4. Related References", true),
        ...(getProjectValue.relatedReferences || []).flatMap((ref, index) => [
            ...createRelatedReferenceDetails(ref, index),
            new PageBreak(),
        ]),
    ];

    // PAGE 7: Appendices
    const appendixSection = [
        createParagraph("Appendix 1: Base Search Terms", true),
        ...(getProjectValue.baseSearchTerms || []).map((term, index) =>
            createParagraph(`${index + 1}. ${term.searchTermText}`)
        ),
        new PageBreak(),

        createParagraph("Appendix 2: Key Strings", true),
        ...(getProjectValue.keyStrings || []).map((k, index) =>
            createParagraph(`${index + 1}. ${k.keyStringsText}`)
        ),
        new PageBreak(),

        createParagraph("Appendix 3: Data Availability", true),
        ...(getProjectValue.dataAvailability || []).map((d, index) =>
            createParagraph(`${index + 1}. ${d.dataAvailableText}`)
        ),
    ];
    */

    const doc = new Document({
        sections: [
            {
                children: [
                    ...page1,
                    // ...page2,
                    // ...page3,
                    // ...publicationSection,
                    // ...nplSection,
                    // ...relatedRefSection,
                    // ...appendixSection,
                ],
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                children: [
                                    createTextRun(`${getProjectValue.projectName} - Report`, {
                                        italics: true,
                                        size: 20,
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
    console.log("✅ Word file downloaded successfully!");
};
















// import { saveAs } from "file-saver";
// import {
//     Document,
//     Packer,
//     Paragraph,
//     TextRun,
//     PageBreak,
//     HeadingLevel,
//     AlignmentType,
//     Footer,
// } from "docx";
// import { getSearchMethodology } from "./searchMethodology";

// const defaultFont = { font: "Calibri", size: 24 }; // 12pt

// const createTextRun = (text, options = {}) =>
//     new TextRun({ text: text || "", ...defaultFont, ...options });

// const createParagraph = (text, heading = false) =>
//     new Paragraph({
//         children: [createTextRun(text, heading ? { bold: true, size: 30 } : {})],
//         spacing: { after: 200 },
//         alignment: heading ? AlignmentType.CENTER : AlignmentType.LEFT,
//     });

// const createSubHeading = (text) =>
//     new Paragraph({
//         children: [createTextRun(text, { bold: true, size: 26 })],
//         spacing: { after: 100 },
//         alignment: AlignmentType.LEFT,
//     });

// const createPatentDetails = (patent, index) => [
//     createSubHeading(`${index + 1}. ${patent.title || "Untitled Patent"}`),
//     createParagraph(`Patent Number: ${patent.patentNumber}`),
//     createParagraph(`Publication URL: ${patent.publicationUrl}`),
//     createParagraph(`Filing Date: ${patent.filingDate}`),
//     createParagraph(`Priority Date: ${patent.priorityDate}`),
//     createParagraph(`Grant Date: ${patent.grantDate}`),
//     createParagraph(`Assignees: ${patent.assignee?.join(", ") || "N/A"}`),
//     createParagraph(`Inventors: ${patent.inventors?.join(", ") || "N/A"}`),
//     createParagraph(`Classifications: ${patent.classifications?.join(", ") || "N/A"}`),
//     createParagraph(`Family Members: ${patent.familyMembers?.join(", ") || "N/A"}`),
//     createParagraph(`Analyst Comments: ${patent.analystComments || "N/A"}`),
//     createParagraph(`Relevant Excerpts: ${patent.relevantExcerpts || "N/A"}`),
// ];

// const createNonPatentDetails = (npl, index) => [
//     createSubHeading(`${index + 1}. ${npl.nplTitle || "Untitled NPL"}`),
//     createParagraph(`URL: ${npl.url}`),
//     createParagraph(`Publication Date: ${npl.nplPublicationDate}`),
//     createParagraph(`Comments: ${npl.comments}`),
//     createParagraph(`Excerpts: ${npl.excerpts}`),
// ];

// const createRelatedReferenceDetails = (ref, index) => [
//     createSubHeading(`${index + 1}. ${ref.relatedTitle || "Untitled Related Reference"}`),
//     createParagraph(`Publication Number: ${ref.publicationNumber}`),
//     createParagraph(`Publication URL: ${ref.relatedPublicationUrl}`),
//     createParagraph(`Publication Date: ${ref.relatedPublicationDate}`),
//     createParagraph(`Assignees: ${ref.relatedAssignee?.join(", ") || "N/A"}`),
//     createParagraph(`Inventors: ${ref.relatedInventor?.join(", ") || "N/A"}`),
//     createParagraph(`Family Members: ${ref.relatedFamilyMembers?.join(", ") || "N/A"}`),
// ];

// export const handleWordReportDownload = async (getProjectValue) => {
//     console.log("Generating Word Report...", getProjectValue);

//     const introData = getProjectValue.introduction?.[0] || {};

//     // PAGE 1: Project Title & Subtitle
//     const page1 = [
//         createParagraph(introData.projectTitle || getProjectValue.projectName, true),
//         createParagraph(introData.projectSubTitle || "", false),
//         new PageBreak(),
//     ];

//     // PAGE 2: Search Features
//     const page2 = [
//         createParagraph("1. Search Features", true),
//         createParagraph(getProjectValue.searchFeatures || "No search features provided."),
//         new PageBreak(),
//     ];

//     // PAGE 3: Search Methodology (Static)
//     const page3 = getSearchMethodology();

//     // PAGE 4: Publication Details
//     const publicationSection = [
//         createParagraph("2. Publication Details", true),
//         ...(getProjectValue.publicationDetails || []).flatMap((patent, index) => [
//             ...createPatentDetails(patent, index),
//             new PageBreak(),
//         ]),
//     ];

//     // PAGE 5: Non-Patent Literature
//     const nplSection = [
//         createParagraph("3. Non-Patent Literature", true),
//         ...(getProjectValue.nonPatentLiteratures || []).flatMap((npl, index) => [
//             ...createNonPatentDetails(npl, index),
//             new PageBreak(),
//         ]),
//     ];

//     // PAGE 6: Related References
//     const relatedRefSection = [
//         createParagraph("4. Related References", true),
//         ...(getProjectValue.relatedReferences || []).flatMap((ref, index) => [
//             ...createRelatedReferenceDetails(ref, index),
//             new PageBreak(),
//         ]),
//     ];

//     // PAGE 7: Appendices
//     const appendixSection = [
//         createParagraph("Appendix 1: Base Search Terms", true),
//         ...(getProjectValue.baseSearchTerms || []).map((term, index) =>
//             createParagraph(`${index + 1}. ${term.searchTermText}`)
//         ),
//         new PageBreak(),

//         createParagraph("Appendix 2: Key Strings", true),
//         ...(getProjectValue.keyStrings || []).map((k, index) =>
//             createParagraph(`${index + 1}. ${k.keyStringsText}`)
//         ),
//         new PageBreak(),

//         createParagraph("Appendix 3: Data Availability", true),
//         ...(getProjectValue.dataAvailability || []).map((d, index) =>
//             createParagraph(`${index + 1}. ${d.dataAvailableText}`)
//         ),
//     ];

//     const doc = new Document({
//         sections: [
//             {
//                 children: [
//                     ...page1,
//                     ...page2,
//                     ...page3,
//                     ...publicationSection,
//                     ...nplSection,
//                     ...relatedRefSection,
//                     ...appendixSection,
//                 ],
//                 footers: {
//                     default: new Footer({
//                         children: [
//                             new Paragraph({
//                                 alignment: AlignmentType.CENTER,
//                                 children: [
//                                     createTextRun(`${getProjectValue.projectName} - Report`, {
//                                         italics: true,
//                                         size: 20,
//                                     }),
//                                 ],
//                             }),
//                         ],
//                     }),
//                 },
//             },
//         ],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `${getProjectValue.projectName?.replace(/[^a-z0-9]/gi, "_") || "Report"}_Report.docx`);
//     console.log("✅ Word file downloaded successfully!");
// };
