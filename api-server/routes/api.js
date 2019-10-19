
var express = require('express');
var router = express.Router();

var authController = require('../controllers/auth');

var roleGroupRouter = require('./role-group');
var roleRouter = require('./role');
var userRouter = require('./user');
var orgRouter = require('./org');
var customRouter = require('./custom');
var menuRouter = require('./menu');
var elementRouter = require('./element');
var optRouter = require('./opt');

/* GET home page. */
router.all('/*', authController.baseAuth);
router.use('/role-group', roleGroupRouter);
router.use('/role', roleRouter);
router.use('/menu',menuRouter);
router.use('/element', elementRouter);
router.use('/opt', optRouter);
router.use('/user',userRouter);
router.use('/org', orgRouter);
router.use('/custom', customRouter);

module.exports = router;