var express = require('express');
var router = express.Router();

var controller = require('../controllers/org');


router.route('/:_id/role-group')
  .get(controller.getRoleGroups)
  .post(controller.createRoleGroup);

router.route('/:_id/role')
  .get(controller.getRoles)
  .post(controller.createRole);

router.get('/:_id/role-group/menu', controller.getRoleGroupMenuList);
// router.route('/:_id/role-group/menu/:menuId/element', controller.getRoleGroupMenuList);
// router.route('/:_id/role-group/menu/:menuId/opt', controller.getRoleGroupMenuList);

module.exports = router;