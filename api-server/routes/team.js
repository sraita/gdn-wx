const router = require('express-promise-router')()

const controller = require('../controllers/team');
const { parseToken } = require('../helpers/routeHelpers');

router.route('/')
  .get(controller.index)
  .post(parseToken(),controller.newTeam);

router.route('/:_id')
  .get(controller.getTeam)
  .put(controller.updateTeam)
  .delete(controller.deleteTeam);

router.route('/:_id/qr-image')
  .get(controller.getQrImage)

  router.route('/:_id/members')
  .get(controller.getMembers)



module.exports = router