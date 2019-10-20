import { get, post } from '../../utils/http';

const getRoleGroups = ((_id,params) => get(`/api/org/${_id}/role-group`, params));
const createRoleGroup = ((id, params) => post(`/api/org/${id}/role-group`,params));

const getRoles = ((_id, params) => get(`/api/org/${_id}/role`, params));
const createRole = ((id, params) => post(`/api/org/${id}/role`, params));

const getRoleGroupMenuList = (id => get(`/api/org/${id}/role-group/menu`));
export default {
  createRoleGroup,
  getRoleGroups,

  getRoles,
  createRole,

  getRoleGroupMenuList
}