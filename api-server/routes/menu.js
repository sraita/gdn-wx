var express = require('express');
var router = express.Router();

var controller = require('../controllers/menu');

router.route('/')
  .get(controller.getList)
  .post(controller.create);

router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.remove);

module.exports = router;