const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  remark:{
    type: String,
    default:'<无>'
  }
});

const WorkFlowCategory = mongoose.model('workflowCategory', schema);

module.exports = { WorkFlowCategory };