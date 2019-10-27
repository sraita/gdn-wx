const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: String, // 角色代码
  // 状态. 0 - 禁用, 1 - 启用
  status: {
    type:Number,
    default: 1
  },
  // 类型: normal - 普通角色, default - 默认角色
  type: {
    type: String,
    enum: ['normal', 'default'],
    default: 'normal'
  },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'roleGroup' }, // 所属用户组
  menus: [{ type: mongoose.Schema.Types.ObjectId, ref: 'menu' }], // 功能权限
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'element' }], // 页面元素
  opts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'opt' }], // 操作权限
  remark: {
    type:String,
    default: '<无>'
  },
  // 是否为单一角色， 如果 为 true， 不能与其它角色共存
  isSingle: {
    type: Boolean,
    default: false
  },
  exclusions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }] // 互斥角色列表
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Role = mongoose.model('role', schema);

module.exports = { Role };