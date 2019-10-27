import { get, post } from '../../utils/http';

const getList = (params => get('/api/user',params));
const getMenus = (_id => get(`/api/user/${_id}/menu`));
export default {
  getList,
  getMenus
}