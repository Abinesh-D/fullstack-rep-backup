const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const publicationDetailsSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  patentNumber: { type: String, default: "" },
  publicationUrl: { type: String, default: "" },
  title: { type: String, default: "" },
  filingDate: { type: String, default: "" },
  priorityDate: { type: String, default: "" },
  grantDate: { type: String, default: "" },
  assignee: { type: [String], default: [] },
  inventors: { type: [String], default: [] },
  classifications: { type: [String], default: [] },
  usClassification: { type: [String], default: [] },
  familyMembers: { type: [String], default: [] },
  analystComments: { type: String, default: "" },
  relevantExcerpts: { type: String, default: "" }
});


const nonPatentLiteratureSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  title: String,
  url: String,
  publicationDate: Date,
  comments: String,
  excerpts: String
});

const relatedReferenceSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  publicationNumber: String,
  publicationUrl: String,
  title: String,
  assigneeOrInventor: String,
  familyMembers: [String],
  publicationDate: Date
});

const searchMetadataSchema = new Schema({
  baseSearchTerms: [String],
  keyStrings: [String],
  dataAvailability: [String]
}, { _id: false });

const introductionSchema = new Schema({
  projectTitle: String,
  projectSubTitle: String,
  searchFeatures: String
}, { _id: false });

const summarySchema = new Schema({
  patents: String,
  nonPatentLiterature: String
}, { _id: false });

const fullProjectSchema = new Schema({
  projectName: { type: String, required: true },
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
  stages: {
    introduction: [introductionSchema],
    relevantReferences: {
      publicationDetails: { type: [publicationDetailsSchema], default: [] },
      nonPatentLiteratures: { type: [nonPatentLiteratureSchema], default: [] },
      overallSummary: String
    },
    relatedReferences: { type: [relatedReferenceSchema], default: [] },
    searchMetadata: [searchMetadataSchema],
    summary: [summarySchema]
  }
}, { collection: "cln_prior_report_schema", timestamps: true });

const cln_prior_report_schema = mongoose.model("cln_prior_report_schema", fullProjectSchema);
module.exports = cln_prior_report_schema;
