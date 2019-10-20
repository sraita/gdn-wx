
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 部门名称
  name: {
    type: String,
    required: true
  },
  // 上级部门
  parent: { type: mongoose.Types.ObjectId, ref: 'department', default: null },
  type: {
    type: String,
    enum: ['company', 'department', 'team'],
    default: 'department'
  },
  org: { type: mongoose.Types.ObjectId, ref: 'org'}, // 所属组织机构
  status: Number, // 0: 禁用, 1:启用
  createAt: {
    type:Date,
    default: new Date()
  }
});

const Department = mongoose.model('department', schema);

module.exports = { Department };
