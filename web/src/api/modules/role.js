import { get, post } from '../../utils/http';

const create = (params => post('/api/role', params));
const update = ((id,params) => post(`/api/role/${id}`,params));
const remove = (id => post(`/api/role/${id}/remove`));
const getRoles = (params => get('/api/roles',params));
const updateRoleAuth = ((id, params) => post(`/api/role/${id}/auth`, params));

export default {
  create,
  update,
  remove,
  getRoles,
  updateRoleAuth
}