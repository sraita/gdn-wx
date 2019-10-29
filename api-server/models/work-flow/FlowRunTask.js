// FlowRunTask: 正在执行的任务

// FlowRun: 工作流运行主表
// 可见性： 1. 流程发起人(我发起的任务); 2. 正在执行任务的人 (TODO Task - 待办)
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 当前状态. running - 运行中, done - 结束
  status: {
    type: String,
    enum: ['running'],
    default: 'running'
  },
  // 当前任务执行者
  executor: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
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
    enum:['success', 'failed'],
    default: null
  }
});

const FlowRunTask = mongoose.model('flowRunTask', schema);

module.exports = { FlowRunTask };