const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const schema = new mongoose.Schema({
  openid: String,
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    // 设置 bcrypt 加密
    set(val) {
      console.log(val);
      return require('bcrypt').hashSync(val, 10)
    }
  },
  avatar: {
    type: String
  },
  name: String, // 真实姓名
  mobile: Number,
  tel: String,
  email: String,
  status: Number, // 0:禁用,1:启用
  createAt: Date,
  wechat: {type: mongoose.Schema.Types.ObjectId, ref: 'wechat'}, // 微信账号绑定关系
  team: { type: mongoose.Schema.Types.ObjectId, ref:'team'}, // 所属团队
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role'}], // 可用角色列表
});

// 设置索引
schema.index({ username: 1 });
/**
 * 实例方法，验证password，用于对api的调用进行认证
 */
schema.methods.validPassword = function (password) {
  return bcrypt.compareSync(
    password,
    this.password
  );
}

// 添加 mongoose 实例方法
schema.methods.findByUsername = function (username) {
  return this.model('user').find({ username: username });
}

schema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
schema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const User = mongoose.model('user', schema);

module.exports = { User };