const mongoose = require("mongoose");

const minimalProjectSchema = new mongoose.Schema({
    projectName: { type: String, required: true },
    projectType: { type: String, required: true },
    createdOn: {
        type: String,
        default: () => new Date().toISOString().slice(0, 10)
    }

}, { collection: "cln_project_schema" });

const cln_project_schema = mongoose.model("cln_project_schema", minimalProjectSchema);
module.exports = cln_project_schema;
