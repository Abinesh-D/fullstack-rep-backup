const cln_edge_schema = require("../models/cln_edge_schema");

const createEdge = async (req, res) => {
  try {
    const newEdge = new cln_edge_schema(req.body);
    await newEdge.save();
    res.status(201).json(newEdge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createEdge } ;