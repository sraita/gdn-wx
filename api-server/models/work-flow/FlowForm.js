// FlowForm
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  config: Object,
  list: Array,
  flow: { type: mongoose.Schema.Types.ObjectId, ref: 'flow' },
  nodes:[{type: mongoose.Schema.Types.ObjectId, ref: 'flowNode'}],
  tasks:[{type: mongoose.Schema.Types.ObjectId, ref: 'flowTask'}],
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  }
});

const FlowForm = mongoose.model('flowForm', schema);

module.exports = { FlowForm };