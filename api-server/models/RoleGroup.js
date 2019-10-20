const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type:Number,
    default: 1,
  },
  type: {
    type: [String],
    enum: ['system','public', 'private','default'], // system - 系统内部角色组(用于系统管理), public - 系统公共角色组， private - 机构私有角色组, default - 机构默认角色组
    default: ['private']
  },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'roleGroup', default: null }, // 有上级，默认继承上级权限
  // 备注说明
  remark: {
    type:String, 
    default: '<无>'
  },
  canEdit:{type: Boolean, default: true},
  org: {type: mongoose.Schema.Types.ObjectId, ref: 'org', default: null},
  roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'role'}],
  menus: [{type: mongoose.Schema.Types.ObjectId, ref: 'menu'}],
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