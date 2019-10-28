import { get, post } from '../../utils/http';

const getCategories = (params => get('/api/workflow/category/list',params));
const createCategory = (params => post('/api/workflow/category/create', params));
const updateCategory = ((_id, params)  => post(`api/workflow/category/${_id}`, params));
const removeCategory = ((_id,params) => post(`/api/workflow/category/${_id}/remove`, params));

const getList = (params => get('/api/workflow',params));
const create = (params => post('/api/workflow', params));
const update = ((_id, params)  => post(`api/workflow/${_id}`, params));
const remove = ((_id,params) => post(`/api/workflow/${_id}/remove`, params));

export default {
  getCategories,
  createCategory,
  updateCategory,
  removeCategory,

  getList,
  create,
  update,
  remove
}