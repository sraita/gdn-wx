/**
 * 订单流程
 * 普通订单(电话会议): 提交订单(submit-order) --> 唐能翻译接单(order-taking) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> 唐能确认订单(confirm-order)
 * 普通订单(现场交传): 提交订单(submit-order) --> pv 审批(pv-approval) --> 唐能翻译接单(order-taking) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> 唐能确认订单(confirm-order)
 * 特殊订单: 提交订单(submit-order) --> 唐能翻译接单(order-taking) --> 唐能预估价格(predict-price) --> 匹配议员(match-translator) --> 确认服务信息(confirm-service) --> pv 审批(pv-approval) --> 唐能确认订单(confirm-order)
 */
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  order_id: { type: mongoose.Schema.Types.ObjectId, ref: 'order' }, // 订单Id,
  status: {
    type: String,
    enum: ['wait', 'process', 'success', 'fail']
  },
  code: {
    type: String,
    enum: ['submit-order', 'order-taking', 'match-translator', 'predict-price', 'pv-approval', 'confirm-service', 'confirm-order']
  },
  name: String,
  start_time: {
    type: Date,
    default: Date.now()
  },
  end_time: {
    type: Date,
    default: Date.now()
  },
});

// 设置索引
schema.index({ username: 1 });

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const OrderProcess = mongoose.model('order_process', schema);

module.exports = { OrderProcess };