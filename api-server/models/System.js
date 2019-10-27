const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    default: '多租户管理系统',
    required: true,
  },
  logo: {
    type:String,
    default: '/logo.png'
  },
  remark: {
    type: String,
    default: '基于Vue.js + express + MongoDB 的多租户管理系统'
  },
  initialized:{
    type: Boolean,
    default: false
  }
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const System = mongoose.model('system', schema);

module.exports = { System };