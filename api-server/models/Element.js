const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type:Number,
    default: 1 // 1 - 启用, 0 - 禁用
  },
  sort: Number,
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'menu',required:true }
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Element = mongoose.model('opt', schema);

module.exports = { Element };