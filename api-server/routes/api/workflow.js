var express = require('express');
var router = express.Router();

var controller = require('../../controllers/workflow');
var formController = require('../../controllers/flow/form');

router.route('/category/list').get(controller.getCategories);
router.route('/category/create').post(controller.createCategory);
router.route('/category/:_id').post(controller.updateCategory);
router.route('/category/:_id/remove').post(controller.removeCategory);

router.route('/').get(controller.getList).post(controller.create);
router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.removeById)

// 表单
router.route('/form/create').post(formController.create);
router.route('/form/:_id/update').post(formController.updateById);
router.route('/form/:_id/remove').post(formController.removeById);
router.route('/form/:_id/design').post(formController.design);
router.route('/:_id/form').get(formController.getList);
module.exports = router;