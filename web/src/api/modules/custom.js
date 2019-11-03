import { get, post } from '../../utils/http';

const getList = (params => get('/api/customs', params));
const create = (params => post('/api/custom', params));
const update = ((id, params, query) => post(`/api/custom/${id}`,params))
const remove = (id=> get(`/api/custom/${id}/delete`));

export default {
  getList,
  create,
  update,
  remove
}