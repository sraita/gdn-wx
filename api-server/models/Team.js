const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  // 名称
  name: {
    type: String,
    required: true
  }, 
  logo: String,
  // 状态. 0: 禁用, 1:启用
  status:{
    type:Number,
    default: 1
  }, 
  manager: {type: mongoose.Types.ObjectId, ref: 'user'}, // 管理员
  // 备注说明
  remark:{
    type: String,
    default:'<无>'
  },
  createAt: Date
});

// 设置索引
schema.index({ name: 1 });
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换


const Team = mongoose.model('team', schema);

module.exports = { Team };