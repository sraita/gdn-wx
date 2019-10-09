var jwt = require('jsonwebtoken');
var { User } = require('../models/user');
const { SECRET } = require('../config');

const doLogin = async function (req, res) {
  console.log(req.body);
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      message: '用户名不存在'
    })
  }

  // bcrypt.compareSync 解密匹配，返回 boolean 值
  const isPasswordValid = require('bcrypt').compareSync(
    req.body.password,
    user.password
  )
  if (!isPasswordValid) {
    return res.status(422).send({
      message: '密码无效'
    })
  }

  /* 
    生成 token
    jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
  */
  const token = jwt.sign({ id: String(user._id) }, SECRET)
  res.send({
    user,
    token
  })
}

module.exports = {
  doLogin
};