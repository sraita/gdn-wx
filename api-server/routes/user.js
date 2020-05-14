const router = require('express-promise-router')();

const controller = require('../controllers/user');

router.route('/')
  .get(controller.index);

router.route('/:_id/routes')
  .get(controller.userRoutes);

router.route('/login')
  .post(controller.login);

router.route('/wx-login')
  .post(controller.wxLogin);

router.route('/info')
  .get(controller.info);
  
router.route('/logout')
  .post(controller.logout);

// 添加用户管理员
router.route("/add")
  .post(controller.addUser);

// 更新用户信息
router.route('/:_id/update')
  .post(controller.updateUser);

router.route('/:_id/orders')
  .get(controller.getUserOrders);

module.exports = router;