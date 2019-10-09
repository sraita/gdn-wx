var express = require('express');
var router = express.Router();

var controller = require('../controllers/login');

router.route('/').post(controller.doLogin);

module.exports = router;