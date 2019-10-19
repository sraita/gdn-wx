import { get, post } from '../../utils/http';

const create = (params => post('/api/role-group', params));
const getById = (id => get(`/api/role-group/${id}`));
const getList = (params => get('/api/role-group', params));
const getRoleTree = (params => get('/api/role-group/tree', params));
const getRoleGroupMenus = (id => get(`/api/role-group/${id}/menus`));
const getRoleGroupElementsByMenuId = ((id, menuId) => get(`/api/role-group/${id}/menus/${menuId}/elements`));
const getRoleGroupOptsByMenuId = ((id,menuId) => get(`/api/role-group/${id}/menus/${menuId}/opts`));
const updateRoleGroupAuth = ((id,params) => post(`/api/role-group/${id}/auth`, params));
export default {
  create,
  getById,
  getList,
  getRoleTree,
  getRoleGroupMenus,
  getRoleGroupElementsByMenuId,
  getRoleGroupOptsByMenuId,
  updateRoleGroupAuth
}