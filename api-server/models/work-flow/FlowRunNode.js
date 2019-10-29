// FlowRunNode: 正在运行的结点或已运行完毕的结点
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 当前状态. running - 运行中, completed - 完成
  status: {
    type: String,
    enum: ['running', 'completed'],
    default: 'running'
  },
  // 流程开始时间
  startTime: {
    type: Date,
    default: new Date()
  },
  // 结束时间
  endTime: {
    type: Date,
    default: null
  },
  // 执行用时
  duration: {
    type: Number,
    default: null
  },
  // 执行结果
  result: {
    type: String,
    enum: ['success', 'failed'],
    default: null
  }
});

const FlowRunNode = mongoose.model('flowRunNode', schema);

module.exports = { FlowRunNode };