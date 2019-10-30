const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref:'flowCategory', default: null},
  status: {
    type: Number,
    default: 1, // 0 - 禁用, 1 - 启用, -1 -  历史版本
  },
  version: {
    type: Number,
    default: 1
  },
  remark: String,
  createdAt:{
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
  operator: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // 操作人员
});

const Flow = mongoose.model('flow', schema);

module.exports = { Flow };