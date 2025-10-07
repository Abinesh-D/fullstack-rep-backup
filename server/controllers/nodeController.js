const cln_node_schema = require("../models/cln_node_schema");

const createNode = async (req, res) => {
  try {
    const newNode = new cln_node_schema(req.body);
    await newNode.save();
    res.status(201).json(newNode);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createNode };
