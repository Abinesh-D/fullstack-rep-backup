const express = require("express");
const router = express.Router();
const cln_edge_schema = require('../models/cln_edge_schema');




router.post('/edges', async (req, res) => {
  try {
    const edgeData = req.body;

    const newEdge = new cln_edge_schema(edgeData);
    await newEdge.save();

    res.status(201).json({ message: 'Edge created successfully', edge: newEdge });
  } catch (err) {
    console.error('Error saving edge:', err);
    res.status(500).json({ message: 'Failed to create edge', error: err.message });
  }
});

module.exports = router;
