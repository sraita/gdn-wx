const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: Number,
  roleGroup: { type: mongoose.Schema.Types.ObjectId, ref: 'roleGroup' }, // 所属用户组
  org: { type: mongoose.Schema.Types.ObjectId, ref: 'org' }, // 所属机构或部门
  rootOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'org' }, // 顶级机构
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'menu' }], // 功能权限
  opts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'opt' }], // 操作权限
  remark: {
    type:String,
    default: '<无>'
  }
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Role = mongoose.model('role', schema);

module.exports = { Role };