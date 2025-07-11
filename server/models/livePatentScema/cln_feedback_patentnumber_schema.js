const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
    {
        feedbackPatentNumber: { type: String, required: true },
        submittedBy: { type: String, required: true },
    },
    {
        collection: "cln_feedback_patentnumber_schema",
        timestamps: true,
    }
);

const cln_feedback_patentnumber_schema = mongoose.model("cln_feedback_patentnumber_schema", feedbackSchema);
module.exports = cln_feedback_patentnumber_schema;
