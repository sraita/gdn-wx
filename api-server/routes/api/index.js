
var express = require('express');
var router = express.Router();

var authController = require('../../controllers/auth');

var flowFormController = require('../../controllers/flow/form');
var flowNodeController = require('../../controllers/flow/node');
var flowTaskController = require('../../controllers/flow/task');

var roleGroupRouter = require('./role-group');
var roleRouter = require('./role');
var userRouter = require('../user');
var orgRouter = require('./org');
var customRouter = require('./custom');
var menuRouter = require('./menu');
var elementRouter = require('./element');
var optRouter = require('./opt');
var workflowRouter = require('./workflow');

/* GET home page. */
// router.all('/*', authController.baseAuth);
router.use('/role-group', roleGroupRouter);
router.use('/role', roleRouter);
router.use('/menu',menuRouter);
router.use('/element', elementRouter);
router.use('/opt', optRouter);
router.use('/user',userRouter);
router.use('/org', orgRouter);
router.use('/custom', customRouter);
router.use('/workflow', workflowRouter);


// flow Form
router.route('/flow-form').post(flowFormController.create);
router.route('/flow-form/:_id/update').post(flowFormController.updateById);
router.route('/flow-form/:_id/remove').post(flowFormController.removeById);
router.route('/flow-form/:_id/design').post(flowFormController.design);
router.route('/flow-forms').get(flowFormController.getList);

// flow Node
router.route('/flow-node').post(flowNodeController.create);
router.route('/flow-node/:_id/update').post(flowNodeController.updateById);
router.route('/flow-node/:_id/remove').post(flowNodeController.removeById);
router.route('/flow-nodes').get(flowNodeController.getList);

// flow Task
router.route('/flow-task').post(flowTaskController.create);
router.route('/flow-tasks').get(flowTaskController.getTasksByNodeId);

module.exports = router;