var express = require('express');
var router = express.Router();

var controller = require('../../controllers/role');

router.route('/').post(controller.create);
router.route('/:_id').get(controller.getById);
router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.removeById);
router.route('/:_id/menus').get(controller.getRoleMenus);
router.route('/:_id/menus/:menuId/elements').get(controller.getRoleElementsByMenuId);
router.route('/:_id/menus/:menuId/opts').get(controller.getRoleOptsByMenuId);
router.route('/:_id/auth').post(controller.updateRoleAuth);

module.exports = router;