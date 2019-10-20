import { get, post } from '../../utils/http';

const create = (params => post('/api/role-group', params));
const update = ((id, params) => post(`/api/role-group/${id}`));
const remove = (id => post(`/api/role-group/${id}/remove`));
const getById = (id => get(`/api/role-group/${id}`));
const getList = (params => get('/api/role-group', params));
const getRoleTree = (params => get('/api/role-group/tree', params));
const getPublicRoleGroups = (params => get('/api/role-group/public', params));
const getRoleGroupMenus = (id => get(`/api/role-group/${id}/menus`));
const getRoleGroupElementsByMenuId = ((id, menuId) => get(`/api/role-group/${id}/menus/${menuId}/elements`));
const getRoleGroupOptsByMenuId = ((id,menuId) => get(`/api/role-group/${id}/menus/${menuId}/opts`));
const updateRoleGroupAuth = ((id,params) => post(`/api/role-group/${id}/auth`, params));
export default {
  create,
  update,
  remove,
  getById,
  getList,
  getRoleTree,
  getRoleGroupMenus,
  getRoleGroupElementsByMenuId,
  getRoleGroupOptsByMenuId,
  updateRoleGroupAuth,
  getPublicRoleGroups
}