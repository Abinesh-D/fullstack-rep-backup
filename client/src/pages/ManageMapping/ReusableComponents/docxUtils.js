import {
  AlignmentType,
  VerticalAlign,
  ShadingType,
  InternalHyperlink,
  Table,
  Footer,
  Header,
  BorderStyle,
  UnderlineType,
  WidthType,
  TabStopPosition,
  TabStopType,
  ExternalHyperlink,
  Bookmark,
  HeadingLevel,
  SimpleField,
  TextRun,
  TableRow,
  TableCell,
  Paragraph,
  ImageRun,
} from "docx";
import HtmlDocx from "html-docx-js/dist/html-docx";

/* ---------------------------------- Text Styles ---------------------------------- */
export const textStyle = {
  arial24: { font: "Arial", size: 48 },
  arial14: { font: "Arial", size: 28 },
  arial11: { font: "Arial", size: 22 },
  arial10: { font: "Arial", size: 20 },
  arial13: { font: "Arial", size: 26 },
  arial8: { font: "Arial", size: 16 },
  arial10BoldBlue: { font: "Arial", size: 20, color: "0000FF" },
};

/* ---------------------------------- Borders ---------------------------------- */
// export const commonBorders = {
//   top: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//   bottom: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//   left: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
//   right: { style: BorderStyle.SINGLE, size: 1, color: "D3D3D3" },
// };

export const commonBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: "D3D3D3" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "D3D3D3" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "D3D3D3" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "D3D3D3" },
};

// export const blackBorders = {
//   top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//   bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//   left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
//   right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
// };

export const blackBorders = {
  top: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "000000" },
};

// export const borderNone = {
//   top: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
//   bottom: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
//   left: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
//   right: { style: BorderStyle.SINGLE, size: 1, color: "FFFFFF" },
// };


export const borderNone = {
  top: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
  bottom: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
  left: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
  right: { style: BorderStyle.SINGLE, size: 2, color: "FFFFFF" },
};

export const disclaimer =
  "This search report is based on the resources available in public domain such as published patents/applications, non-patent literature, products, blogs, technology news, company websites and available/accessible/downloadable. Furthermore, the report is based upon individual expert’s view/judgment & such analysis may vary from expert to expert. Kindly refrain concurring them as Molecular Connections’ views. The contents of this research is for general information purposes only. While Molecular Connections endeavor is to keep the information up to date and correct, Molecular Connections makes no representations OR warranties of any kind, express OR implied, about the completeness OR availability with respect to the contents of this research paper. Any reliance placed on such information is therefore strictly at user’s own risk.";

/* ---------------------------------- Margin Presets ---------------------------------- */
export const marginsStyle = {
  margins: { top: 100, bottom: 100, left: 100, right: 100 },
};
export const margins150 = {
  margins: { top: 150, bottom: 150, left: 150, right: 150 },
};

export const indent380 = { left: 380, right: 380 };

/* ---------------------------------- Text Utils ---------------------------------- */
export const sanitizeText = (text) =>
  (text || "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );

export function capitalizeEachWord(str) {
  if (!str) return "";
  if (Array.isArray(str)) {
    str = str.join(", ");
  }
  str = String(str);
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export const toTitleCase = (str) =>
  (str || "")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const formatAssigneeOrInventor = (str) => {
  if (!str) return "";
  return str.includes(";")
    ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
    : str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
};

/* ---------------------------------- Word Utilities ---------------------------------- */

export const createTextRun = (
  text,
  style = textStyle.arial11,
  overrides = {}
) => new TextRun({ text, ...style, ...overrides });

const defaultSpacing = { before: 100, after: 100 };

export const createParagraph = (
  content = "",
  {
    alignment = AlignmentType.LEFT,
    spacing = defaultSpacing,
    indent = undefined,
    textStyleOverride = {},
    paragraphOptions = {},
  } = {}
) => {
  const normalizeTextRun = (item) => {
    if (typeof item === "string") {
      return createTextRun(item, textStyle.arial10, textStyleOverride);
    }
    return item;
  };

  const children = Array.isArray(content)
    ? content.map(normalizeTextRun)
    : [normalizeTextRun(content)];

  return new Paragraph({
    alignment,
    spacing,
    indent,
    children,
    ...paragraphOptions,
  });
};


const widthTwips = Math.round(27.94 * 566.929);
const heightTwips = Math.round(21.59 * 566.929);

const margins = 930;

export const createPageProperties = (orientation = "portrait") => ({
  page: {
    margin: {
      top: margins,
      bottom: margins,
      left: margins,
      right: margins,
    },
    footerDistance: 0,
    size: {
      orientation,
      width: widthTwips,
      height: heightTwips,
    },
    borders: {
      pageBorderTop: {
        style: BorderStyle.THIN_THICK_SMALL_GAP,
        size: 25,
        space: 18,
        color: "002060",
      },

      pageBorderBottom: {
        style: BorderStyle.THICK_THIN_SMALL_GAP,
        size: 25,
        space: 18,
        color: "002060",
      },
      pageBorderLeft: {
        style: BorderStyle.THIN_THICK_SMALL_GAP,
        size: 25,
        space: 18,
        color: "002060",
      },
      pageBorderRight: {
        style: BorderStyle.THICK_THIN_SMALL_GAP,
        size: 25,
        space: 18,
        color: "002060",
      },
    },
  },
});

export const createHeader = (projectId = "") =>
  new Header({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          createTextRun(projectId, textStyle.arial10, {
            bold: true,
            color: "000000",
          }),
        ],
      }),
    ],
  });









