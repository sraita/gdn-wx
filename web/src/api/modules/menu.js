import { get, post } from '../../utils/http';

const list = (params => get('/api/menu',params));
const create = (params => post('/api/menu', params));
const update = ((id,params) => post(`/api/menu/${id}`, params));
const remove = (id => post(`/api/menu/${id}/remove`));

export default {
  list,
  create,
  update,
  remove,
}