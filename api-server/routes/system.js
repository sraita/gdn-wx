const router = require('express-promise-router')()

const controller = require('../controllers/system');

router.route('/init')
  .get(controller.initMenus)
  .post(controller.initMenus);

module.exports = router