// Convert SVG → PNG → ArrayBuffer
async function svgToPngArrayBuffer(svgString , width, height) {
  return new Promise((resolve) => {
    const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        const reader = new FileReader();
reader.onload = () => resolve(reader.result);
        reader.readAsArrayBuffer(blob);
      }, "image/png");
    };
    img.src = url;
  });
}

const cmToEmu = (cm) => cm * 360000;

export const createFirstHeader = async (projectId = "") => {
  // target image size in px
  const widthPx = 560;
  const heightPx = 96;

  // SVG (background shape)
 const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="400">
    <polygon points="0,0 0,400 90,350" fill="#FF6600" transform="rotate(45)" />
  </svg>
`;

  // Convert SVG → PNG buffer
  const pngArrayBuffer = await svgToPngArrayBuffer(svg, widthPx, heightPx);

  return new Header({
    children: [
      // IMAGE with floating style (mimics Word layout settings)
      new Paragraph({
        children: [
          new ImageRun({
            data: pngArrayBuffer,
            transformation: {
              width: widthPx, // px
              height: heightPx, // px
            },
            floating: {
              horizontalPosition: {
                offset: cmToEmu(-5.99), // absolute X
              },
              verticalPosition: {
                offset: cmToEmu(7.31), // absolute Y
              },
              wrap: {
                type: "square", // wrapping style
              },
              margins: {
                top: cmToEmu(0),
                bottom: cmToEmu(0),
                left: cmToEmu(0.32),
                right: cmToEmu(0.32),
              },
              rotation: 90 * 60000, // 90 degrees
            },
          }),
        ],
      }),

      // TEXT centered below
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          createTextRun(projectId, textStyle.arial10, {
            bold: true,
            color: "000000",
          }),
        ],
      }),
    ],
  });
};




// async function svgToPngUint8Array(svgString, width, height) {
//   return new Promise((resolve) => {
//     const svgBlob = new Blob([svgString], { type: "image/svg+xml" });
//     const url = URL.createObjectURL(svgBlob);

//     const img = new Image();
//     img.onload = () => {
//       const canvas = document.createElement("canvas");
//       canvas.width = width;
//       canvas.height = height;
//       const ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0, width, height);

//       canvas.toBlob((blob) => {
//         const reader = new FileReader();
//         reader.onload = () => {
//           resolve(new Uint8Array(reader.result));
//         };
//         reader.readAsArrayBuffer(blob);
//       }, "image/png");
//     };
//     img.src = url;
//   });
// }

// export const createFirstHeader = async (projectId = "") => {
//   const width = 560;
//   const height = 96;

//   const svg = `
//     <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
//       <polygon points="0,0 ${width},0 0,${height}" fill="blue"/>
//     </svg>
//   `;

//   const pngBytes = await svgToPngUint8Array(svg, width, height);

//   return new Header({
//     children: [
//       new Paragraph({
//         alignment: AlignmentType.LEFT,
//         children: [
//           new ImageRun({
//             data: pngBytes,
//             transformation: { width, height },
//           }),
//         ],
//       }),
//       new Paragraph({
//         alignment: AlignmentType.CENTER,
//         children: [
//           createTextRun(projectId, textStyle.arial10, {
//             bold: true,
//             color: "000000",
//           }),
//         ],
//       }),
//     ],
//   });
// };

export const createFirstFooter = async () => {

}

export const createFooter = () =>
  new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.END,
        children: [
          new TextRun("Page "),
          new TextRun({ children: ["CURRENT"], bold: true }),
          new TextRun(" of "),
          new TextRun({ children: ["TOTAL_PAGES"], bold: true }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun("CONFIDENTIAL")],
      }),
    ],
  });

/* ---------------------------------- Table Row Builders ---------------------------------- */

export const createSingleColumnTableRows = (rows) => {
  return rows.map(({ label, value, isParagraphChildren }) => {
    let children = [];

    const topMargin =
      label === "Publication No" || label === "Publication Date" ? 100 : 0;

    children.push(
      new TextRun({
        text: `${label} – `,
        bold: true,
      })
    );

    if (isParagraphChildren && Array.isArray(value)) {
      children.push(...value);
    } else {
      children.push(new TextRun({ text: String(value || "N/A") }));
    }

    return new TableRow({
      children: [
        new TableCell({
          borders: borderNone,
          children: [
            new Paragraph({
              indent: { left: 50 },
              children,
            }),
          ],
          margins: { top: topMargin },
        }),
      ],
    });
  });
};

/* ---------------------------------- Family Member Utility ---------------------------------- */

