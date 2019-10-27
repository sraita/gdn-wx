var express = require('express');
var router = express.Router();

var controller = require('../../controllers/department');

router.route('/').get(controller.getList);
router.route('/').post(controller.create);

router.route('/:_id/')
  .get(controller.getById)
  .post(controller.updateById)

router.route('/:_id/delete').get(controller.removeById);

module.exports = router;