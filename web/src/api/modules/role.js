import { get, post } from '../../utils/http';

const create = (params => post('/api/role', params));
const update = ((id,params) => post(`/api/role/${id}`));
const remove = (id => post(`/api/role/${id}/remove`));
const getById = (id => get(`/api/role/${id}`));
const getRoleMenus = (id => get(`/api/role/${id}/menus`));
const getRoleElementsByMenuId = ((id, menuId) => get(`/api/role/${id}/menus/${menuId}/elements`));
const getRoleOptsByMenuId = ((id, menuId) => get(`/api/role/${id}/menus/${menuId}/opts`));
const updateRoleAuth = ((id, params) => post(`/api/role/${id}/auth`, params));

export default {
  create,
  update,
  remove,
  getById,
  getRoleMenus,
  getRoleElementsByMenuId,
  getRoleOptsByMenuId,
  updateRoleAuth
}