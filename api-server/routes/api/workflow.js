var express = require('express');
var router = express.Router();

var controller = require('../../controllers/workflow');

router.route('/category/list').get(controller.getCategories);
router.route('/category/create').post(controller.createCategory);
router.route('/category/:_id').post(controller.updateCategory);
router.route('/category/:_id/remove').post(controller.removeCategory);

router.route('/').get(controller.getList).post(controller.create);
router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.removeById)

module.exports = router;