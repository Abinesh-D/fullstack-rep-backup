const express = require("express");
const router = express.Router();
const DatabaseSource = require("../../models/cln_keystrings_database_name");
const cln_prior_report_schema = require("../../models/livePatentScema/cln_prior_report_schema");

// /keystrings/sources - fetch all sources
router.get("/", async (req, res) => {
    try {
        const docs = await DatabaseSource.find();

        const allSources = docs.reduce((acc, doc) => {
            if (doc.sources && Array.isArray(doc.sources)) {
                acc.push(...doc.sources);
            }
            return acc;
        }, []);

        res.json(allSources);
    } catch (err) {
        console.error("Error fetching sources:", err);
        res.status(500).json({ error: err.message });
    }
});


// router.post("/add", async (req, res) => {
//   try {
//     const { value, dataBaseFieldName, projectId } = req.body;

//     if (!value || !projectId) {
//       return res.status(400).json({ message: "value and projectId are required" });
//     }

//     const newSource = {
//       _id: uuidv4(),
//       value,
//       label: value,
//       dataBaseFieldName,
//     };

//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{ keyStrings: [] }];
//     }

//     project.stages.appendix1[0].keyStrings.push(newSource);

//     await project.save();

//     res.status(201).json(project.stages.appendix1[0].keyStrings);
//   } catch (err) {
//     console.error("Error adding source:", err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });




// keystrings/sources/add - add new source
// router.post("/add", async (req, res) => {
//     try {
//         const { value } = req.body;
//         if (!value) {
//             return res.status(400).json({ error: "Value is required" });
//         }

//         const updatedDoc = await DatabaseSource.findOneAndUpdate(
//             {},
//             { $push: { sources: { value, label: value } } },
//             { new: true, upsert: true } 
//         );

//         res.json(updatedDoc);
//     } catch (err) {
//         console.error("Error adding database:", err);
//         res.status(500).json({ error: err.message });
//     }
// });


// POST /keystrings/sources/add
// router.post("/add", async (req, res) => {
//   const { value, projectId } = req.body;

//   try {
//     if (!value || !value.trim()) {
//       return res.status(400).json({ message: "Database name is required" });
//     }

//     let doc = await DatabaseSource.findOne();
//     if (!doc) {
//       doc = new DatabaseSource({
//         sources: [
//           { value: "Orbit", label: "Orbit" },
//           { value: "Google Patents", label: "Google Patents" },
//           { value: "Espacenet", label: "Espacenet" },
//           { value: "USPTO", label: "USPTO" },
//           { value: "Others", label: "Others" },
//         ],
//       });
//     }

//     const exists = doc.sources.some(
//       (s) => s.value.toLowerCase() === value.toLowerCase()
//     );

//     if (!exists) {
//       doc.sources.push({ value, label: value });
//       await doc.save();
//     }

//     const dynamicField = `stages.appendix1.0.keyStrings.${value}`;

//     await cln_prior_report_schema.updateOne(
//       { _id: projectId },
//       { $set: { [dynamicField]: [] } }, 
//       { upsert: true }
//     );

//     res.json(doc.sources);
//   } catch (err) {
//     console.error("Error adding database:", err);
//     res.status(500).json({ message: "Error adding database" });
//   }
// });




module.exports = router;
