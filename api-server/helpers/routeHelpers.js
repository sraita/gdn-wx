const jwt = require('jsonwebtoken');

module.exports = {
  parseToken: () => {
    return (req, res, next) => {
      try {
        const raw = String(req.headers.authorization.split(' ').pop());
        const { id } = jwt.verify(raw, CONFIG.SECRET);
        req.userId = id;
        console.log('xxxx==',id)
        next();
      } catch (err) {
        console.log(err);
        if (err.name == 'TokenExpiredError') {
          res.json({
            status: 'error',
            code: 'token_expired',
            message: 'Token已过期'
          });
        } else {
          res.json({
            status: 'error',
            code: 'token_not_usefil',
            message:'Token 无效'
          });
        }
      }
    }
  }
}