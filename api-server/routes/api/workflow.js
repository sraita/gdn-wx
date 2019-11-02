var express = require('express');
var router = express.Router();

var controller = require('../../controllers/workflow');
var formController = require('../../controllers/flow/form');
var nodeController = require('../../controllers/flow/node');
var taskController = require('../../controllers/flow/task');

router.route('/category/list').get(controller.getCategories);
router.route('/category/create').post(controller.createCategory);
router.route('/category/:_id').post(controller.updateCategory);
router.route('/category/:_id/remove').post(controller.removeCategory);

// router.route('/?').get(function (req, res) {
//   res.json({
//     create_flow_category: { method: 'post', href: '/api/workflow/category' },
//     update_flow_category: { method: 'post', href: '/api/workflow/category/{_id}/update' },
//     remove_flow_category: { method: 'post', href: '/api/workflow/category/{_id}/remove' },
//     get_flow_category: { method: 'get', href: '/api/workflow/category/{_id}' },
//     get_flow_categories: { method: 'get', href: '/api/workflow/categories' },

//     create_flow: { method: 'post', href: '/api/workflow', params: 'category, ...entity' },
//     update_flow: { method: 'post', href: '/api/workflow/{_id}/update' },
//     remove_flow: { method: 'post', href: '/api/workflow/{_id}/remove' },
//     get_flow: { method: 'get', href: '/api/workflow/{_id}' },
//     get_flows: { method: 'get', href: '/api/workflows?category={category}&page={page}&limit={limit}' },

//     create_flow_form: { method: 'post', href: '/api/workflow/form/', params: "flow, ...entity" },
//     update_flow_form: { method: 'post', href: '/api/workflow/form/{_id}/update' },
//     remove_flow_form: { method: 'post', href: '/api/workflow/form/{_id}/remove' },
//     get_flow_forms: { method: 'get', href: '/api/workflow/forms?flow={flow}' },

//     create_flow_node: { method: 'post', href: '/api/workflow/node', params: 'flow, ...entity' },
//     update_flow_node: { method: 'post', href: '/api/workflow/node/{_id}' },
//     remove_flow_node: { method: 'post', href: '/api/workflow/node/{_id}' },
//     get_flow_nodes: { method: 'get', href: '/api/workflow/nodes?flow={flow}' },

//     create_flow_task: { method: 'post', href: '/api/workflow/task', params: 'flow, node, ...entity' },
//     update_flow_task: { method: 'post', href: '/api/workflow/task/{_id}' },
//     remove_flow_task: { method: 'post', href: '/api/workflow/task/{_id}' },
//     get_flow_tasks: { method: 'get', href: '/api/workflow/tasks?node={node}' }
//   });
// })

router.route('/').get(controller.getList).post(controller.create);
router.route('/:_id').post(controller.updateById);
router.route('/:_id/remove').post(controller.removeById)

// 表单
router.route('/form/create').post(formController.create);
router.route('/form/:_id/update').post(formController.updateById);
router.route('/form/:_id/remove').post(formController.removeById);
router.route('/form/:_id/design').post(formController.design);
router.route('/:_id/form').get(formController.getList);

// 环节（节点）



module.exports = router;