export const getFamilyMembersParagraphChildren = (data) => {
  let familyMembers = data?.FamilyMembers || [];

  if (Array.isArray(familyMembers)) {
    familyMembers = familyMembers.flatMap((item) =>
      typeof item === "string"
        ? item
            .split(/[;,]/)
            .map((m) => m.trim())
            .filter(Boolean)
        : []
    );
  } else if (typeof familyMembers === "string") {
    familyMembers = familyMembers
      .split(/[;,]/)
      .map((m) => m.trim())
      .filter(Boolean);
  }

  const displayLimit = 3;
  const totalCount = familyMembers.length;

  const displayedMembers = familyMembers.slice(0, displayLimit).join("; ");
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
      new TextRun({
        text: "; ",
        ...textStyle.arial10,
      })
    );
    children.push(
      new ExternalHyperlink({
        link: data.hyperLink,
        children: [
          new TextRun({
            text: sanitizeText(remainingText),
            ...textStyle.arial10BoldBlue,
            underline: true,
          }),
        ],
      })
    );
  }

  return children;
};

/* ---------------------------------- TOC Configurations ---------------------------------- */
export const getTocConfig = (relevantReferences = []) => [
  {
    label: "1.   Search Features",
    anchor: "typeID1-search-features",
    isBold: true,
  },
  {
    label: "2.   Search Methodology",
    anchor: "typeID1-search-methodology",
    isBold: true,
  },
  {
    label: "3.   Potentially Relevant References",
    anchor: "typeID1-relevant-toc",
    isBold: true,
  },
  {
    label: "4.   Potentially Relevant References",
    anchor: "typeID1-relevant-biblio",
    isBold: true,
  },
  ...relevantReferences.map((ref, index) => ({
    label: `${index + 1}.    ${ref.patentNumber}`,
    anchor: `typeId1-${index + 1}`,
    indent: 360,
  })),
  {
    label: "5.   Related References",
    anchor: "typeID1-related-references",
    isBold: true,
  },
  { label: "Appendix 1", anchor: "typeID1-appendix1", isBold: true },
  {
    label: "Search Terms & Search Strings",
    anchor: "typeID1-search-terms",
    indent: 720,
    font13: true,
  },
  {
    label: "Data Availability",
    anchor: "typeID1-data-availability",
    indent: 720,
    font13: true,
  },
  { label: "Appendix 2", anchor: "typeID1-appendix2", isBold: true },
  {
    label: "Databases",
    anchor: "typeID1-databases",
    indent: 720,
    font13: true,
  },
  { label: "Disclaimer", anchor: "typeID1-disclaimer", isBold: true },
];

export const getTocConfigSummary = (relevantAndNplCombined = []) => [
  {
    label: "1.   Search Features",
    anchor: "typeID2-search-features",
    bookmark: "typeID2-search-features",
    isBold: true,
  },
  {
    label: "2.   Executive Summary",
    anchor: "typeID2-executive-summary",
    bookmark: "typeID2-executive-summary",
    isBold: true,
  },
  {
    label: "3.   Potentially Relevant References",
    anchor: "typeID2-potentially-relevant-references",
    bookmark: "typeID2-potentially-relevant-references",
    isBold: true,
  },
  ...relevantAndNplCombined.map((map, index) => {
    const anchor = `typeID2-${index + 1}`;
    return {
      label: `${index + 1}.    ${map.patentNumber}`,
      anchor,
      bookmark: anchor,
      indent: 360,
    };
  }),
  {
    label: "4.   Related References",
    anchor: "typeID2-related-references",
    bookmark: "typeID2-related-references",
    isBold: true,
  },
  {
    label: "Appendix 1",
    anchor: "typeID2-appendix1",
    bookmark: "typeID2-appendix1",
    isBold: true,
  },
  {
    label: "Appendix 2",
    anchor: "typeID2-appendix2",
    bookmark: "typeID2-appendix2",
    isBold: true,
  },
  {
    label: "Search Terms & Search Strings",
    anchor: "typeID2-search-terms",
    bookmark: "typeID2-search-terms",
    indent: 720,
    font13: true,
  },
  {
    label: "Data Availability",
    anchor: "typeID2-data-availability",
    bookmark: "typeID2-data-availability",
    indent: 720,
    font13: true,
  },
  {
    label: "Appendix",
    anchor: "typeID2-appendix",
    bookmark: "typeID2-appendix",
    isBold: true,
  },
  {
    label: "Databases",
    anchor: "typeID2-databases",
    bookmark: "typeID2-databases",
    indent: 720,
    font13: true,
  },
  {
    label: "Disclaimer",
    anchor: "typeID2-disclaimer",
    bookmark: "typeID2-disclaimer",
    isBold: true,
  },
];

