// 订单
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  sn: { // 订单编号
    type: String,
    required: true
  },
  status: { // 订单状态： submit - 已提交， process - 进行中, finish - 已完成，close - 已关闭（审核不通过等），cancel - 已取消
    type: String,
    enum: ['submit', 'process', 'finish', 'close', 'cancel'],
    default: 'process'
  },
  type: { // 订单类型
    type: String,
    enum: ['normal', 'special'], // 普通 , 特殊
  },
  amount: Number, // 订单金额
  trans_type: { // 翻译类型: en - 英语, zh_yue - 粤语
    type: String,
    enum: ['en', 'zh_yue']
  },
  creator: { // 订单创建人
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user' 
  }, 
  team: { // 所属团队
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team' 
  },
  translator: { // 议员信息
    type: mongoose.Schema.Types.ObjectId,
    ref: 'translator' 
  }, 
  remark: { // 订单备注
    type:String,
    default: '' 
  },
  is_delete: { // 订单是否删除
    type: Boolean,
    default: false
  },
  create_time: { // 订单 创建/提交 时间
    type: Date,
    default: new Date()
  },
  confirm_time: { // 订单确认时间
    type: Date,
    default: null
  },
  comment_time: { // 评价时间
    type: Date,
    default: null
  },
  update_time: { // 更新时间
    type: Date,
    default: new Date()
  },

  // 会议信息
  meeting_type: { // 会议类型 inquiry - 电话会议； onsite_meeting - 现场交传
   type: String,
    enum: ['inquiry','onsite_meeting']
  },
  meeting_subject: { // 会议主题
   type: String,
   default: ''
  },
  meeting_date: { // 会议日期
   type: Date,
   default: new Date()
  },
  meeting_time: { // 会议时间:
   type:  String,
   enum: ['am','pm','day']
  },
  meeting_address: { // 会议地点
    type: String,
    default: '' 
  },
  meeting_analyst: { // 会议分析师姓名
    type: String,
    default: '' 
  },

  // 联系信息
  contact_name: { // 联系人姓名
    type: String,
    default: ''
  },
  contact_tel: { // 联系电话/手机
    type: String,
    default: ''
  },

  // 环节信息
  process_id: { // 当前环节 Id
    type: mongoose.Schema.Types.ObjectId,
    ref: 'order_process' 
  },
  process_code: String, // 当前环节code
  process_name: String, // 当前环节名称
});

// 设置索引
schema.index({ username: 1 });

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Order = mongoose.model('order', schema);

module.exports = { Order };