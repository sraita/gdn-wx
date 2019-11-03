import { get, post } from '../../utils/http';

const create = (params => post('/api/user', params));
const update = ((_id,params) => post(`/api/user/${_id}`, params));
const remove = ((_id, params) => post(`/api/user/${_id}/remove`, params));
const changePassword = ((_id, params) => post(`/api/user/${_id}/change-pass`, params));
const getList = (params => get('/api/users',params));
export default {
  create,
  update,
  remove,
  getList,
  changePassword
}