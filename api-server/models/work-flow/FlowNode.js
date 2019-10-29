// FlowNode
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // 节点类型: solt(subFlow) - 插槽, normal - 普通结点 （多租户自定流程处理???)
  type:{
    type: String,
    enum: ['normal', 'solt'],
    default: 'normal'
  },
  // 所属工作流
  flow: { type: mongoose.Schema.Types.ObjectId, ref: 'flow' },
  // 下一节点
  next: {type: mongoose.Schema.Types.ObjectId, ref: 'flowNode'},
  // 节点执行有效时间
  expireIn:{
    type: Number,
    default: -1
  },
  // 成功判定方式: one - 其中任意一个任务成功, all - 所有任务成功
  condition: {
    type: String,
    enum: ['one','all'],
    default: 'all'
  },
  // 任务列表
  tasks:[{ type: mongoose.Schema.Types.ObjectId, ref:'flowTask'}],
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },
  
});

const FlowNode = mongoose.model('flowNode', schema);

module.exports = { FlowNode };