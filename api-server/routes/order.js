const router = require('express-promise-router')()

const controller = require('../controllers/order');

router.route('/')
  .get(controller.getOrders)
  .post(controller.newOrder);

router.route('/:_id')
  .get(controller.info)
  .put(controller.updateOrder)
  .delete(controller.deleteOrder);

router.route('/:_id/process').get(controller.orderProcess);
  
module.exports = router