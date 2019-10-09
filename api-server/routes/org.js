var express = require('express');
var router = express.Router();

var controller = require('../controllers/org');


router.get('/', controller.getList);
router.post('/', controller.create);
router.get('/tree',controller.getTree);


module.exports = router;