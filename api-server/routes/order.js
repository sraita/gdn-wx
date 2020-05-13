const router = require('express-promise-router')()

const controller = require('../controllers/order');

router.route('/').post(controller.newOrder);
router.route('/list').post(controller.getOrders)
router.route('/:_id/info').get(controller.info);
router.route('/:_id')
  .put(controller.updateOrder)
  .delete(controller.deleteOrder);

router.route('/:_id/process').get(controller.orderProcess);

// 接单
router.route('/:_id/accept').post(controller.takingOrder);
// 匹配议员
router.route('/:_id/match-trans').post(controller.matchTranslator);
  
module.exports = router