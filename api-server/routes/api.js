
var express = require('express');
var router = express.Router();

var baseAuth = require('../controllers/auth');

var userRouter = require('./user');
var orgRouter = require('./org');

/* GET home page. */
router.all('/*', baseAuth);

router.use('/user',userRouter);
router.use('/org', orgRouter);

module.exports = router;