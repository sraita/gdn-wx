
var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');

var userRouter = require('./user');
var orgRouter = require('./org');
var customRouter = require('./custom');
var menuRouter = require('./menu');
var elementRouter = require('./element');

/* GET home page. */
router.all('/*', authController.baseAuth);
router.use('/menu',menuRouter);
router.use('/element', elementRouter);
router.use('/user',userRouter);
router.use('/org', orgRouter);
router.use('/custom', customRouter);

module.exports = router;