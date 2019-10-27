const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // 状态. 0 - 禁用, 1 - 启用
  status: {
    type:Number,
    default: 1,
  },
  // 类型: public - 系统公共角色组， private - 机构私有角色组, default - 默认角色组
  type: {
    type: [String],
    enum: ['public', 'private','default'], 
    default: ['private']
  },
  // 上级角色组
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'roleGroup', default: null },
  // 备注说明
  remark: {
    type:String, 
    default: '<无>'
  },
  // 所属组织机构
  org: {type: mongoose.Schema.Types.ObjectId, ref: 'org', default: null},
  menus: [{type: mongoose.Schema.Types.ObjectId, ref: 'menu'}],
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'element' }], // 页面元素
  opts: [{type: mongoose.Schema.Types.ObjectId, ref:'opt'}],
  createAt: {
    type: Date,
    default: new Date()
  }
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const RoleGroup = mongoose.model('roleGroup', schema);

module.exports = { RoleGroup };