const express = require("express");
const router = express.Router();
const cln_prior_report_schema = require("../../models/livePatentScema/cln_prior_report_schema")
const { v4: uuidv4 } = require("uuid");


const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const streamifier = require("streamifier");

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// ✅ Multer Middleware (store files in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.post("/", async (req, res) => {
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
    const projects = await cln_prior_report_schema.find().sort({ createdOn: -1 });
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
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error("❌ Error fetching project:", error);
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
      return res.status(404).json({ message: "❌ Project not found" });
    }

    const introduction = project.stages?.introduction;

    if (!introduction || Object.keys(introduction).length === 0) {
      return res.status(200).json({ message: "ℹ️ No introduction data found", introduction: null });
    }

    res.status(200).json(introduction);
  } catch (error) {
    console.error("❌ Error retrieving introduction:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Update IntroData
router.post("/update-introduction/:id", async (req, res) => {
  const { id } = req.params;
  const { projectTitle, projectSubTitle, searchFeatures, projectImageUrl } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      {
        $push: {
          "stages.introduction.0.projectImageUrl": {
            $each: projectImageUrl,
          },
        },
        "stages.introduction.0.projectTitle": projectTitle,
        "stages.introduction.0.projectSubTitle": projectSubTitle,
        "stages.introduction.0.searchFeatures": searchFeatures,
      },
      { new: true }
    );


    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json({
      message: "✅ Introduction updated successfully",
      data: updatedProject,
    });
  } catch (err) {
    console.error("❌ Error updating introduction:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


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
      return res.status(404).json({ message: "❌ Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error adding publication detail:", error);
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
      return res.status(404).json({ message: "❌ Project not found" });
    }

    const publicationDetails = project?.stages?.relevantReferences?.publicationDetails || [];

    res.status(200).json({
      success: true,
      count: publicationDetails.length,
      publicationDetails
    });
  } catch (error) {
    console.error("❌ Error fetching publication details:", error);
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
      return res.status(404).json({ message: "❌ Document not found" });
    }

    res.status(200).json({
      message: "✅ Publication detail deleted successfully",
      publicationDetails: updatedDoc.stages.relevantReferences.publicationDetails
    });
  } catch (error) {
    console.error("❌ Error deleting publication detail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




// Non - Patent Literatures
router.post("/add-npl/:id", async (req, res) => {
  const { id } = req.params;
  const nplData = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { $push: { "stages.relevantReferences.nonPatentLiteratures": nplData } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error adding NPL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// Delete Non - Patent
router.delete("/delete-npl/:projectId/:nplId", async (req, res) => {
  const { projectId, nplId } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      projectId,
      {
        $pull: {
          "stages.relevantReferences.nonPatentLiteratures": { _id: nplId }
        }
      },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error deleting NPL:", error);
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
      return res.status(404).json({ message: "❌ Project not found" });
    }
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error updating Overall Summary:", error);
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
      { $push: { "stages.relatedReferences": relatedData } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error adding related reference:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Fetch Related Ref
router.get("/get-related/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const project = await cln_prior_report_schema.findById(id);
    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    const relatedReferences = project.stages.relatedReferences;
    res.status(200).json(relatedReferences);
  } catch (error) {
    console.error("❌ Error fetching related references:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



// Delete Reladed Ref
router.delete("/delete-related/:projectId/:relatedId", async (req, res) => {
  const { projectId, relatedId } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      projectId,
      { $pull: { "stages.relatedReferences": { _id: relatedId } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error deleting related reference:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }

});



// Add Base Search Term to appendix1
router.post("/add-base-search-term/:id", async (req, res) => {
  const { id } = req.params;
  const { searchTermText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
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
    console.error("❌ Error adding Base Search Term:", err);
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
      return res.status(404).json({ message: "❌ Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error("❌ Error deleting Base Search Term:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Add Key Strings to appendix1
router.post("/add-key-string/:id", async (req, res) => {
  const { id } = req.params;
  const { keyStringsText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    if (project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({
        _id: uuidv4(),
        keyStringsText: [],
      });
    }

    project.stages.appendix1[0].keyStrings.push({
      _id: uuidv4(),
      keyStringsText
    });

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("❌ Error adding Key Strings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Delete Key Strings Term 
router.delete("/delete-key-string/:id/:keyID", async (req, res) => {
  const { id, keyID } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: id },
      { $pull: { "stages.appendix1.0.keyStrings": { _id: keyID } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error("❌ Error deleting Key Strings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.post("/add-data-availability/:id", async (req, res) => {
  const { id } = req.params;
  const { dataAvailableText } = req.body;

  try {
    const project = await cln_prior_report_schema.findById(id);

    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    if (project.stages.appendix1.length === 0) {
      project.stages.appendix1.push({
        _id: uuidv4(),
        dataAvailableText: [],
      });
    }

    project.stages.appendix1[0].dataAvailability.push({
      _id: uuidv4(),
      dataAvailableText
    });

    await project.save();
    res.status(200).json(project);
  } catch (err) {
    console.error("❌ Error adding dataAvailability:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Delete Key Strings Term 
router.delete("/delete-data-availability/:id/:availabilityID", async (req, res) => {
  const { id, availabilityID } = req.params;

  try {
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: id },
      { $pull: { "stages.appendix1.0.dataAvailability": { _id: availabilityID } } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project or term not found" });
    }

    res.status(200).json(updatedProject);
  } catch (err) {
    console.error("❌ Error deleting dataAvailability:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// Save Appendix 2 - Patents
router.post("/update-appendix2-patents/:id", async (req, res) => {
  const { id } = req.params;
  const { patents } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(id,
      { "stages.appendix2.patents": patents },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error updating Appendix 2 - Patents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Save Appendix 2 - Non-Patent Literature
router.post("/update-appendix2-npl/:id", async (req, res) => {
  const { id } = req.params;
  const { nonPatentLiterature } = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { "stages.appendix2.nonPatentLiterature": nonPatentLiterature },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error updating Appendix 2 - NPL:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});









router.delete("/delete-image/:projectId/:imageId", async (req, res) => {
  const { projectId, imageId } = req.params;

  try {
    // Find the project
    const project = await cln_prior_report_schema.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    // Find the image in the introduction array
    const imageToDelete = project.stages.introduction[0].projectImageUrl.find(
      (img) => img._id === imageId
    );

    if (!imageToDelete) {
      return res.status(404).json({ message: "❌ Image not found in project" });
    }

    // Delete from Cloudinary
    const cloudinaryResult = await cloudinary.uploader.destroy(
      imageToDelete.public_id
    );

    if (cloudinaryResult.result !== "ok") {
      return res.status(500).json({ message: "❌ Failed to delete image from Cloudinary" });
    }

    // Remove image from DB
    const updatedProject = await cln_prior_report_schema.findOneAndUpdate(
      { _id: projectId },
      { $pull: { "stages.introduction.0.projectImageUrl": { _id: imageId } } },
      { new: true }
    );

    res.status(200).json({
      message: "✅ Image deleted successfully",
      updatedProject,
    });
  } catch (err) {
    console.error("❌ Error deleting image:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});





// Cloud img upload API

router.post("/images/upload", upload.single("image"), async (req, res) => {
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "project_images" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    const imageObject = {
      _id: uuidv4(),
      name: req.file.originalname,
      size: req.file.size,
      formattedSize: `${(req.file.size / 1024).toFixed(2)} KB`,
      type: req.file.mimetype,
      base64Url: result.secure_url,
      public_id: result.public_id,
      uploadedAt: new Date(),
    };

    res.status(200).json({
      image: imageObject,
    });
  } catch (error) {
    console.error("❌ Upload Error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
});









module.exports = router;
