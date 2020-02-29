var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('高德纳系统 API ');
});

module.exports = router;
