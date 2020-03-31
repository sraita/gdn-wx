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
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // 所有者
  contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // 联系人信息
  assigneeList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }], // 审核人员
  createAt: Date,
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Team = mongoose.model('team', schema);

module.exports = { Team };