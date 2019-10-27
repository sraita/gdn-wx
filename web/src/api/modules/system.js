import { get, post } from '../../utils/http';

const checkSysInitState = (params => get('/system/init-state', params));
const verifySysPass = (params => post('/system/verify-pass',params));
const initSysResources = (params => get('/system/init-resource', params));
const initSysRoles = (params => get('/system/init-role', params));
const initSysAdmin = (params => post('/system/init-admin', params));

export default {
  checkSysInitState,
  verifySysPass,
  initSysResources,
  initSysRoles,
  initSysAdmin
}