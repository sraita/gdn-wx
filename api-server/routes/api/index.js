
var express = require('express');
var router = express.Router();

var authController = require('../../controllers/auth');

var roleController = require('../../controllers/role');
var userController = require('../../controllers/user');
var customController = require('../../controllers/custom');

var orgRouter = require('./org');
var customRouter = require('./custom');
var menuRouter = require('./menu');

/* GET home page. */
// router.all('/*', authController.baseAuth);
router.use('/menu',menuRouter);

router.use('/org', orgRouter);
router.use('/custom', customRouter);

router.route('/roles').get(roleController.getRoles);
router.route('/role').post(roleController.create);
router.route('/role/:_id').post(roleController.updateById);
router.route('/role/:_id/remove').post(roleController.removeById);
router.route('/role/:_id/auth').post(roleController.updateRoleAuth);

// User
router.route('/users').get(userController.getUsers);
router.route('/user').post(userController.create);
router.route('/user/:_id').get(userController.getById);
router.route('/user/:_id').post(userController.updateById);
router.route('/user/:_id/remove').post(userController.removeById);
router.route('/user/:_id/change-pass').post(userController.changePass);

// Custom
router.route('/customs').get(customController.getList);

module.exports = router;