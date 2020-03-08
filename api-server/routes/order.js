const router = require('express-promise-router')()

const orderController = require('../controllers/order');

router.route('/')
  .get(orderController.getOrders)
  .post(orderController.newOrder);

router.route('/:_id')
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);
  
module.exports = router