var express = require('express');
var router = express.Router();

var controller = require('../../controllers/opt');

router.route('/').post(controller.create);
router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.removeById);
router.route('/menu-subs/:menuId').get(controller.getListByMenuId);

module.exports = router;