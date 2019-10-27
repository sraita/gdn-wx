var express = require('express');
var router = express.Router();

var controller = require('../controllers/system');

// 系统初始化
router.route('/init-resource').get(controller.initSysResources);
router.route('/init-role').get(controller.initSysRoles);
router.route('/init-admin').post(controller.initSysAdmin);
router.route('/init-state').get(controller.checkSysInitState);
router.route('/verify-pass').post(controller.verifySysPass);

module.exports = router;