export const createRelatedReferencesTable = (relatedReferences = []) => {
  const headers = [
    "S. No",
    "Publication Number",
    "Title",
    "Assignee / Inventor",
    "Priority Date",
    "Publication Date",
    "Family Members",
  ];

  const headerRow = new TableRow({
    children: headers.map(
      (header) =>
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
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
  });

  const createLink = (url, text) =>
    new ExternalHyperlink({
      link: url,
      children: [
        new TextRun({
          text: text || url,
          style: "Hyperlink", 
        }),
      ],
    });
  const createNplRow = (item, index) =>
    new TableRow({
      children: [
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          borders: commonBorders,
          children: [
            createParagraph(`${index + 1}.`, {
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              indent: { left: 50 },
            }),
          ],
        }),
        new TableCell({
          columnSpan: 2,
          borders: commonBorders,
          verticalAlign: VerticalAlign.CENTER,
          children: [
            item.relatedPublicationUrl
              ? createParagraph(
                  [
                    createLink(
                      item.relatedPublicationUrl,
                      item.publicationNumber
                    ),
                  ],
                  {
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 100, after: 100 },
                    indent: { left: 50 },
                  }
                )
              : createParagraph(item.publicationNumber || "", {
                  alignment: AlignmentType.LEFT,
                  spacing: { before: 100, after: 100 },
                  indent: { left: 50 },
                }),
          ],
        }),
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          borders: commonBorders,
          children: [
            createParagraph(item.relatedAssignee?.join(", ") || "", {
              alignment: AlignmentType.LEFT,
              spacing: { before: 100, after: 100 },
              indent: { left: 50 },
            }),
          ],
        }),
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          borders: commonBorders,
          columnSpan: 3,
          children: [
            createParagraph(item.relatedPublicationDate || "", {
              alignment: AlignmentType.CENTER,
              spacing: { before: 100, after: 100 },
              indent: { left: 50 },
            }),
          ],
        }),
      ],
    });

  const createReferenceRow = (pub, index) =>
    new TableRow({
      children: [
        createCellCentered(index + 1, 5),
        createCellWithLink(
          pub.relatedPublicationUrl,
          pub.publicationNumber,
          15
        ),
        createCellText(toTitleCase(pub.relatedTitle), 20),
        createCellText(
          (
            pub.relatedAssignee?.map(formatAssigneeOrInventor) ||
            pub.relatedInventor?.map(formatAssigneeOrInventor) ||
            []
          )
            .filter((value, idx, self) => value && self.indexOf(value) === idx)
            .join("; ") || "N/A",
          20
        ),
        createCellText(pub.relatedPriorityDate || "N/A", 10),
        createCellText(pub.relatedPublicationDate || "N/A", 10),
        createCellFamily(pub),
      ],
    });

  const dataRows = relatedReferences.map((item, idx) =>
    item.nplId ? createNplRow(item, idx) : createReferenceRow(item, idx)
  );

  const tocRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 6,
        borders: borderNone,
        children: [new Paragraph("")],
      }),
      new TableCell({
        borders: commonBorders,
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            spacing: { after: 30 },
            alignment: AlignmentType.CENTER,
            children: [
              new InternalHyperlink({
                anchor: "back-to-table-of-content",
                children: [
                  createTextRun("Back to Table of Contents", textStyle.arial8, {
                    color: "0000FF",
                    underline: { type: UnderlineType.SINGLE },
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...dataRows, tocRow],
  });
};






const createCellCentered = (text, width) =>
  new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        spacing: { before: 20, after: 0 },
        alignment: AlignmentType.CENTER,
        children: [createTextRun(String(text), textStyle.arial10)],
      }),
    ],
    borders: commonBorders,
  });

const createCellWithLink = (url, number, width) =>
  new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 20, after: 0 },
        indent: { left: 50 },
        children: [
          new ExternalHyperlink({
            link: url,
            children: [
              createTextRun(
                sanitizeText((number || "").toUpperCase()),
                textStyle.arial10BoldBlue,
                { underline: true }
              ),
            ],
          }),
        ],
      }),
    ],
    borders: commonBorders,
  });

const createCellText = (text, width) =>
  new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: margins150.margins,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 20, after: 0 },
        children: [createTextRun(text, textStyle.arial10)],
      }),
    ],
    borders: commonBorders,
  });

const createCellFamily = (pub) =>
  new TableCell({
    width: { size: 20, type: WidthType.PERCENTAGE },
    verticalAlign: VerticalAlign.CENTER,
    margins: margins150.margins,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 20, after: 0 },
        children: getFamilyMembersParagraphChildren({
          FamilyMembers: pub.relatedFamilyMembers,
          hyperLink: pub.relatedPublicationUrl,
        }),
      }),
    ],
    borders: commonBorders,
  });

export const createTickedParagraphs = (input) => {
  let normalized = "";

  if (Array.isArray(input)) {
    normalized = input.join(", ");
  } else if (typeof input === "string") {
    normalized = input;
  } else {
    return [];
  }

  normalized = normalized.replace(/\n/g, ",");

  let items = normalized
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  if (items.length > 1) {
    const last = items[items.length - 1].toLowerCase();
    if (last === "etc" || last === "etc.") {
      const secondLast = items[items.length - 2];
      items = items.slice(0, -2).concat(`${secondLast}, etc.`);
    }
  }

  return items.map(
    (item) =>
      new Paragraph({
        indent: { left: 880 },
        spacing: { after: 0 },
        children: [createTextRun(`✓ ${item}`, textStyle.arial10)],
      })
  );
};


