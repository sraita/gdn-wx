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

const FlowCategory = mongoose.model('flowCategory', schema);

module.exports = { FlowCategory };