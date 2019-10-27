import { get, post } from '../../utils/http';

const getRoleGroups = ((_id,params) => get(`/api/org/${_id}/role-group`, params));
const createRoleGroup = ((id, params) => post(`/api/org/${id}/role-group`,params));

const getRoles = ((_id, params) => get(`/api/org/${_id}/role`, params));
const createRole = ((id, params) => post(`/api/org/${id}/role`, params));

const getRoleGroupMenuList = (id => get(`/api/org/${id}/role-group/menu`));

// 机构 -> 部门管理
const addDepartment = ((_id,params) => post(`/api/org/${_id}/department`,params));
const getDepartments = (_id => get(`/api/org/${_id}/department`));

// 机构 -> 员工管理
// Member
const addMember = ((_id, params) => post(`/api/org/${_id}/member`,params));
const getMembers = ((_id, departmentId) => get(`/api/org/${_id}/member/${departmentId}`));
export default {
  createRoleGroup,
  getRoleGroups,

  getRoles,
  createRole,

  getRoleGroupMenuList,

  addDepartment,
  getDepartments,

  // 员工管理
  addMember,
  getMembers
}