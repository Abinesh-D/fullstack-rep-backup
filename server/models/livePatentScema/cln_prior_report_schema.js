const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const publicationDetailsSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  patentNumber: { type: String, default: "" },
  publicationUrl: { type: String, default: "" },
  googlePublicationUrl: { type: String, default: "" },
  title: { type: String, default: "" },
  abstract: { type: String, default: "" },
  filingDate: { type: String, default: "" },
  priorityDate: { type: String, default: "" },
  grantDate: { type: String, default: "" },
  assignee: { type: [String], default: [] },
  inventors: { type: [String], default: [] },
  classifications: { type: [String], default: [] },
  ipcClassifications: { type: [String], default: [] },
  cpcClassifications: { type: [String], default: [] },
  usClassification: { type: [String], default: [] },
  familyMembers: { type: [String], default: [] },
  analystComments: { type: [String], default: [] },
  relevantExcerpts: { type: [String], default: [] },
});

const relevantAndNplCombined = new Schema({
  _id: { type: String, default: uuidv4 },
  nplId: { type: Boolean, default: false },
  patentNumber: { type: String, default: "" },
  publicationUrl: { type: String, default: "" },
  googlePublicationUrl: { type: String, default: "" },
  title: { type: String, default: "" },
  source: { type: String, default: "" },
  abstract: { type: String, default: "" },
  filingDate: { type: String, default: "" },
  priorityDate: { type: String, default: "" },
  grantDate: { type: String, default: "" },
  assignee: { type: [String], default: [] },
  inventors: { type: [String], default: [] },
  classifications: { type: [String], default: [] },
  ipcClassifications: { type: [String], default: [] },
  cpcClassifications: { type: [String], default: [] },
  usClassification: { type: [String], default: [] },
  familyMembers: { type: [String], default: [] },
  analystComments: { type: [String], default: [] },
  relevantExcerpts: { type: [String], default: [] },
});

const relatedAndNplCombined = new Schema({
  _id: { type: String, default: uuidv4 },
  publicationNumber: { type: String, default: "" },
  nplId: { type: Boolean, default: false },
  relatedPublicationUrl: { type: String, default: "" },
  relatedTitle: { type: String, default: "" },
  relatedAssignee: { type: [String], default: [] },
  relatedInventor: { type: [String], default: [] },
  relatedFamilyMembers: { type: [String], default: [] },
  relatedPublicationDate: { type: String, default: "" },
  relatedPriorityDate: { type: String, default: "" },
});

const nonPatentLiteratureSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  nplTitle: String,
  url: String,
  nplPublicationDate: { type: String, default: "" },
  nplPublicationUrl: { type: String, default: "" },
  comments: { type: [String], default: [] },
  excerpts: { type: [String], default: [] },
});

const nplSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  nplTitle: String,
  url: String,
  nplPublicationDate: { type: String, default: "" },
  nplPublicationUrl: { type: String, default: "" },
  comments: { type: [String], default: [] },
  excerpts: { type: [String], default: [] },
});

const relatedReferenceSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  publicationNumber: String,
  relatedPublicationUrl: String,
  relatedTitle: String,
  relatedAssignee: { type: [String], default: [] },
  relatedInventor: { type: [String], default: [] },
  relatedFamilyMembers: { type: [String], default: [] },
  relatedPublicationDate: { type: String, default: "" },
  relatedPriorityDate: { type: String, default: "" },
});

const SearchItemSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  searchTermText: { type: String, required: true },
  relevantWords: { type: String, required: false },
}, { _id: false });

const keyStringSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  keyString: { type: String, required: true },
  hitCount: { type: Number, default: 0 },
  databaseName: { type: String, default: "" },
  parentId: { type: String, default: "" },


});

const databaseSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  dbId: { type: String, required: false, },
  databaseName: { type: String, required: false, },
  keyStrings: [keyStringSchema],
});


const KeyStringsNplSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  keyStringsNplText: { type: String, required: false },
}, { _id: false });

const KeyStringsAdditionalSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  keyStringsAdditionalText: { type: String, required: false },
});

const DataAvailabilitySchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  dataAvailableText: { type: String, required: false }
}, { _id: false });

const appendix1Schema = new Schema({
  baseSearchTerms: { type: [SearchItemSchemaAppendix1], default: [] },
  keyStrings: { type: [databaseSchema], default: [] },
  keyStringsNpl: { type: [KeyStringsNplSchemaAppendix1], default: [] },
  keyStringsAdditional: { type: [KeyStringsAdditionalSchemaAppendix1], default: [] },
  dataAvailability: { type: [DataAvailabilitySchemaAppendix1], default: [] }
});

const introductionSchema = new Schema({
  projectTitle: String,
  projectSubTitle: String,
  projectId: { type: String, default: "" },
  executiveSummaryTotalColumn: { type: Number, default: "" },
  searchFeatures: [String],
  textEditor: { type: [String], default: "" },
}, { _id: false });

const appendix2 = new Schema({
  _id: { type: String, default: uuidv4 },
  patents: { type: [String], default: "" },
  nonPatentLiterature: { type: [String], default: "" }
});

const fullProjectSchema = new Schema({
  projectName: { type: String, required: true },
  projectType: { type: String, required: true },
  projectTypeId: { type: String, required: true },
  createdOn: {
    type: String,
    default: () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      return `${dd}-${mm}-${yyyy}`;
    }
  },
  stages: {
    introduction: [introductionSchema],
    relevantReferences: {
      publicationDetails: { type: [publicationDetailsSchema], default: [] },
      nonPatentLiteratures: { type: [nonPatentLiteratureSchema], default: [] },
      relevantAndNplCombined: { type: [relevantAndNplCombined], default: [] },
      overallSummary: { type: [String], default: [] },
    },
    relatedReferences: {
      publicationDetails: { type: [relatedReferenceSchema], default: [] },
      nonPatentLiteratures: { type: [nplSchema], default: [] },
      relatedAndNplCombined: { type: [relatedAndNplCombined], default: [] },
    },
    appendix1: { type: [appendix1Schema], default: [] },
    appendix2: { type: [appendix2] },
  }
}, { collection: "cln_prior_report_schema", timestamps: true });


const cln_prior_report_schema = mongoose.model("cln_prior_report_schema", fullProjectSchema);
module.exports = cln_prior_report_schema;


  
// const defauktKeyStringsFields = new Schema({
//   keyStringsOrbit: { type: [SingleKeyStringSchema], default: [] },
//   keyStringsGoogle: { type: [SingleKeyStringSchema], default: [] },
//   keyStringsEspacenet: { type: [SingleKeyStringSchema], default: [] },
//   keyStringsUSPTO: { type: [SingleKeyStringSchema], default: [] },
//   keyStringsOthers: { type: [SingleKeyStringSchema], default: [] },
// });




// const ImageSchema = new mongoose.Schema({
//   _id: { type: String, default: uuidv4 },
//   name: { type: String, required: false },
//   size: { type: Number, required: false },
//   formattedSize: { type: String },
//   type: { type: String, required: false },
//   base64Url: { type: String, required: false },
//   uploadedAt: { type: Date, default: Date.now },
//   uploader: { type: String },
//   public_id: { type: String, required: false },
// });


// const introductionSchema = new Schema({
//   // _id: { type: String, default: uuidv4 },
//   projectTitle: String,
//   projectSubTitle: String,
//   projectId: { type: String, default: "" },
//   executiveSummaryTotalColumn: { type: Number, default: "" },
//   searchFeatures: [String],
//   textEditor: { type: [String], default: "" },

//   // projectImageUrl: [ImageSchema],
//   // createdAt: { type: Date, default: Date.now },
//   // updatedAt: { type: Date, default: Date.now },
// }, { _id: false });
