// 团队
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  mobile: Number,
})

const schema = new mongoose.Schema({
  name: String, // 团队名称
  logo: String,
  introduction: String, // 介绍
  contact_name: String, // 联系人信息
  contact_tel: String,
  code: {
    type: String,
    default: ''
  },
  disable_code: {
    type: Boolean,
    default: false,
  },
  admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}], // 管理员
  approvers: [{type: mongoose.Schema.Types.ObjectId, ref: 'user'}], // 审核人员
  create_time: {
    type: Date,
    default: new Date()
  },
  update_time: {
    type: Date,
    default: new Date()
  },
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Team = mongoose.model('team', schema);

module.exports = { Team };