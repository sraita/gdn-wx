const Mongo = require('mongoose');
const bcrypt = require('bcrypt');

// Mongo.connect('mongodb://localhost:27017/class-demo', {
//   useNewUrlParser: true,
//   useCreateIndex: true
// });

const UserSchema = new Mongo.Schema({
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
  }
});

// 设置索引
UserSchema.index({ username: 1 });
/**
 * 实例方法，验证password，用于对api的调用进行认证
 */
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(
    password,
    this.password
  );
}

// 添加 mongoose 实例方法
UserSchema.methods.findByUsername = function (username) {
  return this.model('user').find({ username: username });
}

UserSchema.set('toObject', { getters: true, virtuals: true }); // toObject时能够转换
UserSchema.set('toJSON', { getters: true, virtuals: true }); // toJson时能够转换

const User = Mongo.model('user', UserSchema);

module.exports = { User };