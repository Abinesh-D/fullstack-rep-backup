const express = require("express");
const router = express.Router();
const cln_prior_report_schema = require("../../models/livePatentScema/cln_prior_report_schema")


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




router.post("/update-introduction/:id", async (req, res) => {
  const { id } = req.params;
  const introData = req.body;
  try {

    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      { $set: { "stages.introduction": introData } },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "❌ Project not found" });
    }

    console.log("✅ Introduction saved successfully");
    res.status(200).json({
      message: "Introduction saved successfully",
      data: updatedProject.stages.introduction
    });
  } catch (error) {
    console.error("❌ Error saving introduction:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});



router.post("/update-publication-details/:id", async (req, res) => {
  const { id } = req.params;
  const pubDetailData = req.body;

  try {
    const updatedProject = await cln_prior_report_schema.findByIdAndUpdate(
      id,
      {
        $push: {
          "stages.relevantReferences.publicationDetails": pubDetailData
        }
      },
      {
        new: true,
        runValidators: true
      }
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

    console.log("✅ Publication detail added successfully");
    res.status(200).json(updatedProject);
  } catch (error) {
    console.error("❌ Error adding publication detail:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// GET Publication Details for a Project
router.get("/publication-details/:id", async (req, res) => {
    const { id } = req.params;

    console.log(`📥 Fetching publication details for project ID: ${id}`);

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

        console.log(`✅ Found ${publicationDetails.length} publication detail(s)`);
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





module.exports = router;
