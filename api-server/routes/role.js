var express = require('express');
var router = express.Router();

var controller = require('../controllers/role');

router.route('/').post(controller.create);

module.exports = router;