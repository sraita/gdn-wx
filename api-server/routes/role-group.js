var express = require('express');
var router = express.Router();

var controller = require('../controllers/roleGroup');

router.route('/')
  .post(controller.create)
  .get(controller.getList);
router.route('/tree').get(controller.getRoleTree);
router.route('/:_id').get(controller.getById);
router.route('/:_id/menus').get(controller.getRoleGroupMenus);
router.route('/:_id/menus/:menuId/elements').get(controller.getRoleGroupElementsByMenuId);
router.route('/:_id/menus/:menuId/opts').get(controller.getRoleGroupOptsByMenuId);
router.route('/:_id/auth').post(controller.updateRoleGroupAuth);

module.exports = router;