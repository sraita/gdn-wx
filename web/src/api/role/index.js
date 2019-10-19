import { get, post } from '../../utils/http';

const create = (params => post('/api/role', params));

export default {
  create,
}