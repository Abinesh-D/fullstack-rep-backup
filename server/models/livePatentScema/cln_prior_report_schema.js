const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const publicationDetailsSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  patentNumber: { type: String, default: "" },
  publicationUrl: { type: String, default: "" },
  title: { type: String, default: "" },
  abstract: { type: String, default: "" },
  filingDate: { type: String, default: "" },
  priorityDate: { type: String, default: "" },
  grantDate: { type: String, default: "" },
  assignee: { type: [String], default: [] },
  inventors: { type: [String], default: [] },
  classifications: { type: [String], default: [] },
  usClassification: { type: [String], default: [] },
  familyMembers: { type: [String], default: [] },
  analystComments: { type: String, default: "" },
  relevantExcerpts: { type: String, default: "" },
});


const nonPatentLiteratureSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  nplTitle: String,
  url: String,
  nplPublicationDate: { type: String, default: "" },
  comments: String,
  excerpts: String
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


const KeyStringsSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  keyStringsText: { type: String, required: false },
}, { _id: false });


const KeyStringsNplSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  keyStringsNplText: { type: String, required: false },
}, { _id: false });

const KeyStringsAdditionalSchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  keyStringsAdditionalText: { type: String, required: false },
}, { _id: false });

const DataAvailabilitySchemaAppendix1 = new Schema({
  _id: { type: String, default: uuidv4 },
  dataAvailableText: { type: String, required: false }
}, { _id: false });

const appendix1Schema = new Schema({
  _id: { type: String, default: uuidv4 },
  baseSearchTerms: { type: [SearchItemSchemaAppendix1], default: [] },
  keyStrings: { type: [KeyStringsSchemaAppendix1], default: [] },
  keyStringsNpl: { type: [KeyStringsNplSchemaAppendix1], default: [] },
  keyStringsAdditional: { type: [KeyStringsAdditionalSchemaAppendix1], default: [] },
  dataAvailability: { type: [DataAvailabilitySchemaAppendix1], default: [] }
});


const ImageSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: false },
  size: { type: Number, required: false },
  formattedSize: { type: String },
  type: { type: String, required: false },
  base64Url: { type: String, required: false },
  uploadedAt: { type: Date, default: Date.now },
  uploader: { type: String },
  public_id: { type: String, required: false },
});


const introductionSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  projectTitle: String,
  projectSubTitle: String,
  searchFeatures: [String],
  projectImageUrl: [ImageSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { _id: false });

const appendix2 = new Schema({
  _id: { type: String, default: uuidv4 },
  patents: { type: String, default: "" },
  nonPatentLiterature: { type: String, default: "" }
});

const fullProjectSchema = new Schema({
  projectName: { type: String, required: false },
  projectType: String,
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
  projectTypeId: { type: String, required: false },

  stages: {
    introduction: [introductionSchema],
    relevantReferences: {
      publicationDetails: { type: [publicationDetailsSchema], default: [] },
      nonPatentLiteratures: { type: [nonPatentLiteratureSchema], default: [] },
      overallSummary: String
    },
    relatedReferences: { type: [relatedReferenceSchema], default: [] },
    appendix1: { type: [appendix1Schema], default: [] },
    appendix2: [appendix2],
  }
}, { collection: "cln_prior_report_schema", timestamps: true });

const cln_prior_report_schema = mongoose.model("cln_prior_report_schema", fullProjectSchema);
module.exports = cln_prior_report_schema;
