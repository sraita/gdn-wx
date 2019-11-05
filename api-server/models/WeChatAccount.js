// 存储 客户（第三方租户）列表
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  openId: String,
  nickName: String,
  gender: Number,
  language: String,
  city: String,
  province: String,
  country: String,
  avatarUrl: String,
  user:{type: mongoose.Schema.Types.ObjectId, ref:'user'}
});

// 设置索引
schema.index({ account: 1 });
schema.index({ name: 1 });
schema.index({ account: 1, name: 1 });

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const WeChatAccount = mongoose.model('wechatAccount', schema);

module.exports = { WeChatAccount };