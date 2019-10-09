const url = require('url');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');
const { User } = require('../models/user');
const {PUBLIC_ROUTES} = require('../config');


const baseAuth = function (req, res, next) {
  const {pathname, query} = url.parse(req.path);
  console.log(req.path);
  // 检查即将访问的接口是否是公共接口
  if (PUBLIC_ROUTES.includes(pathname)) {
    next();
  } else {
    // 判断用户是否登录
    if (!req.headers.authorization) {
      return res.json({
        status:'error',
        message: "请先登录"
      });
    }
    // 判断 token 是否正确并在有效期内

    const raw = String(req.headers.authorization.split(' ').pop());

    console.log(raw)
    // 解密 token 获取对应的 id
    try {
      const { id } = jwt.verify(raw, SECRET);
      req.body.userId = id;

      // 验证用户权限 
      const user = User.findById(id);
      
      if (!user) {
        return res.send({
          status: 'error',
          name: 'UserNotFound',
          message: '用户不存在'
        });
      }
      if (user.status !== 1) {
        return res.send({
          status: 'error',
          name: 'UserWasDisable',
          message: '用户被禁用'
        });
      }
      // 验证接口访问权限

      next();
    } catch (err) {
      console.log(err);
      return res.json({
        status: 'error',
        name: err.name,
        message: err.message
      });
    }
  }
}

module.exports = baseAuth;