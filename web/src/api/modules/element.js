import { get, post } from '../../utils/http';

const create = (params => post('/api/element', params));
const update = ((id, params) => post(`/api/element/${id}`, params));
const remove = (id => post(`/api/element/${id}/remove`));
const getListByMenuId = (menuId => get(`/api/element/menu-subs/${menuId}`))

export default {
  create,
  update,
  remove,
  getListByMenuId
}