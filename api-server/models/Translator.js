// Translator - 翻译人员
const mongoose = require('mongoose');

const subtotalSchema = new mongoose.Schema({
  orderTotal: Number, // 订单总数
  orderGoing: Number,// 进行中的订单
  orderHighGrade: Number,// 好评的订单
})
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // 关联账户
  name: String, // 姓名
  sex: {
    type: String,
    enum: ['0','1','2'], // 未知, 男, 女
  },
  tel: String,
  mobile: String,
  qq: String,
  wechat: String,
  picture:{
    type: String,
    default: ''
  },
  rank: { // 翻译人员级别
    type: String,
    enum: ['normal', 'advanced','proficient'], // 普通, 高级, 专家
  }
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Translator = mongoose.model('translator', schema);

module.exports = { Translator };