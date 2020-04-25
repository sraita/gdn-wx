/**
 * 订单流转记录
 */

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order' }, // 订单Id
  timestamp: { 
    type: Date,
    default: Date.now()
  },
  name: String,
  remark: String,
  status: { // 环节状态
    type: String,
    enum: ['wait','process','finish','fail']
  }
});