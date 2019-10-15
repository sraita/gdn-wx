const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Mongo.connect('mongodb://localhost:27017/class-demo', {
//   useNewUrlParser: true,
//   useCreateIndex: true
// });

const schema = new mongoose.Schema({
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
  status: Number, // 0:禁用,1:启用
  createAt: Date,
  orgs: [{type: mongoose.Schema.Types.ObjectId, ref: 'org'}], // 所属机构或部门
  rootOrg: { type: mongoose.Schema.Types.ObjectId, ref: 'org'}, // 顶级机构
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