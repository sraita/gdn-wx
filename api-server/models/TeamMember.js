// 团队成员
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'team' },
  isCreator: { // 是否是创建者
    type: Boolean,
    default: false,
  },
  isAssignee: { // 是否是审核人员
    type: Boolean,
    default: false,
  },
  createAt: Date,
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const TeamMember = mongoose.model('team-member', schema);

module.exports = { TeamMember };