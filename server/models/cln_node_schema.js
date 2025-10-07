const mongoose = require('mongoose');

const mindMapNodeSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true, },
    type: { type: String, enum: ['editableNode', 'imageNode', 'excelNode'], default: 'editableNode', },
    position: { x: { type: Number, required: true }, y: { type: Number, required: true }, },
    data: {
        label: { type: String, required: true },
        direction: { type: String, enum: ['left', 'right', 'top', 'bottom'], default: 'right', },
        link: { type: String, default: '' },
        bold: { type: Boolean, default: false },
        italic: { type: Boolean, default: false },
        isImageNode: { type: Boolean, default: false },
        image: { type: String, default: '' },
        exfilenode: { type: Boolean, default: false },
        pastedEdge: { type: Boolean, default: false },
        createdByPaste: { type: Boolean, default: false },
        styles: {
            backgroundColor: { type: String, default: '' },
            color: { type: String, default: '' },
            borderColor: { type: String, default: '' },
        },
        children: [{ type: String }],
    },
}, { timestamps: true });

const cln_node_schema = mongoose.model('Node', mindMapNodeSchema);

module.exports = cln_node_schema;



















// const mongoose = require("mongoose");

// const NodeSchema = new mongoose.Schema({
//   type: { type: String, default: 'editableNode' },
//   position: {
//     x: { type: Number, required: true },
//     y: { type: Number, required: true }
//   },
//   data: {
//     label: { type: String, required: true },
//     direction: { type: String, enum: ['top', 'bottom', 'left', 'right'] },
//     pastedEdge: { type: Boolean, default: false },
//     style: {
//       backgroundColor: { type: String },
//       textColor: { type: String }
//     },
//     textStyles: {
//       isBold: { type: Boolean, default: false },
//       isItalic: { type: Boolean, default: false },
//       link: { type: String, default: "" }
//     },
//     imageUrl: { type: String }
//   },
//   exfilenode: { type: Boolean, default: false },
//   currentnodeid: { type: String, default: null }
// });

// const cln_new_node = mongoose.model("Node", NodeSchema);
// module.exports = cln_new_node;
