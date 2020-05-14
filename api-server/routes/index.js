var express = require('express');
var router = express.Router();

const translatorRouter = require('./module/translator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('高德纳系统 API ');
});

router.use('/api/translators', translatorRouter);

module.exports = router;
