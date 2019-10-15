// 存储 客户（第三方租户）列表
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String,
  logo: String,
  tel: String,
  mobile: String, // 手机号
  email: String, // 邮箱
  province: String,
  city: String,
  county: String, 
  address: String, // 详细地址
  createAt: {
    type: Date, // 创建时间
    default: new Date()
  },
  onwer: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // 租户所有权人
  managers:[{type: mongoose.Schema.Types.ObjectId, ref:'user'}], // 租户管理者
  status: {
    type: Number, // 0 - 禁用, 1 - 启用
    default: 1
  },
  remark: String // 备注说明
});

// 设置索引
schema.index({ account: 1 });
schema.index({ name: 1 });
schema.index({ account: 1, name: 1});

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Custom = mongoose.model('custom', schema);

module.exports = { Custom };