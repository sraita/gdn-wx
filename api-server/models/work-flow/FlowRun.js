// FlowRun: 工作流运行主表 , 工作流流程实例 Instance
// 可见性： 1. 流程发起人(我发起的任务); 2. 正在执行任务的人 (TODO Task - 待办)
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 当前状态. running - 运行中, success - 结束(成功), fail - 结束(失败), reject - 被驳回
  status:{
    type: String,
    enum: ['running'],
    default: 'running'
  },
  // 流程发起人
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  // 当前节点
  currentNode: {type: mongoose.Schema.Types.ObjectId, ref: 'flowNode'},
  // 下一节点
  nextNode: { type: mongoose.Schema.Types.ObjectId, ref: 'flowNode' },
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
  },// 执行结果
  result: {
    type: String,
    enum: ['success', 'failed'],
    default: null
  }
});

const FlowRun = mongoose.model('flowRun', schema);

module.exports = { FlowRun };