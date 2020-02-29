// 订单
const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  subject: String, // 会议主题名称
  analyst: String, // 分析师姓名
  date: Date, // 会议日期
  time: { // 时段
    type: String, 
    enum:['day','am','pm'], // 全天, 上午, 下午 
  },
  transType: { // 翻译类型
    type: String,
    enum: ['1', '2']
  },
  projectType: { // 项目类型
    type: String,
    enum: ['meeting', 'inquiry']
  },
  address: String, // 开会地点
});

const contactSchema = new mongoose.Schema({
  name: String, // 联系人姓名
  emial: String,
  mobile: String,
  tel: String
});

const schema = new mongoose.Schema({
  no: Number, // 订单编号
  status: { // 订单状态
    type: Number,
    enum: [10,20,30,40,50,60,70,80,90] // 创建(等待审批), 审批通过, 审批拒绝, 已匹配翻译人员, 预估价格并匹配译员(特殊),订单完成
  },
  type: { // 订单类型
    type: String,
    enum:['normal','special'], // 普通 , 特殊
  },
  appraise: { type: mongoose.Schema.Types.ObjectId, ref: 'appraise'}, // 订单评价
  contact: contactSchema, // 联系信息
  meeting: meetingSchema, // 会议相关信息
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user'}, // 订单创建者 || 下单方
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'team' }, // 所属团队
  translator: { type: mongoose.Schema.Types.ObjectId, ref: 'translator' }, // 匹配译员
  remark: String, // 订单备注
  createAt: Date,
});

// 设置索引
schema.index({ username: 1 });

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Order = mongoose.model('order', schema);

module.exports = { Order };