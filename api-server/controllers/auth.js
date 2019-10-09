const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

const baseAuth = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).send('no authorization！');
  }

  const raw = String(req.headers.authorization.split(' ').pop());

  console.log(raw)
  // 解密 token 获取对应的 id
  const { id } = jwt.verify(raw, SECRET)
  req.body.userId = id;
  next();
}

module.exports = baseAuth;