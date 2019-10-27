var express = require('express');
var router = express.Router();

var controller = require('../../controllers/org');
var departmentRouter = require('./department');


router.route('/:_id/role-group')
  .get(controller.getRoleGroups)
  .post(controller.createRoleGroup);

router.route('/:_id/role')
  .get(controller.getRoles)
  .post(controller.createRole);

router.get('/:_id/role-group/menu', controller.getRoleGroupMenuList);
// router.route('/:_id/role-group/menu/:menuId/element', controller.getRoleGroupMenuList);
// router.route('/:_id/role-group/menu/:menuId/opt', controller.getRoleGroupMenuList);

router.use('/:_id/department',departmentRouter);

// Member
router.route('/:_id/member/').post(controller.addMember);
router.route('/:_id/member/:departmentId').get(controller.getMembers);
module.exports = router;