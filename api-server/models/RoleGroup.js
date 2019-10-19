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
    type: String,
    enum: ['public', 'private'],
    default: 'private'
  },
  remark: String, // 备注说明
  org: {type: mongoose.Schema.Types.ObjectId, ref: 'org'},
  roles: [{type: mongoose.Schema.Types.ObjectId, ref: 'role'}],
  menus: [{type: mongoose.Schema.Types.ObjectId, ref: 'menu'}],
  opts: [{type: mongoose.Schema.Types.ObjectId, ref:'opt'}]
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const RoleGroup = mongoose.model('roleGroup', schema);

module.exports = { RoleGroup };