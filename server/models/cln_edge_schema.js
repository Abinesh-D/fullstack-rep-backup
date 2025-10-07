const mongoose = require('mongoose');

const mindMapEdgeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, },
    source: { type: String, required: true, },
    target: { type: String, required: true, },
    type: { type: String, enum: ['custom', 'default'], default: 'custom', },
    animated: { type: Boolean, default: false, },
    style: {
        stroke: { type: String, default: '#000000' },
        strokeWidth: { type: Number, default: 2 },
        strokeDasharray: { type: String, default: '' },
    },
    data: {
        direction: { type: String, enum: ['left', 'right', 'top', 'bottom', null], default: null, },
        pastedEdge: { type: Boolean, default: false, },
        excelEdge: { type: Boolean, default: false, },
    },
}, { timestamps: true });

const cln_edge_schema = mongoose.model('Edge', mindMapEdgeSchema);

module.exports = cln_edge_schema;
