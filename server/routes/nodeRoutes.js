const express = require("express");
const router = express.Router();
const cln_node_schema = require("../models/cln_node_schema");
const cln_edge_schema = require('../models/cln_edge_schema');
const { createNode } = require("../controllers/nodeController");
const { createEdge } = require("../controllers/edgeController");

router.post("/createnode", createNode);
router.post("/createedge", createEdge);

router.get("/nodes", async (req, res) => {
  try {
    const nodes = await cln_node_schema.find().lean();
    const edges = await cln_edge_schema.find().lean();

    res.status(200).json({ success: true, nodes, edges });
  } catch (error) {
    console.error("Error retrieving nodes:", error);
    res.status(500).json({ error: "Failed to load mind map nodes." });
  }
});

router.put("/nodes/:id", async (req, res) => {
  const nodeId = req.params.id;
  const { data } = req.body;

  try {
    const node = await cln_node_schema.findById(nodeId);
    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    if (data) {
      node.data.label = data.label ?? node.data.label;
      node.data.link = data.link ?? node.data.link;
      node.data.bold = data.bold ?? node.data.bold;
      node.data.italic = data.italic ?? node.data.italic;
    }

    const updatedNode = await node.save();
    res.status(200).json(updatedNode);
  } catch (error) {
    console.error("Error updating node:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;










// const express = require("express");
// const router = express.Router();
// const cln_node_schema = require("../models/cln_node_schema");
// const cln_edge_schema = require('../models/cln_edge_schema');

// import { createNode } from "../controllers/nodeController.js";
// import { createEdge } from "../controllers/edgeController.js";


// router.post("/createnode", createNode);
// router.post("/createedges", createEdge);


// router.get("/nodes", async (req, res) => {
//   try {
//     const nodes = await cln_node_schema.find().lean();
//     const edges = await cln_edge_schema.find().lean();

//     res.status(200).json({ success: true, nodes, edges });
//   } catch (error) {
//     console.error("Error retrieving nodes:", error);
//     res.status(500).json({ error: "Failed to load mind map nodes." });
//   }
// });


// router.put("/nodes/:id", async (req, res) => {
//   const nodeId = req.params.id;
//   const { data } = req.body;
//   console.log(req.body, 'data, nodeId, ')

//   try {
//     const node = await cln_node_schema.findById(nodeId);
//     if (!node) {
//       return res.status(404).json({ message: "Node not found" });
//     }

//     if (data) {
//       node.data.label = data.label ?? node.data.label;
//       node.data.link = data.link ?? node.data.link;
//       node.data.bold = data.bold ?? node.data.bold;
//       node.data.italic = data.italic ?? node.data.italic;
//     }

//     const updatedNode = await node.save();
//     res.status(200).json(updatedNode);
//   } catch (error) {
//     console.error("Error updating node:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });


  

// module.exports = router;
