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

module.exports = {
  generateToken
}