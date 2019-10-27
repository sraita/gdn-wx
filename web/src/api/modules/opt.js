import { get, post } from '../../utils/http';

const create = (params => post('/api/opt', params));
const update = ((id, params) => post(`/api/opt/${id}`, params));
const remove = (id => post(`/api/opt/${id}/remove`));
const getListByMenuId = (menuId => get(`/api/opt/menu-subs/${menuId}`))

export default {
  create,
  update,
  remove,
  getListByMenuId
}