export function createExecutiveSummaryTable({ data, dynamicHeadings }) {
  const columnHeaders = ["S. No", "Patents Literatures", ...dynamicHeadings];

  const headerRow = new TableRow({
    children: columnHeaders.map(
      (header, index) =>
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
          borders: commonBorders,
        })
    ),
  });

  const dataRows = data.map((item, index) => {
    const rowChildren = [];

    // S. No.
    rowChildren.push(
      new TableCell({
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            text: String(index + 1),
            alignment: AlignmentType.CENTER,
          }),
        ],
        borders: commonBorders,
      })
    );

    // Patents Literatures (with optional hyperlink)
    rowChildren.push(
      new TableCell({
        verticalAlign: VerticalAlign.CENTER,
        children: [
          new Paragraph({
            alignment: AlignmentType.START,
            spacing: { before: 10, after: 10 },
            indent: { left: 50 },
            children: item.publicationUrl
              ? [
                  new ExternalHyperlink({
                    children: [
                      createTextRun(item.patentNumber, textStyle.arial10, {
                        color: "0000FF",
                        underline: {},
                      }),
                    ],
                    link: item.publicationUrl,
                  }),
                ]
              : [createTextRun(item.patentNumber, textStyle.arial10)],
          }),
        ],
        borders: commonBorders,
      })
    );

    // Dynamic Heading Fields
    dynamicHeadings.forEach((key) => {
      rowChildren.push(
        new TableCell({
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 10, after: 10 },
              indent: { left: 50 },
              children: [createTextRun(item[key] || "", textStyle.arial10)],
            }),
          ],
          borders: commonBorders,
        })
      );
    });

    return new TableRow({ children: rowChildren });
  });

  return new Table({
    width: { size: 93, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    rows: [headerRow, ...dataRows],
  });
}

const summaryTexts = [
  "The patent literatures identified through quick search disclose the features defined in the objective as summarized in the above table.",
  "The shortlisted prior arts disclose a volatile composition dispenser/air freshener housing has a removable bottom portion with protrusion and replaceable cartridge.",
  "The shortlisted prior arts does not specifically disclose 5mm of protrusion on the exterior wall of the cartridges.",
];

export const createExecutiveSummaryParagraphs = () => {
  return summaryTexts.map(
    (text) =>
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 100, after: 100 },
        indent: indent380,
        children: [createTextRun(text)],
      })
  );
};

export const createTocTable = (tocItems = []) => {
  return new Table({
    width: { size: 95, type: "pct" },
    alignment: AlignmentType.CENTER,
    indent: { size: 0, type: "dxa" },
    borders: borderNone,
    rows: tocItems.map(
      (item) =>
        new TableRow({
          children: [
            // Left cell: clickable label
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
                    new InternalHyperlink({
                      anchor: item.anchor,
                      children: [
                        createTextRun(item.label, textStyle.arial10, {
                          bold: item.isBold || false,
                          size: item.font13 ? 26 : 22,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
              borders: borderNone,
            }),

            // Right cell: dynamic page number from bookmark
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
                    new SimpleField({
                      instruction: `PAGEREF ${item.bookmark} \\h`,
                    }),
                  ],
                }),
              ],
              borders: borderNone,
            }),
          ],
        })
    ),
  });
};

