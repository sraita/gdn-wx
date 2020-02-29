var jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

/**
 * 生成Token
 * @param {*} userId 
 * @param {*} expire Token 有效时长
 */
const generateToken = function (userId, expire) {
  const token_expire = Math.floor(Date.now() / 1000) + expire;
  const token = jwt.sign({
    exp: token_expire,
    id: String(userId)
  }, SECRET);
  return token;
}

const verifyToken = function (req,res,next) {
  try {
    console.log(req.headers.authorization)
    const raw = String(req.headers.authorization.split(' ').pop());
    const {id} = jwt.verify(raw, SECRET);
    return id;
  } catch (err) {
    if (err.name == 'TokenExpiredError') {
      return new Error('Token 已过期')
    } else {
      return new Error('Token 无效')
    }
  }
}

module.exports = {
  generateToken,
  verifyToken
}