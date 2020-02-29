// 角色

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: String, // 角色名称
  code: String,
  desc: String,
  mutex: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role'}], // 指定该角色不能与那些角色共存
  single: { // 如果是 true, 其它角色不能与之共存
    type: Boolean,
    default: false
  },
  menus:[{ type: mongoose.Schema.Types.ObjectId, ref: 'menu'}],
});

// 设置索引
schema.index({ username: 1 });


schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const Role = mongoose.model('role', schema);

module.exports = { Role };