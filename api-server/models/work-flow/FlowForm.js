// FlowForm
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nodes:[{type: mongoose.Schema.Types.ObjectId, ref: 'flowNode'}],
  tasks:[{type: mongoose.Schema.Types.ObjectId, ref: 'flowTask'}],
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // 操作人员
});

const FlowForm = mongoose.model('flowForm', schema);

module.exports = { FlowForm };