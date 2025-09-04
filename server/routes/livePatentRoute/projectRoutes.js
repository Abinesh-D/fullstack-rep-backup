const express = require("express");
const router = express.Router();
const cln_prior_report_schema = require("../../models/livePatentScema/cln_prior_report_schema")
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const xml2js = require("xml2js");



const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/project-creation", async (req, res) => {
  try {
    const newProject = new cln_prior_report_schema(req.body);
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const projects = await cln_prior_report_schema.find().sort({ createdAt: -1 }).lean(); 
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updated = await cln_prior_report_schema.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.delete("/:id", async (req, res) => {
  try {
    const deleted = await cln_prior_report_schema.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json({
      message: "Project deleted successfully",
      deleted
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





// Fetch Single Report Doc _id
router.get("/single-report/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await cln_prior_report_schema.findById(id).lean(); 

    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(" Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Fetch Intro Data
router.get("/get-introduction/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await cln_prior_report_schema.findById(id, {
      "stages.introduction": 1,
      _id: 0
    });

    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    const introduction = project.stages?.introduction;

    if (!introduction || Object.keys(introduction).length === 0) {
      return res.status(200).json({ message: "No introduction data found", introduction: null });
    }

    res.status(200).json(introduction);
  } catch (error) {
    console.error(" Error retrieving introduction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Update IntroData

router.post("/update-introduction/:id", async (req, res) => {
  const { id } = req.params;
  const { projectTitle, projectSubTitle, searchFeatures, projectId, executiveSummaryTotalColumn, textEditor } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      {
        $set: {
          "stages.introduction": [{
            projectTitle,
            projectSubTitle,
            projectId,
            executiveSummaryTotalColumn,
            searchFeatures,
            textEditor,
          }],
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }

    res.status(200).json({
      message: "Introduction updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error(" Error updating introduction:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// router.post("/update-introduction/:id", upload.array("images"), async (req, res) => {
//   const { id } = req.params;
//   const { projectTitle, projectSubTitle, searchFeatures } = req.body;

//   try {
//     let uploadedImages = [];

//     if (req.files && req.files.length > 0) {
//       for (const file of req.files) {
//         const result = await new Promise((resolve, reject) => {
//           const stream = cloudinary.uploader.upload_stream(
//             { folder: "project_images" },
//             (error, result) => {
//               if (result) resolve(result);
//               else reject(error);
//             }
//           );
//           streamifier.createReadStream(file.buffer).pipe(stream);
//         });

//         uploadedImages.push({
//           _id: uuidv4(),
//           name: file.originalname,
//           size: file.size,
//           formattedSize: `${(file.size / 1024).toFixed(2)} KB`,
//           type: file.mimetype,
//           base64Url: result.secure_url,
//           public_id: result.public_id,
//           uploadedAt: new Date(),
//         });
//       }
//     }

//     const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
//       id,
//       {
//         $push: {
//           //  "stages.introduction.0.projectImageUrl": { $each: uploadedImages },
        // "stages.introduction.0.projectTitle": projectTitle,
        // "stages.introduction.0.projectSubTitle": projectSubTitle,
        // "stages.introduction.0.searchFeatures": searchFeatures,
//         }
//       },
//       { new: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     res.status(200).json({
//       message: "Introduction updated successfully",
//       data: updatedProject,
//     });
//   } catch (err) {
//     console.error(" Error updating introduction:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// Relevant submit 

router.post("/add-relevant-data/:id", async (req, res) => {
  const { id } = req.params;
  const relevantFormData = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { $push: { "stages.relevantReferences.publicationDetails": relevantFormData } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(" Error adding publication detail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Save Relevant and Npl Combined
router.post("/add-relevantandnpl-data/:id", async (req, res) => {
  const { id } = req.params;
  const { tableData } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { "stages.relevantReferences.relevantAndNplCombined": tableData },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(" Error updating tableData:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Save Related and Npl Combined
  router.post("/add-relatedandnpl-data/:id", async (req, res) => {
    const { id } = req.params;
    const { tableData } = req.body;
    try {
      const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
        id,
        { $push: { "stages.relatedReferences.relatedAndNplCombined": { $each: tableData } } },
        { new: true, runValidators: true }
      );


      if (!updatedProject) {
        return res.status(404).json({ message: " Project not found" });
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error(" Error updating tableData:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

// GET Publication Details for a Project
router.get("/publication-details/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await cln_prior_report_schema.findById(id, {
      "stages.relevantReferences.publicationDetails": 1,
      _id: 0
    });

    if (!project) {
      console.warn(`⚠️ No project found with ID: ${id}`);
      return res.status(404).json({ message: " Project not found" });
    }

    const publicationDetails = project?.stages?.relevantReferences?.publicationDetails || [];

    res.status(200).json({
      success: true,
      count: publicationDetails.length,
      publicationDetails
    });
  } catch (error) {
    console.error(" Error fetching publication details:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching publication details",
      error: error.message
    });
  }
});




// Delete Publication Detail
router.delete("/delete-publication/:documentId/:publicationId", async (req, res) => {
  const { documentId, publicationId } = req.params;

  try {
    const updatedDoc = await cln_prior_report_schema.findByIdAndUpdate(
      documentId,
      {
        $pull: {
          "stages.relevantReferences.publicationDetails": { _id: publicationId }
        }
      },
      { new: true }
    );

    if (!updatedDoc) {
      return res.status(404).json({ message: " Document not found" });
    }

    res.status(200).json({
      message: "Publication detail deleted successfully",
      publicationDetails: updatedDoc.stages.relevantReferences.publicationDetails
    });
  } catch (error) {
    console.error(" Error deleting publication detail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Non - Patent Literatures
router.post("/add-npl/:id", async (req, res) => {
  const { id } = req.params;
  const { nplData, relatedSubmit } = req.body;

  const targetArray = relatedSubmit ? "stages.relatedReferences.nonPatentLiteratures" : "stages.relevantReferences.nonPatentLiteratures";

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { $push: { [targetArray]: nplData } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    const updProject = relatedSubmit
      ? updatedProject.stages.relatedReferences.nonPatentLiteratures
      : updatedProject.stages.relevantReferences.nonPatentLiteratures;

    res.status(200).json({
      updProject,
      type: relatedSubmit ? "relatedTrue" : undefined,
    });
  } catch (error) {
    console.error("Error adding NPL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Delete Non - Patent
router.delete("/delete-npl/:projectId/:nplId", async (req, res) => {
  const { projectId, nplId } = req.params;
  const { relatedDelete } = req.body;

  const commonPath = relatedDelete ? "stages.relatedReferences.nonPatentLiteratures" : "stages.relevantReferences.nonPatentLiteratures";

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          [commonPath]: { _id: nplId }
        }
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }

    const deletedNpls = relatedDelete
      ? updatedProject.stages.relatedReferences.nonPatentLiteratures
      : updatedProject.stages.relevantReferences.nonPatentLiteratures;

    res.status(200).json({ deletedNpls, type: relatedDelete ? "relatedTrue" : undefined });
  } catch (error) {
    console.error(" Error deleting NPL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Overall summary
router.post("/update-overall-summary/:id", async (req, res) => {
  const { id } = req.params;
  const { overallSummary } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { "stages.relevantReferences.overallSummary": overallSummary },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(" Error updating Overall Summary:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Related Ref Data Save
router.post("/add-related/:id", async (req, res) => {
  const { id } = req.params;
  const relatedData = req.body; 

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { $push: { "stages.relatedReferences.publicationDetails": relatedData } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(" Error adding related reference:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Fetch Related Ref
router.get("/get-related/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await cln_prior_report_schema.findById(id);
    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    const relatedReferences = project.stages.relatedReferences.publicationDetails;
    res.status(200).json(relatedReferences);
  } catch (error) {
    console.error(" Error fetching related references:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Delete Reladed Ref
router.delete("/delete-related/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { relatedIds } = req.body;

  try {
    let idsToDelete = [];

    if (Array.isArray(relatedIds)) {
      idsToDelete = relatedIds;
    } else if (typeof relatedIds === "string") {
      idsToDelete = [relatedIds];
    }

    if (idsToDelete.length === 0) {
      return res.status(400).json({ message: "No relatedIds provided" });
    }

    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      projectId,
      { $pull: { "stages.relatedReferences.publicationDetails": { _id: { $in: idsToDelete } } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("Error deleting related reference(s):", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// router.delete("/delete-related/:projectId/:relatedId", async (req, res) => {
//   const { projectId, relatedId } = req.params;

//   try {
//     const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
//       projectId,
//       { $pull: { "stages.relatedReferences": { _id: relatedId } } },
//       { new: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     res.status(200).json(updatedProject);
//   } catch (error) {
//     console.error(" Error deleting related reference:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }

// });


// Save api Keywords List
router.post("/add-keywordslist-term/:id", async (req, res) => {
    const projectId = req.params.id;
    const { searchTermText } = req.body;

    if (!searchTermText || !searchTermText.baseSearchTerm ) {
        return res.status(400).json({ message: "BaseSearchTerm and RelevantWords are required." });
    }

    try {
        const newSearchItem = {
            _id: uuidv4(),
            searchTermText: searchTermText.baseSearchTerm,
            relevantWords: searchTermText.relevantWords,
        };

        const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
            projectId,
            {
                $push: {
                    "stages.appendix1.0.baseSearchTerms": newSearchItem,
                },
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("❌ Error adding base search term:", error);
        res.status(500).json({ message: "Server error while saving base search term." });
    }
});


// Delete relevantWord Api
router.delete("/delete-keywordslist-term/:id/:keywordId", async (req, res) => {
    const projectId = req.params.id;
    const keywordId = req.params.keywordId; 

    if (!keywordId) {
        return res.status(400).json({ message: "Keyword _id is required." });
    }

    try {
        const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
            projectId,
            {
                $pull: {
                    "stages.appendix1.0.baseSearchTerms": { _id: keywordId }
                }
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found." });
        }

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("❌ Error deleting keyword:", error);
        res.status(500).json({ message: "Server error while deleting keyword." });
    }
});



// Add Base Search Term to appendix1
router.post("/add-base-search-term/:id", async (req, res) => {
  const { id } = req.params;
  const { searchTermText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    if (project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({
        _id: uuidv4(),
        baseSearchTerms: [],
      });
    }

    project.stages.appendix1[0].baseSearchTerms.push({
      _id: uuidv4(),
      searchTermText
    });

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(" Error adding Base Search Term:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Delete BaseSearch Term 
router.delete("/delete-base-search-term/:id/:termId", async (req, res) => {
  const { id, termId } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: id },
      { $pull: { "stages.appendix1.0.baseSearchTerms": { _id: termId } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(" Error deleting Base Search Term:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// router.post("/appendix1/keystring/:projectId", async (req, res) => {
//   const { projectId } = req.params;
//   const { value, fieldName } = req.body;

//   const fieldMap = {
//     Orbit: "keyStringsOrbit",
//     "Google Patents": "keyStringsGoogle",
//     Espacenet: "keyStringsEspacenet",
//     USPTO: "keyStringsUSPTO",
//     Others: "keyStringsOthers",
//   };
//   try {

//     if (!value || !fieldName) {
//       return res.status(400).json({ message: "Value and fieldName are required" });
//     }

//     const keyField = fieldMap[fieldName];
//     if (!keyField) {
//       return res.status(400).json({ message: "Invalid fieldName" });
//     }

//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{}];
//     }

//     const appendix1 = project.stages.appendix1[0];

//     if (!appendix1.keyStrings || appendix1.keyStrings.length === 0) {
//       appendix1.keyStrings = [
//         {
//           keyStringsOrbit: [],
//           keyStringsGoogle: [],
//           keyStringsEspacenet: [],
//           keyStringsUSPTO: [],
//           keyStringsOthers: [],
//         },
//       ];
//     }

//     const keyStringsObj = appendix1.keyStrings[0];

//     keyStringsObj[keyField].push({ _id: uuidv4(), value, fieldName });

//     await project.save();

//     res.status(200).json( [keyStringsObj]);
//   } catch (err) {
//     console.error("Error saving key string:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });



// POST /live/projectname/appendix1/keystring/:id
router.post("/keystring/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { value, fieldName, hitCount = "" } = req.body; 

  if (!value || !value.trim()) {
    return res.status(400).json({ message: "Key string value is required" });
  }

  try {
    const dynamicPath = `stages.appendix1.0.keyStrings.keyStrings.${fieldName}`;

    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: projectId },
      {
        $push: { [dynamicPath]: { value, fieldName, hitCount } }
      },
      { new: true, upsert: true } 
    );

    res.json(updatedProject.stages.appendix1[0].keyStrings.keyStrings);
  } catch (err) {
    console.error("Error saving key string:", err);
    res.status(500).json({ message: "Failed to save key string" });
  }
});

 

// initial database name created
router.post("/:projectId/init-databases", async (req, res) => {
  const defaultDatabases = [
    { dbId: "addNew", databaseName: "+ Add New Database" },
    { dbId: "Orbit", databaseName: "Orbit" },
    { dbId: "GooglePatents", databaseName: "Google Patents" },
    { dbId: "Espacenet", databaseName: "Espacenet" },
    { dbId: "USPTO", databaseName: "USPTO" },
    { dbId: "Others", databaseName: "Others" },
  ];

  try {
    const databasesWithIds = defaultDatabases.map(db => ({
      _id: uuidv4(),
      dbId: db.dbId,
      databaseName: db.databaseName,
      keyStrings: []
    }));

    const project = await cln_prior_report_schema.findByIdAndUpdate(
      req.params.projectId,
      {
        $set: { "stages.appendix1.0.keyStrings": databasesWithIds }
      },
      { new: true, upsert: true } 
    );

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.status(201).json({
      message: "Default databases initialized",
      keyStrings: project.stages.appendix1[0].keyStrings
    });

  } catch (error) {
    console.error("Error initializing databases:", error);
    res.status(500).json({ error: error.message });
  }
});





// new database name added
// router.post("/:projectId/init-databases", async (req, res) => {
//   const defaultDatabases = [
//     { dbId: "addnew", databaseName: "+ Add New Database" },
//     { dbId: "orbit", databaseName: "Orbit" },
//     { dbId: "googlepatents", databaseName: "Google Patents" },
//     { dbId: "espacenet", databaseName: "Espacenet" },
//     { dbId: "uspto", databaseName: "USPTO" },
//     { dbId: "others", databaseName: "Others" },
//   ];

//   try {
//     const project = await cln_prior_report_schema.findById(req.params.projectId);
//     if (!project) return res.status(404).json({ error: "Project not found" });

//     // Ensure appendix1 array exists
//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{ keyStrings: [] }];
//     }

//     const appendix1 = project.stages.appendix1[0];

//     // Ensure keyStrings exists
//     if (!appendix1.keyStrings) {
//       appendix1.keyStrings = [];
//     }

//     // Add only missing databases
//     defaultDatabases.forEach((db) => {
//       const exists = appendix1.keyStrings.some((k) => k.dbId === db.dbId);
//       if (!exists) {
//         appendix1.keyStrings.push({
//           _id: uuidv4(),
//           dbId: db.dbId,
//           databaseName: db.databaseName,
//           keyStrings: []
//         });
//       }
//     });

//     await project.save();

//     res.status(201).json({
//       message: "Databases initialized (missing ones added only)",
//       keyStrings: appendix1.keyStrings,
//     });

//   } catch (error) {
//     console.error("Error initializing databases:", error);
//     res.status(500).json({ error: error.message });
//   }
// });




router.post("/:projectId/add-database", async (req, res) => {
  const { projectId } = req.params;
  const { databaseName } = req.body;

  try {
    if (!databaseName) {
      return res.status(400).json({ message: "databaseName is required" });
    }

    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({ keyStrings: [] });
    }

    const appendix1 = project.stages.appendix1[0];

    const exists = appendix1.keyStrings.some(
      (db) => db.databaseName.toLowerCase() === databaseName.toLowerCase()
    );
    if (exists) {
      return res.status(400).json({ message: "Database already exists" });
    }

    const newDatabase = {
      _id: uuidv4(),
      dbId: databaseName.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      databaseName,
      keyStrings: [],
    };

    appendix1.keyStrings.push(newDatabase);
    await project.save();

    return res.status(201).json({
      keyStrings: appendix1.keyStrings,
    });
  } catch (error) {
    console.error("Error in add-database:", error);
    return res.status(500).json({ error: error.message });
  }
});

// add-Keystrings and hit count 
router.post("/:projectId/add-keystring", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { databaseId, keyString, hitCount, databaseName } = req.body;

    if (!databaseId || !keyString) {
      return res.status(400).json({ message: "databaseId and keyString are required" });
    }

    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    let appendix = project.stages.appendix1[0];
    if (!appendix) {
      appendix = { keyStrings: [] };
      project.stages.appendix1.push(appendix);
    }

    let dbEntry = appendix.keyStrings.find(db => db._id === databaseId);
    if (!dbEntry) {
      return res.status(404).json({ message: "Database not found in appendix1" });
    }

    dbEntry.keyStrings.push({
      keyString,
      hitCount: hitCount || "",
      databaseName,
      parentId: databaseId,
    });

    await project.save();

    res.json({
      message: "KeyString added successfully",
      allKeyStrings: appendix.keyStrings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});


// Keystring deleted api 
router.delete("/:projectId/databases/:parentId/keystrings/:keyStringId/delete-key-string", async (req, res) => {
  try {
    const { projectId, parentId, keyStringId } = req.params;

    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    let appendix = project.stages.appendix1[0];
    if (!appendix) {
      return res.status(404).json({ message: "Appendix1 not found" });
    }

    const dbEntry = appendix.keyStrings.find(db => db._id === parentId);
    if (!dbEntry) {
      return res.status(404).json({ message: "Database not found" });
    }

    dbEntry.keyStrings = dbEntry.keyStrings.filter(ks => ks._id !== keyStringId);

    await project.save();

    res.json({
      message: "KeyString deleted successfully",
      allKeyStrings: appendix.keyStrings,
    });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});





// router.post("/appendix1/keystring/:projectId", async (req, res) => {
//   const { projectId } = req.params;
//   const { value, fieldName, hitCount } = req.body;

//   const fieldMap = {
//     Orbit: "keyStringsOrbit",
//     "Google Patents": "keyStringsGoogle",
//     Espacenet: "keyStringsEspacenet",
//     USPTO: "keyStringsUSPTO",
//     Others: "keyStringsOthers",
//   };

//   try {
//     if (!value || !fieldName) {
//       return res.status(400).json({ message: "Value and fieldName are required" });
//     }

//     const keyField = fieldMap[fieldName];
//     if (!keyField) {
//       return res.status(400).json({ message: "Invalid fieldName" });
//     }

//     const values = value
//       .split(",")
//       .map((val) => val.trim())
//       .filter(Boolean);

//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) return res.status(404).json({ message: "Project not found" });

//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{}];
//     }

//     const appendix1 = project.stages.appendix1[0];

//     if (!appendix1.keyStrings || appendix1.keyStrings.length === 0) {
//       appendix1.keyStrings = [
//         {
//           keyStringsOrbit: [],
//           keyStringsGoogle: [],
//           keyStringsEspacenet: [],
//           keyStringsUSPTO: [],
//           keyStringsOthers: [],
//         },
//       ];
//     }

//     const keyStringsObj = appendix1.keyStrings[0];

//     const docs = values.map((val) => ({
//       _id: uuidv4(),
//       value: val,
//       fieldName,
//       hitCount,
//     }));

//     keyStringsObj[keyField].push(...docs);

//     await project.save();

//     res.status(200).json([keyStringsObj]);
//   } catch (err) {
//     console.error("❌ Error saving key string:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// });












// router.post("/appendix1/:projectId/:fieldName", async (req, res) => {
//   const { projectId, fieldName } = req.params;
//   const { value } = req.body; 

//   const allowedFields = ["keyStringsOrbit", "keyStringsGoogle", "keyStringsEspacenet", "keyStringsUSPTO", "keyStringsOthers"];
//   if (!allowedFields.includes(fieldName)) {
//     return res.status(400).json({ message: "Invalid field name" });
//   }

//   if (!value || !value.trim()) {
//     return res.status(400).json({ message: "Value cannot be empty" });
//   }

//   try {
//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{
//         keyStrings: [{
//           keyStringsOrbit: [],
//           keyStringsGoogle: [],
//           keyStringsEspacenet: [],
//           keyStringsUSPTO: [],
//           keyStringsOthers: [],
//         }]
//       }];
//     }
//     if (!project.stages.appendix1[0].keyStrings || project.stages.appendix1[0].keyStrings.length === 0) {
//       project.stages.appendix1[0].keyStrings = [{
//         keyStringsOrbit: [],
//         keyStringsGoogle: [],
//         keyStringsEspacenet: [],
//         keyStringsUSPTO: [],
//         keyStringsOthers: [],
//       }];
//     }

//     const valuesArray = value.split(",").map(v => v.trim()).filter(v => v);

//     valuesArray.forEach(val => {
//       project.stages.appendix1[0].keyStrings[0][fieldName].push({
//         _id: uuidv4(),
//         value: val,
//         fieldName: fieldName,
//       });
//     });

//     await project.save();

//     res.status(200).json({ keyStrings: project.stages.appendix1[0].keyStrings[0] });

//   } catch (err) {
//     console.error("Error adding key string item:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// router.post("/appendix1/:projectId/:fieldName", async (req, res) => {
//   const { projectId, fieldName } = req.params;
//   const { value } = req.body;

//   console.log('projectId, fieldName', projectId, fieldName, value)

//   const allowedFields = ["keyStringsOrbit", "keyStringsGoogle", "keyStringsEspacenet", "keyStringsUSPTO", "keyStringsOthers"];
//   if (!allowedFields.includes(fieldName)) {
//     return res.status(400).json({ message: "Invalid field name" });
//   }

//   try {
//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: "Project not found" });
//     }

//     if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
//       project.stages.appendix1 = [{
//         keyStrings: [{
//           keyStringsOrbit: [],
//           keyStringsGoogle: [],
//           keyStringsEspacenet: [],
//           keyStringsUSPTO: [],
//           keyStringsOthers: [],
//         }]
//       }];
//     }

//     if (!project.stages.appendix1[0].keyStrings || project.stages.appendix1[0].keyStrings.length === 0) {
//       project.stages.appendix1[0].keyStrings = [{
//         keyStringsOrbit: [],
//         keyStringsGoogle: [],
//         keyStringsEspacenet: [],
//         keyStringsUSPTO: [],
//         keyStringsOthers: [],
//       }];
//     }

//     project.stages.appendix1[0].keyStrings[0][fieldName].push({
//       _id: uuidv4(),
//       value
//     });


//     await project.save();
//     res.status(200).json({ keyStrings: project.stages.appendix1[0].keyStrings[0] });

//   } catch (err) {
//     console.error("Error adding key string item:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });




// Delete key string item
router.delete("/appendix1/:projectId/:appendixId/:keyStringsId/:fieldName/:itemId", async (req, res) => {
  const { projectId, appendixId, keyStringsId, fieldName, itemId } = req.params;

  const allowedFields = ["keyStringsOrbit", "keyStringsGoogle", "keyStringsEspacenet", "keyStringsUSPTO", "keyStringsOthers"];
  if (!allowedFields.includes(fieldName)) {
    return res.status(400).json({ message: "Invalid field name" });
  }

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      {
        _id: projectId,
        "stages.appendix1._id": appendixId,
        "stages.appendix1.keyStrings._id": keyStringsId
      },
      {
        $pull: {
          [`stages.appendix1.$[appendix].keyStrings.$[keyStrings].${fieldName}`]: { _id: itemId }
        }
      },
      {
        new: true,
        arrayFilters: [
          { "appendix._id": appendixId },
          { "keyStrings._id": keyStringsId }
        ]
      }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project or item not found" });
    }

    res.status(200).json({
      message: `${fieldName} item deleted`,
      project: updatedProject
    });

  } catch (err) {
    console.error("Error deleting key string item:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// router.post("/add-key-string/:id", async (req, res) => {
//   const { id } = req.params;
//   const { keyStringsText } = req.body;

//   try {
//     const project = await cln_prior_report_schema.findById(id);

//     if (!project) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     if (project.stages.appendix1.length === 0) {
//       project.stages.appendix1.push({
//         _id: uuidv4(),
//         keyStringsText: [],
//       });
//     }

//     project.stages.appendix1[0].keyStrings.push({
//       _id: uuidv4(),
//       keyStringsText
//     });

//     await project.save();
//     res.status(200).json(project);
//   } catch (err) {
//     console.error(" Error adding Key Strings:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// // Delete Key Strings Term 
// router.delete("/delete-key-string/:id/:keyID", async (req, res) => {
//   const { id, keyID } = req.params;

//   try {
//     const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
//       { _id: id },
//       { $pull: { "stages.appendix1.0.keyStrings": { _id: keyID } } },
//       { new: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: " Project or term not found" });
//     }

//     res.status(200).json(updatedProject);
//   } catch (err) {
//     console.error(" Error deleting Key Strings:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// // Save keyStringsNpl

router.post("/add-key-string-npl/:id", async (req, res) => {
  const { id } = req.params;
  const { keyStringsNplText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!keyStringsNplText) {
      return res.status(400).json({ message: "keyStringsNplText is required" });
    }

    const values = keyStringsNplText
      .split(",")
      .map((val) => val.trim())
      .filter(Boolean);

    const docs = values.map((val) => ({
      _id: uuidv4(),
      keyStringsNplText: val,
    }));

    if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({
        _id: uuidv4(),
        keyStringsNpl: [],
      });
    }

    project.stages.appendix1[0].keyStringsNpl.push(...docs);

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("❌ Error adding Key Strings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// GET /api/crossref/:doi

router.get("/nplcorssref/:doi", async (req, res) => {
  try {
    const { doi } = req.params;
    const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;

    const response = await axios.get(url);
    const data = response.data.message;

    let abstractText = "N/A";
    if (data.abstract) {
      try {
        const parser = new xml2js.Parser();
        const parsed = await parser.parseStringPromise(`<root>${data.abstract}</root>`);
        abstractText = parsed.root["jats:p"] ? parsed.root["jats:p"][0] : data.abstract;
      } catch (err) {
        console.error("Error parsing JATS XML:", err);
        abstractText = data.abstract;
      }
    }

    const formattedData = {
      title: data.title ? data.title[0] : "N/A",
      authors: data.author
        ? data.author.map((a) => `${a.given || ""} ${a.family || ""}`)
        : [],
      publisher: data.publisher || "N/A",
      publishedDate: data["published-print"]
        ? data["published-print"]["date-parts"][0].join("-")
        : data["published-online"]
          ? data["published-online"]["date-parts"][0].join("-")
          : "N/A",
      doi: data.DOI || "N/A",
      URL: data.URL || "N/A",
      abstract: abstractText,
      type: data.type || "N/A",
      language: data.language || "N/A",
    };

    res.json({ success: true, data: formattedData, fullData: data });
  } catch (error) {
    console.error("Error fetching Crossref data:", error.message);
    res.status(500).json({ success: false, message: "Error fetching Crossref data" });
  }
});



// router.get("/nplcorssref/:doi", async (req, res) => {
//   try {
//     const { doi } = req.params;

//     const url = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;

//     const response = await axios.get(url);

//     const data = response.data.message;

//     const formattedData = {
//       title: data.title ? data.title[0] : "N/A",
//       authors: data.author
//         ? data.author.map(a => `${a.given || ""} ${a.family || ""}`)
//         : [],
//       publisher: data.publisher || "N/A",
//       publishedDate: data["published-print"]
//         ? data["published-print"]["date-parts"][0].join("-")
//         : data["published-online"]
//         ? data["published-online"]["date-parts"][0].join("-")
//         : "N/A",
//       doi: data.DOI || "N/A",
//       URL: data.URL || "N/A",
//       abstract: data.abstract || "N/A",
//       type  : data.type || "N/A",
//       language: data.language || "N/A",
//     };

//     res.json({ success: true, data: formattedData, fullData: data});
//   } catch (error) {
//     console.error("Error fetching Crossref data:", error.message);
//     res.status(500).json({ success: false, message: "Error fetching Crossref data" });
//   }
// });



// router.post("/add-key-string-npl/:id", async (req, res) => {
//   const { id } = req.params;
//   const { keyStringsNplText } = req.body;

//   try {
//     const project = await cln_prior_report_schema.findById(id);

//     if (!project) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     if (project.stages.appendix1.length === 0) {
//       project.stages.appendix1.push({
//         _id: uuidv4(),
//         keyStringsNplText: [],
//       });
//     }

//     project.stages.appendix1[0].keyStringsNpl.push({
//       _id: uuidv4(),
//       keyStringsNplText
//     });

//     await project.save();
//     res.status(200).json(project);
//   } catch (err) {
//     console.error(" Error adding Key Strings:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// Delete Key StringsNpl Term 
router.delete("/appendix1/keystring/:projectId/:fieldName/:itemId", async (req, res) => {
  const { projectId, itemId, fieldName } = req.params;

  const fieldMap = {
    Orbit: "keyStringsOrbit",
    "Google Patents": "keyStringsGoogle",
    Espacenet: "keyStringsEspacenet",
    USPTO: "keyStringsUSPTO",
    Others: "keyStringsOthers",
  };

  try {
    const keyField = fieldMap[fieldName];
    if (!keyField) {
      return res.status(400).json({ message: "Invalid fieldName" });
    }

    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
      return res.status(400).json({ message: "No appendix1 data found" });
    }

    const appendix1 = project.stages.appendix1[0];

    if (!appendix1.keyStrings || appendix1.keyStrings.length === 0) {
      return res.status(400).json({ message: "No keyStrings data found" });
    }

    const keyStringsObj = appendix1.keyStrings[0];

    if (!keyStringsObj[keyField]) {
      return res.status(400).json({ message: `No ${fieldName} data found` });
    }

    const beforeCount = keyStringsObj[keyField].length;

    keyStringsObj[keyField] = keyStringsObj[keyField].filter(
      (item) => !(item._id === itemId && item.fieldName === fieldName)
    );

    if (beforeCount === keyStringsObj[keyField].length) {
      return res.status(404).json({ message: "Item not found" });
    }

    await project.save();

    res.status(200).json([keyStringsObj]);
  } catch (err) {
    console.error("❌ Error deleting key string:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});




// router.delete("/delete-key-string-npl/:id/:keyID", async (req, res) => {
//   const { id, keyID } = req.params;

//   try {
//     const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
//       { _id: id },
//       { $pull: { "stages.appendix1.0.keyStringsNpl": { _id: keyID } } },
//       { new: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: " Project or term not found" });
//     }

//     res.status(200).json(updatedProject);
//   } catch (err) {
//     console.error(" Error deleting Key Strings:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });


// // Save Additional Search
// router.post("/add-key-string-additional/:id", async (req, res) => {
  // const { id } = req.params;
  // const { keyStringsAdditionalText } = req.body;

//   try {
//     const project = await cln_prior_report_schema.findById(id);

//     if (!project) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     if (project.stages.appendix1.length === 0) {
//       project.stages.appendix1.push({
//         _id: uuidv4(),
//         keyStringsAdditionalText: [],
//       });
//     }

//     project.stages.appendix1[0].keyStringsAdditional.push({
//       _id: uuidv4(),
//       keyStringsAdditionalText
//     });

//     await project.save();
//     res.status(200).json(project);
//   } catch (err) {
//     console.error(" Error adding Additional Key Strings:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });




// POST: add Key Strings Additional (comma-separated support)
router.post("/add-key-string-additional/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { keyStringsAdditionalText } = req.body;

  if (!keyStringsAdditionalText) {
    return res.status(400).json({ error: "keyStringsAdditionalText is required" });
  }

  try {
    const values = keyStringsAdditionalText
      .split(",")
      .map((val) => val.trim())
      .filter(Boolean);

    const docs = values.map((val) => ({
      _id: uuidv4(),
      keyStringsAdditionalText: val,
    }));
    const project = await cln_prior_report_schema.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (!project.stages.appendix1 || project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({});
    }

    project.stages.appendix1[0].keyStringsAdditional.push(...docs);
    await project.save();

    res.json(project);
  } catch (err) {
    console.error("❌ Error saving key strings additional:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete Additional Search
router.delete("/delete-key-string-additional/:id/:keyID", async (req, res) => {
  const { id, keyID } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: id },
      { $pull: { "stages.appendix1.0.keyStringsAdditional": { _id: keyID } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(" Error deleting Key Additional Strings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Data availability Save
router.post("/add-data-availability/:id", async (req, res) => {
  const { id } = req.params;
  const { dataAvailableText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    if (project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({
        dataAvailableText: [],
      });
    }

    project.stages.appendix1[0].dataAvailability.push({
      dataAvailableText
    });


    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error(" Error adding dataAvailability:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Delete Data Availability
router.delete("/delete-data-availability/:id/:availabilityID", async (req, res) => {
  const { id, availabilityID } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: id },
      { $pull: { "stages.appendix1.0.dataAvailability": { _id: availabilityID } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: " Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error(" Error deleting dataAvailability:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// // Save Appendix 2 - Patents
// router.post("/update-appendix2-patents/:id", async (req, res) => {
//   const { id } = req.params;
//   const { patents } = req.body;

//   try {
//     const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(id,
//       { "stages.appendix2.patents": patents },
//       { new: true, runValidators: true }
//     );

//     if (!updatedProject) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     res.status(200).json(updatedProject);
//   } catch (error) {
//     console.error(" Error updating Appendix 2 - Patents:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });

  // router.post("/update-appendix2-patents/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const { patents } = req.body;

  //   try {
  //     const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
  //       id,
  //       { "stages.appendix2.0.patents": patents },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProject) {
  //       return res.status(404).json({ message: "Project not found" });
  //     }

  //     res.status(200).json(updatedProject);
  //   } catch (error) {
  //     console.error("❌ Error updating Appendix 2 - Patents:", error);
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // });


  // // Save Appendix 2 - Non-Patent Literature
  // router.post("/update-appendix2-npl/:id", async (req, res) => {
  //   const { id } = req.params;
  //   const { nonPatentLiterature } = req.body;

  //   try {
  //     const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
  //       id,
  //       { "stages.appendix2.0.nonPatentLiterature": nonPatentLiterature },
  //       { new: true, runValidators: true }
  //     );

  //     if (!updatedProject) {
  //       return res.status(404).json({ message: " Project not found" });
  //     }

  //     res.status(200).json(updatedProject);
  //   } catch (error) {
  //     console.error(" Error updating Appendix 2 - NPL:", error);
  //     res.status(500).json({ message: "Server error", error: error.message });
  //   }
  // });




  router.post("/update-appendix2-patents/:id", async (req, res) => {
  const { id } = req.params;
  let { patents } = req.body;

  // // Normalize: array → comma-separated string
  // if (Array.isArray(patents)) {
  //   patents = patents.join(", ");
  // }

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { "stages.appendix2.0.patents": patents },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error updating Appendix 2 - Patents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/update-appendix2-npl/:id", async (req, res) => {
  const { id } = req.params;
  let { nonPatentLiterature } = req.body;

  // if (Array.isArray(nonPatentLiterature)) {
  //   nonPatentLiterature = nonPatentLiterature.join(", ");
  // }

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { "stages.appendix2.0.nonPatentLiterature": nonPatentLiterature },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error(" Error updating Appendix 2 - NPL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// router.delete("/delete-image/:projectId/:imageId", async (req, res) => {
//   const { projectId, imageId } = req.params;

//   try {
//     const project = await cln_prior_report_schema.findById(projectId);
//     if (!project) {
//       return res.status(404).json({ message: " Project not found" });
//     }

//     const imageToDelete = project.stages.introduction[0].projectImageUrl.find(
//       (img) => img._id === imageId
//     );

//     if (!imageToDelete) {
//       return res.status(404).json({ message: " Image not found" });
//     }

//     const cloudinaryResult = await cloudinary.uploader.destroy(imageToDelete.public_id);

//     if (cloudinaryResult.result !== "ok") {
//       return res.status(500).json({ message: " Failed to delete image from Cloudinary" });
//     }

//     const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
//       { _id: projectId },
//       { $pull: { "stages.introduction.0.projectImageUrl": { _id: imageId } } },
//       { new: true }
//     );

//     res.status(200).json({
//       message: "Image deleted successfully",
//       updatedProject,
//     });
//   } catch (err) {
//     console.error(" Error deleting image:", err);
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });



// // Cloud img upload API
// router.post("/images/upload", upload.single("image"), async (req, res) => {
//   try {
//     const streamUpload = (req) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { folder: "project_images" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(req.file.buffer).pipe(stream);
//       });
//     };

//     const result = await streamUpload(req);

//     const imageObject = {
//       _id: uuidv4(),
//       name: req.file.originalname,
//       size: req.file.size,
//       formattedSize: `${(req.file.size / 1024).toFixed(2)} KB`,
//       type: req.file.mimetype,
//       base64Url: result.secure_url,
//       public_id: result.public_id,
//       uploadedAt: new Date(),
//     };

//     res.status(200).json({
//       image: imageObject,
//     });
//   } catch (error) {
//     console.error(" Upload Error:", error);
//     res.status(500).json({ message: "Image upload failed", error: error.message });
//   }
// });



// Feedback patent number
router.post("/add-feedback/:projectId", async (req, res) => {
  const { projectId } = req.params;
  const { patentNumber } = req.body;

  if (!patentNumber || patentNumber.trim() === "") {
    return res.status(400).json({ message: " Patent number is required" });
  }

  try {
    const project = await cln_prior_report_schema.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: " Project not found" });
    }

    if (!project.feedbackPatentNumber) {
      project.feedbackPatentNumber = [];
    }

    if (!project.feedbackPatentNumber.includes(patentNumber)) {
      project.feedbackPatentNumber.push(patentNumber);
    }

    await project.save();

    res.status(200).json({
      message: "Feedback patent number added successfully",
      feedbackPatentNumber: project.feedbackPatentNumber,
    });
  } catch (error) {
    console.error(" Error adding feedback patent number:", error);
    res.status(500).json({
      message: " Server error",
      error: error.message,
    });
  }
});



module.exports = router;