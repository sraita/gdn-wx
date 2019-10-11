var jwt = require('jsonwebtoken');
var svgCaptcha = require('svg-captcha');

var { User } = require('../models/user');
const { SECRET } = require('../config');

const getCaptcha = function (req, res) {
  var captcha = svgCaptcha.create({
    inverse: false, // 翻转颜色 
    fontSize: 48, // 字体大小 
    noise: 2, // 噪声线条数 
    color: true,
    background: '#dcdefd',
    width: 100, // 宽度 
    height: 40, // 高度 
    size: 4,// 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
  });
  // 保存到session,忽略大小写 
  req.session = captcha.text.toLowerCase();
  console.log(req.session); //0xtg 生成的验证码
  //保存到cookie 方便前端调用验证
  res.cookie('captcha', req.session);
  res.setHeader('Content-Type', 'image/svg+xml');
  res.write(String(captcha.data));
  res.end();
}

const doLogin = async function (req, res) {
  console.log(req.body);
  const user = await User.findOne({
    username: req.body.username
  })
  if (!user) {
    return res.status(422).send({
      name: 'UserNotFound',
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
      name: 'PasswordInvild',
      message: '密码无效'
    })
  }

  /* 
    生成 token
    jwt.sign() 接受两个参数，一个是传入的对象，一个是自定义的密钥
  */
  const token = jwt.sign({ 
    exp: Math.floor(Date.now() / 1000) + (60*60), // 过期时间为60分钟
    id: String(user._id)
  }, SECRET);
  res.json({
    status: 'ok',
    data:{
      user,
      token
    }
  })
}

module.exports = {
  doLogin,
  getCaptcha
};