import { get, post } from '../../utils/http';

const getCategories = (params => get('/api/workflow/category/list',params));
const createCategory = (params => post('/api/workflow/category/create', params));
const updateCategory = ((_id, params)  => post(`api/workflow/category/${_id}`, params));
const removeCategory = ((_id,params) => post(`/api/workflow/category/${_id}/remove`, params));

const getList = (params => get('/api/workflow',params));
const create = (params => post('/api/workflow', params));
const update = ((_id, params)  => post(`api/workflow/${_id}`, params));
const remove = ((_id,params) => post(`/api/workflow/${_id}/remove`, params));

const createForm = (params => post('/api/flow-form',params));
const designForm = ((_id, params) => post(`/api/flow-form/${_id}/design`,params));
const getFormList = (params => get('/api/flow-forms',params));

// 环节（节点）
const createNode = (params => post('/api/flow-node', params));
const updateNode = ((_id, params) => post(`/api/flow-node/${_id}/update`,params));
const removeNode = ((_id, params) => post(`/api/flow-node/${_id}/remove`, params));
const getNodeList = (params => get('/api/flow-nodes/', params));

const createTask = (params => post('/api/flow-task', params));
const updateTask = ((_id, params) => post(`/api/flow-task/${_id}/update`, params));
const removeTask = ((_id, params) => post(`/api/flow-task/${_id}/remove`, params));
const getNodeTasks = (params => get('/api/flow-tasks',params));
export default {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,

  getList,
  create,
  update,
  remove,

  // form
  createForm,
  designForm,
  getFormList,

  getNodeList,
  createNode,
  updateNode,
  removeNode,

  createTask,
  updateTask,
  removeTask,
  getNodeTasks
}