export const createRelevantReferencesTable = (
  relevantReferences = [],
  anchorPrefix = "typeId1"
) => {
  return new Table({
    width: { size: 50, type: "pct" },
    alignment: AlignmentType.CENTER,
    borders: blackBorders,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: AlignmentType.CENTER,
            shading: { fill: "A7C7E7" },
            borders: blackBorders,
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
        children: [
          new TableCell({
            verticalAlign: AlignmentType.CENTER,
            columnSpan: 2,
            borders: blackBorders,
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
      ...relevantReferences.map(
        (ref, index) =>
          new TableRow({
            children: [
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                borders: blackBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 50 },
                    children: [
                      new InternalHyperlink({
                        anchor: `${anchorPrefix}-${index + 1}`,
                        children: [
                          createTextRun(`Reference ${index + 1}`, {
                            color: "0000FF",
                            underline: true,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableCell({
                verticalAlign: AlignmentType.CENTER,
                borders: blackBorders,
                children: [
                  new Paragraph({
                    alignment: AlignmentType.START,
                    spacing: { before: 50 },
                    indent: { left: 100 },
                    children: [
                      new ExternalHyperlink({
                        link: ref.publicationUrl,
                        children: [
                          createTextRun(ref.patentNumber, {
                            color: "0000FF",
                            underline: true,
                          }),
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
};

export const generateBibliographicSection = ({
  pub,
  isNpl,
  typeId2,
  leftTableRows,
  rightTableRows,
  createSingleColumnTableRows,
}) => {
  const headerShading = {
    fill: "A7C7E7",
    type: ShadingType.CLEAR,
    color: "auto",
  };

  const headerRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        verticalAlign: VerticalAlign.CENTER,
        shading: headerShading,
        borders: commonBorders,
        margins: marginsStyle.margins,
        children: [
          createParagraph("Bibliographic Details", {
            alignment: AlignmentType.CENTER,
            textStyleOverride: { ...textStyle.arial10, bold: true },
            spacing: { before: 0, after: 0 },
          }),
        ],
      }),
    ],
  });








// Utility to normalize assignee values
function normalizeToArray(value) {
  if (!value) return [];
  if (Array.isArray(value)) {
    if (value.length === 1 && /[,;]/.test(value[0])) {
      return value[0].split(/[,;]+/).map(v => v.trim()).filter(Boolean);
    }
    return value.map(v => String(v).trim()).filter(Boolean);
  }
  return String(value).split(/[,;]+/).map(v => v.trim()).filter(Boolean);
}




const assignees = normalizeToArray(pub?.assignee);
const displayLimit = 5;

const displayedAssignees = assignees.slice(0, displayLimit);
const remainingAssigneesCount = assignees.length - displayLimit;

const assigneeChildren = [];

displayedAssignees.forEach((a, index) => {
  assigneeChildren.push(
    new ExternalHyperlink({
      link: pub.publicationUrl,
      children: [createTextRun(capitalizeEachWord(a), textStyle.arial10)],
    })
  );
  if (index < displayedAssignees.length - 1) {
    assigneeChildren.push(createTextRun("; ", textStyle.arial10));
  }
});

if (remainingAssigneesCount > 0) {
  assigneeChildren.push(
    new ExternalHyperlink({
      link: pub.publicationUrl,
      children: [
        createTextRun(` +${remainingAssigneesCount} more`, {
          ...textStyle.arial10,
          color: "0000FF",
          underline: {},
        }),
      ],
    })
  );
}




  const bodyRows = isNpl
    ? [
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: commonBorders.top,
                left: commonBorders.left,
                right: commonBorders.right,
                bottom: {
                  style: BorderStyle.NONE,
                  size: 0,
                  color: "FFFFFF",
                },
              },
              // margins: marginsStyle.margins,
              children: [
                new Paragraph({
                  indent: { left: 50 },
                  children: [
                    createTextRun("Title – ", textStyle.arial10, {
                      bold: true,
                    }),
                    new ExternalHyperlink({
                      link: pub.publicationUrl,
                      children: [
                        createTextRun(
                          capitalizeEachWord(pub.patentNumber),
                          textStyle.arial10,
                          { color: "0000FF" }
                        ),
                      ],
                    }),
                  ],
                  spacing: { before: 50 },
                }),
              ],
            }),
          ],
        }),

        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                left: commonBorders.left,
                right: commonBorders.right,
                bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              children: [
                new Paragraph({
                  indent: { left: 50 },
                  children: [
                    createTextRun("Source / Assignee(s) – ", textStyle.arial10, {
                      bold: true,
                    }),
                    ...assigneeChildren,
                  ],
                }),
              ],
            }),
          ],
        }),

        // new TableRow({
        //   children: [
        //     new TableCell({
        //       borders: {
        //         top: {
        //           style: BorderStyle.NONE,
        //           size: 0,
        //           color: "FFFFFF",
        //         },
        //         left: commonBorders.left,
        //         right: commonBorders.right,
        //         bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        //       },
        //       // margins: marginsStyle.margins,
        //       children: [
        //         new Paragraph({
        //           indent: { left: 50 },
        //           children: [
        //             createTextRun("Source/Assignee(s) – ", textStyle.arial10, {
        //               bold: true,
        //             }),
        //             new ExternalHyperlink({
        //               link: pub.publicationUrl,
        //               children: [
        //                 createTextRun(
        //                   capitalizeEachWord(pub?.assignee),
        //                   textStyle.arial10
        //                 ),
        //               ],
        //             }),
        //           ],
        //         }),
        //       ],
        //     }),
        //   ],
        // }),
        new TableRow({
          children: [
            new TableCell({
              borders: {
                top: { style: BorderStyle.NONE, size: 2, color: "FFFFFF" },
                left: commonBorders.left,
                right: commonBorders.right,
                bottom: commonBorders.bottom,
              },
              // margins: marginsStyle.margins,
              children: [
                new Paragraph({
                  indent: { left: 50 },
                  children: [
                    createTextRun("Publication Date – ", textStyle.arial10, {
                      bold: true,
                    }),
                    new ExternalHyperlink({
                      link: pub.publicationUrl,
                      children: [
                        createTextRun(
                          pub?.filingDate || "N/A",
                          textStyle.arial10
                        ),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]
    : [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 50, type: "pct" },
              borders: commonBorders,
              // margins: marginsStyle.margins,
              children: [
                new Table({
                  width: { size: 100, type: "pct" },
                  rows: createSingleColumnTableRows(leftTableRows),
                }),
              ],
            }),
            new TableCell({
              width: { size: 50, type: "pct" },
              borders: commonBorders,
              // margins: marginsStyle.margins,
              children: [
                new Table({
                  width: { size: 100, type: "pct" },
                  rows: createSingleColumnTableRows(rightTableRows),
                }),
              ],
            }),
          ],
        }),
      ];

  // Alayst COmments
  function createLabelledParagraphs(label, value, defaultText, textStyle) {
    const lines = Array.isArray(value)
      ? value.flatMap((v) => v.split("\n"))
      : typeof value === "string"
      ? value.split("\n")
      : [];

    if (lines.length && lines.some((line) => line.trim() !== "")) {
      return lines.map(
        (line, index) =>
          new Paragraph({
            spacing: { before: 0, after: 0 },
            alignment: AlignmentType.LEFT,
            children: [
              ...(index === 0
                ? [createTextRun(`${label} `, textStyle, { bold: true })]
                : []),
              new TextRun({
                text: sanitizeText(line),
                preserveLeadingSpaces: true,
                preserveTrailingSpaces: true,
                ...textStyle,
              }),
            ],
          })
      );
    } else {
      return [
        new Paragraph({
          spacing: { before: 0, after: 0 },
          alignment: AlignmentType.LEFT,
          children: [
            createTextRun(`${label} `, textStyle, { bold: true }),
            createTextRun(defaultText, textStyle, { color: "FF0000" }),
          ],
        }),
      ];
    }
  }

  const analystCommentsRow = new Table({
    width: { size: 100, type: "pct" },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            borders: commonBorders,
            margins: marginsStyle.margins,
            children: [
              ...createLabelledParagraphs(
                "Analyst Comments –",
                pub.analystComments,
                "*No analyst comments provided",
                textStyle.arial10
              ),
            ],
          }),
        ],
      }),
    ],
  });

  const relevantExcerptsRow = new Table({
    width: { size: 100, type: "pct" },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            shading: headerShading,
            borders: commonBorders,
            margins: marginsStyle.margins,
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { before: 0, after: 0 },
                children: [
                  createTextRun("Relevant Excerpts ", textStyle.arial10, {
                    bold: true,
                  }),
                  !typeId2 &&
                    createTextRun(
                      "[Translate Text from Description]",
                      textStyle.arial10,
                      {
                        italics: true,
                        bold: true,
                      }
                    ),
                ].filter(Boolean),
              }),
            ],
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            borders: commonBorders,
            margins: marginsStyle.margins,
            children: [
              Array.isArray(pub.relevantExcerpts) && pub.relevantExcerpts.length
                ? pub.relevantExcerpts.flatMap((excerpt) =>
                    String(excerpt || "")
                      .split("\n")
                      .map((line) =>
                        createParagraph(
                          new TextRun({
                            text: sanitizeText(line),
                            preserveLeadingSpaces: true,
                            preserveTrailingSpaces: true,
                          }),
                          {
                            alignment: AlignmentType.LEFT,
                            spacing: { before: 0, after: 0 },
                            textStyleOverride: {
                              ...textStyle.arial10,
                              color: "000000",
                            },
                          }
                        )
                      )
                  )
                : typeof pub.relevantExcerpts === "string" &&
                  pub.relevantExcerpts.trim()
                ? pub.relevantExcerpts.split("\n").map((line) =>
                    createParagraph(
                      new TextRun({
                        text: sanitizeText(line),
                        preserveLeadingSpaces: true,
                        preserveTrailingSpaces: true,
                      }),
                      {
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 0, after: 0 },
                        textStyleOverride: {
                          ...textStyle.arial10,
                          color: "000000",
                        },
                      }
                    )
                  )
                : [
                    createParagraph(
                      "*Abstract is not available, please fill it yourself",
                      {
                        alignment: AlignmentType.LEFT,
                        spacing: { before: 0, after: 0 },
                        textStyleOverride: {
                          ...textStyle.arial10,
                          color: "FF0000",
                        },
                      }
                    ),
                  ],
            ].flat(),
          }),
        ],
      }),
    ],
  });

  return [
    new Table({
      width: { size: 100, type: "pct" },
      rows: [headerRow, ...bodyRows],
    }),
    analystCommentsRow,
    relevantExcerptsRow,
    new Paragraph({ text: "", spacing: { before: 0, after: 400 } }),
  ];
};

