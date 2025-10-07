const mongoose = require("mongoose");

const databaseSourceSchema = new mongoose.Schema(
    {
        sources: [
            {
                value: { type: String, required: true },
                label: { type: String, required: true },
                dataBaseFieldName: { type: String, required: true },
            }
        ]
    },
    { collection: "cln_keystrings_database_name" }
);

module.exports = mongoose.model("DatabaseSource", databaseSourceSchema);
