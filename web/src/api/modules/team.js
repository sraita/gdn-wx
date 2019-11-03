import { get, post } from '../../utils/http';

const getList = (params => get('/api/teams', params));
const create = (params => post('/api/team', params));
const update = ((id, params) => post(`/api/team/${id}`,params))
const remove = (id=> post(`/api/team/${id}/remove`));

export default {
  getList,
  create,
  update,
  remove
}