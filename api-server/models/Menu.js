const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  parent: {type: mongoose.Schema.Types.ObjectId, ref: 'menu', default: null}, // 上级菜单
  status: Number,
  sort: Number,
  icon: {
    type: String,
    default: 'iconfont icon-apps'
  },
  routerName: String,
  routerPath: String,
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'element'}],
  opts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'opt'}],
});

// 设置索引
schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Menu = mongoose.model('menu', schema);

module.exports = { Menu };