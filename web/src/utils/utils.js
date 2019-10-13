
import { get } from './http';

export default {
  // 获取token
  getLoginToken() {
    const token = localStorage.getItem('loginToken')
    return token
  },
  // 获取 refresh_token
  getRefreshToken () {
    const token = localStorage.getItem('refreshToken');
    return token
  },
}