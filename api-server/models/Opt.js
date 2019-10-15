const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: Number,
  sort: Number,
  menu: {type: mongoose.Schema.Types.ObjectId, ref: 'menu'},
  apiName: String,
  apiPath: String
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Opt = mongoose.model('opt', schema);

module.exports = { Opt };