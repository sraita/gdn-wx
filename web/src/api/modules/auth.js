import {get,post} from '../../utils/http';
import store from '../../store';

const doLogin = (params => post('/auth/login', params));
const logout = (()=>{
  store.dispatch('auth/clearToken').then(res=>{

  });
}); 

const getUserInfo = (params => get('/auth/userinfo', params));
const getMenus = (params => get('/auth/user-menus',params));
export default {
  doLogin,
  logout,
  getUserInfo,
  getMenus,
}