export const createTwoColumnTickTable = ({
  leftTitle,
  rightTitle,
  leftData,
  rightData,
  indentLeft = 880,
  spacingAfter = 20,
  textStyle: runStyle = textStyle.arial10,
}) => {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE,
    },
    borders: {
      ...borderNone,
      insideHorizontal: { style: BorderStyle.NONE },
      insideVertical: { style: BorderStyle.NONE },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            verticalAlign: AlignmentType.CENTER,
            borders: borderNone,
            children: [
              new Paragraph({
                spacing: { after: spacingAfter },
                indent: { left: indentLeft },
                children: [createTextRun(leftTitle, runStyle, { bold: true })],
              }),
              ...createTickedParagraphs(leftData),
            ],
          }),
          new TableCell({
            verticalAlign: AlignmentType.CENTER,
            borders: borderNone,
            children: [
              new Paragraph({
                spacing: { after: spacingAfter },
                indent: { left: indentLeft },
                children: [createTextRun(rightTitle, runStyle, { bold: true })],
              }),
              ...createTickedParagraphs(rightData),
            ],
          }),
        ],
      }),
    ],
  });
};

// ------------------------------- Appendix 1---------------------------------------------
// ============ Helper Generators ============

const createHeading = (
  text,
  level = HeadingLevel.HEADING_1,
  indent = 600,
  bookmarkId = null
) => {
  const content = bookmarkId
    ? [
        new Bookmark({
          id: bookmarkId,
          children: [
            createTextRun(text, textStyle.arial14, {
              bold: true,
              color: "000000",
            }),
          ],
        }),
      ]
    : [createTextRun(text, textStyle.arial14, { bold: true, color: "000000" })];

  return new Paragraph({
    children: content,
    heading: level,
    alignment: AlignmentType.START,
    spacing: { after: 50 },
    indent: { left: indent },
  });
};

