const router = require('express-promise-router')()

const controller = require('../controllers/menu');

router.route('/')
  .get(controller.index)
  .post(controller.newMenu);

router.route('/:_id')
  .put(controller.updateMenu)
  .delete(controller.deleteMenu);

module.exports = router