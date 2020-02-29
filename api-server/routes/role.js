const router = require('express-promise-router')()

const controller = require('../controllers/role');

router.route('/')
  .get(controller.getRoles)
  .post(controller.addRole);

router.route('/:_id')
  .get(controller.getRole)
  .put(controller.updateRole)
  .delete(controller.deleteRole);

router.route('/:_id/routes')
  .get(controller.getRoleRoutes);

module.exports = router