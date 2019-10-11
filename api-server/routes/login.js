var express = require('express');
var router = express.Router();

var controller = require('../controllers/login');

router.route('/login').post(controller.doLogin);
router.route('/getCaptcha').get(controller.getCaptcha);

module.exports = router;