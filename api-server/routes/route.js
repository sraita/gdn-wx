const router = require('express-promise-router')()

const controller = require('../controllers/role');

router.route('/')
  .get(controller.getRoutes);

module.exports = router