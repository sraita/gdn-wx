// FlowTask
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  // 任务类型. normal - 普通任务, service - 系统服务
  type:{
    type: String,
    enum:['normal', 'service'],
    default: 'normal'
  },
  // 所属工作流
  flow: { type: mongoose.Schema.Types.ObjectId, ref: 'flow' },
  // 所属结点
  node: { type: mongoose.Schema.Types.ObjectId, ref: 'flowNode' },
  // 任务执行有效时限, 单位为 秒 . -1 - 永久有效
  exprieIn:{
    type: Number,
    default: -1
  },
  // 任务过期处理方式. success - 过期自动完成任务, fail - 过期则任务失败
  ifExpired: {
    type: String,
    enum: ['success', 'fail'],
    default: 'fail'
  },
  // 执行该任务的角色(主要用于不指定任务执行者的情况)
  roles:[{type: mongoose.Schema.Types.ObjectId, ref: 'role'}],
  // 指定的任务执行者
  users:[{type: mongoose.Schema.Types.ObjectId, ref: 'user'}],
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  }
});

const FlowTask = mongoose.model('flowTask', schema);

module.exports = { FlowTask };