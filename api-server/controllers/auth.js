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
      return res.status(401).json({
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
      // if (user.status !== 1) {
      //   return res.send({
      //     status: 'error',
      //     name: 'UserWasDisable',
      //     message: '用户被禁用'
      //   });
      // }
      // 验证接口访问权限

      next();
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: 'error',
        code: err.name === 'TokenExpiredError' ? 40101 : 40102,
        name: err.name,
        message: err.message
      });
    }
  }
}

const refreshToken = function (req, res, next) {
    const raw = req.query.token;
    // 解密 token 获取对应的 id
    try {
      const { id } = jwt.verify(raw, SECRET);
      const token_expire = Math.floor(Date.now() / 1000) + (60 * 60);// token 过期时间为60分钟
      const refresh_token_expire = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // refresh_token 过期时间为7 天
      const token = jwt.sign({
        exp: token_expire, 
        id: id
      }, SECRET);
      const refresh_token = jwt.sign({
        exp: refresh_token_expire,
        id:id
      }, SECRET);
      return res.json({
        status: 'success',
        data: {
          token: token,
          expire_in: 3600,
          refresh_token
        }
      })
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        status: 'error',
        name: err.name,
        message: err.message
      });
    }
}
module.exports = {
  baseAuth,
  refreshToken
};