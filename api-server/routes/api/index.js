
var express = require('express');
var router = express.Router();

var authController = require('../../controllers/auth');

var roleController = require('../../controllers/role');

var userRouter = require('../user');
var orgRouter = require('./org');
var customRouter = require('./custom');
var menuRouter = require('./menu');

/* GET home page. */
// router.all('/*', authController.baseAuth);
router.use('/menu',menuRouter);
router.use('/user',userRouter);
router.use('/org', orgRouter);
router.use('/custom', customRouter);

router.route('/roles').get(roleController.getRoles);
router.route('/role').post(roleController.create);
router.route('/role/:_id').post(roleController.updateById);
router.route('/role/:_id/remove').post(roleController.removeById);
router.route('/role/:_id/auth').post(roleController.updateRoleAuth);

module.exports = router;