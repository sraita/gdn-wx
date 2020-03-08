const router = require('express-promise-router')();

const controller = require('../controllers/user');

router.route('/').get(function(req,res,next){
  res.send('/api/users');
});

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

module.exports = router;