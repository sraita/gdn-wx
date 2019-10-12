import {get,post} from '../../utils/http';
import store from '../../store';

const doLogin = (params => post('/auth/login', params));
const logout = (()=>{
  store.dispatch('auth/clearToken').then(res=>{

  });
}); 

const getUserInfo = (id => get('/api/user/',{id}));
export default {
  doLogin,
  logout,
  getUserInfo
}