const createSubheading = (
  text,
  bookmarkId = null,
  indent = 720,
  spacing = { before: 50, after: 20 }
) => {
  const applyHeading =
    bookmarkId === "typeID2-search-terms" ||
    bookmarkId === "typeID2-data-availability";

  return new Paragraph({
    children: [
      new Bookmark({
        id: bookmarkId,
        children: [
          createTextRun(text, textStyle.arial11, {
            bold: true,
            color: "000000",
          }),
        ],
      }),
    ],
    ...(applyHeading && { heading: HeadingLevel.HEADING_2 }),
    alignment: AlignmentType.START,
    spacing,
    indent: { left: indent },
  });
};

const createBulletParagraph = (text, indent = 880) =>
  new Paragraph({
    children: [createTextRun(`●    ${text}`, textStyle.arial10)],
    alignment: AlignmentType.START,
    spacing: { before: 20, after: 20 },
    indent: { left: indent },
  });

const createDataAvailableParagraph = (text, indent = 720) =>
  new Paragraph({
    children: [createTextRun(`✓ ${text.trim()}`, textStyle.arial10)],
    alignment: AlignmentType.START,
    spacing: { after: 50 },
    indent: { left: indent },
  });

const createHyperlinkBackToTOC = () =>
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
  });

// ============ Table Generator ============

const createSearchStringsTable = (flatFormated = []) => {
  if (!flatFormated || flatFormated.length === 0) return null;

  const headerRow = new TableRow({
    children: [
      "S. No.",
      "Key Strings (Orbit, Google Patents, Espacenet, etc.)",
      "Database",
      "Hits",
    ].map(
      (text, i) =>
        new TableCell({
          borders: commonBorders,
          width: [{ size: 5 }, { size: 70 }, { size: 15 }, { size: 10 }][i],
          verticalAlign: VerticalAlign.CENTER,
          shading: { fill: "353839" },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              spacing: { before: 30, after: 30 },
              children: [
                createTextRun(text, textStyle.arial10, {
                  bold: true,
                  color: "FFFFFF",
                }),
              ],
            }),
          ],
        })
    ),
  });

  let globalIndex = 1;

  const dataRows = flatFormated.map((item) => {
    const row = new TableRow({
      children: [
        // S. No.
        new TableCell({
          borders: commonBorders,
          width: { size: 5, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [createTextRun(`${globalIndex}.`, textStyle.arial10)],
            }),
          ],
        }),
        new TableCell({
          borders: commonBorders,
          width: { size: 70, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              spacing: { before: 20, after: 20 },
              indent: { left: 80 },
              children: [createTextRun(item.keyString, textStyle.arial10)],
            }),
          ],
        }),
        new TableCell({
          borders: commonBorders,
          width: { size: 15, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [createTextRun(item.databaseName, textStyle.arial10)],
              spacing: { after: 0 },
            }),
          ],
        }),
        new TableCell({
          borders: commonBorders,
          width: { size: 10, type: WidthType.PERCENTAGE },
          verticalAlign: VerticalAlign.CENTER,
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [createTextRun(`${item.hitCount}`, textStyle.arial10)],
              spacing: { after: 0 },
            }),
          ],
        }),
      ],
    });

    globalIndex++;
    return row;
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: commonBorders,
    rows: [headerRow, ...dataRows],
  });
};

// ============ Assembling Appendix 1 Dynamically ============

export const buildAppendix1 = ({ typeId1, typeId2, appendix1 }) => {
  const flatFormated = appendix1?.keyStrings
    .slice(1)
    .flatMap((fm) => fm.keyStrings);
  const appendixChildren = [];

  // Heading
  appendixChildren.push(
    createHeading(
      typeId2 ? "Appendix 2" : typeId1 ? "Appendix 1" : "",
      HeadingLevel.HEADING_1,
      600,
      typeId2 ? "typeID2-appendix2" : "typeID1-appendix1"
    )
  );

  // Search Terms
  appendixChildren.push(
    createSubheading(
      "Search Terms & Search Strings",
      "typeID2-search-terms",
      920,
      { after: 30 }
    )
  );
  appendixChildren.push(
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
    })
  );

  // Base Search Terms
  appendixChildren.push(
    createSubheading("Base Search Terms", null, 720, { before: 50, after: 20 })
  );
  appendixChildren.push(
    ...(appendix1?.baseSearchTerms || []).map((term) =>
      createBulletParagraph(`${term.searchTermText} – ${term.relevantWords}`)
    )
  );

  // Key Strings Table
  appendixChildren.push(
    createSubheading("Search Strings", null, 720, { before: 200, after: 20 })
  );
  appendixChildren.push(createSearchStringsTable(flatFormated || []));

  // TOC Link
  appendixChildren.push(createHyperlinkBackToTOC());

  // Data Availability
  appendixChildren.push(
    createSubheading("Data Availability", "typeID2-data-availability", 720, {
      before: 200,
      after: 100,
    })
  );
  appendixChildren.push(
    ...(appendix1?.dataAvailability || []).map((data) =>
      createDataAvailableParagraph(data.dataAvailableText)
    )
  );

  return appendixChildren;
};
