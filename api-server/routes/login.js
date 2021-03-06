var express = require('express');
var router = express.Router();

var controller = require('../controllers/login');
var authController = require('../controllers/auth');

router.route('/login').post(controller.doLogin);
router.route('/getCaptcha').get(controller.getCaptcha);
router.route('/refresh_token').get(authController.refreshToken);
router.route('/userinfo').get(authController.getUserInfo);

module.exports = router;