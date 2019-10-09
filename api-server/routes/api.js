
var express = require('express');
var router = express.Router();

var baseAuth = require('../controllers/auth');
var userRouter = require('./user');

/* GET home page. */
router.all('/*', baseAuth);

router.use('/user',userRouter);

module.exports = router;